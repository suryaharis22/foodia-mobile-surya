import React, { useEffect, useState } from 'react';

const YourComponent = () => {
    const [dataNote, setDataNote] = useState({});

    useEffect(() => {
        // Example response
        const responseString = "name:Perbaiki fild nama|linkajaNumber:null|phoneNumber:perbaiki nomer hp anda|ktpNumber:null|ktpPhoto:mohon upload Ulang foto KTP|selfPhoto:null|frontalPhoto:foto bagian depan toko|address:null";

        const responseObject = responseString.split('|').reduce((acc, pair) => {
            const [key, value] = pair.split(':');
            acc[key] = value === 'null' ? null : value;
            return acc;
        }, {});

        setDataNote(responseObject);
    }, []);

    return (
        <div>
            <h1>Data Note</h1>
            <pre>{JSON.stringify(dataNote, null, 2)}</pre>
            <p>{dataNote.name}</p>
            {dataNote.linkajaNumber === null ? (
                <p>Data ini Berisi Null</p>
            ) : (
                <p>{dataNote.linkajaNumber}</p>
            )}
            <p>{dataNote.phoneNumber}</p>
        </div>
    );
};

export default YourComponent;
