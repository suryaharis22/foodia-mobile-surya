import Header from "@/components/Header";
import Loading from "@/components/Loading";
import { useAppState } from "@/components/page/UserContext";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Countdown from "react-countdown";
import Swal from "sweetalert2";

const OTP = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [codes, setCodes] = useState("");
  const { state } = useAppState();
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdownTime, setCountdownTime] = useState(Date.now() + 120000); // Set 120000 untuk 2 menit
  const registrasi = state.registrasi;

  useEffect(() => {
    if (!registrasi || !registrasi.email) {
      Swal.fire({
        icon: "error",
        title: "Gagal Membuat Akun",
        text: "Email Tidak ditemukan silahkan login kembali",
        width: "375px",
        showConfirmButton: true,
        confirmButtonText: "login",
        confirmButtonColor: "#3b82f6",
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/login");
        }
      });
    }
  }, [registrasi]);

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setCountdownTime((prevTime) => prevTime - 1000); // Kurangi 1 detik dari countdownTime setiap 1 detik
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, []);

  useEffect(() => {
    setShowCountdown(countdownTime > 0); // Tentukan apakah countdown masih berlangsung berdasarkan countdownTime
  }, [countdownTime]);

  const renderer = ({ minutes, seconds }) => {
    if (minutes === 0 && seconds === 0) {
      return (
        <div onClick={handleResend} className="text-xs text-gray-400 ">
          Tidak menerima email? Kirim ulang OTP dalam waktu:
          <br />
          <span className="text-blue-500 hover:underline cursor-pointer">
            Kirim Ulang Kode OTP
          </span>
        </div>
      );
    } else {
      return (
        <>
          <p className="text-xs text-gray-400">
            Tidak menerima email? Kirim ulang OTP dalam waktu: {minutes}:
            {seconds}
          </p>
        </>
      );
    }
  };

  const handleChange = (event) => {
    const value = event.target.value;
    if (value.length < 7) {
      setCodes(value);
    }
    if (value.length === 6) {
      const otp = {
        email: registrasi.email,
        code: value,
      };
      handleSubmit(otp);
    }
  };

  const handleResend = () => {
    setLoading(true);
    axios
      .post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}auth/resend-otp`,
        { email: registrasi.email, flag: "register" },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer YOUR_ACCESS_TOKEN",
          },
        }
      )
      .then(() => {
        setCountdownTime(Date.now() + 120000); // Set ulang countdownTime ke 2 menit
        setLoading(false);
        Swal.fire({
          icon: "success",
          title: "OTP Sent",
          text: "Please check your email",
          showConfirmButton: false,
          timer: 2000,
        });
      })
      .catch((error) => {
        setLoading(false);
        Swal.fire({
          icon: "error",
          title: "Gagal Membuat Akun",
          text: "Email Tidak ditemukan silahkan login kembali",
          width: "375px",
          showConfirmButton: true,
          confirmButtonText: "login",
          confirmButtonColor: "#3b82f6",
        }).then((result) => {
          if (result.isConfirmed) {
            router.push("/login");
          }
        });
      });
  };

  const handleSubmit = async (otp) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}auth/verify-otp`,
        {
          email: registrasi.email,
          code: otp.code,
          flag: "register",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer YOUR_ACCESS_TOKEN",
          },
        }
      );
      const imageUrl = "/img/illustration/checklist.png";
      setLoading(false);
      Swal.fire({
        position: "bottom",
        customClass: {
          popup: "custom-swal",
          icon: "custom-icon-swal",
          title: "custom-title-swal",
          confirmButton: "custom-confirm-button-swal",
        },
        icon: "success",
        title: '<p style="font-size: 30px; font-weight: bold; margin-bottom: 1rem;">Akun Berhasil Di Buat</p>',
        html: `
      <div style="margin-top: 2rem; position: relative;">
        <hr style="border: 1px solid black; width: 100%; height: 1px; background-color: #64748b; border-radius: 0.375rem; margin-bottom: 1rem;    " />
        <p style="font-size: 18px; padding-left: 0.25rem; font-weight: 300;">Terima kasih telah mendaftar untuk menjadi penolong sesama</p>
      </div>
      `,
        width: "375px",
        showConfirmButton: true,
        confirmButtonText: "Masuk",
        confirmButtonColor: "#3FB648",
      }).then((result) => {
        if (result.isConfirmed) {
          const DataApi = response.data.body;

          localStorage.setItem("fullname", DataApi.fullname);
          localStorage.setItem("phone", DataApi.phone);
          localStorage.setItem("email", DataApi.email);
          localStorage.setItem("role", DataApi.role);
          localStorage.setItem("token", DataApi.token);
          localStorage.setItem("id", DataApi.user_id || "-");
          localStorage.setItem(
            "id_detonator",
            DataApi.detonator?.detonator_id ?? "-"
          );
          localStorage.setItem(
            "id_merchant",
            DataApi.merchant?.merchant_id ?? "-"
          );
          localStorage.setItem(
            "id_beneficiaries",
            DataApi.beneficiaries?.beneficiaries_id ?? "-"
          );
          router.push("/home");
        }
      });
    } catch (error) {
      if (error.response.data.error[0].field === "email") {
        Swal.fire({
          icon: "error",
          title: "Gagal Membuat Akun",
          text: "Email Tidak ditemukan silahkan login kembali",
          width: "375px",
          showConfirmButton: true,
          confirmButtonText: "login",
          confirmButtonColor: "#3b82f6",
        }).then((result) => {
          if (result.isConfirmed) {
            router.push("/login");
          }
        });
        setLoading(false);
      } else {
        Swal.fire({
          icon: "error",
          title: "Gagal Membuat Akun",
          text: "Kode OTP Tidak Sesuai Atau Expired",
          width: "375px",
          showConfirmButton: true,
          confirmButtonText: "Tutup",
          confirmButtonColor: "#ef4444",
        });
        setLoading(false);
      }
    }
  };

  return (
    <div className="container mx-auto bg-white h-screen">
      <div className="grid justify-items-center w-full">
        <Header />
        <form className="justify-center pt-24 p-2 mt-5 w-full h-full">
          <h5 className="flex justify-center text-4xl text-primary font-bold">
            Verifikasi
          </h5>
          <h5 className="mt-4 flex justify-center text-center text-sm font-normal">
            Ketikan Kode Verifikasi Yang Telah Dikirimkan Ke Email Anda:
          </h5>
          <h5 className="flex justify-center text-sm font-normal">
            {registrasi.email}
          </h5>

          <div className="mt-4 flex flex-row items-center px-0 bg-gray-100 text-gray-400 text-sm rounded-lg w-full focus:border-none">
            <input
              onChange={handleChange}
              value={codes}
              name="codes"
              type="number"
              min="0"
              onKeyDown={(e) => {
                if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                  e.preventDefault();
                }
              }}
              id="codes"
              className="w-full p-0 py-4 bg-transparent focus:border-none text-center"
              placeholder="* * * * * *"
              required
            />
          </div>

          <div className="flex items-center flex-col justify-center pt-10">
            <div
              style={{
                display: "flex",
                gap: "5px",
                justifyContent: "center",
              }}
              className="font-bold"
            >
              <Countdown date={countdownTime} renderer={renderer} />
            </div>
            <br />
            {/* <p className="text-sm text-center text-black font-light">
              {!showCountdown && !loading
                ? "Tidak menerima OTP? Tunggu hingga waktu habis sebelum mengirim ulang."
                : "Menunggu waktu habis sebelum mengirim ulang..."}
            </p> */}
            {!showCountdown && !loading && (
              <div
                onClick={handleResend}
                className="text-sm text-cyan-500 hover:underline cursor-pointer"
              >
                Kirim Ulang Kode OTP
              </div>
            )}
          </div>

          <div className="grid place-items-center mt-40">
            <button
              type="button"
              onClick={() =>
                handleSubmit({ email: registrasi.email, code: codes })
              }
              className="text-white w-full bg-primary hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-bold rounded-xl py-3 text-center"
            >
              Kirim
            </button>
          </div>
        </form>
      </div>
      {loading && <Loading />}
    </div>
  );
};

export default OTP;
