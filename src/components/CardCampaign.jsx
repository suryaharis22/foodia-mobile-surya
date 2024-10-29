import styles from "@/styles/Home.module.css";
import { IconClock } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const CardCampaign = (props) => {
  const router = useRouter();
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
    rating,
    donation_target,
    harga,
    qty,
    TotalHarga,
    nameProduct,
    time,
    from,
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
        {from === "home" ? (
          <div className="flex px-1.5 pt-1.5">
            <img
              src={img}
              className={` grid grid-cols-3 gap-4 place-items-end bg-gray-200 rounded-lg object-cover ${styles.img_card}`}
              alt=""
            />
            <div className={`px-2 ${styles.text_card}`}>
              <p className="mb-1 text-black font-bold text-sm capitalize">
                {title}
              </p>
              {status == "Completed" ? (
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
                      className={` text-xs text-white rounded-lg p-1 flex justify-center items-center ${status == "waiting"
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
                  className={` text-xs font-normal mr-2 ${styles.cutTextCard}`}
                >
                  {address}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex p-2 justify-between">
            <img
              src={img}
              className={`grid grid-cols-3 gap-4 place-items-end bg-gray-200 rounded-lg object-cover w-20 h-20`}
              alt=""
            />
            <div className={`px-2`}>
              <p className="mb-1 max-w-[120px] text-black font-bold text-xl capitalize">
                {title}
              </p>
              <p className={` text-xs font-normal`}>{address}</p>
            </div>
            <div
              className={` h-5 capitalize px-2 text-xs text-white rounded-xl p-1 flex justify-center items-center ${status == "waiting"
                  ? "bg-blue-600"
                  : status == "approved"
                    ? "bg-primary"
                    : status == "rejected"
                      ? "bg-red-500"
                      : ""
                }`}
            >
              <p className="">{status}</p>
            </div>
          </div>
        )}

        {!rating && from === "home" && (
          <>
            <div className="flex justify-between px-1.5 mt-1.5">
              <p className=" text-xs">
                Target Donasi:
                <span className=" text-xs font-medium text-blue-800 ml-2">
                  {formatUang(donation_target ? donation_target : 0)}
                </span>
              </p>
              <div className="flex items-center font-medium text-blue-800  text-xs">
                <IconClock size={11} />
                <p className=" ml-1">{calculateRemainingTime(date)} Hari</p>
              </div>
            </div>
            <div className="flex justify-between px-1.5 ">
              <p className=" text-xs">
                Donasi Terkumpul:
                <span className=" text-xs font-medium text-blue-800 ml-2">
                  {formatUang(Terkumpul ? Terkumpul : 0)}
                </span>
              </p>
              {page === "/home" ? (
                ""
              ) : (
                <div
                  className={`flex items-center justify-center  font-medium   text-xs  rounded-lg px-1 ${status == "waiting"
                      ? "bg-blue-600"
                      : status == "approved"
                        ? "bg-green-500"
                        : status == "rejected"
                          ? "bg-red-500"
                          : status == "Completed"
                            ? "bg-primary"
                            : ""
                    }`}
                >
                  <p
                    className={` mb-1  ${status == "approved"
                        ? "text-white"
                        : status == "Completed"
                          ? "text-white"
                          : "text-white"
                      }`}
                  >
                    {status}
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-between px-1.5 items-center ">
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
            </div>
          </>
        )}
      </Link>
    </div>
  );
};

export default CardCampaign;
