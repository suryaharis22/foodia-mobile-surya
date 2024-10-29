import {
  IconCamera,
  IconCircleCheck,
  IconCircleX,
  IconCurrentLocation,
  IconDeviceMobile,
  IconFile,
  IconId,
  IconInfoCircle,
  IconMailbox,
  IconMap,
  IconMapPin,
  IconNote,
  IconShield,
  IconUser,
} from "@tabler/icons-react";
import axios from "axios";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import LinkAja from "../../../public/icon/payment/LinkAja.png";
import RoutStep from "../RoutStep";
import SweetAlert from "../SweetAlert";
import Loading from "../Loading";
import Error401 from "../error401";
import CompressImage from "../CompressImage";
const DynamicMap = dynamic(() => import("../page/GeoMap"), { ssr: false });

function StepOne({ registrasibeneficiaries, setRegistrasibeneficiaries }) {
  // const { stepForm } = props;
  const router = useRouter();
  const [loadingSelfi, setLoadingSelfi] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingKTP, setLoadingKTP] = useState(false);
  const phoneNumber = localStorage.getItem("phone") || "";
  const [beneficiaries_name, setbeneficiaries_name] = useState(
    registrasibeneficiaries?.beneficiaries_name ?? ""
  );
  const [ktp_number, setktp_number] = useState(
    registrasibeneficiaries?.ktp_number ?? ""
  );
  const [self_photo, setself_photo] = useState(
    registrasibeneficiaries?.self_photo || null
  );
  const [ktp_photo, setktp_photo] = useState(
    registrasibeneficiaries?.ktp_photo || null
  );
  // const [no_link_aja, setno_link_aja] = useState(
  //   registrasibeneficiaries?.no_link_aja ?? ""
  // );

  const Toast = Swal.mixin({
    toast: true,
    position: "center",
    iconColor: "white",
    customClass: {
      popup: "colored-toast",
    },
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
  });

  const handlebeneficiaries_nameChange = (event) => {
    setbeneficiaries_name(event.target.value);
  };

  const handlektp_numberChange = async (event) => {
    const value = event.target.value;
    // if (value.length > 16) {
    //   await Toast.fire({
    //     icon: "error",
    //     title: "Nomer KTP maksimal 16 angka",
    //     iconColor: "bg-black",
    //   });
    // } else {
    setktp_number(value);
    // }
  };
  const handleself_photoChange = (event) => {
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
    setLoadingSelfi(true);
    if (!allowedTypes.includes(file.type)) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Hanya file PNG, JPG, JPEG dan HEIF yang diizinkan!",
      });
      setLoadingSelfi(false);
      return;
    }
    if (file.size <= maxSize) {
      setself_photo(file);
      setLoadingSelfi(false);
    } else {
      CompressImage(file)
        .then((compressedFile) => {
          const size = (compressedFile.size / (1024 * 1024)).toFixed(2);
          if (size <= maxSize) {
            setself_photo(compressedFile);
          } else {
            Toast.fire({
              icon: "error",
              title: "Ukuran gambar melebihi 5MB!",
              iconColor: "bg-black",
            });
          }
          setLoadingSelfi(false);
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Ukuran gambar melebihi 5MB!",
          });
          setLoadingSelfi(false);
          setLoading(false);
        });
    }
  };
  const handlektp_photoChange = (event) => {
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
    setLoadingKTP(true);
    if (!allowedTypes.includes(file.type)) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Hanya file PNG, JPG, JPEG dan HEIF yang diizinkan!",
      });
      setLoadingKTP(false);
      return;
    }
    if (file.size <= maxSize) {
      setktp_photo(file);
      setLoadingKTP(false);
    } else {
      CompressImage(file)
        .then((compressedFile) => {
          const size = (compressedFile.size / (1024 * 1024)).toFixed(2);
          if (size <= maxSize) {
            setktp_photo(compressedFile);
          } else {
            Toast.fire({
              icon: "error",
              title: "Ukuran gambar melebihi 5MB!",
              iconColor: "bg-black",
            });
          }
          setLoadingKTP(false);
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Ukuran gambar melebihi 5MB!",
          });
          setLoadingKTP(false);
          setLoading(false);
        });
    }
  };
  // const handleNo_link_ajaChange = (event) => {
  //   setno_link_aja(event.target.value);
  // };

  // Function to handle form submission
  const handleSubmit = (event) => {
    // event.preventDefault(); // Prevents the default form submission

    // Validation checks
    if (
      !beneficiaries_name ||
      !ktp_number ||
      !self_photo ||
      !ktp_photo ||
      !phoneNumber
    ) {
      window.alert("All fields are required");
      return;
    }

    // Create an object with the form data
    const formData = {
      beneficiaries_name,
      ktp_number,
      self_photo,
      ktp_photo,
      phoneNumber,
    };

    // Save the form data to the registrasibeneficiaries state
    setRegistrasibeneficiaries(formData);

    // clear data after submit
    setbeneficiaries_name("");
    setktp_number("");
    setself_photo("");
    setktp_photo("");

    router.push("/registrasi/beneficiaries?step=2");
  };
  useEffect(() => { }, [registrasibeneficiaries]);

  const NAME_REGEX = /^[^\r\n]{1,64}$/;
  const PHONE_REGEX = /^(\+62|62|0)8[1-9][0-9]{7,10}$/;
  const KTP_REGEX = /^[1-9][0-9]{15,15}$/;
  const [validName, setValidName] = useState(false);
  const [validPhone, setValidPhone] = useState(false);
  const [validKTP, setValidKTP] = useState(false);

  useEffect(() => {
    setValidName(NAME_REGEX.test(beneficiaries_name));
  }, [beneficiaries_name]);

  useEffect(() => {
    setValidPhone(PHONE_REGEX.test(phoneNumber));
  }, [phoneNumber]);

  useEffect(() => {
    setValidPhone(PHONE_REGEX.test(phoneNumber));
  }, [phoneNumber]);

  useEffect(() => {
    setValidKTP(KTP_REGEX.test(ktp_number));
  }, [ktp_number]);

  return (
    <>
      <div className="p-2 w-full space-y-3 px-7 mt-[16px]">
        <div>
          <div className="w-full p-2 ">
            <p className="w-full text-[14px] font-bold">Data Pribadi</p>
          </div>
          <div className="flex flex-row p-4 py-0 bg-gray-100 text-gray-400 text-sm rounded-lg focus:ring-blue-500 w-full focus:border-none pr-2">
            <IconUser className="mt-3.5" />
            <input
              onChange={handlebeneficiaries_nameChange}
              value={beneficiaries_name}
              type="text"
              id="beneficiaries_name"
              className="ml-2 w-full p-0 py-4 pl-1 text-black bg-transparent focus:border-none  outline-none"
              placeholder="Nama Lengkap Sesuai Kartu Identitas"
              required
            />
          </div>
        </div>

        {/* <div>
          <div className="flex flex-row p-4 py-0 bg-gray-100 text-gray-400 text-sm rounded-lg focus:ring-blue-500 w-full focus:border-none pr-2">
            <IconDeviceMobile className="mt-3.5" />
            <input
              value={no_link_aja}
              onChange={handleNo_link_ajaChange}
              type="number"
              id="number"
              className="ml-2 w-full p-0 py-4 pl-1 text-black bg-transparent focus:border-none  outline-none"
              placeholder="Nomor HP"
              required
            />
            <IconCircleCheck
              className={validPhone ? "text-green-600 mt-3.5" : "hidden"}
            />
            <IconCircleX
              className={!no_link_aja || validPhone ? "hidden" : "text-red-600 mt-3.5"}
            />
          </div>

          <p
            className={
              no_link_aja && !validPhone
                ? "instructions italic text-[10px] flex items-center"
                : "hidden"
            }
          >
            <IconInfoCircle size={15} className="mr-1 text-red-600" />
            <span className="text-red-600">
              Diawali (08), Minimal 10 dan maksimal 13 angka.
            </span>
          </p>
        </div> */}

        <div className="mb-2">
          <div className="flex items-start justify-center w-full relative">
            <label className="flex flex-col items-start justify-center w-full h-36 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-200 dark:hover:bg-gray-400 hover:bg-gray-100">
              {loadingSelfi && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 rounded-lg">
                  <svg
                    aria-hidden="true"
                    className="w-12 h-12 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                </div>
              )}
              {self_photo ? (
                <img
                  src={URL.createObjectURL(self_photo)}
                  alt="Foto Selfi"
                  className="w-full h-full rounded-lg object-cover"
                />
              ) : (
                <div className="flex flex-row items-center justify-center gap-2 pl-2">
                  <div className="flex h-24 flex-row items-center justify-center bg-primary rounded-lg w-28">
                    <IconCamera size={50} fontWeight={1} color="white" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="text-sm font-bold">Foto Selfi</p>
                    <p className="text-xs">Ambil foto Selfi kamu</p>
                  </div>
                </div>
              )}
              <input
                id="fotoSelfi"
                type="file"
                className="hidden"
                onChange={handleself_photoChange}
              />
            </label>
          </div>
        </div>

        <div className="mb-2">
          <div className="flex items-start justify-center w-full relative">
            <label className="flex flex-col items-start justify-center w-full h-36 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-200 dark:hover:bg-gray-400 hover:bg-gray-100">
              {loadingKTP && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 rounded-lg">
                  <svg
                    aria-hidden="true"
                    className="w-12 h-12 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                </div>
              )}
              {ktp_photo ? (
                <img
                  src={URL.createObjectURL(ktp_photo)}
                  alt="Foto KTP"
                  className="w-full h-full rounded-lg object-cover"
                />
              ) : (
                <div className="flex flex-row items-center justify-center gap-2 pl-2">
                  <div className="flex h-24 flex-row items-center justify-center bg-primary rounded-lg w-28">
                    <IconCamera size={50} fontWeight={1} color="white" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="text-sm font-bold">Foto KTP</p>
                    <p className="text-xs">Ambil foto KTP kamu</p>
                  </div>
                </div>
              )}
              <input
                id="fotoKTP"
                type="file"
                className="hidden"
                onChange={handlektp_photoChange}
              />
            </label>
          </div>
        </div>

        <div>
          <div className="flex flex-row items-center p-4 py-0 bg-gray-100 text-gray-400 text-sm rounded-lg focus:ring-blue-500 w-full focus:border-none pr-2">
            <IconId />
            <input
              value={ktp_number}
              onChange={handlektp_numberChange}
              type="number"
              min="0" // Hanya menerima angka positif
              onKeyDown={(e) => {
                // Mencegah huruf 'e', '+', dan '-' diinput
                if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                  e.preventDefault();
                }
              }}
              id="ktp_number"
              className="ml-2 w-full p-0 py-4 pl-1 text-black outline-nones bg-transparent focus:border-none"
              placeholder="No. KTP"
              required
            />
            <IconCircleCheck
              className={validKTP ? "text-green-600" : "hidden"}
            />
            <IconCircleX
              className={!ktp_number || validKTP ? "hidden" : "text-red-600"}
            />
          </div>
          <p
            className={
              ktp_number && !validKTP
                ? "instructions italic text-[10px] flex items-center"
                : "hidden"
            }
          >
            <IconInfoCircle size={15} className="mr-1 text-red-600" />
            <span className="text-red-600">
              Minimal 16 dan maksimal 16 angka.
            </span>
          </p>
        </div>

        <div className="grid gap-4 content-center">
          <button
            disabled={
              !beneficiaries_name ||
              !ktp_number ||
              !self_photo ||
              !ktp_photo ||
              !validKTP ||
              !validName
            }
            onClick={() => handleSubmit()}
            type="submit"
            className={
              !beneficiaries_name ||
                !ktp_number ||
                !self_photo ||
                !ktp_photo ||
                !validKTP ||
                !validName
                ? "text-white bg-gray-400 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-xl w-full sm:w-auto px-5 py-2.5 text-center"
                : "text-white bg-primary hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-xl w-full sm:w-auto px-5 py-2.5 text-center"
            }
          >
            Lanjut
          </button>
        </div>
      </div>
    </>
  );
}

