import styles from "@/styles/Campaign.module.css";
import {
  IconChevronDown,
  IconChevronUp,
  IconClockFilled,
} from "@tabler/icons-react";
import {
  IconClock,
  IconCalendarEvent,
  IconCreditCard,
  IconClipboardCheck,
  IconSoup,
  IconArrowNarrowRight,
  IconBellRingingFilled,
  IconCaretDown,
  IconCaretUp,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
const DetailCamp = ({ data }) => {
  const [showFullText, setShowFullText] = useState(false);
  const router = useRouter();
  const idCamp = router.query.id;
  const toggleReadMore = () => {
    setShowFullText((prevShowFullText) => !prevShowFullText);
  };

  const formatUang = (nominal) => {
    const formatter = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    });

    return formatter.format(nominal);
  };

  const cart = data?.campaign_donation || [];
  const [showAll, setShowAll] = useState(false);

  // Mengurutkan item dalam keranjang belanja
  const sortedCart = [...cart].reverse();

  const calculateTimeAgo = (createdAt) => {
    const now = new Date();
    const createdAtDate = new Date(createdAt);
    const difference = now - createdAtDate;

    const seconds = Math.floor(difference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return ` ${days} hari lalu`;
    } else if (hours > 0) {
      return ` ${hours} jam lalu`;
    } else if (minutes > 0) {
      return ` ${minutes} menit lalu`;
    } else {
      return ` ${seconds} detik lalu`;
    }
  };

  const calculateRemainingTime = (eventDate) => {
    const currentDate = new Date();
    const eventDateObject = new Date(eventDate);
    const timeDifference = eventDateObject - currentDate;

    // Calculate remaining time in days
    const remainingDays = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

    return remainingDays;
  };

  if (!data) {
    // Handle the case where data is not available yet
    return <p>Loading...</p>;
  }
  let percentageCollected = 0;
  data.donation_target > 0
    ? (percentageCollected =
        (data.donation_collected / data.donation_target) * 100)
    : (percentageCollected = 0);

  const totalCollected = (percentageCollected) => {
    if (percentageCollected === undefined || percentageCollected === null) {
      return 0;
    } else if (percentageCollected > 100) {
      return 100;
    } else {
      return percentageCollected;
    }
  };

  const remainingDays = calculateRemainingTime(data.event_date);
  return (
    <>
      <div className="container mx-auto mt-24 bg-white h-screen">
        <div className="place-content-center">
          <img
            src={`${process.env.NEXT_PUBLIC_URL_STORAGE}${data.image_url}`}
            alt=""
            className="rounded-lg"
            style={{ width: "390px", height: "195px", objectFit: "cover" }}
          />
        </div>

        <div className="place-content-center mt-4  p-2">
          <div className="flex">
            <h1>{data.event_name}</h1>
          </div>
          <div className="flex">
            <p>{data.address}</p>
          </div>
          <div className="flex justify-between">
            <p className=" text-sm">
              Tanggal Kegiatan :
              <span className=" text-sm font-medium text-blue-800 ml-1">
                {`${("0" + new Date(data.event_date).getDate()).slice(-2)}-${(
                  "0" +
                  (new Date(data.event_date).getMonth() + 1)
                ).slice(-2)}-${new Date(data.event_date).getFullYear()}`}
              </span>
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-between ">
            <h4> {formatUang(data.donation_target)}</h4>
            <h4 className="flex items-center text-blue-400">
              <IconClock />
              {remainingDays} Hari
            </h4>
          </div>

          {/* <div className="flex justify-between ">
            <ol className="flex items-center mt-2">
              <li className="flex w-24 items-center after:w-full after:border-b after:border-4 after:border-primary">
                <span className="flex items-center justify-center w-6 h-6  rounded-full  bg-primary shrink-0">
                  <IconCalendarEvent className="w-3.5 h-3.5 text-gray-100" />
                </span>
              </li>
              <li className="flex w-24 items-center after:w-full after:h-1 after:border-b  after:border-4  after:border-gray-700">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary shrink-0">
                  <IconCreditCard className="w-3.5 h-3.5 text-gray-100" />
                </span>
              </li>
              <li className="flex items-center w-full">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-700 shrink-0">
                  <IconClipboardCheck className="w-3.5 h-3.5 text-gray-100" />
                </span>
              </li>
            </ol>

            <div
              className={`flex justify-center items-center rounded-full w-24 mt-2 ${
                data.status === "waiting"
                  ? "bg-blue-600"
                  : data.status === "approved"
                  ? "bg-green-500"
                  : data.status === "rejected"
                  ? "bg-red-500"
                  : ""
              }`}
            >
              <p className="text-white">{data.status}</p>
            </div>
          </div> */}
          {/* <div className="flex justify-between px-1.5 items-center ">
            <div className="w-full rounded-full h-2.5 bg-gray-200">
              <div
                className="bg-primary h-2.5 rounded-full w-max-"
                style={{
                  width: `${totalCollected(percentageCollected)}%`,
                  maxWidth: "100%",
                }}
              ></div>
            </div>
            <p className="text-primary  ml-1 mb-1 text-xs">
              {totalCollected(percentageCollected).toFixed()}%
            </p>
          </div> */}
        </div>
        <hr className="w-full h-1 mx-auto mt-2 bg-gray-300 border-0 rounded" />

        <div className="items-center justify-center mt-1 w-full">
          <Link
            href={`/detonator/food/${idCamp}`}
            className="w-full h-16 bg-white hover:bg-gray-100  text-black rounded-lg inline-flex items-center px-2.5 py-2.5 "
          >
            <div className="flex justify-between w-full">
              <div className="flex">
                {/* <IconSoup className=" w-7 h-7" /> */}
                <div className="w-12 h-12 rounded-full bg-blue-100 grid place-items-center mr-2 text-blue-600">
                  {data.detonator.self_photo ? (
                    <img
                      src={`${process.env.NEXT_PUBLIC_URL_STORAGE}${data.detonator.self_photo}`}
                      className="grid grid-cols-3 gap-4 place-items-end text-gray-500 w-12 h-12 object-cover rounded-full"
                      alt="NotFound"
                      width={100}
                      height={100}
                    />
                  ) : (
                    <IconUser className="grid grid-cols-3 gap-4 place-items-end text-gray-500" />
                  )}
                </div>
                <div className="text-left place-items-start">
                  <div className="mb-1 text-primary">
                    {data.detonator?.oauth?.fullname}
                  </div>
                  <div className="-mt-1  text-xs text-gray-500">
                    Verified Campaigner{" "}
                  </div>
                </div>
              </div>
              <div className="grid place-items-center">
                <IconArrowNarrowRight className=" grid grid-cols-3 gap-4 place-items-end text-gray-500" />
              </div>
            </div>
          </Link>
          <hr className="w-80 h-0.5 mx-auto mt-2 mb-2 bg-gray-100 border-0 rounded" />
          {/* Merchants */}
          <Link
            href={`/detonator/food/${idCamp}`}
            className="w-full h-16 bg-white hover:bg-gray-100  text-black rounded-lg inline-flex items-center px-2.5 py-2.5 "
          >
            <div className="flex justify-between w-full">
              <div className="flex">
                {/* <IconSoup className=" w-7 h-7" /> */}
                <div className="w-12 h-12 rounded-full bg-blue-100 grid place-items-center mr-2 text-blue-600">
                  <img
                    src="/img/icon/icon_food_order.png"
                    alt=""
                    className="w-8 h-8"
                  />
                </div>
                <div className="text-left place-items-start">
                  <div className="mb-1 text-primary">Lacak Pesananaaa</div>
                  <div className="-mt-1  text-xs text-gray-500">
                    {data.orders ? data.orders.length : 0} Verified Merchants{" "}
                  </div>
                </div>
              </div>
              <div className="grid place-items-center">
                <IconArrowNarrowRight className=" grid grid-cols-3 gap-4 place-items-end text-gray-500" />
              </div>
            </div>
          </Link>
          <hr className="w-full h-1 mx-auto mt-2 bg-gray-300 border-0 rounded" />
          <Link
            href={`/report/${idCamp}`}
            className="w-full h-16 bg-white hover:bg-gray-100  text-black rounded-lg inline-flex items-center px-2.5 py-2.5 mt-2"
          >
            <div className="flex justify-between w-full">
              <div className="flex">
                <div className="text-left place-items-start">
                  <div className="mb-1 text-primary flex">
                    Kabar Terbaru{" "}
                    <IconBellRingingFilled
                      size={10}
                      className="text-blue-600"
                    />
                  </div>
                  <div className="-mt-1  text-xs text-gray-500">
                    Terahir Update 18 Oktober 2023
                  </div>
                </div>
              </div>
              <div className="grid place-items-center">
                <IconArrowNarrowRight className=" grid grid-cols-3 gap-4 place-items-end text-gray-500" />
              </div>
            </div>
          </Link>
        </div>

        <hr className="w-full h-1 mx-auto mt-2 bg-gray-300 border-0 rounded" />
        <div className="block mt-1 p-2 bg-white">
          <h5 className="mb-2 text-md tracking-tight text-primary">
            Tentang Program
          </h5>
          <p
            className={`font-normal text-gray-700 text-xs  ${
              showFullText ? "" : styles.truncate
            }`}
          >
            {data.description}
          </p>
          <hr className="w-full h-0.5 mx-auto mt-2 bg-gray-100 border-0 rounded" />
          <div className="bg-white grid place-content-center rounded-sm text-primary text-xs mt-2">
            {showFullText ? (
              <button className="flex" onClick={toggleReadMore}>
                Lebih Sedikit <IconChevronUp size={20} />
              </button>
            ) : (
              <button className="flex" onClick={toggleReadMore}>
                Selengkapnya <IconChevronDown size={20} />
              </button>
            )}
          </div>
        </div>

        <hr className="w-full h-1 mx-auto mt-2 bg-gray-300 border-0 rounded" />
        <div className="w-full rounded-lg items-center px-2 py-2.5 mt-4">
          <div className="flex mb-4">
            <p className="text-base font-bold text-black">Donasi</p>
            <div className="bg-green-300 px-1 rounded-lg ml-2 flex items-center">
              <p className="text-xs font-bold text-primary">{cart.length}</p>
            </div>
          </div>
          {/* Looping untuk menampilkan item yang dimuat dalam keranjang belanja */}
          {(showAll ? sortedCart : sortedCart.slice(0, 4)).map(
            (item, index) => (
              <div
                key={index}
                className="w-full h-16 text-black flex flex-col mb-1 items-center"
              >
                <div className="flex justify-between w-full rounded-lg">
                  <div className="flex">
                    {/* <IconSoup className=" w-7 h-7" /> */}
                    <div className="w-12 h-12 rounded-full bg-blue-100 grid place-items-center mr-2 text-blue-600">
                      <img src="/icon/user.png" alt="" className="w-6 h-6" />
                    </div>
                    <div className="text-left place-items-start">
                      <div className="text-primary text-sm font-bold">
                        {" "}
                        {item.transaction.sender_name}
                      </div>
                      <div className=" text-xs text-gray-500">
                        Berdonasi Sebesar{" "}
                        <span className="font-bold">
                          {formatUang(item.amount)}
                        </span>
                      </div>
                      <div className="flex mt-1  text-xs items-center gap-1 text-gray-500">
                        <IconClockFilled size={12} className="mt-0.5" />
                        {calculateTimeAgo(item.created_at)}
                      </div>
                    </div>
                  </div>
                  {/* <div className="grid place-items-center">
                                        <IconArrowNarrowRight className=" grid grid-cols-3 gap-4 place-items-end text-gray-500" />
                                    </div> */}
                </div>
              </div>
            )
          )}
          <hr className="w-full h-0.5 mx-auto mt-2 bg-gray-100 border-0 rounded" />
          <div className="block mt-1 p-2 ">
            <div className="bg-white grid place-content-center rounded-sm text-primary text-xs mt-2">
              {!showAll ? (
                <button
                  className="flex focus:outline-none"
                  onClick={() => setShowAll(true)}
                >
                  Selengkapnya <IconChevronDown size={20} />
                </button>
              ) : (
                <button
                  className="flex focus:outline-none"
                  onClick={() => setShowAll(false)}
                >
                  Lebih Sedikit <IconChevronUp size={20} />
                </button>
              )}
            </div>
          </div>
          {/* <div className="bg-white hover:bg-gray-100 w-full grid place-content-center rounded-sm text-primary text-xs mt-2">
                        <button className="flex" onClick={toggleReadMore}>
                            Selengkapnya {showFullText ? <IconCaretUp size={20} /> : <IconCaretDown size={20} />}
                        </button>
                    </div> */}
        </div>

        {/* <CardCampaign /> */}
      </div>
    </>
  );
};

export default DetailCamp;
