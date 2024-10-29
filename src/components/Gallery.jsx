// components/Gallery.js
import { useState } from 'react';
import Modal from 'react-modal';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

Modal.setAppElement('#__next'); // important for accessibility

const Gallery = ({ images }) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(0);

    const openModal = (index) => {
        setSelectedImage(index);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    return (
        <div>
            <div className="grid grid-cols-3 gap-4">
                {images.map((image, index) => (
                    <img
                        key={index}
                        src={image}
                        alt={`Image ${index + 1}`}
                        className="cursor-pointer"
                        onClick={() => openModal(index)}
                    />
                ))}
            </div>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                className="fixed inset-0 flex items-center justify-center"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50"
            >
                <div className="bg-white p-2 rounded-lg w-[300px] max-w-3xl h-auto">
                    <Carousel selectedItem={selectedImage} showThumbs={false} infiniteLoop={true} showStatus={false}>
                        {images.map((image, index) => (
                            <div key={index}>
                                <img src={image} alt={`Image ${index + 1}`} className="max-h-full w-full object-cover" />
                            </div>
                        ))}
                    </Carousel>
                    <button onClick={closeModal} className="mt-4 px-4 py-1 bg-red-500 rounded-lg text-white">
                        Close
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default Gallery;
