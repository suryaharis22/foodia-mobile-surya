import { Inter } from "next/font/google";
import BottomNav from "@/components/BottomNav";
import Hero from "@/components/Hero";
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const inter = Inter({ subsets: ["latin"] });

const pload = () => {
    const router = useRouter();

    useEffect(() => {
        const redirectTimer = setTimeout(() => {
            router.push('/');
        }, 2000);

        // Membersihkan timer jika komponen unmount sebelum timer selesai
        return () => clearTimeout(redirectTimer);
    }, [router]);

    return (
        <main className="my-0 mx-auto min-h-full mobile-w">
            <div className="my-0 mx-auto min-h-screen max-w-480 overflow-x-hidden bg-white flex flex-col">
                <div className="mt-24">
                    <Hero />
                </div>
            </div>

        </main>
    );
}

export default pload;
