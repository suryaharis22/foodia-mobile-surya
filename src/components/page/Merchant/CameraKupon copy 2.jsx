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
    const [imgSrc, setImgSrc] = useState([]);
    const [captureTime, setCaptureTime] = useState(null);
    const [captureCoordinates, setCaptureCoordinates] = useState(null);
    const [cameraDevices, setCameraDevices] = useState([]);
    const [selectedCamera, setSelectedCamera] = useState('');
    const [aspectRatio, setAspectRatio] = useState(16 / 9);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchCameraAndLocation = async () => {
            try {
                const devices = await navigator.mediaDevices.enumerateDevices();
                const videoDevices = devices.filter(device => device.kind === 'videoinput');
                setCameraDevices(videoDevices);

                // Prioritize rear camera, fallback to front camera if rear is not found
                const rearCamera = videoDevices.find(device => device.label.toLowerCase().includes('rear'));
                const frontCamera = videoDevices.find(device => device.label.toLowerCase().includes('front')) || videoDevices[0];

                if (rearCamera) {
                    setSelectedCamera(rearCamera.deviceId);
                } else {
                    setSelectedCamera(frontCamera.deviceId);
                }
            } catch (error) {
                console.error('Error enumerating devices:', error);
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setCaptureCoordinates(`${latitude}\n${longitude}`);
                },
                (error) => {
                    console.error('Error getting geolocation:', error);
                    setCaptureCoordinates('Default Coordinates');
                }
            );

            setCaptureTime(moment().format('YYYY-MM-DD HH:mm:ss'));
        };

        fetchCameraAndLocation();
    }, [captureTime, captureCoordinates]);

    useEffect(() => {
        const handleResize = () => {
            setAspectRatio(window.innerWidth <= 768 ? 4 / 3 : 16 / 9);
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

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
                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');

                    const img = new Image();
                    img.onload = () => {
                        canvas.width = img.width;
                        canvas.height = img.height;

                        context.drawImage(img, 0, 0);

                        context.font = '24px Arial';
                        context.fillStyle = 'rgba(255, 255, 255, 0.5)';
                        context.fillText(`Time: ${captureTime}`, 10, canvas.height - 60);
                        context.fillText(`Coordinates: ${captureCoordinates}`, 10, canvas.height - 20);

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

    const handleClose = () => {
        router.back();
    };

    const handleCameraChange = (event) => {
        setSelectedCamera(event.target.value);
    };

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

    const videoConstraints = {
        deviceId: selectedCamera ? { exact: selectedCamera } : undefined,
        aspectRatio: aspectRatio,
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

    return (
        <>
            <div className={styles['camera-select-container']}>
                <div className={styles['camera-select-group']}>
                    <label htmlFor="camera-select">Kamera:</label>
                    <select id="camera-select" className={styles['camera-select']} onChange={handleCameraChange} value={selectedCamera}>
                        {cameraDevices.map((device, index) => (
                            <option key={index} value={device.deviceId}>{device.label || `Camera ${index + 1}`}</option>
                        ))}
                    </select>
                </div>
                <div className={styles['close-button']} onClick={handleClose}><IconSquareRoundedX /></div>
            </div>

            <div className={styles.cameraPreview}>
                <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    width={360}
                    height={1000}
                    videoConstraints={videoConstraints}
                    key={selectedCamera}
                />
                <button className={styles['capture-button']} onClick={capture}><IconCamera /></button>
            </div>

            <div className={`${styles['upload-image-container']} ${imgSrc.length > 0 ? styles['has-images'] : ''}`}>
                <div className={styles.previewImages}>
                    {imgSrc.slice(0, 4).map((src, index) => (
                        <div key={index} className="relative" onClick={() => openModal(index)}>
                            <img
                                className={styles['img-preview']}
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

                {imgSrc.length > 4 && (
                    <div className={styles['max-limit-info']}>
                        <p>Anda telah mengambil lebih dari 4 foto.</p>
                    </div>
                )}

                <button className={styles['upload-button']} onClick={handleUpload}>Upload</button>
                {errorMessage && (
                    <div className={styles['error-message']}>
                        <p>{errorMessage}</p>
                    </div>
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Image Carousel"
                className={styles.modal}
                overlayClassName={styles.overlay}
            >
                <button className={styles['close-modal-button']} onClick={closeModal}>Close</button>
                <Carousel selectedItem={currentImageIndex}>
                    {imgSrc.map((src, index) => (
                        <div key={index}>
                            <img
                                className={styles['img-carousel']}
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
