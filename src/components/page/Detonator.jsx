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

  useEffect(() => {
    const authenticateUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        Swal.fire({
          icon: "error",
          title: "Akses Dibatasi",
          text: `Mohon untuk login kembali menggunakan akun Detonator.`,
          showConfirmButton: true,
          confirmButtonText: "Login",
          confirmButtonColor: "green",
          showCancelButton: true,
          cancelButtonText: "Tutup",
          cancelButtonColor: "red",
        }).then((result) => {
          if (result.isConfirmed) {
            setLoading(true);
            router.push("/login");
          } else if (result.isDismissed) {
            router.push("/home");
          }
        });
      } else {
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

          if (!cekData.detonator) {
            Swal.fire({
              icon: "warning",
              title: "Akun Belum Terdaftar sebagai Volunteer",
              text: `Mohon untuk registrasi sebagai Volunteer.`,
              showConfirmButton: true,
              confirmButtonColor: "green",
              confirmButtonText: "Registrasi",
              showCancelButton: true,
              cancelButtonColor: "red",
              cancelButtonText: "Tutup",
              // timer: 2000,
            }).then((result) => {
              if (result.isConfirmed) {
                router.push("/detonator/syarat");
              } else if (result.isDismissed) {
                router.push("/home");
              }
            });
          } else {
            if (cekData.detonator.status == "waiting") {
              localStorage.setItem("id", cekData.detonator.detonator_id);
              localStorage.setItem("role", "detonator");
              localStorage.setItem("status", cekData.detonator.status);
              localStorage.setItem("note", cekData.detonator.note);

              Swal.fire({
                icon: "warning",
                title: "Volunteer Belum Terverifikasi",
                text: ` Mohon tunggu konfirmasi dari admin kami.`,
                showConfirmButton: false,
                timer: 2000,
              });
              setTimeout(() => {
                router.push("/home");
              }, 2000);
            } else if (cekData.detonator.status == "rejected") {
              setLoading(false);
              localStorage.setItem("id", cekData.detonator.detonator_id);
              localStorage.setItem("role", "detonator");
              localStorage.setItem("status", cekData.detonator.status);
              localStorage.setItem("note", cekData.detonator.note);
              Swal.fire({
                icon: "warning",
                title: "Detonator ditolak",
                text: `${cekData.detonator.note}`,
                showConfirmButton: false,
                timer: 2000,
              });
              setTimeout(() => {
                router.push("/detonator/edit-volunteer");
              }, 2000);
            } else {
              localStorage.setItem("id", cekData.detonator.detonator_id);
              localStorage.setItem("role", "detonator");
              localStorage.setItem("status", cekData.detonator.status);
              localStorage.setItem("note", cekData.detonator.note);
            }
          }
        } catch (error) {
          Error401(error, router);
        }
      }
    };

    authenticateUser();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("id");
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
  }, [selectedStatus, loading]);

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
