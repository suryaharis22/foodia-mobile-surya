// src/pages/beneficiaries/order-merchant.jsx
import Header from "@/components/Header";
import OrderMerchant from "@/components/page/Beneficiaries/OrderMerchant";
import { useRouter } from "next/router";

const OrderMerchantPage = ({ pageProps }) => {
    const router = useRouter();
    const { step } = router.query;

    // Menyesuaikan judul header berdasarkan langkah
    const headerTitle = step === '1' ? 'Pilih Merchant' : 'Pilih Menu';

    return (
        <main className="my-0 mx-auto min-h-full mobile-w">
            <div className="my-0 mx-auto min-h-screen max-w-480 overflow-x-hidden bg-white flex flex-col">
                <Header title={headerTitle} />
                <OrderMerchant step={step} {...pageProps} />
            </div>
        </main>
    );
};

export default OrderMerchantPage;
