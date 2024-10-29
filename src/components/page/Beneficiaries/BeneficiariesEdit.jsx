import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import axios from "axios";
import Header from "@/components/Header";
import { StepOne, StepTwo } from "@/components/FormCampaing/SetpEditBeneficiaries";

const BeneficiariesEdit = () => {
    const router = useRouter();
    const { step } = router.query;
    const [dataBeneficiaries, setDataBeneficiaries] = useState(null);
    const [loading, setLoading] = useState(true);
    const [noted, setNoted] = useState('');
    const [headerTitle, setHeaderTitle] = useState({ title: "Edit Beneficiaries", backto: "" });


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
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}beneficiaries/fetch/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });


                setNoted(response.data.body?.note || '');


                // Define the default object for rejected notes
                const noteRejected = {
                    FullName: '',
                    PhoneNumber: '',
                    KTPNumber: '',
                    KTPPhoto: '',
                    SelfPhoto: '',
                    Address: '',
                };

                // Parse the note into an object
                const responseObject = response.data.body?.note.split('|').reduce((acc, pair) => {
                    const [key, value] = pair.split(':');
                    acc[key] = value || ''; // Use empty string for missing values
                    return acc;
                }, {});

                // Merge parsed notes with the default rejected notes
                const errorObject = { ...noteRejected, ...responseObject };

                // Create the final data response
                const dataResponse = {
                    // name: response.data.body?.merchant_name,
                    fullname: response.data.body?.oauth?.fullname,
                    ktp_number: response.data.body.ktp_number,
                    ktp_photo: response.data.body.ktp_photo,
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

                setDataBeneficiaries(dataResponse);
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
        const storedDataBeneficiaries = localStorage.getItem("DataBeneficiaries");
        if (storedDataBeneficiaries) {
            setDataBeneficiaries(JSON.parse(storedDataBeneficiaries));
            setLoading(false);
        } else {
            fetchData();
        }
    }, [router]);

    useEffect(() => {
        // Ensure DataBeneficiaries is available before checking for steps
        if (dataBeneficiaries && dataBeneficiaries.rejectedError) {
            // Check if only address needs editing
            const shouldGoToStepTwo =
                !dataBeneficiaries.rejectedError.FullName &&
                !dataBeneficiaries.rejectedError.PhoneNumber &&
                !dataBeneficiaries.rejectedError.KTPNumber &&
                !dataBeneficiaries.rejectedError.KTPPhoto &&
                !dataBeneficiaries.rejectedError.SelfPhoto &&
                // !dataBeneficiaries.rejectedError.BeneficiariesPhoto &&
                dataBeneficiaries.rejectedError.Address !== ''; // Ensure address is not empty

            if (shouldGoToStepTwo) {
                localStorage.setItem('rejectData', 'Reject_Data');
                setHeaderTitle({ title: "Edit Beneficiaries", backto: "/home" });
            } else {

                if (step == 1) {
                    localStorage.setItem('rejectData', 'Reject_Data');
                    setHeaderTitle({ title: "Edit Beneficiaries", backto: "/home" });
                } else {
                    setHeaderTitle({ title: "Edit Beneficiaries", backto: "" });

                }
            }
        }
    }, [dataBeneficiaries]);

    // Synchronize DataBeneficiaries with localStorage
    useEffect(() => {
        if (dataBeneficiaries) {
            localStorage.setItem("DataBeneficiaries", JSON.stringify(dataBeneficiaries));
        }
    }, [dataBeneficiaries]);

    const updateDataBeneficiaries = (updatedDataBeneficiaries) => {
        setDataBeneficiaries(updatedDataBeneficiaries);
    };

    let stepComponent;
    let setTitle = "";

    switch (step) {
        case "1":
            stepComponent = (
                <StepOne
                    DataBeneficiaries={dataBeneficiaries}
                    setDataBeneficiaries={updateDataBeneficiaries}
                    loading={loading}
                    setLoading={setLoading}
                />
            );
            setTitle = "Edit Data Beneficiaries";
            break;
        case "2":
            stepComponent = (
                <StepTwo
                    DataBeneficiaries={dataBeneficiaries}
                    setDataBeneficiaries={updateDataBeneficiaries}
                    loading={loading}
                    setLoading={setLoading}
                />
            );
            setTitle = "Alamat Beneficiaries Anda";
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

export default BeneficiariesEdit;
