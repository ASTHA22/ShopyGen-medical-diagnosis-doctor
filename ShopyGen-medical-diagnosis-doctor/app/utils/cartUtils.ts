import { MenuItem } from '../types';
// import { processConversationWithAI, OrderIntent } from './openaiUtils';
import { processConversationWithLlama } from './llamaUtil';

export interface CartUpdate {
  action: 'add' | 'remove' | 'clear';
  item?: MenuItem;
  quantity?: number;
}

export interface ConversationMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function processConversationForCart(
  messages: ConversationMessage[],
  menuItems: MenuItem[]
): Promise<CartUpdate[]> {
  // Get order intents from ChatGPT
  const orderIntents = await processConversationWithLlama(messages, menuItems);

  console.log('Order Intents:', orderIntents);
  
  // Convert order intents to cart updates
  const updates: CartUpdate[] = [];
  
  for (const intent of orderIntents) {
    switch (intent.action) {
      case 'add':
        if (intent.itemName) {
          const menuItem = findMenuItem(menuItems, intent.itemName);
          if (menuItem) {
            updates.push({
              action: 'add',
              item: menuItem,
              quantity: intent.quantity || 1
            });
          }
        }
        break;
        
      case 'remove':
        if (intent.itemName) {
          const menuItem = findMenuItem(menuItems, intent.itemName);
          if (menuItem) {
            updates.push({
              action: 'remove',
              item: menuItem,
              quantity: intent.quantity
            });
          }
        }
        break;
        
      case 'clear':
        updates.push({ action: 'clear' });
        break;
    }
  }

  console.log('Cart Updates:', updates);
  
  return updates;
}

function findMenuItem(menuItems: MenuItem[], itemName: string): MenuItem | undefined {
  return menuItems.find(item => 
    item.name.toLowerCase().includes(itemName.toLowerCase()) ||
    itemName.toLowerCase().includes(item.name.toLowerCase())
  );
}

export function updateCart(
  currentCart: MenuItem[],
  update: CartUpdate
): MenuItem[] {
  switch (update.action) {
    case 'add':
      if (!update.item) return currentCart;
      const addExistingItemIndex = currentCart.findIndex(
        item => item.id === update.item?.id
      );
      
      if (addExistingItemIndex >= 0) {
        return currentCart.map((item, index) =>
          index === addExistingItemIndex
            ? { ...update.item, quantity: update.quantity || 1 }
            : item
        );
      } else {
        return [...currentCart, { ...update.item, quantity: update.quantity || 1 }];
      }
      
    case 'remove':
      if (!update.item) return currentCart;
      const removeExistingItemIndex = currentCart.findIndex(
        item => item.id === update.item?.id
      );
      
      if (removeExistingItemIndex === -1) return currentCart;
      
      const currentItem = currentCart[removeExistingItemIndex];
      const removeQuantity = update.quantity || currentItem.quantity || 1;
      
      // If removing all or more than current quantity, remove the item
      if (removeQuantity >= (currentItem.quantity || 1)) {
        return currentCart.filter(item => item.id !== update.item?.id);
      }
      
      // Otherwise decrease the quantity
      return currentCart.map((item, index) =>
        index === removeExistingItemIndex
          ? { ...item, quantity: (item.quantity || 1) - removeQuantity }
          : item
      );
      
    case 'clear':
      return [];
      
    default:
      return currentCart;
  }
}
