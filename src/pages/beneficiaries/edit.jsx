import Swal from 'sweetalert2';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { IconUser } from '@tabler/icons-react'; // Import IconCurrentLocation
import Loading from '@/components/Loading';
import Header from '@/components/Header';
import Error401 from '@/components/error401';


const EditBeneficiaries = () => {
    const router = useRouter();
    const [dataUser, setDataUser] = useState({});

    const [beneficiariesName, setBeneficiariesName] = useState("");
    const [ktpNumber, setKtpNumber] = useState('');
    const [fotoSelfi, setFotoSelfi] = useState(null);
    const [ktpPhoto, setKtpPhoto] = useState(null);

    const [loading, setLoading] = useState(false);
    const [noted, setNoted] = useState('');

    const [rejectedError, setRejectedError] = useState({});

    useEffect(() => {
    }, [rejectedError]);
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



    useEffect(() => {
        const token = localStorage.getItem('token');
        const id = localStorage.getItem('id');

        if (!token || !id) {
            router.push('/login');
            return; // Menambahkan return untuk menghentikan eksekusi lebih lanjut
        }

        const fetchData = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}beneficiaries/fetch/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const userData = response.data.body;

                setDataUser(userData);
                setBeneficiariesName(userData?.oauth?.fullname || '');
                setKtpNumber(userData?.ktp_number || '');
                setNoted(userData?.note || '');

                const noteRejected = {
                    Name: '',
                    linkajaNumber: '',
                    phoneNumber: '',
                    ktpNumber: '',
                    KTPPhoto: '',
                    selfPhoto: '',
                    frontalPhoto: '',
                    Address: '',
                };

                // Parse the note into an object
                const responseObject = userData?.note?.split('|').reduce((acc, pair) => {
                    const [key, value] = pair.split(':');
                    acc[key] = value || ''; // Use empty string for missing values
                    return acc;
                }, {});

                // Merge parsed notes with the default rejected notes
                const errorObject = { ...noteRejected, ...responseObject };

                setRejectedError(errorObject);

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

    const handlebeneficiariesNameChange = (event) => {
        setBeneficiariesName(event.target.value);
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

    const handleFotoSelfiChange = (event) => {
        const file = event.target.files[0];
        setFotoSelfi(file);
    };

    const handleKtpPhotoChange = (event) => {
        const file = event.target.files[0];
        setKtpPhoto(file);
    };


    const handleSubmit = async (event) => {
        event.preventDefault();
        const token = localStorage.getItem('token');
        const cekData = {
            beneficiariesName,
            ktpNumber,
            ktpPhoto,
            fotoSelfi,
        }

        const formData = new FormData();
        if (beneficiariesName) {
            formData.append('beneficiaries_name', beneficiariesName);
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
            const response = await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}beneficiaries/update/${dataUser?.id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            Swal.fire({
                icon: 'success',
                title: 'Update beneficiaries Success!',
                text: 'Update beneficiary Success! mohon tunggu approval',
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
            console.error('Update beneficiary Failed:', error);
            Swal.fire({
                icon: 'error',
                title: 'Update beneficiary Failed!',
                text: 'Gagal Update beneficiary, silahkan coba lagi',
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
                        <h1 className="text-lg text-primary font-bold">Edit Data Profil Beneficiaries</h1>
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
                                {rejectedError?.noted}
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col items-center w-full">
                        <div className="p-2 w-full flex flex-col">

                            {rejectedError?.Name && (
                                <p className='text-sm text-red-300'>*{rejectedError.Name}</p>
                            )}
                            <div className={`flex flex-row items-center p-4 pr-0 py-0 mb-4 ${rejectedError?.Name ? 'bg-gray-100 text-gray-400' : 'bg-gray-500 opacity-50 text-black'} text-sm rounded-lg focus:ring-blue-500 w-full focus:border-none`}>
                                <IconUser />
                                <input
                                    value={beneficiariesName}
                                    onChange={handlebeneficiariesNameChange}
                                    type="text"
                                    id="beneficiaries_name"
                                    className={`ml-2 w-full p-0 py-4 pl-1 bg-transparent focus:border-none ${rejectedError?.Name ? '' : 'cursor-not-allowed'}`}
                                    placeholder="Nama Beneficiaries"
                                    required
                                    disabled={!rejectedError?.Name} // Disable input if rejectedError.Name is empty
                                />
                            </div>

                            {rejectedError?.ktpNumber && (
                                <p className='text-sm text-red-300'>*{rejectedError.ktpNumber}</p>
                            )}
                            <div className={`flex flex-row items-center p-4 pr-0 py-0 mb-4 ${rejectedError?.ktpNumber ? 'bg-gray-100 text-gray-400' : 'bg-gray-500 opacity-50 text-black'} text-sm rounded-lg focus:ring-blue-500 w-full focus:border-none`}>
                                <IconUser />
                                <input
                                    value={ktpNumber}
                                    onChange={handleKtpNumberChange}
                                    type="number"
                                    min="0"
                                    onKeyDown={(e) => {
                                        if (['e', 'E', '+', '-'].includes(e.key)) {
                                            e.preventDefault();
                                        }
                                    }}
                                    id="ktp_number"
                                    className={`ml-2 w-full p-0 py-4 pl-1 bg-transparent focus:border-none ${rejectedError?.ktpNumber ? '' : 'cursor-not-allowed'}`}
                                    placeholder="Nomor KTP"
                                    required
                                    disabled={!rejectedError?.ktpNumber}  // Disable input if rejectedError.KTPPhoto is empty
                                />
                            </div>

                            {rejectedError?.fotoSelfi && (
                                <p className='text-sm text-red-300'>*{rejectedError.fotoSelfi}</p>
                            )}
                            <div className="flex items-center justify-center w-full mb-4">
                                <label
                                    htmlFor="fotoSelfi"
                                    className={`flex flex-col items-center justify-center w-full h-36 border-2 border-gray-300 border-dashed rounded-lg  ${rejectedError?.selfPhoto ? 'bg-gray-200' : 'bg-gray-500 opacity-50 text-black cursor-not-allowed'} dark:hover:bg-gray-800 hover:bg-gray-100 px-4`}
                                >
                                    {fotoSelfi ? (
                                        <img
                                            src={URL.createObjectURL(fotoSelfi)}
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
                                        className={`hidden ml-2 w-full p-0 py-4 pl-1 bg-transparent focus:border-none ${!rejectedError?.selfPhoto ? '' : 'cursor-not-allowed'}`}
                                        onChange={handleFotoSelfiChange}
                                        disabled={!rejectedError?.selfPhoto}
                                    />
                                </label>
                            </div>

                            {rejectedError?.KTPPhoto && (
                                <p className='text-sm text-red-300'>*{rejectedError.KTPPhoto}</p>
                            )}
                            <div className="flex items-center justify-center w-full mb-4">
                                <label
                                    htmlFor="ktpPhoto"
                                    className={`flex flex-col items-center justify-center w-full h-36 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer  ${rejectedError?.KTPPhoto ? 'bg-gray-200' : 'bg-gray-500 opacity-50 text-black'} dark:hover:bg-gray-800 hover:bg-gray-100 px-4`}

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
                                        className={`hidden ml-2 w-full p-0 py-4 pl-1 bg-transparent focus:border-none ${rejectedError?.KTPPhoto ? '' : 'cursor-not-allowed'}`}
                                        onChange={handleKtpPhotoChange}
                                        disabled={rejectedError?.KTPPhoto === false}
                                    />
                                </label>
                            </div>

                            <div className="grid gap-4 content-center">
                                <button
                                    onClick={handleSubmit}
                                    disabled={
                                        (rejectedError?.KTPPhoto === true && ktpPhoto == null) ||
                                        (rejectedError?.selfPhoto === true && fotoSelfi == null)
                                    } // tombol disabled jika sesuai dengan rejectedError dan fotonya null
                                    type="submit"
                                    className={`text-white text-center font-bold rounded-xl py-3 w-full transition-colors duration-300 ${(rejectedError?.KTPPhoto === true && ktpPhoto == null) ||
                                        (rejectedError?.selfPhoto === true && fotoSelfi == null)
                                        ? "bg-gray-400 cursor-not-allowed" // warna tombol saat disabled
                                        : "bg-primary hover:bg-primary-dark" // warna tombol saat aktif
                                        }`}
                                >
                                    Kirim
                                </button>
                            </div>

                        </div>
                    </div>
                    {loading && <Loading />}
                </div>
            </main >

        </div >
    );
};

export default EditBeneficiaries;
