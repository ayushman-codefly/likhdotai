import sql from "@/db";
import { GoogleGenAI } from "@google/genai";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server"
import OpenAI from "openai";

export const maxDuration = 30

const openai = new OpenAI({
    baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
    apiKey: process.env.GEMINI_API_KEY
});

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY});

export async function POST(req) {
    try {
        const { messages, userid } = await req.json()
        
        const systemPrompt = `You are an AI writing assistant. The user will provide you with a document and a request. 
    Please provide an improved version of the ENTIRE document based on their request. If document has nothing you can behave as an AI to generate random stuffs.
    Understand what the user is asking. They might ask you to generate or improve. Understand the requirement.
    If there is any data you must edit it. Or append stuffs. Never miss the original data if any.
    Always return in html format as I will be pasting it to editor. Dont keep code in backticks and thsi step is very important for you to know. I just want the html nothing other than that.
    Return the whole changed document in document key in your response. Please create proper formatting with new lines and always take input in html and output html
    
    Important: Return the complete improved document, not just suggestions or explanations.
    Focus on making substantial improvements while maintaining the original intent. Dont write anything else than the document just return the improvides document`

        // Format the conversation for Google GenAI (no system role support)
        let conversation = []

        messages.forEach((message, index) => {
            if (message.role === "user") {
                // For the last user message, append the system prompt
                if (index === messages.length - 1) {
                    conversation.push({
                        role: 'user',
                        content: `${systemPrompt}\n\nUser Request: ${message.content}`
                    })
                } else {
                    conversation.push({
                        role: 'user',
                        content: message.content
                    })
                }
            } else if (message.role === "assistant") {
                conversation.push({
                    role: 'assistant',
                    content: message.content
                })
            }
            // Skip system messages since they're not supported
        })

        //before getting response check if user has enough credits
        let user = await sql.from('credits').select('*').eq('user_id', userid)
        console.log("Initial user credits:", user.data[0]?.chat_credits)
        
        //if there is no user create a user with 100 chat credits for this month
        if (user.data.length === 0) {
            await sql.from('credits').insert({
                user_id: userid,
                chat_credits: {
                    credits:100,
                    month: new Date().getMonth(),
                    year: new Date().getFullYear()
                }
            })
            // Refetch user data after creation
            user = await sql.from('credits').select('*').eq('user_id', userid)
        }
        // if there is no credit obj for month update the user credit month and set credits to 100
        else if (user.data[0].chat_credits.month !== new Date().getMonth() || user.data[0].chat_credits.year !== new Date().getFullYear()) {
            await sql.from('credits').update({
                chat_credits: {
                    credits: 100,
                    month: new Date().getMonth(),
                    year: new Date().getFullYear()
                }
            }).eq('user_id', userid)
            // Refetch user data after update
            user = await sql.from('credits').select('*').eq('user_id', userid)
        }

        // Now check if user has enough credits (after potential updates)
        console.log("Final user credits before check:", user.data[0].chat_credits)
        if (user.data[0].chat_credits.credits <= 0) {
            console.log("Returning error: User has no chat credits")
            return NextResponse.json({ error: "User has no chat credits" }, { status: 400 })
        }

        const response = await ai.models.generateContent({
            // model: "gemini-1.5-flash-8b",
            model: "gemma-3-27b-it",
            contents: JSON.stringify({conversation}),
            stream: false, // No streaming for Google GenAI
        })

        console.log({response})

        // Extract the generated content from Google GenAI response
        const generatedText = response.candidates?.[0]?.content?.parts?.[0]?.text || 
                            response.response?.text() || 
                            "Sorry, I couldn't generate a response."

        // Deduct 1 credit after successful response
        const currentCredits = user.data[0].chat_credits.credits
        await sql.from('credits').update({
            chat_credits: {
                ...user.data[0].chat_credits,
                credits: Math.max(0, currentCredits - 1)
            }
        }).eq('user_id', userid)

        console.log(`Credits deducted: ${currentCredits} -> ${Math.max(0, currentCredits - 1)}`)

        // Return the complete response as JSON
        return NextResponse.json({
            content: generatedText,
            success: true
        })

    } catch (error) {
        console.error("Error:", error)
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