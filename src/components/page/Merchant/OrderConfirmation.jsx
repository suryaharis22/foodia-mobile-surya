import Header from "@/components/Header";
import Loading from "@/components/Loading";
import Error401 from "@/components/error401";
import styles from "@/styles/Home.module.css";
import { IconMinus, IconPlus } from "@tabler/icons-react";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const OrderConfirmation = () => {
  const router = useRouter();
  const id_order = router.query.id;
  const [loading, setLoading] = useState(true);
  const [dataApi, setDataApi] = useState();
  const [maxOrder, setMaxOrder] = useState(0);
  const [qty, setQty] = useState(0);

  useEffect(() => {
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");
    const status = localStorage.getItem("status");
    const id = localStorage.getItem("id");

    if (
      !role ||
      !token ||
      role !== "merchant" ||
      status !== "approved" ||
      !id
    ) {
      // Redirect to login if either role or token is missing or role is not 'detonator' or status is not 'approved'
      localStorage.clear();
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (id_order) {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}order/fetch/${id_order}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setLoading(false);
          setDataApi(response.data.body);
          setLoading(false);

          const affordablePcs = Math.floor(
            response.data.body.campaign.donation_remaining /
              response.data.body.merchant_product.price
          );

          if (affordablePcs > response.data.body.qty) {
            setMaxOrder(response.data.body.qty);
          } else if (affordablePcs < response.data.body.qty) {
            setMaxOrder(affordablePcs);
          } else {
            setMaxOrder(response.data.body.qty);
          }
        })
        .catch((error) => {
          setLoading(false);
          Error401(error, router);
        });
    }
  }, [id_order]);

  const onSubmit = () => {
    setLoading(true);
    axios
      .post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}order/confirmation`,
        { order_id: parseInt(id_order), qty },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        setLoading(false);
        Swal.fire({
          position: "bottom",
          customClass: {
            popup: "custom-swal",
            icon: "custom-icon-swal",
            title: "custom-title-swal",
            confirmButton: "custom-confirm-button-swal",
          },
          willOpen: () => {
            Swal.getPopup().classList.add("swal2-show-swipeup");
          },
          willClose: () => {
            Swal.getPopup().classList.add("swal2-show-swipedown");
          },
          icon: "success",
          title: `<p class="w-auto pl-1 font-bold text-[25px]">Anda Berhasil Mengkonfirmasi Pesanan</p><p class="w-auto pl-1 font-normal text-[15px]">Terima kasih telah membantu campaign kami</p>`,
          html: `
              <div class="absolute px-24 ml-10 top-0 mt-4">
                <hr class="border border-gray-400 w-10 h-1 bg-gray-400 rounded-lg "/>
              </div>
            `,
          width: "375px",
          showConfirmButton: true,
          confirmButtonText: "Lanjutkan",
          confirmButtonColor: "#3FB648",
          allowOutsideClick: false,
        }).then((result) => {
          if (result.isConfirmed) {
            localStorage.setItem("prevPath", "order_confirmation");
            router.push(`/merchant/detailpesanan/${id_order}`);
          }
        });
      })
      .catch((error) => {
        setLoading(false);
        Error401(error, router);
      });
  };

  return (
    <>
      <div className="h-screen mx-auto pt-14 bg-white">
        <Header title="Konfirmasi Pesanan" />
        <div className="h-full flex flex-col justify-between px-4">
          <div className="w-full">
            <div className="flex flex-col w-full py-10 gap-3">
              <div className="w-full justify-between flex flex-row">
                <p>Sisa Donasi</p>
                <p className="text-primary">
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                  }).format(dataApi?.campaign?.donation_remaining || 0)}
                </p>
              </div>
              <hr className="border-gray-300 border-[1px] h-2px" />
              <div className="w-full justify-between flex flex-row">
                <p>Maksimal Pesanan</p>
                <p className="text-primary">{maxOrder}</p>
              </div>
              <div className="w-full justify-between flex flex-row">
                <p>Pesanan Terkonfirmasi</p>
                <p className="text-primary">{qty}</p>
              </div>
              <hr className="border-gray-300 border-[1px] h-2px" />
              <div className="w-full justify-between flex flex-row">
                <p>Total Pesanan</p>
                <p className="text-primary">
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                  }).format(qty * dataApi?.total_price_product || 0)}
                </p>
              </div>
            </div>
            {loading ? (
              <div className="border border-blue-300 shadow rounded-md p-4 max-w-sm w-80 h-28 mx-auto">
                <div className="animate-pulse flex space-x-4">
                  <div className="rounded-md bg-slate-200 h-16 w-16"></div>
                  <div className="flex-1 space-y-6 py-1">
                    <div className="h-2 bg-slate-200 rounded"></div>
                    <div className="space-y-3">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                        <div className="h-2 bg-slate-200 rounded col-span-1"></div>
                      </div>
                      <div className="h-2 bg-slate-200 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-black rounded-2xl inline-flex items-center px-2 py-2 mb-2 w-full border-[1.5px] border-primary">
                <div className="flex h-30 w-full gap-2">
                  <img
                    className={`grid grid-cols-3 gap-4 place-items-end text-gray-500 rounded-lg object-cover ${styles.img_card}`}
                    src={`${process.env.NEXT_PUBLIC_URL_STORAGE}${dataApi?.merchant_product?.images[0].image_url}`}
                    alt=""
                  />
                  <div className="flex flex-col justify-between w-full">
                    <div className="text-left place-items-start">
                      <div className="text-primary font-bold capitalize">
                        {dataApi?.merchant_product?.name}
                      </div>
                      <div className="mb-1  text-[11px]">
                        Max Kuota: {dataApi?.qty}
                      </div>
                      <div className="mb-1  text-[11px]">
                        {dataApi?.merchant_product?.description}
                      </div>
                    </div>
                    <div className="mt-2 flex flex-row gap-2 justify-between">
                      <p className="font-bold text-xl text-[#6CB28E]">
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          minimumFractionDigits: 0,
                        }).format(dataApi?.total_price_product || 0)}
                      </p>
                      <div className="grid place-items-center">
                        <div className="flex items-center">
                          <button
                            disabled={qty === 0}
                            className=" text-black px-1 py-1 rounded-l hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
                            onClick={() => setQty(qty - 1)}
                          >
                            <IconMinus size={15} />
                          </button>
                          <span className="px-4 text-blue-700 font-bold border rounded-md border-blue-900">
                            {qty}
                          </span>
                          <button
                            disabled={qty === maxOrder}
                            className=" text-black px-1 py-1 rounded-r hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
                            onClick={() => setQty(qty + 1)}
                          >
                            <IconPlus size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="w-full p-2 rounded-md items-end flex pb-10">
            <button
              onClick={() => onSubmit()}
              className={`bg-primary text-white font-bold rounded-xl h-10 w-full `}
            >
              Konfirmasi
            </button>
          </div>
        </div>
        {loading && <Loading />}
      </div>
    </>
  );
};

export default OrderConfirmation;
