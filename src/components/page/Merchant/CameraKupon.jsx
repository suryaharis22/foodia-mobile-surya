import moment from "moment";
import 'moment/locale/id';
import Modal from 'react-modal';
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import styles from './WebCam.module.css';
import { Carousel } from "react-responsive-carousel";
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Webcam from "react-webcam";
import { IconCamera, IconSquareRoundedX, IconX } from "@tabler/icons-react";
import Swal from "sweetalert2";

const CameraKupon = () => {
    const router = useRouter();
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const [imgSrc, setImgSrc] = useState([]);
    const [captureTime, setCaptureTime] = useState(null);
    const [captureCoordinates, setCaptureCoordinates] = useState(null);
    const [cameraDevices, setCameraDevices] = useState([]);
    const [selectedCamera, setSelectedCamera] = useState('');
    const [aspectRatio, setAspectRatio] = useState(9 / 16);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');

    // useEffect for camera selection and device enumeration
    useEffect(() => {
        const fetchCameraDevices = async () => {
            try {
                const devices = await navigator.mediaDevices.enumerateDevices();
                const videoDevices = devices.filter(device => device.kind === 'videoinput');
                setCameraDevices(videoDevices);

                // Prefer rear camera; fallback to the first camera if rear is unavailable
                const rearCamera = videoDevices.find(device => device.label.toLowerCase().includes('rear'));
                const frontCamera = videoDevices.find(device => device.label.toLowerCase().includes('front')) || videoDevices[0];
                setSelectedCamera(rearCamera ? rearCamera.deviceId : frontCamera.deviceId);
            } catch (error) {
                console.error('Error enumerating devices:', error);
            }
        };

        fetchCameraDevices();
    }, []);

    // useEffect for location and timestamp on load
    useEffect(() => {
        const fetchLocationAndTime = () => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setCaptureCoordinates({
                        latitude,
                        longitude
                    });
                },
                (error) => {
                    console.error('Error getting geolocation:', error);
                    setCaptureCoordinates('Default Coordinates');
                }
            );

            setCaptureTime(moment().format('YYYY-MM-DD HH:mm:ss'));
        };

        fetchLocationAndTime();
    }, [imgSrc]);

    const handleCameraChange = (event) => {
        const newCamera = event.target.value;
        setSelectedCamera(newCamera);
        console.log("Selected camera ID:", newCamera); // Log the updated camera selection immediately
    };

    useEffect(() => {
        let storedImages = [];
        if (router.asPath === '/merchant/kupon/upload-bukti?penerima') {
            storedImages = JSON.parse(localStorage.getItem('imgPenerima')) || [];
        } else if (router.asPath === '/merchant/kupon/upload-bukti?makanan') {
            storedImages = JSON.parse(localStorage.getItem('imgMakanan')) || [];
        }
        setImgSrc(storedImages);
    }, []);


    const capture = React.useCallback(() => {
        let minPhotos = 0;
        let maxPhotos = 0;

        if (router.asPath === '/merchant/kupon/upload-bukti?penerima') {
            minPhotos = 1;
            maxPhotos = 3;
        } else if (router.asPath === '/merchant/kupon/upload-bukti?makanan') {
            minPhotos = 2;
            maxPhotos = 4;
        }

        if (imgSrc.length < maxPhotos) {
            if (webcamRef.current) {
                const imageSrc = webcamRef.current.getScreenshot();

                if (imageSrc) {
                    const img = new Image();
                    img.onload = () => {
                        // Tentukan rasio aspek gambar asli
                        const aspectRatio = img.width / img.height;

                        // Tentukan ukuran dengan menjaga rasio aspek untuk portrait
                        const desiredHeight = 667; // Tinggi yang diinginkan (portrait)
                        const desiredWidth = desiredHeight * aspectRatio; // Lebar disesuaikan dengan rasio

                        // Buat canvas dengan ukuran baru
                        const canvas = document.createElement('canvas');
                        const context = canvas.getContext('2d');
                        canvas.width = desiredWidth;
                        canvas.height = desiredHeight;

                        // Gambar ulang gambar dari webcam dengan ukuran yang ditentukan
                        context.drawImage(img, 0, 0, desiredWidth, desiredHeight);

                        // Siapkan teks untuk watermark
                        const timeText = `Time: ${captureTime}`;
                        const latitudeText = `Latitude: ${captureCoordinates?.latitude}`;
                        const longitudeText = `Longitude: ${captureCoordinates?.longitude}`;

                        // Fungsi untuk menggambar teks dengan pembungkusan
                        const drawWrappedText = (text, x, y, maxWidth) => {
                            const words = text.split(' ');
                            let line = '';

                            for (let n = 0; n < words.length; n++) {
                                const testLine = line + words[n] + ' ';
                                const metrics = context.measureText(testLine);
                                const testWidth = metrics.width;

                                if (testWidth > maxWidth && n > 0) {
                                    context.fillText(line, x, y);
                                    line = words[n] + ' ';
                                    y += 30; // Ganti 30 dengan jarak antar baris yang diinginkan
                                } else {
                                    line = testLine;
                                }
                            }
                            context.fillText(line, x, y);
                        };

                        const padding = 10; // Padding di sekitar teks
                        const backgroundHeight = 120; // Tinggi latar belakang untuk menampung semua teks
                        const maxTextWidth = desiredWidth - padding * 2; // Maksimal lebar teks

                        // Tambahkan latar belakang untuk watermark dengan opasitas 50%
                        context.fillStyle = 'rgba(128, 128, 128, 0.5)';
                        context.fillRect(5, canvas.height - backgroundHeight - 10, maxTextWidth, backgroundHeight); // Persegi panjang sebagai latar belakang

                        // Atur font dan warna
                        context.font = '24px Arial';
                        context.fillStyle = 'black'; // Warna teks hitam

                        // Gambar semua teks dengan pembungkusan
                        drawWrappedText(timeText, 10, canvas.height - 90, maxTextWidth); // Positioning for time text
                        drawWrappedText(latitudeText, 10, canvas.height - 60, maxTextWidth); // Positioning for latitude
                        drawWrappedText(longitudeText, 10, canvas.height - 30, maxTextWidth); // Positioning for longitude

                        // Simpan hasil gambar dengan watermark
                        const imageWithWatermark = canvas.toDataURL('image/jpeg');
                        setImgSrc(prevImgSrc => {
                            const newImgSrc = [...prevImgSrc, imageWithWatermark];
                            return newImgSrc;
                        });
                    };

                    img.src = imageSrc;
                }
            }
        } else {
            setErrorMessage(`You can only capture up to ${maxPhotos} photos.`);
        }
    }, [webcamRef, setImgSrc, captureTime, captureCoordinates, router.asPath, imgSrc.length]);

    const handleUpload = () => {
        let minPhotos = 0;
        let maxPhotos = 0;
        let storageKey = '';

        if (router.asPath === '/merchant/kupon/upload-bukti?penerima') {
            minPhotos = 2;
            maxPhotos = 4;
            storageKey = 'imgPenerima';
        } else if (router.asPath === '/merchant/kupon/upload-bukti?makanan') {
            minPhotos = 1;
            maxPhotos = 4;
            storageKey = 'imgMakanan';
        }

        if (imgSrc.length >= minPhotos && imgSrc.length <= maxPhotos) {
            localStorage.setItem(storageKey, JSON.stringify(imgSrc));
            router.back();
            setErrorMessage('');
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please capture at least ' + minPhotos + ' photos.',
            });
            return;
        }
    };

    const handleClose = () => {
        router.back();
    };

    const openModal = (index) => {
        setCurrentImageIndex(index);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const RemoveImage = (index) => {
        const newImages = [...imgSrc];
        newImages.splice(index, 1);
        setImgSrc(newImages);
        if (router.asPath === '/merchant/kupon/upload-bukti?makanan') {
            localStorage.setItem('imgMakanan', JSON.stringify(newImages));
        } else if (router.asPath === '/merchant/kupon/upload-bukti?penerima') {
            localStorage.setItem('imgPenerima', JSON.stringify(newImages));
        }
    };

    const getInstructionText = () => {

        if (errorMessage) {
            return (
                <>
                    <p className="mb-10 bg-opacity-50 bg-gray-500 text-red-500 rounded-lg ">Anda telah mengambil lebih dari 4 foto.</p>
                    {/* <IconMoodConfuzed className="w-6 h-6 text-white" /> */}
                </>
            );
        }

        return "";
    };

    return (
        <>
            <div className="flex justify-between items-center  px-2">
                <div className="flex items-center">
                    <label htmlFor="camera-select" className="mr-1">Kamera:</label>
                    <select
                        id="camera-select"
                        className="ml-2 border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        onChange={handleCameraChange}
                        value={selectedCamera}
                    >
                        {cameraDevices.map((device, index) => (
                            <option key={device.deviceId} value={device.deviceId}>
                                {device.label || `Camera ${index + 1}`}
                            </option>
                        ))}
                    </select>
                </div>
                <button
                    className="bg-red-600 hover:bg-red-700 text-white font-bold rounded-full p-2 transform transition-transform duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-500"
                    onClick={handleClose}
                >
                    <IconSquareRoundedX />
                </button>
            </div>


            <div className="relative w-full max-w-4xl h-[600px] bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                <Webcam
                    ref={webcamRef}
                    audio={false}
                    mirrored={selectedCamera && cameraDevices.find(device => device.deviceId === selectedCamera)?.label.toLowerCase().includes('front')}
                    className="absolute top-0 left-0 w-full h-full object-cover"
                    key={selectedCamera}
                    screenshotFormat="image/jpeg"
                    videoConstraints={{
                        deviceId: selectedCamera ? { exact: selectedCamera } : undefined,
                        aspectRatio: aspectRatio,
                    }}
                />
                <canvas
                    ref={canvasRef}
                    className="absolute top-0 left-0 w-full h-full"
                />
                {/* Instruction Message */}
                <div className="absolute bottom-[-45px] left-0 right-0 flex  items-center justify-center p-4 font-bold">

                    <button className="mb-10 bg-gray-500  p-5 rounded-full" onClick={capture}>
                        <IconCamera />
                    </button>
                </div>
                {imgSrc.length > 0 && (
                    <div className="absolute bottom-[-70px] left-52 right-0 flex flex-col items-center justify-center p-4 font-bold">
                        <button className="mb-10  bg-primary text-white rounded-lg py-1 px-5" onClick={handleUpload}>
                            Upload
                        </button>
                        <img src="./face_right.png" alt="" className="mt-10 opacity-50 animate-pulse transform transition duration-500 ease-in-out scale-110" />
                    </div>

                )}

                <div className="absolute bottom-[80px] left-0 right-0 flex items-center justify-center p-1">
                    <div className={`flex w-[375px]  rounded-lg justify-center items-center bg-transparent overflow-x-scroll`}>
                        {imgSrc.slice(0, 4).map((src, index) => (
                            <div key={index} className="relative" onClick={() => openModal(index)}>
                                <img
                                    className={`w-[80px] h-[80px] rounded-lg object-cover mx-1`}
                                    src={src}
                                    alt={`Captured ${index + 1}`}
                                />
                                <button
                                    className="absolute top-0 right-0 m-1 p-1 bg-white rounded-full cursor-pointer"
                                    onClick={(event) => {
                                        event.stopPropagation(); // Prevents triggering the onClick for the image
                                        RemoveImage(index);
                                    }}
                                >
                                    <IconX size={16} color="red" />
                                </button>
                            </div>
                        ))}

                    </div>
                </div>

                <div className="absolute top-4 left-0 right-0 flex flex-col items-center justify-center p-4 font-bold">
                    {getInstructionText()}
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Image Carousel"
                className="fixed inset-0 flex items-center justify-center p-4 bg-white rounded-lg shadow-lg outline-none max-w-4xl mx-auto"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50"
            >
                {/* Close Button */}
                <button
                    className="absolute z-10 top-4 right-4 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-full focus:outline-none"
                    onClick={closeModal}
                >
                    Close
                </button>

                {/* Carousel */}
                <Carousel selectedItem={currentImageIndex} className="w-full h-full">
                    {imgSrc.map((src, index) => (
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

export default CameraKupon;
