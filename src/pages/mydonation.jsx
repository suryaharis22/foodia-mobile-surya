import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import Error401 from "@/components/error401";
import axios from "axios";
import Link from "next/link";
import styles from "@/styles/Home.module.css";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import moment from "moment/moment";
import {
  IconChevronDown,
  IconCircle,
  IconCircle0Filled,
  IconCircleFilled,
} from "@tabler/icons-react";
import { encryptId } from "@/utils/EndCodeHelper1";

const mydonation = () => {
  const router = useRouter();
  const [data, setData] = useState();
  const [history, setHistory] = useState([]);
  const [month, setMonth] = useState(moment().format("YYYY-MM"));
  const [couponMonthOptions, setCouponMonthOptions] = useState([]);
  const [monthOptions, setMonthOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isChecked, setIsChecked] = useState();
  const [isCheckedSuccess, setIsCheckedSuccess] = useState();
  const [isOpenedMonthOptions, setIsOpenedMonthOptions] = useState(false);
  const [donationType, setDonationType] = useState("donasi");

  const toggleSwitch = () => {
    setIsChecked((prevState) => !prevState);
    axios
      .post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}wallet/agnostic-permission`,
        { is_permission_manage: !isChecked },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then(() => {
        setIsCheckedSuccess((prevState) => !prevState);
      })
      .catch((error) => {
        Error401(error, router);
      });
  };

  const getHistoryDonations = (month) => {
    setLoading(true);
    axios
      .get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL
        }donation/list?start=${month}-01&end=${month}-${new Date(
          moment(month, "YYYY-MM").format("YYYY"),
          moment(month, "YYYY-MM").format("MM"),
          0
        ).getDate()}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        setLoading(false);
        setData(response.data.body);
        if (response.data.body.is_permission_manage === 1) {
          setIsChecked(true);
          setIsCheckedSuccess(true);
        } else {
          setIsCheckedSuccess(false);
        }

        setMonthOptions(
          response.data.body.year_filters.sort(
            (a, b) => new Date(b) - new Date(a)
          )
        );

        const sortedData = response.data.body.donation_history.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        setHistory(sortedData);
      })
      .catch((error) => {
        setLoading(false);
        Error401(error, router);
      });
  };

  const getHistoryCoupons = (month) => {
    setLoading(true);
    axios
      .get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL
        }donation/coupon?start=${month}-01&end=${month}-${new Date(
          moment(month, "YYYY-MM").format("YYYY"),
          moment(month, "YYYY-MM").format("MM"),
          0
        ).getDate()}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        setLoading(false);
        setData(response.data.body);
        if (response.data.body.is_permission_manage === 1) {
          setIsChecked(true);
          setIsCheckedSuccess(true);
        } else {
          setIsCheckedSuccess(false);
        }

        setCouponMonthOptions(
          response.data.body.year_filters.sort(
            (a, b) => new Date(b) - new Date(a)
          )
        );

        const sortedData = response.data.body.donation_history.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        setHistory(sortedData);
      })
      .catch((error) => {
        setLoading(false);
        Error401(error, router);
      });
  };

  useEffect(() => {
    if (donationType === "donasi") {
      getHistoryDonations(month);
    } else {
      getHistoryCoupons(month);
    }
  }, []);

  const onChangeMonth = (bulan) => {
    setMonth(bulan);
    if (donationType === "donasi") {
      getHistoryDonations(bulan);
    } else {
      getHistoryCoupons(bulan);
    }
    setIsOpenedMonthOptions(!isOpenedMonthOptions);
  };

  return (
    <>
      <div className="overflow-hidden max-w-480 bg-white flex flex-col">
        {/* <Header title="Donasi Saya" backto="/home" /> */}
        <div className="bg-white h-screen px-4">
          <p className="text-center font-bold text-lg py-4">Donasi Saya</p>
          <div className="flex flex-row justify-evenly w-full">
            <button
              onClick={() => {
                setDonationType("donasi");
                getHistoryDonations(month);
              }}
              className={`${donationType === "donasi"
                ? "border-b-primary text-primary"
                : "border-b-transparent text-gray-400"
                } pb-2 border-b-2 w-full`}
            >
              Donasi
            </button>
            <button
              onClick={() => {
                setDonationType("kupon");
                getHistoryCoupons(month);
              }}
              className={` ${donationType === "kupon"
                ? "border-b-primary text-primary"
                : "border-b-transparent text-gray-400"
                } pb-2 border-b-2 w-full`}
            >
              Kupon
            </button>
          </div>

          {donationType === "donasi" && (
            <>
              <div className="bg-[#1D5882] w-full px-4 py-2 mt-2 rounded-xl">
                <div className="flex justify-between items-center text-white font-semibold text-base">
                  <div className="">
                    <p className="font-bold">Tabunganku</p>
                  </div>

                  <p className="">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(data?.agnostic_balance || 0)}
                  </p>
                </div>
              </div>
              <div className="bg-transparent w-full px-4 pb-2 mt-2 rounded-xl">
                <div className="flex justify-between items-center text-base">
                  <p className="text-sm font-bold">Izinkan Dikelola Foodia</p>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={isCheckedSuccess}
                      onChange={toggleSwitch}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>
              </div>
              <hr className="h-[2px] border-0 bg-gray-400 rounded-xl" />
              <div className="bg-primary w-full mt-2 px-4 py-2 flex flex-col gap-1 min-h-[22px] rounded-xl">
                <div className="flex justify-between text-white font-semibold text-base">
                  <p>Total Donasi</p>
                  <p>
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(data?.total_donation || 0)}
                  </p>
                </div>
                <hr className="mt-2 h-[1px] bg-white" />
                <div className="flex flex-row justify-between items-center">
                  <div className="flex flex-col gap-1 text-white font-semibold text-base">
                    <p>Donasi Bulan Ini</p>

                    <button
                      onClick={() =>
                        setIsOpenedMonthOptions(!isOpenedMonthOptions)
                      }
                      className="flex flex-row text-[12px] font-semibold text-white custom-select w-20 h-[25px] rounded-md bg-transparent border-[1px] border-white outline-none justify-between items-center px-[3.5px]"
                    >
                      <p>{moment(month, "YYYY-MM").format("MMM YYYY")}</p>
                      <IconChevronDown size={"17px"} />
                    </button>
                    {isOpenedMonthOptions && (
                      <div className="absolute overflow-auto flex flex-col top-[267px] items-start w-20 px-[3.5px] rounded-md bg-transparent border-[1px] bg-white outline-none">
                        {!monthOptions.includes(
                          moment(new Date()).format("YYYY-MM")
                        ) && (
                            <button
                              onClick={() => {
                                onChangeMonth(
                                  moment(new Date()).format("YYYY-MM")
                                );
                              }}
                              className={`${moment(new Date(), "YYYY-MM").format(
                                "MMM YYYY"
                              ) === moment(month, "YYYY-MM").format("MMM YYYY")
                                ? "text-primary"
                                : "text-black"
                                } text-[12px] w-full text-left font-semibold flex flex-row items-center justify-between`}
                            >
                              {moment(new Date(), "YYYY-MM").format("MMM YYYY")}
                              {moment(new Date(), "YYYY-MM").format(
                                "MMM YYYY"
                              ) ===
                                moment(month, "YYYY-MM").format("MMM YYYY") ? (
                                <IconCircleFilled
                                  className="mb-0.5 mr-0.5"
                                  color="green"
                                  size={"10px"}
                                />
                              ) : (
                                ""
                              )}
                            </button>
                          )}
                        {monthOptions.map((bulan, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              onChangeMonth(bulan);
                            }}
                            className={`${moment(bulan, "YYYY-MM").format("MMM YYYY") ===
                              moment(month, "YYYY-MM").format("MMM YYYY")
                              ? "text-primary"
                              : "text-black"
                              } text-[12px] w-full text-left font-semibold flex flex-row items-center justify-between`}
                          >
                            {moment(bulan, "YYYY-MM").format("MMM YYYY")}
                            {moment(bulan, "YYYY-MM").format("MMM YYYY") ===
                              moment(month, "YYYY-MM").format("MMM YYYY") ? (
                              <IconCircleFilled
                                className="mb-0.5 mr-0.5"
                                color="green"
                                size={"10px"}
                              />
                            ) : (
                              ""
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="text-white font-semibold">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(data?.donation_this_month || 0)}
                  </p>
                </div>
              </div>

              {loading ? (
                <div className={`${styles.card} `}>
                  {[...Array(4)].map((_, index) => (
                    <div key={index} className={`${styles.loadingCard}`}>
                      <div className={`${styles.shimmer}`}></div>
                    </div>
                  ))}
                </div>
              ) : data?.donation_history ? (
                <div className={`overflow-auto h-screen px-1 pb-[450px]`}>
                  {history.map((data, i) => (
                    <div
                      key={i}
                      className="w-full px-2 py-2 mt-2.5 rounded-lg shadow-[0px_0px_8px_0px_#00000024]"
                    >
                      <div className="flex justify-between items-center font-semibold text-[10px]">
                        <div className="">
                          <p className="font-bold">Tanggal Donasi</p>
                          <p className="italic">
                            {moment(data?.date).format("DD MMM YYYY HH:mm") +
                              " WIB"}
                          </p>
                        </div>
                        <p
                          className={`text-[16px] font-bold ${data.type_donation === "booster"
                            ? "text-[#1D5882]"
                            : "text-primary"
                            }`}
                        >
                          {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            minimumFractionDigits: 0,
                          }).format(data?.total || 0)}
                        </p>
                      </div>
                      <hr className="mt-2 h-[1px] bg-gray-100" />
                      <div className="py-1">
                        <h1 className=" font-bold text-sm">
                          {data?.campaign?.event_name}
                        </h1>
                        <p className=" font-normal text-xs">
                          {data?.campaign?.address}
                        </p>
                      </div>
                      {data.transaction && (
                        <>
                          <hr className="mt-2 h-[1px] bg-gray-100" />
                          <div className="flex justify-between items-center font-semibold text-xs mt-1 text-primary">
                            <button
                              onClick={() => {
                                localStorage.setItem("prevPath", "/mydonation");
                                router.push(
                                  `/bukti_pembayaran?external_id=${data?.transaction?.external_id}`
                                );
                              }}
                              class="text-xs font-semibold w-full focus:outline-none"
                            >
                              Detail Donasi
                            </button>
                            <hr class="w-1 h-5 bg-gray-100 mx-2" />
                            <button
                              onClick={() => {
                                localStorage.setItem("prevPath", "/mydonation");
                                router.push(`/campaign/${data?.campaign?.id}`);
                              }}
                              class="text-xs font-semibold w-full focus:outline-none"
                            >
                              Campaign
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p
                  className={`mt-26 text-sm text-[#A1A5C1] items-center justify-center flex flex-col h-[50%]`}
                >
                  Yuk bantu saudara kita dengan
                  <p> berdonasi :&#41;</p>
                </p>
              )}
            </>
          )}

          {donationType === "kupon" && (
            <>
              <div className="bg-gradient-to-b from-[#FF2F2F] to-[#FFBD5B] w-full mt-2 px-4 py-2 flex flex-col gap-1 min-h-[22px] rounded-xl">
                <div className="flex justify-between text-white font-semibold text-base">
                  <p>Donasi Kupon</p>
                  <p>
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(data?.total_donation || 0)}
                  </p>
                </div>
                <hr className="mt-2 h-[1px] bg-white" />
                <div className="flex flex-row justify-between items-center">
                  <div className="flex flex-col gap-1 text-white font-semibold text-base">
                    <p>Diklaim Bulan Ini</p>

                    <button
                      onClick={() =>
                        setIsOpenedMonthOptions(!isOpenedMonthOptions)
                      }
                      className="flex flex-row text-[12px] font-semibold text-white custom-select w-20 h-[25px] rounded-md bg-transparent border-[1px] border-white outline-none justify-between items-center px-[3.5px]"
                    >
                      <p>{moment(month, "YYYY-MM").format("MMM YYYY")}</p>
                      <IconChevronDown size={"17px"} />
                    </button>
                    {isOpenedMonthOptions && (
                      <div className="absolute overflow-auto flex flex-col top-[179px] items-start w-20 px-[3.5px] rounded-md bg-transparent border-[1px] bg-white outline-none">
                        {!couponMonthOptions?.includes(
                          moment(new Date()).format("YYYY-MM")
                        ) && (
                            <button
                              onClick={() => {
                                onChangeMonth(
                                  moment(new Date()).format("YYYY-MM")
                                );
                              }}
                              className={`${moment(new Date(), "YYYY-MM").format(
                                "MMM YYYY"
                              ) === moment(month, "YYYY-MM").format("MMM YYYY")
                                ? "text-primary"
                                : "text-black"
                                } text-[12px] w-full text-left font-semibold flex flex-row items-center justify-between`}
                            >
                              {moment(new Date(), "YYYY-MM").format("MMM YYYY")}
                              {moment(new Date(), "YYYY-MM").format(
                                "MMM YYYY"
                              ) ===
                                moment(month, "YYYY-MM").format("MMM YYYY") ? (
                                <IconCircleFilled
                                  className="mb-0.5 mr-0.5"
                                  color="green"
                                  size={"10px"}
                                />
                              ) : (
                                ""
                              )}
                            </button>
                          )}
                        {couponMonthOptions?.map((bulan, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              onChangeMonth(bulan);
                            }}
                            className={`${moment(bulan, "YYYY-MM").format("MMM YYYY") ===
                              moment(month, "YYYY-MM").format("MMM YYYY")
                              ? "text-primary"
                              : "text-black"
                              } text-[12px] w-full text-left font-semibold flex flex-row items-center justify-between`}
                          >
                            {moment(bulan, "YYYY-MM").format("MMM YYYY")}
                            {moment(bulan, "YYYY-MM").format("MMM YYYY") ===
                              moment(month, "YYYY-MM").format("MMM YYYY") ? (
                              <IconCircleFilled
                                className="mb-0.5 mr-0.5"
                                color="green"
                                size={"10px"}
                              />
                            ) : (
                              ""
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="text-white font-semibold">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(data?.donation_this_month || 0)}
                  </p>
                </div>
              </div>

              {loading ? (
                <div className={`${styles.card} `}>
                  {[...Array(4)].map((_, index) => (
                    <div key={index} className={`${styles.loadingCard}`}>
                      <div className={`${styles.shimmer}`}></div>
                    </div>
                  ))}
                </div>
              ) : data?.donation_history ? (
                <div className={`overflow-auto h-screen px-1 pb-[400px]`}>
                  {history?.map((data) => (
                    <div className="w-full px-2 py-2 mt-2.5 rounded-lg shadow-[0px_0px_8px_0px_#00000024]">
                      <div className="flex justify-between items-center font-semibold text-[10px]">
                        <div className="">
                          <p className="font-bold">Tanggal Transaksi</p>
                          <p className="italic">
                            {/* {moment(data?.date).format("DD MMM YYYY HH:mm") +
                          " WIB"} */}
                            {moment(data.date).format("DD MMM YYYY HH:mm") +
                              " WIB"}
                          </p>
                        </div>
                        <p
                          className={`text-[16px] font-bold bg-gradient-to-b from-[#FF2F2F] to-[#FFBD5B] inline-block text-transparent bg-clip-text`}
                        >
                          {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            minimumFractionDigits: 0,
                          }).format(data?.total || 0)}
                        </p>
                      </div>
                      <hr className="mt-2 h-[1px] bg-gray-100" />
                      <div className="py-1">
                        <h1 className=" font-bold text-sm">
                          {data?.description}
                        </h1>
                        <p className=" font-normal text-xs">{data?.address}</p>
                      </div>
                      <hr className="mt-2 h-[1px] bg-gray-100" />
                      <div class="flex justify-between items-center font-semibold text-xs mt-1 text-primary">
                        <button
                          onClick={() => {
                            // localStorage.setItem("prevPath", "/mydonation");
                            router.push(
                              `/merchant/kupon/claimed/${data.coupon_transaction_id}`
                            );
                          }}
                          class="text-xs font-semibold w-full focus:outline-none"
                        >
                          Laporan Transaksi Klaim Kupon
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p
                  className={`mt-26 text-sm text-[#A1A5C1] items-center justify-center flex flex-col h-[50%]`}
                >
                  Belum ada transaksi kupon
                </p>
              )}
            </>
          )}
        </div>
      </div>
      {loading && <Loading />}
      <BottomNav />
    </>
  );
};

export default mydonation;
