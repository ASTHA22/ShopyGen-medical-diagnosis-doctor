"use client";
import { useState, useEffect, useRef } from "react";
import ShoppingContainer from "./component/ShoppingContainer";
import Header from "./component/Header";
import ShopygenVapi from "./component/ShopygenVapi"; // Import ShopygenVapi component
import OrderReceipt from "./component/OrderReceipt"; // Import OrderReceipt component
import HeyGenAvatar from "./component/HeyGenAvatar";

import { MenuItem } from "./types";

interface CartItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  emoji: string;
  quantity?: number;
}

interface CartProps {
  transcription: string;
}

const menuItems: MenuItem[] = [
  // Smartphones
  {
    id: "1",
    name: "iPhone 16 Pro Max",
    description: "Latest iPhone with A18 chip, 8K video, 1TB storage",
    price: 1299.99,
    category: "Smartphones",
    emoji: "📱",
  },
  {
    id: "2",
    name: "Samsung Galaxy Fold 6",
    description: "Foldable display, 512GB storage, 108MP camera",
    price: 1799.99,
    category: "Smartphones",
    emoji: "📱",
  },
  {
    id: "3",
    name: "Google Pixel 9 Pro",
    description: "Advanced AI camera, 256GB storage, Pure Android",
    price: 999.99,
    category: "Smartphones",
    emoji: "📱",
  },
  {
    id: "4",
    name: "OnePlus 13 Pro",
    description: "Snapdragon 8 Gen 3, 256GB storage, 120W charging",
    price: 899.99,
    category: "Smartphones",
    emoji: "📱",
  },
  {
    id: "5",
    name: "Xiaomi 15 Ultra",
    description: "1-inch camera sensor, 512GB storage, 120W charging",
    price: 1099.99,
    category: "Smartphones",
    emoji: "📱",
  },

  // Laptops
  {
    id: "6",
    name: "MacBook Pro M3 Max",
    description: "16-inch, 32GB RAM, 1TB SSD, Space Black",
    price: 2499.99,
    category: "Laptops",
    emoji: "💻",
  },
  {
    id: "7",
    name: "Dell XPS 16",
    description: "Intel Core i9, 32GB RAM, RTX 4070, 1TB SSD",
    price: 2299.99,
    category: "Laptops",
    emoji: "💻",
  },
  {
    id: "8",
    name: "Lenovo ThinkPad X1 Carbon",
    description: "14-inch, Intel Core i7, 16GB RAM, 512GB SSD",
    price: 1699.99,
    category: "Laptops",
    emoji: "💻",
  },
  {
    id: "9",
    name: "ASUS ROG Zephyrus",
    description: "AMD Ryzen 9, RTX 4080, 32GB RAM, 2TB SSD",
    price: 2799.99,
    category: "Laptops",
    emoji: "💻",
  },
  {
    id: "10",
    name: "HP Spectre x360",
    description: "2-in-1, OLED display, Intel Core i7, 16GB RAM",
    price: 1499.99,
    category: "Laptops",
    emoji: "💻",
  },

  // Headphones
  {
    id: "11",
    name: "Apple AirPods Pro 3",
    description: "Active noise cancellation, Spatial Audio, USB-C",
    price: 279.99,
    category: "Headphones",
    emoji: "🎧",
  },
  {
    id: "12",
    name: "Sony WH-1000XM6",
    description: "Best-in-class ANC, 40hr battery, Hi-Res Audio",
    price: 399.99,
    category: "Headphones",
    emoji: "🎧",
  },
  {
    id: "13",
    name: "Bose QuietComfort Ultra",
    description: "Premium ANC, Spatial Audio, 24hr battery",
    price: 329.99,
    category: "Headphones",
    emoji: "🎧",
  },
  {
    id: "14",
    name: "Sennheiser Momentum 5",
    description: "Audiophile quality, ANC, 60hr battery life",
    price: 349.99,
    category: "Headphones",
    emoji: "🎧",
  },
  {
    id: "15",
    name: "Samsung Galaxy Buds3 Pro",
    description: "360 Audio, ANC, 30hr total battery life",
    price: 229.99,
    category: "Headphones",
    emoji: "🎧",
  },
];

