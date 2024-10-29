import Header from '@/components/Header';
import Loading from '@/components/Loading';
import Error401 from '@/components/error401';
import { IconId, IconUser } from '@tabler/icons-react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

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

const Edit = () => {
    const router = useRouter();
    const [dataVolunteer, setDataVolunteer] = useState(null);
    const [fullName, setFullName] = useState(dataVolunteer?.fullname || "");
    const [ktpNumber, setKtpNumber] = useState(dataVolunteer?.ktp_number || "");
    const [fotoSelfi, setFotoSelfi] = useState(null);
    const [ktpPhoto, setKtpPhoto] = useState(null);
    const [loading, setLoading] = useState(false);
    const [noted, setNoted] = useState('');

    useEffect(() => {
        if (dataVolunteer) {
            localStorage.setItem('rejectData', 'Reject_Data');
            localStorage.setItem("DataVolunteer", JSON.stringify(dataVolunteer));
        }
    }, [dataVolunteer]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const id = localStorage.getItem('id');
        if (!token || !id) {
            router.push('/login');
        }

        const fetchData = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}detonator/fetch/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setNoted(response.data.body?.note || '');

                const noteRejected = {
                    FullName: '',
                    PhoneNumber: '',
                    KTPNumber: '',
                    KTPPhoto: '',
                    SelfPhoto: '',
                };
                const responseObject = response.data.body?.note.split('|').reduce((acc, pair) => {
                    const [key, value] = pair.split(':');
                    acc[key] = value || ''; // Use empty string for missing values
                    return acc;
                }, {});

                const errorObject = { ...noteRejected, ...responseObject };
                const dataResponse = {
                    fullname: response.data.body?.oauth?.fullname,
                    ktp_number: response.data.body.ktp_number,
                    ktp_photo: response.data.body.ktp_photo,
                    self_photo: response.data.body.self_photo,
                    note: response.data.body.note,
                    rejectedError: errorObject,
                };

                setDataVolunteer(dataResponse);
                setFullName(dataResponse.fullname);
                setKtpNumber(dataResponse.ktp_number);

            } catch (error) {
                if (error.response && error.response.status === 401) {
                    Error401(error, router);
                }
            } finally {
                setLoading(false);
            }
        };

        // Fetch data if not already in state
        if (!dataVolunteer) {
            fetchData();
        }
    }, [dataVolunteer, router]);

    useEffect(() => {
        // Update local storage whenever dataVolunteer changes
        if (dataVolunteer) {
            localStorage.setItem("DataVolunteer", JSON.stringify(dataVolunteer));
        }
    }, [dataVolunteer]);

    const handleFullNameChange = (event) => {
        setFullName(event.target.value);
    }


    const handleKtpNumberChange = (event) => {
        const value = event.target.value;
        if (value.length > 16) {
            Toast.fire({
                icon: "error",
                title: "Nomer KTP maksimal 16 angka",
                iconColor: "bg-black",
                timer: 2000,
            });
            return;
        } else if (value.startsWith('08')) {
            Toast.fire({
                icon: "error",
                title: "KTP tidak boleh diawali '08'",
                iconColor: "bg-black",
                timer: 2000,
            });
            return;
        } else {
            setKtpNumber(value);
        }
    };


    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const handleFileChange = (setter) => (e) => {
        const file = e.target.files[0];
        if (file) {
            setter(file);
        }
    };

    const prepareVolunteerData = async () => {
        const fotoSelfiBase64 = fotoSelfi ? await convertToBase64(fotoSelfi) : dataVolunteer?.self_photo;
        const ktpPhotoBase64 = ktpPhoto ? await convertToBase64(ktpPhoto) : dataVolunteer?.ktp_photo;

        return {
            ...dataVolunteer,
            fullname: fullName,
            ktp_number: ktpNumber,
            self_photo: fotoSelfiBase64,
            ktp_photo: ktpPhotoBase64,
        };
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const token = localStorage.getItem('token');
        const id = localStorage.getItem("id");

        const formData = new FormData();

        if (fullName) {
            formData.append('detonator_name', fullName);
        }
        if (ktpNumber) {
            formData.append('ktp_number', ktpNumber);
        }

        if (fotoSelfi) {
            formData.append('self_photo', fotoSelfi);
        }

        if (ktpPhoto) {
            formData.append('ktp_photo', ktpPhoto);
        }


        try {
            const updatedDataVolunteer = await prepareVolunteerData();
            setDataVolunteer(updatedDataVolunteer); // Update state with new data

            const response = await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}detonator/update/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.status === 200) {
                Swal.fire({
                    title: "Data Volunteer Berhasil Diubah!",
                    icon: "success",
                    timer: 3000,
                    showConfirmButton: false
                }).then(() => {
                    localStorage.removeItem("DataVolunteer");
                    localStorage.removeItem("rejectData");
                    router.push("/home");
                });
            }

        } catch (error) {
            if (error.response && error.response.status === 401) {
                Error401(error, router);
            }
            Swal.fire({
                icon: "error",
                title: "Update Volunteer Failed!",
                text: `Gagal Update Volunteer`,
                showConfirmButton: false,
                timer: 2000,
            });
        }
    };

    return (
        <main className="min-h-screen bg-white flex items-start justify-center">
            <div className="container mx-auto p-4 max-w-xl bg-white">
                <Header title={"Edit Volunteer"} backto={"/home"} />
                <div className="text-center mb-4 mt-[50px]">
                    <h1 className="text-2xl font-bold text-gray-800">Edit Volunteer</h1>
                </div>
                <hr className="w-full h-1 bg-gray-300 border-0 rounded my-2" />

                <div className="p-2 w-full flex flex-col mb-1">
                    <div className="p-4 bg-red-50 border border-red-300 rounded-lg text-red-800">
                        <div className="flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                            </svg>
                            <h3 className="text-lg font-medium">Informasi ditolak</h3>
                        </div>

                    </div>
                </div>

                <div className="flex flex-col items-center w-full">
                    <div className="p-2 w-full flex flex-col">

                        {/* Nama Lengkap */}
                        <div className="mt-4 w-full">
                            <label htmlFor="fullName">Nama Lengkap</label>
                            <div className={`flex flex-row items-center text-sm p-4 pr-0 py-0 rounded-lg focus:ring-blue-500 focus:border-none ${dataVolunteer?.rejectedError?.FullName ? 'bg-gray-100 text-gray-400 border-2 border-red-300 ' : 'bg-gray-500 opacity-50 text-black '}`}>
                                <IconUser className="mr-2" />
                                <input
                                    id="fullName"
                                    value={fullName}
                                    onChange={handleFullNameChange}
                                    className={`ml-2 w-full p-0 py-4 pl-1 text-black bg-transparent focus:border-none  outline-none ${!dataVolunteer?.rejectedError?.FullName && 'cursor-not-allowed'}`}
                                    type="text"
                                    placeholder="Nama Lengkap"
                                    disabled={!dataVolunteer?.rejectedError?.FullName}
                                />
                            </div>
                            {dataVolunteer?.rejectedError?.FullName && (<p className="text-sm font-semibold m-0 text-red-500 ">*{dataVolunteer?.rejectedError?.FullName}</p>)}
                        </div>


                        {/* Selfie Upload */}
                        <div className="mt-4 w-full">
                            <label htmlFor="fotoSelfi">Foto Selfi</label>
                            <div className="flex items-center justify-center  ">
                                <label
                                    htmlFor="fotoSelfi"
                                    className={`group relative w-full h-36 border-2 border-dashed rounded-lg shadow-[0px_4px_4px_0px_#00000040] ${dataVolunteer?.rejectedError?.SelfPhoto
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
                                        dataVolunteer?.self_photo && (
                                            <img
                                                src={dataVolunteer?.self_photo.startsWith("data:image") ? dataVolunteer?.self_photo : `${process.env.NEXT_PUBLIC_URL_STORAGE}${dataVolunteer?.self_photo}`}
                                                className="w-full h-full object-cover rounded-lg group-hover:opacity-50 transition-opacity"
                                                alt="Self Photo"
                                            />
                                        )
                                    )}

                                    {dataVolunteer?.rejectedError?.SelfPhoto && (
                                        <span className="absolute inset-0 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                            <p className="font-semibold">Foto Selfi</p>
                                            <p className="font-semibold text-sm">Ambil foto selfi kamu</p>
                                        </span>
                                    )}

                                    <input
                                        id="fotoSelfi"
                                        type="file"
                                        className="hidden"
                                        disabled={!dataVolunteer?.rejectedError?.SelfPhoto}
                                        onChange={handleFileChange(setFotoSelfi)}
                                    />
                                </label>
                            </div>
                            {dataVolunteer?.rejectedError?.SelfPhoto && (<p className="text-sm font-semibold m-0 text-red-500    ">*{dataVolunteer?.rejectedError?.SelfPhoto}</p>)}

                        </div>

                        {/* KTP Upload */}
                        <div className="mt-4 w-full">
                            <label htmlFor="ktpPhoto">Foto KTP</label>
                            <div className="flex items-center justify-center">
                                <label
                                    htmlFor="ktpPhoto"
                                    className={`group relative w-full h-36 border-2 border-dashed rounded-lg shadow-[0px_4px_4px_0px_#00000040] ${dataVolunteer?.rejectedError?.KTPPhoto
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
                                        dataVolunteer?.ktp_photo && (
                                            <img
                                                src={dataVolunteer?.ktp_photo.startsWith("data:image") ? dataVolunteer?.ktp_photo : `${process.env.NEXT_PUBLIC_URL_STORAGE}${dataVolunteer?.ktp_photo}`}
                                                className="w-full h-full object-cover rounded-lg group-hover:opacity-50 transition-opacity"
                                                alt="KTP Photo"
                                            />
                                        )
                                    )}

                                    {dataVolunteer?.rejectedError?.KTPPhoto && (
                                        <span className="absolute inset-0 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                            <p className="font-semibold">KTP Photo</p>
                                            <p className="font-semibold text-sm">Ambil foto KTP kamu</p>

                                        </span>
                                    )}

                                    <input
                                        id="ktpPhoto"
                                        type="file"
                                        className="hidden"
                                        disabled={!dataVolunteer?.rejectedError?.KTPPhoto}
                                        onChange={handleFileChange(setKtpPhoto)}
                                    />
                                </label>
                            </div>
                            {dataVolunteer?.rejectedError?.KTPPhoto && (<p className="text-sm font-semibold m-0 text-red-500 ">*{dataVolunteer?.rejectedError?.KTPPhoto}</p>)}
                        </div>

                        {/* KTP Number */}
                        <div className="mt-4 w-full">
                            <label htmlFor="ktpNumber">Nomor KTP</label>
                            <div className={`flex flex-row items-center text-sm p-4 pr-0 py-0 rounded-lg focus:ring-blue-500 focus:border-none ${dataVolunteer?.rejectedError?.KTPNumber ? 'bg-gray-100 text-gray-400 border-2 border-red-300' : 'bg-gray-500 opacity-50 text-black '}`}>
                                <IconId className="mr-2" />
                                <input
                                    id="ktpNumber"
                                    value={ktpNumber}
                                    onChange={handleKtpNumberChange}
                                    type="number"
                                    placeholder="Nomor KTP"
                                    onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()}
                                    className={`ml-2 w-full p-0 py-4 pl-1 text-black bg-transparent focus:border-none  outline-none ${!dataVolunteer?.rejectedError?.KTPNumber && 'cursor-not-allowed'}`}
                                    disabled={!dataVolunteer?.rejectedError?.KTPNumber}
                                />
                            </div>
                            {dataVolunteer?.rejectedError?.KTPNumber && (<p className="text-sm font-semibold m-0 text-red-500    ">*{dataVolunteer?.rejectedError?.KTPNumber}</p>)}
                        </div>




                        {/* BUTTON SUBMIT */}
                        <button
                            onClick={handleSubmit}
                            disabled={
                                (dataVolunteer?.rejectedError?.FullName && !fullName) ||
                                (dataVolunteer?.rejectedError?.ktpNumber && !ktpNumber && ktpNumber.length < 16) ||
                                (dataVolunteer?.rejectedError?.ktpPhoto && !ktpPhoto) ||
                                (dataVolunteer?.rejectedError?.selfPhoto && !fotoSelfi)
                            }
                            className={`w-full py-3 rounded-xl font-bold text-white transition-colors duration-300 
                            ${(dataVolunteer?.rejectedError?.FullName && !fullName) ||
                                    (dataVolunteer?.rejectedError?.ktpNumber && !ktpNumber && ktpNumber.length < 16) ||
                                    (dataVolunteer?.rejectedError?.KTPPhoto && !ktpPhoto) ||
                                    (dataVolunteer?.rejectedError?.SelfPhoto && !fotoSelfi)
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-primary hover:bg-primary-dark"
                                }`}
                        >
                            {dataVolunteer?.rejectedError?.Address ? "Lanjutkan" : "Kirim"}
                        </button>
                    </div>
                </div>
                {loading && <Loading />}
            </div>
        </main>
    );
};

export default Edit;