import { Inter } from "next/font/google";
import BottomNav from "@/components/BottomNav";
import Detonator from "@/components/page/Detonator";
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export default function PageDetonator() {
  return (
    <>
      <div className="container mx-auto h-screen max-w-480 bg-white flex flex-col">
        <Header title="Volunteer" backto="/home" />
        <Detonator />
      </div>
      <BottomNav />
    </>
  );
}
