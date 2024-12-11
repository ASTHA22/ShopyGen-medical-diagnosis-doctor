import React from 'react';

interface CartItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  emoji: string;
}

interface CartProps {
  transcription: string;
}

const Cart: React.FC<CartProps> = ({ transcription }) => {
  const cartItems: CartItem[] = [
    {
      id: '1',
      name: 'Classic Cheeseburger',
      description: 'Swiss Cheese, Avocado, Lettuce, No Mayo, Deli Bun, No Tomato',
      price: 6.50,
      emoji: '🍔'
    },
    {
      id: '2',
      name: 'Mozzarella Sticks',
      price: 5.25,
      emoji: '🧀'
    },
    {
      id: '3',
      name: 'Milkshake',
      description: 'Chocolate',
      price: 5.50,
      emoji: '🥤'
    },
    {
      id: '4',
      name: 'Cookies',
      description: 'Oatmeal Raisin',
      price: 3.00,
      emoji: '🍪'
    }
  ];

  const suggestions = [
    { name: 'Double Patty', price: 'Free' },
    { name: 'Veggie Patty', price: 'Free' },
    { name: 'Turkey Patty', price: 'Free' },
    { name: 'Crispy Chicken', price: 'Free' },
    { name: 'Grilled Chicken', price: 'Free' }
  ];

  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="flex min-h-screen bg-gray-100 justify-center items-center">
      <div className="w-[80%] h-[80vh]  flex items-start">
        {/* Left side - Avatar and Transcription */}
        <div className="w-1/2 pr-6 flex flex-col justify-between h-full">
          <div>
            <div className="mb-4">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white text-2xl">
                O
              </div>
            </div>
            <p className="text-gray-600 text-lg">
              {transcription || "Dynamic interaction also supports multimodal interaction such as touch and voice input, at the same time we can touch to choose"}
            </p>
          </div>

          {/* Suggestions moved to left side bottom */}
          <div className="mt-6 bg-gray-900 rounded-lg p-4">
            <h3 className="text-white font-medium mb-2">Suggestions</h3>
            <div className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <div key={index} className="flex justify-between text-gray-400">
                  <span>{suggestion.name}</span>
                  <span>{suggestion.price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right side - Cart */}
        <div className="w-1/2 h-full flex flex-col p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            🛒 Your Cart
          </h2>

          {/* Cart Items - Scrollable */}
          <div className="flex-1 overflow-y-auto">
            <div className="space-y-4 pr-2">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="p-4 border rounded-lg hover:border-purple-500 cursor-pointer transition-colors bg-white"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-start space-x-3">
                      <span className="text-2xl">{item.emoji}</span>
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        {item.description && (
                          <p className="text-sm text-gray-500">{item.description}</p>
                        )}
                      </div>
                    </div>
                    <span className="font-medium">${item.price.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="mt-6 flex justify-between items-center pt-4 border-t">
            <span className="text-gray-600">Total</span>
            <span className="text-xl font-semibold">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
