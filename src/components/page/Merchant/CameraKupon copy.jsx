import moment from "moment";
import 'moment/locale/id';
import Modal from 'react-modal'
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import styles from './WebCam.module.css';
import dataURItoBlob from "./dataURItoBlob";
import { Carousel } from "react-responsive-carousel";
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Webcam from "react-webcam";
import { IconCamera, IconSquareRoundedX } from "@tabler/icons-react";

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

    useEffect(() => {
        const fetchCameraAndLocation = async () => {
            try {
                const devices = await navigator.mediaDevices.enumerateDevices();
                const videoDevices = devices.filter(device => device.kind === 'videoinput');
                setCameraDevices(videoDevices);

                const backCamera = videoDevices.find(device => device.label.toLowerCase().includes('back'));
                const frontCamera = videoDevices.find(device => device.label.toLowerCase().includes('front')) || videoDevices[0];
                setSelectedCamera((backCamera || frontCamera).deviceId);
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

    const capture = React.useCallback(() => {
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
                    setImgSrc(prevImgSrc => [...prevImgSrc, imageWithWatermark]);
                };

                img.src = imageSrc;
            }
        }
    }, [webcamRef, setImgSrc, captureTime, captureCoordinates]);

    const handleClose = () => {
        router.back();
    };

    const handleCameraChange = (event) => {
        setSelectedCamera(event.target.value);
    };

    const handleUpload = () => {
        const formData = new FormData();
        formData.append('userId', '1');

        imgSrc.forEach((image, index) => {
            const blobImage = dataURItoBlob(image);
            formData.append("image", blobImage, `photo_${index + 1}.jpg`);
        });

        fetch('URL_ENDPOINT', {
            method: 'POST',
            body: formData,
        })
            .then(response => response.json())
            .then(data => {
                setImgSrc([]);
            })
            .catch(error => {
                console.error('Error saat upload:', error);
            });
    };

    const openModal = (index) => {
        setCurrentImageIndex(index);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    // Adjust the aspect ratio as needed
    const videoConstraints = {
        deviceId: selectedCamera ? { exact: selectedCamera } : undefined,
        aspectRatio: aspectRatio,
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
                    height={600}
                    videoConstraints={videoConstraints}
                    key={selectedCamera}
                />
                <button className={styles['capture-button']} onClick={capture}><IconCamera /></button>
            </div>

            {/* bg-gradient-to-b from-[#C1C1C1] to-[#707070] */}
            <div className={`${styles['upload-image-container']} ${imgSrc.length > 0 ? styles['has-images'] : ''}`}>
                <div className={styles.previewImages}>
                    {imgSrc.slice(0, 4).map((src, index) => (
                        <div key={index} onClick={() => openModal(index)}>
                            <img
                                className={styles['img-preview']}
                                src={src}
                                alt={`Captured ${index + 1}`}
                            />
                        </div>
                    ))}
                </div>

                {imgSrc.length > 4 && (
                    <div className={styles['max-limit-info']}>
                        <p>Anda telah mengambil lebih dari 4 foto.</p>
                    </div>
                )}

                <button className={styles['upload-button']} onClick={handleUpload}>Upload</button>
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
}

export default CameraKupon;