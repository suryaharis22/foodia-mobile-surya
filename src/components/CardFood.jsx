import styles from "@/styles/Home.module.css";
import { IconChevronDown, IconChevronUp, IconEdit } from "@tabler/icons-react";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import Swal from "sweetalert2";

const CardFood = (props) => {
  const {
    idProduct,
    to,
    img,
    title,
    address,
    date,
    status,
    description = "",
    price,
    qty = 0,
  } = props;
  const [showDesc, setShowDesc] = useState(false);

  const formatPrice = (price) => {
    const formatter = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    });

    return formatter.format(price);
  };
  const getStatusIcon = () => {
    switch (status) {
      case "waiting":
        // return <IconClockFilled size={22} />;
        return "Reviewed";
      case "approved":
        // return <IconCircleCheck size={22} />;
        return "Approved";
      case "rejected":
        // return <IconPlaystationX size={22} />;
        return "Rejected";
      default:
        return null;
    }
  };

  const onDeleteMenu = () => {
    Swal.fire({
      icon: "question",
      title: `Hapus Menu ${title}`,
      text: `Kamu Yakin Menghapus Menu Ini?`,
      showConfirmButton: true,
      showCancelButton: true,
      cancelButtonText: "Batal",
      confirmButtonText: "Hapus",
      confirmButtonColor: "#3fb648",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(
            process.env.NEXT_PUBLIC_API_BASE_URL +
              `merchant-product/delete/${idProduct}`,
            {
              headers: {
                authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          )
          .then((res) => {
            Swal.fire({
              icon: "success",
              title: "Berhasil Menghapus Menu",
              showConfirmButton: false,
              timer: 2000,
            });
          })
          .catch((error) => {
            if (error.response && error.response.status === 401) {
              Error401(error, router);
            }
            Swal.fire({
              icon: "error",
              title: "Gagal Menghapus Menu",
              showConfirmButton: false,
              timer: 2000,
            });
          });
      }
    });
  };

  return (
    <div className="flex justify-center mt-1 w-full mb-2 items-start">
      <div
        className={`bg-white flex text-black rounded-2xl items-start border border-primary shadow-lg w-80 p-1`}
      >
        <div className="flex justify-between items-start w-full">
          <div className="flex items-start p-1 w-full">
            <img
              src={img}
              className={`grid min-w-[35%] grid-cols-3 gap-4 place-items-end text-gray-500 rounded-lg object-cover ${styles.img_card}`}
              alt=""
            />
            <div
              className={`text-left ml-2 w-full flex flex-col justify-between min-h-[105px]`}
            >
              <div className="flex flex-col">
                <p className="text-primary font-bold text-md capitalize">
                  {title}
                </p>
                {!showDesc ? (
                  <div className="flex flex-col w-full">
                    <p
                      className={`font-medium w-36 text-[10px] italic text-black truncate`}
                    >
                      {description}
                    </p>
                    {description.length > 40 && (
                      <button
                        onClick={() => setShowDesc(!showDesc)}
                        className="justify-end items-center text-xs py-1 text-primary w-full flex flex-row"
                      >
                        Selengkapnya{" "}
                        <IconChevronDown className="mt-0.5" size="15px" />
                      </button>
                    )}
                  </div>
                ) : (
                  <div>
                    <p className="font-medium text-[10px] italic text-black">
                      {description}
                    </p>
                    <button
                      onClick={() => setShowDesc(!showDesc)}
                      className="justify-end items-center text-xs py-1 text-primary w-full flex flex-row"
                    >
                      Lebih Sedikit{" "}
                      <IconChevronUp className="mt-0.5" size="15px" />
                    </button>
                  </div>
                )}
              </div>
              <div className="flex flex-col mt-5 justify-between items-start w-full">
                <div className="flex justify-between w-full">
                  <span className="text-[#6CB28E] font-bold text-xl">
                    {formatPrice(price)}
                  </span>
                  {status == "approved" ? (
                    <div className="flex gap-1">
                      <Link
                        href={`merchant/product/edit/${idProduct}`}
                        className="flex items-center bg-blue-500 hover:bg-blue-700 text-white font-medium py-3 p-2 text-sm h-2 rounded"
                      >
                        <IconEdit size={15} />
                      </Link>
                    </div>
                  ) : (
                    <div className="pb-1">
                      <div
                        className={`flex justify-center items-center rounded-full h-5 ${
                          status === "waiting"
                            ? "bg-blue-600"
                            : status === "approved"
                            ? "bg-green-500"
                            : status === "rejected"
                            ? "bg-red-500"
                            : ""
                        }`}
                      >
                        <p className="text-white font-medium text-[10px] px-2">
                          {getStatusIcon()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="text-[10px] text-[#1D5882] flex items-center justify-center font-bold">
                  <span>{`(`}</span>
                  <p className="mt-[1px] px-0.5">+ Rp 1.000 - Biaya Platform</p>
                  <span>{`)`}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardFood;
