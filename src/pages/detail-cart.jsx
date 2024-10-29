// pages/detail-cart.jsx (Pastikan nama file sesuai dengan aturan Next.js)
import React from 'react';

const DetailCart = ({ cart }) => {
    if (!cart) {
        // Menangani kasus ketika cart belum terdefinisi
        return <p>Cart is empty</p>;
    }

    return (
        <div>
            <h1>Detail Cart</h1>
            <ul>
                {cart.map((item) => (
                    <li key={item.id}>
                        {item.name} - ${item.totalPrice.toFixed(2)} - Quantity: {item.quantity} - Store: {item.store}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DetailCart;
