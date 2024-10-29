// context.js
import React, { createContext, useContext, useState } from 'react';

const AddFoodContext = createContext();

export const AddFoodProvider = ({ children }) => {
    const [foodData, setFoodData] = useState([]);

    const updateFoodData = (newFood) => {
        const existingFoodIndex = foodData.findIndex((item) => item.id === newFood.id);

        if (existingFoodIndex !== -1) {
            // If the food item is already in the cart, update the quantity and total price
            const updatedFoodData = [...foodData];
            updatedFoodData[existingFoodIndex].qty += newFood.qty;
            updatedFoodData[existingFoodIndex].totalPrice = updatedFoodData[existingFoodIndex].price * updatedFoodData[existingFoodIndex].qty;
            setFoodData(updatedFoodData);
        } else {
            // If the food item is not in the cart, add it with quantity and total price
            setFoodData((prevFoodData) => [
                ...prevFoodData,
                {
                    ...newFood,
                    totalPrice: newFood.price * newFood.qty,
                },
            ]);
        }
    };

    const removeFromCart = (foodId) => {
        const updatedFoodData = foodData.filter((item) => item.id !== foodId);
        setFoodData(updatedFoodData);

        // Save updated foodData to local storage
        localStorage.setItem('cart', JSON.stringify(updatedFoodData));
    };

    const increaseQuantity = (foodId) => {
        const updatedFoodData = foodData.map((item) => {
            if (item.id === foodId) {
                return {
                    ...item,
                    qty: item.qty + 1,
                    totalPrice: item.price * (item.qty + 1),
                };
            }
            return item;
        });
        setFoodData(updatedFoodData);

        // Save updated foodData to local storage
        localStorage.setItem('cart', JSON.stringify(updatedFoodData));
    };

    const decreaseQuantity = (foodId) => {
        const updatedFoodData = foodData.map((item) => {
            if (item.id === foodId && item.qty > 1) {
                return {
                    ...item,
                    qty: item.qty - 1,
                    totalPrice: item.price * (item.qty - 1),
                };
            }
            return item;
        });
        setFoodData(updatedFoodData.filter((item) => item.qty > 0));

        // Save updated foodData to local storage
        localStorage.setItem('cart', JSON.stringify(updatedFoodData));
    };

    return (
        <AddFoodContext.Provider value={{ foodData, updateFoodData, removeFromCart, increaseQuantity, decreaseQuantity }}>
            {children}
        </AddFoodContext.Provider>
    );
};

export const useContextAddFood = () => {
    return useContext(AddFoodContext);
};
