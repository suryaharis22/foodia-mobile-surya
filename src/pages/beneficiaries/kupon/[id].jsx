import CardPesanan from "@/components/CardPesanan";
import Error401 from "@/components/error401";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import CardKupon from "@/components/page/Merchant/CardKupon";
import { IconMapPin } from "@tabler/icons-react";
import axios from "axios";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Modal from 'react-modal';

const DetailKupon = () => {
    const router = useRouter();
    const id_order = router.query.id;
    const [loading, setLoading] = useState(true);
    const [dataApi, setDataApi] = useState();
    const [confirmedOrder, setConfirmedOrder] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [imgMakan, setImgMakan] = useState([]);
    const [imgPenerima, setImgPenerima] = useState([]);
    const [dataCarousel, setDataCarousel] = useState('');
    const [prevPath, setPrevPath] = useState("");

    useEffect(() => {
        setPrevPath(localStorage.getItem("prevPath"));
    }, [prevPath]);

    useEffect(() => {
        const role = localStorage.getItem("role");
        const token = localStorage.getItem("token");
        const status = localStorage.getItem("status");
        const id = localStorage.getItem("id");

        if (
            !role ||
            !token ||
            role !== "beneficiaries" ||
            status !== "approved" ||
            !id
        ) {
            // Redirect to login if either role or token is missing or role is not 'detonator' or status is not 'approved'
            localStorage.clear();
            router.push("/login");
        }
    }, [router]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        setLoading(true);
        if (id_order) {
            axios
                .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}coupon/fetch/${id_order}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((response) => {
                    setDataApi(response.data.body);
                    setImgMakan(response.data.body.report.image_food);
                    setImgPenerima(response.data.body.report.image_transaction);
                    setLoading(false);

                    setConfirmedOrder(response.data.body.qty);
                })
                .catch((error) => {
                    setLoading(false);
                    Error401(error, router);
                });
        }
    }, [id_order]);

    const censorKTPNumber = (ktpNumber) => {
        if (!ktpNumber) return '';
        return `${ktpNumber.slice(0, 2)}${'*'.repeat(ktpNumber.length - 4)}${ktpNumber.slice(-2)}`;
    };
    const censorPhoneNumber = (ktpNumber) => {
        if (!ktpNumber) return '';
        return `${ktpNumber.slice(0, 3)}${'*'.repeat(ktpNumber.length - 4)}${ktpNumber.slice(-3)}`;
    };

    const openModal = (identifier, event) => {
        event.preventDefault(); // Menghentikan propagasi event
        event.stopPropagation(); // Menghentikan propagasi event

        const index = parseInt(identifier.split('_')[1]);

        if (identifier.startsWith('makan')) {
            setDataCarousel('makan');
            setCurrentImageIndex(index);
            setIsModalOpen(true);
        } else if (identifier.startsWith('penerima')) {
            setDataCarousel('penerima');
            setCurrentImageIndex(index);
            setIsModalOpen(true);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <div className="container mx-auto pt-14 bg-white overflow-hidden h-screen">
                <Header title="Detail Pesanan" backto={prevPath ? prevPath : "/beneficiaries"} />
                {/* <Header title="Detail Pesanan" backto={prevPath ? prevPath : ""} /> */}
                <div className="place-content-center h-screen overflow-auto pb-14">
                    {loading ? (
                        <div className="border border-blue-300 shadow rounded-md p-4 max-w-sm w-80 h-28 mx-auto">
                            <div className="animate-pulse flex space-x-4">
                                <div className="rounded-md bg-slate-200 h-16 w-16"></div>
                                <div className="flex-1 space-y-6 py-1">
                                    <div className="h-2 bg-slate-200 rounded"></div>
                                    <div className="space-y-3">
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                                            <div className="h-2 bg-slate-200 rounded col-span-1"></div>
                                        </div>
                                        <div className="h-2 bg-slate-200 rounded"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <CardKupon
                            key={dataApi?.id}
                            to={""}
                            idOrder={dataApi?.id}
                            img={`${process.env.NEXT_PUBLIC_URL_STORAGE}${dataApi?.merchant_product.images[0]}`}
                            title={dataApi?.merchant_product?.name}
                            desc={dataApi?.merchant_product.description}
                            date={moment(dataApi?.expired_at).format(
                                "DD MMM YYYY hh:mm"
                            )}
                            total_amount={dataApi?.total_amount}
                            status={dataApi?.status}
                            name_beneficiary={dataApi?.beneficiary?.fullname}
                        />
                    )}

                    {loading ? (
                        <>
                            <div class="p-2 rounded-md mt-2 px-4 animate-pulse">
                                {/* <h5 class="text-xs mb-1 font-bold">Rangkuman Pesanan</h5> */}
                                <div class="justify-between grid grid-cols-2 gap-2 ">
                                    <div class="text-sm text-gray-400 bg-gray-300 h-4 rounded"></div>
                                    <div class="text-right text-sm bg-gray-300 h-4 rounded"></div>
                                    <div class="text-sm text-gray-400 bg-gray-300 h-4 rounded"></div>
                                    <div class="text-right text-sm text-black bg-gray-300 h-4 rounded"></div>
                                    <div class="text-sm text-gray-400 bg-gray-300 h-4 rounded"></div>
                                    <div class="text-right text-sm text-black bg-gray-300 h-4 rounded"></div>
                                </div>

                                <hr class="h-px bg-gray-200 border-0 mt-2" />
                                <div class="justify-between grid grid-cols-2 gap-2 py-4">
                                    <div class="text-sm text-gray-400 bg-gray-300 h-4 rounded"></div>
                                    <div class="text-right text-sm bg-gray-300 h-4 rounded"></div>
                                    <div class="text-sm text-gray-400 bg-gray-300 h-4 rounded"></div>
                                    <div class="text-right text-sm bg-gray-300 h-4 rounded"></div>
                                </div>

                                <hr class="h-px bg-gray-200 border-0" />
                                <div class="justify-between grid grid-cols-2 gap-2 py-4">
                                    <div class="text-sm text-gray-400 bg-gray-300 h-4 rounded"></div>
                                    <div class="text-right text-sm bg-gray-300 h-4 rounded"></div>
                                </div>
                                <hr class="h-px bg-gray-200 border-0" />
                                <div class="justify-between grid grid-cols-2 gap-2 py-4">
                                    <div class="text-sm text-gray-400 bg-gray-300 h-4 rounded"></div>
                                    <div class="flex gap-4">
                                        <div class="text-right text-sm bg-gray-300 h-4 rounded"></div>
                                        <a
                                            href="#"
                                            class="text-sm font-normal mb-12 text-red-500 bg-gray-300 h-4 rounded"
                                        ></a>
                                    </div>
                                </div>
                                <hr class="h-px bg-gray-200 border-0" />
                                <div class="justify-between grid grid-cols-2 gap-2 py-4">
                                    <div class="text-sm text-gray-400 bg-gray-300 h-4 rounded"></div>
                                    <div class="text-right text-sm bg-gray-300 h-4 rounded"></div>
                                </div>
                                <hr class="h-px bg-gray-200 border-0" />
                                <div class="py-4">
                                    <div class="text-sm text-gray-400 bg-gray-300 h-4 rounded"></div>
                                    <div class="font-normal mt-2 text-sm bg-gray-300 h-6 rounded"></div>
                                </div>
                            </div>
                            <div className=" h-20 bottom-0 my-0 p-2rounded-md mt-2 mx-2 grid grid-cols-2 gap-4 place-content-center">
                                <div
                                    className={`bg-gray-200 text-white rounded-md h-10 w-full col-span-2`}
                                >
                                    --
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="p-2 rounded-md mt-2 px-4">
                            {/* <h5 className="text-xs mb-1 font-bold">Rangkuman Pesanan</h5> */}
                            <div className="flex justify-between py-3">
                                <p className="text-sm text-gray-400">Tanggal Transaksi Kupon</p>
                                <p className="text-right text-sm">
                                    20 Juni 2024 15:25:00 WIB
                                </p>
                            </div>
                            <hr />
                            <div className="justify-between grid grid-cols-2 gap-2 py-3 ">
                                <p className="text-sm text-gray-400">PIC Merchant</p>
                                <p className="text-right text-sm text-black">
                                    {dataApi?.merchant?.fullname}
                                </p>
                                <p className="text-sm text-gray-400">Toko Merchant</p>
                                <p className="text-right text-sm text-black">
                                    {dataApi.merchant?.merchant_name}
                                </p>
                                <p className="text-sm text-gray-400">KTP Merchant</p>
                                <p className="text-right text-sm text-black">
                                    {censorKTPNumber(dataApi.merchant?.ktp_number)}
                                </p>
                                <p className="text-sm text-gray-400">Kontak Merchant</p>
                                <p className="text-right text-sm text-black">
                                    {censorPhoneNumber(dataApi.merchant?.phone)}
                                </p>
                            </div>
                            <div className="justify-between grid grid-cols-2 gap-2 ">
                                <p className="text-sm text-gray-400">Alamat Merchant</p>
                                <div className="flex gap-4">
                                    <p className="text-right text-sm">
                                        {dataApi.merchant?.address}
                                    </p>
                                    <Link
                                        href={`https://www.google.com/maps?q=${dataApi.merchant?.latitude},${dataApi.merchant?.longitude}`}
                                        className="text-sm font-normal mb-12 text-red-500"
                                    >
                                        <IconMapPin />
                                    </Link>
                                </div>
                            </div>
                            <hr />
                            <div className="justify-between grid grid-cols-2 gap-2 py-3 ">
                                <p className="text-sm text-gray-400">Beneficiaries</p>
                                <p className="text-right text-sm text-black">
                                    {dataApi?.beneficiary?.fullname}
                                </p>
                                <p className="text-sm text-gray-400">KTP Beneficiaries</p>
                                <p className="text-right text-sm text-black">
                                    {censorKTPNumber(dataApi?.beneficiary?.ktp_number)}
                                </p>
                                <p className="text-sm text-gray-400">Kontak Beneficiaries</p>
                                <p className="text-right text-sm text-black">
                                    {censorPhoneNumber(dataApi?.beneficiary?.phone)}
                                </p>

                            </div>
                            <div className="justify-between grid grid-cols-2 gap-2 ">
                                <p className="text-sm text-gray-400">Alamat Beneficiaries</p>
                                <div className="flex gap-4">
                                    <p className="text-right text-sm">
                                        {dataApi?.beneficiary?.address}
                                    </p>
                                    <Link
                                        href={`https://www.google.com/maps?q=${dataApi?.beneficiary?.latitude},${dataApi?.beneficiary?.longitude}`}
                                        className="text-sm font-normal mb-12 text-red-500"
                                    >
                                        <IconMapPin />
                                    </Link>
                                </div>
                            </div>

                            <hr class="h-px bg-gray-200 border-0" />
                            <div className="flex justify-between ">
                                <p className="text-sm text-gray-400 m-2">Foto Makanan </p>
                                <div className="flex justify-end min-w-[200px]">
                                    {imgMakan?.length > 0 && imgMakan.map((item, index) => (
                                        <img
                                            key={index}
                                            onClick={(event) => openModal(`makan_${index}`, event)}
                                            src={`${process.env.NEXT_PUBLIC_URL_STORAGE}${item?.image_url}`}
                                            alt={`Image ${index}`} // Menambahkan atribut alt untuk aksesibilitas
                                            className="w-[48px] h-[48px] bg-gray-300 m-1 cursor-pointer" // Menambahkan cursor-pointer
                                        />
                                    ))}
                                </div>

                            </div>

                            <hr class="h-px bg-gray-200 border-0" />
                            <div className="flex justify-between ">
                                <p className="text-sm text-gray-400 m-2">Foto Penerima </p>
                                <div className="flex justify-end min-w-[200px]">
                                    {imgPenerima?.length > 0 && imgPenerima?.map((item, index) => {
                                        return (

                                            <img key={index} onClick={(event) => openModal(`penerima_${index}`, event)} src={`${process.env.NEXT_PUBLIC_URL_STORAGE}${item?.image_url}`} className="w-[48px] h-[48px] bg-gray-300 m-1" />
                                        )
                                    })}

                                </div>
                            </div>

                            {/* <hr  /> */}
                            <p className="text-center text-[10px] italic text-primary mt-[50px]">Transaksi Kupon dilakukan secara sadar dan kedua belah pihak harus bertanggung jawab atas transaksi tersebut jika terdapat kecurangan pada transaksi diatas. Laporan transaksi kupon diatas akan diberikan kepada pemilik Donasi</p>

                        </div>
                    )}

                </div>
                {loading && <Loading />}
                <Modal
                    isOpen={isModalOpen}
                    onRequestClose={closeModal}
                    contentLabel="Image Carousel"
                    className='modal'
                    overlayClassName='overlay'
                >
                    <button className='close-modal-button' onClick={closeModal}>Close</button>
                    <Carousel selectedItem={currentImageIndex}>
                        {dataCarousel === "makan" ? (
                            (imgMakan && imgMakan.length > 0) ? (
                                imgMakan.map((src, index) => (
                                    <div key={index}>
                                        <img
                                            className='img-carousel'
                                            src={`${process.env.NEXT_PUBLIC_URL_STORAGE}${src?.image_url}`}
                                            alt={`Makan ${index + 1}`}
                                        />
                                    </div>
                                ))
                            ) : (
                                <div className="placeholder-message">
                                    No images available for "makan"
                                </div>
                            )
                        ) : (
                            (imgPenerima && imgPenerima.length > 0) ? (
                                imgPenerima.map((src, index) => (
                                    <div key={index}>
                                        <img
                                            className='img-carousel'
                                            src={`${process.env.NEXT_PUBLIC_URL_STORAGE}${src?.image_url}`}
                                            alt={`Penerima ${index + 1}`}
                                        />
                                    </div>
                                ))
                            ) : (
                                <div className="placeholder-message">
                                    No images available for "penerima"
                                </div>
                            )
                        )}
                    </Carousel>

                </Modal>
            </div>
        </>
    );
};

export default DetailKupon;