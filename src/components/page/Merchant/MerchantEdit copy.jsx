import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import { StepOne, StepTwo } from "@/components/FormCampaing/SetpEditMerchant";
import axios from "axios";
import Header from "@/components/Header";

const MerchantEdit = () => {
    const router = useRouter();
    const { step } = router.query;
    const [DataMerchant, setDataMerchant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [noted, setNoted] = useState('');
    const [headerTitle, setHeaderTitle] = useState({ title: "Edit Merchant", backto: "" });

    useEffect(() => {
        const token = localStorage.getItem("token");
        const id = localStorage.getItem("id");

        if (!token || !id) {
            router.push("/login");
            return;
        }

        const fetchData = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}merchant/fetch/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setNoted(response.data.body?.note || '');
                const noteArray = response.data.body?.note.split(',');
                const defaultErrorState = {
                    name: false,
                    linkajaNumber: false,
                    phoneNumber: false,
                    ktpNumber: false,
                    ktpPhoto: false,
                    selfPhoto: false,
                    frontalPhoto: false,
                    address: false,
                    noted: ''
                };

                const errorObject = noteArray.reduce((acc, key) => {
                    if (key.includes('noted:')) {
                        acc.noted = key.split('noted:')[1].trim();
                    } else if (acc.hasOwnProperty(key)) {
                        acc[key] = true;
                    }
                    return acc;
                }, { ...defaultErrorState });

                const dataResponse = {
                    name: response.data.body?.merchant_name,
                    ktp_number: response.data.body.ktp_number,
                    no_link_aja: response.data.body.no_link_aja,
                    ktp_photo: response.data.body.ktp_photo,
                    self_photo: response.data.body.self_photo,
                    province: response.data.body.province,
                    city: response.data.body.city,
                    sub_district: response.data.body.sub_district,
                    postal_code: response.data.body.postal_code,
                    address: response.data.body.address,
                    latitude: response.data.body.latitude,
                    longitude: response.data.body.longitude,
                    note: response.data.body.note,
                    rejectedError: errorObject
                };

                setNoted(response.data.body?.note || '');
                setDataMerchant(dataResponse);

                // Cek jika hanya address yang perlu diedit, langsung ke StepTwo
                const isOnlyAddress = Object.keys(errorObject).every(
                    (key) => key === "address" || errorObject[key] === false
                );

                if (isOnlyAddress) {
                    setHeaderTitle({ title: "Edit Merchant - Address", backto: "/merchant" });
                } else {
                    setHeaderTitle({ title: "Edit Merchant", backto: "" });
                }
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    Error401(error, router);
                }
            } finally {
                setLoading(false);
            }
        };

        const storedDataMerchant = localStorage.getItem("DataMerchant");
        if (storedDataMerchant) {
            setDataMerchant(JSON.parse(storedDataMerchant));
            setLoading(false);
        } else {
            fetchData();
        }
    }, [router]);

    // Sinkronisasi state DataMerchant dengan localStorage
    useEffect(() => {
        if (DataMerchant) {
            localStorage.setItem("DataMerchant", JSON.stringify(DataMerchant));
        }
    }, [DataMerchant]);

    const updateDataMerchant = (updatedDataMerchant) => {
        setDataMerchant(updatedDataMerchant);
    };

    let stepComponent;
    let setTitle = "";

    switch (step) {
        case "1":
            stepComponent = (
                <StepOne
                    DataMerchant={DataMerchant}
                    setDataMerchant={updateDataMerchant}
                    loading={loading}
                    setLoading={setLoading}
                />
            );
            setTitle = "Edit Merchant Step 1";
            break;
        case "2":
            stepComponent = (
                <StepTwo
                    DataMerchant={DataMerchant}
                    setDataMerchant={updateDataMerchant}
                    loading={loading}
                    setLoading={setLoading}
                />
            );
            setTitle = "Edit Merchant Step 2";
            break;
        default:
            stepComponent = <div>Invalid step value</div>;
            setTitle = "Invalid Step";
            break;
    }

    return (
        <>
            <Header title={headerTitle.title} backto={headerTitle.backto} />
            <div className="container mx-auto mt-[50px] bg-white h-full text-primary">
                <div className="flex justify-center mb-2">
                    <h1 className="text-xl font-bold">{setTitle}</h1>
                </div>
                <div className="flex flex-col justify-center items-center w-full h-full">
                    {stepComponent}
                </div>
                {loading && <Loading />}
            </div>
        </>
    );
};

export default MerchantEdit;
