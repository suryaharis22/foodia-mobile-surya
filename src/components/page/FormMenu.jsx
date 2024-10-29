// src/components/page/FormMenu.jsx

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { StepOne } from "../FormCampaing/StepMenu";
import Header from "../Header";

const FormMenu = () => {
  const router = useRouter();
  const { step } = router.query;
  const [stepNumber, setStepNumber] = useState(1);
  const [Menu, setMenu] = useState(null);

  useEffect(() => {
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");
    const status = localStorage.getItem("status");
    const idMerchant = localStorage.getItem("id");

    if (
      !role ||
      !token ||
      role !== "merchant" ||
      status !== "approved" ||
      !idMerchant
    ) {
      // Redirect to login if either role or token is missing or role is not 'detonator' or status is not 'approved'
      localStorage.clear();
      localStorage.removeItem("cart");
      localStorage.removeItem("formData");
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    setStepNumber(parseInt(step) || 1);
  }, [router.query.step]);

  // useEffect(() => {
  // }, [Menu]);

  let stepComponent;
  let setTitle;

  return (
    <main className="my-0 mx-auto min-h-full mobile-w">
      <div className="my-0 mx-auto min-h-screen max-w-480 overflow-x-hidden bg-white flex flex-col">
        <Header title="Tambah Menu" />
        <div className="grid justify-items-center w-full mt-24">
          <StepOne setMenu={setMenu} Menu={Menu} />
        </div>
      </div>
    </main>
  );
};

export default FormMenu;
