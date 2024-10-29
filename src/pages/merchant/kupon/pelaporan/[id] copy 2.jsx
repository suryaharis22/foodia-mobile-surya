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
    const [uploadLodingMakan, setUploadLodingMakan] = useState(false);
    const [uploadLodingPenerima, setUploadLodingPenerima] = useState(false);
    const [location, setLocation] = useState({ lat: null, lon: null });

    useEffect(() => {
        let intervalId;

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        lat: position.coords.latitude,
                        lon: position.coords.longitude
                    });
                },
                (error) => {
                    console.error('Gagal mendapatkan lokasi:', error);
                }
            );

            intervalId = setInterval(() => {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        setLocation({
                            lat: position.coords.latitude,
                            lon: position.coords.longitude
                        });
                    },
                    (error) => {
                        console.error('Gagal mendapatkan lokasi:', error);
                    }
                );
            }, 5000); // 5000 ms = 5 detik
        } else {
            console.error('Geolocation tidak didukung oleh browser ini.');
        }

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        const storedImgMakan = localStorage.getItem('imgMakanan');
        const storedImgPenerima = localStorage.getItem('imgPenerima');
        if (storedImgMakan) {
            setImgMakan(JSON.parse(storedImgMakan));
        }
        if (storedImgPenerima) {
            setImgPenerima(JSON.parse(storedImgPenerima));
        }
    }, []);

    // Sinkronisasi imgMakan dengan localStorage setiap kali imgMakan berubah
    useEffect(() => {
        if (imgMakan.length > 0) {
            localStorage.setItem('imgMakanan', JSON.stringify(imgMakan));
        }
        if (imgPenerima.length > 0) {
            localStorage.setItem('imgPenerima', JSON.stringify(imgPenerima));
        }
    }, [imgMakan, imgPenerima]);

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


    const handleFileImageMakan = async (event) => {
        const files = Array.from(event.target.files);

        setUploadLodingMakan(true);

        try {
            const newWatermarkedImages = await Promise.all(
                files.map(async (file) => {
                    const date = new Date();
                    const timestamp = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
                    const coordinates = `Lat: ${location?.lat || 'N/A'}, Lon: ${location?.lon || 'N/A'}`;
                    const watermarkText = `${timestamp}\n${coordinates}`;

                    const watermarkedImageUrl = await addWatermark(file, watermarkText);

                    return {
                        original: file,
                        watermarkedUrl: watermarkedImageUrl,
                    };
                })
            );

            // Gabungkan gambar baru dengan gambar yang sudah ada di imgMakan
            setImgMakan((prevImgMakan) => [...prevImgMakan, ...newWatermarkedImages]);

        } catch (error) {
            console.error('Proses watermark gagal:', error);
        } finally {
            setUploadLodingMakan(false);
        }
    };

    const handleFileImagePenerima = async (event) => {
        const files = Array.from(event.target.files);

        setUploadLodingMakan(true);

        try {
            const newWatermarkedImages = await Promise.all(
                files.map(async (file) => {
                    const date = new Date();
                    const timestamp = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
                    const coordinates = `Lat: ${location?.lat || 'N/A'}, Lon: ${location?.lon || 'N/A'}`;
                    const watermarkText = `${timestamp}\n${coordinates}`;

                    const watermarkedImageUrl = await addWatermark(file, watermarkText);

                    return {
                        original: file,
                        watermarkedUrl: watermarkedImageUrl,
                    };
                })
            );

            // Gabungkan gambar baru dengan gambar yang sudah ada di imgMakan
            setImgPenerima((prevImgPenerima) => [...prevImgPenerima, ...newWatermarkedImages]);

        } catch (error) {
            console.error('Proses watermark gagal:', error);
        } finally {
            setUploadLodingMakan(false);
        }
    };

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

    const addWatermark = (image, watermarkText) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async (event) => {
                const imgElement = new Image();
                imgElement.src = event.target.result;

                imgElement.onload = async () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    canvas.width = imgElement.width;
                    canvas.height = imgElement.height;

                    // Gambar utama
                    ctx.drawImage(imgElement, 0, 0);

                    // Memuat watermark gambar dari public/fda.png
                    const watermarkImage = new Image();
                    watermarkImage.src = '/fda.png';

                    watermarkImage.onload = () => {
                        //mengatur ukuran watermark
                        const watermarkWidth = 100;
                        // const watermarkHeight = 50;
                        // Tinggi dihitung otomatis berdasarkan aspek rasio
                        const aspectRatio = watermarkImage.width / watermarkImage.height;
                        const watermarkHeight = watermarkWidth / aspectRatio;

                        // Posisi watermark gambar (pojok kiri atas)
                        const xImage = 10;
                        const yImage = 10;

                        ctx.drawImage(watermarkImage, xImage, yImage, watermarkWidth, watermarkHeight);

                        // Menambahkan teks watermark
                        const lines = watermarkText.split('\n');
                        // Ukuran font dalam px
                        const fontSize = 12;
                        ctx.font = `${fontSize}px Arial`;
                        ctx.fillStyle = 'black';
                        ctx.textAlign = 'right';
                        ctx.textBaseline = 'bottom';

                        lines.forEach((line, index) => {
                            ctx.fillText(line, canvas.width - 10, canvas.height - 10 - (fontSize * index));
                        });

                        canvas.toBlob((blob) => {
                            const url = URL.createObjectURL(blob);
                            resolve(url);
                        }, 'image/jpeg');
                    };

                    watermarkImage.onerror = () => {
                        reject('Failed to load watermark image');
                    };
                };
            };

            reader.onerror = () => {
                reject('Failed to read the image file');
            };

            reader.readAsDataURL(image);
        });
    };


    const RemoveImageMakanan = (index, event) => {
        event.preventDefault();
        event.stopPropagation();
        const updatedImgMakan = imgMakan.filter((_, i) => i !== index);
        // const updatedUploadMakanan = uploadMakanan.filter((_, i) => i !== index);

        // Update state
        setImgMakan(updatedImgMakan);
        // setUploadMakanan(updatedUploadMakanan);

        // Update localStorage 
        localStorage.setItem('imgMakanan', JSON.stringify(updatedImgMakan));
    };

    const RemoveImagePenerima = (index, event) => {
        event.preventDefault();
        event.stopPropagation();
        const updatedImgPenerima = imgPenerima.filter((_, i) => i !== index);
        // const updatedUploadMakanan = uploadMakanan.filter((_, i) => i !== index);

        // Update state
        setImgPenerima(updatedImgPenerima);
        // setUploadMakanan(updatedUploadMakanan);

        // Update localStorage 
        localStorage.setItem('imgPenerima', JSON.stringify(updatedImgPenerima));
    };

    const fetchBlobFromUrl = async (url) => {
        const response = await fetch(url);
        return await response.blob();
    };

    const uploadImages = async (imageData, type) => {
        try {
            const uploadPromises = imageData.map(async (image, index) => {
                const formData = new FormData();
                formData.append('destination', 'report');

                // Ambil Blob dari URL Blob
                const blobImage = await fetchBlobFromUrl(image.watermarkedUrl);
                formData.append('file', blobImage, `photo_${index + 1}.jpg`);

                const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}media/upload`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });

                return {
                    type,
                    image_url: response.data.body.file_url,
                };
            });

            return await Promise.all(uploadPromises);
        } catch (error) {
            console.error('Error uploading images:', error);
            throw error;
        }
    };

    const handleAprovButtonClick = async () => {
        setLoading(true);
        try {
            // Unggah gambar makanan
            const uploadedMakanImages = await uploadImages(imgMakan, 'food');

            // Unggah gambar penerima
            const uploadedPenerimaImages = await uploadImages(imgPenerima, 'transaction');

            // Gabungkan semua gambar yang diunggah
            const images = [...uploadedMakanImages, ...uploadedPenerimaImages];

            if (images.length === 0) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'File gagal diunggah, mohon coba lagi',
                    showConfirmButton: false,
                    timer: 1500
                });
                setLoading(false);
                return;
            }

            const reportBody = {
                coupon_transaction_id: parseInt(id_order),
                images: images
            };

            // Kirim laporan ke endpoint coupon/report
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
        } catch (error) {
            setLoading(false);
            console.error('Error uploading images or submitting report:', error);
            Error401(error, router);
        }
    };


    return (
        <>
            <div className="container mx-auto pt-14 bg-white overflow-hidden max-h-screen" >
                <Header title="Detail Pesanan" backto={prevPath ? prevPath : ""} />
                <div className="">
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
                            to={""}
                            idOrder={dataApi?.id}
                            img={`${process.env.NEXT_PUBLIC_URL_STORAGE}${dataApi?.merchant_product.images[0]}`}
                            title={dataApi?.merchant_product?.name}
                            desc={dataApi?.merchant_product.description}
                            date={moment(dataApi?.expired_at).format(
                                "DD MMM YYYY hh:mm"
                            )}
                            total_amount={dataApi?.total_amount}
                            status={dataApi?.status}
                            name_beneficiary={dataApi?.beneficiary?.fullname}
                        />
                    )}

                    {loading ? (
                        <>
                            <div className="p-2 rounded-md mt-2 px-4 animate-pulse">
                                {/* <h5 className="text-xs mb-1 font-bold">Rangkuman Pesanan</h5> */}
                                <div className="justify-between grid grid-cols-2 gap-2 ">
                                    <div className="text-sm text-gray-400 bg-gray-300 h-4 rounded"></div>
                                    <div className="text-right text-sm bg-gray-300 h-4 rounded"></div>
                                    <div className="text-sm text-gray-400 bg-gray-300 h-4 rounded"></div>
                                    <div className="text-right text-sm text-primary bg-gray-300 h-4 rounded"></div>
                                    <div className="text-sm text-gray-400 bg-gray-300 h-4 rounded"></div>
                                    <div className="text-right text-sm text-primary bg-gray-300 h-4 rounded"></div>
                                </div>

                                <hr className="h-px bg-gray-200 border-0 mt-2" />
                                <div className="justify-between grid grid-cols-2 gap-2 py-4">
                                    <div className="text-sm text-gray-400 bg-gray-300 h-4 rounded"></div>
                                    <div className="text-right text-sm bg-gray-300 h-4 rounded"></div>
                                    <div className="text-sm text-gray-400 bg-gray-300 h-4 rounded"></div>
                                    <div className="text-right text-sm bg-gray-300 h-4 rounded"></div>
                                </div>

                                <hr className="h-px bg-gray-200 border-0" />
                                <div className="justify-between grid grid-cols-2 gap-2 py-4">
                                    <div className="text-sm text-gray-400 bg-gray-300 h-4 rounded"></div>
                                    <div className="text-right text-sm bg-gray-300 h-4 rounded"></div>
                                </div>
                                <hr className="h-px bg-gray-200 border-0" />
                                <div className="justify-between grid grid-cols-2 gap-2 py-4">
                                    <div className="text-sm text-gray-400 bg-gray-300 h-4 rounded"></div>
                                    <div className="flex gap-4">
                                        <div className="text-right text-sm bg-gray-300 h-4 rounded"></div>
                                        <a
                                            href="#"
                                            className="text-sm font-normal mb-12 text-red-500 bg-gray-300 h-4 rounded"
                                        ></a>
                                    </div>
                                </div>
                                <hr className="h-px bg-gray-200 border-0" />
                                <div className="justify-between grid grid-cols-2 gap-2 py-4">
                                    <div className="text-sm text-gray-400 bg-gray-300 h-4 rounded"></div>
                                    <div className="text-right text-sm bg-gray-300 h-4 rounded"></div>
                                </div>
                                <hr className="h-px bg-gray-200 border-0" />
                                <div className="py-4">
                                    <div className="text-sm text-gray-400 bg-gray-300 h-4 rounded"></div>
                                    <div className="font-normal mt-2 text-sm bg-gray-300 h-6 rounded"></div>
                                </div>
                            </div>
                            <div className=" h-20 bottom-0 my-0 p-2rounded-md mt-2 mx-2 grid grid-cols-2 gap-4 place-content-center">
                                <div
                                    className={`bg-gray-200 text-white rounded-md h-10 w-full col-span-2`}
                                >
                                    --
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="px-[16px] flex flex-col h-screen justify-between">
                            {dataApi?.status === "active" ? (
                                <>
                                    <div className="">


                                        <label for="makanan" className=" cursor-pointer bg-gray-200 text-white rounded-md p-[16px] w-full border-2 border-primary flex justify-between mb-2">
                                            <div className="w-[52px] h-[52px] bg-primary rounded-md flex justify-center items-center"><IconCamera size={20} /></div>
                                            {imgMakan.length > 0 ? (
                                                <>
                                                    {imgMakan.length < 1 && (
                                                        <div className="flex flex-col items-center my-auto w-[100px]">
                                                            <p className="text-red-500 text-[10px] font-bold">Minimal 2 foto</p>
                                                        </div>
                                                    )}
                                                    <div className="rounded-md flex justify-end my-auto min-w-[134px]">

                                                        <div className="relative rounded-md my-auto flex">
                                                            {imgMakan.map((item, index) => (
                                                                <div key={index} className="relative">
                                                                    <img
                                                                        onClick={(event) => openModal(`makan_${index}`, event)}
                                                                        className="w-[52px] h-[52px] object-cover rounded-md mx-1"
                                                                        src={item.watermarkedUrl}
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
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="flex flex-col items- my-auto w-[234px]">
                                                    <p className="text-black text-[12px] font-bold">Foto Makanan yang Disajikan</p>
                                                    <p className="text-primary text-[10px] font-bold">Minimal 2 foto</p>
                                                </div>
                                            )}
                                            <input type="file" multiple id="makanan" className="hidden" onChange={handleFileImageMakan} />
                                        </label>

                                        <label for="penerima" className=" cursor-pointer bg-gray-200 text-white rounded-md p-[16px] w-full border-2 border-primary flex justify-between mb-2">
                                            <div className="w-[52px] h-[52px] bg-primary rounded-md flex justify-center items-center"><IconCamera size={20} /></div>
                                            {imgPenerima.length > 0 ? (
                                                <>
                                                    {imgPenerima.length < 1 && (
                                                        <div className="flex flex-col items-center my-auto w-[100px]">
                                                            <p className="text-red-500 text-[10px] font-bold">Minimal 2 foto</p>
                                                        </div>
                                                    )}
                                                    <div className="rounded-md flex justify-end my-auto min-w-[134px]">

                                                        <div className="relative rounded-md my-auto flex">
                                                            {imgPenerima.map((item, index) => (
                                                                <div key={index} className="relative">
                                                                    <img
                                                                        onClick={(event) => openModal(`penerima_${index}`, event)}
                                                                        className="w-[52px] h-[52px] object-cover rounded-md mx-1"
                                                                        src={item.watermarkedUrl}
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
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="flex flex-col items- my-auto w-[234px]">
                                                    <p className="text-black text-[12px] font-bold">Foto Makanan dengan Penerima Manfaat</p>
                                                    <p className="text-primary text-[10px] font-bold">Minimal 2 foto</p>
                                                </div>
                                            )}
                                            <input type="file" multiple id="penerima" className="hidden" onChange={handleFileImagePenerima} />
                                        </label>


                                    </div>
                                    <div className="w-full text-center my-2 mb-52">
                                        <button
                                            disabled={imgMakan.length < 1 || imgPenerima.length < 2}
                                            onClick={handleAprovButtonClick}
                                            className={`${imgMakan.length < 1 || imgPenerima.length < 2 ? "bg-gray-300" : "bg-primary"}  text-white font-medium rounded-lg h-10 px-2`}
                                        >
                                            Pesanan  Telah Selesai
                                        </button>
                                    </div>


                                </>
                            )
                                // : dataApi?.order_status === "claimed" ? (
                                //     <>
                                //         <button
                                //             onClick={handleAprovButtonClick}
                                //             className="bg-primary border-2 border-primary text-white font-medium rounded-xl h-10"
                                //         >
                                //             Pesana  Telah Selesai
                                //         </button>
                                //     </>

                                // ) 
                                : null}
                        </div>
                    )}


                </div>
                {loading && <Loading />}
                <Modal
                    isOpen={isModalOpen}
                    onRequestClose={closeModal}
                    contentLabel="Image Carousel"
                    className='modal'
                    overlayClassName='overlay'
                >
                    <button className='close-modal-button' onClick={closeModal}>Close</button>
                    <Carousel selectedItem={currentImageIndex}>
                        {dataCarousel === "makan" ? imgMakan.map((src, index) => (
                            <div key={index}>
                                <img
                                    className='img-carousel'
                                    src={src.watermarkedUrl}
                                    alt={`Captured ${index + 1}`}
                                />
                            </div>
                        )) : imgPenerima.map((src, index) => (
                            <div key={index}>
                                <img
                                    className='img-carousel'
                                    src={src.watermarkedUrl}
                                    alt={`Captured ${index + 1}`}
                                />
                            </div>
                        ))}

                    </Carousel>
                </Modal>
            </div>

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