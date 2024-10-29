// pages/cart.js
import React, { useEffect, useState } from 'react';
import ShoppingCart from '@/components/Tes/ShoppingCart';

const Cart = () => {
    const [cart, setCart] = useState([]);

    useEffect(() => {
        // Membaca nilai dari localStorage setelah rendering pada sisi klien
        const cartData = JSON.parse(localStorage.getItem('cart')) || [];
        setCart(cartData);
    }, []); // Empty dependency array ensures that this effect runs only once after the initial render

    const updateCart = (updatedCart) => {
        setCart(updatedCart);
        // Menyimpan data keranjang ke localStorage setelah diperbarui
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    return (
        <div className="mt-24">
            <ShoppingCart cart={cart} updateCart={updateCart} />
        </div>
    );
};

export default Cart;
