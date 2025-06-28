import sql from "@/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server"
import OpenAI from "openai";

export const maxDuration = 30

const openai = new OpenAI({
    baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
    apiKey: process.env.GEMINI_API_KEY
});

export async function POST(req) {
    try {
        const { messages, userid } = await req.json()
        // Convert messages to a format suitable for your Gemma model
        const systemPrompt = `You are an AI writing assistant. The user will provide you with a document and a request. 
    Please provide an improved version of the ENTIRE document based on their request. If document has nothing you can behave as an AI to generate random stuffs.
    Understand what the user is asking. They might ask you to generate or improve. Understand the requirement.
    If there is any data you must edit it. Or append stuffs. Never miss the original data if any.
    Always return in html format as I will be pasting it to editor. Dont keep code in backticks. I just want the html nothing other than that.
    Return the whole changed document in document key in your response. Please create proper formatting with new lines and always take input in html and output html
    
    Important: Return the complete improved document, not just suggestions or explanations.
    Focus on making substantial improvements while maintaining the original intent. Dont write anything else than the document just return the improvides document`

        // Format the conversation for your model
        let conversation = []

        conversation.push({
            role: 'system',
            content: systemPrompt
        })

        messages.forEach((message) => {
            if (message.role === "user") {
                conversation.push({
                    role: 'user',
                    content: message.content
                })
            } else {
                conversation.push({
                    role: 'assistant',
                    content: message.content
                })
            }
        })


        // Make request to your Gemma2:9b endpoint
        // const response = await fetch("https://allowed-meerkat-coherent.ngrok-free.app/api/chat", {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json",
        //         // Add any authentication headers if needed
        //         // "Authorization": "Bearer your-api-key"
        //     },
        //     body: JSON.stringify({
        //         system,
        //         messages: conversation,
        //         max_tokens: 1000,
        //         temperature: 0.7,
        //         stream: true, // Enable streaming if your endpoint supports it
        //     }),
        // })

        //before getting response check if user has enough credits
        let user = await sql.from('credits').select('*').eq('user_id', userid)
        console.log(user.data[0].chat_credits)
        //if there is no user create a user with 30 chat credits for this month
        if (user.data.length === 0) {
            await sql.from('credits').insert({
                user_id: userid,
                chat_credits: {
                    credits: 30,
                    month: new Date().getMonth(),
                    year: new Date().getFullYear()
                }
            })
        }
        // if there is no credit obj for month update the user credit month and set credist to 30
        else if (user.data[0].chat_credits.month !== new Date().getMonth() || user.data[0].chat_credits.year !== new Date().getFullYear()) {
            await sql.from('credits').update({
                chat_credits: {
                    credits: 30,
                    month: new Date().getMonth(),
                    year: new Date().getFullYear()
                }
            }).eq('user_id', userid)
        }

        //if there is user obj with current month and year and credits is 0 send warning message
        else if (user.data[0].chat_credits.credits <= 0) {
            return NextResponse.json({ error: "User has no chat credits" }, { status: 400 })
        }

        const response = await openai.chat.completions.create({
            // model: "gemini-1.5-flash-8b",
            model: "gemma-3-27b-it",
            messages: JSON.stringify({conversation}),
            stream: true,
        })

        console.log({ response })

        // Handle OpenAI streaming response
        if (response) {
            //deduct 1 credit
            await sql.from('credits').update({
                chat_credits: {
                    credits: user.data[0].chat_credits.credits - 1
                }
            }).eq('user_id', userid)

            const encoder = new TextEncoder()

            const stream = new ReadableStream({
                async start(controller) {
                    try {
                        // OpenAI response is an async iterable
                        for await (const chunk of response) {
                            console.log({ chunk })

                            // Extract content from OpenAI chunk
                            const content = chunk.choices?.[0]?.delta?.content || ""

                            if (content) {
                                // Send the content directly as text
                                controller.enqueue(encoder.encode(content))
                            }
                        }

                        controller.close()
                    } catch (error) {
                        console.error("Streaming error:", error)
                        controller.error(error)
                    }
                },
            })

            return new Response(stream, {
                headers: {
                    "Content-Type": "text/plain; charset=utf-8",
                    "Transfer-Encoding": "chunked",
                },
            })
        }

        // Fallback for non-streaming response
        const data = await response.json()
        console.log({ data })
        const content = data.choices?.[0]?.message?.content || data.response || ""

        return NextResponse.json({
            choices: [
                {
                    message: {
                        role: "assistant",
                        content: content,
                    },
                },
            ],
        })
    } catch (error) {
        console.error("Error in chat API:", error)
        return NextResponse.json({ error: "Failed to generate response" }, { status: 500 })
    }
}

/*
curl "https://generativelanguage.googleapis.com/v1beta/models/gemma-3-27b-it:generateContent?key=AIzaSyABhVLFqiNpZTaccQaVY-EDaiXT_OQW_E0" \
-H 'Content-Type: application/json' \
-X POST \
-d '{
  "contents": [{
    "parts":[{"text": "Write me a poem"}]
    }]
   }'
*/

// import { GoogleGenAI } from "@google/genai";

// const ai = new GoogleGenAI({ apiKey: "YOUR_API_KEY"});

// const response = await ai.models.generateContent({
//   model: "gemma-3-27b-it",
//   contents: "Roses are red...",
// });
// console.log(response.text);