import CompressImage from "@/components/CompressImage";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import Error401 from "@/components/error401";
import styles from "@/styles/Home.module.css";
import {
  IconBuildingStore,
  IconDeviceMobile,
  IconHome,
  IconInfoCircle,
  IconMapPin,
  IconUser,
} from "@tabler/icons-react";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const MerchantUpdateProfile = (profile) => {
  const router = useRouter();
  const [role, setRole] = useState("");
  const [dataUser, setDataUser] = useState();
  const [merchant_name, setMerchantName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [sub_district, setSub_district] = useState("");
  const [postal_code, setPostal_code] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [loading, setLoading] = useState(true);
  const [profile_pic, setProfilePic] = useState(null);
  const [uploadedFile, setUploadedFile] = useState("");
  const [validImage, setValidImage] = useState(true);
  const [converted, setconverted] = useState();

  const getMimeType = (uploadedFile) => {
    const match = uploadedFile.match(/^data:(.*?);base64,/);
    return match ? match[1] : "application/octet-stream";
  };

  function base64ToArrayBuffer(base64) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  function base64ToFile(base64, mimeType) {
    const arrayBuffer = base64ToArrayBuffer(base64);
    return new File([arrayBuffer], localStorage.getItem("fileName"), {
      type: mimeType,
    });
  }

  useEffect(() => {
    axios
      .get(
        `${
          process.env.NEXT_PUBLIC_API_BASE_URL
        }merchant/fetch/${localStorage.getItem("Merchant_id")}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        setDataUser(response.data.body);
        if (localStorage.getItem("phone")) {
          setPhone(localStorage.getItem("phone"));
        } else {
          setPhone(response.data.body.no_link_aja);
        }
        if (localStorage.getItem("merchantName")) {
          setMerchantName(localStorage.getItem("merchantName"));
        } else {
          setMerchantName(response.data.body.merchant_name);
        }
        if (localStorage.getItem("uploadedFile")) {
          const mimeType = getMimeType(localStorage.getItem("uploadedFile"));
          // const filename = ( mimeType);
          const cleanBase64 = localStorage
            .getItem("uploadedFile")
            .replace(/^data:image\/\w+;base64,/, "");
          const file = base64ToFile(cleanBase64, mimeType);
          setUploadedFile(URL.createObjectURL(file));
          setProfilePic(file);
        } else {
          setProfilePic(response.data.body.merchant_photo);
        }
        if (localStorage.getItem("updatedAddress")) {
          const parseLocationObj = JSON.parse(
            localStorage.getItem("updatedAddress")
          );
          setAddress(parseLocationObj.fullAdres);
          setLatitude(parseLocationObj.coordinates.lat);
          setLongitude(parseLocationObj.coordinates.lng);
          setProvince(parseLocationObj.province);
          setPostal_code(parseLocationObj.postal_code);
          setSub_district(parseLocationObj.sub_district);
          setCity(parseLocationObj.city);
        } else {
          setAddress(response.data.body.address);
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        Error401(error, router);
      });
  }, []);

  const onSubmit = () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("merchant_name", merchant_name);
    formData.append("province", province);
    formData.append("city", city);
    formData.append("sub_district", sub_district);
    formData.append("postal_code", postal_code);
    formData.append("address", address);
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);
    formData.append("no_link_aja", phone);
    if (uploadedFile) {
      formData.append("merchant_photo", profile_pic);
    }
    axios
      .put(
        `${
          process.env.NEXT_PUBLIC_API_BASE_URL
        }merchant/update/${localStorage.getItem("Merchant_id")}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => {
        setLoading(false);
        const responeData = response.data.body;
        localStorage.removeItem("phone");
        localStorage.removeItem("merchantName");
        localStorage.removeItem("updatedAddress");
        localStorage.removeItem("uploadedFile");
        localStorage.removeItem("fileName");
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
          title: `<p class="w-auto pl-1 font-bold text-[25px]">Profile Toko Berhasil Diubah</p><p class="w-auto pl-1 font-light text-sm">Anda telah sukses merubah data toko anda</p>`,
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
        Error401(error, router);
      });
  };

  const handleProfilePhotoChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

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
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        localStorage.setItem("uploadedFile", reader.result);
        setUploadedFile(reader.result);
      };
      localStorage.setItem(
        "fileName",
        file.name.substring(0, file.name.lastIndexOf("."))
      );
      setProfilePic(file);
      setLoading(false);
    } else {
      CompressImage(file)
        .then((compressedFile) => {
          const size = (compressedFile.size / (1024 * 1024)).toFixed(2);
          if (size <= maxSize) {
            reader.readAsDataURL(compressedFile);
            reader.onloadend = () => {
              localStorage.setItem("uploadedFile", reader.result);
              setUploadedFile(reader.result);
            };
            localStorage.setItem(
              "fileName",
              file.name.substring(0, file.name.lastIndexOf("."))
            );
            setProfilePic(compressedFile);
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
        <Header title="Ubah Profile Toko" backto="/profile" />
        {loading ? (
          <div className={`${styles.card} `}>
            {[...Array(3)].map((_, index) => (
              <div key={index} className={`${styles.loadingCard}`}>
                <div className={`${styles.shimmer}`}></div>
              </div>
            ))}
          </div>
        ) : (
          <div class="pt-12 w-full h-screen flex flex-col">
            <div
              className={`flex flex-col items-center justify-center mt-5 w-full gap-6 ${
                uploadedFile || validImage ? "mb-6" : ""
              }`}
            >
              <label
                htmlFor="images"
                className="w-24 h-24 rounded-full bg-blue-100 grid place-items-center text-blue-600 cursor-pointer"
              >
                {uploadedFile && validImage ? (
                  <img
                    src={uploadedFile}
                    alt=""
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
                className={`flex flex-row items-center p-3 pr-2 py-0  ${
                  merchant_name ? "bg-transparent" : "bg-gray-50"
                } border-[1px] ${
                  !merchant_name && "border-red-500"
                }  text-gray-400 text-sm rounded-lg focus:ring-blue-500 w-full focus:border-none`}
              >
                <IconBuildingStore />
                <input
                  onChange={(e) => {
                    setMerchantName(e.target.value);
                    localStorage.setItem("merchantName", e.target.value);
                  }}
                  value={merchant_name}
                  // defaultValue={dataUser?.merchant_name}
                  type="text"
                  id="name"
                  className="text-black ml-2 w-full p-0 py-4 pl-1 bg-transparent focus:border-none"
                  placeholder="Nama"
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <div
                  className={`flex flex-row items-center p-3 pr-2 py-0 ${
                    phone ? "bg-transparent" : "bg-gray-50"
                  } border-[1px] ${
                    (!phone && !validPhone && "border-red-500") ||
                    (phone && !validPhone && "border-red-500")
                  }  text-gray-400 text-sm rounded-lg focus:ring-blue-500 w-full focus:border-none`}
                >
                  <IconDeviceMobile />
                  <input
                    onChange={(e) => {
                      localStorage.setItem("phone", e.target.value);
                      setPhone(e.target.value);
                    }}
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
              <div
                className={`flex flex-row items-start h-24 p-3 pr-2  ${
                  address ? "bg-transparent" : "bg-gray-50"
                } border-[1px] ${
                  !address && "border-red-500"
                }  text-gray-400 text-sm rounded-lg focus:ring-blue-500 w-full focus:border-none`}
              >
                <IconHome />
                <textarea
                  disabled
                  onChange={(e) => setAddress(e.target.value)}
                  type="text"
                  id="address"
                  className="text-black ml-2 w-full h-full p-0 pr-0.5 pl-1 bg-transparent focus:border-none outline-none resize-none"
                  placeholder="Alamat"
                  required
                  value={address}
                />
                <button
                  onClick={() => {
                    router.push("/merchant-change-address");
                  }}
                  title="Pilih Map"
                  className="text-red-400 h-full flex text-center justify-center items-center"
                >
                  <IconMapPin />
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="flex justify-end py-8 px-2">
          <button
            disabled={
              !validImage || !phone || !merchant_name || !address || !validPhone
            }
            onClick={onSubmit}
            className={`flex items-center justify-center ${
              !validImage || !phone || !merchant_name || !address || !validPhone
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

export default MerchantUpdateProfile;
