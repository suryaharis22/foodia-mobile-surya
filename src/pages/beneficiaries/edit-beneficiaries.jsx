// src/pages/beneficiaries/order-merchant.jsx
import BeneficiariesEdit from "@/components/page/Beneficiaries/BeneficiariesEdit";
import { useRouter } from "next/router";

const EditBeneficiaries = ({ pageProps }) => {
    const router = useRouter();
    const { step } = router.query;

    // Menyesuaikan judul header berdasarkan langkah


    return (
        <main className="min-h-screen bg-white flex items-start justify-center">
            <div className="container mx-auto p-4 max-w-xl bg-white">
                <BeneficiariesEdit step={step} {...pageProps} />

            </div>
        </main>


    );
};

export default EditBeneficiaries;
