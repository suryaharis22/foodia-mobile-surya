import Header from "@/components/Header";
import Error401 from "@/components/error401";
import styles from "@/styles/Home.module.css";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const Saldo = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [dataApi, setDataApi] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("diproses");
  const [balance, setBalance] = useState(0);
  const [riwayat, setRiwayat] = useState([]);
  const [hasMore, setHasMore] = useState(true);

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
      localStorage.clear();
      router.push("/login");
    } else {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    const getstatus = localStorage.getItem("statusSaldo");
    if (getstatus) {
      setSelectedStatus(getstatus);
    }
  }, [selectedStatus]);

  useEffect(() => {
    const fetchBalance = async () => {
      const id = localStorage.getItem("id");
      const token = localStorage.getItem("token");

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}merchant/fetch/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setBalance(response.data.body.wallet.balance);
      } catch (error) {
        Error401(error, router);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      const id = localStorage.getItem("id");
      const token = localStorage.getItem("token");

      if (selectedStatus === "penarikan") {
        const token = localStorage.getItem("token");
        const id = localStorage.getItem("id");

        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}disbursement/filter?merchant_id=${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setRiwayat(response.data.body);
        } catch (error) {
          Error401(error, router);
        } finally {
          setLoading(false);
        }
      } else {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}order/filter?merchant_id=${id}&order_status=${selectedStatus}&per_page=20`,
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
          setHasMore(approvedPesanan.length > 0);
        } catch (error) {
          Error401(error, router);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchOrders();
  }, [selectedStatus]);

  const handleFilterChange = async (status) => {
    setLoading(true);
    localStorage.setItem("statusSaldo", status);
    setSelectedStatus(status);

    if (status === "penarikan") {
      const token = localStorage.getItem("token");
      const id = localStorage.getItem("id");

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}disbursement/filter?merchant_id=${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setRiwayat(response.data.body);
      } catch (error) {
        Error401(error, router);
      } finally {
        setLoading(false);
      }
    } else {
      let filtered = [];

      if (status === "review") {
        filtered = dataApi.filter((data) => data.order_status === "terima");
      } else if (status === "diproses") {
        filtered = dataApi.filter((data) => data.order_status === "diproses");
      } else if (status === "selesai") {
        filtered = dataApi.filter(
          (data) =>
            data.order_status === "canceled" || data.order_status === "selesai"
        );
      }

      setFilteredData(filtered);
      // setLoading(false);
    }
  };

  const handleRequestButton = () => {
    Swal.fire({
      title: "Informasi Penarikan",
      text: "Pembayaran penarikan saldo masih secara manual, pastikan isi data dengan benar",
      confirmButtonText: "Mengerti",
      confirmButtonColor: "#3FB648",
    }).then((result) => {
      if (result.isConfirmed) {
        router.push("/merchant/penarikan");
      }
    });
  };

  const formatPrice = (price) => {
    const formatter = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    });

    return formatter.format(price);
  };

  return (
    <div className="container mx-auto h-screen overflow-hidden">
      <Header title="Saldo" backto="" />
      <div className="container mx-auto pt-14 bg-white h-screen">
        <div className="mx-4 p-3 rounded-lg border-solid border-2 border-gray-300">
          <div>
            <p className="font-medium">Saldo Penghasilan</p>
            <p className="text-primary font-medium text-3xl">
              {formatPrice(balance)}
            </p>
          </div>
        </div>

        <div className="mx-4 mt-4">
          <button
            onClick={handleRequestButton}
            className="bg-primary font-medium text-lg text-white py-3 w-full rounded-xl"
          >
            Tarik Saldo
          </button>
          <p className="text-black font-bold text-lg mt-3">
            Riwayat Partisipasi Campaign
          </p>
        </div>

        <div className="flex justify-between px-7 pt-4 pb-2">
          {["diproses", "selesai", "penarikan"].map((status) => (
            <div
              key={status}
              className={`w-full cursor-pointer grid pb-2 text-sm font-medium justify-items-center ${
                selectedStatus === status
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-500"
              }`}
              onClick={() => handleFilterChange(status)}
            >
              <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
            </div>
          ))}
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
          <div
            className={`flex flex-col justify-start items-center overflow-auto h-screen px-1 pb-[400px]`}
          >
            {selectedStatus === "penarikan" ? (
              riwayat.length === 0 ? (
                <p className="text-gray-400 text-center">
                  Tidak Ada Riwayat Penarikan
                </p>
              ) : (
                riwayat
                  .sort(
                    (a, b) => new Date(b.created_at) - new Date(a.created_at)
                  )
                  .map((data) => (
                    <div
                      className="mx-4 mt-2 w-80 bg-white shadow-md p-4 rounded-lg"
                      key={data.id}
                    >
                      <div className="flex justify-between">
                        <p className="font-bold uppercase">{data.bank}</p>
                        <div
                          className={`flex justify-center items-center w-auto rounded-xl capitalize text-white text-center text-sm px-3 ${
                            data.status === "approved"
                              ? "bg-primary"
                              : data.status === "waiting"
                              ? "bg-blue-500"
                              : "bg-red-500"
                          }`}
                        >
                          <p>{data.status}</p>
                        </div>
                      </div>
                      <p>{formatPrice(data.amount - data.admin_fee)}</p>
                      <p className="text-sm">{data.rekening}</p>
                      <p className="text-gray-500 text-xs">
                        {new Intl.DateTimeFormat("eun-ID", {
                          year: "numeric",
                          month: "short",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        }).format(new Date(data.created_at))}
                      </p>
                    </div>
                  ))
              )
            ) : filteredData.length === 0 ? (
              <p className="text-gray-400 text-center">
                {selectedStatus === "diproses"
                  ? "Tidak Ada Partisipasi Berjalan"
                  : "Tidak Ada Partisipasi Selesai"}
              </p>
            ) : (
              filteredData.map((data) => (
                <div
                  className="mx-4 mt-2 w-80 bg-white shadow-md p-4 rounded-lg"
                  key={data.id}
                >
                  <p className="font-bold">{data.campaign.event_name}</p>
                  <p>{formatPrice(data.total_amount)}</p>
                  <p className="text-sm">{`${data.qty} x ${data.merchant_product.name}`}</p>

                  <p className="text-gray-500 text-xs">
                    {moment(data.created_at).format("YYYY-MM-DD HH:mm")}
                  </p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Saldo;
