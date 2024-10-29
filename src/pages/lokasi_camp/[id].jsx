// lokasi_camp.js
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import styles from "@/styles/Home.module.css";
import { IconCaretDown, IconCaretUp, IconMessage } from "@tabler/icons-react";
import Swal from "sweetalert2";
import axios from "axios";
import { useAppState } from "@/components/page/UserContext";
import Link from "next/link";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
// import 'sweetalert2/dist/sweetalert2.min.css';

const DynamicMarkerMap = dynamic(() => import("@/components/page/MarkerMap"), {
  ssr: false,
});
// const MySwal = withReactContent(Swal);

const LokasiCamp = () => {
  const router = useRouter();
  const { id } = router.query;
  const { state, setDonation } = useAppState();
  const [markerPosition, setMarkerPosition] = useState([51.505, -0.09]);
  const [showFullText, setShowFullText] = useState(false);
  const [campaignData, setCampaignData] = useState(null);
  const [nominalDonasi, setNominalDonasi] = useState(0);
  const toggleReadMore = () => {
    setShowFullText((prevShowFullText) => !prevShowFullText);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}campaign/fetch/${id}`,
          {}
        );
        setCampaignData(response.data.body);
      } catch (error) {
        console.error(error);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleSubmit = (value) => {
    setNominalDonasi(parseInt(value));
    const data = {
      amount: parseInt(value),
      payment_channel: "",
      success_url: `${process.env.NEXT_PUBLIC_URL_PAYMEN}`,
      detail: {
        campaign_id: id,
        description: "Donation",
        donation_type: "agnostic",
      },
    };
    setDonation(data);
    router.push("/metode_pembayaran");
  };



  useEffect(() => {
    if (campaignData && campaignData.latitude && campaignData.longitude) {
      setMarkerPosition([campaignData.latitude, campaignData.longitude]);
    }
  }, [campaignData]);

  return (
    <div className="container mx-auto bg-white text-primary h-screen">
      {/* <div className="flex justify-center">
        <h1 className="text-3xl font-bold">Nama Camp </h1>
      </div>
      <div className="flex justify-center">
        <h1 className="text-xl font-bold">info lokasi</h1>
      </div> */}
      {/* <hr className="w-full h-1 mx-auto mt-2 bg-gray-300 border-0 rounded" /> */}
      <Header title="Lokasi Campaign" />
      <div className="grid justify-items-center w-full pt-10">
        <div className="container mx-auto bg-white h-full">
          <div className="grid items-center justify-center mt-2 w-full">
            <div className="items-center justify-center mt-2 w-full">
              <div className="rounded-xl">
                <DynamicMarkerMap position={markerPosition} />
              </div>
            </div>

            {/* <div className="items-center justify-center mt-2 w-full ">
                    <div className="p-6 rounded-lg bg-green-500 w-80 h-full">
                        <div className="flex items-center justify-center">
                            <div className="bg-gray-300 w-12 h-12 rounded-full mr-3">
                                <img
                                    src={campaignData && campaignData.detonator && campaignData.detonator.self_photo
                                        ? `${process.env.NEXT_PUBLIC_URL_STORAGE}${campaignData.detonator.self_photo}`
                                        : '/img/default-image.png'}
                                    alt="image" className='w-full h-full object-cover rounded-full'
                                />
                            </div>
                            <div className=" w-40 h-11">
                                <p className='text-sm text-gray-500 font-medium'>Penyelenggara</p>
                                <p className='text-lg text-black font-medium'>{campaignData?.detonator.oauth.fullname}</p>
                            </div>
                            <div className="text-white bg-blue-500 w-12 h-12 rounded-full ml-6 grid place-items-center">
                                <IconMessage size={30} />
                            </div>
                        </div>


                        <p className={`mt-4 font-normal text-black text-base ${showFullText ? '' : styles.truncate_info_location}`}>
                            {campaignData?.description}
                        </p>
                        <div className="bg-green-500 hover:bg-blue-500 w-full grid place-content-center rounded-lg text-black text-xs mt-2">
                            <button className="flex" onClick={toggleReadMore}>
                                Selengkapnya {showFullText ? <IconCaretUp size={20} /> : <IconCaretDown size={20} />}
                            </button>
                        </div>
                    </div>
                </div> */}
            <div className="flex items-center justify-center mt-2 w-full ">
              <Link
                href={`https://www.google.com/maps/search/?api=1&query=${campaignData?.latitude},${campaignData?.longitude}`}
                className="bg-primary hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-xl w-full text-center"
              >
                Buka Peta
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* <BottomNav /> */}
    </div>
  );
};

export default LokasiCamp;
