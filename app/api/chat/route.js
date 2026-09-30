import OpenAI from 'openai'

export async function POST(request) {
  try {
    const { messages, model } = await request.json()
    if (!process.env.OPENAI_API_KEY) return Response.json({ error: 'OPENAI_API_KEY manque dans les variables Vercel.' }, { status: 500 })
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    const response = await client.chat.completions.create({
      model: model || 'gpt-4o-mini',
      messages: [{ role: 'system', content: 'Tu es un assistant utile, clair et bienveillant. Réponds en français sauf si l’utilisateur demande une autre langue.' }, ...messages],
      temperature: 0.7
    })
    return Response.json({ content: response.choices[0]?.message?.content || '' })
  } catch (error) {
    return Response.json({ error: error?.error?.message || error?.message || 'Une erreur est survenue.' }, { status: 500 })
  }
}
