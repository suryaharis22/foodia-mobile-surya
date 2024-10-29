// src/pages/beneficiaries/order-merchant.jsx
import MerchantEdit from "@/components/page/Merchant/MerchantEdit";
import { useRouter } from "next/router";

const EditMerchant = ({ pageProps }) => {
    const router = useRouter();
    const { step } = router.query;

    // Menyesuaikan judul header berdasarkan langkah


    return (
        <main className="min-h-screen bg-white flex items-start justify-center">
            <div className="container mx-auto p-4 max-w-xl bg-white">
                <MerchantEdit step={step} {...pageProps} />

            </div>
        </main>


    );
};

export default EditMerchant;
