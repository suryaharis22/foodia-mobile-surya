// src/components/FormCampaing/Step.jsx

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import "react-clock/dist/Clock.css";
import "react-time-picker/dist/TimePicker.css";
import RoutStep from "../RoutStep";

import {
  Icon123,
  IconCalendar,
  IconCamera,
  IconChevronCompactDown,
  IconChevronDown,
  IconChevronUp,
  IconCirclePlus,
  IconClock,
  IconCurrentLocation,
  IconDetails,
  IconFileDescription,
  IconGardenCart,
  IconHome2,
  IconInfoCircle,
  IconMap,
  IconMapPin,
  IconMapPinExclamation,
  IconMinus,
  IconMoneybag,
  IconNotes,
  IconPhotoScan,
  IconPlus,
  IconShoppingCart,
  IconUser,
  IconWallet,
} from "@tabler/icons-react";
import axios from "axios";
import dynamic from "next/dynamic";
import Image from "next/image";
import Swal from "sweetalert2";
import Market from "../../../public/img/illustration/market.png";
import CardListMerchan from "../page/Detonator/CardListMerchan";
import AddFoodCamp from "./AddFoodCamp";
import Error401 from "../error401";
import Header from "../Header";
import Loading from "../Loading";
import LinkAja from "../../../public/icon/payment/LinkAja.png";
import gopay from "../../../public/icon/payment/gopay.png";
import mandiri from "../../../public/bank/mandiri.png";
import bri from "../../../public/bank/bri.png";
import CompressImage from "../CompressImage";
import moment from "moment/moment";

const DynamicMap = dynamic(() => import("../page/GeoMap"), { ssr: false });

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

