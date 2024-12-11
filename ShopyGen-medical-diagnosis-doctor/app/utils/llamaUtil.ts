import Together from "together-ai";
import { MenuItem } from '../types';



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

export async function processConversationWithLlama(
    messages: { role: string; content: string }[],
    menuItems: MenuItem[]
): Promise<OrderIntent[]> {

    const together = new Together({ 
        apiKey: process.env.NEXT_PUBLIC_TOGETHER_API_KEY
    });

    try {
        // Create the menu context
        const menuContext = menuItems
            .map(item => `${item.name} - $${item.price}`)
            .join('\n');

        // Format conversation for Llama
        const conversationText = messages
            .map(msg => `${msg.role}: ${msg.content}`)
            .join('\n');
        
        console.log('Conversation:', conversationText);

        const response = await together.chat.completions.create({
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { 
                    role: "user", 
                    content: `Menu Items:\n${menuContext}\n\nConversation:\n${conversationText}\n\nExtract order intents:`
                }
            ],
            model: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
            temperature: 0.7,
            top_p: 0.7,
            top_k: 50,
            repetition_penalty: 1,
            stop: ["<|eot_id|>", "<|eom_id|>"],
            stream: false
        });

        const content = response.choices[0]?.message?.content || '';
        
        try {
            const orderIntents = JSON.parse(content) as OrderIntent[];
            return orderIntents;
        } catch (e) {
            console.error('Failed to parse Llama response:', e);
            return [];
        }
    } catch (error) {
        console.error('Error calling Llama API:', error);
        return [];
    }
}
