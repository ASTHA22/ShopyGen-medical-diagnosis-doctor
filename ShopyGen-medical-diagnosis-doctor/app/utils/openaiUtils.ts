import OpenAI from 'openai';
import { MenuItem } from '../types';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export interface OrderIntent {
  action: 'add' | 'remove' | 'clear' | 'checkout';
  itemName?: string;
  quantity?: number;
}

const SYSTEM_PROMPT = `
You are a shopping assistant that processes conversation messages and extracts order intents.
For each conversation, return an array of order intents in the following format:
[
  {
    "action": "add" | "remove" | "clear" | "checkout",
    "itemName": "item name" (optional),
    "quantity": number (optional, defaults to 1)
  }
]

Guidelines for processing orders:
1. When adding items, specify the quantity mentioned (default to 1 if not specified)
2. When removing items:
   - If a specific quantity is mentioned (e.g., "remove 2 burgers"), include that quantity
   - If no quantity is mentioned, remove all of that item
3. For "clear" or "checkout" actions, no itemName or quantity needed
4. Pay attention to quantity words like "all", "both", "one", "two", etc.

Only return the JSON array, no other text.
Example:
User: "Add 2 burgers and remove one coffee"
[
  {"action": "add", "itemName": "burger", "quantity": 2},
  {"action": "remove", "itemName": "coffee", "quantity": 1}
]
`;

export async function processConversationWithAI(
  messages: { role: string; content: string }[],
  menuItems: MenuItem[]
): Promise<OrderIntent[]> {
  try {
    // Create the menu context
    const menuContext = menuItems
      .map(item => `${item.name} - $${item.price}`)
      .join('\n');

    // Format conversation for ChatGPT
    const conversationText = messages
      .map(msg => `${msg.role}: ${msg.content}`)
      .join('\n');
    
    console.log('Conversation:', conversationText);

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { 
          role: "user", 
          content: `Menu Items:\n${menuContext}\n\nConversation:\n${conversationText}\n\nExtract order intents:`
        }
      ],
      temperature: 0.2,
      max_tokens: 150
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return [];
    }

    try {
      const orderIntents = JSON.parse(content) as OrderIntent[];
      return orderIntents;
    } catch (e) {
      console.error('Failed to parse ChatGPT response:', e);
      return [];
    }
  } catch (error) {
    console.error('Error calling ChatGPT API:', error);
    return [];
  }
}
