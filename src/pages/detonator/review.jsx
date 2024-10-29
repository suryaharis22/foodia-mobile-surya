import BottomNav from "@/components/BottomNav";
import CardReview from "@/components/CardReview";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import Error401 from "@/components/error401";
import MenuDetonator from "@/components/page/Detonator/MenuDetonator";
import styles from "@/styles/Home.module.css";
import axios from "axios";
import { Inter } from "next/font/google";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";


const inter = Inter({ subsets: ["latin"] });

export default function review() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [dataApi, setDataApi] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState("KirimUlasan");
    // const [cekData, setCekData] = useState("");
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const observer = useRef();
    const [jumlah, setJumlah] = useState(0);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            Swal.fire({
                icon: "error",
                title: "Akses Dibatasi",
                text: ` Mohon untuk login kembali menggunakan akun Volunteer.`,
                showConfirmButton: true,
                confirmButtonText: "Login",
                confirmButtonColor: "green",
                showCancelButton: true,
                cancelButtonText: "Tutup",
                cancelButtonColor: "red",
                // timer: 2000,
            }).then((result) => {
                if (result.isConfirmed) {
                    router.push("/login");
                } else if (result.isDismissed) {
                    router.push("/home");
                }
            });
        } else {
            axios
                .get(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}auth/check-register-status`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
                .then((response) => {
                    const cekData = response.data.body;

                    if (!cekData.detonator) {
                        Swal.fire({
                            icon: "warning",
                            title: "Akun Belum Terdaftar sebagai Volunteer",
                            text: "Mohon untuk registrasi sebagai Volunteer",
                            showConfirmButton: true,
                            confirmButtonColor: "green",
                            confirmButtonText: "Registrasi",
                            showCancelButton: true,
                            cancelButtonColor: "red",
                            cancelButtonText: "Tutup",
                            // timer: 2000,
                        }).then((result) => {
                            if (result.isConfirmed) {
                                router.push("/detonator/syarat");
                            } else if (result.isDismissed) {
                                router.push("/home");
                            }
                        });
                    } else {
                        if (cekData.detonator.status == "waiting") {
                            localStorage.setItem("id", cekData.detonator.detonator_id);
                            localStorage.setItem("role", "detonator");
                            localStorage.setItem("status", cekData.detonator.status);
                            localStorage.setItem("note", cekData.detonator.note);

                            Swal.fire({
                                icon: "warning",
                                title: "Akun Volunteer Anda Belum Terverifikasi",
                                text: ` Mohon tunggu konfirmasi dari admin kami`,
                                showConfirmButton: false,
                                showCancelButton: true,
                                cancelButtonColor: "red",
                                cancelButtonText: "Tutup",
                            }).then((result) => {
                                if (result.isDismissed) {
                                    router.push("/home");
                                }
                            });
                        } else if (cekData.detonator.status == "rejected") {
                            setLoading(false);
                            localStorage.setItem("id", cekData.detonator.detonator_id);
                            localStorage.setItem("role", "detonator");
                            localStorage.setItem("status", cekData.detonator.status);
                            localStorage.setItem("note", cekData.detonator.note);
                            Swal.fire({
                                icon: "warning",
                                title: "Volunteer ditolak",
                                text: `${cekData.detonator.note}`,
                                showConfirmButton: false,
                                timer: 2000,
                            });
                            setTimeout(() => {
                                router.push("/detonator/edit");
                            }, 2000);
                        } else {
                            localStorage.setItem("id", cekData.detonator.detonator_id);
                            localStorage.setItem("role", "detonator");
                            localStorage.setItem("status", cekData.detonator.status);
                            localStorage.setItem("note", cekData.detonator.note);
                            getReviwe(cekData.detonator.detonator_id, token);
                        }

                    }

                })
                .catch((error) => {
                    Error401(error, router);
                });
        }
    }, []);

    const getReviwe = (id, token) => {
        axios
            .get(
                process.env.NEXT_PUBLIC_API_BASE_URL + `rating/not-reviewed?type=detonator&id=${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            .then((response) => {
                setJumlah(response.data.body.length);
                setDataApi(response.data.body);
                // const filtered = response.data.body.filter(
                //     (data) => data.is_rating === false && data.approval_status === "approved"
                // )
                // setFilteredData(filtered);
                setFilteredData(response.data.body);
                setLoading(false);

                if (response.data.body.length === 0) {
                    setHasMore(false);
                }
            })
            .catch((error) => {
                setLoading(false);
                Error401(error, router);
                console.error("Error fetching data:", error);

                if (error.response && error.response.status === 401) {
                    // Unauthorized error (e.g., token expired)
                    localStorage.clear();
                    router.push("/login");
                }
            });

    };


    const handleFilterChange = (status) => {
        const token = localStorage.getItem("token");
        const id = localStorage.getItem("id");
        let filtered = [];
        setLoading(true);

        if (status === "KirimUlasan") {
            // Show items with 'waiting' or 'rejected' status
            filtered = dataApi
            setFilteredData(filtered);
            setLoading(false);

        } else if (status === "UlasanSelesai") {

            axios.get(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}rating/filter?relation_id=${id}&type=detonator`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((res) => {
                    setFilteredData(res.data.body);
                    setLoading(false);
                }).catch((error) => {
                    Error401(error, router);
                })
        }

        setSelectedStatus(status);

    };

    return (
        <>
            <div className="container mx-auto h-screen max-w-480 bg-white flex flex-col">
                <Header title="Volunteer" backto="/home" />
                <div className="bg-white h-screen pt-10">
                    <div className="flex items-center justify-center px-6 my-2">
                        <MenuDetonator />
                    </div>

                    <div className="flex flex-row px-6 py-4 justify-between items-end">
                        <div
                            className={`cursor-pointer text-center w-full pb-2 font-bold ${selectedStatus === "KirimUlasan"
                                ? "text-[#6CB28E] border border-t-0 border-x-0 border-b-[2px] border-b-[#6CB28E]"
                                : "text-gray-400 border border-t-0 border-x-0 border-b-[2px] border-b-transparent"
                                }`}
                            onClick={() => handleFilterChange("KirimUlasan")}
                        >
                            <div className="flex items-center justify-between w-full">
                                <p className="flex-1 text-center">Kasih Ulasan</p>
                                {jumlah !== 0 && (
                                    <div className="h-[16px] w-[16px] bg-red-500 rounded-full flex justify-center items-center text-[8px] font-bold text-white">
                                        <span>{loading ? '...' : (jumlah || 0)}</span>
                                    </div>
                                )}

                            </div>
                        </div>

                        <div
                            className={`cursor-pointer text-center w-full pb-2 font-bold ${selectedStatus === "UlasanSelesai"
                                ? "text-[#6CB28E] border border-t-0 border-x-0 border-b-[2px] border-b-[#6CB28E]"
                                : "text-gray-400 border border-t-0 border-x-0 border-b-[2px] border-b-transparent"
                                }`}
                            onClick={() => handleFilterChange("UlasanSelesai")}
                        >
                            <p>Ulasan Selesai</p>
                        </div>
                    </div>
                    {loading ? (
                        <div className={`${styles.card}`}>
                            {[...Array(4)].map((_, index) => (
                                <div key={index} className={`${styles.loadingCard}`}>
                                    <div className={`${styles.shimmer}`}></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className={`${styles.card}`}>
                            {!filteredData || filteredData.length === 0 ? (
                                <p className="text-gray-400"> Tidak Ada Pengajuan</p>
                            ) : (
                                <>
                                    {selectedStatus === "KirimUlasan" && (
                                        <>
                                            {filteredData.map((dataFilter) => (
                                                <CardReview
                                                    key={dataFilter.id}
                                                    to={`/detonator/rating/${dataFilter?.order_id}?id_camp=${dataFilter.campaign_id}`}
                                                    img={`${process.env.NEXT_PUBLIC_URL_STORAGE}${dataFilter?.event_image}`}
                                                    title={dataFilter?.event_name}
                                                    description={"sfsfsf"}
                                                    date={"sfsfs"}
                                                    address={`${dataFilter?.event_address}`}
                                                    rating={true}
                                                />
                                            ))}
                                        </>
                                    )}
                                    {selectedStatus === "UlasanSelesai" && filteredData.length > 0 && (
                                        <>
                                            {filteredData.map((dataFilter, index) => (
                                                <CardReview
                                                    key={index}
                                                    to={`/detonator/detail-review/${dataFilter?.id}?id_camp=${dataFilter?.order?.campaign?.id}&id_order=${dataFilter?.order_id}`}
                                                    img={`${process.env.NEXT_PUBLIC_URL_STORAGE}${dataFilter.order?.campaign?.image_url}`}
                                                    title={dataFilter?.order?.campaign?.event_name}
                                                    description={"sfsfsf"}
                                                    date={dataFilter.order?.campaign.event_date}
                                                    time={dataFilter.order?.campaign.event_time}
                                                    address={`${dataFilter.order?.campaign?.address}`}
                                                    rating={true}
                                                    qty={dataFilter.order?.qty}
                                                    harga={dataFilter.order?.merchant_product?.price}
                                                    status={'Completed'}
                                                    TotalHarga={dataFilter.order?.total_amount}
                                                    nameProduct={dataFilter.order?.merchant_product?.name}
                                                />
                                            ))}
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                    )}

                    {loading && <Loading />}
                </div>
            </div>
            <BottomNav />
        </>
    );
}
