import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import { StepOne, StepTwo } from "@/components/FormCampaing/SetpEditMerchant";
import axios from "axios";
import Header from "@/components/Header";

const MerchantEdit = () => {
    const router = useRouter();
    const { step } = router.query;
    const [dataMerchant, setDataMerchant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [noted, setNoted] = useState('');
    const [headerTitle, setHeaderTitle] = useState({ title: "Edit Merchant", backto: "" });

    useEffect(() => {
        const token = localStorage.getItem("token");
        const id = localStorage.getItem("id");

        // Redirect to login if token or id is missing
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



                // Define the default object for rejected notes
                const noteRejected = {
                    FullName: '',
                    NameMerchant: '',
                    LinkAjaNumber: '',
                    PhoneNumber: '',
                    KTPNumber: '',
                    KTPPhoto: '',
                    SelfPhoto: '',
                    MerchantPhoto: '',
                    Address: '',
                };

                // Parse the note into an object
                const responseObject = response.data.body?.note.split('|').reduce((acc, pair) => {
                    const [key, value] = pair.split(':');
                    acc[key] = value || ''; // Use empty string for missing values
                    return acc;
                }, {});

                const errorObject = { ...noteRejected, ...responseObject };

                // Create data response
                const dataResponse = {
                    fullname: response.data.body?.oauth?.fullname,
                    merchant_name: response.data.body?.merchant_name,
                    ktp_number: response.data.body.ktp_number,
                    no_link_aja: response.data.body.no_link_aja,
                    ktp_photo: response.data.body.ktp_photo,
                    merchant_photo: response.data.body.merchant_photo,
                    self_photo: response.data.body.self_photo,
                    note: response.data.body.note,
                    rejectedError: errorObject,
                    fullAddress: {
                        address: response.data.body.address,
                        province: response.data.body.province,
                        city: response.data.body.city,
                        sub_district: response.data.body.sub_district,
                        postal_code: response.data.body.postal_code,
                        latitude: response.data.body.latitude,
                        longitude: response.data.body.longitude,
                    }
                };


                setDataMerchant(dataResponse);
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    // Handle unauthorized error
                    Error401(error, router);
                }
            } finally {
                setLoading(false);
            }
        };

        // Check local storage for existing data
        const storedDataMerchant = localStorage.getItem("DataMerchant");
        if (storedDataMerchant) {
            setDataMerchant(JSON.parse(storedDataMerchant));
            setLoading(false);
        } else {
            fetchData();
        }
    }, [router]);

    useEffect(() => {
        // Ensure DataMerchant is available before checking for steps
        if (dataMerchant && dataMerchant.rejectedError) {
            // Check if only address needs editing
            const shouldGoToStepTwo = !dataMerchant.rejectedError.FullName &&
                !dataMerchant.rejectedError.NameMerchant &&
                !dataMerchant.rejectedError.LinkAjaNumber &&
                !dataMerchant.rejectedError.PhoneNumber &&
                !dataMerchant.rejectedError.KTPNumber &&
                !dataMerchant.rejectedError.KTPPhoto &&
                !dataMerchant.rejectedError.SelfPhoto &&
                !dataMerchant.rejectedError.MerchantPhoto &&
                dataMerchant.rejectedError.Address !== ''; // Ensure address is not empty

            if (shouldGoToStepTwo) {
                localStorage.setItem('rejectData', 'Reject_Data');
                setHeaderTitle({ title: "Edit Merchant", backto: "/home" });
            } else {

                if (step == 1) {
                    localStorage.setItem('rejectData', 'Reject_Data');
                    setHeaderTitle({ title: "Edit Merchant", backto: "/home" });
                } else {
                    setHeaderTitle({ title: "Edit Merchant", backto: "" });

                }
            }
        }
    }, [dataMerchant]);

    // Synchronize DataMerchant with localStorage
    useEffect(() => {
        if (dataMerchant) {
            localStorage.setItem("DataMerchant", JSON.stringify(dataMerchant));
        }
    }, [dataMerchant]);

    const updateDataMerchant = (updatedDataMerchant) => {
        setDataMerchant(updatedDataMerchant);
    };

    let stepComponent;
    let setTitle = "";

    switch (step) {
        case "1":
            stepComponent = (
                <StepOne
                    DataMerchant={dataMerchant}
                    setDataMerchant={updateDataMerchant}
                    loading={loading}
                    setLoading={setLoading}
                />
            );
            setTitle = "Edit Data Merchant";
            break;
        case "2":
            stepComponent = (
                <StepTwo
                    DataMerchant={dataMerchant}
                    setDataMerchant={updateDataMerchant}
                    loading={loading}
                    setLoading={setLoading}
                />
            );
            setTitle = "Alamat Merchant Anda";
            break;
        default:
            stepComponent = <div>Invalid step value</div>;
            setTitle = "Invalid Step";
            break;
    }

    return (
        <>
            <Header title={headerTitle.title || setTitle} backto={headerTitle.backto} />
            <div className="text-center mb-4 mt-[50px]">
                <h1 className="text-2xl font-bold text-gray-800">{setTitle}</h1>
            </div>
            {stepComponent}
            {loading && <Loading />}
        </>
    );
};

export default MerchantEdit;
