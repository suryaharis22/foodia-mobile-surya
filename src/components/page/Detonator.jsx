import styles from "@/styles/Home.module.css";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import CardCampaign from "../CardCampaign";
import Loading from "../Loading";
import Error401 from "../error401";
import MenuDetonator from "./Detonator/MenuDetonator";
import { encryptId } from "@/utils/EndCodeHelper1";

const Detonator = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [dataApi, setDataApi] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("DRAFT");
  const [detonatorStatus, setDetonatorStatus] = useState(""); // State to store detonator status

  useEffect(() => {
    const authenticateUser = async () => {
      const token = localStorage.getItem("token");

      // Check if the token exists
      if (!token) {
        showAlert({
          icon: "error",
          title: "Akses Dibatasi",
          text: "Mohon untuk login kembali menggunakan akun Volunteer.",
          confirmButtonText: "Login",
          confirmButtonColor: "green",
          cancelButtonText: "Tutup",
          cancelButtonColor: "red",
        }).then((result) => {
          result.isConfirmed ? router.push("/login") : router.push("/home");
        });
        return;
      }

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}auth/check-register-status`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const cekData = response.data.body;

        // Check the status of merchant and beneficiaries
        if (cekData.merchant?.status === "waiting") {
          alertCekRegis("Merchant");
          return; // Stop further execution
        } else if (cekData.beneficiaries?.status === "waiting") {
          alertCekRegis("Beneficiaries");
          return; // Stop further execution
        }

        // Check if the user is registered as a volunteer
        if (!cekData.detonator) {
          showAlert({
            icon: "warning",
            title: "Akun Belum Terdaftar sebagai Volunteer",
            text: "Mohon untuk registrasi sebagai Volunteer.",
            confirmButtonText: "Registrasi",
            confirmButtonColor: "green",
            cancelButtonText: "Tutup",
            cancelButtonColor: "red",
          }).then((result) => {
            result.isConfirmed ? router.push("/detonator/syarat") : router.push("/home");
          });
        } else {
          handleDetonatorStatus(cekData.detonator);
        }
      } catch (error) {
        Error401(error, router);
      }
    };

    const showAlert = (options) => {
      return Swal.fire({
        ...options,
        showConfirmButton: true,
        showCancelButton: true,
      });
    };

    const handleDetonatorStatus = (detonator) => {
      localStorage.setItem("id", detonator.detonator_id);
      localStorage.setItem("role", "detonator");
      localStorage.setItem("status", detonator.status);
      localStorage.setItem("note", detonator.note);
      setDetonatorStatus(detonator.status); // Set detonator status

      switch (detonator.status) {
        case "waiting":
          Swal.fire({
            icon: "warning",
            title: "Volunteer Belum Terverifikasi",
            text: "Mohon tunggu konfirmasi dari admin kami.",
            showConfirmButton: false,
            timer: 2000,
          });
          setTimeout(() => {
            router.push("/home");
          }, 2000);
          break;

        case "rejected":
          handleRejectedDetonator(detonator.note);
          break;

        default:
          // Handle other statuses if necessary
          break;
      }
    };

    const handleRejectedDetonator = (note) => {
      const noteRejected = {
        FullName: '',
        NameMerchant: '',
        LinkAjaNumber: '',
        PhoneNumber: '',
        KTPNumber: '',
        KTPPhoto: '',
        SelfPhoto: '',
        MerchantPhoto: '',
        Address: '',
      };

      const responseObject = note.split('|').reduce((acc, pair) => {
        const [key, value] = pair.split(':');
        if (key && noteRejected.hasOwnProperty(key.trim())) {
          acc[key.trim()] = value ? value.trim() : ''; // Use empty string if value is absent
        }
        return acc;
      }, {});

      const errorObject = { ...noteRejected, ...responseObject };

      Swal.fire({
        icon: "warning",
        title: "Volunteer Ditolak",
        html: `
      <ul class="max-w-md space-y-2 text-gray-500 list-inside dark:text-gray-400">
        ${Object.entries(errorObject)
            .filter(([_, value]) => value) // Only display items with values
            .map(
              ([key, value]) => `
            <li class="flex items-start">
              <span class="font-medium text-gray-700 whitespace-nowrap">${formatKey(key)}:</span> 
              <span class="text-red-600 truncate">${value}</span>
            </li>`
            )
            .join("")}
      </ul>
      `,
        showConfirmButton: false,
        timer: 4000,
      });

      setTimeout(() => {
        router.push("/detonator/edit-volunteer");
      }, 4000);
    };

    const formatKey = (key) => {
      const keyMap = {
        FullName: "Nama Lengkap",
        NameMerchant: "Nama Merchant",
        LinkAjaNumber: "Nomor LinkAja",
        PhoneNumber: "Nomor Telepon",
        KTPNumber: "Nomor KTP",
        KTPPhoto: "Foto KTP",
        SelfPhoto: "Foto Diri",
        MerchantPhoto: "Foto Merchant",
        Address: "Alamat",
      };
      return keyMap[key] || key;
    };

    const alertCekRegis = (nameRole) => {
      Swal.fire({
        icon: "warning",
        title: "Akun anda sedang diproses",
        text: `Akun anda sedang proses registrasi ${nameRole}.`,
        showConfirmButton: false,
        showCancelButton: true,
        cancelButtonText: "Tutup",
        cancelButtonColor: "red"
      });
      router.push("/home");
    };

    authenticateUser();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("id");

    // Make API call only if detonator status is "approved"
    if (detonatorStatus === "approved") {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}campaign/filter?detonator_id=${id}&campaign_status=${selectedStatus}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          setDataApi(res.data.body);
          setFilteredData(res.data.body);
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          Error401(error, router);
          localStorage.clear();
          localStorage.removeItem("cart");
          localStorage.removeItem("formData");
          router.push("/login");
        });
    } else {
      setLoading(false); // Set loading to false if not approved to avoid infinite loading
    }
  }, [selectedStatus, detonatorStatus]);

  const handleFilterChange = (status) => {
    let filtered = [];
    const id = localStorage.getItem("id");
    const token = localStorage.getItem("token");

    setLoading(true);
    setSelectedStatus(status);
    if (status === "DRAFT") {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}campaign/filter?detonator_id=${id}&campaign_status=${status}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          setDataApi(response.data.body);
          setFilteredData(response.data.body);
          setLoading(false);
        })
        .catch((error) => {
          Error401(error, router);
          localStorage.clear();
          localStorage.removeItem("cart");
          localStorage.removeItem("formData");
          router.push("/login");
          setLoading(false);
        });
    } else if (status === "OPEN,INPROGRESS") {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}campaign/filter?detonator_id=${id}&campaign_status=${status}`,
          {
            headers: {
              Authorization: `Bearer ${token + "dwwdw"}`,
            },
          }
        )
        .then((response) => {
          setDataApi(response.data.body);
          setFilteredData(response.data.body);
          setLoading(false);
        })
        .catch((error) => {
          Error401(error, router);
          localStorage.clear();
          localStorage.removeItem("cart");
          localStorage.removeItem("formData");
          router.push("/login");
          setLoading(false);
        });
    } else if (status === "FINISHED") {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}campaign/filter?detonator_id=${id}&campaign_status=${status}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          setDataApi(response.data.body);
          setFilteredData(response.data.body);
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          Error401(error, router);
        });
    }
  };

  return (
    <>
      <div className="bg-white h-screen pt-10">
        <div className="flex items-center justify-center px-6 my-2">
          <MenuDetonator />
        </div>
        <div className="flex flex-row px-6 py-4 justify-between">
          <div
            className={`cursor-pointer text-center pb-2 text-[16px] ${selectedStatus === "DRAFT"
              ? "text-[#6CB28E] font-bold border border-t-0 border-x-0 border-b-[2px] border-b-[#6CB28E]"
              : "text-gray-400 font-bold border border-t-0 border-x-0 border-b-[2px] border-b-transparent"
              }`}
            onClick={() => handleFilterChange("DRAFT")}
          >
            <p>Campaign Baru</p>
          </div>
          <div
            className={`cursor-pointer text-center pb-2 ml-2 text-[16px] ${selectedStatus === "OPEN,INPROGRESS"
              ? "text-[#6CB28E] font-bold border border-t-0 border-x-0 border-b-[2px] border-b-[#6CB28E]"
              : "text-gray-400 font-bold border border-t-0 border-x-0 border-b-[2px] border-b-transparent"
              }`}
            onClick={() => handleFilterChange("OPEN,INPROGRESS")}
          >
            <p>Campaign Berjalan</p>
          </div>
          <div
            className={`cursor-pointer text-center pb-2 text-[16px] ${selectedStatus === "FINISHED"
              ? "text-[#6CB28E] font-bold border border-t-0 border-x-0 border-b-[2px] border-b-[#6CB28E]"
              : "text-gray-400 font-bold border border-t-0 border-x-0 border-b-[2px] border-b-transparent"
              }`}
            onClick={() => handleFilterChange("FINISHED")}
          >
            <p>Campaign Selesai</p>
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
            {filteredData.map((dataFilter) => {
              return (
                <CardCampaign
                  from={"detonator"}
                  key={dataFilter.id}
                  to={`/campaign/${dataFilter.id}`}
                  // to={`campaign/${dataFilter.id}`}
                  img={`${process.env.NEXT_PUBLIC_URL_STORAGE}${dataFilter.image_url}`}
                  title={dataFilter.event_name}
                  description={dataFilter.description}
                  date={dataFilter.event_date}
                  status={dataFilter.status}
                  address={dataFilter.address}
                  rating={false}
                  donation_target={dataFilter.donation_target}
                  donation_collected={dataFilter.donation_collected}
                />
              );
            })}
          </div>
        )}
        {loading && <Loading />}
      </div>
    </>
  );
};

export default Detonator;
