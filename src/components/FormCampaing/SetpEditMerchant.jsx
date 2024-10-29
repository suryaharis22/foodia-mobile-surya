// src\components\FormCampaing\SetpEditMerchant.jsx

import { useEffect, useState } from "react";
import { IconUser, IconId, IconCurrentLocation, IconMap, IconBuilding, IconHome, IconMailbox } from "@tabler/icons-react";
import Swal from "sweetalert2";
import Loading from "@/components/Loading";
import { useRouter } from "next/router";
import Header from "../Header";
import dataURItoBlob from "../page/Merchant/dataURItoBlob";
import axios from "axios";
import Error401 from "../error401";
import dynamic from 'next/dynamic';
const DynamicMap = dynamic(() => import('@/components/page/GeoMap'), { ssr: false });



function StepOne({ DataMerchant, setDataMerchant, loading, setLoading }) {

    const router = useRouter();
    const [fullName, setFullName] = useState(DataMerchant?.fullname || "");
    const [merchantName, setMerchantName] = useState(DataMerchant?.merchant_name || "");
    const [ktpNumber, setKtpNumber] = useState(DataMerchant?.ktp_number || "");
    const [noLinkAja, setNoLinkAja] = useState(DataMerchant?.no_link_aja || "");
    const [fotoSelfi, setFotoSelfi] = useState(null);
    const [ktpPhoto, setKtpPhoto] = useState(null);
    const [merchantPhoto, setMerchantPhoto] = useState(null);

    useEffect(() => {
        setFullName(DataMerchant?.fullname || "");
        setMerchantName(DataMerchant?.merchant_name || "");
        setKtpNumber(DataMerchant?.ktp_number || "");
        setNoLinkAja(DataMerchant?.no_link_aja || "");


        // Pastikan DataMerchant sudah terisi
        if (DataMerchant && DataMerchant?.rejectedError) {
            // Cek jika hanya address yang perlu diedit, langsung ke StepTwo
            const shouldGoToStepTwo =
                DataMerchant?.rejectedError?.Address &&
                !DataMerchant?.rejectedError?.FullName &&
                !DataMerchant?.rejectedError?.NameMerchant &&
                !DataMerchant?.rejectedError?.LinkAjaNumber &&
                !DataMerchant?.rejectedError?.PhoneNumber &&
                !DataMerchant?.rejectedError?.KTPNumber &&
                !DataMerchant?.rejectedError?.SelfPhoto &&
                !DataMerchant?.rejectedError?.KTPPhoto &&
                !DataMerchant?.rejectedError?.MerchantPhoto

            if (shouldGoToStepTwo) {
                router.push("/merchant/edit-merchant?step=2");
            }
        }
    }, [DataMerchant, router]);

    // Function to convert file to Base64
    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    // Handle form submission
    const handleSubmit = async () => {
        setLoading(true);
        const token = localStorage.getItem("token");
        const id = localStorage.getItem("id");

        if (!token || !id) {
            router.push("/login");
            return;
        }

        try {
            const updatedDataMerchant = await prepareMerchantData();
            await setDataMerchant(updatedDataMerchant);
            if (DataMerchant?.rejectedError.Address) {
                router.push("/merchant/edit-merchant?step=2");
                return;
            }

            const formData = createFormData(updatedDataMerchant);
            const response = await axios.put(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}merchant/update/${id}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (response.status === 200) {
                Swal.fire({
                    title: "Data Merchant Berhasil Diubah!",
                    icon: "success",
                    timer: 3000,
                    showConfirmButton: false
                }).then(() => {
                    localStorage.removeItem("DataMerchant");
                    localStorage.removeItem("rejectData");
                    router.push("/home");
                });
            }
        } catch (error) {
            handleError(error);
        } finally {
            setLoading(false);
        }
    };

    const prepareMerchantData = async () => {
        const fotoSelfiBase64 = fotoSelfi ? await convertToBase64(fotoSelfi) : DataMerchant?.self_photo;
        const ktpPhotoBase64 = ktpPhoto ? await convertToBase64(ktpPhoto) : DataMerchant?.ktp_photo;
        const merchantPhotoBase64 = merchantPhoto ? await convertToBase64(merchantPhoto) : DataMerchant?.merchant_photo;

        return {
            ...DataMerchant,
            fullname: fullName,
            merchant_name: merchantName,
            ktp_number: ktpNumber,
            no_link_aja: noLinkAja,
            self_photo: fotoSelfiBase64,
            ktp_photo: ktpPhotoBase64,
            merchant_photo: merchantPhotoBase64,
        };
    };

    const createFormData = (data) => {
        const formData = new FormData();
        if (data.rejectedError.FullName) formData.append("merchant_fullname", data.fullname);
        if (data.rejectedError.NameMerchant) formData.append("merchant_name", data.merchant_name);
        if (data.rejectedError.KTPNumber) formData.append("ktp_number", data.ktp_number);
        if (data.rejectedError.LinkAjaNumber) formData.append("no_link_aja", data.no_link_aja);
        if (data.rejectedError.SelfPhoto) formData.append("self_photo", dataURItoBlob(data.self_photo));
        if (data.rejectedError.KTPPhoto) formData.append("ktp_photo", dataURItoBlob(data.ktp_photo));
        if (data.rejectedError.MerchantPhoto) formData.append("merchant_photo", dataURItoBlob(data.merchant_photo));
        return formData;
    };

    const handleError = (error) => {
        if (error.response && error.response.status === 401) {
            Error401(error, router);
        } else {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong!",
            });
        }
    };



    const handleFileChange = (setter) => (e) => {
        const file = e.target.files[0];
        if (file) {
            setter(file);
        }
    };
    return (
        <>
            <hr className="w-full h-1 bg-gray-300 border-0 rounded my-2" />

            {DataMerchant?.note && (
                <div className="p-2 w-full flex flex-col mb-1">
                    <div className="p-4 bg-red-50 border border-red-300 rounded-lg text-red-800">
                        <div className="flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                            </svg>
                            <h3 className="text-lg font-medium">Informasi ditolak pp</h3>
                        </div>

                    </div>
                </div>
            )}

            <div className="flex flex-col items-center w-full">
                <div className="p-2 w-full flex flex-col">

                    {/* Nama Lengkap */}
                    <div className="mt-4 w-full">
                        <label htmlFor="fullName">Nama Lengkap</label>
                        <div className={`flex flex-row items-center text-sm p-4 pr-0 py-0 rounded-lg focus:ring-blue-500 focus:border-none ${DataMerchant?.rejectedError?.FullName ? 'bg-gray-100 text-gray-400 border-2 border-red-300 ' : 'bg-gray-500 opacity-50 text-black '}`}>
                            <IconUser className="mr-2" />
                            <input
                                id="fullName"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className={`ml-2 w-full p-0 py-4 pl-1 text-black bg-transparent focus:border-none  outline-none ${!DataMerchant?.rejectedError?.FullName && 'cursor-not-allowed'}`}
                                type="text"
                                placeholder="Nama Lengkap"
                                disabled={!DataMerchant?.rejectedError?.FullName}
                            />
                        </div>
                        {DataMerchant?.rejectedError?.FullName && (<p className="text-sm font-semibold m-0 text-red-500 ">*{DataMerchant?.rejectedError?.FullName}</p>)}
                    </div>

                    {/* Nama Merchant */}
                    <div className="mt-4 w-full">
                        <label htmlFor="merchantName">Nama Merchant</label>
                        <div className={`flex flex-row items-center text-sm p-4 pr-0 py-0 rounded-lg focus:ring-blue-500 focus:border-none ${DataMerchant?.rejectedError?.NameMerchant ? 'bg-gray-100 text-gray-400 border-2 border-red-300 ' : 'bg-gray-500 opacity-50 text-black '}`}>
                            <IconUser className="mr-2" />
                            <input
                                id="merchantName"
                                value={merchantName}
                                onChange={(e) => setMerchantName(e.target.value)}
                                className={`ml-2 w-full p-0 py-4 pl-1 text-black bg-transparent focus:border-none  outline-none ${!DataMerchant?.rejectedError?.NameMerchant && 'cursor-not-allowed'}`}
                                type="text"
                                placeholder="Nama Merchant"
                                disabled={!DataMerchant?.rejectedError?.NameMerchant}
                            />
                        </div>
                        {DataMerchant?.rejectedError?.NameMerchant && (<p className="text-sm font-semibold m-0 text-red-500 ">*{DataMerchant?.rejectedError?.NameMerchant}</p>)}
                    </div>

                    {/* No Link Aja */}
                    <div className="mt-4 w-full">
                        <label htmlFor="noLinkAja">Nomor Link Aja</label>
                        <div className={`flex flex-row items-center text-sm p-4 pr-0 py-0 rounded-lg focus:ring-blue-500 focus:border-none ${DataMerchant?.rejectedError?.LinkAjaNumber ? 'bg-gray-100 text-gray-400 border-2 border-red-300' : 'bg-gray-500 opacity-50 text-black '}`}>
                            <img src="/icon/payment/LinkAja.png" width={23} alt="LinkAja" className="mr-2" />
                            <input
                                id="noLinkAja"
                                value={noLinkAja}
                                onChange={(e) => setNoLinkAja(e.target.value)}
                                type="number"
                                placeholder="No LinkAja"
                                className={`ml-2 w-full p-0 py-4 pl-1 text-black bg-transparent focus:border-none  outline-none ${!DataMerchant?.rejectedError?.LinkAjaNumber && 'cursor-not-allowed'}`}
                                disabled={!DataMerchant?.rejectedError?.LinkAjaNumber}
                            />
                        </div>
                        {DataMerchant?.rejectedError?.LinkAjaNumber && (<p className="text-sm font-semibold m-0 text-red-500    ">*{DataMerchant?.rejectedError?.LinkAjaNumber}</p>)}
                    </div>

                    {/* Selfie Upload */}
                    <div className="mt-4 w-full">
                        <label htmlFor="fotoSelfi">Foto Selfi</label>
                        <div className="flex items-center justify-center  ">
                            <label
                                htmlFor="fotoSelfi"
                                className={`group relative w-full h-36 border-2 border-dashed rounded-lg shadow-[0px_4px_4px_0px_#00000040] ${DataMerchant?.rejectedError?.SelfPhoto
                                    ? "bg-gray-200 border-red-300 cursor-pointer"
                                    : "bg-gray-600 opacity-50 cursor-not-allowed"
                                    } flex flex-col items-center justify-center text-center`}
                            >
                                {fotoSelfi ? (
                                    <img
                                        src={URL.createObjectURL(fotoSelfi)}
                                        className="w-full h-full object-cover rounded-lg group-hover:opacity-50 transition-opacity"
                                        alt="Foto Selfi"
                                    />
                                ) : (
                                    DataMerchant?.self_photo && (
                                        <img
                                            src={DataMerchant?.self_photo.startsWith("data:image") ? DataMerchant?.self_photo : `${process.env.NEXT_PUBLIC_URL_STORAGE}${DataMerchant?.self_photo}`}
                                            className="w-full h-full object-cover rounded-lg group-hover:opacity-50 transition-opacity"
                                            alt="Self Photo"
                                        />
                                    )
                                )}

                                {DataMerchant?.rejectedError?.SelfPhoto && (
                                    <span className="absolute inset-0 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                        <p className="font-semibold">Foto Selfi</p>
                                        <p className="font-semibold text-sm">Ambil foto selfi kamu</p>
                                    </span>
                                )}

                                <input
                                    id="fotoSelfi"
                                    type="file"
                                    className="hidden"
                                    disabled={!DataMerchant?.rejectedError?.SelfPhoto}
                                    onChange={handleFileChange(setFotoSelfi)}
                                />
                            </label>
                        </div>
                        {DataMerchant?.rejectedError?.SelfPhoto && (<p className="text-sm font-semibold m-0 text-red-500    ">*{DataMerchant?.rejectedError?.SelfPhoto}</p>)}

                    </div>


                    {/* KTP Upload */}
                    <div className="mt-4 w-full">
                        <label htmlFor="ktpPhoto">Foto KTP</label>
                        <div className="flex items-center justify-center">
                            <label
                                htmlFor="ktpPhoto"
                                className={`group relative w-full h-36 border-2 border-dashed rounded-lg shadow-[0px_4px_4px_0px_#00000040] ${DataMerchant?.rejectedError?.KTPPhoto
                                    ? "bg-gray-200 border-red-300 cursor-pointer"
                                    : "bg-gray-600 opacity-50 cursor-not-allowed"
                                    } flex flex-col items-center justify-center text-center`}
                            >
                                {ktpPhoto ? (
                                    <img
                                        src={URL.createObjectURL(ktpPhoto)}
                                        className="w-full h-full object-cover rounded-lg group-hover:opacity-50 transition-opacity"
                                        alt="KTP Photo"
                                    />
                                ) : (
                                    DataMerchant?.ktp_photo && (
                                        <img
                                            src={DataMerchant?.ktp_photo.startsWith("data:image") ? DataMerchant?.ktp_photo : `${process.env.NEXT_PUBLIC_URL_STORAGE}${DataMerchant?.ktp_photo}`}
                                            className="w-full h-full object-cover rounded-lg group-hover:opacity-50 transition-opacity"
                                            alt="KTP Photo"
                                        />
                                    )
                                )}

                                {DataMerchant?.rejectedError?.KTPPhoto && (
                                    <span className="absolute inset-0 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                        <p className="font-semibold">KTP Photo</p>
                                        <p className="font-semibold text-sm">Ambil foto KTP kamu</p>

                                    </span>
                                )}

                                <input
                                    id="ktpPhoto"
                                    type="file"
                                    className="hidden"
                                    disabled={!DataMerchant?.rejectedError?.KTPPhoto}
                                    onChange={handleFileChange(setKtpPhoto)}
                                />
                            </label>
                        </div>
                        {DataMerchant?.rejectedError?.KTPPhoto && (<p className="text-sm font-semibold m-0 text-red-500 ">*{DataMerchant?.rejectedError?.KTPPhoto}</p>)}
                    </div>

                    {/* KTP Number */}
                    <div className="mt-4 w-full">
                        <label htmlFor="ktpNumber">Nomor KTP</label>
                        <div className={`flex flex-row items-center text-sm p-4 pr-0 py-0 rounded-lg focus:ring-blue-500 focus:border-none ${DataMerchant?.rejectedError?.KTPNumber ? 'bg-gray-100 text-gray-400 border-2 border-red-300' : 'bg-gray-500 opacity-50 text-black '}`}>
                            <IconId className="mr-2" />
                            <input
                                id="ktpNumber"
                                value={ktpNumber}
                                onChange={(e) => setKtpNumber(e.target.value)}
                                type="number"
                                placeholder="Nomor KTP"
                                onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()}
                                className={`ml-2 w-full p-0 py-4 pl-1 text-black bg-transparent focus:border-none  outline-none ${!DataMerchant?.rejectedError?.KTPNumber && 'cursor-not-allowed'}`}
                                disabled={!DataMerchant?.rejectedError?.KTPNumber}
                            />
                        </div>
                        {DataMerchant?.rejectedError?.KTPNumber && (<p className="text-sm font-semibold m-0 text-red-500    ">*{DataMerchant?.rejectedError?.KTPNumber}</p>)}
                    </div>

                    {/* Foto Merchant */}
                    <div className="mt-4 w-full">
                        <label htmlFor="merchantPhoto">Foto Merchant</label>
                        <div className="flex items-center justify-center">
                            <label
                                htmlFor="merchantPhoto"
                                className={`group relative w-full h-36 border-2 border-dashed rounded-lg shadow-[0px_4px_4px_0px_#00000040] ${DataMerchant?.rejectedError?.MerchantPhoto
                                    ? "bg-gray-200 border-red-300 cursor-pointer"
                                    : "bg-gray-600 opacity-50 cursor-not-allowed"
                                    } flex flex-col items-center justify-center text-center`}
                            >
                                {merchantPhoto ? (
                                    <img
                                        src={URL.createObjectURL(merchantPhoto)}
                                        className="w-full h-full object-cover rounded-lg group-hover:opacity-50 transition-opacity"
                                        alt="Merchant Photo"
                                    />
                                ) : (
                                    DataMerchant?.merchant_photo && (
                                        <img
                                            src={DataMerchant?.merchant_photo.startsWith("data:image") ? DataMerchant?.merchant_photo : `${process.env.NEXT_PUBLIC_URL_STORAGE}${DataMerchant?.merchant_photo}`}
                                            className="w-full h-full object-cover rounded-lg group-hover:opacity-50 transition-opacity"
                                            alt="Merchant Photo"
                                        />
                                    )
                                )}

                                {DataMerchant?.rejectedError?.MerchantPhoto && (
                                    <span className="absolute inset-0 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                        <p className="font-semibold">Merchant Photo</p>
                                        <p className="font-semibold text-sm">Ambil foto Toko kamu</p>

                                    </span>
                                )}

                                <input
                                    id="merchantPhoto"
                                    type="file"
                                    className="hidden"
                                    disabled={!DataMerchant?.rejectedError?.MerchantPhoto}
                                    onChange={handleFileChange(setMerchantPhoto)}
                                />
                            </label>
                        </div>
                        {DataMerchant?.rejectedError?.MerchantPhoto && (<p className="text-sm font-semibold m-0 text-red-500 ">*{DataMerchant?.rejectedError?.MerchantPhoto}</p>)}

                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={
                            !merchantName || !ktpNumber || !noLinkAja || !fullName ||
                            (DataMerchant?.rejectedError?.SelfPhoto && !fotoSelfi) ||
                            (DataMerchant?.rejectedError?.KTPPhoto && !ktpPhoto) ||
                            (DataMerchant?.rejectedError?.MerchantPhoto && !merchantPhoto)
                        }
                        className={`w-full py-3 mt-4 rounded-xl font-bold text-white transition-colors duration-300 
                            ${!merchantName || !ktpNumber || !noLinkAja || !fullName ||
                                (DataMerchant?.rejectedError?.SelfPhoto && !fotoSelfi) ||
                                (DataMerchant?.rejectedError?.KTPPhoto && !ktpPhoto) ||
                                (DataMerchant?.rejectedError?.MerchantPhoto && !merchantPhoto)
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-primary hover:bg-primary-dark"
                            }`}
                    >
                        {DataMerchant?.rejectedError?.Address ? "Lanjutkan" : "Kirim"}
                    </button>
                </div>
            </div>
        </>
    );
}

