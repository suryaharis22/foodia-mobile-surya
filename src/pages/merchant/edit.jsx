import Swal from 'sweetalert2';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { IconUser, IconCurrentLocation, IconMap, IconBuilding, IconHome, IconMailbox } from '@tabler/icons-react'; // Import IconCurrentLocation
import Loading from '@/components/Loading';
import { IconId } from '@tabler/icons-react';
import Header from '@/components/Header';
import Error401 from '@/components/error401';

const DynamicMap = dynamic(() => import('@/components/page/GeoMap'), { ssr: false });

const EditMerchant = () => {
    const router = useRouter();
    const [dataUser, setDataUser] = useState({});
    const [locationInfo, setLocationInfo] = useState(null);

    const [merchantName, setMerchantName] = useState("");
    const [ktpNumber, setKtpNumber] = useState('');
    const [fotoSelfi, setFotoSelfi] = useState(null);
    const [ktpPhoto, setKtpPhoto] = useState(null);
    const [noLinkAja, setNoLinkAja] = useState('');

    const [address, setAddress] = useState("");
    const [province, setProvince] = useState("");
    const [city, setCity] = useState("");
    const [sub_district, setSubDistrict] = useState("");
    const [postal_code, setPostalCode] = useState("");
    const [coordinates, setCoordinates] = useState("");
    const [DetaiAlamat, setDetaiAlamat] = useState("");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");

    const [loading, setLoading] = useState(false);
    const [noted, setNoted] = useState('');
    const [tracking, setTracking] = useState(true);

    const Toast = Swal.mixin({
        toast: true,
        position: 'center',
        iconColor: 'white',
        customClass: {
            popup: 'colored-toast',
        },
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
    })

    const handleDataFromMap = (receivedLocationInfo) => {
        setLocationInfo(receivedLocationInfo);
    };

    const getCurrentLocation = () => {
        setTracking((prevTracking) => !prevTracking);
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        const id = localStorage.getItem('id');
        if (!token || !id) {
            router.push('/login');
        }

        const fetchData = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}merchant/fetch/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setDataUser(response.data.body);
                setMerchantName(response.data.body?.merchant_name || '');
                setKtpNumber(response.data.body?.ktp_number || '');
                setNoLinkAja(response.data.body?.no_link_aja || '');
                setProvince(response.data.body?.province || '');
                setCity(response.data.body?.city || '');
                setSubDistrict(response.data.body?.sub_district || '');
                setPostalCode(response.data.body?.postal_code || '');
                setAddress(response.data.body?.address || '');
                setNoted(response.data.body?.note || '');
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    Error401(error, router);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleMerchantNameChange = (event) => {
        setMerchantName(event.target.value);
    };

    const handleKtpNumberChange = (event) => {
        const value = event.target.value;
        if (value.length > 16) {
            Toast.fire({
                icon: 'error',
                title: 'Nomer KTP maksimal 16 angka',
                iconColor: 'bg-black',
            })
        } else {
            setKtpNumber(value);
        }
    };

    const handleNoLinkAjaChange = (event) => {
        setNoLinkAja(event.target.value);
    };

    const handleFotoSelfiChange = (event) => {
        const file = event.target.files[0];
        setFotoSelfi(file);
    };

    const handleKtpPhotoChange = (event) => {
        const file = event.target.files[0];
        setKtpPhoto(file);
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

    const handleDetaiAlamatChange = (event) => {
        setDetaiAlamat(event.target.value);
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

    const handleSubmit = async (event) => {
        event.preventDefault();
        const token = localStorage.getItem('token');
        const formData = new FormData();
        if (fotoSelfi) {
            formData.append('self_photo', fotoSelfi);
        }
        if (ktpPhoto) {
            formData.append('ktp_photo', ktpPhoto);
        }
        if (DetaiAlamat) {
            formData.append('note', DetaiAlamat);
        }
        if (ktpNumber) {
            formData.append('ktp_number', ktpNumber);
        }
        if (merchantName) {
            formData.append('merchant_name', merchantName);
        }
        if (noLinkAja) {
            formData.append('no_link_aja', noLinkAja);
        }
        if (province) {
            formData.append('province', province);
        }
        if (city) {
            formData.append('city', city);
        }
        if (sub_district) {
            formData.append('sub_district', sub_district);
        }
        if (postal_code) {
            formData.append('postal_code', postal_code);
        }
        if (address) {
            formData.append('address', address);
        }
        if (latitude) {
            formData.append('latitude', latitude);
        }
        if (longitude) {
            formData.append('longitude', longitude);

        }

        try {
            const response = await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}merchant/update/${dataUser?.id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            Swal.fire({
                icon: 'success',
                title: 'Update merchant Success!',
                text: 'Update merchant Success! mohon tunggu approval',
                showConfirmButton: false,
                timer: 2000,
            });
            setTimeout(() => {
                router.push('/home');
            }, 2000);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                Error401(error, router);
            }
            console.error('Update merchant Failed:', error);
            Swal.fire({
                icon: 'error',
                title: 'Update merchant Failed!',
                text: 'Gagal Update merchant',
                showConfirmButton: false,
                timer: 2000,
            });
        }
    };

    return (
        <div className="container mx-auto h-screen max-w-480 bg-white flex flex-col">
            <Header title="Edit Profil" backto="/home" />
            <main className="my-0 mx-auto min-h-full mobile-w  pt-10">
                <div className="mx-auto bg-white h-full text-primary">
                    <div className="flex justify-center p-4">
                        <h1 className="text-lg text-primary font-bold">Edit Data Profil Merchant</h1>
                    </div>
                    <hr className="w-full h-1 mx-auto mt-2 bg-gray-300 border-0 rounded" />
                    {noted && (
                        <div id="alert-additional-content-2" class="p-4 m-2 mb-4 text-red-800 border border-red-300 rounded-lg bg-red-50  dark:text-red-400 dark:border-red-800" role="alert">
                            <div class="flex items-center">
                                <svg class="flex-shrink-0 w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                                </svg>
                                <span class="sr-only">Info</span>
                                <h3 class="text-lg font-medium">This is rejected info</h3>
                            </div>
                            <div class="mt-2 mb-2 text-sm">
                                {noted}
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col items-center w-full">
                        <div className="p-2 w-full flex flex-col gap-3">
                            <div className="flex flex-row items-center p-4 pr-0 py-0 bg-gray-100 text-gray-400 text-sm rounded-lg focus:ring-blue-500 w-full focus:border-none">
                                <IconUser />
                                <input
                                    value={merchantName}
                                    onChange={handleMerchantNameChange}
                                    type="text"
                                    id="merchant_name"
                                    className="ml-2 w-full p-0 py-4 pl-1 bg-transparent focus:border-none"
                                    placeholder="Nama Merchant"
                                    required
                                />
                            </div>
                            <div className="flex flex-row items-center p-4 pr-0 py-0 bg-gray-100 text-gray-400 text-sm rounded-lg focus:ring-blue-500 w-full focus:border-none">
                                <IconId />
                                <input
                                    value={ktpNumber}
                                    onChange={handleKtpNumberChange}
                                    type="number"
                                    min="0"
                                    onKeyDown={(e) => {
                                        if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                                            e.preventDefault();
                                        }
                                    }}
                                    id="ktp_number"
                                    className="ml-2 w-full p-0 py-4 pl-1 bg-transparent focus:border-none"
                                    placeholder="Nomor KTP"
                                    required
                                />
                            </div>
                            <div className="flex flex-row items-center p-4 pr-0 py-0 bg-gray-100 text-gray-400 text-sm rounded-lg focus:ring-blue-500 w-full focus:border-none">
                                <img src={'/icon/payment/LinkAja.png'} width={23} />
                                <input
                                    value={noLinkAja}
                                    onChange={handleNoLinkAjaChange}
                                    type="number"
                                    min="0"
                                    onKeyDown={(e) => {
                                        if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                                            e.preventDefault();
                                        }
                                    }}
                                    id="no_link_aja"
                                    className="ml-2 w-full p-0 py-4 pl-1 bg-transparent focus:border-none"
                                    placeholder="Nomor Link Aja"
                                    required
                                />
                            </div>
                            <div className="flex items-center justify-center w-full">
                                <label
                                    htmlFor="fotoSelfi"
                                    className="flex flex-col items-center justify-center w-full h-36 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-200 dark:hover:bg-gray-800 hover:bg-gray-100 px-4"
                                >
                                    {fotoSelfi ? (
                                        <img
                                            src={URL.createObjectURL(fotlfi)}
                                            alt="Foto Selfi"
                                            className="w-full h-full rounded-lg object-cover"
                                        />
                                    ) : (
                                        <img
                                            src={`${process.env.NEXT_PUBLIC_URL_STORAGE}${dataUser?.self_photo || ''}`}
                                            alt="Foto Selfi"
                                            className="w-full h-full rounded-lg object-cover"
                                        />
                                    )}
                                    <input
                                        id="fotoSelfi"
                                        type="file"
                                        className="hidden"
                                        onChange={handleFotoSelfiChange}
                                    />
                                </label>
                            </div>
                            <div className="flex items-center justify-center w-full">
                                <label
                                    htmlFor="ktpPhoto"
                                    className="flex flex-col items-center justify-center w-full h-36 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-200 dark:hover:bg-gray-800 hover:bg-gray-100 px-4"
                                >
                                    {ktpPhoto ? (
                                        <img
                                            src={URL.createObjectURL(ktpPhoto)}
                                            alt="KTP Photo"
                                            className="w-full h-full rounded-lg object-cover"
                                        />
                                    ) : (
                                        <img
                                            src={`${process.env.NEXT_PUBLIC_URL_STORAGE}${dataUser?.ktp_photo || ''}`}
                                            alt="Foto Selfi"
                                            className="w-full h-full rounded-lg object-cover"
                                        />
                                    )}
                                    <input
                                        id="ktpPhoto"
                                        type="file"
                                        className="hidden"
                                        onChange={handleKtpPhotoChange}
                                    />
                                </label>
                            </div>
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
                            <div className="flex justify-center border-gray-300 rounded-lg">
                                <DynamicMap sendDataToPage={handleDataFromMap} tracking={tracking} />
                            </div>
                            <div className="flex flex-row items-center p-4 pr-0 py-0 bg-gray-100 text-gray-400 text-sm rounded-lg focus:ring-blue-500 w-full focus:border-none">
                                <IconMap />
                                <textarea
                                    onChange={(e) => setLocation(e.target.value)}
                                    value={address}
                                    type="text"
                                    className="ml-2 w-full px-1 p-0 py-4 pl-1 bg-transparent focus:border-none"
                                    placeholder="Wilayah"
                                    required
                                />
                            </div>
                            <div className="flex flex-row items-center p-4 pr-0 py-0 bg-gray-100 text-gray-400 text-sm rounded-lg focus:ring-blue-500 w-full focus:border-none">
                                <IconBuilding />
                                <input
                                    value={province}
                                    onChange={handleProvince}
                                    type="text"
                                    id="province"
                                    className="ml-2 w-full p-0 py-4 pl-1 bg-transparent focus:border-none"
                                    placeholder="Nomor KTP"
                                    required
                                />
                            </div>
                            <div className="flex flex-row items-center p-4 pr-0 py-0 bg-gray-100 text-gray-400 text-sm rounded-lg focus:ring-blue-500 w-full focus:border-none">
                                <IconBuilding />
                                <input
                                    value={city}
                                    onChange={handleCity}
                                    type="text"
                                    id="city"
                                    className="ml-2 w-full p-0 py-4 pl-1 bg-transparent focus:border-none"
                                    placeholder="Nomor KTP"
                                    required
                                />
                            </div>
                            <div className="flex flex-row items-center p-4 pr-0 py-0 bg-gray-100 text-gray-400 text-sm rounded-lg focus:ring-blue-500 w-full focus:border-none">
                                <IconHome />
                                <input
                                    value={sub_district}
                                    onChange={handleSubDistrict}
                                    type="text"
                                    id="sub_district"
                                    className="ml-2 w-full p-0 py-4 pl-1 bg-transparent focus:border-none"
                                    placeholder="Nomor KTP"
                                    required
                                />
                            </div>
                            <div className="flex flex-row items-center p-4 pr-0 py-0 bg-gray-100 text-gray-400 text-sm rounded-lg focus:ring-blue-500 w-full focus:border-none">
                                <IconMailbox />
                                <input
                                    value={postal_code}
                                    onChange={handlePostalCode}
                                    type="text"
                                    id="postal_code"
                                    className="ml-2 w-full p-0 py-4 pl-1 bg-transparent focus:border-none"
                                    placeholder="Nomor KTP"
                                    required
                                />
                            </div>
                            <div className="grid gap-4 content-center">
                                <button
                                    onClick={handleSubmit}
                                    type="submit"
                                    className="text-white text-center font-bold rounded-xl bg-primary py-3"
                                >
                                    Kirim
                                </button>
                            </div>
                        </div>
                    </div>
                    {loading && <Loading />}
                </div>
            </main>

        </div>
    );
};

export default EditMerchant;
