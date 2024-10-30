import { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import jsQR from 'jsqr';
import axios from 'axios';
import Error401 from '@/components/error401';
import { useRouter } from 'next/router';
import { IconSquareRoundedX, IconCameraRotate } from '@tabler/icons-react';
import Swal from 'sweetalert2';
import Loading from '@/components/Loading';

const CameraScan = () => {
    const router = useRouter();
    const webcamRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [facingMode, setFacingMode] = useState("environment");
    const [processedCodes, setProcessedCodes] = useState(new Set());

    useEffect(() => {
        // Request camera access permission when the component is mounted
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(() => setLoading(false))
            .catch((error) => {
                console.error('Permission denied or not supported:', error);
                setLoading(false);
                Swal.fire({
                    icon: 'error',
                    title: 'Akses kamera ditolak',
                    text: 'Mohon aktifkan akses kamera browser Anda.',
                }).then(() => {
                    router.back(); // Navigate back if permission is denied
                });
            });
    }, []);

    // Handle camera toggle between front and back
    const toggleCamera = () => {
        setFacingMode((prevMode) => (prevMode === "environment" ? "user" : "environment"));
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (webcamRef.current) {
                const imageSrc = webcamRef.current.getScreenshot();
                if (imageSrc) {
                    processQRCode(imageSrc);
                }
            }
        }, 1000); // Check every second

        return () => clearInterval(interval);
    }, [processedCodes]);

    const processQRCode = (imageSrc) => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            context.drawImage(img, 0, 0, img.width, img.height);
            const imageData = context.getImageData(0, 0, img.width, img.height);
            const code = jsQR(imageData.data, img.width, img.height);

            if (code) {
                const qrCode = code.data;
                if (!processedCodes.has(qrCode)) {
                    setProcessedCodes(prev => new Set(prev).add(qrCode));
                    PostCode(qrCode);
                }
            }
        };

        img.src = imageSrc;
    };

    const PostCode = (code) => {
        axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}coupon/scan`, { qr_code: code }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
            .then((response) => {
                if (response.status === 200) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'QR Code Scanned Successfully',
                        timer: 2000,
                    }).then(() => {
                        router.push('/merchant/kupon');
                    });
                } else {
                    Error401(response, router);
                }
            })
            .catch((error) => {
                Error401(error, router);
            });
    };

    return (
        <div className="w-full flex flex-col items-center bg-white h-screen">
            <div className="flex justify-between items-center w-full px-2 my-2">
                <h1>QR Code Scanner</h1>
                <div onClick={() => router.back()} className="bg-[#DE0606] rounded-md p-1 font-bold flex items-center justify-center cursor-pointer">
                    <IconSquareRoundedX size={15} className="text-black" />
                </div>
            </div>
            <div className="bg-gray-300 p-2 rounded-md">
                {loading ? (
                    <Loading />
                ) : (
                    <Webcam
                        audio={false}
                        ref={webcamRef}
                        width={320}
                        height={320}
                        screenshotFormat="image/jpeg"
                        videoConstraints={{ facingMode }}
                    />
                )}
            </div>
            <button
                onClick={toggleCamera}
                className="my-2 p-2 bg-blue-500 text-white rounded-md flex items-center focus:outline-none"
            >
                <IconCameraRotate size={20} className="mr-2" />
                Switch Camera
            </button>
        </div>
    );
};

export default CameraScan;
