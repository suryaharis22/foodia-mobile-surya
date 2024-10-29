import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";
import Kupon from "@/components/page/Merchant/Kupon";

const kupon = () => {
    return (
        <main className="my-0 mx-auto min-h-full mobile-w">
            <div className="my-0 mx-auto min-h-screen max-w-480 overflow-x-hidden bg-white flex flex-col">
                <Header title="Pesanan" />
                <Kupon />
            </div>
            <BottomNav />
        </main>
    );
}

export default kupon;