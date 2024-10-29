// src/components/FormCampaing.jsx

import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {
  SingleDonationPayment,
  StepOne,
  StepThree,
  StepTwo,
  Stepfive,
  Stepfour,
} from "../FormCampaing/Step";
import Loading from "../Loading";

const FormCampaing = () => {
  const router = useRouter();
  const { step } = router.query;
  const [cart, setCart] = useState([]);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Retrieve form data from local storage on component mount
  useEffect(() => {
    const storedFormData = localStorage.getItem("formData");
    if (storedFormData) {
    }
  }, []);

  useEffect(() => {
    // Membaca nilai dari localStorage setelah rendering pada sisi klien
    const cartData = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(cartData);
  }, []); // Empty dependency array ensures that this effect runs only once after the initial render

  const updateCart = (updatedCart) => {
    setCart(updatedCart);
    // Menyimpan data keranjang ke localStorage setelah diperbarui
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  let stepComponent;
  let setTitle;

  if (step === "1") {
    stepComponent = (
      <StepOne
        setUploadedFile={setUploadedFile}
        uploadedFile={uploadedFile}
        loading={loading}
        setLoading={setLoading}
      />
    );
    setTitle = "Informasi Campaign";
  } else if (step === "2") {
    stepComponent = <StepTwo loading={loading} setLoading={setLoading} />;
    setTitle = "Lokasi Campaign";
  } else if (step === "3") {
    stepComponent = (
      <StepThree
        cart={cart}
        updateCart={updateCart}
        setUploadedFile={setUploadedFile}
        uploadedFile={uploadedFile}
        loading={loading}
        setLoading={setLoading}
      />
    );
    setTitle = "Pilih Menu";
  } else if (step === "Payment") {
    stepComponent = (
      <SingleDonationPayment
        cart={cart}
        updateCart={updateCart}
        setUploadedFile={setUploadedFile}
        uploadedFile={uploadedFile}
        loading={loading}
        setLoading={setLoading}
      />
    );
  } else if (step === "4") {
    stepComponent = (
      <Stepfour
        cart={cart}
        updateCart={updateCart}
        setCart={setCart}
        setUploadedFile={setUploadedFile}
        uploadedFile={uploadedFile}
        loading={loading}
        setLoading={setLoading}
      />
    );
  } else if (step === "5") {
    stepComponent = (
      <Stepfive
        cart={cart}
        setCart={setCart}
        setUploadedFile={setUploadedFile}
        uploadedFile={uploadedFile}
        loading={loading}
        setLoading={setLoading}
      />
    );
    setTitle = "";
  } else {
    stepComponent = <div>Invalid step value</div>;
    setTitle = "Default Title";
  }

  // Update local storage when formData changes
  const updateLocalStorage = (data) => {
    localStorage.setItem("formData", JSON.stringify(data));
  };

  return (
    <div className="container mx-auto mt-16 bg-white h-full text-primary">
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
