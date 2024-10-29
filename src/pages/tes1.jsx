import React, { useEffect, useState } from 'react';

const YourComponent = () => {
    const [dataNote, setDataNote] = useState({});

    useEffect(() => {
        // Example response
        const responseString = "name:Perbaiki fild nama|phoneNumber:perbaiki nomer hp anda|ktpPhoto:mohon upload Ulang foto KTP|frontalPhoto:foto bagian depan toko";

        // Default object for rejected notes
        const noteRejected = {
            name: '',
            linkajaNumber: '',
            phoneNumber: '',
            ktpNumber: '',
            ktpPhoto: '',
            selfPhoto: '',
            frontalPhoto: '',
            address: '',
        }

        const responseObject = responseString.split('|').reduce((acc, pair) => {
            const [key, value] = pair.split(':');
            acc[key] = value || '';

            return acc;
        }, {});

        const mergedDataNote = { ...noteRejected, ...responseObject };

        setDataNote(mergedDataNote);
    }, []);

    return (
        <div>
            <h1>Data Note</h1>
            <pre>{JSON.stringify(dataNote, null, 2)}</pre>
            <p>{dataNote.name}</p>
            <p className={dataNote.linkajaNumber ? 'text-black' : 'text-red-500'}>Linkaja Number Status</p>
            <p className={dataNote.address ? 'text-black' : 'text-red-500'}>Address Status</p>
            <p>{dataNote.phoneNumber}</p>
        </div>
    );
};

export default YourComponent;
