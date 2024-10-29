import BottomNav from "@/components/BottomNav";
import HomePage from "@/components/page/HomePage";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function PageHome() {
  return (
    <>
      <div className="container mx-auto h-screen max-w-480 bg-white flex flex-col">
        {/* <Hero /> */}
        <HomePage />
        {/* <HomePage /> */}
      </div>
      <BottomNav />
    </>
  );
}
