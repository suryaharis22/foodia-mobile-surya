// src/components/page/FormDetonator.jsx

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  StepOne,
  StepTwo,
  StepThree,
} from "@/components/FormCampaing/StepDetonator";
import Header from "../Header";

const FormDetonator = () => {
  const router = useRouter();
  const { step } = router.query;
  const [stepNumber, setStepNumber] = useState(1);
  const [registrasiDetonator, setRegistrasiDetonator] = useState(null);

  useEffect(() => {
    setStepNumber(parseInt(step) || 1);
  }, [router.query.step]);

  useEffect(() => {
  }, [registrasiDetonator]);

  let stepComponent;
  let setTitle;

  switch (stepNumber) {
    case 1:
      stepComponent = (
        <StepOne
          setRegistrasiDetonator={setRegistrasiDetonator}
          registrasiDetonator={registrasiDetonator}
        />
      );
      setTitle = "Register Volunteer";
      break;
    case 2:
      stepComponent = (
        <StepTwo
          setRegistrasiDetonator={setRegistrasiDetonator}
          registrasiDetonator={registrasiDetonator}
        />
      );
      setTitle = "Identifikasi Pribadi";
      break;
    case 3:
      stepComponent = (
        <StepThree
          setRegistrasiDetonator={setRegistrasiDetonator}
          registrasiDetonator={registrasiDetonator}
        />
      );
      setTitle = "Konfirmasi OTP";
      break;
    // Add cases for other steps if needed
    default:
      stepComponent = <div>Invalid step value</div>;
      setTitle = "Default Title";
      break;
  }

  return (
    <main className="my-0 mx-auto min-h-full mobile-w">
      <div className="my-0 mx-auto min-h-screen max-w-480 overflow-x-hidden bg-white flex flex-col">
        <Header backto="/home" title="Registrasi Volunteer" />
        <div className="grid justify-items-center w-full mt-24">
          {stepComponent}
        </div>
      </div>
    </main>
  );
};

export default FormDetonator;
