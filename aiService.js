// aiService.js
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Calls OpenAI to classify lead intent
export async function classifyLead(offer, lead) {
  const prompt = `
You are a sales intent classifier.

Offer:
- Name: ${offer.name}
- Value Props: ${offer.value_props?.join(', ')}
- Ideal Use Cases: ${offer.ideal_use_cases?.join(', ')}

Lead:
- Name: ${lead.name}
- Role: ${lead.role}
- Company: ${lead.company}
- Industry: ${lead.industry}
- Location: ${lead.location}
- LinkedIn Bio: ${lead.linkedin_bio}

Task:
Classify the lead's intent as High, Medium, or Low. 
Then explain briefly (1–2 sentences).
Return ONLY valid JSON in this format:
{"intent":"High|Medium|Low","reasoning":"short explanation"}
`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You must only respond with valid JSON, nothing else.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.2,
    });

    const raw = response.choices[0].message.content.trim();

    // Clean JSON if wrapped in ```json ... ```
    const clean = raw.replace(/```json|```/g, '').trim();

    let parsed;
    try {
      parsed = JSON.parse(clean);
    } catch (err) {
      console.error('⚠️ Failed to parse AI response:', raw);
      return { intent: 'Low', reasoning: 'AI parsing failed' };
    }

    // Normalize intent
    const intent = ['High', 'Medium', 'Low'].includes(parsed.intent)
      ? parsed.intent
      : 'Low';

    return {
      intent,
      reasoning: parsed.reasoning || 'No reasoning provided',
    };
  } catch (error) {
    console.error('⚠️ OpenAI API Error:', error.message);
    return { intent: 'Low', reasoning: 'AI call failed' };
  }
}
