import styles from "@/styles/Home.module.css";
import { IconClock } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const CardReview = (props) => {
  const router = useRouter();
  const [role, setRole] = useState(localStorage.getItem("role"));
  const page = router.route;
  const {
    idKey,
    to,
    img,
    title,
    description,
    date,
    status,
    address,
    donation_target,
    harga,
    qty,
    TotalHarga,
    nameProduct,
    time,

    donation_collected = 0,
  } = props;
  const [Terkumpul, setTerkumpul] = useState(0);
  const calculateRemainingTime = (eventDate) => {
    const currentDate = new Date();
    const eventDateObject = new Date(eventDate);
    const timeDifference = eventDateObject - currentDate;

    // Calculate remaining time in days
    let remainingDays = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

    if (remainingDays < 0) {
      remainingDays = 0;
    }

    return remainingDays;
  };

  const formatUang = (nominal) => {
    const formatter = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    });

    return formatter.format(nominal);
  };
  // const percentageCollected = (donation_collected / donation_target) * 100;
  let percentageCollected = 0;
  donation_target > 0
    ? (percentageCollected = (donation_collected / donation_target) * 100)
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

  useEffect(() => {
    if (donation_target > donation_collected) {
      setTerkumpul(donation_collected);
    } else {
      setTerkumpul(donation_target);
    }
  }, [donation_collected, donation_target]);

  return (
    <div className="flex justify-center mt-2.5 w-full mb-2 px-6" key={idKey}>
      <Link
        href={to}
        className={`bg-white hover:bg-gray-100 text-black rounded-lg shadow-lg w-full p-1`}
      >
        <div className="flex px-1.5 pt-1.5">
          <img
            src={img}
            className={`grid grid-cols-3 gap-4 place-items-end bg-gray-200 rounded-lg object-cover w-[75px] h-[75px]`}
            alt=""
          />
          {role == "merchant" ? (
            <div className={`px-2 ${styles.text_card}`}>
              <p className="  font-bold text-[14px] capitalize text-primary ">
                {title}
              </p>
              <div className="flex mb-2 italic">
                <p className=" text-[8px] text-gray-500 mr-1">
                  Tanggal Campaign :
                </p>
                <p className="font-bold text-[8px] text-black ">
                  {date} {time}
                </p>
              </div>
              <p className="  text-[10px] italic">
                {qty} X {nameProduct}
              </p>
              <div className="flex justify-between  items-center ">
                <p className="text-green  text-[18px] font-bold">
                  Rp. {TotalHarga?.toLocaleString("id-ID")}
                </p>
                {status == "Completed" ? (
                  <>
                    <div
                      className={` text-[8px] text-white rounded-xl p-1 flex justify-center items-center ${
                        status == "waiting"
                          ? "bg-blue-600"
                          : status == "Completed"
                          ? "bg-primary"
                          : status == "rejected"
                          ? "bg-red-500"
                          : ""
                      }`}
                    >
                      <p className="">{status}</p>
                    </div>
                  </>
                ) : null}
              </div>
              <div className="text-[9px] pb-1 w-full text-[#1D5882] flexfont-bold">
                <p>
                  {`( Termasuk ${(1000 * qty)?.toLocaleString(
                    "id-ID"
                  )} Biaya Platform )`}
                </p>
              </div>
            </div>
          ) : (
            <div className={`px-2 ${styles.text_card}`}>
              <div className="flex justify-between">
                <p className="mb-1 text-black font-bold text-[14px] capitalize">
                  {title}
                </p>
                {status == "Completed" && role == "detonator" ? (
                  <div
                    className={`h-[16px]  text-[8px] text-white rounded-lg p-1 flex justify-center items-center ${
                      status == "waiting"
                        ? "bg-blue-600"
                        : status == "Completed"
                        ? "bg-primary"
                        : status == "rejected"
                        ? "bg-red-500"
                        : ""
                    }`}
                  >
                    <p className="">{status}</p>
                  </div>
                ) : null}
              </div>
              {status == "Completed" && role == "merchant" ? (
                <>
                  <div className="flex mb-2">
                    <p className=" text-[8px] text-gray-500 mr-1">
                      Tanggal Campaign :
                    </p>
                    <p className="font-bold text-[8px] text-black">
                      {date} {time}
                    </p>
                  </div>
                  <p className="  text-[10px]">
                    {qty} X {nameProduct}
                  </p>
                  <div className="flex justify-between  items-center ">
                    <p className="text-green  mb-1 text-[18px] font-bold">
                      Rp. {TotalHarga?.toLocaleString("id-ID")}
                    </p>
                    <div
                      className={` text-[8px] text-white rounded-lg p-1 flex justify-center items-center ${
                        status == "waiting"
                          ? "bg-blue-600"
                          : status == "Completed"
                          ? "bg-primary"
                          : status == "rejected"
                          ? "bg-red-500"
                          : ""
                      }`}
                    >
                      <p className="">{status}</p>
                    </div>
                  </div>
                </>
              ) : (
                <p
                  className={` text-[10px] font-normal mr-2 ${styles.cutTextCard}`}
                >
                  {address}
                </p>
              )}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default CardReview;
