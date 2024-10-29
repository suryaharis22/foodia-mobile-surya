import CryptoJS from 'crypto-js';

const secretKey = '!FOODIA';
const base64SecretKey = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(secretKey));

export function encryptId(id) {
    const base64Encoded = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(id));
    const encrypted = CryptoJS.AES.encrypt(base64Encoded, base64SecretKey).toString();

    // Replace characters that cause URL issues ('+', '/', '\') with safe alternatives
    const sanitizedEncrypted = encrypted.replace(/\+/g, '-').replace(/\//g, '_').replace(/\\/g, '~');

    return sanitizedEncrypted;
}

export function decryptId(encryptedId) {
    // Reverse the replacements to get the original encrypted string
    const normalizedEncryptedId = encryptedId.replace(/-/g, '+').replace(/_/g, '/').replace(/~/g, '\\');

    // Decrypt the data
    const bytes = CryptoJS.AES.decrypt(normalizedEncryptedId, base64SecretKey);
    const decryptedBase64 = bytes.toString(CryptoJS.enc.Utf8);

    // Convert the Base64 string back to the original ID
    const decryptedId = CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(decryptedBase64));

    return decryptedId;
}
