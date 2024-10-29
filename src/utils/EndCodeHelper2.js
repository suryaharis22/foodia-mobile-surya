import CryptoJS from 'crypto-js';

// Pastikan untuk menggunakan kunci yang cukup panjang dan kompleks
const secretKey = process.env.SECRET_KEY; // Kunci harus minimal 32 karakter

function generateIV() {
    return CryptoJS.lib.WordArray.random(128 / 8); // IV acak 16 byte
}

export function encryptId(id) {
    const base64Encoded = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(id));
    const iv = generateIV(); // Buat IV baru
    const encrypted = CryptoJS.AES.encrypt(base64Encoded, CryptoJS.enc.Utf8.parse(secretKey), {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    // Gabungkan IV dan hasil enkripsi, konversi ke string dalam format hex
    const ivHex = iv.toString(CryptoJS.enc.Hex);
    const encryptedHex = encrypted.ciphertext.toString(CryptoJS.enc.Hex);

    // Kembalikan IV dan data terenkripsi sebagai satu string yang dipisahkan
    return encodeURIComponent(ivHex + ':' + encryptedHex);
}

export function decryptId(encryptedId) {
    try {
        // Mendekode URI yang telah dienkripsi
        const decoded = decodeURIComponent(encryptedId);

        // Pisahkan IV dan hasil enkripsi
        const parts = decoded.split(':'); // Memisahkan IV dan hasil enkripsi
        const iv = CryptoJS.enc.Hex.parse(parts); // IV 16 byte dalam format hex
        const encryptedData = CryptoJS.enc.Hex.parse(parts); // Hasil enkripsi dalam format hex

        // Mendekripsi data
        const bytes = CryptoJS.AES.decrypt({ ciphertext: encryptedData }, CryptoJS.enc.Utf8.parse(secretKey), {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });

        const decryptedBase64 = bytes.toString(CryptoJS.enc.Utf8);

        // Mengembalikan hasil ke bentuk asli
        const decryptedId = CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(decryptedBase64));
        return decryptedId;
    } catch (error) {
        console.error('Decryption error:', error);
        return null; // Kembalikan null jika terjadi kesalahan saat dekripsi
    }
}
