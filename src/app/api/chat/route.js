import { NextResponse } from "next/server"

export const maxDuration = 30

export async function POST(req) {
    try {
        const { messages } = await req.json()

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
        let system = systemPrompt

        let conversation = []

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
        const response = await fetch("https://allowed-meerkat-coherent.ngrok-free.app/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // Add any authentication headers if needed
                // "Authorization": "Bearer your-api-key"
            },
            body: JSON.stringify({
                system,
                messages: conversation,
                max_tokens: 1000,
                temperature: 0.7,
                stream: true, // Enable streaming if your endpoint supports it
            }),
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        // If your endpoint supports streaming, return a streaming response
        if (response.body) {
            const encoder = new TextEncoder()
            const decoder = new TextDecoder()

            const stream = new ReadableStream({
                async start(controller) {
                    const reader = response.body.getReader()

                    try {
                        while (true) {
                            const { done, value } = await reader.read()
                            if (done) {
                                controller.close()
                                break
                            }

                            // Parse the streaming response from your Gemma endpoint
                            const chunk = decoder.decode(value)
                            const lines = chunk.split("\n")

                            for (const line of lines) {
                                if (line.trim() === "") continue
                                try {
                                    // Format for AI SDK streaming format
                                    const formattedChunk = line
                                    controller.enqueue(encoder.encode(formattedChunk))

                                } catch (e) {
                                    // Handle parsing errors
                                    console.error("Error parsing chunk:", e)
                                }
                            }
                        }
                    } catch (error) {
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
