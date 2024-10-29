import { Inter } from "next/font/google";
import BottomNav from "@/components/BottomNav";
import Merchant from "@/components/page/Merchant";
import Header from "@/components/Header";
import { useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function PageMerchant() {
  useEffect(() => {
    if (localStorage.getItem("prevPath") === "order_confirmation") {
      localStorage.removeItem("prevPath");
    }
  });
  return (
    <main className="">
      <Header title="Merchant" backto="/home" />
      <div className="my-0 mx-auto min-h-screen max-w-480 overflow-x-hidden bg-white flex flex-col">
        {/* <Hero /> */}
        <Merchant />
        {/* <HomePage /> */}
      </div>
      <BottomNav />
    </main>
  );
}
