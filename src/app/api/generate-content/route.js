import { NextResponse } from "next/server"

export async function POST(req) {
  try {
    const { prompt, context } = await req.json()

    const systemPrompt = `You are an AI writing assistant. Generate high-quality content based on the user's request. 
    Be creative, informative, and engaging. Format your response in a clear, readable manner.
    Keep responses concise and focused on what the user asked for.
    
    ${context ? `Current document context: ${context}` : ""}`

    const fullPrompt = `${systemPrompt}\n\nHuman: ${prompt}\n\nAssistant: `
    // Make request to your Gemma2:9b endpoint
    const response = await fetch("https://allowed-meerkat-coherent.ngrok-free.app/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Add any authentication headers if needed
        // "Authorization": "Bearer your-api-key"
      },
      body: JSON.stringify({
        prompt: fullPrompt,
        max_tokens: 800,
        temperature: 0.7,
        stop: ["Human:", "Assistant:"], // Adjust stop tokens as needed
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    console.log({data})
    // Extract content based on your endpoint's response format
    // Adjust this based on how your Gemma2:9b endpoint returns data
    let content = ""

    if (data.choices && data.choices[0]) {
      content = data.choices[0].message?.content || data.choices[0].text || ""
    } else if (data.content) {
      content = data.content
    } else if (data.generated_text) {
      content = data.generated_text
    } else if (typeof data === "string") {
      content = data
    }

    return NextResponse.json({
      content: content.trim(),
    })
  } catch (error) {
    console.error("Error in generate-content API:", error)
    return NextResponse.json({ error: "Failed to generate content" }, { status: 500 })
  }
}
