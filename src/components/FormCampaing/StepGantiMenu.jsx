// src/components/FormCampaing/Step.jsx

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import "react-clock/dist/Clock.css";
import "react-time-picker/dist/TimePicker.css";
import RoutStep from "../RoutStep";

import {
  IconChevronDown,
  IconChevronUp,
  IconCirclePlus,
  IconCurrentLocation,
  IconGardenCart,
  IconMapPin,
  IconMinus,
  IconPlus,
} from "@tabler/icons-react";
import axios from "axios";
import dynamic from "next/dynamic";
import Image from "next/image";
import Swal from "sweetalert2";
import Market from "../../../public/img/illustration/market.png";
import Error401 from "../error401";
import CardListMerchan from "../page/Detonator/CardListMerchan";
import AddFoodCamp from "./AddFoodCamp";
import CardChangeMerchant from "../page/Detonator/CardChangeMerchant";
import ChangeFood from "./ChangeFood";
import { IconTrash } from "@tabler/icons-react";
import Header from "../Header";
import Loading from "../Loading";

const DynamicMap = dynamic(() => import("../page/GeoMap"), { ssr: false });

const Toast = Swal.mixin({
  toast: true,
  position: "center",
  iconColor: "white",
  customClass: {
    popup: "colored-toast",
  },
  showConfirmButton: false,
  timer: 1500,
  timerProgressBar: true,
});

