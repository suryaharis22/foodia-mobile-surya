import BottomNav from "@/components/BottomNav";
import CardReview from "@/components/CardReview";
import Error401 from "@/components/error401";
import Header from "@/components/Header";
import MenuBarMechant from "@/components/page/Merchant/MenuBarMechant";
import styles from "@/styles/Home.module.css";
import axios from "axios";
import { Inter } from "next/font/google";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";

const inter = Inter({ subsets: ["latin"] });

export default function PageMerchant() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [dataApi, setDataApi] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("KirimUlasan");
  // const [cekData, setCekData] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();
  const [jumlah, setJumlah] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire({
        icon: "error",
        title: "Akses Dibatasi",
        text: ` Mohon untuk login kembali menggunakan akun Merchant.`,
        showConfirmButton: true,
        confirmButtonText: "Login",
        confirmButtonColor: "green",
        showCancelButton: true,
        cancelButtonText: "Tutup",
        cancelButtonColor: "red",
        // timer: 2000,
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/login");
        } else if (result.isDismissed) {
          router.push("/home");
        }
      });
    } else {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}auth/check-register-status`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          const cekData = response.data.body;
          if (!cekData.merchant) {
            Swal.fire({
              icon: "warning",
              title: "Akun Belum Terdaftar sebagai Merchant",
              text: "Mohon untuk registrasi sebagai Merchant",
              showConfirmButton: true,
              confirmButtonColor: "green",
              confirmButtonText: "Registrasi",
              showCancelButton: true,
              cancelButtonColor: "red",
              cancelButtonText: "Tutup",
              // timer: 2000,
            }).then((result) => {
              if (result.isConfirmed) {
                router.push("/merchant/syarat");
              } else if (result.isDismissed) {
                router.push("/home");
              }
            });
          } else {
            if (cekData.merchant.status == "waiting") {
              localStorage.setItem("id", cekData.merchant.merchant_id);
              localStorage.setItem("role", "merchant");
              localStorage.setItem("status", cekData.merchant.status);
              localStorage.setItem("note", cekData.merchant.note);

              Swal.fire({
                icon: "warning",
                title: "Akun Merchant Anda Belum Terverifikasi",
                text: ` Mohon tunggu konfirmasi dari admin kami`,
                showConfirmButton: false,
                showCancelButton: true,
                cancelButtonColor: "red",
                cancelButtonText: "Tutup",
              }).then((result) => {
                if (result.isDismissed) {
                  router.push("/home");
                }
              });
            } else if (cekData.merchant.status == "rejected") {
              setLoading(false);
              localStorage.setItem("id", cekData.merchant.merchant_id);
              localStorage.setItem("role", "merchant");
              localStorage.setItem("status", cekData.merchant.status);
              localStorage.setItem("note", cekData.merchant.note);
              Swal.fire({
                icon: "warning",
                title: "Merchant ditolak",
                text: `${cekData.merchant.note}`,
                showConfirmButton: false,
                timer: 2000,
              });
              setTimeout(() => {
                router.push("/merchant/edit-merchant?step=1");
              }, 2000);
            } else {
              localStorage.setItem("id", cekData.merchant.merchant_id);
              localStorage.setItem("role", "merchant");
              localStorage.setItem("status", cekData.merchant.status);
              localStorage.setItem("note", cekData.merchant.note);
              getReviwe(cekData.merchant.merchant_id, token);
            }
          }
        })
        .catch((error) => {
          if (error.response && error.response.status === 401) {
            Error401(error, router);
          }
        });
    }
  }, []);

  const getReviwe = (id, token) => {
    axios
      .get(
        process.env.NEXT_PUBLIC_API_BASE_URL +
        `rating/not-reviewed?type=merchant&id=${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setJumlah(response.data.body.length);
        setDataApi(response.data.body);
        // const filtered = response.data.body.filter(
        //     (data) => data.is_rating === false && data.approval_status === "approved"
        // )
        // setFilteredData(filtered);
        setFilteredData(response.data.body);
        setLoading(false);

        if (response.data.body.length === 0) {
          setHasMore(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        Error401(error, router);
        console.error("Error fetching data:", error);

        if (error.response && error.response.status === 401) {
          // Unauthorized error (e.g., token expired)
          localStorage.clear();
          router.push("/login");
        }
      });
  };

  const handleFilterChange = (status) => {
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("id");
    let filtered = [];
    setLoading(true);

    if (status === "KirimUlasan") {
      // Show items with 'waiting' or 'rejected' status
      filtered = dataApi;
      setFilteredData(filtered);
      setLoading(false);
    } else if (status === "UlasanSelesai") {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}rating/filter?relation_id=${id}&type=merchant`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          setFilteredData(res.data.body);
          setLoading(false);
        })
        .catch((error) => {
          Error401(error, router);
        });
    }

    setSelectedStatus(status);
  };

  return (
    <main className="">
      <Header title="Merchant" backto="/home" />
      <div className="my-0 mx-auto min-h-screen max-w-480 overflow-x-hidden bg-white flex flex-col">
        {/* <Hero /> */}
        <div className="container mx-auto h-screen">
          <MenuBarMechant />
          <div className="flex justify-between px-7 pt-4 pb-2 text-[14px] font-semibold">
            <div
              className={`w-full cursor-pointer grid pb-2 justify-items-center ${selectedStatus === "KirimUlasan"
                ? "text-green border-b-2 border-green"
                : "text-gray-500"
                }`}
              onClick={() => handleFilterChange("KirimUlasan")}
            >
              <div className="flex justify-between ">
                <span>Kasih Ulasan</span>
                {jumlah !== 0 && (
                  <div className="h-[16px] w-[16px] bg-red-500 rounded-full flex justify-center items-center text-[8px] font-bold text-white">
                    <span>{jumlah}</span>
                  </div>
                )}
              </div>
            </div>
            <div
              className={`w-full cursor-pointer grid pb-2  justify-items-center ${selectedStatus === "UlasanSelesai"
                ? "text-green border-b-2 border-green"
                : "text-gray-500"
                }`}
              onClick={() => handleFilterChange("UlasanSelesai")}
            >
              <span>Ulasan Selesai</span>
            </div>
          </div>

          {loading ? (
            <div className={`${styles.card}`}>
              {[...Array(4)].map((_, index) => (
                <div key={index} className={`${styles.loadingCard}`}>
                  <div className={`${styles.shimmer}`}></div>
                </div>
              ))}
            </div>
          ) : (
            <div className={`${styles.card}`}>
              {!filteredData || filteredData.length === 0 ? (
                <p className="text-gray-400">
                  {selectedStatus === "approved"
                    ? "Belum Ada Menu"
                    : "Tidak Ada Pengajuan"}
                </p>
              ) : (
                <>
                  {selectedStatus === "KirimUlasan" ? (
                    <>
                      {filteredData.map((dataFilter) => (
                        <CardReview
                          key={dataFilter.id}
                          to={`/merchant/review/${dataFilter.order_id}?id_camp=${dataFilter.campaign_id}`}
                          img={`${process.env.NEXT_PUBLIC_URL_STORAGE}${dataFilter.event_image}`}
                          title={dataFilter?.event_name}
                          description={"sfsfsf"}
                          date={dataFilter?.event_date}
                          time={dataFilter?.event_time}
                          address={`${dataFilter.order?.campaign?.address}`}
                          rating={true}
                          qty={dataFilter.qty}
                          harga={dataFilter.order?.merchant_product?.price}
                          // status={'Completed'}
                          TotalHarga={dataFilter?.total_amount}
                          nameProduct={dataFilter?.product_name}
                        />
                      ))}
                    </>
                  ) : selectedStatus === "UlasanSelesai" &&
                    filteredData.length > 0 ? (
                    <>
                      {filteredData.map((dataFilter, index) => (
                        <CardReview
                          key={index}
                          to={`/merchant/detail-review/${dataFilter.id}?id_camp=${dataFilter.order?.campaign_id}`}
                          img={`${process.env.NEXT_PUBLIC_URL_STORAGE}${dataFilter.order?.campaign?.image_url}`}
                          title={dataFilter?.order?.campaign?.event_name}
                          description={"sfsfsf"}
                          date={dataFilter.order?.campaign.event_date}
                          time={dataFilter.order?.campaign.event_time}
                          address={`${dataFilter.order?.campaign?.address}`}
                          rating={true}
                          qty={dataFilter.order?.qty}
                          harga={dataFilter.order?.merchant_product?.price}
                          status={"Completed"}
                          TotalHarga={dataFilter.order?.total_amount}
                          nameProduct={dataFilter.order?.merchant_product?.name}
                        />
                      ))}
                    </>
                  ) : null}
                </>
              )}
            </div>
          )}
        </div>
        {/* <HomePage /> */}
      </div>
      <BottomNav />
    </main>
  );
}
