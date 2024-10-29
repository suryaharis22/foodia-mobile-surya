// FoodList.js
import React from 'react';
import FoodCard from './FoodCard';

const FoodList = () => {
    const foods = [
        { id: 1, name: 'Food 1', price: 19.99, imageUrl: '/food1.jpg', store: 'Surya', description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.', capacity: 10 },
        { id: 2, name: "Gadget X", "price": 149.99, imageUrl: "/gadgetX.jpg", store: "Tech Haven", description: "Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur.", capacity: 5 },
    ];

    return (
        <div className="food-list">
            {foods.map((food) => (
                <FoodCard key={food.id} food={food} />
            ))}
        </div>
    );
};

export default FoodList;
