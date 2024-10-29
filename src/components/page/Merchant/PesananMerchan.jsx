import CardPesanan from "@/components/CardPesanan";
import Loading from "@/components/Loading";
import Error401 from "@/components/error401";
import styles from "@/styles/Home.module.css";
import axios from "axios";
import moment from "moment/moment";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import MenuBarMechant from "./MenuBarMechant";

const PesananMerchan = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [dataApi, setDataApi] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("review");

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
    } else {
      // Role is 'detonator' and token is present
      setLoading(false); // Set loading to false once the check is complete
    }
  }, [router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = localStorage.getItem("id");
        const token = localStorage.getItem("token");

        if (!id || !token) {
          throw new Error("Missing required session data");
        }

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}order/filter?merchant_id=${id}&order_status=${selectedStatus}&per_page=100000`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const approvedPesanan = response.data.body.filter(
          (pesanan) => pesanan.campaign.status === "approved"
        );
        setDataApi(approvedPesanan);
        setFilteredData(approvedPesanan);
        setLoading(false);

        if (approvedPesanan.length === 0) {
          setHasMore(false);
        }
      } catch (error) {
        setLoading(false);
        Error401(error, router);
      }
    };

    fetchData();
  }, [loading, selectedStatus]);

  const handleFilterChange = (status = "review") => {
    setLoading(true);

    // if (status === "review") {
    //   setFilteredData(dataApi.filter((data) => data.order_status === "review"));
    // } else if (status === "terima") {
    //   setFilteredData(dataApi.filter((data) => data.order_status === "terima"));
    // } else if (status === "diproses") {
    //   setFilteredData(
    //     dataApi.filter((data) => data.order_status === "diproses")
    //   );
    // }
    if (status === "selesai") {
      setSelectedStatus("selesai,tolak");
    } else {
      setSelectedStatus(status);
    }
  };

  return (
    <>
      <div className="container mx-auto overflow-hidden h-screen">
        <MenuBarMechant />
        <div className="flex justify-between px-7 pt-4 pb-2">
          <div
            className={`w-full cursor-pointer grid pb-2 text-sm font-medium text-center ${
              selectedStatus === "review"
                ? "text-primary border-b-2 border-primary"
                : "text-gray-500"
            }`}
            onClick={() => handleFilterChange("review")}
          >
            <span>Pesanan Baru</span>
          </div>
          <div
            className={`w-full cursor-pointer grid pb-2 text-sm font-medium text-center ${
              selectedStatus === "terima"
                ? "text-primary border-b-2 border-primary"
                : "text-gray-500"
            }`}
            onClick={() => handleFilterChange("terima")}
          >
            <span>Konfirmasi Pesanan</span>
          </div>
          <div
            className={`w-full cursor-pointer grid pb-2 text-sm font-medium text-center ${
              selectedStatus === "diproses"
                ? "text-primary border-b-2 border-primary"
                : "text-gray-500"
            }`}
            onClick={() => handleFilterChange("diproses")}
          >
            <span>Laporan Pesanan</span>
          </div>
          <div
            className={`w-full cursor-pointer grid items-center pb-2 text-sm font-medium text-center ${
              selectedStatus === "selesai,tolak"
                ? "text-primary border-b-2 border-primary"
                : "text-gray-500"
            }`}
            onClick={() => handleFilterChange("selesai")}
          >
            <span>History</span>
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
          <div className={`overflow-auto h-screen px-1 pb-[400px]`}>
            {loading || filteredData.length == 0 ? (
              <p className="text-gray-400  flex justify-center items-center">
                {selectedStatus === "review"
                  ? "Tidak Ada Pesanan"
                  : selectedStatus === "diproses"
                  ? "Tidak Ada Pesanan Berlangsung"
                  : selectedStatus === "selesai" && "Tidak Ada Pesanan Selesai"}
              </p>
            ) : (
              filteredData.map((data) => (
                <CardPesanan
                  key={data.id}
                  total_tax={data.total_tax * data.qty}
                  to={`/merchant/detailpesanan/${data.id}`}
                  idOrder={data.id}
                  img={
                    `${process.env.NEXT_PUBLIC_URL_STORAGE}${data.campaign.image_url}` ||
                    "/img/default-image.png"
                  }
                  title={data.campaign.event_name}
                  productName={data.merchant_product.name}
                  created_at={moment(data.campaign?.created_at).format(
                    "DD MMM YYYY hh:mm"
                  )}
                  date={`${moment(data.campaign?.event_date).format(
                    "DD MMM YYYY"
                  )} ${data.campaign?.event_time}`}
                  qty={data.qty}
                  price={data.merchant_product.price}
                  status={data.order_status}
                  total_amount={data.total_amount + data.total_tax * data.qty}
                  setLoading={setLoading}
                />
              ))
            )}
          </div>
        )}
      </div>
      {loading && <Loading />}
    </>
  );
};

export default PesananMerchan;
