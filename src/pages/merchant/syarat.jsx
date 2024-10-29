import Header from "@/components/Header";
import Loading from "@/components/Loading";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const syarat = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <div className="my-0 mx-auto max-w-480 bg-white flex flex-col h-screen">
      <Header title="Syarat Pendaftaran" />
      <div className="container mx-auto mt-16 bg-white pb-32">
        <div className="items-center flex justify-center text-primary font-bold text-2xl">
          <p>MERCHANT</p>
        </div>
        <div className="p-5 gap-5 flex flex-col">
          <hr />
          <p>
            Selamat datang di layanan kami. Mohon baca dengan cermat syarat dan
            ketentuan di bawah ini sebelum Anda menggunakan layanan kami
          </p>
          <div>
            <p className="font-bold">1. **Pendaftaran Akun:**</p>
            <p>
              - Untuk menggunakan layanan kami, Anda harus mendaftar dan membuat
              akun dengan memberikan informasi yang benar dan valid.
            </p>
            <p>
              - Anda bertanggung jawab atas menjaga keamanan dan kerahasiaan
              kata sandi Anda.
            </p>
          </div>
          <div>
            <p className="font-bold">2. **Penggunaan Layanan:**</p>
            <p>
              - Anda setuju untuk menggunakan layanan kami sesuai dengan hukum
              yang berlaku.
            </p>
            <p>
              - Anda tidak diperbolehkan melakukan tindakan yang melanggar hak
              orang lain atau melanggar hak cipta.
            </p>
          </div>
          <div>
            <p className="font-bold">3. **Privasi:**</p>
            <p>
              - Kami menghargai privasi Anda. Informasi pribadi yang Anda
              berikan akan dikelola sesuai dengan Kebijakan Privasi kami.
            </p>
          </div>
          <div>
            <p className="font-bold">4. **Perubahan Syarat & Ketentuan:**</p>
            <p>
              - Kami berhak untuk mengubah syarat dan ketentuan ini. Anda akan
              diberitahu tentang perubahan tersebut.
            </p>
          </div>
          <hr />
        </div>
        <div className="mobile-w fixed flex justify-center pb-16 bottom-11 my-0 mx-auto w-full max-w-screen-sm ">
          <div className="kotak shadow-inner px-4">
            <div className="py-2 items-center flex pl-2">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={handleCheckboxChange}
                style={{ transform: "scale(1.8)" }}
              />
              <p className="text-left text-sm tracking-wide font-semibold mx-4">
                Saya Telah Membaca dan Setuju Syarat & Ketentuan dan Kebijakan
                Privasi
              </p>
            </div>
            <button
              disabled={!isChecked}
              className={
                !isChecked
                  ? "bg-gray-400 text-white w-full h-12 rounded-xl font-bold"
                  : "bg-primary text-white w-full h-12 rounded-xl font-bold"
              }
              onClick={() => {
                setLoading(true);
                router.push("/registrasi/merchant?step=1");
              }}
            >
              Lanjut
            </button>
          </div>
        </div>
      </div>
      {loading && <Loading />}
    </div>
  );
};

export default syarat;