const App: React.FC = () => {
  const [transcription, setTranscription] = useState<string>("");
  const [liveMessages, setliveMessages] = useState<string[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showReceipt, setShowReceipt] = useState(false);
  const [orderId, setOrderId] = useState("");
  const transcriptRef = useRef<HTMLDivElement>(null);

  // Simulated real-time transcription updates
  useEffect(() => {
    const demoText = `Hello, Welcome to ElectroMart, your personal shopping AI assistant!
I'm here to make your electronics shopping experience smarter, faster, and hassle-free.
How can I assist you today?`;
    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex < demoText.length) {
        setTranscription(demoText.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [transcription]); // Scroll when transcription updates

  const processRealtimeVoiceOrder = (message: any) => {
    // Handle the voice order here, e.g., send it to a server or execute a function
    console.log("Voice message received:", message);
  };

  useEffect(() => {
    processRealtimeVoiceOrder(liveMessages);
  }, [liveMessages]);

  const addToCart = (item: CartItem) => {
    setCartItems((prev) => {
      const existingItem = prev.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return prev.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: (cartItem.quantity || 1) + 1 }
            : cartItem
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      setCartItems((prev) => prev.filter((item) => item.id !== itemId));
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const suggestions = [
    { name: "Double Patty", price: "Free" },
    { name: "Veggie Patty", price: "Free" },
    { name: "Turkey Patty", price: "Free" },
    { name: "Crispy Chicken", price: "Free" },
    { name: "Grilled Chicken", price: "Free" },
  ];

  const total = cartItems.reduce(
    (sum, item) => sum + (item.quantity || 1) * item.price,
    0
  );

  return (
    <div className="flex min-h-screen flex-col page-container">
      {/* Header with glass effect */}
      <Header cartItems={cartItems} />

      <div className="flex flex-1 justify-center items-start mb-4">
        <div className="container mx-auto max-w-7xl flex items-start justify-between gap-84 bg-white rounded-lg shadow-lg overflow-hidden ">
          {/* Left side - Avatar and Transcription */}
          <div
            className="flex-1 h-[90vh] relative overflow-hidden rounded-l-lg"
            style={{
              backgroundImage:
                "url('https://files2.heygen.ai/avatar/v3/699a4c2995914d39b2cb311a930d7720_45570/preview_talk_3.webp')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className="absolute inset-0 flex flex-col">
              <div className="relative flex-1">
                <HeyGenAvatar
                  knowledgeId="873240e0761140a29ef63fbc17bd8d51"
                  onTranscriptUpdate={(transcripts) => {
                    console.log("New transcripts:", transcripts);
                    setTranscription(
                      transcripts[transcripts.length - 1].content
                    );
                  }}
                  menuItems={menuItems}
                  currentCart={cartItems as MenuItem[]}
                  onCartUpdate={(updates) => {
                    console.log("Voice agent cart updates:", updates);
                    setCartItems(updates);
                  }}
                />
              </div>
              <div className="relative z-10 px-4 pb-4">
                <div
                  ref={transcriptRef}
                  className="h-[100px] overflow-y-auto bg-black/60 backdrop-blur-md p-4 border border-black rounded-lg scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
                  style={{
                    scrollBehavior: "smooth",
                  }}
                >
                  <p className="text-md text-white/90 tracking-tight whitespace-pre-line ">
                    {transcription || "Hello.."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Cart */}
          <div className="flex-1 max-w-xl justify-center vertical-center">
            <ShoppingContainer
              cartItems={cartItems as MenuItem[]}
              setCartItems={
                setCartItems as React.Dispatch<React.SetStateAction<MenuItem[]>>
              }
              addToCart={addToCart}
              updateQuantity={updateQuantity}
              menuItems={menuItems}
            />
            <div className="mt-4 px-4 h-[60px]">
              {cartItems.length > 0 ? (
                <button
                  onClick={() => {
                    // Generate a random order ID
                    const newOrderId = Math.random()
                      .toString(36)
                      .substr(2, 9)
                      .toUpperCase();
                    setOrderId(newOrderId);
                    setShowReceipt(true);
                  }}
                  className="w-full py-3 px-4 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-200 font-semibold shadow-lg"
                >
                  Checkout (${total.toFixed(2)})
                </button>
              ) : (
                <div className="w-full py-3 px-4 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-200 font-semibold shadow-lg">
                  <p className="text-center">Your cart is empty.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <OrderReceipt
        isOpen={showReceipt}
        onClose={() => {
          setShowReceipt(false);
          setCartItems([]); // Clear cart after order
        }}
        cartItems={cartItems}
        total={total}
        orderId={orderId}
      />
    </div>
  );
};

export default App;
