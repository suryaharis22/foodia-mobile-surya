// src/components/FormCampaing.jsx

import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {
  StepOne,
  StepTwo,
  StepThree,
} from "@/components/FormCampaing/StepGantiMenu";
import Loading from "@/components/Loading";
import axios from "axios";
import Error401 from "@/components/error401";

const FormCampaing = () => {
  const router = useRouter();
  const { step } = router.query;
  const [id_camp, setid_camp] = useState();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataCampaign, setDataCampaign] = useState(null);
  const [order_id, setOrder_id] = useState(null);
  const [totalAmount, setTotalAmount] = useState(null);

  // Retrieve form data from local storage on component mount
  useEffect(() => {
    setid_camp(localStorage.getItem("campaign_id"));
    setOrder_id(localStorage.getItem("order_id"));
    setTotalAmount(localStorage.getItem("totalAmount"));
    const token = localStorage.getItem("token");

    if (id_camp) {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}campaign/fetch/${id_camp}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          setDataCampaign(response.data.body);
        })
        .catch((error) => {
          Error401(error, router);
        });
    }
  }, [id_camp]);

  let stepComponent;
  let setTitle;

  if (step === "1") {
    stepComponent = (
      <StepOne
        dataCampaign={dataCampaign}
        loading={loading}
        setLoading={setLoading}
      />
    );
  } else if (step === "2") {
    stepComponent = (
      <StepTwo
        dataCampaign={dataCampaign}
        order_id={order_id}
        total_amounts={totalAmount}
        loading={loading}
        setLoading={setLoading}
      />
    );
    // setTitle = "Tambah Menu Makan";
  } else if (step === "3") {
    stepComponent = (
      <StepThree
        cart={cart}
        setCart={setCart}
        RejectedQty={RejectedQty}
        order_id={order_id}
        totalRejected={totalRejected}
        dataCampaign={dataCampaign}
        updateCart={updateCart}
        setUploadedFile={setUploadedFile}
        uploadedFile={uploadedFile}
        loading={loading}
        setLoading={setLoading}
      />
    );
  } else {
    stepComponent = <div>Invalid step value</div>;
    setTitle = "Default Title";
  }

  // Update local storage when formData changes
  const updateLocalStorage = (data) => {
    localStorage.setItem("formData", JSON.stringify(data));
  };

  return (
    <div className="container mx-auto mt-10 bg-white h-full text-primary">
      {/* <div className="flex justify-center">
        <h1 className="text-3xl font-bold">FOODIA </h1>
      </div> */}
      <div className="flex justify-center mb-2">
        <h1 className="text-xl font-bold">{setTitle}</h1>
      </div>
      {/* <hr className="w-full h-1 mx-auto mt-2 bg-gray-300 border-0 rounded" /> */}
      <div className="grid justify-items-center w-full h-full">
        {/* Pass the updateLocalStorage function to each step component */}
        {React.cloneElement(stepComponent, { updateLocalStorage })}
      </div>
      {loading && <Loading />}
    </div>
  );
};

export default FormCampaing;
