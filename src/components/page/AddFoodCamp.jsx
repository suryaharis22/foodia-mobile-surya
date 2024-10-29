// pages/tes.jsx
import { useState, useEffect } from "react";
import Link from "next/link";
import AddFoodCamp from "@/components/FormCampaing/AddFoodCamp";
import { IconCirclePlus, IconGardenCart } from "@tabler/icons-react";
import { useRouter } from "next/router";

const AddFood = () => {
  const [cart, setCart] = useState([]);
  const [groupedFoods, setGroupedFoods] = useState({});
  const router = useRouter();

  useEffect(() => {
    // Load cart data from local storage on component mount
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);

    // Group foods by store
    const groupedByStore = foods.reduce((acc, food) => {
      const { store } = food;
      if (!acc[store]) {
        acc[store] = [];
      }
      acc[store].push(food);
      return acc;
    }, {});
    setGroupedFoods(groupedByStore);
  }, []);

  const addToCart = (food) => {
    const existingItemIndex = cart.findIndex((item) => item.id === food.id);

    if (existingItemIndex !== -1) {
      const updatedCart = cart.map((item, index) =>
        index === existingItemIndex
          ? {
              ...item,
              quantity: item.quantity + food.quantity,
              total: (item.quantity + food.quantity) * item.price,
            }
          : item
      );
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    } else {
      const updatedCart = [...cart, food];
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    }
  };

  const foods = [
    {
      id: 1,
      name: "Food 1",
      price: 19.99,
      imageUrl: "https://api.lorem.space/image/face?w=100&h=100",
      store: "Surya",
      description: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      capacity: 10,
    },
    {
      id: 2,
      name: "Food 2",
      price: 12.56,
      imageUrl: "/food2.jpg",
      store: "Surya",
      description: "lorem ipsum dolor sit amet",
      capacity: 10,
    },
    {
      id: 3,
      name: "Food 3",
      price: 854.95,
      imageUrl: "/food3.jpg",
      store: "Surya",
      description: "Lorem ipsum dolor sit amet consectetur .",
      capacity: 10,
    },
    {
      id: 4,
      name: "Gadget X",
      price: 149.99,
      imageUrl: "/gadgetX.jpg",
      store: "Tech Haven",
      description:
        "Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur.",
      capacity: 5,
    },
    // Add more food items as needed
  ];

  // Calculate total price and total quantity
  const totalHarga = cart.reduce((acc, item) => acc + item.total, 0).toFixed(2);
  const jumlahMakanan = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="container mx-auto mt-24 bg-white h-screen">
      <div className="flex justify-center w-full">
        <h1>Food Campaign</h1>
      </div>

      <hr className="w-full h-1 mx-auto mt-2 bg-gray-300 border-0 rounded" />

      <div className="items-center justify-center mt-1 w-full">
        <div className="w-full bg-white  text-black rounded-lg inline-flex items-center px-4 py-2.5 ">
          <div className="flex justify-between w-full">
            <div className="flex">
              <div className="text-left place-items-start">
                <div className="mb-1 text-primary">
                  Total Harga: {totalHarga}
                </div>
                <div className="-mt-1  text-xs text-gray-500">
                  Jumlah Makanan: {jumlahMakanan}
                </div>
              </div>
            </div>
            <div className="grid place-items-center">
              <Link
                href="/creatcampaign?step=3"
                className="flex rounded-lg w-20 h-10 grid grid-cols-3 gap-4 content-center text-white bg-primary p-2 hover:shadow-lg"
              >
                <IconGardenCart />
                Cart{" "}
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* <hr className="w-full h-1 mx-auto mt-2 bg-gray-300 border-0 rounded" /> */}

      <div className="items-center justify-center mt-2 w-full">
        {Object.keys(groupedFoods).map((storeName) => (
          <>
            <hr className="w-full h-1 mx-auto mt-2 bg-gray-300 border-0 rounded" />
            <div key={storeName} className="mb-4">
              <h2 className="text-xl font-bold">Store :{storeName}</h2>
              {groupedFoods[storeName].map((food) => (
                <AddFoodCamp key={food.id} {...food} addToCart={addToCart} />
              ))}
            </div>
          </>
        ))}
      </div>
    </div>
  );
};

export default AddFood;
