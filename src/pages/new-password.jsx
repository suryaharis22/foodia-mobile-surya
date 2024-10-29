//new-password
import AlertError from "@/components/AlertError";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import { useAppState } from "@/components/page/UserContext";
import {
  IconEye,
  IconEyeClosed,
  IconInfoCircle,
  IconLock,
} from "@tabler/icons-react";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const newPassword = (newPassword) => {
  const router = useRouter();
  const { state } = useAppState();
  const register = state.registrasi;
  const [token, setToken] = useState("");
  const [inputPassword, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(true);
  const [showConfirmPassword, setShowConfirmPassword] = useState(true);
  const [validconfirmPassword, setValidconfirmPassword] = useState(false);
  const [validpassword, setValidPassword] = useState(false);
  const [messageError, setMessageError] = useState("");

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((show) => !show);
  const [loading, setLoading] = useState(false);

  const Password_REGEX = /^[0-9A-Za-z!@#$%^&*`()_+{}\[\]:;<>,.?=~\/\\|-]{8,}$/;
  const confirmPassword_REGEX =
    /^[0-9A-Za-z!@#$%^&*`()_+{}\[\]:;<>,.?=~\/\\|-]{8,}$/;

  //token
  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, [register]);

  useEffect(() => {
    setValidPassword(Password_REGEX.test(inputPassword));
    setMessageError("");
  }, [inputPassword]);

  useEffect(() => {
    setValidconfirmPassword(confirmPassword_REGEX.test(confirmPassword));
    setMessageError("");
  }, [confirmPassword]);

  const handleSubmit = () => {
    if (inputPassword !== confirmPassword) {
      setMessageError("Ulang kata sandi tidak sesuai");
      return;
    }
    if (!inputPassword || !confirmPassword) {
      setMessageError("Kata sandi tidak boleh kosong");
      return;
    }
    const ressponse = axios
      .post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}auth/change-password`,
        {
          new_password: inputPassword,
          confirm_password: confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setLoading(false);
        if (response.data.code === 200) {
          Swal.fire({
            position: "bottom",
            customClass: {
              popup: "custom-swal",
              icon: "custom-icon-swal",
              title: "custom-title-swal",
              confirmButton: "custom-confirm-button-swal",
            },
            icon: "success",
            title: `<p class="w-auto pl-1 font-bold text-md">Kata sandi berhasil diperbarui</p><p class="text-sm w-auto pl-1 font-light">Silahkan login kembali</p>`,
            html: `
                            <div class="absolute px-28 ml-4 top-0 mt-4">
                              <hr class="border border-black w-16 h-1 bg-slate-700 rounded-lg "/>
                            </div>
                          `,
            width: "375px",
            showConfirmButton: true,
            confirmButtonText: "Masuk",
            confirmButtonColor: "#3FB648",
          }).then((result) => {
            if (result.isConfirmed) {
              localStorage.clear();
              router.push("/login");
            }
          });
        } else {
          setLoading(false);
          // setMessageError("Kode OTP Tidak Sesuai");
          AlertError(error, router);
        }
      })
      .catch((error) => {
        setLoading(false);
        AlertError(error, router);
      });
  };
  return (
    <main className="my-0 mx-auto min-h-full mobile-w relative">
      <div className="my-0 mx-auto h-screen max-w-480 overflow-x-hidden bg-white flex flex-col">
        <div className="container mx-auto mt-12 overflow-hidden">
          <Header backto="/" title="Buat Ulang Kata Sandi" />

          <div className="p-4 flex flex-col gap-2">
            <label htmlFor="password" className="text-sm">
              {" "}
              Kata Sandi Baru
            </label>
            <div
              className={`flex flex-row items-center p-4 pr-2 py-0 bg-gray-100 text-sm rounded-lg focus:ring-blue-500 w-full text-gray-400   ${(inputPassword && !validpassword) || messageError
                  ? "borde border-2 border-red-500"
                  : ""
                }`}
            >
              <IconLock />
              <input
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "password" : "text"}
                id="password"
                className="text-black ml-2 w-full p-0 py-4 pl-1 bg-transparent"
                placeholder="Kata Sandi Baru"
                required
              />
              <button onClick={handleClickShowPassword}>
                {showPassword ? <IconEye /> : <IconEyeClosed />}
              </button>
            </div>
            <p
              className={
                inputPassword && !validpassword
                  ? "instructions italic text-[10px] flex items-center"
                  : "hidden"
              }
            >
              <IconInfoCircle size={15} className="mr-1 text-red-600" />
              <span className="text-red-600">Minimal 8 karakter</span>
            </p>
            {messageError && (
              <p className="instructions italic text-[10px] flex items-center">
                <IconInfoCircle size={15} className="mr-1 text-red-600" />

                <span className="text-red-600">{messageError}</span>
              </p>
            )}

            <label htmlFor="confirmPassword" className="text-sm">
              Masukan ulang kata sandi baru
            </label>
            <div
              className={`flex flex-row items-center p-4 pr-2 py-0 bg-gray-100 text-sm rounded-lg focus:ring-blue-500 w-full text-gray-400 ${(confirmPassword && !validconfirmPassword) || messageError
                  ? "borde border-2 border-red-500"
                  : ""
                }`}
            >
              <IconLock />
              <input
                onChange={(e) => setConfirmPassword(e.target.value)}
                type={showConfirmPassword ? "password" : "text"}
                id="confirmPassword"
                className="text-black ml-2 w-full p-0 py-4 pl-1 bg-transparent"
                placeholder="Masukan ulang kata sandi baru"
                required
              />
              <button onClick={handleClickShowConfirmPassword}>
                {showConfirmPassword ? <IconEye /> : <IconEyeClosed />}
              </button>
            </div>
            <p
              className={
                confirmPassword && !validconfirmPassword
                  ? "instructions italic text-[10px] flex items-center"
                  : "hidden"
              }
            >
              <IconInfoCircle size={15} className="mr-1 text-red-600" />
              <span className="text-red-600">Minimal 8 karakter</span>
            </p>
            {messageError && (
              <p className="instructions italic text-[10px] flex items-center">
                <IconInfoCircle size={15} className="mr-1 text-red-600" />

                <span className="text-red-600">{messageError}</span>
              </p>
            )}

            <div className="grid gap-6 content-center absolute bottom-0 left-0 w-full p-4">
              <button
                onClick={handleSubmit}
                type="submit"
                className=" text-white bg-primary hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-bold rounded-xl text-md w-full sm:w-auto py-3 text-center "
              >
                Kirim
              </button>
            </div>
          </div>

          {loading && <Loading />}
        </div>
      </div>
    </main>
  );
};

export default newPassword;
