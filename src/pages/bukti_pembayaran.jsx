import Header from "@/components/Header";
import Loading from "@/components/Loading";
import Error401 from "@/components/error401";
import { useAppState } from "@/components/page/UserContext";
import { encryptId } from "@/utils/EndCodeHelper1";
import { IconCheck } from "@tabler/icons-react";
import axios from "axios";
import moment from "moment/moment";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const BuktiPembayaran = () => {
  const router = useRouter();
  const [pembayaran, setPembayaran] = useState("");
  const [loading, setLoading] = useState(true);
  const [prevPath, setPrevPath] = useState("");
  const [path, setPath] = useState("");

  // const previousPageUrl =
  //   typeof window !== "undefined" ? new URL(document.referrer).pathname : "";

  useEffect(() => {
    const prevPath = localStorage.getItem("prevPath");
    if (prevPath) {
      setPrevPath(prevPath);
    }
    let external_id;

    if (router.query.external_id) {
      external_id = router.query.external_id;
    } else {
      external_id = localStorage.getItem("external_id");
    }

    if (external_id) {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}donation/transaction/${external_id}`
        )
        .then((response) => {
          setPembayaran(response.data.body);
          if (
            prevPath !== "/mydonation" &&
            response.data.body.donation_type !== "agnostic"
          ) {
            setPrevPath(
              `/campaign/${response.data.body.campaign_donation.campaign_id}`
            );
          }

          if (
            prevPath !== "/mydonation" &&
            response.data.body.donation_type === "agnostic"
          ) {
            setPrevPath("/mydonation");
          }

          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          Error401(error, router);
        });
    }
  }, [router]);

  return (
    <div className="my-0 h-screen max-w-480 bg-white flex flex-col">
      <Header title="Detail Donasi" backto={prevPath} />
      <div className="mt-10 p-4 overflow-hidden">
        <div className="p-4 py-8 w-full mb-4 bg-white shadow-[rgba(0,0,2,0.5)_0px_0px_6px_0px] rounded-lg">
          <div className="flex justify-center items-center mb-4 animate-zoom">
            <div className="h-16 w-16 rounded-full bg-primary grid justify-items-center items-center text-white">
              <IconCheck size={30} />
            </div>
          </div>
          <div className="flex justify-center items-center">
            <p className="font-normal text-gray-400">Payment Total</p>
          </div>
          <div className="flex justify-center items-center mb-4">
            <p className="text-3xl font-bold text-primary">
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
              }).format(pembayaran.amount || 0)}
            </p>
          </div>
          <hr className="w-full mx-auto my-4 bg-gray-300" />
          <div className="flex justify-between mb-2">
            <h1 className="font-normal text-sm text-[#A1A5C1]">
              Tanggal Transaksi
            </h1>
            {/* <p className="font-semibold"> {pembayaran.transaction_date}</p> */}
            <p className="font-semibold text-sm">
              {pembayaran?.transaction_date
                ? moment(pembayaran?.transaction_date).format(
                  "DD MMM YYYY hh:mm:ss"
                )
                : "-"}
            </p>
          </div>
          <div className="flex justify-between mb-2">
            <h1 className="font-normal text-sm text-[#A1A5C1]">Detail</h1>
            <p className="font-semibold text-sm">
              {pembayaran.description === "Terima Dana Donasi" ||
                pembayaran.description === "Donation"
                ? "Donasi"
                : pembayaran.description}
              {/* {prevPath !== "/mydonation" ? "Donasi" : "Tabungan Donasi" || "-"} */}
            </p>
          </div>
          <div className="flex justify-between mb-2">
            <h1 className="font-normal text-sm text-[#A1A5C1]">
              Nomer Referensi
            </h1>
            <p className="font-semibold text-sm">
              {pembayaran.id ? pembayaran.id : "-"}
            </p>
          </div>
          <div className="flex justify-between mb-2">
            <h1 className="font-normal text-sm text-[#A1A5C1]">Akun</h1>
            <p className="font-semibold text-sm">
              {pembayaran.sender_name ? pembayaran.sender_name : "-"}
            </p>
          </div>

          <hr className="w-full mx-auto my-4 bg-gray-300" />

          <div className="flex justify-between mb-2">
            <h1 className="font-normal text-sm text-[#A1A5C1]">
              Metode Pembayaran
            </h1>
            <p className="font-semibold text-sm">
              {pembayaran
                ? pembayaran.payment_channel === "campaign_wallet" ||
                  pembayaran.payment_channel === "agnostic_wallet"
                  ? "Tabunganku"
                  : pembayaran.payment_channel
                    ? pembayaran.payment_channel
                    : "Mayar"
                : "-"}
            </p>
          </div>
          <div className="flex justify-between mb-2">
            <h1 className="font-normal text-sm text-[#A1A5C1]">
              Total Pembayaran
            </h1>
            <p className="font-semibold text-sm">
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
              }).format(pembayaran.amount || 0)}
            </p>
          </div>
          {/* <div className="flex justify-between">
            <h1 className="font-normal text-sm text-[#A1A5C1]">
              Biaya Transaksi
            </h1>
            <p className="font-semibold text-sm">
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
              }).format(pembayaran.admin_fee || 0)}
            </p>
          </div> */}

          <hr className="w-full mx-auto my-4 bg-gray-300" />
          <div className="flex justify-between">
            <h1 className="font-bold text-sm text-black">Total</h1>
            <p className="font-semibold text-sm text-primary">
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
              }).format(pembayaran.amount || 0)}
            </p>
          </div>
        </div>

        <Link
          href={prevPath}
          onClick={() => {
            localStorage.removeItem("external_id");
            // localStorage.setItem("prevPath", "/home");
          }}
          className="bg-slate-200 flex justify-center items-center bg-transparent border-2 h-10 border-primary p-3 rounded-xl outline-none"
        >
          <p className="font-bold text-primary">Kembali</p>
        </Link>
      </div>
      {loading && <Loading />}
    </div>
  );
};

export default BuktiPembayaran;
