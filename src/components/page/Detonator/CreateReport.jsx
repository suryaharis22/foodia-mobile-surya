import InputForm from "@/components/Imput";
import { IconCamera, IconPhotoScan, IconUser } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from 'axios';
import Swal from "sweetalert2";
import Header from "@/components/Header";
import Error401 from "@/components/error401";
import CompressImage from "@/components/CompressImage";
import { encryptId } from "@/utils/EndCodeHelper1";

const CreateReport = (CreateReport) => {
    // const { stepForm } = props;
    const router = useRouter();
    const campaign_id = router.query.id;
    const [loading, setLoading] = useState(false);
    const [newReport, setnewReport] = useState({});
    const [title, seTitle] = useState(newReport?.title ?? '');
    const [description, setDescription] = useState(newReport?.description ?? '');
    const [imgReport, setImgReport] = useState(newReport?.imgReport ?? null);
    const [dataCamp, setDataCamp] = useState();
    const [error, setError] = useState('');
    const [LoadingImgReport, setLoadingImgReport] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}campaign/fetch/${campaign_id}`);
                setDataCamp(response.data.body);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        if (campaign_id) {
            fetchData();
        }


    }, [campaign_id])


    const handletitleChange = (event) => {
        seTitle(event.target.value);
    };

    const handledescriptionChange = (event) => {
        setDescription(event.target.value);
    };
    const handleImgReportChange = (event) => {
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
        setLoadingImgReport(true);

        if (!allowedTypes.includes(file?.type)) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Hanya file PNG, JPG, JPEG dan HEIF yang diizinkan!",
            });
            setLoadingImgReport(false);
            return;
        }
        if (file.size <= maxSize) {
            setImgReport(file);
            setLoadingImgReport(false);
        } else {
            CompressImage(file)
                .then((compressedFile) => {
                    const size = (compressedFile.size / (1024 * 1024)).toFixed(2);
                    if (size <= maxSize) {
                        setImgReport(compressedFile);
                    } else {
                        Toast.fire({
                            icon: "error",
                            title: "Ukuran gambar melebihi 5MB!",
                            iconColor: "bg-black",
                        });
                    }
                    setLoadingImgReport(false);
                })
                .catch((error) => {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Ukuran gambar melebihi 5MB!",
                    });
                    setLoadingImgReport(false);
                });
        }
        setImgReport(file);
        setLoading(false);
    };

    // Function to handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevents the default form submission
        setLoading(true);

        // Validation checks
        if (!title || !description || !imgReport) {
            window.alert('All fields are required');
            setLoading(false);
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('destination', 'report');
            formData.append('file', imgReport);

            const mediaUploadResponse = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}media/upload`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const Image = mediaUploadResponse.data.body.file_url;

            if (mediaUploadResponse.status === 200) {
                const eventData = {
                    campaign_id: parseInt(campaign_id),
                    title,
                    type: 'detonator',
                    order_id: null,
                    description,
                    images: [
                        {
                            image_url: Image,
                        }
                    ]
                };
                setnewReport(eventData);

                axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}campaign-report/create`, eventData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                    .then((resspones) => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Report Berhasil Disimpan',
                            text: 'Terima kasih telah memberi report',
                            showConfirmButton: true,
                            confirmButtonColor: '#6CB28E',
                            confirmButtonText: 'OK',
                        }).then(() => {
                            setLoading(false);
                            localStorage.setItem("prevPath", "/home");
                            router.push(`/campaign/${campaign_id}`);

                        })
                    })
                    .catch((error) => {
                        setLoading(false);
                        Error401(error, router);
                    });

            } else {
                setLoading(false);
                Swal.fire({
                    icon: 'error',
                    title: 'Image Gagal Upload',
                    text: 'Gagal Upload Image Mohon Coba Lagi',
                    showConfirmButton: false,
                    timer: 2000,
                });
            }

        } catch (error) {
            setLoading(false);
            Error401(error, router);
        }
        setLoading(false);
        // router.push('/registrasi/merchant?step=2');
    }


    return (
        <>
            <div className="container mx-auto pt-14 bg-white h-screen">
                <Header />
                <div className="place-content-center">
                    <div className="mx-auto text-center p-2 text-primary">
                        <h1 className="font-bold text-lg">Form Penyelesaian Detonator</h1>
                        <h1>{dataCamp?.event_name}</h1>
                    </div>
                    <hr className="w-full h-1 mx-auto mt-2 bg-gray-300 border-0 rounded" />
                    <form className='p-2 mt-5 w-full' onSubmit={handleSubmit}>

                        <div className="mb-2">
                            <label htmlFor="imgReport" className="text-sm font-medium text-gray-900 sr-only">Upload Image</label>
                            <div className="flex items-center justify-center w-full">
                                <label
                                    htmlFor="imgReport"
                                    className="relative flex items-center justify-center p-4 w-full h-36 border-2 border-gray-500 border-dashed rounded-lg cursor-pointer bg-gray-200 hover:bg-gray-100"
                                >
                                    {LoadingImgReport ? (
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
                                    ) : imgReport ? (
                                        <img
                                            src={URL.createObjectURL(imgReport)}
                                            alt="Foto Selfi"
                                            className="w-full h-full rounded-lg object-cover"
                                        />
                                    ) : (
                                        <div className="flex items-center">
                                            <div className="flex items-center justify-center bg-primary rounded-lg w-14 h-14">
                                                <IconCamera className="w-8 h-8 text-white" />
                                            </div>
                                            <div className="ml-2">
                                                <p className="text-sm font-bold text-black">Foto Acara</p>
                                                <p className="text-xs font-semibold text-gray-500">Ambil foto acara</p>
                                            </div>
                                        </div>
                                    )}
                                    <input
                                        id="imgReport"
                                        type="file"
                                        className="hidden"
                                        onChange={handleImgReportChange}
                                    />
                                </label>
                            </div>
                        </div>


                        <div className="mb-2">
                            {/* <label htmlFor='title' className="text-sm font-medium text-gray-900">Report</label> */}
                            <InputForm
                                cssInput={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                                label="title" type="text" name="title" value={title} onChange={handletitleChange} placeholder="Judul"
                            />
                        </div>
                        <div className="mb-2">
                            {/* <label htmlFor='description' className="text-sm font-medium text-gray-900">Description </label> */}
                            <textarea
                                id="description"
                                name="description"
                                value={description}
                                onChange={handledescriptionChange}
                                placeholder="Description"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 h-24"
                            />
                        </div>
                        <div className="grid gap-4 content-center">
                            <button
                                type="submit"
                                disabled={loading || !title || !description}
                                className={`text-white ${loading || !title || !description ? 'bg-gray-400' : 'bg-primary'} hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-full text-sm w-full sm:w-auto px-5 py-2.5 flex items-center justify-center`}>
                                {loading ? (
                                    <>
                                        <svg aria-hidden="true" class="mr-2 w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                        </svg>
                                        Loading
                                    </>
                                ) : (
                                    "Submit"
                                )}

                            </button>
                        </div>
                    </form>

                </div >
            </div>
        </>
    )
}

export default CreateReport;