function StepTwo({ DataMerchant, setDataMerchant, loading, setLoading }) {
    const router = useRouter();
    const [locationInfo, setLocationInfo] = useState(null);
    const [tracking, setTracking] = useState(true);
    const [address, setAddress] = useState("");
    const [province, setProvince] = useState("");
    const [city, setCity] = useState("");
    const [subDistrict, setSubDistrict] = useState(""); // Mengganti nama menjadi subDistrict
    const [postalCode, setPostalCode] = useState(""); // Mengganti nama menjadi postalCode
    const [coordinates, setCoordinates] = useState("");
    const [detailAlamat, setDetailAlamat] = useState(""); // Mengganti nama menjadi detailAlamat
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");



    const handleDataFromMap = (receivedLocationInfo) => {
        setLocationInfo(receivedLocationInfo);
    };

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

    const handlePostalCode = (event) => {
        setPostalCode(event.target.value);
    };

    const handleAddress = (event) => {
        setAddress(event.target.value);
    };

    const handleDetailAlamatChange = (event) => {
        setDetailAlamat(event.target.value);
    };
    useEffect(() => {
        if (locationInfo) {
            setAddress(locationInfo.fullAdres);
            setProvince(locationInfo.province);
            setCity(locationInfo.city);
            setSubDistrict(locationInfo.sub_district);
            setPostalCode(locationInfo.postal_code);
            setCoordinates(locationInfo.coordinates);
            setLatitude(locationInfo.coordinates.lat);
            setLongitude(locationInfo.coordinates.lng);
            // setJalan(locationInfo.address);
        }
    }, [locationInfo]);

    const prepareMerchantData = async () => {
        return {
            ...DataMerchant, // Assume DataMerchant is defined elsewhere in your code
            fullAddress: {
                address,
                city,
                province,
                latitude,
                longitude,
                postal_code: postalCode,
                sub_district: subDistrict, // Include coordinates if needed
            },
        };
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        const token = localStorage.getItem("token");
        const id = localStorage.getItem("id");

        if (!token || !id) {
            router.push("/login");
            return;
        }
        try {
            const updatedDataMerchant = await prepareMerchantData();
            setDataMerchant(updatedDataMerchant);
            const formData = createFormData(updatedDataMerchant);
            const response = await axios.put(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}merchant/update/${id}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (response.status === 200) {
                Swal.fire({
                    title: "Data Merchant Berhasil Diubah!",
                    icon: "success",
                    timer: 3000,
                    showConfirmButton: false
                }).then(() => {
                    localStorage.removeItem("DataMerchant");
                    localStorage.removeItem("rejectData");
                    router.push("/home");
                });
            }

        }

        catch (error) {
            handleError(error);
        } finally {
            setLoading(false);
        }
    };

    const createFormData = (data) => {
        const formData = new FormData();
        if (data.rejectedError.FullName) formData.append("merchant_fullname", data.fullname);
        if (data.rejectedError.NameMerchant) formData.append("merchant_name", data.merchant_name);
        if (data.rejectedError.KTPNumber) formData.append("ktp_number", data.ktp_number);
        if (data.rejectedError.LinkAjaNumber) formData.append("no_link_aja", data.no_link_aja);
        if (data.rejectedError.SelfPhoto) formData.append("self_photo", dataURItoBlob(data.self_photo));
        if (data.rejectedError.KTPPhoto) formData.append("ktp_photo", dataURItoBlob(data.ktp_photo));
        if (data.rejectedError.MerchantPhoto) formData.append("merchant_photo", dataURItoBlob(data.merchant_photo));
        if (data.rejectedError.Address) {
            if (data.fullAddress) {
                formData.append('address', data.fullAddress.address);
                formData.append('city', data.fullAddress.city);
                formData.append('province', data.fullAddress.province);
                formData.append('sub_district', data.fullAddress.sub_district);
                formData.append('postal_code', data.fullAddress.postal_code);
                formData.append('latitude', data.fullAddress.latitude);
                formData.append('longitude', data.fullAddress.longitude);
            }
        };
        return formData;
    };

    const handleError = (error) => {
        if (error.response && error.response.status === 401) {
            Error401(error, router);
        } else {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong!",
            });
        }
    };

    return (

        <div className="flex flex-col items-center justify-center bg=white  w-full h-full text-primary ">
            <hr className="w-full h-1 mx-auto mt-2 bg-gray-300 border-0 rounded" />
            {DataMerchant?.note && (
                <div className="p-4 m-2 w-full mb-2 text-red-800 border border-red-300 rounded-lg bg-red-50">
                    <div className="flex items-center">
                        <svg className="flex-shrink-0 w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                        </svg>
                        <h3 className="text-lg font-medium">InformasidD itolak</h3>
                    </div>
                    <div className="text-sm mt-2 mb-2 max-h-32 overflow-y-auto break-words">
                        {DataMerchant?.rejectedError?.Address}
                    </div>
                </div>
            )}

            <div className="flex flex-col items-center w-full">
                <div className="p-2 w-full flex flex-col">
                    <div className="p-2 mt-2 w-full px-10">
                        <button
                            onClick={getCurrentLocation}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 m-1"
                        >
                            {tracking ? (
                                <div className="flex items-center justify-center gap-1 p-0">
                                    <IconCurrentLocation color="green" />
                                    <p>Gunakan Lokasi Saat Ini</p>
                                </div>
                            ) : (
                                <p>Custom Location</p>
                            )}
                        </button>
                    </div>
                    <div className="flex justify-center border-gray-300 rounded-lg mb-3">
                        <DynamicMap
                            sendDataToPage={handleDataFromMap}
                            tracking={tracking}
                            setTracking={() => setTracking(false)}
                        />
                    </div>

                    <div className={`flex flex-row mb-4 items-center p-4 pr-0 py-0 bg-gray-100 text-gray-400 text-sm rounded-lg focus:ring-blue-500 w-full focus:border-none`}>
                        <IconMap className="mr-2" />
                        <textarea
                            value={address}
                            onChange={(e) => handleAddress(e)}
                            className={`"ml-2 w-full text-black px-1 p-0 py-4 pl-1 bg-transparent focus:border-none outline-none`}
                            type="text"
                            placeholder="Wilayah"
                            required
                        />
                    </div>

                    <div className={`flex flex-row mb-4 items-center p-4 pr-0 py-0 bg-gray-100 text-gray-400 text-sm rounded-lg focus:ring-blue-500 w-full focus:border-none`}>
                        <IconBuilding className="mr-2" />
                        <input
                            value={province}
                            onChange={handleProvince}
                            type="text"
                            id="province"
                            className="ml-2 w-full p-0 py-4 pl-1 text-black bg-transparent focus:border-none  outline-none"
                            placeholder="provinsi"
                            required
                        />
                    </div>
                    <div className={`flex flex-row mb-4 items-center p-4 pr-0 py-0 bg-gray-100 text-gray-400 text-sm rounded-lg focus:ring-blue-500 w-full focus:border-none`}>
                        <IconBuilding />
                        <input
                            value={city}
                            onChange={handleCity}
                            type="text"
                            id="city"
                            className="ml-2 w-full p-0 py-4 pl-1 text-black bg-transparent focus:border-none  outline-none"
                            placeholder="kota"
                            required
                        />
                    </div>
                    <div className={`flex flex-row mb-4 items-center p-4 pr-0 py-0 bg-gray-100 text-gray-400 text-sm rounded-lg focus:ring-blue-500 w-full focus:border-none`}>

                        <IconHome />
                        <input
                            value={subDistrict} // Menggunakan subDistrict
                            onChange={handleSubDistrict}
                            type="text"
                            id="sub_district"
                            className="ml-2 w-full p-0 py-4 pl-1 text-black bg-transparent focus:border-none  outline-none"
                            placeholder="kecamatan"
                            required
                        />
                    </div>

                    <div className={`flex flex-row mb-4 items-center p-4 pr-0 py-0 bg-gray-100 text-gray-400 text-sm rounded-lg focus:ring-blue-500 w-full focus:border-none`}>

                        <IconMailbox />
                        <input
                            value={postalCode} // Menggunakan postalCode
                            onChange={handlePostalCode}
                            type="text"
                            id="postal_code"
                            className="ml-2 w-full p-0 py-4 pl-1 text-black bg-transparent focus:border-none  outline-none"
                            placeholder="kode pos"
                            required
                        />
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={loading || !address || !province || !city || !subDistrict || !postalCode}
                        className={`w-full py-3 rounded-xl font-bold text-white transition-colors duration-300 ${loading || !address || !province || !city || !subDistrict || !postalCode ? "bg-gray-400 cursor-not-allowed" : "bg-primary"}`}
                    >
                        Kirim
                    </button>


                </div>
            </div>
        </div>

    );
}



export { StepOne, StepTwo };
