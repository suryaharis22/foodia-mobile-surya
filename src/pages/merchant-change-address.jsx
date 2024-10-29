import Header from "@/components/Header";
import Loading from "@/components/Loading";
import axios from "axios";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
const DynamicMap = dynamic(() => import("../components/page/GeoMap"), {
  ssr: false,
});

function MerchantUpdateAddress() {
  const router = useRouter();
  const [locationInfo, setLocationInfo] = useState();
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [tracking, setTracking] = useState(true);

  const handleDataFromMap = (receivedLocationInfo) => {
    setLocationInfo(receivedLocationInfo);
  };

  const getCurrentLocation = () => {
    setTracking((prevTracking) => !prevTracking);
  };

  const chooseAddress = (e) => {
    setLoading(true);
    const locationObj = JSON.stringify(locationInfo);
    localStorage.setItem("updatedAddress", locationObj);
    router.push("/merchant-profile-update");
  };

  return (
    <>
      <div className="bg-white flex flex-col px-1 h-screen">
        <Header title="Pilih Alamat" />
        <div className="py-2 mt-14 w-full px-5 flex flex-row justify-between">
          <button
            disabled={tracking}
            onClick={getCurrentLocation}
            className={
              tracking
                ? "bg-gray-50 border border-primary text-gray-900 text-sm rounded-xl block w-[60%] p-2.5 m-1 outline-none hover:bg-gray-200"
                : "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl block w-[60%] p-2.5 m-1 outline-none hover:bg-gray-200"
            }
          >
            <div className="flex items-center justify-center gap-1 p-0">
              {/* <IconCurrentLocation color="green" /> */}
              <p>Gunakan Lokasi Saat Ini</p>
            </div>
          </button>
          <button
            disabled={!tracking}
            onClick={getCurrentLocation}
            className={
              !tracking
                ? "bg-gray-50 border border-primary text-gray-900 text-sm rounded-xl block w-[40%] p-2.5 m-1 outline-none hover:bg-gray-200"
                : "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl block w-[40%] p-2.5 m-1 outline-none hover:bg-gray-200"
            }
          >
            <div className="flex items-center justify-center gap-1 p-0">
              {/* <IconCurrentLocation color="green" /> */}
              <p>Pilih Lokasi</p>
            </div>
          </button>
        </div>
        <div className="w-full space-y-3">
          <div className="flex justify-center border-gray-300 rounded-lg">
            <DynamicMap
              sendDataToPage={handleDataFromMap}
              tracking={tracking}
            />
          </div>
          <div className="flex justify-end py-8 px-2">
            <button
              onClick={chooseAddress}
              className="flex items-center justify-center bg-primary border-2 border-primary rounded-lg w-full h-10 text-white   font-bold text-center"
            >
              Pilih Alamat
            </button>
          </div>
        </div>
      </div>
      {loading && <Loading />}
    </>
  );
}

export default MerchantUpdateAddress;
