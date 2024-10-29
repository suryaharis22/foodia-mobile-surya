import Header from "@/components/Header";
import Loading from "@/components/Loading";
import Error401 from "@/components/error401";
import { IconFileDescription } from "@tabler/icons-react";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const DetailReview = () => {
    const router = useRouter();
    const { id } = router.query;
    const { id_camp } = router.query;
    const { id_order } = router.query;
    const [dataDetail, setDataDetail] = useState();
    const [dataCamp, setDataCamp] = useState();
    const [dataOrder, setDataOrder] = useState({});
    const [loading, setLoading] = useState(true);
    const getData = () => {

        const id_detonator = localStorage.getItem("id");
        const token = localStorage.getItem("token");
        axios.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}rating/fetch/${id}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
            .then((res) => {
                setLoading(false);

                setDataDetail(res.data.body);
            })
            .catch((err) => {
                setLoading(false);
                Error401(err, router);
            })
    }
    const getDataCamp = () => {
        const id_merchant = localStorage.getItem("id");
        const token = localStorage.getItem("token");
        axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}campaign/fetch/${id_camp}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                setLoading(false);
                const filter = res.data.body?.orders.filter((order) => order.id === parseInt(id_order));

                setDataOrder(filter[0]);
                setDataCamp(res.data.body);
            })
            .catch((err) => {
                setLoading(false);
                Error401(err, router);
            })
    }


    useEffect(() => {
        if (id) {
            getDataCamp();
            getData();

        }
    }, [id, id_camp, router]);
    return (
        <>
            <div className="container mx-auto pt-14 bg-white h-screen">
                <Header title="Detail Review" />
                <div className="place-content-center">
                    <div className=" w-full p-2">
                        <div className="flex justify-between items-center w-full p-2 border border-gray-200 rounded-lg">
                            <div className="flex items-center">
                                {/* {`${process.env.NEXT_PUBLIC_URL_STORAGE}${dataCamp?.merchant_product?.images[0].image_url}`} */}
                                <img
                                    src={`${process.env.NEXT_PUBLIC_URL_STORAGE}${dataOrder?.merchant_product?.images[0].image_url}`}
                                    alt="null"
                                    className="w-20 h-20 rounded-lg"
                                />
                                <div className="ml-2">
                                    <p className="text-sm font-bold">{dataOrder?.qty}x {dataOrder?.merchant_product?.name}</p>
                                    <p className="text-xs font-normal">{dataOrder?.merchant?.merchant_name}</p>
                                    <p className="text-[11px] font-normal text-gray-400">
                                        {`${dataCamp?.event_date} ${dataCamp?.event_time}`}
                                    </p>
                                    <p className="text-[11px] font-medium">
                                        {dataOrder?.order?.merchant_product?.note}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <hr className="w-full h-0.5 mx-auto mt-2 bg-gray-300 border-0 rounded" /> */}
                    <div className="p-2 mt-2 relative">
                        <div className="flex items-center justify-center w-full">
                            <label
                                htmlFor="images"
                                className="flex flex-col justify-center w-full h-32 border-2 border-black border-dashed rounded-lg cursor-pointer bg-gray-200 hover:bg-gray-100"
                            >
                                {dataDetail?.photo == '-' ? <p className="text-center">No Photo</p> :
                                    <img
                                        src={`${process.env.NEXT_PUBLIC_URL_STORAGE}${dataDetail?.photo}`}
                                        alt={`${dataDetail?.photo}`}
                                        className="w-full h-full rounded-lg object-cover"
                                    />}

                            </label>
                        </div>

                    </div>
                    {/* <p>foto ={process.env.NEXT_PUBLIC_API_BASE_URL + dataDetail?.photo}</p> */}

                    <div className="p-2 w-full">
                        <div>
                            <div className="flex flex-row p-4 pr-4 py-0 bg-gray-100 text-gray-400 text-sm rounded-lg focus:ring-blue-500 w-full focus:border-none">
                                <IconFileDescription className="mt-3.5" />
                                <p className="ml-2 w-full min-h-[135px] p-0 py-4 pl-1 bg-transparent focus:border-none outline-none">{dataDetail?.note}</p>
                            </div>

                        </div>
                        <div className="mb-2 ml-4 flex justify-center">
                            {[1, 2, 3, 4, 5].map((index) => (
                                <svg
                                    key={index}
                                    className={`w-12 h-12 cursor-pointer ${index <= dataDetail?.star ? "text-yellow-300" : "text-gray-500"
                                        }`}
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 33 18"
                                    onClick={() => handleStarChange(index)}
                                >
                                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                                </svg>
                            ))}
                        </div>
                        {/* <div className="grid gap-4 mt-10 content-center">
                            <button
                                disabled={!star || !description}
                                onClick={() => handleSubmit()}
                                type="submit"
                                className={`${!star || !description
                                    ? "bg-gray-300"
                                    : "bg-primary"
                                    } text-white hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-xl text-sm w-full sm:w-auto px-5 py-2.5 text-center`}
                            >
                                Simpan
                            </button>
                        </div> */}
                    </div>
                </div>
                {loading && <Loading />}
            </div>
        </>
    );
}

export default DetailReview;