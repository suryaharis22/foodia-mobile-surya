// components/ShoppingCart.jsx
import React from 'react';

const ShoppingCart = ({ cart, calculateTotalPrice }) => {
    return (
        <div className="mt-4">
            <h2>Shopping Cart</h2>
            {cart && cart.length > 0 ? (
                <div>
                    <ul>
                        {cart.map((item) => (
                            <li key={item.id}>
                                {item.name} - ${item.totalPrice.toFixed(2)} - Quantity: {item.quantity} - Store: {item.store}
                            </li>
                        ))}
                    </ul>
                    <p>Total Price: ${calculateTotalPrice().toFixed(2)}</p>
                </div>
            ) : (
                <p>Your cart is empty.</p>
            )}
        </div>
    );
};

export default ShoppingCart;