function StepOnex({
  cart,
  setCart,
  updateCart,
  loading,
  setLoading,
  dataCampaign,
  order_id,
  totalRejected,
  RejectedQty,
}) {
  const router = useRouter();

  const totalCartPrice = cart.reduce((total, item) => total + item.total, 0);
  const totalCartQuantity = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );
  const groupedCart = cart.reduce((acc, item) => {
    const IdMerchan = item.merchant_id;
    if (!acc[IdMerchan]) {
      acc[IdMerchan] = [];
    }
    acc[IdMerchan].push(item);
    return acc;
  }, {});

  const handleDecrease = (IdMerchan, itemId) => {
    const updatedCart = [...cart];

    const itemIndex = updatedCart.findIndex(
      (item) => item.merchant_id === parseInt(IdMerchan) && item.id === itemId
    );

    if (itemIndex !== -1) {
      const updatedItem = { ...updatedCart[itemIndex] };

      if (updatedItem.quantity > 1) {
        updatedItem.quantity -= 1;
        updatedItem.total = updatedItem.quantity * updatedItem.price;

        updatedCart[itemIndex] = updatedItem;

        const totalCartPrice = updatedCart.reduce(
          (total, item) => total + item.total,
          0
        );
        const totalCartQuantity = updatedCart.reduce(
          (total, item) => total + item.quantity,
          0
        );

        updateCart(updatedCart, totalCartPrice, totalCartQuantity);
      } else {
        handleRemove(IdMerchan, itemId);
      }
    } else {
      console.warn("Item not found in cart:", { IdMerchan, itemId });
    }
  };

  const handleIncrease = (IdMerchan, itemId, capacity) => {
    const updatedCart = [...cart];
    const itemIndex = updatedCart.findIndex(
      (item) => item.merchant_id === parseInt(IdMerchan) && item.id === itemId
    );

    if (
      updatedCart[itemIndex].quantity >= capacity ||
      updatedCart[itemIndex].quantity >= RejectedQty
    ) {
      return;
    }
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

  const handleRemove = (IdMerchan, itemId) => {
    const updatedCart = cart.filter(
      (item) =>
        !(item.merchant_id === parseInt(IdMerchan) && item.id === itemId)
    );
    const totalCartPrice = updatedCart.reduce(
      (total, item) => total + item.total,
      0
    );
    const totalCartQuantity = updatedCart.reduce(
      (total, item) => total + item.quantity,
      0
    );
    updateCart(updatedCart, totalCartPrice, totalCartQuantity);
  };

  const handleSubmit = () => {
    setLoading(true);
    const detonator_id = localStorage.getItem("id");
    const token = localStorage.getItem("token");
    const totalCartPrice = cart.reduce((total, item) => total + item.total, 0);
    const totalCartQuantity = cart.reduce(
      (total, item) => total + item.quantity,
      0
    );

    if (totalCartQuantity < RejectedQty || totalCartQuantity === RejectedQty) {
      const eventData = {
        order_id: parseInt(order_id),
        product: {
          merchant_id: parseInt(cart[0].merchant_id),
          merchant_product_id: parseInt(cart[0].id),
          qty: 2,
        },
      };
      const response = axios
        .post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}campaign/change-menu`,
          eventData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          setLoading(false);
          Swal.fire({
            icon: "success",
            title: "Menu Order Berhasil!",
            text: "Menu Order Berhasil diubah",
            showConfirmButton: false,
            timer: 2000,
          });

          setTimeout(() => {
            localStorage.removeItem("cart");
            setCart([]);
            router.push(`/food/${dataCampaign.id}`);
          }, 2000);
        })
        .catch((error) => {
          setLoading(false);
          if (401 === error.response?.status) {
            localStorage.removeItem("cart");
            setCart([]);
            Error401(error, router);
          }
          Swal.fire({
            icon: "warning",
            title: "Maaf Perminttan diterima",
            text: "Total menu order melebihi jumlah sebelumnya",
            showConfirmButton: true,
            confirmButtonText: "Tutup",
            confirmButtonColor: "red",
          });
        });
    } else {
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "Total Harga Melebihi Dosasi Target",
        showConfirmButton: true,
        confirmButtonText: "Tutup",
        confirmButtonColor: "red",
      }).then((result) => {
        if (result.isConfirmed) {
          setLoading(false);
          localStorage.removeItem("cart");
          setCart([]);
          // router.push(`/detonator/ganti-menu?ord=${order_id}&cmp=${dataCamopaign.id}&step=3`);
        }
      });
    }
    return;

    // Retrieve formData from local storage
    // const totalCartPrice = cart.reduce(
    //     (total, item) => total + item.total,
    //     0
    // );

    // const products = cart.map((item) => ({
    //     merchant_id: parseInt(item.merchant_id),
    //     merchant_product_id: parseInt(item.id),
    //     qty: parseInt(item.quantity),
    // }));

    // return;
  };

  const handleLink = () => {
    router.push(
      `/detonator/ganti-menu?ord=${order_id}&cmp=${dataCamopaign.id}&step=2`
    );
  };
  const handleRemoveAll = () => {
    localStorage.removeItem("cart");
    setCart([]);
  };

  // localStorage.removeItem('formData');
  // localStorage.removeItem('cart');

  return (
    <>
      <div className="container mx-auto">
        {/* <hr className="w-full h-1 mx-auto mt-2 bg-gray-300 border-0 rounded" /> */}
        <div className="items-center justify-center mt-5 w-full">
          <div className="w-full bg-white  text-black rounded-lg inline-flex items-center px-4 py-2.5 ">
            <div
              className={`flex ${Object.keys(groupedCart).length > 0
                ? "justify-between"
                : "justify-center"
                } w-full`}
            >
              <div className="flex">
                {Object.keys(groupedCart).length > 0 ? (
                  <div className="text-left place-items-start">
                    <div className="font-medium text-xs text-gray-500">
                      Total {totalCartQuantity} Pesanan
                    </div>
                    <div className="text-primary font-bold text-lg">{`Rp ${totalCartPrice.toLocaleString(
                      undefined,
                      { minimumFractionDigits: 0, maximumFractionDigits: 0 }
                    )}`}</div>
                  </div>
                ) : (
                  ""
                )}
              </div>
              <div className="flex justify-center items-center content-center">
                <button
                  onClick={handleLink}
                  type="submit"
                  className="text-primary hover:text-white flex flex-row items-center gap-1 border-2 border-primary hover:bg-primary focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-xl text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                >
                  <IconCirclePlus />
                  Menu
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* <div className="items-center justify-center w-full"> */}
        <div className="items-center justify-center w-full">
          {/* <hr className="w-full h-1 mx-auto mt-2 bg-gray-300 border-0 rounded" /> */}
          {Object.keys(groupedCart).length > 0
            ? Object.keys(groupedCart).map((IdMerchan, storeIndex) => (
              <div key={storeIndex} className="mb-4 p-2">
                {/* <h2 className="text-xl font-semibold my-2">ID :{IdMerchan}</h2> */}
                {groupedCart[IdMerchan].map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="bg-white text-black rounded-lg inline-flex items-center px-2 py-2 mb-2 w-full border border-primary"
                  >
                    <div className="flex h-30 w-full">
                      <img
                        className="w-28 h-28 rounded-xl bg-blue-100 mr-2 text-blue-600"
                        src={`${process.env.NEXT_PUBLIC_URL_STORAGE}${item.images.length > 0
                          ? item.images[0].image_url
                          : ""
                          }`}
                        alt=""
                      />
                      <div className="flex flex-col justify-between w-full">
                        <div className="text-left place-items-start">
                          <div className="text-primary font-bold capitalize">
                            {item.name}
                            {/* {item.imageUrl} */}
                          </div>
                          <div className="mb-1  text-[11px]">
                            {/* terjual | Disukai oleh: 20 | */}
                            Max Quota: {item.capacity}
                          </div>
                          <div className="mb-1  text-[11px]">
                            {item.description}
                          </div>
                          {/* <p className="text-gray-600 mt-2">{`Total: Rp${(item.total).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</p> */}
                          {/* <p className="text-gray-700">{`Total: $${item.total.toFixed(2)}`}</p> */}
                        </div>
                        <div className="mt-2 flex flex-row gap-4 justify-between">
                          <p className="font-bold text-primary">{`Rp ${(
                            item.price * item.quantity
                          ).toLocaleString(undefined, {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          })}`}</p>
                          <div className="grid place-items-center">
                            <div className="flex items-center">
                              <button
                                className=" text-black px-2 py-1 rounded-l hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
                                onClick={() =>
                                  handleDecrease(
                                    IdMerchan,
                                    item.id,
                                    item.capacity
                                  )
                                }
                              >
                                <IconMinus size={15} />
                              </button>
                              <span className="px-4 text-blue-700 font-bold border rounded-md border-blue-900">
                                {item.quantity}
                              </span>
                              <button
                                className=" text-black px-2 py-1 rounded-r hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
                                onClick={() =>
                                  handleIncrease(
                                    IdMerchan,
                                    item.id,
                                    item.capacity
                                  )
                                }
                              >
                                <IconPlus size={15} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))
            : ""}
        </div>
        {/* </div> */}

        {Object.keys(groupedCart).length > 0 ? (
          <div className="grid gap-4 h-screencontent-center px-4">
            <button
              onClick={handleSubmit}
              className="text-white bg-primary hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-xl text-sm w-full sm:w-auto px-5 py-2.5 text-center"
            >
              Lanjut
            </button>
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
}

function StepOne({ loading, setLoading, dataCampaign, order_id }) {
  const router = useRouter();
  const [dataApi, setDataApi] = useState([]);
  const id_camp = dataCampaign?.id;

  const detonator_id = localStorage.getItem("id");
  const token = localStorage.getItem("token");

  useEffect(() => {
    setLoading(true);
    axios
      .get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}merchant/filter?per_page=100000`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setLoading(false);
        const approvedMerchants = response.data.body.filter((merchant) => {
          return (
            merchant.status === "approved" &&
            merchant.products.some((product) => product.status === "approved")
          );
        });
        setDataApi(approvedMerchants);
      })
      .catch((error) => {
        setLoading(false);
        Error401(error, router);
      });
  }, [detonator_id, token]);

  return (
    <div className="container mx-auto px-4 bg-white">
      <p className="text-black font-light text-xs mb-5 flex flex-row items-center justify-center gap-1">
        <IconMapPin color="red" />
        {dataCampaign?.address}
      </p>
      <div className="flex justify-center">
        <Image src={Market} />
      </div>
      <p className="py-2 pb-7 font-semibold text-black text-xl">
        Merchant Terdekat
      </p>

      <div className="items-center justify-center w-full">
        <div className="items-center justify-center w-full">
          {loading && <Loading />}

          {dataApi.map((item) => (
            <>
              <CardChangeMerchant
                key={item.id}
                data={item}
                order_id={order_id}
                id_camp={id_camp}
              />
            </>
          ))}
        </div>
      </div>
    </div>
  );
}
function StepTwo({
  loading,
  setLoading,
  dataCampaign,
  order_id,
  total_amounts,
}) {
  const [groupedFoods, setGroupedFoods] = useState({});
  const router = useRouter();
  const IdMerchan = router.query.id;
  const nameMerchant = router.query.name;
  const token = localStorage.getItem("token");
  const [merchant_product_id, setMerchant_product_id] = useState();
  const [quantity, setQuantity] = useState(0);
  const [productIndex, setIndex] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    setLoading(true);
    axios
      .get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}merchant-product/filter?merchant_id=${IdMerchan}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setLoading(false);
        // Filter foods with status 'approved'
        const approvedFoods = response.data.body.filter(
          (food) => food.status === "approved"
        );

        // Group approved foods by store
        const groupedByMerchant = approvedFoods.reduce((acc, food) => {
          const { merchant_id } = food;
          if (!acc[merchant_id]) {
            acc[merchant_id] = [];
          }
          acc[merchant_id].push(food);
          return acc;
        }, {});
        setGroupedFoods(groupedByMerchant);
      })
      .catch((error) => {
        setLoading(false);
        Error401(error, router);
      });
  }, []);

  const handleIncrease = (id, price, index) => {
    setTotalPrice(totalPrice + price);
    setQuantity(quantity + 1);
    setMerchant_product_id(id);
    setIndex(index);
  };

  const handleDecrease = (price, index) => {
    setIndex(index);
    setTotalPrice(totalPrice - price);
    setQuantity(quantity - 1);
  };

  const [showDesc, setShowDesc] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    const token = localStorage.getItem("token");

    const eventData = {
      order_id: parseInt(order_id),
      product: {
        merchant_id: parseInt(IdMerchan),
        merchant_product_id: merchant_product_id,
        qty: quantity,
      },
    };
    axios
      .post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}campaign/change-menu`,
        eventData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setLoading(false);
        Swal.fire({
          icon: "success",
          title: "Menu Order Berhasil!",
          text: "Menu Order Berhasil diubah",
          showConfirmButton: false,
          timer: 2000,
        });

        setTimeout(() => {
          router.push(`/food/${dataCampaign.id}`);
        }, 2000);
      })
      .catch((error) => {
        setLoading(false);
        Error401(error, router);
      });
  };

  return (
    <div className="w-full py-2">
      <p className="text-black font-light text-xs mb-5 flex flex-row items-center justify-center gap-1">
        <IconMapPin color="red" />
        {dataCampaign?.address}
      </p>
      <div className="items-center justify-center mt-2 w-full px-4">
        {Object.keys(groupedFoods).map((IdMerchan) => (
          <>
            <div key={IdMerchan} className="mb-2 flex flex-col gap-2">
              <h2 className="text-[17px] text-black font-bold">
                {nameMerchant}
              </h2>
              {groupedFoods[IdMerchan].map((food, index) => (
                <div
                  key={index}
                  className="w-full bg-white text-black border border-primary rounded-lg inline-flex items-center px-2 py-2.5"
                >
                  <div className="flex justify-between w-full">
                    <div className="flex w-full">
                      <img
                        className="w-10 h-10 rounded-full bg-blue-100 grid place-items-center mr-2 text-blue-600"
                        src={`${process.env.NEXT_PUBLIC_URL_STORAGE}${food.images[0].image_url}`}
                        alt=""
                      />
                      <div className="text-left place-items-start w-full">
                        <div className="mb-1 capitalize text-primary font-bold">
                          {food.name}
                        </div>
                        {!showDesc && food.description.length > 60 ? (
                          <>
                            <div className=" text-xs text-gray-500 truncate w-60">
                              {food.description}
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
                            <div className=" text-xs text-gray-500 w-48">
                              {food.description}
                            </div>
                            {food.description.length > 60 && (
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
                            <p className=" text-xs text-primary mt-2 mr-2">{`Capacity: ${food.qty}`}</p>
                            <p className="text-xs mt-0.5 text-primary">{`Harga: Rp ${parseInt(
                              food.price
                            ).toLocaleString(undefined, {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            })}`}</p>
                          </div>
                          <div className="flex items-center">
                            <button
                              disabled={
                                quantity === 0 || index !== productIndex
                              }
                              className=" text-black px-2 py-1 rounded-l hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
                              onClick={() => handleDecrease(food.price, index)}
                            >
                              <IconMinus size={15} />
                            </button>
                            <span className="px-4 text-blue-700 font-bold border rounded-md border-blue-900">
                              {index === productIndex ? quantity : 0}
                            </span>
                            <button
                              disabled={
                                totalPrice >= parseInt(total_amounts) ||
                                food.price > parseInt(total_amounts)
                              }
                              className=" text-black px-2 py-1 rounded-r hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
                              onClick={() =>
                                handleIncrease(food.id, food.price, index)
                              }
                            >
                              <IconPlus size={15} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ))}
        <p className="text-red-400 pb-4">
          Max Total Harga :{" "}
          {new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
          }).format(parseInt(total_amounts) || 0)}
        </p>
        <button
          className={`${totalPrice > parseInt(total_amounts) ? "bg-gray-400" : "bg-primary"
            } w-full text-white py-2 rounded-xl font-bold`}
          disabled={totalPrice > parseInt(total_amounts)}
          onClick={() => handleSubmit()}
        >
          Pilih
        </button>
      </div>
      {loading && <Loading />}
    </div>
  );
}

export { StepOne, StepTwo };
