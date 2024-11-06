import { useEffect, useState } from "react";
import axios from "axios";
import Loading from "@/components/Loading";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import Error401 from "@/components/error401";
import { IconBuildingStore, IconMapPin } from "@tabler/icons-react";
import Swal from "sweetalert2";
import Link from "next/link";

const LokasiMerchant = dynamic(() => import("./LokasiMerchant"), { ssr: false });

const Toast = Swal.mixin({
    toast: true,
    position: "center",
    iconColor: "white",
    customClass: {
        popup: "colored-toast",
    },
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
});


function StepOne({ DataOrder, setDataOrder, loading, setLoading }) {
    const router = useRouter();
    const { step } = router.query;
    const [ListMerchant, setListMerchant] = useState([]);
    const [token] = useState(localStorage.getItem("token"));
    const [myLocation, setMyLocation] = useState(null);

    const dataCupon = localStorage.getItem("DataCupon");
    const jsonDataCupon = dataCupon ? JSON.parse(dataCupon) : null;
    const priceCoupon = jsonDataCupon ? jsonDataCupon.price_coupon : null;


    useEffect(() => {
        if (myLocation) {
            getMerchant();
            sortMerchantsByDistance();
        }
    }, [myLocation, token, priceCoupon]);

    const getMerchant = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}merchant/filter?per_page=100000`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                // Filter data merchant berdasarkan produk yang disetujui dan harganya di bawah kupon
                const filteredMerchants = response.data.body.filter(merchant =>
                    merchant.products.some(product => product.status === "approved" && product.price < priceCoupon)
                );

                if (myLocation) {
                    // Menghitung jarak untuk masing-masing merchant
                    const merchantsWithDistance = filteredMerchants.map(merchant => {
                        const distance = haversineDistance(myLocation, { latitude: merchant.latitude, longitude: merchant.longitude });
                        return { ...merchant, distance };
                    });

                    // Filter merchant yang jaraknya di bawah 25 km
                    const merchantsWithinRange = merchantsWithDistance.filter(merchant => merchant.distance <= 25000);

                    // Mengurutkan merchant berdasarkan jarak
                    const sortedMerchants = merchantsWithinRange.sort((a, b) => a.distance - b.distance);

                    if (sortedMerchants.length === 0) {
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: "Tidak ada merchant terdekat di lokasi Anda. Silakan berpindah lokasi lain.",
                            confirmButtonText: "Tutup",
                            confirmButtonColor: "red",
                        }).then((result) => {
                            if (result.isConfirmed) {
                                router.push("/beneficiaries");
                            }
                        });
                    }


                    setListMerchant(sortedMerchants);
                }
            } else {
                Error401(response, router);
            }
        } catch (error) {
            console.error("Error fetching merchants:", error);
        }
    };


    const getMylocation = (location) => {
        const coordinates = {
            latitude: location[0],
            longitude: location[1],
        };
        setMyLocation(coordinates);
    };

    const handleSubmit = async (merchantId) => {
        setLoading(true);
        if (!myLocation) {
            Toast.fire({
                icon: "error",
                title: "Lokasi Belum Tersedia",
            });
            setLoading(false);
            return;
        }

        const updatedDataOrder = {
            ...DataOrder,
            merchant: [],
            myLocation,
            merchantId: merchantId,
        };

        try {
            await setDataOrder(updatedDataOrder);
            setLoading(false);
            router.push("/beneficiaries/order-merchant?step=2");
        } catch (error) {
            console.error("Error updating DataOrder:", error);
            setLoading(false);
        }
    };

    const haversineDistance = (coords1, coords2) => {
        const toRad = (x) => (x * Math.PI) / 180;
        const R = 6371000; // Earth radius in meters

        const dLat = toRad(coords2.latitude - coords1.latitude);
        const dLon = toRad(coords2.longitude - coords1.longitude);

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(coords1.latitude)) * Math.cos(toRad(coords2.latitude)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in meters
    };

    const sortMerchantsByDistance = () => {
        if (myLocation) {
            const sortedMerchants = [...ListMerchant].sort((a, b) => {
                const distanceA = haversineDistance(myLocation, { latitude: a.latitude, longitude: a.longitude });
                const distanceB = haversineDistance(myLocation, { latitude: b.latitude, longitude: b.longitude });

                return distanceA - distanceB; // Mengurutkan dari yang terdekat ke yang terjauh
            });
            setListMerchant(sortedMerchants);
        }
    };

    // Fungsi untuk mengkategorikan jarak
    const categorizeDistance = (distance) => {
        if (distance < 1000) {
            return 'Kurang dari 1 km';
        } else if (distance >= 1000) {
            const kmDistance = Math.floor(distance / 1000);
            const minRange = Math.floor(kmDistance / 10) * 10;
            const maxRange = minRange + 10;
            return `${minRange} km - ${maxRange} km`;
        }
    };

    const groupedData = ListMerchant.reduce((groups, item) => {
        const distanceInKm = item.distance / 1000;
        const groupKey = Math.floor(distanceInKm / 10) * 10;

        if (!groups[groupKey]) {
            groups[groupKey] = [];
        }

        groups[groupKey].push(item);
        return groups;
    }, {});

    return (
        <div className="p-2 mt-2 w-full px-5 space-y-3">
            <div className="grid gap-4 content-center">
                {loading ? (
                    <Loading />
                ) : (
                    <div>
                        <LokasiMerchant getMylocation={getMylocation} zoom={11} merchants={ListMerchant} DataOrder={DataOrder} setDataOrder={setDataOrder} loading={loading} setLoading={setLoading} />
                    </div>
                )}
                <div className="text-black font-medium">
                    <h1 className="text-[18px] font-semibold">Merchant Terdekat</h1>

                </div>

                {!loading ? (
                    <div>
                        {Object.entries(groupedData).map(([group, items], groupIndex) => (
                            <div key={groupIndex} className="mb-2">

                                <p className="text-black text-[14px] font-medium">
                                    {group < 10 ? `Kurang dari 10 km` : `${group} km - ${Number(group) + 10} km`}
                                </p>
                                {items.map((item) => (
                                    <div onClick={() => handleSubmit(item.id)} className="flex items-center px-[10px] w-full h-28 my-2 bg-white rounded-xl cursor-pointer shadow-md overflow-hidden border border-green-500 mx-2">
                                        <div className="flex justify-between">
                                            <div className="flex-shrink-0 h-[90px]">
                                                <IconBuildingStore
                                                    size="70px"
                                                    className="flex items-center justify-center  rounded-lg p-2 text-black"
                                                />
                                            </div>
                                            <div className="px-4 h-[90px] w-[208px]">
                                                <div className="uppercase tracking-wide text-[14px] text-primary font-bold overflow-hidden line-clamp-2">
                                                    {item.merchant_name}
                                                </div>
                                                <p className="mt-0 text-[8px] text-gray-500">
                                                    Jarak: {item.distance !== null ? (item.distance < 1000 ? `${item.distance.toFixed(2)} m` : `${(item.distance / 1000).toFixed(2)} km`) : 'Calculating...'}
                                                </p>
                                                <p className="mt-2 text-[8px] text-gray-500 overflow-hidden line-clamp-4">
                                                    {item.products[0].description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}

                    </div>
                ) : (
                    <Loading />
                )}
            </div>
        </div>
    );
}

function StepTwo({ DataOrder, setDataOrder, loading, setLoading }) {
    const router = useRouter();
    const dataCupon = localStorage.getItem("DataCupon");
    const jsonDataCupon = dataCupon ? JSON.parse(dataCupon) : null;
    const priceCoupon = jsonDataCupon ? jsonDataCupon.price_coupon : null;
    const [productData, setProductData] = useState();


    useEffect(() => {
        if (DataOrder.merchantId) {
            getMerchants();
        } else {
            router.push('/beneficiaries/order-merchant?step=1');
        }
    }, [DataOrder.merchantId]);

    const getMerchants = async () => {
        setLoading(true); // Mulai proses loading
        try {
            const token = localStorage.getItem('token');

            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}merchant-product/filter?merchant_id=${DataOrder.merchantId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.status === 200) {
                const merchant = response.data.body;
                // && product.price < priceCoupon
                // Filter produk
                const filteredProducts = merchant.filter(merchant => merchant.status === "approved" && merchant.price < priceCoupon);
                setProductData(filteredProducts);

                // Perbarui merchant dengan produk yang sudah difilter
                // const filteredMerchant = {
                //     products: filteredProducts,
                // };


                // Perbarui state DataOrder dengan merchant yang sudah difilter
                // localStorage.setItem('DataOrder', JSON.stringify(...DataOrder, filteredMerchant));
                // setDataOrder(...DataOrder, filteredMerchant);
                // setProductData(...DataOrder, filteredMerchant);
            } else {
                Error401(response, router);
            }
        } catch (error) {
            console.error('Error fetching merchants:', error);
        } finally {
            setLoading(false); // Menandakan proses loading selesai
        }
    };

    const CreatOrde = async (id_product) => {
        try {
            setLoading(true);
            const order = {
                id_product: id_product,
            };

            await setDataOrder({ ...DataOrder, order: order });

            Swal.fire({
                title: 'Konfirmasi Pilihan Menu',
                html: `
                    <div class="text-center">
                        <img src="/img/illustration/order.png" alt="Confirmation" class="w-40 h-40 mx-auto mb-5" />
                        <p class="text-center text-gray-700">Apakah pilihan menu untuk penukaran kupon makan gratis sudah benar?</p>
                    </div>
                `,
                width: 300,
                heightAuto: false,
                padding: '20px',

                showCancelButton: true,
                cancelButtonText: '<span class="text-white font-semibold">Belum</span>',
                cancelButtonColor: '#f0625d',
                showConfirmButton: true,
                confirmButtonText: '<span class="text-white font-semibold">Sudah</span>',
                confirmButtonColor: '#a4d188',
                reverseButtons: true, // This line reverses the buttons
                customClass: {
                    title: 'text-primary text-lg',
                    content: 'text-gray-700',
                },
                showClass: {
                    popup: 'animate__animated animate__fadeInUp animate__faster',
                },
                hideClass: {
                    popup: 'animate__animated animate__fadeOutDown animate__faster',
                },
            }).then((result) => {
                if (result.isConfirmed) {
                    setLoading(true);
                    axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}coupon/claim`,
                        { merchant_product_id: parseInt(order.id_product) }, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    }).then((response) => {
                        if (response.status === 200) {
                            localStorage.removeItem('DataOrder');
                            setLoading(false);
                            // setDataOrder({ ...DataOrder, order: response.data.body });

                            const urlPrev = localStorage.setItem('prevPath', '/beneficiaries');
                            router.push(`/beneficiaries/qr-kupon/${response.data.body.qr_code}?mrc=${response.data.body.id}&prd=${response.data.body.merchant_product_id}`);
                        }
                    }
                    ).catch((error) => {
                        setLoading(false);
                        Error401(error, router);
                    });
                }
            });

            setLoading(false);
        } catch (error) {
            console.error("Error updating DataOrder:", error);
            setLoading(false);
        }
    };



    // Fungsi untuk menghitung jarak antara dua titik berdasarkan koordinat geografis
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const toRad = (x) => (x * Math.PI) / 180;
        const R = 6371000; // Earth radius in meters

        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // Distance in meters

        return distance;
    };
    // Fungsi untuk menampilkan jarak dalam format yang diinginkan
    const displayDistance = () => {
        if (DataOrder.myLocation && DataOrder.myLocation.latitude &&
            DataOrder.myLocation.longitude && productData[0].merchant &&
            productData[0].merchant.latitude && productData[0].merchant.longitude) {
            const distance = calculateDistance(
                DataOrder.myLocation.latitude,
                DataOrder.myLocation.longitude,
                productData[0].merchant.latitude,
                productData[0].merchant.longitude);
            if (distance < 1000) {
                return `${distance.toFixed(0)} m`; // Tampilkan dalam meter
            } else {
                return `${(distance / 1000).toFixed(2)} km`; // Konversi ke kilometer dengan 2 desimal
            }
        } else {
            return 'Loading...'; // Saat data lokasi atau merchant sedang dimuat
        }
    };

    return (
        <>
            <div className="flex justify-between items-center w-full px-[16px]">
                <h1 className="text-[14px] font-semibold text-black">
                    {productData?.length > 0 ? `${productData[0].merchant.merchant_name} (${displayDistance()})` : 'Loading...'}

                </h1>
                <Link
                    href={`https://www.google.com/maps?q=${productData?.length > 0 ? productData[0].merchant.latitude : '0'},${productData?.length > 0 ? productData[0].merchant.longitude : '0'}`}

                >
                    <IconMapPin color="red" />
                </Link>
            </div>
            <div className="p-2 mt-2 w-full px-5 space-y-3">
                <div className="grid gap-4 content-center">
                    {loading ? (
                        <Loading />
                    ) : (
                        <div className="space-y-4">
                            {/* DataOrder.DataPorduct.products[0].merchant.longitude */}
                            {productData && productData.length > 0 ? (
                                productData.map((product) => (
                                    <div key={product.id} onClick={() => CreatOrde(product.id)} className="flex items-center px-[10px] w-full h-28 mx-auto cursor-pointer bg-white rounded-xl shadow-md overflow-hidden border border-green-500">
                                        <div className="flex justify-between w-full">
                                            <div className="flex-shrink-0 h-[90px]">
                                                <img src={`${process.env.NEXT_PUBLIC_URL_STORAGE}${product?.images[0]?.image_url}`} alt={`${product?.images[0]?.image_url}`} className="h-full w-28 object-cover bg-blue-500 rounded-lg" />
                                            </div>
                                            <div className="px-4 h-[90px] w-[208px]">
                                                <div>
                                                    <div className="uppercase tracking-wide text-[14px] text-primary font-bold overflow-hidden line-clamp-2">
                                                        {product.name}
                                                    </div>
                                                </div>
                                                <p className="mt-2 text-[8px] italic text-gray-500 overflow-hidden line-clamp-5">
                                                    {product.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-gray-500">No merchant products available</div> // Pesan jika tidak ada produk
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}



export { StepOne, StepTwo };
