// src/pages/merchant/kupon/pelaporan/[id].jsx

import CardPesanan from "@/components/CardPesanan";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import CardKupon from "@/components/page/Merchant/CardKupon";
import { IconCamera, IconMapPin } from "@tabler/icons-react";
import axios from "axios";
import moment from "moment";
import 'moment/locale/id';
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState, useRef, } from "react";
import { Carousel } from "react-responsive-carousel";
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Modal from 'react-modal';
import Error401 from "@/components/error401";
import dataURItoBlob from "@/components/page/Merchant/dataURItoBlob";
import Swal from "sweetalert2";
import { IconX } from "@tabler/icons-react";


const pelaporan = () => {
    const router = useRouter();
    const id_order = router.query.id;
    const [loading, setLoading] = useState(true);
    const [dataApi, setDataApi] = useState();
    const [confirmedOrder, setConfirmedOrder] = useState(0);
    const [prevPath, setPrevPath] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [imgMakan, setImgMakan] = useState([]);
    const [imgPenerima, setImgPenerima] = useState([]);
    const [dataCarousel, setDataCarousel] = useState('');
    const [uploadMakanan, setUploadMakanan] = useState([]);
    const [uploadPenerima, setUploadPenerima] = useState([]);


    useEffect(() => {
        const FotoMakan = localStorage.getItem("imgMakanan");
        const FotoPenerima = localStorage.getItem("imgPenerima");
        if (FotoMakan) {
            setImgMakan(JSON.parse(FotoMakan));
        }
        if (FotoPenerima) {
            setImgPenerima(JSON.parse(FotoPenerima));
        }
    }, [])

    useEffect(() => {
        const prevPath = localStorage.getItem("prevPath");
        if (prevPath !== "order_confirmation") {
            setPrevPath(prevPath);
        } else if (prevPath === "order_confirmation") {
            setPrevPath("/merchant");
        }
    }, [])

    useEffect(() => {
        const role = localStorage.getItem("role");
        const token = localStorage.getItem("token");
        const status = localStorage.getItem("status");
        const id = localStorage.getItem("id");

        if (
            !role ||
            !token ||
            role !== "merchant" ||
            status !== "approved" ||
            !id
        ) {
            // Redirect to login if either role or token is missing or role is not 'detonator' or status is not 'approved'
            localStorage.clear();
            router.push("/login");
        }
    }, [router]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        setLoading(true);
        if (id_order) {
            axios
                .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}coupon/fetch/${id_order}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((response) => {
                    if (response.data.body.status === "claimed") {
                        localStorage.setItem("prevPath", "/inbox");
                        router.push(`/merchant/kupon/claimed/${id_order}`)
                    }

                    setDataApi(response.data.body);
                    setLoading(false);

                    setConfirmedOrder(response.data.body.qty);
                })
                .catch((error) => {
                    setLoading(false);
                    Error401(error, router);
                });
        }
    }, [id_order]);

    const openModal = (identifier, event) => {
        event.preventDefault(); // Menghentikan propagasi event
        event.stopPropagation(); // Menghentikan propagasi event

        const index = parseInt(identifier.split('_')[1]);

        if (identifier.startsWith('makan')) {
            setDataCarousel('makan');
            setCurrentImageIndex(index);
            setIsModalOpen(true);
        } else if (identifier.startsWith('penerima')) {
            setDataCarousel('penerima');
            setCurrentImageIndex(index);
            setIsModalOpen(true);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const URIImgMakanan = async (imageDataURIs) => {
        try {
            const uploadPromises = imageDataURIs.map(async (imageURI, index) => {
                const formData = new FormData();
                formData.append('destination', 'report');
                const blobImage = dataURItoBlob(imageURI);
                formData.append('file', blobImage, `photo_${index + 1}.jpg`);

                return axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}media/upload`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
            });

            const responses = await Promise.all(uploadPromises);
            const imgMakan = responses.map(response => response.data.body.file_url);
            return imgMakan;

        } catch (error) {
            console.error('Error uploading images:', error);
            throw error;
        }
    };

    // Fungsi untuk mengunggah gambar penerima
    const URIImgPenerima = async (imageDataURIs) => {
        try {
            const uploadPromises = imageDataURIs.map(async (imageURI, index) => {
                const formData = new FormData();
                formData.append('destination', 'report');
                const blobImage = dataURItoBlob(imageURI);
                formData.append('file', blobImage, `photo_${index + 1}.jpg`);

                return axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}media/upload`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
            });

            const responses = await Promise.all(uploadPromises);
            const imgPenerima = responses.map(response => response.data.body.file_url);
            return imgPenerima;

        } catch (error) {
            console.error('Error uploading images:', error);
            throw error;
        }
    };

    const handleAprovButtonClick = async () => {
        let images = [];
        setLoading(true);
        try {
            const FormMakanan = await URIImgMakanan(imgMakan);
            setUploadMakanan(FormMakanan);
            FormMakanan.forEach(url => {
                images.push({
                    type: 'food',
                    image_url: url
                });
            });

            const FormPenerima = await URIImgPenerima(imgPenerima);
            setUploadPenerima(FormPenerima);
            FormPenerima.forEach(url => {
                images.push({
                    type: 'transaction',
                    image_url: url
                });
            });

            if (images.length === 0) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'file gagal diunggah mohon coba lagi',
                    showConfirmButton: false,
                    timer: 1500
                });
                setLoading(false);
                return;
            } else {
                const reportBody = {
                    coupon_transaction_id: parseInt(id_order),
                    images: images
                };

                // Post the report to the coupon/report endpoint
                const responseReport = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}coupon/report`, reportBody, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (responseReport.data.code === 200) {
                    setLoading(false);
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'Report submitted successfully',
                        showConfirmButton: false,
                        timer: 1500
                    });
                    setTimeout(() => {
                        router.push('/merchant/kupon');
                    }, 1500);
                } else {
                    setLoading(false);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Failed to submit report',
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            }



            // Jika diperlukan, lakukan sesuatu dengan `images`, misalnya mengirimnya ke server
        } catch (error) {
            setLoading(false);
            Error401(error, router);
        }
    };
    const RemoveImageMakanan = (index, event) => {
        event.preventDefault();
        event.stopPropagation();
        const updatedImgMakan = imgMakan.filter((_, i) => i !== index);
        const updatedUploadMakanan = uploadMakanan.filter((_, i) => i !== index);

        // Update state
        setImgMakan(updatedImgMakan);
        setUploadMakanan(updatedUploadMakanan);

        // Update localStorage 
        localStorage.setItem('imgMakanan', JSON.stringify(updatedImgMakan));
    };
    const RemoveImagePenerima = (index, event) => {
        event.preventDefault();
        event.stopPropagation();
        const updatedImgPenerima = imgPenerima.filter((_, i) => i !== index);
        const updatedUploadPenerima = uploadPenerima.filter((_, i) => i !== index);
        setImgPenerima(updatedImgPenerima);
        setUploadPenerima(updatedUploadPenerima);
        localStorage.setItem('imgPenerima', JSON.stringify(updatedImgPenerima));
    };
    return (
        <>
            <div className="container mx-auto pt-14 bg-white overflow-hidden max-h-screen flex flex-col justify-center">
                <Header title="Detail Pesanan" backto={prevPath ? prevPath : ""} />

                {loading ? (
                    <div className="border border-blue-300 shadow rounded-md p-4 max-w-sm w-80 h-28 mx-auto">
                        <div className="animate-pulse flex space-x-4">
                            <div className="rounded-md bg-slate-200 h-16 w-16"></div>
                            <div className="flex-1 space-y-6 py-1">
                                <div className="h-2 bg-slate-200 rounded"></div>
                                <div className="space-y-3">
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                                        <div className="h-2 bg-slate-200 rounded col-span-1"></div>
                                    </div>
                                    <div className="h-2 bg-slate-200 rounded"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <CardKupon
                        key={dataApi?.id}
                        userRole="merchant"
                        total_tax={dataApi.total_tax * dataApi.qty}
                        to=""
                        idOrder={dataApi?.id}
                        img={`${process.env.NEXT_PUBLIC_URL_STORAGE}${dataApi?.merchant_product.images[0]}`}
                        title={dataApi?.merchant_product?.name}
                        desc={dataApi?.merchant_product.description}
                        date={moment(dataApi?.expired_at).format("DD MMM YYYY hh:mm")}
                        total_amount={dataApi?.total_amount}
                        status={dataApi?.status}
                        name_beneficiary={dataApi?.beneficiary?.fullname}
                    />
                )}
                <div className="px-[16px] flex flex-col h-screen justify-between">
                    {dataApi?.status === "active" ? (
                        <div>
                            <Link
                                href="/merchant/kupon/upload-bukti?makanan"
                                className="bg-gray-200 text-white rounded-md p-[16px] w-full border-2 border-primary flex justify-between mb-2"
                            >
                                <div className="w-[52px] h-[52px] bg-primary rounded-md flex justify-center items-center">
                                    <IconCamera size={20} />
                                </div>
                                {imgMakan.length > 0 ? (
                                    <div className="rounded-md flex justify-end my-auto min-w-[134px]">
                                        {imgMakan.map((item, index) => (
                                            <div key={index} className="relative">
                                                <img
                                                    onClick={(event) => openModal(`makan_${index}`, event)}
                                                    className="w-[52px] h-[52px] object-cover rounded-md mx-1"
                                                    src={item}
                                                    alt={`Makanan ${index + 1}`}
                                                />
                                                <button
                                                    className="absolute top-0 right-0 m-1 p-1 bg-white rounded-full cursor-pointer"
                                                    onClick={(event) => RemoveImageMakanan(index, event)}
                                                >
                                                    <IconX size={10} color="red" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-start my-auto w-[234px]">
                                        <p className="text-black text-[12px] font-bold">Foto Makanan yang Disajikan</p>
                                        <p className="text-primary text-[10px] font-bold">Minimal 2 foto</p>
                                    </div>
                                )}
                            </Link>

                            <Link
                                href="/merchant/kupon/upload-bukti?penerima"
                                className="bg-gray-200 text-white rounded-md p-[16px] w-full border-2 border-primary flex justify-between mb-2"
                            >
                                <div className="w-[52px] h-[52px] bg-primary rounded-md flex justify-center items-center">
                                    <IconCamera size={20} />
                                </div>
                                {imgPenerima.length > 0 ? (
                                    <div className="rounded-md flex justify-end my-auto min-w-[134px]">
                                        {imgPenerima.map((item, index) => (
                                            <div key={index} className="relative">
                                                <img
                                                    onClick={(event) => openModal(`penerima_${index}`, event)}
                                                    className="w-[52px] h-[52px] object-cover rounded-md mx-1"
                                                    src={item}
                                                    alt={`Penerima ${index + 1}`}
                                                />
                                                <button
                                                    className="absolute top-0 right-0 m-1 p-1 bg-white rounded-full cursor-pointer"
                                                    onClick={(event) => RemoveImagePenerima(index, event)}
                                                >
                                                    <IconX size={10} color="red" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-start my-auto w-[234px]">
                                        <p className="text-black text-[12px] font-bold">Foto Makanan dengan Penerima Manfaat</p>
                                        <p className="text-primary text-[10px] font-bold">Minimal 2 foto</p>
                                    </div>
                                )}
                            </Link>


                        </div>
                    ) : null}

                </div>
                <div className="w-full text-center my-6 absolute inset-x-0 bottom-0">
                    <button
                        disabled={imgMakan.length < 1 || imgPenerima.length < 2}
                        onClick={handleAprovButtonClick}
                        className={`${imgMakan.length < 1 || imgPenerima.length < 2 ? "bg-gray-300" : "bg-primary"
                            } text-white font-medium rounded-lg h-10 px-2`}
                    >
                        Pesanan Telah Selesai
                    </button>
                </div>
            </div>

            {loading && <Loading />}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Image Carousel"
                className="fixed inset-0 flex items-center justify-center p-4 bg-white rounded-lg shadow-lg outline-none max-w-4xl mx-auto"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50"
            >
                <button
                    className="absolute z-10 top-12 right-4 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-full focus:outline-none"
                    onClick={closeModal}
                >
                    Close
                </button>
                <Carousel selectedItem={currentImageIndex} className="w-full h-full">
                    {dataCarousel === "makan"
                        ? imgMakan.map((src, index) => (
                            <div key={index} className="flex justify-center items-center">
                                <img
                                    className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                                    src={src}
                                    alt={`Captured ${index + 1}`}
                                />
                            </div>
                        ))
                        : imgPenerima.map((src, index) => (
                            <div key={index} className="flex justify-center items-center">
                                <img
                                    className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                                    src={src}
                                    alt={`Captured ${index + 1}`}
                                />
                            </div>
                        ))}
                </Carousel>
            </Modal>
        </>
    );
};

export default pelaporan;

// {imgSrc.map((src, index) => (
//     <div key={index}>
//         <img
//             className={styles['img-carousel']}
//             src={src}
//             alt={`Captured ${index + 1}`}
//         />
//     </div>
// ))}

// {imgMakan.length > 0 ? (
//     imgMakan.map((src, index) => (
//         <div key={index}>
//             <img
//                 className='img-carousel'
//                 src={src}
//                 alt={`Captured ${index + 1}`}
//             />
//         </div>
//     ))
// ) : imgPenerima.length > 0 ? (
//     imgPenerima.map((src, index) => (
//         <div key={index}>
//             <img
//                 className='img-carousel'
//                 src={src}
//                 alt={`Captured ${index + 1}`}
//             />
//         </div>
//     ))
// ) : null}