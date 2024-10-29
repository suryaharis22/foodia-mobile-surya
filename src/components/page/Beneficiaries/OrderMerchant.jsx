// src/components/page/Beneficiaries/OrderMerchant.jsx
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import { StepOne, StepTwo } from "./StepOrderMerchant";

const OrderMerchant = ({ pageProps }) => {
    const router = useRouter();
    const { step } = router.query;
    const [DataOrder, setDataOrder] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const storedDataOrder = localStorage.getItem("DataOrder");
        if (storedDataOrder) {
            setDataOrder(JSON.parse(storedDataOrder));
        }
    }, []);

    const updateDataOrder = (updatedDataOrder) => {
        setDataOrder(updatedDataOrder);
        localStorage.setItem("DataOrder", JSON.stringify(updatedDataOrder));
    };

    let stepComponent;
    let setTitle;

    if (step === "1") {
        stepComponent = (
            <StepOne
                DataOrder={DataOrder}
                setDataOrder={updateDataOrder}
                loading={loading}
                setLoading={setLoading}
            />
        );
        setTitle = "";
    } else if (step === "2") {
        stepComponent = (
            <StepTwo
                DataOrder={DataOrder}
                setDataOrder={updateDataOrder}
                loading={loading}
                setLoading={setLoading}
            />
        );
        setTitle = "";
    } else {
        stepComponent = <div>Invalid step value</div>;
        setTitle = "Default Title";
    }

    return (
        <div className="container mx-auto mt-[50px] bg-white h-full text-primary">
            <div className="flex justify-center mb-2">
                <h1 className="text-xl font-bold">{setTitle}</h1>
            </div>
            <div className="grid justify-items-center w-full h-full">
                {stepComponent}
            </div>
            {loading && <Loading />}
        </div>
    );
};

export default OrderMerchant;
