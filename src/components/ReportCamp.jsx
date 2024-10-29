import styles from "@/styles/Campaign.module.css"
import { IconCirclePlus } from '@tabler/icons-react';
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from 'react';
import CardReport from "./CardReport";
import axios from 'axios';
import Error401 from "./error401";
const ReportCamp = () => {
    const router = useRouter();
    const { id } = router.query;
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInNlc3Npb24iOiI1Zjg1ZjExZTgyOGQ4NTViNmMxMTRjMzJhMmRjN2M0NmY5Zjg4YmY5MGI5MzMwNjEwNzUwNzVhNTRkYjAwYWMxIiwiZXhwIjoxNzA0OTQ3NTIxfQ.aVivSf4osa2H0k5Xrky-kugVNNKbplSkNSOtyfiDRtg'; // Replace with your actual authentication token
    const [dataApi, setDataApi] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!id || !token) {
                    throw new Error('Missing required session data');
                }

                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}campaign-report/filter?campaign_id=14`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setDataApi(response.data.body);
                setFilteredData(response.data.body);
                setLoading(false);

            } catch (error) {
                if (error.response && error.response.status === 401) {
                    Error401(error, router);
                }
                handleRequestError(error);
            }
        };

        fetchData();
    }, [id]);

    const handleRequestError = (error) => {
        console.error('Error fetching data:', error);

        if (error.response && error.response.status === 401) {
            localStorage.clear();
            router.push('/login/detonator');
        }

        setLoading(false);
        setFilteredData([]);
    };

    // useEffect(() => {
    //     localStorage.setItem('dataApi', JSON.stringify(dataApi));
    // }, [dataApi]);


    return (
        <>
            <div className="container mx-auto mt-24 bg-white h-screen">

                <div className="mx-auto text-center p-2 text-primary">
                    <h1 className="font-bold">Report Campaigner</h1>
                    <h1>TEBAR 1000 PAKET NASI JUMAT BERKAH</h1>
                </div>
                <hr className="w-full h-1 mx-auto mt-2 bg-gray-300 border-0 rounded" />

                {/* <div className="w-full grid place-content-center p-2">
                    <button className="bg-primary text-white font-bold py-2 px-4 rounded-full flex items-center">
                        <IconCirclePlus className="mr-2" />
                        New Report
                    </button>
                </div> */}

                {loading && <p>Loading...</p>}

                {dataApi.map((item) => (
                    <CardReport key={item.id} data={item} />
                ))}

            </div>

        </>

    );
}

export default ReportCamp;