// components/Tes/FoodCard.jsx
import React, { useState } from 'react';

const FoodCard = ({ id, name, price, imageUrl, store, description, capacity, addToCart }) => {
    const [quantity, setQuantity] = useState(1);

    const handleIncrease = () => {
        setQuantity(quantity + 1);
    };

    const handleDecrease = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const handleAddToCart = () => {
        addToCart({
            id,
            name,
            price,
            imageUrl,
            store,
            description,
            capacity,
            quantity,
            total: quantity * price,
        });
        setQuantity(1);
    };

    return (
        <div className="border p-4 m-4 w-64">
            <img src={imageUrl} alt={name} className="w-full mb-2" />
            <h3 className="text-xl font-semibold mb-2">{name}</h3>
            <p className="text-gray-700 mb-2">{description}</p>
            <p className="text-gray-600">{`Price: $${price.toFixed(2)}`}</p>
            <p className="text-gray-600">{`Store: ${store}`}</p>
            <p className="text-gray-600">{`Capacity: ${capacity}`}</p>
            <div className="flex items-center mt-2">
                <button
                    className="bg-blue-500 text-white px-2 py-1 rounded-l hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
                    onClick={handleDecrease}
                >
                    -
                </button>
                <span className="px-4">{quantity}</span>
                <button
                    className="bg-blue-500 text-white px-2 py-1 rounded-r hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
                    onClick={handleIncrease}
                >
                    +
                </button>
            </div>
            <p className="text-gray-600 mt-2">{`Total: $${(quantity * price).toFixed(2)}`}</p>
            <button
                className="bg-blue-500 text-white px-4 py-2 mt-4 rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
                onClick={handleAddToCart}
            >
                Add to Cart
            </button>
        </div>
    );
};

export default FoodCard;