function StepOne({
  updateLocalStorage,
  setUploadedFile,
  uploadedFile,
  loading,
  setLoading,
}) {
  const router = useRouter();
  const [loadingFile, setLoadingFile] = useState(false);
  const [onFocusDate, setOnFocusDate] = useState(false);
  const [onFocusTime, setOnFocusTime] = useState(false);
  const [eventName, setEventName] = useState(() => {
    const storedFormData = localStorage.getItem("formData");
    const parsedFormData = storedFormData ? JSON.parse(storedFormData) : {};
    return parsedFormData.eventName || "";
  });

  const [TypeEvent, setTypeEvent] = useState(() => {
    const storedFormData = localStorage.getItem("formData");
    const parsedFormData = storedFormData ? JSON.parse(storedFormData) : {};
    return parsedFormData.TypeEvent || "";
  });

  const [Tanggal, setTanggal] = useState(() => {
    const storedFormData = localStorage.getItem("formData");
    const parsedFormData = storedFormData ? JSON.parse(storedFormData) : {};
    return parsedFormData.Tanggal || "";
  });

  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");
  const [Waktu, setWaktu] = useState("");
  const [Description, setDescription] = useState(() => {
    const storedFormData = localStorage.getItem("formData");
    const parsedFormData = storedFormData ? JSON.parse(storedFormData) : {};
    return parsedFormData.Description || "";
    Description;
  });

  useEffect(() => {
    setLoading(false);
    const storedFormData = localStorage.getItem("formData");
    const parsedFormData = storedFormData ? JSON.parse(storedFormData) : {};
    const savedHour = parsedFormData.Waktu
      ? parsedFormData.Waktu.split(":")[0]
      : "";
    const savedMinute = parsedFormData.Waktu
      ? parsedFormData.Waktu.split(":")[1]
      : "";
    setHour(savedHour);
    setMinute(savedMinute);
    setWaktu(parsedFormData.Waktu || "");
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const storedFormData = localStorage.getItem("formData");
      const parsedFormData = storedFormData ? JSON.parse(storedFormData) : {};
      setWaktu(parsedFormData.Waktu || "");
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleHourChange = (e) => {
    const selectedHour = e.target.value.padStart(2, "0");
    setHour(selectedHour);
    setWaktu(`${selectedHour}:${minute}`);
    // localStorage.setItem(
    //   "formData",
    //   JSON.stringify({ Waktu: `${selectedHour}:${minute}` })
    // );
  };

  const handleMinuteChange = (e) => {
    const selectedMinute = e.target.value.padStart(2, "0");
    setMinute(selectedMinute);
    setWaktu(`${hour}:${selectedMinute}`);
    // localStorage.setItem(
    //   "formData",
    //   JSON.stringify({ Waktu: `${hour}:${selectedMinute}` })
    // );
    // setWaktu
  };

  const hourOptions = Array.from({ length: 22 }, (_, i) =>
    String(i + 1).padStart(2, "0")
  );
  const minuteOptions = Array.from({ length: 60 }, (_, i) =>
    String(i).padStart(2, "0")
  );

  const handleEventNameChange = (event) => {
    setEventName(event.target.value);
  };

  const handleTypeEventChange = (event) => {
    setTypeEvent(event.target.value);
  };

  const handleTanggalChange = (event) => {
    const selectedDate = event.target.value;

    // Get the current date
    const currentDate = new Date();

    // Convert the selected date to a Date object for comparison
    const selectedDateObject = new Date(selectedDate);

    // Calculate the minimum allowed date (2 days from the current date)
    const minAllowedDate = new Date();
    minAllowedDate.setDate(currentDate.getDate() + 1);

    // Check if the selected date is at least 7 days from the current date
    if (selectedDateObject >= minAllowedDate) {
      setTanggal(selectedDate);
    } else {
      Swal.fire({
        icon: "error",
        title: "Tanggal Tidak Valid",
        text: "Pilihlah tanggal minimal 2 hari dari tanggal saat ini.",
        timer: 2000,
      });
    }
  };

  const handleWaktuChange = (waktu) => {
    // const selectedTime = event.target.value;

    const isWithinAllowedRange = isTimeWithinRange(selectedTime);

    if (isWithinAllowedRange) {
      setWaktu(waktu);
    } else {
      Swal.fire({
        icon: "error",
        title: "Waktu Tidak Valid",
        text: "Waktu yang dipilih harus berada dalam rentang yang diizinkan (01:00 - 23:00).",
        timer: 2000,
      });
    }
  };

  const isTimeWithinRange = (time) => {
    const selectedHour = parseInt(time.split(":")[0], 10);
    const selectedMinute = parseInt(time.split(":")[1], 10);
    return (
      (selectedHour === 1 && selectedMinute >= 0) ||
      (selectedHour > 1 && selectedHour < 23) ||
      (selectedHour === 23 && selectedMinute === 0)
    );
  };

  const handleDescriptionChange = (event) => {
    const value = event.target.value;
    // if (value.length > 120) {
    //   Toast.fire({
    //     icon: 'error',
    //     title: 'Deskripsi maksimal 120 karakter mohon periksa kembali',
    //     iconColor: 'bg-black',
    //     timer: 2000
    //   });
    // }
    setDescription(value);
  };

  const handleImageCampChange = (event) => {
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
    setLoadingFile(true);

    if (!allowedTypes.includes(file?.type)) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Hanya file PNG, JPG, JPEG dan HEIF yang diizinkan!",
      });
      setLoadingFile(false);
      return;
    }
    if (file.size <= maxSize) {
      setUploadedFile(file);
      setLoadingFile(false);
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
          setLoadingFile(false);
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Ukuran gambar melebihi 5MB!",
          });
          setLoadingFile(false);
        });
    }
    setUploadedFile(file);
    setLoading(false);
  };

  const handleSubmit = (e) => {
    setLoading(true);
    const requiredFields = [
      "eventName",
      "TypeEvent",
      "Tanggal",
      "Waktu",
      "Description",
    ];
    const errorMessages = {
      eventName: "Event Name",
      TypeEvent: "Type of Event",
      Tanggal: "Date",
      Waktu: "Time",
      Description: "Description",
    };

    // Konversi eventName menjadi kapitalisasi setiap kata
    const capitalizeEachWord = (str) => {
      return str.replace(/\b\w/g, (char) => char.toUpperCase());
    };

    const formData = {
      eventName: capitalizeEachWord(eventName), // Konversi eventName di sini
      TypeEvent,
      Tanggal,
      Waktu,
      Description,
    };
    const emptyFields = requiredFields.filter((field) => !formData[field]);

    emptyFields.forEach((field) => {
      const errorMessage = `${errorMessages[field]} is required`;
      Toast.fire({
        icon: "error",
        title: errorMessage,
        iconColor: "bg-black",
        timer: 2000,
      });
    });

    if (emptyFields.length > 0) {
      return;
    }
    if (!uploadedFile) {
      Toast.fire({
        icon: "error",
        title: "Image is required",
        iconColor: "bg-black",
        timer: 2000,
      });
      return;
    }

    // Update the local storage when form data changes
    updateLocalStorage(formData);

    // Reset form after submit
    setEventName("");
    setTypeEvent("");
    setTanggal("");
    setWaktu("");
    // setImageCamp('');

    // Navigate to the next step
    router.push(`createcampaign?step=2`);
  };

  return (
    <>
      <ol className="flex justify-center mb-4 sm:mb-5 w-full p-2">
        <RoutStep
          liCss={`flex w-20 items-center after:content-[''] after:w-full after:h-1 after:inline-block after:border-b after:border-4 after:border-primary`}
          divCss={`flex items-center justify-center w-10 h-10 rounded-full lg:h-9 lg:w-9 shrink-0 bg-primary`}
          iconCss={`w-4 h-4 text-white lg:w-6 lg:h-6 `}
          iconName={"Calendar"}
        />
        <RoutStep
          liCss={`flex w-20 items-center after:content-[''] after:w-full after:h-1 after:inline-block after:border-b after:border-4 after:border-gray-300`}
          divCss={`flex items-center justify-center w-10 h-10 rounded-full lg:h-9 lg:w-9 shrink-0 bg-gray-300`}
          iconCss={`w-4 h-4 text-white lg:w-6 lg:h-6 `}
          iconName={"Map"}
        />
        <RoutStep
          liCss={`flex items-center`}
          divCss={`flex items-center justify-center w-10 h-10 rounded-full lg:h-9 lg:w-9 shrink-0 bg-gray-300`}
          iconCss={`w-4 h-4 lg:w-6 lg:h-6 text-white`}
          iconName={"Bowl"}
        />
      </ol>
      <div className="p-2 mt-2 w-full px-5 space-y-3">
        <div className="flex flex-row items-center p-4 py-0 bg-gray-100 text-gray-400 text-sm rounded-lg w-full focus:border-none">
          <IconUser />
          <input
            onFocus={() => setOnFocusTime(false)}
            onChange={handleEventNameChange}
            value={eventName}
            name="eventName"
            type="text"
            id="email"
            className="text-black ml-2 w-full p-0 py-4 pl-1 bg-transparent focus:border-none"
            placeholder="Nama Campaign"
            required
          />
        </div>

        <div className="flex flex-row items-center p-4 pr-4 py-0 bg-gray-100 text-gray-400 text-sm rounded-lg w-full focus:border-none outline-none">
          <Icon123 />
          <select
            onFocus={() => setOnFocusTime(false)}
            name="TypeEvent"
            value={TypeEvent}
            id="TypeEvent"
            onChange={handleTypeEventChange}
            className={` ${TypeEvent === "" ? "text-gray-400" : "text-black"
              } ml-1 w-full p-0 py-4 pl-1 bg-transparent focus:border-none outline-none`}
          >
            <option disabled value="">
              Tipe Campaign
            </option>
            <option className="text-gray-500" value="one_time">
              Dana Terbuka
            </option>
            <option className="text-gray-500" value="regular">
              Dana Mandiri
            </option>
          </select>
        </div>

        <div className="flex flex-row items-center p-4 pr-4 py-0 bg-gray-100 text-gray-400 text-sm rounded-lg focus:ring-blue-500 w-full border-none">
          <IconCalendar />
          <input
            onChange={handleTanggalChange}
            value={Tanggal}
            name="Tanggal"
            type="date"
            className="text-black ml-2 w-full p-0 py-4 pl-1 bg-transparent border-none"
            placeholder="Tanggal Pelaksanaan"
            onFocus={() => {
              setOnFocusTime(false);
              setOnFocusDate(true);
            }}
            onBlur={() => setOnFocusDate(false)}
            required
          />
        </div>
        <div className="flex flex-row items-center p-4 py-0 bg-gray-100 text-gray-400 text-sm rounded-lg focus:ring-blue-500 w-full focus:border-none my-2">
          <IconClock />
          <button
            className="w-full text-start ml-2 p-0 py-4 pl-1 bg-transparent focus:border-none flex flex-row gap-1"
            onClick={() => setOnFocusTime(!onFocusTime)}
          >
            {!onFocusTime && !hour && !minute ? (
              <p>Waktu Pelaksanaan</p>
            ) : (
              <>
                <p className="text-black hover:bg-gray-400">{hour}</p>:
                <p className="text-black hover:bg-gray-400">{minute}</p>
              </>
            )}
          </button>
        </div>
        {onFocusTime && (
          <div className="absolute lg:left-[580px] lg:top-[270px] left-[65px] top-[270px] flex gap-2 z-10">
            <div className="bg-white w-10 border text-black bottom-[230px] border-black flex flex-col overflow-auto h-24 ">
              {hourOptions.map((h) => (
                <button
                  onClick={(h) => handleHourChange(h)}
                  className="hover:bg-gray-400"
                  key={h}
                  value={h}
                >
                  {h}
                </button>
              ))}
            </div>
            {hour && (
              <div className="bg-white w-10 border text-black bottom-[230px] border-black flex flex-col overflow-auto h-24">
                {minuteOptions.map((m) => (
                  <button
                    onClick={(m) => handleMinuteChange(m)}
                    className="hover:bg-gray-400"
                    key={m}
                    value={m}
                  >
                    {m}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex flex-row items-center p-4 py-0 bg-gray-100 text-gray-400 text-sm rounded-lg focus:ring-blue-500 w-full focus:border-none outline-none">
          <IconFileDescription />
          <textarea
            onFocus={() => setOnFocusTime(false)}
            onChange={handleDescriptionChange}
            value={Description}
            className="text-black ml-2 w-full p-0 py-4 pl-1 bg-transparent focus:border-none outline-none"
            placeholder="Deskripsi Campaign"
            required
            rows={2} // Atur jumlah baris sesuai kebutuhan
          />
        </div>

        <div className="mb-2 ">
          <div
            onClick={() => setOnFocusTime(false)}
            className="flex items-center justify-center w-full relative"
          >
            <label
              htmlFor="images"
              className="flex flex-col justify-center w-full h-32 border-2 border-black border-dashed rounded-lg cursor-pointer bg-gray-200 hover:bg-gray-100"
            >
              {loadingFile && (
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

              {uploadedFile ? (
                <img
                  src={URL.createObjectURL(uploadedFile)}
                  alt="Foto Campaign"
                  className="w-full h-full rounded-lg object-cover"
                />
              ) : (
                <div className="flex items-center gap-2 px-3">
                  <div className="bg-primary text-white font-light w-20 py-5 rounded-xl flex items-center justify-center">
                    <IconCamera size={40} />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Foto Campaign</p>
                    <p className="font-light text-xs">Ambil foto Campaign</p>
                  </div>
                </div>
              )}
              <input
                id="images"
                type="file"
                className="hidden"
                onChange={handleImageCampChange}
              />
            </label>
          </div>

          <p className="text-xs text-primary font-semibold">
            *File yang diperbolehkan: JPG, JPEG, PNG dengan ukuran maksimal 5 MB.
          </p>
        </div>

        <div className="grid gap-4 content-center">
          <button
            disabled={
              eventName === "" ||
              TypeEvent === "" ||
              Tanggal === "" ||
              Waktu === "" ||
              Description === "" ||
              uploadedFile === null
            }
            onClick={() => handleSubmit()}
            type="submit"
            className={
              "text-white disabled:bg-gray-400 bg-primary hover:bg-blue-800 outline-none font-medium rounded-xl text-xl w-full sm:w-auto px-5 py-2.5 text-center"
            }
          >
            Lanjut
          </button>
        </div>
      </div>
    </>
  );
}
function StepTwo({ updateLocalStorage, loading, setLoading }) {
  const router = useRouter();
  const [locationInfo, setLocationInfo] = useState(null);
  const [location, setLocation] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [subDistrict, setSubDistrict] = useState("");
  const [postalCode, setPostalCode] = useState("");

  const [Jalan, setJalan] = useState(""); // menggunakan respon address
  const [DetaiAlamat, setDetaiAlamat] = useState("");
  const [coordinates, setCoordinates] = useState("");

  const [tracking, setTracking] = useState(true);

  const handleDataFromMap = (receivedLocationInfo) => {
    setLocationInfo(receivedLocationInfo);
  };

  const getCurrentLocation = () => {
    setTracking((prevTracking) => !prevTracking);
  };

  const handleJalanChange = (event) => {
    setJalan(event.target.value);
  };

  const handleDetaiAlamatChange = (event) => {
    setDetaiAlamat(event.target.value);
  };

  useEffect(() => {
    setLoading(false);
    if (locationInfo) {
      setLocation(locationInfo.fullAdres);
      setProvince(locationInfo.province);
      setCity(locationInfo.city);
      setSubDistrict(locationInfo.sub_district);
      setPostalCode(locationInfo.postal_code);
      setJalan(locationInfo.address);
      setCoordinates(locationInfo.coordinates);
    }
  }, [locationInfo]);

  useEffect(() => {
    // Check local storage for existing form data
    const storedFormData = localStorage.getItem("formData");
    if (storedFormData) {
      const parsedFormData = JSON.parse(storedFormData);
      if (parsedFormData) {
        // Merge the existing data with the new data
        setLocation(parsedFormData.location || "");
        setJalan(parsedFormData.Jalan || "");
        setDetaiAlamat(parsedFormData.DetaiAlamat || "");
        setCoordinates(parsedFormData.coordinates || "");
      }
    }
  }, []);

  const handleSubmit = (e) => {
    setLoading(true);

    if (!location || !Jalan) {
      window.alert("All fields are required");
      return;
    }
    if (!coordinates) {
      Swal.fire({
        icon: "error",
        title: "Koordinat Tidak Ditemukan",
        text: "Lokasi tidak ditemukan. Silakan pilih lokasi di peta.",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }

    const formData = {
      // set the existing data
      ...JSON.parse(localStorage.getItem("formData")),
      location,
      Jalan,
      DetaiAlamat,
      coordinates,
      province,
      city,
      subDistrict,
      postalCode,
    };

    // upload data to local storage
    updateLocalStorage(formData);

    router.push(`createcampaign?step=3`);
  };

  return (
    <>
      <ol className="flex justify-center mb-4 sm:mb-5 w-full p-2">
        <RoutStep
          liCss={`flex w-20 items-center after:content-[''] after:w-full after:h-1 after:inline-block after:border-b after:border-4 after:border-primary`}
          divCss={`flex items-center justify-center w-10 h-10 rounded-full lg:h-9 lg:w-9 shrink-0 bg-primary`}
          iconCss={`w-4 h-4 text-white lg:w-6 lg:h-6 `}
          iconName={"Calendar"}
        />
        <RoutStep
          liCss={`flex w-20 items-center after:content-[''] after:w-full after:h-1 after:inline-block after:border-b after:border-4 after:border-primary`}
          divCss={`flex items-center justify-center w-10 h-10 rounded-full lg:h-9 lg:w-9 shrink-0 bg-primary`}
          iconCss={`w-4 h-4 text-white lg:w-6 lg:h-6 `}
          iconName={"Map"}
        />
        <RoutStep
          liCss={`flex items-center`}
          divCss={`flex items-center justify-center w-10 h-10 rounded-full lg:h-9 lg:w-9 shrink-0 bg-gray-300`}
          iconCss={`w-4 h-4 lg:w-6 lg:h-6 text-white`}
          iconName={"Bowl"}
        />
      </ol>

      <div className="p-2 w-full px-6 space-y-2">
        <div className="flex justify-center border-gray-300 rounded-lg mb-1">
          <DynamicMap sendDataToPage={handleDataFromMap} tracking={tracking} />
        </div>
        <div className="grid gap-4 content-center mb-2">
          <p className="text-primary font-semibold text-xs">
            {tracking ? "" : "*Geser marker untuk menentukan lokasi"}
          </p>
        </div>
        <button
          onClick={getCurrentLocation}
          className="bg-gray-50 border-primary border-2 text-gray-900 text-sm rounded-lg block w-full p-2.5"
        >
          {tracking ? (
            <p> Custom Location</p>
          ) : (
            <p className="flex flex-row items-center justify-center gap-2">
              <IconMapPin color="red" />
              Gunakan Lokasi Saat Ini
            </p>
          )}
        </button>

        <div className="flex flex-row items-center p-4 py-0 bg-gray-100 text-gray-400 text-sm rounded-lg focus:ring-blue-500 w-full focus:border-none">
          <IconMap />
          <textarea
            onChange={(e) => setLocation(e.target.value)}
            value={location}
            type="text"
            className="text-black ml-2 w-full p-0 py-4 pl-1 bg-transparent focus:border-none"
            placeholder="Wilayah"
            required
          />
        </div>
        <div className="flex flex-row items-center p-4 py-0 bg-gray-100 text-gray-400 text-sm rounded-lg focus:ring-blue-500 w-full focus:border-none">
          <IconHome2 />
          <input
            onChange={handleJalanChange}
            value={Jalan}
            type="text"
            className="text-black ml-2 w-full p-0 py-4 pl-1 bg-transparent focus:border-none"
            placeholder="Nama Jalan, Gedung, No Rumah"
            required
          />
        </div>

        <div className="flex flex-row items-center p-4 py-0 bg-gray-100 text-gray-400 text-sm rounded-lg focus:ring-blue-500 w-full focus:border-none ">
          <IconNotes />
          <input
            onChange={handleDetaiAlamatChange}
            value={DetaiAlamat}
            type="text"
            className="text-black ml-2 w-full p-0 py-4 pl-1 bg-transparent focus:border-none"
            placeholder="Detail Lainnya"
            required
          />
        </div>
        <div className="grid gap-4 content-center pt-12 mb-2">
          <button
            disabled={!location || !Jalan}
            onClick={() => handleSubmit()}
            type="submit"
            className={
              !location || !Jalan
                ? "text-white bg-gray-400 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-xl text-xl w-xl sm:w-auto px-5 py-2.5 text-center"
                : "text-white bg-primary hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-xl text-xl w-full sm:w-auto px-5 py-2.5 text-center"
            }
          >
            Lanjut
          </button>
        </div>
      </div>
    </>
  );
}
function StepThree({
  cart,
  updateCart,
  updateLocalStorage,
  setUploadedFile,
  uploadedFile,
  loading,
  setLoading,
}) {
  const router = useRouter();
  const totalCartPrice = cart.reduce((total, item) => total + item.total, 0);
  const totalCartQuantity = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );
  const [campData, setCampData] = useState(
    JSON.parse(localStorage.getItem("formData"))
  );

  const groupedCart = cart.reduce((acc, item) => {
    const IdMerchan = item.merchant_id;
    if (!acc[IdMerchan]) {
      acc[IdMerchan] = [];
    }
    acc[IdMerchan].push(item);
    return acc;
  }, {});

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleDecrease = (IdMerchan, itemId) => {
    const updatedCart = [...cart];

    const itemIndex = updatedCart.findIndex(
      (item) => item.merchant_id === parseInt(IdMerchan) && item.id === itemId
    );

    if (itemIndex !== -1) {
      const updatedItem = { ...updatedCart[itemIndex] };

      if (updatedItem.quantity > 1) {
        updatedItem.quantity -= 1;
        updatedItem.total = updatedItem.quantity * updatedItem.price;

        updatedCart[itemIndex] = updatedItem;

        const totalCartPrice = updatedCart.reduce(
          (total, item) => total + item.total,
          0
        );
        const totalCartQuantity = updatedCart.reduce(
          (total, item) => total + item.quantity,
          0
        );

        updateCart(updatedCart, totalCartPrice, totalCartQuantity);
      } else {
        handleRemove(IdMerchan, itemId);
      }
    } else {
      console.warn("Item not found in cart:", { IdMerchan, itemId });
    }
  };

  const handleIncrease = (IdMerchan, itemId, capacity) => {
    const updatedCart = [...cart];
    const itemIndex = updatedCart.findIndex(
      (item) => item.merchant_id === parseInt(IdMerchan) && item.id === itemId
    );

    if (updatedCart[itemIndex].quantity >= capacity) {
      return;
    }
    if (itemIndex !== -1) {
      updatedCart[itemIndex].quantity += 1;
      updatedCart[itemIndex].total =
        updatedCart[itemIndex].quantity * updatedCart[itemIndex].price;

      const totalCartPrice = updatedCart.reduce(
        (total, item) => total + item.total,
        0
      );
      const totalCartQuantity = updatedCart.reduce(
        (total, item) => total + item.quantity,
        0
      );

      updateCart(updatedCart, totalCartPrice, totalCartQuantity);
    }
  };

  const handleRemove = (IdMerchan, itemId) => {
    const updatedCart = cart.filter(
      (item) =>
        !(item.merchant_id === parseInt(IdMerchan) && item.id === itemId)
    );
    const totalCartPrice = updatedCart.reduce(
      (total, item) => total + item.total,
      0
    );
    const totalCartQuantity = updatedCart.reduce(
      (total, item) => total + item.quantity,
      0
    );
    updateCart(updatedCart, totalCartPrice, totalCartQuantity);
  };

  const handleSubmit = async () => {
    setLoading(true);
    if (campData.TypeEvent === "regular") {
      router.push("/createcampaign?step=Payment");
    } else {
      const emptyFields = [];
      const detonator_id = localStorage.getItem("id");
      const token = localStorage.getItem("token");

      const products = cart.map((item) => ({
        merchant_id: parseInt(item.merchant_id),
        merchant_product_id: parseInt(item.id),
        qty: parseInt(item.quantity),
      }));

      // Validate data
      if (!detonator_id) emptyFields.push("Detonator ID");
      if (!campData.eventName) emptyFields.push("Event Name");
      if (!campData.TypeEvent) emptyFields.push("Event Type");
      if (!campData.Tanggal) emptyFields.push("Event Date");
      if (!campData.Waktu) emptyFields.push("Event Time");
      if (!campData.Description) emptyFields.push("Description");
      if (!campData.province) emptyFields.push("Province");
      if (!campData.city) emptyFields.push("City");
      // if (!campData.sub_district) emptyFields.push("Sub District");
      // if (!campData.postal_code) emptyFields.push("Postal Code");
      if (!campData.location) emptyFields.push("Address");
      if (!campData.coordinates.lat) emptyFields.push("Latitude");
      if (!campData.coordinates.lng) emptyFields.push("Longitude");
      // if (!mediaUploadResponse.data.body.file_url) emptyFields.push("Image URL");
      if (!products) emptyFields.push("Products");

      if (emptyFields.length > 0) {
        const errorMessage = `Please fill in all required fields: ${emptyFields.join(
          ", "
        )}`;
        Swal.fire({
          icon: "error",
          title: "Error",
          text: errorMessage,
          showConfirmButton: false,
          timer: 2000,
        });

        setLoading(false);
        return;
      }
      try {
        const totalCartPrice = cart.reduce(
          (total, item) => total + item.total,
          0
        );
        const totalCartQuantity = cart.reduce(
          (total, item) => total + item.quantity,
          0
        );

        const formData = new FormData();
        formData.append("destination", "campaign");
        formData.append("file", uploadedFile);

        const mediaUploadResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}media/upload`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (mediaUploadResponse.status === 200) {
          const eventData = {
            detonator_id: parseInt(detonator_id),
            event_name: campData.eventName,
            event_type: campData.TypeEvent,
            event_date: campData.Tanggal,
            event_time: campData.Waktu, // Check if you intended to use it twice
            description: campData.Description,
            donation_target: parseFloat(totalCartPrice),
            province: campData.province,
            city: campData.city,
            sub_district: campData.sub_district ?? "-",
            postal_code: campData.postal_code ?? "-",
            address: campData.location,
            latitude: String(campData.coordinates.lat),
            longitude: String(campData.coordinates.lng),
            image_url: mediaUploadResponse.data.body.file_url, // Set to the actual file_url
            food_required: parseInt(totalCartQuantity),
            food_total: parseInt(totalCartQuantity),
            products: products,
          };
          try {
            const createCampaignResponse = await axios.post(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}campaign/create`,
              eventData,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            localStorage.removeItem("cart");
            localStorage.removeItem("formData");
            setLoading(false);
            // router.push("/detonator");

            Swal.fire({
              icon: "success",
              title: "Campaign Berhasil Dibuat!",
              text: "Campaign berhasil dibuat. Mohon tunggu persetujuan dari admin.",
              showConfirmButton: false,
              timer: 2000,
            });

            setTimeout(() => {
              router.push("/detonator");
            }, 2000);
          } catch (error) {
            setLoading(false);
            if (error.response && error.response.status === 401) {
              localStorage.removeItem("cart");
              localStorage.removeItem("formData");
              Error401(error, router);
            } else {
              Swal.fire({
                icon: "error",
                title: "Gagal Membuat Campaign",
                text: "Gagal Membuat Campaign Mohon Coba Lagi",
                showConfirmButton: false,
                timer: 2000,
              });
            }
          }
        }
      } catch (error) {
        setLoading(false);
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("cart");
          localStorage.removeItem("formData");
          Error401(error, router);
        } else {
          Swal.fire({
            icon: "error",
            title: "Image Gagal Upload",
            text: "Gagal Upload Image Mohon Coba Lagi",
            showConfirmButton: false,
            timer: 2000,
          });

          setTimeout(() => {
            router.push("/createcampaign?step=1");
          }, 2000);
        }
      }
    }
  };

  const handleLink = () => {
    router.push("/createcampaign?step=5");
  };

  return (
    <>
      <ol className="flex justify-center mb-4 sm:mb-5 w-full p-2">
        <RoutStep
          liCss={`flex w-20 items-center after:content-[''] after:w-full after:h-1 after:inline-block after:border-b after:border-4 after:border-primary`}
          divCss={`flex items-center justify-center w-10 h-10 rounded-full lg:h-9 lg:w-9 shrink-0 bg-primary`}
          iconCss={`w-4 h-4 text-white lg:w-6 lg:h-6 `}
          iconName={"Calendar"}
        />
        <RoutStep
          liCss={`flex w-20 items-center after:content-[''] after:w-full after:h-1 after:inline-block after:border-b after:border-4 after:border-primary`}
          divCss={`flex items-center justify-center w-10 h-10 rounded-full lg:h-9 lg:w-9 shrink-0 bg-primary`}
          iconCss={`w-4 h-4 text-white lg:w-6 lg:h-6 `}
          iconName={"Map"}
        />
        <RoutStep
          liCss={`flex items-center`}
          divCss={`flex items-center justify-center w-10 h-10 rounded-full lg:h-9 lg:w-9 shrink-0 bg-primary`}
          iconCss={`w-4 h-4 lg:w-6 lg:h-6 text-white`}
          iconName={"Bowl"}
        />
      </ol>

      <div className="container mx-auto">
        <div className="items-center justify-center mt-1 w-full">
          <div className="w-full bg-white  text-black rounded-lg inline-flex items-center px-4 py-2.5 ">
            <div
              className={`flex ${Object.keys(groupedCart).length > 0
                ? "justify-between"
                : "justify-center"
                } w-full`}
            >
              <div className="flex">
                {Object.keys(groupedCart).length > 0 ? (
                  <div className="text-left place-items-start">
                    <div className="font-medium text-xs text-gray-500">
                      Total {totalCartQuantity} Pesanan
                    </div>
                    <div className="text-primary font-bold text-lg">
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                      }).format(totalCartPrice || 0)}
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
              <div className="flex justify-center items-center content-center">
                <button
                  onClick={handleLink}
                  type="submit"
                  className="text-primary hover:text-white flex flex-row items-center gap-1 border-2 border-primary hover:bg-primary focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-xl text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                >
                  <IconCirclePlus />
                  Menu
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="items-center justify-center w-full">
          {Object.keys(groupedCart).length > 0
            ? Object.keys(groupedCart).map((IdMerchan, storeIndex) => (
              <div key={storeIndex} className="mb-4 p-2">
                {groupedCart[IdMerchan].map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="bg-white text-black rounded-lg inline-flex items-center px-2 py-2 mb-2 w-full border border-primary"
                  >
                    <div className="flex h-30 w-full">
                      <img
                        className="w-28 h-28 rounded-xl bg-blue-100 mr-2 text-blue-600"
                        src={`${process.env.NEXT_PUBLIC_URL_STORAGE}${item.images.length > 0
                          ? item.images[0].image_url
                          : ""
                          }`}
                        alt=""
                      />
                      <div className="flex flex-col justify-between w-full">
                        <div className="text-left place-items-start">
                          <div className="text-primary font-bold capitalize">
                            {item.name}
                            {/* {item.imageUrl} */}
                          </div>
                          <div className="mb-1  text-[11px]">
                            {/* terjual | Disukai oleh: 20 | */}
                            Max Quota: {item.capacity}
                          </div>
                          <div className="mb-1  text-[11px]">
                            {item.description}
                          </div>
                        </div>
                        <div className="mt-2 flex flex-row gap-4 justify-between">
                          <p className="font-bold text-primary">
                            {new Intl.NumberFormat("id-ID", {
                              style: "currency",
                              currency: "IDR",
                              minimumFractionDigits: 0,
                            }).format(item.price * item.quantity || 0)}
                          </p>
                          <div className="grid place-items-center">
                            <div className="flex items-center">
                              <button
                                className=" text-black px-2 py-1 rounded-l hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
                                onClick={() =>
                                  handleDecrease(
                                    IdMerchan,
                                    item.id,
                                    item.capacity
                                  )
                                }
                              >
                                <IconMinus size={15} />
                              </button>
                              <span className="px-4 text-blue-700 font-bold border rounded-md border-blue-900">
                                {item.quantity}
                              </span>
                              <button
                                className=" text-black px-2 py-1 rounded-r hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue active:bg-blue-800"
                                onClick={() =>
                                  handleIncrease(
                                    IdMerchan,
                                    item.id,
                                    item.capacity
                                  )
                                }
                              >
                                <IconPlus size={15} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))
            : ""}
        </div>
        {/* </div> */}

        {Object.keys(groupedCart).length > 0 ? (
          <div className="grid gap-4 h-screencontent-center px-4 py-2">
            <button
              onClick={() => handleSubmit()}
              className="text-white bg-primary hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-xl text-sm w-full sm:w-auto px-5 py-2.5 text-center"
            >
              {campData.TypeEvent === "regular"
                ? "Lanjutkan Pembayaran"
                : "Ajukan"}
            </button>
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
}

function SingleDonationPayment({ setLoading, cart, uploadedFile }) {
  const [isDropdownMethodOpen, setIsDropdownMethodOpen] = useState(false);
  const [isDropdownChannelOpen, setIsDropdownChannelOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("");
  const [selectedChannel, setSelectedChannel] = useState("");
  const [selectedChannelLogo, setSelectedChannelLogo] = useState();
  const [donationRequired, setDonationRequired] = useState();
  const [formData2, setFormData] = useState();
  const [wallet_balance, setWalletBalance] = useState();
  const router = useRouter();
  const admin_fee = 2500;
  const month = moment().format("YYYY-MM");

  useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL
        }donation/list?start=${month}-01&end=${month}-${new Date(
          moment(month, "YYYY-MM").format("YYYY"),
          moment(month, "YYYY-MM").format("MM"),
          0
        ).getDate()}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        setLoading(false);
        setWalletBalance(response.data.body.agnostic_balance);
      })
      .catch((error) => {
        setLoading(false);
        Error401(error, router);
      });
  }, []);

  useEffect(() => {
    setLoading(false);
    // Check local storage for existing form data
    const storedFormData = localStorage.getItem("formData");
    if (storedFormData) {
      const parsedFormData = JSON.parse(storedFormData);
      if (parsedFormData) {
        setFormData(parsedFormData);
      }
    }
    setDonationRequired(cart.reduce((total, item) => total + item.total, 0));
  }, []);

  const handleSubmit = () => {
    setLoading(true);
    const detonator_id = localStorage.getItem("id");
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("destination", "campaign");
    formData.append("file", uploadedFile);

    axios
      .post(`${process.env.NEXT_PUBLIC_API_BASE_URL}media/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setLoading(false);
        const totalCartPrice = cart.reduce(
          (total, item) => total + item.total,
          0
        );
        const totalCartQuantity = cart.reduce(
          (total, item) => total + item.quantity,
          0
        );

        const products = cart.map((item) => ({
          merchant_id: parseInt(item.merchant_id),
          merchant_product_id: parseInt(item.id),
          qty: parseInt(item.quantity),
        }));

        const eventData = {
          detonator_id: parseInt(detonator_id),
          event_name: formData2.eventName,
          event_type: formData2.TypeEvent,
          event_date: formData2.Tanggal,
          event_time: formData2.Waktu, // Check if you intended to use it twice
          description: formData2.Description,
          donation_target: parseFloat(totalCartPrice),
          province: formData2.province,
          city: formData2.city,
          sub_district: formData2.sub_district ?? "-",
          postal_code: formData2.postal_code ?? "-",
          address: formData2.location,
          latitude: String(formData2.coordinates.lat),
          longitude: String(formData2.coordinates.lng),
          image_url: res.data.body.file_url, // Set to the actual file_url
          food_required: parseInt(totalCartQuantity),
          food_total: parseInt(totalCartQuantity),
          products: products,
          payment: {
            payment_method:
              selectedMethod === "agnostic" ? "agnostic" : "mayar",
            amount: parseFloat(donationRequired),
            admin_fee: 0,
            total_amount: parseFloat(donationRequired),
            payment_channel: `${selectedMethod === "agnostic" ? "Tabunganku" : selectedChannel
              }`,
            success_url: `${process.env.NEXT_PUBLIC_URL_PAYMEN}`,
          },
        };
        axios
          .post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}campaign/single-donation`,
            eventData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((response) => {
            const responeUrl =
              response.data.body.payment.actions.desktop_web_checkout_url;
            localStorage.setItem(
              "external_id",
              response.data.body.payment.external_id
            );
            localStorage.removeItem("cart");
            localStorage.removeItem("formData");
            setLoading(false);
            Swal.fire({
              icon: "success",
              title: "Campaign Berhasil Dibuat",
              text: "Terima kasih telah membantu sesama.",
              showConfirmButton: false,
              timer: 2000,
            });
            localStorage.setItem("prevPath", "payment_reciept");
            if (selectedMethod !== "agnostic") {
              setTimeout(() => {
                router.push(`${responeUrl}`);
              }, 2000);
            } else {
              setTimeout(() => {
                router.push(
                  `/bukti_pembayaran?external_id=${response.data.body.payment.external_id}`
                );
              }, 2000);
            }
          })
          .catch((error) => {
            setLoading(false);
            localStorage.removeItem("cart");
            localStorage.removeItem("formData");
            const messages = {
              title: "Gagal Membuat Campaign",
              text: "Gagal Membuat Campaign Mohon Coba Lagi",
            };
            Error401(error, router, messages);
          });
      })
      .catch((error) => {
        setLoading(false);
        localStorage.removeItem("cart");
        localStorage.removeItem("formData");
        const messages = {
          title: "Image Gagal Upload",
          text: "Gagal Upload Image Mohon Coba Lagi",
        };
        Error401(error, router, messages);
        setTimeout(() => {
          router.push("/createcampaign?step=1");
        }, 2000);
      });
  };

  const methodOptions = [
    {
      id: 1,
      value: "agnostic",
      label: "Tabunganku",
    },
    {
      id: 2,
      value: "ewallet",
      label: "Ewallet",
    },
    // {
    //   id: 3,
    //   value: "bank",
    //   label: "Bank",
    // },
  ];

  const eWalletChannelOptions = [
    {
      id: 1,
      logo: LinkAja,
      value: "LinkAja",
      // label: "LinkAja",
    },
    // {
    //   id: 2,
    //   logo: gopay,
    //   value: "Gopay",
    //   // label: "Gopay",
    // },
  ];

  // const bankChannelOptions = [
  //   {
  //     id: 1,
  //     logo: mandiri,
  //     value: "Mandiri",
  //     // label: "Mandiri",
  //   },
  //   {
  //     id: 2,
  //     logo: bri,
  //     value: "BRI",
  //     // label: "BRI",
  //   },
  // ];

  return (
    <div className="w-full">
      <Header title="Konfirmasi Pembayaran" />
      <div className="flex flex-col w-full px-4 gap-3">
        <p className="text-black text-sm font-medium">
          Pilih Metode Pembayaran
        </p>
        <button
          onClick={() => {
            setIsDropdownMethodOpen(!isDropdownMethodOpen);
            setIsDropdownChannelOpen(false);
          }}
          className="flex flex-row items-center justify-between px-2 py-0 shadow-sm shadow-gray-400 text-gray-400 text-sm rounded-xl w-full focus:border-none"
        >
          <p
            className={`capitalize font-bold ${selectedMethod === "" ? "text-gray-400" : "text-black"
              }  pl-2 cursor-pointer outline-none py-4 bg-transparent focus:border-none`}
          >
            {selectedMethod === "" ? "Pilih Salah Satu..." : selectedMethod}
          </p>
          {isDropdownMethodOpen ? <IconChevronUp /> : <IconChevronDown />}
        </button>
        {isDropdownMethodOpen ? (
          <div className="flex flex-col px-4 py-0 shadow-sm shadow-gray-400 text-gray-400 text-sm rounded-xl w-full focus:border-none">
            {methodOptions.map((data, index) => (
              <div key={data.id} className="w-full flex justify-between">
                <button
                  onClick={() => {
                    setIsDropdownMethodOpen(false);
                    setSelectedMethod(data.value);
                    setSelectedChannel("");
                  }}
                  className="flex flex-row justify-between w-full items-center py-3 cursor-pointer "
                >
                  <label htmlFor="ewallet" className="font-bold text-black">
                    {data.label}
                  </label>
                  <input
                    type="radio"
                    id={data.value}
                    name="paymentOption"
                    value={data.value}
                    className="hidden"
                  />
                  <div
                    className={`w-[10px] h-[10px] ${data.value === selectedMethod && "bg-primary"
                      } rounded-full flex justify-center items-center`}
                  >
                    <div
                      className={`rounded-full p-2 ${data.value === selectedMethod && "border-primary"
                        } border-2`}
                    />
                  </div>
                </button>
                {index !== methodOptions.length - 1 ? <hr /> : ""}
              </div>
            ))}
          </div>
        ) : (
          ""
        )}
        {selectedMethod !== "" && (
          <>
            <button
              disabled={selectedMethod === "agnostic"}
              onClick={() => {
                setIsDropdownChannelOpen(!isDropdownChannelOpen);
                setIsDropdownMethodOpen(false);
              }}
              className={`flex flex-row items-center justify-between px-2 py-0 shadow-sm shadow-gray-400 text-gray-400 text-sm rounded-xl w-full focus:border-none ${selectedMethod === "agnostic"
                ? "bg-[#1D5882] cursor-normal"
                : ""
                }`}
            >
              {selectedMethod === "agnostic" ? (
                <>
                  <p
                    className={`font-bold text-xs text-white pl-2 outline-none py-4 focus:border-none`}
                  >
                    Nilai Tabungan
                  </p>
                  <p
                    className={`font-bold text-base text-white pl-2 outline-none py-4 focus:border-none pr-2`}
                  >
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(wallet_balance)}
                  </p>
                </>
              ) : (
                <>
                  <p
                    className={`capitalize font-bold ${selectedChannel === "" ? "text-gray-400" : "text-black"
                      }  pl-2 cursor-pointer outline-none py-4  focus:border-none`}
                  >
                    {selectedChannel === "" ? (
                      `Pilih ${selectedMethod}...`
                    ) : (
                      <p className="flex flex-row items-center gap-2">
                        <Image width={30} src={selectedChannelLogo} />
                        {selectedChannel}
                      </p>
                    )}
                  </p>
                  {isDropdownChannelOpen ? (
                    <IconChevronUp />
                  ) : (
                    <IconChevronDown />
                  )}
                </>
              )}
            </button>
            <p
              className={
                selectedMethod === "agnostic" &&
                  donationRequired + admin_fee > wallet_balance
                  ? "instructions italic text-[10px] flex items-center"
                  : "hidden"
              }
            >
              <IconInfoCircle size={15} className="mr-1 text-red-600" />
              <span className="text-red-600">Dana tidak cukup</span>
            </p>
          </>
        )}
        {isDropdownChannelOpen ? (
          <div className="flex flex-col px-4 py-0 shadow-sm shadow-gray-400 text-gray-400 text-sm rounded-xl w-full focus:border-none">
            {selectedMethod === "ewallet"
              ? eWalletChannelOptions.map((data, index) => (
                <>
                  <button
                    onClick={() => {
                      setIsDropdownChannelOpen(false);
                      setSelectedChannel(data.value);
                      setSelectedChannelLogo(data.logo);
                    }}
                    className="flex flex-row justify-between items-center cursor-pointer py-3 w-full"
                  >
                    <div className="flex items-center gap-2">
                      <Image width={30} src={data.logo} />
                      <label
                        htmlFor="ewallet"
                        className="font-bold text-black"
                      >
                        {data.value}
                      </label>
                    </div>
                    <input
                      type="radio"
                      id={data.value}
                      name="paymentOption"
                      value={data.value}
                      className="hidden"
                    />
                    <div
                      className={`w-[10px] h-[10px] ${data.value === selectedChannel && "bg-primary"
                        } rounded-full flex justify-center items-center`}
                    >
                      <div
                        className={`rounded-full p-2 ${data.value === selectedChannel && "border-primary"
                          } border-2`}
                      />
                    </div>
                  </button>
                  {index !== eWalletChannelOptions.length - 1 ? <hr /> : ""}
                </>
              ))
              : bankChannelOptions.map((data, index) => (
                <>
                  <button
                    onClick={() => {
                      setIsDropdownChannelOpen(false);
                      setSelectedChannel(data.value);
                      setSelectedChannelLogo(data.logo);
                    }}
                    className="flex flex-row justify-between items-center cursor-pointer py-3 w-full"
                  >
                    <div className="flex items-center gap-2">
                      <Image width={30} src={data.logo} />
                      <label
                        htmlFor="ewallet"
                        className="font-bold text-black"
                      >
                        {data.value}
                      </label>
                    </div>
                    <input
                      type="radio"
                      id={data.value}
                      name="paymentOption"
                      value={data.value}
                      className="hidden"
                    />
                    <div
                      className={`w-[10px] h-[10px] ${data.value === selectedChannel && "bg-primary"
                        } rounded-full flex justify-center items-center`}
                    >
                      <div
                        className={`rounded-full p-2 ${data.value === selectedChannel && "border-primary"
                          } border-2`}
                      />
                    </div>
                  </button>
                  {index !== bankChannelOptions.length - 1 ? <hr /> : ""}
                </>
              ))}
          </div>
        ) : (
          ""
        )}
      </div>
      <div className="flex flex-col w-full px-4 gap-3 pt-8">
        <p className="text-black text-sm font-medium">Rincian Donasi</p>
        <div className="flex flex-col gap-3 items-center justify-center py-3 px-4 shadow-sm shadow-gray-400 text-sm rounded-xl w-full focus:border-none">
          <p className="text-black font-bold text-lg text-center">
            {formData2?.eventName}
          </p>
          <div className="w-full">
            <hr />
          </div>
          <div className="w-full flex flex-row justify-between">
            <p className="text-gray-400">Nominal Donasi</p>
            <p className="text-black font-medium">
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
              }).format(donationRequired || 0)}
            </p>
          </div>
          {/* <div className="w-full flex flex-row justify-between">
            <p className="text-gray-400">Biaya Transaksi</p>
            <p className="text-black font-medium">
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
              }).format(admin_fee)}
            </p>
          </div> */}
          <div className="w-full">
            <hr />
          </div>
          <div className="w-full flex flex-row justify-between">
            <p className="text-black font-medium">Total</p>
            <p className="text-primary font-bold">
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
              }).format(donationRequired)}
            </p>
          </div>
        </div>
        <div className="grid gap-4 content-center pt-12 mb-2">
          <button
            disabled={
              selectedMethod === "" ||
              (selectedMethod !== "agnostic" && selectedChannel === "") ||
              (selectedMethod === "agnostic" &&
                donationRequired > wallet_balance)
            }
            onClick={() => handleSubmit()}
            type="submit"
            className={
              selectedMethod === "" ||
                (selectedMethod !== "agnostic" && selectedChannel === "") ||
                (selectedMethod === "agnostic" &&
                  donationRequired > wallet_balance)
                ? "text-white bg-gray-400 outline-none font-medium rounded-xl text-xl w-full sm:w-auto px-5 py-2.5 text-center"
                : "text-white bg-primary hover:bg-blue-800 outline-none font-medium rounded-xl text-xl w-full sm:w-auto px-5 py-2.5 text-center"
            }
          >
            Lanjutkan
          </button>
        </div>
      </div>
    </div>
  );
}