function StepTwo({ registrasibeneficiaries, setRegistrasibeneficiaries }) {
  const router = useRouter();
  const [locationInfo, setLocationInfo] = useState(null);
  const [address, setAddress] = useState(
    registrasibeneficiaries?.location ?? ""
  );
  const [province, setProvince] = useState(
    registrasibeneficiaries?.province ?? ""
  );
  const [city, setCity] = useState(registrasibeneficiaries?.city ?? "");
  const [sub_district, setSubDistrict] = useState(
    registrasibeneficiaries?.subDistrict ?? ""
  );
  const [village, setVillage] = useState(
    registrasibeneficiaries?.village ?? ""
  );
  const [postal_code, setPostalCode] = useState(
    registrasibeneficiaries?.postalCode ?? ""
  );
  const [coordinates, setCoordinates] = useState(
    registrasibeneficiaries?.coordinates ?? ""
  );
  const [DetaiAlamat, setDetaiAlamat] = useState(
    registrasibeneficiaries?.DetaiAlamat ?? ""
  );
  const [loading, setLoading] = useState(false);
  const [tracking, setTracking] = useState(true);

  const handleDataFromMap = (receivedLocationInfo) => {
    setLocationInfo(receivedLocationInfo);
  };

  useEffect(() => {
    if (tracking) {
      handleDataFromMap();
    }
  });

  const getCurrentLocation = () => {
    setTracking((prevTracking) => !prevTracking);
  };
  const handleProvince = (event) => {
    setProvince(event.target.value);
  };
  const handleCity = (event) => {
    setCity(event.target.value);
  };
  const handleSubDistrict = (event) => {
    setSubDistrict(event.target.value);
  };
  const handleVillage = (event) => {
    setVillage(event.target.value);
  };
  const handlePostalCode = (event) => {
    setPostalCode(event.target.value);
  };
  const handleAddress = (event) => {
    setAddress(event.target.value);
  };
  const handleDetaiAlamatChange = (event) => {
    setDetaiAlamat(event.target.value);
  };

  useEffect(() => {
    if (locationInfo) {
      setAddress(locationInfo.fullAdres);
      setProvince(locationInfo.province);
      setCity(locationInfo.city);
      setSubDistrict(locationInfo.sub_district);
      setVillage(locationInfo.response.address.village);
      setPostalCode(locationInfo.postal_code);
      setCoordinates(locationInfo.coordinates);
      // setJalan(locationInfo.address);
    }
  }, [locationInfo]);

  const handleSubmit = (e) => {
    setLoading(true);
    if (
      !address ||
      !province ||
      !city ||
      !sub_district ||
      !postal_code ||
      !coordinates
    ) {
      return Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please fill in all required fields",
        showConfirmButton: false,
        timer: 2000,
      });
    }
    setRegistrasibeneficiaries((prevData) => ({
      ...prevData,
      address,
      province,
      city,
      sub_district,
      postal_code,
      latitude: coordinates.lat,
      longitude: coordinates.lng,
      DetaiAlamat,
      village,
    }));
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    if (!coordinates.lat || !coordinates.lng) {
      return Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please select a location",
        showConfirmButton: false,
        timer: 2000,
      });
    }

    const formData = new FormData();
    formData.append("fullname", registrasibeneficiaries?.beneficiaries_name);
    formData.append("phone", registrasibeneficiaries?.phoneNumber);
    formData.append("ktp_photo", registrasibeneficiaries?.ktp_photo);
    formData.append("self_photo", registrasibeneficiaries?.self_photo);
    formData.append("ktp_number", registrasibeneficiaries?.ktp_number);
    formData.append("latitude", coordinates.lat);
    formData.append("longitude", coordinates.lng);
    formData.append("province", province);
    formData.append("city", city);
    formData.append("village", village);
    formData.append("subdistrict", sub_district);
    formData.append("address", address);

    axios
      .post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}beneficiaries/registration`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then(() => {
        setLoading(false);
        localStorage.setItem("status", "waiting");
        Swal.fire({
          position: "bottom",
          customClass: {
            popup: "custom-swal",
            icon: "custom-icon-swal",
            title: "custom-title-swal",
            confirmButton: "custom-confirm-button-swal",
          },
          icon: "success",
          title: `<p class="w-auto pl-1 font-bold text-md">Pengajuan Formulir Berhasil Dikirim</p><p class="text-sm w-auto pl-1 font-light">Pendaftaran sedang di-review oleh admin. Estimasi 3 x 24 jam</p>`,
          html: `
              <div class="absolute px-28 ml-4 top-0 mt-4">
                <hr class="border border-black w-16 h-1 bg-slate-700 rounded-lg "/>
              </div>
            `,
          width: "375px",
          showConfirmButton: true,
          confirmButtonText: "Kembali",
          confirmButtonColor: "#3FB648",
        }).then((result) => {
          if (result.isConfirmed) {
            router.push("/home");
          }
        });
      })
      .catch((error) => {
        setLoading(false);
        if (error.response && error.response.status === 401) {
          Error401(error, router);
        } else if (error.response && error.response.status === 500) {
          // Handle 500 Internal Server Error
          localStorage.setItem("status", "waiting");
          setLoading(false);
          Swal.fire({
            icon: "warning",
            title: "Gagal Mendaftarkan",
            text: `email sudah terdaftar`,
            showConfirmButton: false,
            timer: 2000,
          })
        } else {
          setLoading(false);
          Swal.fire({
            icon: "error",
            title: "Gagal Mendaftarkan",
            text: `Terjadi kesalahan`,
            showConfirmButton: false,
            timer: 2000,
          })
        }
        // router.push("/registrasi/beneficiaries?step=3");
      });
  };

  return (
    <>
      {/* <div className="py-2 mt-2 w-full px-5 flex flex-row justify-between">
        <button
          onClick={getCurrentLocation}
          className="bg-gray-50 border border-primary text-gray-900 text-sm rounded-xl block w-full p-2.5 m-1 outline-none hover:bg-gray-200"
        >
          {tracking ? (
            <p> Custom Location</p>
          ) : (
            <p className="flex flex-row items-center justify-center gap-2">
              <IconMapPin className="text-primary" />
              Gunakan Lokasi Saat Ini
            </p>
          )}
        </button>
      </div> */}

      <div className="w-full space-y-3">
        <div className="flex flex-col gap-4 justify-center border-gray-300 rounded-lg">
          <DynamicMap
            sendDataToPage={handleDataFromMap}
            tracking={tracking}
            setTracking={() => setTracking(false)}
          />
          <button
            onClick={getCurrentLocation}
            className="bg-gray-50 mx-4 border-primary border-2 text-gray-900 text-sm rounded-lg block p-2.5"
          >
            <p className="flex flex-row items-center justify-center gap-2">
              <IconMapPin color="red" />
              Gunakan Lokasi Saat Ini
            </p>
          </button>
        </div>
        <div className="px-5 flex flex-col gap-4 py-4">
          <div className="flex flex-row items-center p-4 pr-0 py-0 bg-gray-100 text-gray-400 text-sm rounded-lg focus:ring-blue-500 w-full focus:border-none">
            <IconMap />
            <textarea
              // onChange={(e) => setLocation(e.target.value)}
              // disabled
              value={address}
              type="text"
              className="ml-2 w-full text-black px-1 p-0 py-4 pl-1 bg-transparent focus:border-none outline-none"
              placeholder="Wilayah"
            // required
            />
          </div>
          <div className="flex flex-row items-center p-4 pr-0 py-0 bg-gray-100 text-gray-400 text-sm rounded-lg focus:ring-blue-500 w-full focus:border-none">
            <IconMap />
            <input
              onChange={handleCity}
              value={city}
              type="text"
              className="ml-2 w-full text-black px-1 p-0 py-4 pl-1 bg-transparent focus:border-none"
              placeholder="Kota/Kabupaten"
              required
            />
          </div>
          <div className="flex flex-row items-center p-4 pr-0 py-0 bg-gray-100 text-gray-400 text-sm rounded-lg focus:ring-blue-500 w-full focus:border-none">
            <IconMap />
            <input
              onChange={handleSubDistrict}
              value={sub_district}
              type="text"
              className="ml-2 w-full text-black px-1 p-0 py-4 pl-1 bg-transparent focus:border-none"
              placeholder="Kecamatan"
              required
            />
          </div>
          <div className="flex flex-row items-center p-4 pr-0 py-0 bg-gray-100 text-gray-400 text-sm rounded-lg focus:ring-blue-500 w-full focus:border-none">
            <IconMap />
            <input
              onChange={handleVillage}
              value={village}
              type="text"
              className="ml-2 w-full text-black px-1 p-0 py-4 pl-1 bg-transparent focus:border-none"
              placeholder="Kelurahan"
              required
            />
          </div>
          <div className="flex flex-row items-center p-4 pr-0 py-0 bg-gray-100 text-gray-400 text-sm rounded-lg focus:ring-blue-500 w-full focus:border-none">
            <IconMailbox />
            <input
              onChange={handlePostalCode}
              value={postal_code}
              type="number"
              min="0"
              onKeyDown={(e) => {
                if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                  e.preventDefault();
                }
              }}
              className="ml-2 text-black w-full px-1 p-0 py-4 pl-1 bg-transparent focus:border-none"
              placeholder="Kode Pos"
              required
            />
          </div>
          <div className="flex flex-row items-center p-4 pr-0 py-0 bg-gray-100 text-gray-400 text-sm rounded-lg focus:ring-blue-500 w-full focus:border-none">
            <IconNote />
            <textarea
              onChange={handleDetaiAlamatChange}
              value={DetaiAlamat}
              type="text"
              className="ml-2 w-full text-black px-1 p-0 pl-1 py-4 bg-transparent focus:border-none outline-none"
              placeholder="Detail Alamat (Opsional)"
              required
            />
          </div>
          <div className="grid gap-4 content-center">
            <button
              onClick={() => handleSubmit()}
              disabled={
                !address ||
                !province ||
                !city ||
                !sub_district ||
                !postal_code ||
                !coordinates ||
                !village
              }
              type="submit"
              className={
                !address ||
                  !province ||
                  !city ||
                  !sub_district ||
                  !postal_code ||
                  !coordinates ||
                  !village
                  ? `text-white bg-gray-400 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-full text-sm w-full sm:w-auto px-5 py-2.5 text-center`
                  : `text-white bg-primary focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-full text-sm w-full sm:w-auto px-5 py-2.5 text-center`
              }
            >
              Submit
            </button>
          </div>
        </div>
        {loading && <Loading />}
      </div>
    </>
  );
}

export { StepOne, StepTwo };
