'use strict';
import OpenAI from 'openai';

const client = new OpenAI({
    apiKey: "abc"
});

export async function POST(req) {
    const body = await req.json();
    const content = body?.message;
    const completion = await client.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'user', content }
        ],
    }).catch(err => {
        return {choices: [{message:{content: `${content} reply`}}]};
    });
    
    const data = completion?.choices[0]?.message?.content;
    // const data = `${content} reply`;
    return new Response(JSON.stringify(data), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}