function Stepfour({
  cart,
  updateCart,
  setCart,
  setUploadedFile,
  uploadedFile,
  setLoading,
}) {
  const [groupedFoods, setGroupedFoods] = useState({});
  const router = useRouter();
  const IdMerchan = router.query.id;
  const nameMerchant = router.query.name;
  const detonator_id = localStorage.getItem("id");
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Load cart data from local storage on component mount
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
    setLoading(true);
    axios
      .get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}merchant-product/filter?merchant_id=${IdMerchan}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        // Filter foods with status 'approved'
        setLoading(false);
        const approvedFoods = response.data.body.filter(
          (food) => food.status === "approved"
        );

        // Group approved foods by store
        const groupedByMerchant = approvedFoods.reduce((acc, food) => {
          const { merchant_id } = food;
          if (!acc[merchant_id]) {
            acc[merchant_id] = [];
          }
          acc[merchant_id].push(food);
          return acc;
        }, {});
        setGroupedFoods(groupedByMerchant);
      })
      .catch((error) => {
        setLoading(false);
        Error401(error, router);
      });
  }, [setCart]);

  const addToCart = (food) => {
    const existingItemIndex = cart.findIndex((item) => item.id === food.id);

    if (existingItemIndex !== -1) {
      const updatedCart = cart.map((item, index) =>
        index === existingItemIndex
          ? {
            ...item,
            quantity: item.quantity + food.quantity,
            total: (item.quantity + food.quantity) * item.price,
            capacity: food.qty,
          }
          : item
      );
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    } else {
      const updatedCart = [...cart, food];
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    }
  };

  const removeFromCart = (food) => {
    const updatedCart = cart.filter(
      (item) =>
        !(item.merchant_id === parseInt(IdMerchan) && item.id === food.id)
    );
    const totalCartPrice = updatedCart.reduce(
      (total, item) => total + item.total,
      0
    );
    const totalCartQuantity = updatedCart.reduce(
      (total, item) => total + item.quantity,
      0
    );
    updateCart(updatedCart, totalCartPrice, totalCartQuantity);
  };

  const handleLink = () => {
    router.push("/createcampaign?step=3");
  };

  const formatToRupiah = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

  // Calculate total price and total quantity
  // const totalHarga = cart.reduce((acc, item) => acc + item.total, 0).toFixed(0);
  const totalHarga = cart
    .reduce((acc, item) => acc + parseFloat(item.total), 0)
    .toFixed(0);

  const jumlahMakanan = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="w-full">
      <Header title={"Pilih Menu"} />
      <div className="items-center justify-center w-full">
        <div className="w-full bg-white  text-black rounded-lg inline-flex items-center px-4 py-2.5 ">
          <div className="flex justify-between w-full">
            <div className="flex">
              <div className="text-left place-items-start">
                <div className="mb-1 text-primary">
                  Total Harga:{" "}
                  {`Rp ${parseInt(totalHarga).toLocaleString(undefined, {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}`}
                </div>
                <div className="-mt-1  text-xs text-gray-500">
                  Jumlah Menu: {cart.length}
                </div>
              </div>
            </div>
            <div className="grid place-items-center">
              <button
                onClick={handleLink}
                className="flex rounded-lg w-20 h-10 grid-cols-3 gap-2 content-center text-white bg-primary p-2 hover:shadow-lg"
              >
                <IconShoppingCart />
                Cart
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="items-center justify-center mt-2 w-full px-4">
        {Object.keys(groupedFoods).map((IdMerchan) => (
          <>
            {/* <hr className="w-full h-1 mx-auto mt-2 bg-gray-300 border-0 rounded" /> */}
            <div key={IdMerchan} className="mb-4 flex flex-col gap-2">
              <h2 className="text-xl font-bold">{nameMerchant}</h2>
              {groupedFoods[IdMerchan].map((food) => (
                <>
                  <AddFoodCamp
                    cart={cart}
                    key={groupedFoods.id}
                    {...food}
                    addToCart={addToCart}
                    removeFromCart={removeFromCart}
                  />
                </>
              ))}
            </div>
          </>
        ))}
      </div>
    </div>
  );
}

