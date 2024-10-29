import CryptoJS from 'crypto-js';

// Fungsi untuk enkripsi ID menggunakan secretKey
export function encryptId(id) {
    const secretKey = process.env.CRYPTO_SECRET || 'secretKeyRahasia'; // Menggunakan secret key dari environment
    const ciphertext = CryptoJS.AES.encrypt(id.toString(), secretKey).toString();

    // Encode untuk memastikan aman di URL
    return encodeURIComponent(ciphertext);
}

// Fungsi untuk dekripsi ID
export function decryptId(encryptedId) {
    const secretKey = process.env.CRYPTO_SECRET || 'secretKeyRahasia'; // Menggunakan secret key dari environment

    // Decode terlebih dahulu
    const bytes = CryptoJS.AES.decrypt(decodeURIComponent(encryptedId), secretKey);
    const originalId = bytes.toString(CryptoJS.enc.Utf8);

    return originalId;
}
