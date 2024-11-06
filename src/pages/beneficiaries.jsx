import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import Error401 from "@/components/error401";
import axios from "axios";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const Beneficiaries = () => {
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState("Booking");
  const [DataOrder, setDataOrder] = useState([]);
  const [loading, setLoading] = useState(false);
  const [jumlahKupon, setJumlahKupon] = useState(0);
  const [statusClaimed, setStatusClaimed] = useState(false);
  const [price_coupon, setPrice_coupon] = useState(0);
  const [prevPath, setPrevPath] = useState("");

  useEffect(() => {
    setPrevPath(localStorage.getItem("prevPath"));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      handleTokenNotFound();
    } else {
      checkRegisterStatus(token);
    }
  }, []);

  const handleTokenNotFound = () => {
    Swal.fire({
      icon: "error",
      title: "Akses Dibatasi",
      text: "Mohon untuk login kembali menggunakan akun Merchant.",
      showConfirmButton: true,
      confirmButtonText: "Login",
      confirmButtonColor: "green",
      showCancelButton: true,
      cancelButtonText: "Tutup",
      cancelButtonColor: "red",
    }).then((result) => {
      router.push(result.isConfirmed ? "/login" : "/home");
    });
  };

  const checkRegisterStatus = async (token) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}auth/check-register-status`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const cekData = response.data.body;
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

      let responseObject = {};

      // Memeriksa apakah cekData.note tersedia dan memprosesnya jika ada
      if (cekData.beneficiaries?.status === "rejected") {
        responseObject = cekData.beneficiaries?.note.split('|').reduce((acc, pair) => {
          const [key, value] = pair.split(':');
          if (key && noteRejected.hasOwnProperty(key.trim())) {
            acc[key.trim()] = value ? value.trim() : ''; // Gunakan nilai kosong jika `value` tidak ada
          }
          return acc;
        }, {});
      }

      const errorObject = { ...noteRejected, ...responseObject };


      handleCheckData(cekData, errorObject);
    } catch (error) {
      Error401(error, router);
    }
  };


  const handleCheckData = (cekData, errorObject) => {
    if (cekData.merchant?.status === "waiting") {
      alertCekRegis("Merchant");
    } else if (cekData.detonator?.status === "waiting") {
      alertCekRegis("Detonator");
    } else {
      if (cekData.merchant?.status === "approved") {
        handleMerchantApproved(cekData.merchant);
      } else {
        handleBeneficiariesStatus(cekData.beneficiaries, errorObject);
      }
    }
  };

  const handleMerchantApproved = (merchant) => {
    Swal.fire({
      icon: "warning",
      title: "Akun Telah Terdaftar Sebagai Merchant",
      text: "Anda Tidak Dapat Mendaftar Sebagai Beneficiary",
      showConfirmButton: false,
      showCancelButton: true,
      cancelButtonColor: "red",
      cancelButtonText: "Tutup",
    }).then((result) => {
      router.push("/home");
    });
  };

  const handleBeneficiariesStatus = (beneficiaries, errorObject) => {
    if (!beneficiaries) {
      promptRegistration();
    } else {
      switch (beneficiaries.status) {
        case "waiting":
          handleWaitingStatus(beneficiaries);
          break;
        case "rejected":
          handleRejectedStatus(beneficiaries, errorObject);
          break;
        case "approved":
          handleApprovedStatus(beneficiaries);
          break;
        default:
          break;
      }
    }
  };

  const promptRegistration = () => {
    Swal.fire({
      icon: "warning",
      title: "Akun Belum Terdaftar sebagai Beneficiary",
      text: "Mohon untuk registrasi sebagai Beneficiary",
      showConfirmButton: true,
      confirmButtonColor: "green",
      confirmButtonText: "Registrasi",
      showCancelButton: true,
      cancelButtonColor: "red",
      cancelButtonText: "Tutup",
    }).then((result) => {
      router.push(result.isConfirmed ? "/beneficiaries/syarat" : "/home");
    });
  };

  const handleWaitingStatus = (beneficiaries) => {
    setBeneficiaryData(beneficiaries);
    Swal.fire({
      icon: "warning",
      title: "Akun Beneficiaries Anda Belum Terverifikasi",
      text: "Mohon tunggu konfirmasi dari admin kami",
      showConfirmButton: false,
      showCancelButton: true,
      cancelButtonColor: "red",
      cancelButtonText: "Tutup",
    }).then(() => {
      router.push("/home");
    });
  };

  const handleRejectedStatus = (beneficiaries, errorObject) => {
    setLoading(false);
    setBeneficiaryData(beneficiaries);

    // Menggunakan Swal.fire untuk menampilkan pesan peringatan
    Swal.fire({
      icon: "warning",
      title: "Beneficiaries Ditolak",
      html: `
        <ul class="max-w-md space-y-2 text-gray-500 list-inside dark:text-gray-400">
          ${Object.entries(errorObject) // Mengambil setiap entri dari errorObject
          .filter(([_, value]) => value) // Hanya menampilkan item yang memiliki nilai
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
      timer: 4000, // Mengatur timer untuk menutup pesan setelah 4 detik
    });

    // Setelah 4 detik, mengarahkan pengguna ke halaman edit beneficiaries
    setTimeout(() => {
      router.push("/beneficiaries/edit-beneficiaries?step=1");
    }, 4000);
  };

  // Fungsi untuk memformat nama kunci agar lebih mudah dibaca
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
    return keyMap[key] || key; // Mengembalikan nilai dari keyMap atau key itu sendiri jika tidak ada di keyMap
  };


  const handleApprovedStatus = (beneficiaries) => {
    setBeneficiaryData(beneficiaries);
    ChectCupon(localStorage.getItem("token"));
  };

  const setBeneficiaryData = (beneficiaries) => {
    localStorage.setItem("id", beneficiaries.beneficiaries_id);
    localStorage.setItem("role", "beneficiaries");
    localStorage.setItem("status", beneficiaries.status);
    localStorage.setItem("note", beneficiaries.note);
  };

  const alertCekRegis = (nameRole) => {
    Swal.fire({
      icon: "warning",
      title: "Akun anda sedang diproses",
      text: `akun anda sedang proses registrasi ${nameRole}.`,
      showConfirmButton: false,
      showCancelButton: true,
      cancelButtonText: "Tutup",
      cancelButtonColor: "red"
    })
    router.push("/home");
  }

  const getDetail = (id, token) => {
    axios
      .get(process.env.NEXT_PUBLIC_API_BASE_URL + `beneficiaries/fetch/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        return;
        // setDataApi(response.data.body);
        // const filtered = response.data.body.filter(
        //   (data) => data.status === "approved"
        // );
        // setFilteredData(filtered);

        // setLoading(false);

        // if (response.data.body.length === 0) {
        //     setHasMore(false);
        // }
      })
      .catch((error) => {
        setLoading(false);
        Error401(error, router);
      });
  };

  const ChectCupon = (token) => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}coupon/check-available`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setJumlahKupon(response.data.body.qouta_available);
        setStatusClaimed(response.data.body.claimed);
        setPrice_coupon(response.data.body.price_coupon);
      })
      .catch((error) => {
        Error401(error, router);
      });
  };

  const handleFilterChange = (status) => {
    setSelectedStatus(status);
  };

  useEffect(() => {
    const id = localStorage.getItem("id");
    const token = localStorage.getItem("token");
    setLoading(true);

    if (!id || !token) {
      console.error("ID or token is missing");
      return;
    }

    let status;
    switch (selectedStatus) {
      case "Booking":
        status = "reserved";
        break;
      case "Hangus":
        status = "expired";
        break;
      case "Aktif":
        status = "active";
        break;
      case "Selesai":
        status = "claimed";
        break;
      default:
        console.error("Invalid status");
        return;
    }

    axios
      .get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}coupon/filter?beneficiary_id=${id}&status=${status}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        const sortedData = response.data.body.sort(
          (a, b) => new Date(b.transaction_date) - new Date(a.transaction_date)
        );
        setDataOrder(sortedData);
        setLoading(false);
      })
      .catch((error) => {
        Error401(error, router);
        setLoading(false);
      });
  }, [selectedStatus, router]);

  const HandleRout = (status, coupon, mrc, prd) => {
    if (status === "reserved") {
      router.push(`/beneficiaries/qr-kupon/${coupon}?mrc=${mrc}&prd=${prd}`);
    } else if (status === "active") {
      router.push(`/beneficiaries/kupon/${mrc}`);
    } else if (status === "expired") {
      Swal.fire({
        position: "bottom",
        customClass: {
          popup: "custom-swal",
          icon: "custom-icon-swal",
          title: "custom-title-swal",
          confirmButton: "custom-confirm-button-swal",
        },
        icon: "error",
        title: `<p class="w-auto pl-1 font-bold text-md">Kupon Telah Hangus</p><p class="text-sm w-auto pl-1 font-light">Mohon maaf kamu waktu transaksi kupon anda telah hangus, silahkan ajukan kupon baru</p>`,
        html: `
            <div class="absolute px-28 ml-4 top-0 mt-4">
              <hr class="border border-black w-16 h-1 bg-slate-700 rounded-lg "/>
            </div>
          `,
        width: "375px",
        showConfirmButton: true,
        confirmButtonText: "Tutup",
        confirmButtonColor: "#3FB648",
      });
    } else if (status === "claimed") {
      // router.push(`/beneficiaries/qr-kupon/${coupon}?mrc=${mrc}&prd=${prd}`);
      router.push(`/beneficiaries/kupon/${mrc}`);
    }
  };

  const ButtonKlaim = () => {
    const DataCupon = {
      jumlahKupon,
      statusClaimed,
      price_coupon,
    };
    localStorage.setItem("DataCupon", JSON.stringify(DataCupon));
    router.push("/beneficiaries/order-merchant?step=1");
  };

  return (
    <>
      <div className="container mx-auto h-screen max-w-480 bg-white flex flex-col">
        <Header title="Beneficiaries" backto={prevPath ? prevPath : "/home"} />
        <div className="bg-white h-screen pt-10">
          <div
            className={`bg-gradient-to-b ${jumlahKupon === 0
              ? "from-[#C1C1C1] to-[#707070]"
              : "from-[#FF2F2F]  to-[#FFBD5B]"
              } rounded-lg p-6 my-2 text-white max-w-md mx-auto w-[328px] `}
          >
            <div className="flex justify-between">
              <div className="">
                <h1 className="text-[24px] font-bold">KUPON BERSAMA</h1>
                <p className="text-[16px] font-bold">Makan Gratis</p>
                <p className="text-[10px] italic mt-[24px]">
                  Dapat ditukarkan di merchant Foodia
                </p>
              </div>
              <div className="flex items-end">
                <div className="pt-[30px] text-center">
                  <p className="text-[14px]">Tersedia</p>
                  <p className="text-[36px] font-bold">{jumlahKupon}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="px-6 my-2">
            <button
              onClick={ButtonKlaim}
              disabled={
                loading ||
                jumlahKupon === 0 ||
                statusClaimed === false ||
                price_coupon === 0
              }
              className={`w-full h-14 ${loading ||
                jumlahKupon === 0 ||
                statusClaimed === false ||
                price_coupon === 0
                ? "text-[#A1A5C1] bg-[#F5F4F8]"
                : "text-white bg-primary hover:bg-blue-500"
                } rounded-2xl px-2 font-semibold text-[18px]`}
            >
              Klaim Kupon
            </button>
          </div>

          <div className="flex flex-row px-6 py-2 my-2 justify-between">
            <div
              className={`cursor-pointer text-center w-full pb-2 text-[16px] ${selectedStatus === "Booking"
                ? "text-[#6CB28E] font-bold border border-t-0 border-x-0 border-b-[2px] border-b-[#6CB28E]"
                : "text-gray-400 font-bold border border-t-0 border-x-0 border-b-[2px] border-b-transparent"
                }`}
              onClick={() => handleFilterChange("Booking")}
            >
              <p>Booking</p>
            </div>
            <div
              className={`cursor-pointer text-center w-full pb-2 ml-2 text-[16px] ${selectedStatus === "Hangus"
                ? "text-[#6CB28E] font-bold border border-t-0 border-x-0 border-b-[2px] border-b-[#6CB28E]"
                : "text-gray-400 font-bold border border-t-0 border-x-0 border-b-[2px] border-b-transparent"
                }`}
              onClick={() => handleFilterChange("Hangus")}
            >
              <p>Hangus</p>
            </div>
            <div
              className={`cursor-pointer text-center w-full pb-2 text-[16px] ${selectedStatus === "Aktif"
                ? "text-[#6CB28E] font-bold border border-t-0 border-x-0 border-b-[2px] border-b-[#6CB28E]"
                : "text-gray-400 font-bold border border-t-0 border-x-0 border-b-[2px] border-b-transparent"
                }`}
              onClick={() => handleFilterChange("Aktif")}
            >
              <p>Aktif</p>
            </div>
            <div
              className={`cursor-pointer text-center w-full pb-2 text-[16px] ${selectedStatus === "Selesai"
                ? "text-[#6CB28E] font-bold border border-t-0 border-x-0 border-b-[2px] border-b-[#6CB28E]"
                : "text-gray-400 font-bold border border-t-0 border-x-0 border-b-[2px] border-b-transparent"
                }`}
              onClick={() => handleFilterChange("Selesai")}
            >
              <p>Selesai</p>
            </div>
          </div>
          <div className="pb-24">
            {DataOrder.length > 0 ? (
              DataOrder.map((data, index) => (
                <div
                  key={index}
                  onClick={() =>
                    HandleRout(
                      data.status,
                      data.qr_code,
                      data.id,
                      data.merchant_product_id
                    )
                  }
                  className="w-full items-center justify-center flex cursor-pointer my-2 "
                >
                  <div className="w-[328px] bg-white border border-gray-300 rounded-lg flex p-2">
                    <img
                      className="w-[100px] h-[100px] rounded-md object-cover"
                      src={`${process.env.NEXT_PUBLIC_URL_STORAGE}${data.merchant_product?.images[0]}`}
                      alt={`${process.env.NEXT_PUBLIC_URL_STORAGE}${data.merchant_product?.images[0]}`}
                    />
                    <div className="ml-2 flex flex-col justify-between w-full">
                      <div className="flex justify-between items-center">
                        <h2 className="text-[14px] font-bold text-green-600">
                          {data.merchant_product?.name}
                        </h2>
                        <button
                          className={`${data.status === "reserved"
                            ? "bg-blue-500"
                            : data.status === "expired"
                              ? "bg-red-500"
                              : "bg-primary"
                            } capitalize text-white text-[8px] font-bold px-2 rounded-full`}
                        >
                          {data.status}
                        </button>
                      </div>
                      <p className="text-[8px] text-gray-600 overflow-hidden line-clamp-3">
                        {data.merchant_product?.description}
                      </p>
                      <div className="text-[8px] text-right flex flex-col items-end">
                        <div className="flex flex-col">
                          <p className="italic text-gray-600">Permintaan oleh {data.status}</p>
                          <p className="font-semibold italic text-gray-600">
                            {localStorage.getItem("fullname")}
                          </p>
                        </div>
                        {(data.status === "reserved" || data.status === "expired") && (
                          <div className="flex flex-col text-red-600">
                            <p className="italic ">
                              Masa berlaku hingga
                            </p>
                            <p className="font-semibold italic ">
                              {moment(data.expired_at).format(
                                "DD MMMM YYYY HH:mm:ss [WIB]"
                              )}
                            </p>
                          </div>
                        )}



                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="w-full items-center justify-center flex">
                <p className="text-center text-gray-400">Belum ada data</p>
              </div>
            )}
          </div>

          {loading && <Loading />}
        </div>
      </div>
      <BottomNav />
    </>
  );
};

export default Beneficiaries;
