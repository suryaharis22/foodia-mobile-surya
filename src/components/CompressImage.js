// Compress.jsx
import Compressor from "compressorjs";

const CompressImage = (file) => {
    return new Promise((resolve, reject) => {
        new Compressor(file, {
            quality: 0.2,
            // maxWidth: 5024,
            // maxHeight: 5024,
            success(result) {
                resolve(result);
            },
            error(err) {
                reject(err.message);
            }
        });
    });
};

export default CompressImage;
