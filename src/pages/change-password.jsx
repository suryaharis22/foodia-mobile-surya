import Header from "@/components/Header";
import Loading from "@/components/Loading";
import Error401 from "@/components/error401";
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

const ChangePassword = (ChangePassword) => {
  const router = useRouter();
  const { state } = useAppState();
  const register = state.registrasi;
  const [inputPassword, setPassword] = useState("");
  const [inputOldPassword, setOldPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(true);
  const [showPassword, setShowPassword] = useState(true);
  const [showConfirmPassword, setShowConfirmPassword] = useState(true);
  const [validconfirmPassword, setValidconfirmPassword] = useState(false);
  const [validpassword, setValidPassword] = useState(false);
  const [messageOldPwError, setMessageOldPwError] = useState("");
  const [messageNewPwError, setMessageNewPwError] = useState("");
  const [messageConfirmError, setMessageConfirmError] = useState("");

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowOldPassword = () => setShowOldPassword((show) => !show);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((show) => !show);
  const [loading, setLoading] = useState(false);

  const Password_REGEX =
    /^[0-9A-Za-z!@#$%^&*'"`()_+{}\[\]:;<>,.?=~\/\\|-]{8,}$/;
  const confirmPassword_REGEX =
    /^[0-9A-Za-z!@#$%^&*"'`()_+{}\[\]:;<>,.?=~\/\\|-]{8,}$/;

  useEffect(() => {
    setValidPassword(Password_REGEX.test(inputPassword));
    setMessageOldPwError("");
    setMessageNewPwError("");
    setMessageConfirmError("");
  }, [inputPassword]);

  useEffect(() => {
    setValidconfirmPassword(confirmPassword_REGEX.test(confirmPassword));
    setMessageOldPwError("");
    setMessageNewPwError("");
    setMessageConfirmError("");
  }, [confirmPassword]);

  const handleSubmit = () => {
    if (inputPassword !== confirmPassword) {
      setMessageConfirmError("Ulang kata sandi tidak sesuai");
      return;
    }

    setLoading(true);
    axios
      .post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}auth/profile/change-password`,
        {
          old_password: inputOldPassword,
          new_password: inputPassword,
          confirm_password: confirmPassword,
        },
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then(() => {
        if (inputOldPassword === inputPassword) {
          axios
            .post(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}auth/profile/change-password`,
              {
                old_password: inputOldPassword,
                new_password: inputOldPassword,
                confirm_password: inputOldPassword,
              },
              {
                headers: {
                  authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            )
            .then(() => {
              setLoading(false);
              setMessageNewPwError(
                "Kata sandi baru tidak boleh sama dengan kata sandi lama"
              );
            })
            .catch((error) => {
              Error401(error, router);
            });
        } else {
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
            title: `<p class="w-auto pl-1 font-bold text-[25px]">Kata Sandi Berhasil Diperbaharui</p>`,
            html: `
                    <div class="absolute px-24 ml-10 top-0 mt-4">
                      <hr class="border border-gray-400 w-10 h-1 bg-gray-400 rounded-lg "/>
                    </div>
                  `,
            width: "375px",
            showConfirmButton: true,
            confirmButtonText: "Kembali Ke Profile",
            confirmButtonColor: "#3FB648",
            allowOutsideClick: false,
          }).then((result) => {
            if (result.isConfirmed) {
              router.push("/profile");
            }
          });
        }
      })
      .catch((error) => {
        setLoading(false);
        if (error.response.data.code == 400) {
          setMessageOldPwError("Kata sandi lama tidak sesuai");
        } else {
          Error401(error, router);
        }
      });
  };
  return (
    <main className="my-0 mx-auto min-h-full mobile-w relative">
      <div className="my-0 mx-auto h-screen max-w-480 overflow-x-hidden bg-white flex flex-col">
        <div className="container mx-auto mt-12 overflow-hidden">
          <Header title="Ubah Kata Sandi" />

          <div className="p-4 flex flex-col gap-2">
            <label htmlFor="password" className="text-sm">
              {" "}
              Masukan kata sandi lama
            </label>
            <div
              className={`flex flex-row items-center border-[1px] p-4 pr-2 py-0 ${
                !inputOldPassword && "bg-gray-100"
              } text-sm rounded-lg focus:ring-blue-500 w-full text-gray-400 ${
                messageOldPwError && "border-red-500"
              }`}
            >
              <IconLock />
              <input
                onChange={(e) => setOldPassword(e.target.value)}
                type={showOldPassword ? "password" : "text"}
                id="password"
                className="text-black ml-2 w-full p-0 py-4 pl-1 bg-transparent"
                placeholder="Kata Sandi Lama"
                required
              />
              <button onClick={handleClickShowOldPassword}>
                {showOldPassword ? <IconEye /> : <IconEyeClosed />}
              </button>
            </div>
            {messageOldPwError && (
              <p className="instructions italic text-[10px] flex items-center">
                <IconInfoCircle size={15} className="mr-1 text-red-600" />

                <span className="text-red-600">{messageOldPwError}</span>
              </p>
            )}

            <label htmlFor="password" className="text-sm">
              {" "}
              Masukan kata sandi baru
            </label>
            <div
              className={`flex flex-row items-center border-[1px] p-4 pr-2 py-0  ${
                !inputPassword && "bg-gray-100"
              }  text-sm rounded-lg focus:ring-blue-500 w-full text-gray-400 ${
                !validpassword && inputPassword && "border-red-500"
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
            {messageNewPwError && (
              <p className="instructions italic text-[10px] flex items-center">
                <IconInfoCircle size={15} className="mr-1 text-red-600" />

                <span className="text-red-600">{messageNewPwError}</span>
              </p>
            )}

            <label htmlFor="confirmPassword" className="text-sm">
              Masukan ulang kata sandi baru
            </label>
            <div
              className={`flex flex-row items-center border-[1px] p-4 pr-2 py-0  ${
                !confirmPassword && "bg-gray-100"
              }  text-sm rounded-lg focus:ring-blue-500 w-full text-gray-400 ${
                messageConfirmError && "border-red-500"
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
            {messageConfirmError && (
              <p className="instructions italic text-[10px] flex items-center">
                <IconInfoCircle size={15} className="mr-1 text-red-600" />

                <span className="text-red-600">{messageConfirmError}</span>
              </p>
            )}

            <div className="flex justify-end py-8 mt-20 px-2">
              <button
                disabled={
                  !inputOldPassword ||
                  !inputPassword ||
                  !confirmPassword ||
                  !validpassword
                }
                onClick={handleSubmit}
                className={`flex items-center justify-center ${
                  !inputOldPassword ||
                  !inputPassword ||
                  !confirmPassword ||
                  !validpassword
                    ? "bg-gray-400"
                    : "bg-primary"
                } border-0 rounded-lg w-full h-10 text-white font-bold text-center`}
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

export default ChangePassword;
