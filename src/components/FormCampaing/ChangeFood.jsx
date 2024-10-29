// components/FormCampaing/ChangeFood.jsx
import React, { useEffect, useState } from "react";
import {
  IconChevronDown,
  IconChevronUp,
  IconCirclePlus,
  IconMinus,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";

const ChangeFood = ({
  id,
  name,
  price,
  images,
  description,
  qty,
  merchant_id,
  capacity,
}) => {
  const firstImageUrl = images.length > 0 ? images[0].image_url : "";
  const [quantity, setQuantity] = useState(1);

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  const handleDecrease = () => {
    setQuantity(quantity - 1);
  };

  const [showDesc, setShowDesc] = useState(false);

  return (
    <div className="w-full bg-white text-black border border-primary rounded-lg inline-flex items-center px-2 py-2.5">
      <div className="flex justify-between w-full">
        <div className="flex w-full">
          <img
            className="w-10 h-10 rounded-full bg-blue-100 grid place-items-center mr-2 text-blue-600"
            src={`${process.env.NEXT_PUBLIC_URL_STORAGE}${firstImageUrl}`}
            alt=""
          />
          <div className="text-left place-items-start w-full">
            <div className="mb-1 capitalize text-primary font-bold">{name}</div>
            {!showDesc && description.length > 60 ? (
              <>
                <div className=" text-xs text-gray-500 truncate w-60">
                  {description}
                </div>
                <button
                  onClick={() => setShowDesc(!showDesc)}
                  className="justify-end items-center text-xs py-1 text-primary w-full flex flex-row"
                >
                  Selengkapnya{" "}
                  <IconChevronDown className="mt-0.5" size="15px" />
                </button>
              </>
            ) : (
              <>
                <div className=" text-xs text-gray-500 w-48">{description}</div>
                {description.length > 60 && (
                  <button
                    onClick={() => setShowDesc(!showDesc)}
                    className="justify-end items-center text-xs py-1 text-primary w-full flex flex-row"
                  >
                    Lebih Sedikit{" "}
                    <IconChevronUp className="mt-0.5" size="15px" />
                  </button>
                )}
              </>
            )}
            <div className="flex flex-row items-end justify-between w-full">
              <div>
                <p className=" text-xs text-primary mt-2 mr-2">{`Capacity: ${qty}`}</p>
                <p className="text-xs mt-0.5 text-primary">{`Harga: Rp ${parseInt(
                  price
                ).toLocaleString(undefined, {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}`}</p>
              </div>
              <div className="flex items-center">
                <button
                  className=" text-black px-2 py-1 rounded-l hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
                  onClick={() => handleDecrease()}
                >
                  <IconMinus size={15} />
                </button>
                <span className="px-4 text-blue-700 font-bold border rounded-md border-blue-900">
                  {quantity}
                </span>
                <button
                  className=" text-black px-2 py-1 rounded-r hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
                  onClick={() => handleIncrease()}
                >
                  <IconPlus size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangeFood;
