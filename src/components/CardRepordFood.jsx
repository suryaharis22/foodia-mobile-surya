import {
  IconCheck,
  IconHourglassEmpty,
  IconPackageExport,
} from "@tabler/icons-react";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Loading from "./Loading";
import Error401 from "./error401";

const CardRepordFood = (props) => {
  const [loading, setLoading] = useState(false);
  const {
    id_order = "#",
    detonator_id,
    campaign_id,
    img,
    title,
    date,
    approval_status = "",
    price = 0,
    qty = 0,
    price_product = 0,
    nameMerchant = "",
    order_status = "",
    is_rating,
    is_report,
  } = props;
  const router = useRouter();
  const { id } = router.query;
  const [role, setRole] = useState();
  const [id_detonator, setIdDetonator] = useState();

  useEffect(() => {
    const role = localStorage.getItem("role");
    setIdDetonator(localStorage.getItem("id"));
    setRole(role);
  }, []);

  const getorder_status = () => {
    switch (order_status) {
      case "review":
        return <IconHourglassEmpty size={22} />;
      case "incoming":
        return <IconHourglassEmpty size={22} />;
      case "diproses":
        return <IconHourglassEmpty size={22} />;
      case "terima":
        return <IconCheck size={22} />;
      case "selesai":
        return <IconPackageExport size={22} />;
      // case "tolak":
      //   return <IconPlaystationX size={22} />;
      default:
        return null;
    }
  };
  const handleButoon = () => {
    const token = localStorage.getItem("token");
    if (order_status === "tolak") {
      if (is_rating) {
        return;
      } else {
        if (
          role === "detonator" &&
          parseInt(detonator_id) === parseInt(id_detonator)
        ) {
          Swal.fire({
            icon: "warning",
            title: "Ganti Menu",
            text: "Apakah anda ingin mengganti menu ini? atau lanjutkan campaign?",
            showConfirmButton: true,
            confirmButtonText: "Ganti Menu",
            confirmButtonColor: "green",
            showDenyButton: true,
            denyButtonText: "Lanjutkan Campaign",
            denyButtonColor: "Orange",
            // timer: 2000,
          }).then((result) => {
            if (result.isConfirmed) {
              localStorage.setItem("order_id", id_order);
              localStorage.setItem("totalAmount", price);
              localStorage.setItem("qty", qty);
              localStorage.setItem("campaign_id", campaign_id);
              router.push(`/detonator/ganti-menu?step=1`);
            } else if (result.isDismissed) {
            } else if (result.isDenied) {
              /// Lanjutkan Campaign

              setLoading(true);
              axios
                .get(
                  `${process.env.NEXT_PUBLIC_API_BASE_URL}campaign/continue-order/${id_order}`,
                  {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                  }
                )
                .then((response) => {
                  Swal.fire({
                    icon: "success",
                    title: "Lanjutkan Campaign",
                    showConfirmButton: true,
                    confirmButtonText: "Lanjutkan",
                    confirmButtonColor: "green",
                  });
                  setLoading(false);
                  router.reload();
                })
                .catch((error) => {
                  setLoading(false);
                  Error401(error, router);
                });
            } else {
              return;
            }
          });
        }
      }
    } else {
      return;
    }
  };

  return (
    <div className="flex justify-center mt-2 w-full mb-2 px-4">
      <div
        className={`bg-white text-black rounded-lg inline-flex items-center w-full shadow-xl p-1`}
      >
        <div className="flex justify-between items-center w-full">
          <div className="flex p-1 items-center">
            <img
              src={img}
              className={`grid grid-cols-3 gap-4 place-items-end text-gray-500 w-14 h-14 object-cover rounded-full`}
              alt=""
            />
            <div className={`text-left ml-2 max-w-[172px]`}>
              <p className="w-full  text-primary  font-bold text-[15px] capitalize">
                {title}
              </p>
              <p className="mb-3  font-normal text-xs">
                {new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  minimumFractionDigits: 0,
                }).format(price_product)} x {qty}
              </p>
              <div className="flex items-end">
                <p className="font-bold text-xs mr-2">
                  Total : {new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0,
                  }).format(price)}
                </p>
                {/* <div
                  className={` text-[10px] capitalize text-white rounded-xl w-16 flex justify-center items-center py-0.5 px-2 ${approval_status === "waiting"
                    ? "bg-[#6B4EFF]"
                    : approval_status == "approved"
                      ? "bg-primary"
                      : approval_status == "rejected"
                        ? "bg-red-500"
                        : approval_status == "canceled" && "bg-orange-500"
                    }`}
                >
                  <p>
                    {approval_status === "waiting"
                      ? "reviewed"
                      : approval_status}
                  </p>
                </div> */}
              </div>
            </div>
          </div>
          {approval_status === "canceled" ? (
            ""
          ) : (
            <div className="grid place-items-center mr-2 mt-2">
              {order_status === "tolak" && role === "detonator" ? (
                <div
                  onClick={handleButoon}
                  className={`rounded-full ${detonator_id != id_detonator
                    ? "hidden"
                    : "cursor-pointer hover:bg-blue-300"
                    }`}
                >
                  <div
                    className={`flex justify-center items-center rounded-full ${order_status === "review"
                      ? "text-[#6B4EFF]"
                      : order_status === "incoming"
                        ? "text-[#6B4EFF]"
                        : order_status === "diproses"
                          ? "text-[#1D5882]"
                          : order_status === "terima"
                            ? "text-[#1D5882]"
                            : order_status === "tolak"
                              ? "text-primary border border-primary px-4 py-1 hover:bg-slate-200"
                              : order_status === "selesai"
                                ? "text-primary"
                                : ""
                      }`}
                  >
                    <p>{getorder_status()}</p>
                    <p className=" text-xs font-bold">{`${order_status === "review"
                      ? "Review Merchant"
                      : order_status === "incoming"
                        ? "Review Admin"
                        : order_status === "diproses"
                          ? "Makanan diproses"
                          : order_status === "terima"
                            ? "Makanan Terkonfirmasi"
                            : order_status === "tolak"
                              ? "Ganti Menu"
                              : order_status === "selesai"
                                ? "Makanan diterima"
                                : ""
                      }`}</p>
                  </div>
                </div>
              ) : (
                <div
                  className={`flex justify-center items-center rounded-full ${order_status === "review"
                    ? "text-[#6B4EFF]"
                    : order_status === "incoming"
                      ? "text-[#6B4EFF]"
                      : order_status === "diproses"
                        ? "text-[#1D5882]"
                        : order_status === "terima"
                          ? "text-[#1D5882]"
                          : order_status === "selesai"
                            ? "text-primary"
                            : ""
                    }`}
                >
                  <p className="mr-1">
                    {order_status === "tolak" ? "" : getorder_status()}
                  </p>
                  <p className="w-[60px] break-words text-xs font-bold">{`${order_status === "review"
                    ? "Review Merchant"
                    : order_status === "incoming"
                      ? "Review Admin"
                      : order_status === "diproses"
                        ? "Makanan diproses"
                        : order_status === "terima"
                          ? "Makanan Terkonfirmasi"
                          : order_status === "selesai"
                            ? "Makanan diterima"
                            : ""
                    }`}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {loading && <Loading />}
    </div>
  );
};

export default CardRepordFood;