function Stepfive({
  cart,
  setCart,
  setUploadedFile,
  uploadedFile,
  loading,
  setLoading,
}) {
  const [groupedFoods, setGroupedFoods] = useState({});
  const router = useRouter();
  const [dataApi, setDataApi] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [location, setLocation] = useState("");
  const detonator_id = localStorage.getItem("id");
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Check local storage for existing form data
    const storedFormData = localStorage.getItem("formData");
    if (storedFormData) {
      const parsedFormData = JSON.parse(storedFormData);
      if (parsedFormData) {
        // Merge the existing data with the new data
        setLocation(parsedFormData.location || "");
      }
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!detonator_id || !token) {
          throw new Error("Missing required session data");
        }
        setLoading(true);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}merchant/filter?per_page=100000`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const approvedMerchants = response.data.body.filter((merchant) => {
          return (
            merchant.status === "approved" &&
            merchant.products.some((product) => product.status === "approved")
          );
        });
        setDataApi(approvedMerchants);
        setFilteredData(approvedMerchants);
        setLoading(false);
      } catch (error) {
        Error401(error, router);
        setLoading(false);
      }
    };

    fetchData();
  }, [detonator_id]);

  const handleLink = () => {
    router.push("/createcampaign?step=3");
  };

  // Calculate total price and total quantity
  const totalHarga = cart.reduce((acc, item) => acc + item.total, 0).toFixed(2);
  const jumlahMakanan = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="container mx-auto px-4 bg-white">
      <Header title={"Pilih Merchant"} />
      {/* <hr className="w-full h-1 mx-auto mt-2 bg-gray-300 border-0 rounded" /> */}

      {/* <div className="items-center justify-center mt-2 w-full h-full ">
        {loading && <p>Loading...</p>}

        {dataApi.map((item) => (
          <>
            <CardListMerchan key={item.id} data={item} />
          </>
        ))}
      </div> */}
      <p className="text-black font-light text-xs mb-5 flex flex-row items-center justify-center gap-1">
        <IconMapPin color="red" />
        {location}
      </p>
      <div className="flex justify-center">
        <Image src={Market} alt="" />
      </div>
      <p className="py-2 pb-7 text-gray-700 font-medium text-xl">
        Merchant Terdekat
      </p>

      <div className="items-center justify-center w-full">
        <div className="items-center justify-center w-full">
          {dataApi.map((item) => (
            <>
              <CardListMerchan key={item.id} data={item} />
            </>
          ))}
        </div>
      </div>
    </div>
  );
}

export {
  SingleDonationPayment,
  StepOne,
  StepThree,
  StepTwo,
  Stepfive,
  Stepfour,
};
