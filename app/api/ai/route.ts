import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"], // Ensure this is correctly set
});

export async function GET(req: NextRequest) {
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a helpful assistant that only provides answers related to the Naruto anime. If a question is not related to Naruto, politely redirect the user to ask Naruto-related questions. 
You should respond with: 
- japanese: the Japanese translation
- english: the English translation`,
        },
        {
          role: "system",
          content: `You always respond with a JSON object with the following format: 
        {
          "japanese":"",
          "english": "",
        }`,
        },
        {
          role: "user",
          content: `I am going to ask a question related to naruto anime. So my question is: ${
            req.nextUrl.searchParams.get("question") ||
            "Who is naruto's best friend?"
          }`,
        },
      ],
      model: "gpt-3.5-turbo",
      response_format: {
        type: "json_object",
      },
    });

    const content = completion.choices[0]?.message?.content;
    console.log("Raw content:", content); // Log raw content for debugging

    if (content) {
      try {
        // Parse the response as JSON
        const parsedContent = JSON.parse(content);

        // Check if the response has both japanese and english keys
        if (parsedContent.japanese && parsedContent.english) {
          // Return the JSON object with Japanese and English translations
          return NextResponse.json(parsedContent);
        } else {
          // Handle unexpected format
          console.error("Response format is incorrect:", parsedContent);
          return NextResponse.json(
            { error: "Response format is incorrect" },
            { status: 500 },
          );
        }
      } catch (parseError) {
        console.error("Error parsing JSON:", parseError);
        return NextResponse.json(
          { error: "Error parsing JSON response" },
          { status: 500 },
        );
      }
    } else {
      console.error("No content received from OpenAI");
      return NextResponse.json(
        { error: "No content received from OpenAI" },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Error fetching completion:", error);
    return NextResponse.json(
      { error: "Failed to fetch completion" },
      { status: 500 },
    );
  }
}
