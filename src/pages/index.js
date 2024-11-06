import { Inter } from "next/font/google";
import BottomNav from "@/components/BottomNav";
import Hero from "@/components/Hero";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });

const Home = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setToken(token);
      router.push("/home");
    }
  }, [token]);

  // useEffect(() => {
  //   const session = localStorage.getItem("Session");
  //   if (session === "start") {
  //     router.push("/home");
  //   }
  // }, []);

  // useEffect(() => {
  //   const redirectTimer = setTimeout(() => {
  //     router.push('/home');
  //   }, 2000);

  //   // Membersihkan timer jika komponen unmount sebelum timer selesai
  //   return () => clearTimeout(redirectTimer);
  // }, [router]);

  return (
    <main className="my-0 mx-auto min-h-full mobile-w">
      <div className="my-0 mx-auto min-h-screen mobile-w overflow-x-hidden bg-white flex flex-col">
        <Hero />
        <div className="absolute top-[100px] px-24  ">
          <Image src="/img/LogoFoodia.png" alt="logo" width={200} height={0} className="w-[200px]  object-cover" />

        </div>
        <div className="flex flex-col pt-5 items-center justify-center gap-2">
          <label className="text-primary text-4xl font-bold">
            Selamat Datang
          </label>
          <label className="text-green-400 text-md w-42 flex flex-col items-center">
            Makanan sebagai Hak, Bukan
            <label className="text-green-400 text-md w-42">Keistimewaan</label>
          </label>
        </div>
        <div className="flex flex-col mt-16 px-5 gap-2">
          <Link
            href="/login"
            onClick={() => setLoading(true)}
            className="text-white text-center rounded-2xl font-bold bg-primary py-2"
          >
            Masuk
          </Link>
          <Link
            href="/registrasi"
            onClick={() => setLoading(true)}
            className="text-primary text-center font-bold rounded-2xl border border-primary py-2"
          >
            Daftar
          </Link>
        </div>
        <div className="mobile-w flex flex-col items-center gap-1 justify-center pt-10">
          <div className="flex gap-1">
            <label className="font-light text-sm">Buka aplikasi tanpa</label>
            <Link
              className="text-blue-950 font-bold hover:underline text-sm"
              href="/home"
            >
              Masuk
            </Link>
          </div>
          <Link
            className="text-blue-400 hover:underline text-[11px]"
            href="/T&C"
          >
            Syarat dan Ketentuan
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Home;
