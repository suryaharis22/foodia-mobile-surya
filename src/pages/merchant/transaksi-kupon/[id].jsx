import Header from "@/components/Header";
import { useRouter } from "next/router";

const TransaksiKupon = () => {
    const router = useRouter();
    const { id } = router.query;
    return (
        <div className="container mx-auto pt-14 bg-white min-h-screen">
            <Header title="Transaksi Kupon" />
            <div className="flex justify-center">
                <div className="w-full max-w-lg p-4">
                    <div className="flex justify-between items-center w-full p-[10px] border border-gray-200 rounded-lg shadow-sm">
                        <div className="flex items-center">
                            <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                                <p className="text-gray-500">No Photo</p>
                            </div>
                            <div className="ml-4 w-[208px]">
                                <div className="flex justify-between items-center">
                                    <p className="text-lg font-semibold text-primary text-[14px] overflow-hidden line-clamp-1">Kupon</p>
                                    <div className="ml-2 px-[8px] py-1 bg-primary text-white rounded-lg text-[8px] font-bold text-center flex justify-center">
                                        <p>Claimed</p>
                                    </div>
                                </div>
                                <p className="text-[8px] mb-[8px] italic overflow-hidden line-clamp-3">Paket nasi kuning lezat dengan lauk ayam suwir, telur dadar dan kering tempe manis pedas. Sudah termasuk sambal lo </p>
                                <p className="text-[18px] font-bold text-[#6CB28E]">RP 15.000</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TransaksiKupon;
