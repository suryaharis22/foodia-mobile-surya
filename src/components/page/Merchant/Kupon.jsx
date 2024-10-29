import Loading from "@/components/Loading";
import Error401 from "@/components/error401";
import styles from "@/styles/Home.module.css";
import axios from "axios";
import moment from "moment/moment";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import MenuBarMechant from "./MenuBarMechant";
import CardKupon from "./CardKupon";
import { IconInfoCircle } from "@tabler/icons-react";
import Swal from "sweetalert2";

const Kupon = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [dataApi, setDataApi] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [jumlahReserved, setJumlahReserved] = useState(0);
  const [jumlahActive, setJumlahActive] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState("reserved");

  useEffect(() => {
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");
    const status = localStorage.getItem("status");
    const id = localStorage.getItem("id");
    localStorage.removeItem("imgPenerima");
    localStorage.removeItem("imgMakanan");

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

  const getJumlahKupon = () => {
    const merchant_id = localStorage.getItem("id");
    const token = localStorage.getItem("token");

    axios
      .get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}coupon/filter?merchant_id=${merchant_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        const data = response.data.body;

        const filteredReserved = data.filter(
          (item) => item.status === "reserved"
        );
        const filteredActive = data.filter((item) => item.status === "active");

        const totalReserved = filteredReserved.length;
        const totalActive = filteredActive.length;
        setJumlahReserved(totalReserved);
        setJumlahActive(totalActive);
      })
      .catch((error) => {
        Error401(error, router);
      });
  };

  useEffect(() => {
    const merchant_id = localStorage.getItem("id");
    const token = localStorage.getItem("token");
    setLoading(true);
    getJumlahKupon();
    let statusUrl = "";

    switch (selectedStatus) {
      case "reserved":
        statusUrl = "reserved";
        break;
      case "active":
        statusUrl = "active";
        break;
      case "claimed":
        statusUrl = "claimed";
        break;
      default:
        break;
    }

    if (statusUrl) {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}coupon/filter?merchant_id=${merchant_id}&status=${statusUrl}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          const sortedData = response.data.body.sort(
            (a, b) =>
              new Date(b.transaction_date) - new Date(a.transaction_date)
          );
          setFilteredData(sortedData);
          setDataApi(sortedData);

          setLoading(false);
        })
        .catch((error) => {
          Error401(error, router);
        });
    }
  }, [selectedStatus]);

  const handleFilterChange = (status = "reserved") => {
    setSelectedStatus(status);
  };

  const handleInfo = () => {
    Swal.fire({
      title: 'Informasi Kupon Makan',
      html: `
        <div class="flex flex-col text-black space-y-4 px-4">
            <div class="text-justify text-[14px]">
              <ul class="list-decimal font-bold space-y-2">
                <li class="mb-4">
                  <p class="italic font-normal text-primary">
                    Anda akan menerima pembayaran setelah selesai melaporkan kegiatan pemberian makan 
                    <span class="not-italic text-black"> kepada penerima manfaat menggunakan fitur kupon. Foto yang harus dilaporkan:</span>
                  </p>
                  <ul class="list-alpha ml-6 font-bold space-y-1">
                    <li>
                      <p class="italic font-normal text-primary">
                        Melaporkan foto makanan yang disajikan 
                        <span class="not-italic text-black"> sesuai pesanan pada kupon makan</span>
                      </p>
                    </li>
                    <li>
                      <p class="italic font-normal text-primary">
                        Melaporkan foto wajah Penerima Manfaat 
                        <span class="not-italic text-black"> yang mengklaim Kupon Makan</span>
                      </p>
                    </li>
                  </ul>
                </li>
                <li>
                  <p class="font-normal">
                    Pelaporan permintaan kupon makan hanya berlaku 1 jam dari scan kupon berhasil dilakukan. 
                    <span class="text-red-500 font-semibold"> Jika melebihi dari 1 jam, maka kupon akan dianggap hangus 
                      <span class="text-black font-normal"> sehingga anda</span> tidak berhak menerima pembayaran </span> makanan tersebut.
                  </p>
                </li>
              </ul>
            </div>
          </div>
      `,
      showConfirmButton: false,
      footer: `<button id="close-btn" class="mt-4 bg-primary text-white px-4 py-2 rounded-xl w-full font-semibold">Tutup</button>`,
      didOpen: () => {
        const closeButton = document.getElementById('close-btn');
        closeButton.addEventListener('click', () => Swal.close());
      }
    });
  };



  return (
    <>
      <div className="container mx-auto overflow-hidden h-screen">
        <MenuBarMechant />
        <div className="px-7 pt-4 ">
          <button onClick={handleInfo} className="w-full flex justify-center border-1 border-transparent bg-gradient-to-b from-[#FF2F2F] to-[#FFBD5B] p-0.5 rounded-lg">
            <div className="bg-white w-full flex justify-center items-center rounded-md bg-clip-border py-2">
              <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_5131_40707)">
                  <path d="M10.4997 0C4.97758 0 0.5 4.47727 0.5 9.99969C0.5 15.5221 4.97758 19.9994 10.4997 19.9994C16.0231 19.9994 20.5 15.5222 20.5 9.99969C20.5 4.47723 16.0231 0 10.4997 0ZM12.2555 14.5906C11.8511 15.0395 11.6192 15.3063 11.1826 15.7237C10.5218 16.3556 9.77137 16.5239 9.18797 15.9001C8.34941 15.0033 9.22891 12.275 9.25035 12.1716C9.40785 11.4465 9.72223 9.99715 9.72223 9.99715C9.72223 9.99715 9.04305 10.4129 8.63984 10.5604C8.34246 10.6691 8.00605 10.5264 7.92289 10.2388C7.84539 9.97227 7.90711 9.80277 8.07031 9.6207C8.47477 9.17211 8.7066 8.90531 9.14324 8.48793C9.80473 7.8557 10.5545 7.68781 11.1379 8.31121C11.9764 9.20805 11.3577 10.6836 11.1404 11.7291C11.119 11.8327 10.6036 14.2145 10.6036 14.2145C10.6036 14.2145 11.2828 13.7987 11.686 13.6509C11.9839 13.5426 12.3204 13.6856 12.4036 13.9729C12.4811 14.2394 12.4187 14.4089 12.2555 14.5906ZM11.1707 6.87949C10.2376 6.96137 9.41543 6.27152 9.33352 5.33781C9.25227 4.40508 9.94211 3.58258 10.8752 3.50133C11.8076 3.41941 12.6304 4.10992 12.7117 5.04266C12.7936 5.97543 12.1031 6.79824 11.1707 6.87949Z" fill="url(#paint0_linear_5131_40707)" />
                </g>
                <defs>
                  <linearGradient id="paint0_linear_5131_40707" x1="10.5" y1="0" x2="10.5" y2="19.9994" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#FF2F2F" />
                    <stop offset="1" stop-color="#FFBD5B" />
                  </linearGradient>
                  <clipPath id="clip0_5131_40707">
                    <rect width="20" height="20" fill="white" transform="translate(0.5)" />
                  </clipPath>
                </defs>
              </svg>

              <p className="text-transparent bg-clip-text text-[12px] bg-gradient-to-b from-[#FF2F2F] to-[#FFBD5B] ml-2">
                Informasi Penerimaan Biaya Kupon Makan
              </p>
            </div>
          </button>
        </div>


        <div className="grid grid-cols-3 gap-2 px-7 pt-4 pb-2">
          <div
            className={`w-full cursor-pointer pb-2 text-sm font-medium text-center flex ${selectedStatus === "reserved"
              ? "text-primary border-b-2 border-primary"
              : "text-gray-500"
              }`}
            onClick={() => handleFilterChange("reserved")}
          >
            <span>Permintaan Klaim</span>
            {jumlahReserved > 0 && (
              <div className="bg-red-500 rounded-full items-center flex justify-center p-[5px] h-[15px] w-[15px] ">
                <p className="text-[8px] text-white">{jumlahReserved}</p>
              </div>
            )}
          </div>
          <div
            className={`w-full cursor-pointer pb-2 text-sm font-medium text-center flex ${selectedStatus === "active"
              ? "text-primary border-b-2 border-primary"
              : "text-gray-500"
              }`}
            onClick={() => handleFilterChange("active")}
          >
            <span>Laporkan Kupon</span>
            {jumlahActive > 0 && (
              <div className="bg-red-500 rounded-full items-center flex justify-center p-[5px] h-[15px] w-[15px] ">
                <p className="text-[8px] text-white">{jumlahActive}</p>
              </div>
            )}
          </div>
          <div
            className={`w-full cursor-pointer pb-2 text-sm font-medium text-center ${selectedStatus === "claimed"
              ? "text-primary border-b-2 border-primary"
              : "text-gray-500"
              }`}
            onClick={() => handleFilterChange("claimed")}
          >
            <span>
              Kupon <br />
              Selesai
            </span>
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
                {selectedStatus === "reserved"
                  ? "Tidak Ada Pesanan"
                  : selectedStatus === "diproses"
                    ? "Tidak Ada Pesanan Berlangsung"
                    : selectedStatus === "active" && "Tidak Ada Pesanan Selesai"}
              </p>
            ) : (
              filteredData.map((data) => (
                <CardKupon
                  key={data.id}
                  // to={data.order_status === "reserved" ? `/merchant/scan-kupon/${data.id}` : data.order_status === "approved" ? `/merchant/pesanan/${data.id}` : "/"}
                  total_tax={data.total_tax * data.qty}
                  idOrder={data.id}
                  img={`${process.env.NEXT_PUBLIC_URL_STORAGE}${data.merchant_product?.images[0]}`}
                  title={data.merchant_product?.name}
                  desc={data.merchant_product?.description}
                  date={moment(data.expired_at).format(
                    "DD MMMM YYYY HH:mm:ss [WIB]"
                  )}
                  name_beneficiary={data.beneficiary?.fullname}
                  qty={data.qty}
                  price={data.merchant_product?.price}
                  status={data.status}
                  // status={data.order_status}
                  total_amount={data?.total_amount}
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

export default Kupon;
