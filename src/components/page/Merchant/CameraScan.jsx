import { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import jsQR from 'jsqr';
import axios from 'axios';
import { useRouter } from 'next/router';
import { IconSquareRoundedX, IconCameraRotate } from '@tabler/icons-react';
import Swal from 'sweetalert2';
import Loading from '@/components/Loading';

const CameraScan = () => {
    const router = useRouter();
    const webcamRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [cameraDevices, setCameraDevices] = useState([]);
    const [selectedCamera, setSelectedCamera] = useState('');
    const [processedCodes, setProcessedCodes] = useState(new Set());

    useEffect(() => {
        const fetchCameraDevices = async () => {
            try {
                const devices = await navigator.mediaDevices.enumerateDevices();
                const videoDevices = devices.filter(device => device.kind === 'videoinput');
                setCameraDevices(videoDevices);

                // Prefer rear camera; fallback to front if unavailable
                const rearCamera = videoDevices.find(device => device.label.toLowerCase().includes('rear'));
                const frontCamera = videoDevices.find(device => device.label.toLowerCase().includes('front')) || videoDevices[0];
                setSelectedCamera(rearCamera ? rearCamera.deviceId : frontCamera.deviceId);
                setLoading(false);
            } catch (error) {
                console.error('Error enumerating devices:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Could not access camera devices. Please enable camera permissions.',
                }).then(() => {
                    router.back(); // Navigate back if permission is denied
                });
                setLoading(false);
            }
        };

        fetchCameraDevices();
    }, []);

    const handleCameraChange = (event) => {
        const newCamera = event.target.value;
        setSelectedCamera(newCamera);
        console.log("Selected camera ID:", newCamera);
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
    }, [processedCodes, selectedCamera]);

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
                console.log("Scanned code:", code.data);
                PostCode(qrCode);
            }
        };

        img.src = imageSrc;
    };

    const PostCode = (code) => {
        console.log("Scanned code:", code);

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
                    console.error("Error scanning QR code:", response);
                }
            })
            .catch((error) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed QR Code expired',
                    timer: 2000,
                })
            });
    };

    return (
        <div className="w-full flex flex-col items-center bg-white h-screen">
            <div className="flex justify-between items-center w-full px-2 my-2">
                <h1>QR Code Scanner</h1>
                <button onClick={() => router.back()} className="bg-[#DE0606] rounded-md p-1 font-bold flex items-center justify-center cursor-pointer">
                    <IconSquareRoundedX size={15} className="text-black" />
                </button>
            </div>
            <div className="bg-gray-300 p-2 rounded-md flex flex-col justify-center mt-2">
                {loading ? (
                    <Loading />
                ) : (
                    <>
                        <Webcam
                            audio={false}
                            ref={webcamRef}
                            width={320}
                            height={320}
                            screenshotFormat="image/jpeg"
                            videoConstraints={{ deviceId: selectedCamera ? { exact: selectedCamera } : undefined }}
                        />
                        <select onChange={handleCameraChange} value={selectedCamera} className="my-2 p-2 bg-white text-black rounded-md">
                            {cameraDevices.map((device, index) => (
                                <option key={index} value={device.deviceId}>
                                    {device.label || `Camera ${index + 1}`}
                                </option>
                            ))}
                        </select>
                    </>
                )}
            </div>
        </div>
    );
};

export default CameraScan;
