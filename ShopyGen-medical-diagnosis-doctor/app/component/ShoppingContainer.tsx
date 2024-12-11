"use client";
import React, { useState } from "react";
import { Tab } from "@headlessui/react";
import { MenuItem } from "../types";

interface CartItem extends MenuItem {
  quantity: number;
}

interface ShoppingContainerProps {
  cartItems: MenuItem[];
  setCartItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
  addToCart: (item: MenuItem) => void;
  updateQuantity: (itemId: string, newQuantity: number) => void;
  menuItems: MenuItem[];
}

const ShoppingContainer: React.FC<ShoppingContainerProps> = ({
  cartItems,
  setCartItems,
  addToCart,
  updateQuantity,
  menuItems,
}) => {
  const [selectedTab, setSelectedTab] = useState(0);

  const categories = Array.from(
    new Set(menuItems.map((item) => item.category))
  );
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );

  return (
    <div className="bg-white rounded-lg shadow-lg p-6  h-[80vh] flex flex-col overflow-hidden align-center vertical-center ">
      <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
        <Tab.List className="flex space-x-1 rounded-xl bg-gray-100 p-1 mb-4">
          <Tab
            className={({ selected }) =>
              `w-full rounded-lg py-2.5 text-sm font-medium leading-5
             ${
               selected
                 ? "bg-white text-black shadow"
                 : "text-gray-600 hover:bg-white/[0.12] hover:text-black"
             }`
            }
          >
            Shop
          </Tab>
          <Tab
            className={({ selected }) =>
              `w-full rounded-lg py-2.5 text-sm font-medium leading-5
             ${
               selected
                 ? "bg-white text-black shadow"
                 : "text-gray-600 hover:bg-white/[0.12] hover:text-black"
             }`
            }
          >
            Cart (
            {cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0)})
          </Tab>
        </Tab.List>
        <Tab.Panels className="flex-1 min-h-0 overflow-hidden">
          {/* Shop Panel */}
          <Tab.Panel className="flex-1 overflow-y-auto h-[65vh]">
            <div className="space-y-6">
              {categories.map((category) => (
                <div key={category}>
                  <h3 className="font-bold text-lg mb-3 sticky top-0 bg-white py-2">
                    {category}
                  </h3>
                  <div className="space-y-3">
                    {menuItems
                      .filter((item) => item.category === category)
                      .map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                        >
                          <div>
                            <span className="mr-2">{item.emoji}</span>
                            <span className="font-medium">{item.name}</span>
                            {item.description && (
                              <p className="text-sm text-gray-500">
                                {item.description}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-medium">
                              ${item.price.toFixed(2)}
                            </span>
                            {cartItems.some(
                              (cartItem) => cartItem.id === item.id
                            ) ? (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() =>
                                    updateQuantity(
                                      item.id,
                                      (cartItems.find(
                                        (cartItem) => cartItem.id === item.id
                                      )?.quantity || 1) - 1
                                    )
                                  }
                                  className="bg-gray-200 text-black w-6 h-6 rounded-full flex items-center justify-center hover:bg-gray-300"
                                >
                                  -
                                </button>
                                <span className="w-8 text-center">
                                  {cartItems.find(
                                    (cartItem) => cartItem.id === item.id
                                  )?.quantity || 0}
                                </span>
                                <button
                                  onClick={() =>
                                    updateQuantity(
                                      item.id,
                                      (cartItems.find(
                                        (cartItem) => cartItem.id === item.id
                                      )?.quantity || 1) + 1
                                    )
                                  }
                                  className="bg-gray-200 text-black w-6 h-6 rounded-full flex items-center justify-center hover:bg-gray-300"
                                >
                                  +
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => addToCart(item)}
                                className="bg-black text-white px-3 py-1 rounded-full text-sm hover:bg-gray-800"
                              >
                                Add
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </Tab.Panel>

          {/* Cart Panel */}
          <Tab.Panel className="flex-1 overflow-y-auto h-[65vh]">
            <div className="space-y-4">
              {cartItems.length === 0 ? (
                <p className="text-center text-gray-500">Your cart is empty</p>
              ) : (
                <>
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <span>{item.emoji}</span>
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-500">
                              ${item.price.toFixed(2)} each
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  (item?.quantity || 1) - 1
                                )
                              }
                              className="bg-gray-200 text-black w-6 h-6 rounded-full flex items-center justify-center hover:bg-gray-300"
                            >
                              -
                            </button>
                            <span className="w-8 text-center">
                              {item?.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  (item?.quantity || 1) + 1
                                )
                              }
                              className="bg-gray-200 text-black w-6 h-6 rounded-full flex items-center justify-center hover:bg-gray-300"
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() =>
                              setCartItems(
                                cartItems.filter(
                                  (cartItem) => cartItem.id !== item.id
                                )
                              )
                            }
                            className="text-red-500 hover:text-red-600"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="sticky bottom-0 bg-white pt-4 mt-4 border-t">
              <div className="flex justify-between items-center font-bold">
                <span>Total</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default ShoppingContainer;
