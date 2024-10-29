import CameraKupon from "@/components/page/Merchant/CameraKupon";
import { useRouter } from "next/router";

const KlaimKupon = () => {
    const router = useRouter();
    const { id } = router.query;
    return (
        <main className="my-0 mx-auto min-h-full mobile-w">
            <CameraKupon />
        </main>
    );
}

export default KlaimKupon;