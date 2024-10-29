import Error401 from "@/components/error401";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import { IconMapPin } from "@tabler/icons-react";
import axios from "axios";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import QRCode from "qrcode.react";
import { useEffect, useState } from "react";

const QrKupon = (QrKupon) => {
    const router = useRouter();
    const { id, mrc, prd } = router.query;
    const [loading, setLoading] = useState(false);
    const [dataKupon, setDataKupon] = useState();
    const [prevPath, setPrevPath] = useState(null);


    useEffect(() => {
        setPrevPath(localStorage.getItem("prevPath"));
    }, [prevPath]);

    useEffect(() => {
        if (mrc) {
            getMerchant();
        }

    }, [mrc]);

    const getMerchant = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}coupon/fetch/${mrc}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            if (response.status === 200) {
                setDataKupon(response.data.body);

                setLoading(false);
            } else {
                Error401(response, router);
            }
        } catch (error) {
            Error401(error, router);

        }
    };


    return (
        <div className="my-0 mx-auto max-w-480 bg-white flex flex-col h-screen">
            <Header title="Qr Kupon" backto={prevPath ? prevPath : "/beneficiaries"} />
            <div className="container mx-auto mt-16 bg-white pb-32">
                <div className="flex justify-center mb-[16px] ">
                    <Link href={`https://www.google.com/maps?q=${dataKupon?.merchant?.latitude},${dataKupon?.merchant?.longitude}`}>

                        <IconMapPin className="mr-2 text-red-500" />
                    </Link >
                    <div className="text-center">
                        <p className="text-[14px] font-semibold">{dataKupon?.merchant?.merchant_name} </p>
                        <p className="text-[14px] font-regular">{dataKupon?.merchant_product?.name}</p>
                    </div>

                </div>

                <div className="flex justify-center text-primary font-bold text-2xl ">
                    <div className="flex justify-center items-center w-[328px] h-[328px]  border-2 border-primary rounded-lg ">
                        <QRCode value={dataKupon?.qr_code} size={276} />
                    </div>

                </div>

                <div className="flex justify-center mb-[16px] ">

                    <div className="text-center">
                        <p className="text-[10px] italic my-2 text-primary">Berikan QR Code berikut untuk di-scan oleh Merchant yang dipilih.</p>
                        <p className="text-[14px] font-semibold mb-1">Masa Aktif Kupon Berlaku Hingga</p>
                        <p className="text-[14px] font-regular">{dataKupon?.expired_at
                            ? moment(dataKupon.expired_at).format('DD MMMM YYYY HH:mm:ss') + ' WIB'
                            : ''}</p>
                    </div>

                </div>

                <div className="mobile-w fixed flex justify-center pb-16 bottom-11 my-0 mx-auto w-full max-w-screen-sm ">
                    <div className="kotak shadow-inner px-4">
                        <button className="bg-white text-primary w-full h-12 rounded-xl font-bold border-4 border-primary text-[18px]" onClick={() => router.push("/beneficiaries")}>TUTUP</button>

                    </div>
                </div>
            </div>
            {loading && <Loading />}
        </div>
    );
}

export default QrKupon;