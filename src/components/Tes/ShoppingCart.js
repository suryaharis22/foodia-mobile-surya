// components/ShoppingCart.js
import React, { useState } from "react";

const ShoppingCart = ({ cart, updateCart }) => {
  const groupedCart = cart.reduce((acc, item) => {
    const storeName = item.store;
    if (!acc[storeName]) {
      acc[storeName] = [];
    }
    acc[storeName].push(item);
    return acc;
  }, {});

  const handleRemove = (storeName, itemIndex) => {
    const updatedCart = [...cart];
    updatedCart.splice(itemIndex, 1);
    updateCart(updatedCart);
  };

  const handleDecrease = (storeName, itemIndex) => {
    const updatedCart = [...cart];
    if (updatedCart[itemIndex].quantity > 1) {
      updatedCart[itemIndex].quantity -= 1;
      updatedCart[itemIndex].total =
        updatedCart[itemIndex].quantity * updatedCart[itemIndex].price;

      // Update the total price for the entire cart
      const totalCartPrice = updatedCart.reduce(
        (total, item) => total + item.total,
        0
      );

      // Call the updateCart function with the updated cart
      updateCart(updatedCart, totalCartPrice);
    }
  };

  const handleIncrease = (storeName, itemIndex) => {
    const updatedCart = [...cart];
    updatedCart[itemIndex].quantity += 1;
    updatedCart[itemIndex].total =
      updatedCart[itemIndex].quantity * updatedCart[itemIndex].price;
    // Update the total price for the entire cart
    const totalCartPrice = updatedCart.reduce(
      (total, item) => total + item.total,
      0
    );
    // Call the updateCart function with the updated cart
    updateCart(updatedCart, totalCartPrice);
  };

  return (
    <div className="container mx-auto mt-24 bg-white h-screen">
      <div className="flex justify-center w-full">
        <h1>Shopping Cart</h1>
      </div>

      <hr className="w-full h-1 mx-auto mt-2 bg-gray-300 border-0 rounded" />

      <div className="items-center justify-center mt-2 w-full">
        {Object.keys(groupedCart).length > 0 ? (
          Object.keys(groupedCart).map((storeName, storeIndex) => (
            <div key={storeIndex} className="mb-4">
              <h2 className="text-xl font-semibold mb-2">{storeName}</h2>
              {groupedCart[storeName].map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  className="w-full bg-white text-black rounded-lg inline-flex items-center px-4 py-2.5 mb-2"
                >
                  <div className="flex justify-between w-full">
                    <div className="flex">
                      <div className="w-10 h-10 rounded-full bg-blue-100 grid place-items-center mr-2 text-blue-600">
                        {/* Icon or Image Here */}
                      </div>
                      <div className="text-left place-items-start">
                        <div className="mb-1 text-primary">{item.name}</div>
                        <div className="mb-1  text-xs">
                          1RB terjual | Disukai:20|Max qty:{item.capacity}
                        </div>
                        <div className="mb-1  text-xs">{item.description}</div>
                        <p className="text-gray-700">{`Price: $${item.price.toFixed(
                          2
                        )}`}</p>
                        <p className="text-gray-600 mt-2">{`Total: Rp${item.total.toLocaleString(
                          undefined,
                          { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                        )}`}</p>
                        {/* <p className="text-gray-700">{`Total: $${item.total.toFixed(2)}`}</p> */}
                      </div>
                    </div>

                    <div className="grid place-items-center">
                      <div className="flex items-center mt-2">
                        <button
                          className="bg-blue-500 text-white px-2 py-1 rounded-l hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
                          onClick={() => handleDecrease(storeName, itemIndex)}
                        >
                          -
                        </button>
                        <span className="px-4">{item.quantity}</span>
                        <button
                          className="bg-blue-500 text-white px-2 py-1 rounded-r hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
                          onClick={() => handleIncrease(storeName, itemIndex)}
                        >
                          +
                        </button>
                      </div>

                      <button
                        className="bg-red-500 text-white px-4 py-2 mt-4 rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
                        onClick={() => handleRemove(storeName, itemIndex)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))
        ) : (
          <p className="text-gray-700">Your cart is empty.</p>
        )}
      </div>
    </div>
  );
};

export default ShoppingCart;
