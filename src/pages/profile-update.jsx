import CompressImage from "@/components/CompressImage";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import Error401 from "@/components/error401";
import {
  IconDeviceMobile,
  IconInfoCircle,
  IconMail,
  IconUser,
} from "@tabler/icons-react";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const UpdateProfile = (profile) => {
  const router = useRouter();
  const [role, setRole] = useState("");
  const [dataUser, setDataUser] = useState();
  const [fullname, setFullname] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [profile_pic, setProfilePic] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [validImage, setValidImage] = useState(true);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}auth/profile/fetch`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setLoading(false);
        setFullname(res.data.body.fullname);
        setPhone(res.data.body.phone);
        setEmail(res.data.body.email);
        setProfilePic(res.data.body.profile_pic);
        setRole(res.data.body.role);
      })
      .catch((error) => {
        setLoading(false);
        Error401(error, router);
      });
  }, [role]);

  const onSubmit = () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("fullname", fullname);
    formData.append("phone", phone);
    if (uploadedFile) {
      formData.append("profile_pic", uploadedFile);
    }
    axios
      .post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}auth/profile/update`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then(() => {
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
          title: `<p class="w-auto pl-1 font-bold text-[25px]">Profile Berhasil Diubah</p><p class="w-auto pl-1 font-light text-sm">Anda telah sukses merubah data diri anda</p>`,
          html: `
                  <div class="absolute px-24 ml-10 top-0 mt-4">
                    <hr class="border border-gray-400 w-10 h-1 bg-gray-400 rounded-lg "/>
                  </div>
                  `,
          width: "375px",
          showConfirmButton: true,
          confirmButtonText: "Kembali Ke Profile",
          confirmButtonColor: "#3FB648",
        }).then((result) => {
          if (result.isConfirmed) {
            router.push("/profile");
          }
        });
      })
      .catch((error) => {
        setLoading(false);
        const messages = {
          title: "Profil gagal diubah",
          text: "Nomor HP telah digunakan di akun lain",
        };
        Error401(error, router, messages);
      });
  };

  const handleProfilePhotoChange = (event) => {
    const file = event.target.files[0];
    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/heif",
      "image/heic",
    ];
    const maxSize = 5 * 1024 * 1024;
    if (!file) {
      return;
    }
    setLoading(true);

    if (!allowedTypes.includes(file?.type)) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Hanya file PNG, JPG, dan JPEG yang diizinkan!",
      });
      setLoading(false);
      return;
    }
    if (file.size <= maxSize) {
      setUploadedFile(file);
      setLoading(false);
    } else {
      CompressImage(file)
        .then((compressedFile) => {
          const size = (compressedFile.size / (1024 * 1024)).toFixed(2);
          if (size <= maxSize) {
            setUploadedFile(compressedFile);
          } else {
            Toast.fire({
              icon: "error",
              title: "Ukuran gambar melebihi 5MB!",
              iconColor: "bg-black",
            });
          }
          setLoading(false);
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Ukuran gambar melebihi 5MB!",
          });
          setLoading(false);
        });
    }
    setUploadedFile(file);
  };

  const PHONE_REGEX = /^(\+62|62|0)8[1-9][0-9]{7,10}$/;
  const [validPhone, setValidPhone] = useState(false);
  useEffect(() => {
    setValidPhone(PHONE_REGEX.test(phone));
  }, [phone]);

  return (
    <>
      <div className="bg-white flex flex-col px-1 h-screen">
        <Header title="Ubah Profile" />
        <div class="pt-12 w-full h-screen flex flex-col">
          <div
            className={`flex flex-col items-center justify-center mt-5 w-full gap-6 ${uploadedFile || validImage ? "mb-6" : ""
              }`}
          >
            <label
              htmlFor="images"
              className="w-24 h-24 rounded-full bg-blue-100 grid place-items-center text-blue-600 cursor-pointer"
            >
              {uploadedFile && validImage ? (
                <img
                  src={URL.createObjectURL(uploadedFile)}
                  alt="Foto KTP"
                  className="w-24 h-24 rounded-full bg-blue-100 grid place-items-center text-blue-600 object-cover"
                />
              ) : profile_pic !== "" && validImage ? (
                <img
                  src={`${process.env.NEXT_PUBLIC_URL_STORAGE}${profile_pic}`}
                  alt=""
                  className="w-24 h-24 rounded-full bg-blue-100 grid place-items-center text-blue-600 object-cover"
                />
              ) : (
                !validImage && (
                  <div className="w-24 h-24 rounded-full bg-blue-100 grid place-items-center text-blue-600 ">
                    <IconUser />
                  </div>
                )
              )}
              <input
                id="images"
                type="file"
                accept=".jpeg, .jpg, .png, .heif"
                className="hidden"
                onChange={handleProfilePhotoChange}
              />
              <p className="text-[11px] mt-2 text-[#1D5882] font-semibold">
                Ganti
              </p>
            </label>
            <p
              className={
                !validImage
                  ? "font-semibold instructions text-[13px] flex items-center"
                  : "hidden"
              }
            >
              <span className="text-red-600">
                Max 5 Mb dan format .jpeg, .jpg, .png, .heif
              </span>
            </p>
          </div>
          <div className="mb-4 p-3 px-2 flex flex-col gap-3">
            <div
              className={`flex flex-row items-center p-3 pr-2 py-0 bg-transparent border-[1px] ${!fullname && "border-red-500"
                }  text-gray-400 text-sm rounded-lg focus:ring-blue-500 w-full focus:border-none`}
            >
              <IconUser />
              <input
                onChange={(e) => setFullname(e.target.value)}
                value={fullname}
                type="text"
                id="name"
                className="text-black ml-2 w-full p-0 py-4 pl-1 bg-transparent focus:border-none"
                placeholder="Nama"
                required
              />
            </div>
            <div className="flex flex-row items-center p-3 pr-0 py-0 border-[1px] text-gray-400 text-sm rounded-lg w-full focus:border-none bg-gray-100">
              <IconMail />
              <input
                type="text"
                id="email"
                className="text-gray-400 ml-2 w-full p-0 py-4 pl-1 bg-transparent focus:border-none"
                placeholder="Email"
                disabled
                value={email}
              />
            </div>
            <div className="flex flex-col gap-1">
              <div
                className={`flex flex-row items-center p-3 pr-2 py-0 bg-transparent border-[1px] ${(!phone && !validPhone && "border-red-500") ||
                  (phone && !validPhone && "border-red-500")
                  }  text-gray-400 text-sm rounded-lg focus:ring-blue-500 w-full focus:border-none`}
              >
                <IconDeviceMobile />
                <input
                  onChange={(e) => setPhone(e.target.value)}
                  value={phone}
                  type="text"
                  id="name"
                  className="text-black ml-2 w-full p-0 py-4 pl-1 bg-transparent focus:border-none"
                  placeholder="No. Hp"
                  required
                />
              </div>
              <p
                className={
                  phone && !validPhone
                    ? "font-semibold instructions italic text-[10px] flex items-center"
                    : "hidden"
                }
              >
                <IconInfoCircle size={15} className="mr-1 text-red-600" />
                <span className="text-red-600">
                  Diawali dengan "08" dan min 10 digit
                </span>
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-end py-8 px-2">
          <button
            disabled={
              !validImage || !phone || !email || !fullname || !validPhone
            }
            onClick={onSubmit}
            className={`flex items-center justify-center ${!validImage || !phone || !email || !fullname || !validPhone
              ? "bg-gray-400"
              : "bg-primary"
              } border-0 rounded-lg w-full h-10 text-white font-bold text-center`}
          >
            Ubah
          </button>
        </div>
        {loading && <Loading />}
      </div>
    </>
  );
};

export default UpdateProfile;