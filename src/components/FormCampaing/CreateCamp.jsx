import RoutStep from "../RoutStep";
import { IconCirclePlus } from "@tabler/icons-react";
import Link from "next/link";
import axios from "axios";
import Error401 from "../error401";
import { useRouter } from "next/navigation";

function StepThree({ cart, updateCart, stepForm = 0 }) {
  const router = useRouter();
  const groupedCart = cart.reduce((acc, item) => {
    const storeName = item.store;
    if (!acc[storeName]) {
      acc[storeName] = [];
    }
    acc[storeName].push(item);
    return acc;
  }, {});

  const handleRemove = (storeName, itemId) => {
    const updatedCart = cart.filter(
      (item) => !(item.store === storeName && item.id === itemId)
    );
    updateCart(updatedCart);
  };

  const handleDecrease = (storeName, itemId) => {
    const updatedCart = [...cart];
    const itemIndex = updatedCart.findIndex(
      (item) => item.store === storeName && item.id === itemId
    );

    if (itemIndex !== -1 && updatedCart[itemIndex].quantity > 1) {
      updatedCart[itemIndex].quantity -= 1;
      updatedCart[itemIndex].total =
        updatedCart[itemIndex].quantity * updatedCart[itemIndex].price;
      const totalCartPrice = updatedCart.reduce(
        (total, item) => total + item.total,
        0
      );
      const totalCartQuantity = updatedCart.reduce(
        (total, item) => total + item.quantity,
        0
      );
      updateCart(updatedCart, totalCartPrice, totalCartQuantity);
    }
  };

  const handleIncrease = (storeName, itemId) => {
    const updatedCart = [...cart];
    const itemIndex = updatedCart.findIndex(
      (item) => item.store === storeName && item.id === itemId
    );

    if (itemIndex !== -1) {
      updatedCart[itemIndex].quantity += 1;
      updatedCart[itemIndex].total =
        updatedCart[itemIndex].quantity * updatedCart[itemIndex].price;
      const totalCartPrice = updatedCart.reduce(
        (total, item) => total + item.total,
        0
      );
      const totalCartQuantity = updatedCart.reduce(
        (total, item) => total + item.quantity,
        0
      );
      updateCart(updatedCart, totalCartPrice, totalCartQuantity);
    }
  };

  const handleSubmit = async () => {
    try {
      // Retrieve formData from local storage
      const campData = JSON.parse(localStorage.getItem("formData"));

      // Combine formData and cart data
      const eventData = {
        eventName: campData.eventName,
        ImageCamp: campData.ImageCamp,
        TypeEvent: campData.TypeEvent,
        Tanggal: campData.Tanggal,
        Waktu: campData.Waktu,
        location: campData.location,
        Jalan: campData.Jalan,
        DetaiAlamat: campData.DetaiAlamat,
        coordinates: campData.coordinates,
        cart: cart,
      };

      const formData = new FormData();
      formData.append("destination", "campaign");
      formData.append("file", campData.ImageCamp);

      // Make API call to another endpoint
      const response = await axios.post(
        "http://your-api-endpoint.com/submit-event",
        formData,
        {
          headers: {
            Authorization: "Bearer your_access_token", // Add your authorization token here
            ...formData.getHeaders(),
          },
        }
      );

      // Handle success, e.g., show a success message or navigate to another page
    } catch (error) {
      if (error.response && error.response.status === 401) {
        Error401(error, router);
      }
    }
  };

  const totalCartPrice = cart.reduce((total, item) => total + item.total, 0);
  const totalCartQuantity = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );
  // localStorage.removeItem('formData');
  // localStorage.removeItem('cart');

  return (
    <>
      <ol className="flex justify-center mb-4 sm:mb-5 w-full p-2">
        <RoutStep
          liCss={`flex w-20 items-center after:content-[''] after:w-full after:h-1 after:inline-block  after:border-b after:border-4 after:border-primary`}
          divCss={`flex items-center justify-center w-10 h-10  rounded-full lg:h-12 lg:w-12 shrink-0 bg-primary`}
          iconCss={`w-4 h-4 text-white lg:w-6 lg:h-6 `}
          iconName={"CalendarEvent"}
        />
        <RoutStep
          liCss={`flex w-20 items-center after:content-[''] after:w-full after:h-1 after:inline-block   after:border-b after:border-4 after:border-primary`}
          divCss={`flex items-center justify-center w-10 h-10  rounded-full lg:h-12 lg:w-12 shrink-0 bg-primary`}
          iconCss={`w-4 h-4 lg:w-6 lg:h-6 text-white`}
          iconName={"Map"}
        />
        <RoutStep
          liCss={`flex items-center`}
          divCss={`flex items-center justify-center w-10 h-10  rounded-full lg:h-12 lg:w-12 shrink-0 bg-primary`}
          iconCss={`w-4 h-4 lg:w-6 lg:h-6 text-white`}
          iconName={"CalendarEvent"}
        />
      </ol>
      <div className="container mx-auto mt-4 bg-white h-screen">
        <hr className="w-full h-1 mx-auto mt-2 bg-gray-300 border-0 rounded" />

        <div className="items-center justify-center mt-1 w-full">
          <div className="w-full bg-white  text-black rounded-lg inline-flex items-center px-4 py-2.5 ">
            <div className="flex justify-between w-full">
              <div className="flex">
                <div className="text-left place-items-start">
                  <div className="mb-1 text-primary">{`Total Harga: Rp${totalCartPrice.toLocaleString(
                    undefined,
                    { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                  )}`}</div>
                  <div className="-mt-1  text-xs text-gray-500">
                    Jumlah Makanan :{totalCartQuantity}
                  </div>
                </div>
              </div>
              <div className="grid place-items-center">
                <Link
                  href={"/tes"}
                  className="flex rounded-lg w-20 h-10 grid grid-cols-3 gap-4 content-center text-white bg-primary p-2 hover:shadow-lg"
                >
                  <IconCirclePlus />
                  add{" "}
                </Link>
              </div>
            </div>
          </div>
        </div>
        <hr className="w-full h-1 mx-auto mt-2 bg-gray-300 border-0 rounded" />

        <div className="items-center justify-center mt-2 w-full">
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
                              {item.id} 1RB terjual | Disukai:20|Max qty:
                              {item.capacity}
                            </div>
                            <div className="mb-1  text-xs">
                              {item.description}
                            </div>
                            <p className="text-gray-700">{`Price: $${item.price.toFixed(
                              2
                            )}`}</p>
                            <p className="text-gray-600 mt-2">{`Total: Rp${item.total.toLocaleString(
                              undefined,
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }
                            )}`}</p>
                            {/* <p className="text-gray-700">{`Total: $${item.total.toFixed(2)}`}</p> */}
                          </div>
                        </div>

                        <div className="grid place-items-center">
                          <div className="flex items-center mt-2">
                            <button
                              className="bg-blue-500 text-white px-2 py-1 rounded-l hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
                              onClick={() => handleDecrease(storeName, item.id)}
                            >
                              -
                            </button>
                            <span className="px-4">{item.quantity}</span>
                            <button
                              className="bg-blue-500 text-white px-2 py-1 rounded-r hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
                              onClick={() => handleIncrease(storeName, item.id)}
                            >
                              +
                            </button>
                          </div>

                          <button
                            className="bg-red-500 text-white px-4 py-2 mt-4 rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
                            onClick={() => handleRemove(storeName, item.id)}
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
          <div className="grid gap-4 content-center">
            <button
              onClick={handleSubmit}
              className="text-white bg-primary hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-full text-sm w-full sm:w-auto px-5 py-2.5 text-center"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default StepThree;
