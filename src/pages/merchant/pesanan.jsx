import { Inter } from "next/font/google";
import BottomNav from "@/components/BottomNav";
import PesananMerchan from "@/components/page/Merchant/PesananMerchan";
import Header from "@/components/Header";
import { useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Pesanan() {
  useEffect(() => {
    if (localStorage.getItem("prevPath") === "order_confirmation") {
      localStorage.removeItem("prevPath");
    }
  });
  return (
    <main className="my-0 mx-auto min-h-full mobile-w">
      <div className="my-0 mx-auto min-h-screen max-w-480 overflow-x-hidden bg-white flex flex-col">
        <Header title="Pesanan" />
        <PesananMerchan />
      </div>
      <BottomNav />
    </main>
  );
}
