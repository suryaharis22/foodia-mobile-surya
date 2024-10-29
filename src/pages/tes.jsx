import { useState, useEffect } from 'react';
import { decryptId, encryptId } from "@/utils/EndCodeHelper1";

export default function Home() {
    const [id, setId] = useState(null);
    const [encryptedId, setEncryptedId] = useState('');
    const [decryptedId, setDecryptedId] = useState('');

    useEffect(() => {
        // Generate ID after the initial render
        const generatedId = Math.floor(Math.random() * 101);
        setId(generatedId);
    }, []);

    useEffect(() => {
        if (id !== null) {
            // Enkripsi ID
            const encrypted = encryptId(id.toString());
            setEncryptedId(encrypted);

            // Dekripsi ID
            const decrypted = decryptId(encrypted);
            setDecryptedId(decrypted);
        }
    }, [id]);

    return (
        <div>
            <p>Original ID: {id}</p>
            <p>Encrypted ID: {encryptedId}</p>
            <p>Decrypted ID: {decryptedId}</p>
        </div>
    );
}
