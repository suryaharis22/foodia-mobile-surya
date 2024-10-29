import Header from "@/components/Header";
import Loading from "@/components/Loading";
import Error401 from "@/components/error401";
import { useAppState } from "@/components/page/UserContext";
import axios from "axios";
import moment from "moment/moment";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import LinkAja from "../../public/icon/payment/LinkAja.png";
import gopay from "../../public/icon/payment/gopay.png";
import {
  IconChevronDown,
  IconChevronUp,
  IconInfoCircle,
} from "@tabler/icons-react";
import Image from "next/image";
import { decryptId } from "@/utils/EndCodeHelper1";

const MetodePembayaran = () => {
  const router = useRouter();
  const { type } = router.query;

  const [metodePembayaran, setMetodePembayaran] = useState("");
  const { state, setDonation } = useAppState();
  const [pajak, setPajak] = useState(0);
  const [total, setTotal] = useState(0);
  const [titleCard, setTitleCard] = useState("");
  const [nominalDonasi, setNominalDonasi] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isDropdownMethodOpen, setIsDropdownMethodOpen] = useState(false);
  const [isDropdownChannelOpen, setIsDropdownChannelOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("");
  const [selectedChannel, setSelectedChannel] = useState("");
  const [selectedChannelLogo, setSelectedChannelLogo] = useState();
  const [donationRequired, setDonationRequired] = useState();
  const [formData2, setFormData] = useState();
  const [wallet_balance, setWalletBalance] = useState();
  const [methodOptions, setmethodOptions] = useState([]);
  const [hiddenName, setHiddenName] = useState(false);
  const admin_fee = 2500;
  const month = moment().format("YYYY-MM");

  const handleHiddenName = () => {
    setHiddenName(!hiddenName);
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
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
          setWalletBalance(response.data.body.agnostic_balance);
        })
        .catch((error) => {
          setLoading(false);
          Error401(error, router);
        });

      if (localStorage.getItem("prevPath") === "/mydonation") {
        setmethodOptions([
          {
            id: 1,
            value: "ewallet",
            label: "Ewallet",
          },
        ]);
      } else {
        setmethodOptions([
          {
            id: 2,
            value: "agnostic",
            label: "Tabunganku",
          },
          {
            id: 1,
            value: "ewallet",
            label: "Ewallet",
          },
        ]);
      }
    } else {
      setmethodOptions([
        {
          id: 1,
          value: "ewallet",
          label: "Ewallet",
        },
      ]);
    }
  }, []);

  const eWalletChannelOptions = [
    {
      id: 1,
      logo: LinkAja,
      value: "LinkAja",
      // label: "LinkAja",
    },
    // {
    //   id: 2,
    //   logo: gopay,
    //   value: "Gopay",
    //   // label: "Gopay",
    // },
  ];

  useEffect(() => {
    if (!state.donation.amount) {
      // Use SweetAlert to show a warning
      Swal.fire({
        icon: "error",
        title: "Nominal belum diisi",
        text: `Silakan coba kembali`,
        showConfirmButton: false,
        timer: 2000,
      });
      setTimeout(() => {
        router.push("/home");
        localStorage.removeItem("prevPath");
      }, 2000);
      return; // Stop execution if no amount
    }

    if (localStorage.getItem("prevPath") === "/mydonation") {
      setTitleCard("Tabungan Donasi");
    }

    setNominalDonasi(state.donation.amount);
    // setPajak(pajakAmount);
    setTotal(state.donation.amount);
  }, [state.donation]);

  const handleBayarSekarang = () => {
    setLoading(true);
    const data = {
      amount: state.donation.amount,
      total_amount: total,
      payment_channel:
        selectedMethod === "agnostic" ? "Tabunganku" : selectedChannel,
      success_url: `${process.env.NEXT_PUBLIC_URL_PAYMEN}`,
      detail: {
        campaign_name: state.donation.detail.campaign_name,
        campaign_id: state.donation.detail.campaign_id,
        description: state.donation.detail.description,
        donation_type: state.donation.detail.donation_type,
      },
      hide_name: hiddenName,
    };
    const token = localStorage.getItem("token");
    axios
      .post(`${process.env.NEXT_PUBLIC_API_BASE_URL}donation/payment`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        // setLoading(true);
        const responeUrl =
          selectedMethod === "agnostic"
            ? response.data.body.channel_properties.success_redirect_url
            : response.data.body.actions.desktop_web_checkout_url;
        localStorage.setItem("external_id", response.data.body.external_id);
        localStorage.setItem("prevPath", "payment_reciept");
        router.push(`${responeUrl}`);
      })
      .catch((error) => {
        setLoading(false);
        const messages = {
          title: "Donasi gagal",
          text: "Gagal Membuat Donasi Mohon Coba Lagi",
        };
        Error401(error, router, messages);
      });
  };



  const formatRupiah = (amount) => {
    const formatter = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    });

    return formatter.format(amount);
  };

  return (
    <div className="my-0 mx-auto max-w-480 bg-white flex flex-col h-screen">
      <Header title="Konfirmasi Donasi" />
      <div className="flex flex-col w-full pt-14 px-4 gap-3">
        <p className="text-black text-sm font-medium">
          Pilih Metode Pembayaran
        </p>
        <button
          onClick={() => {
            setIsDropdownMethodOpen(!isDropdownMethodOpen);
            setIsDropdownChannelOpen(false);
          }}
          className="flex flex-row items-center justify-between px-2 py-0 shadow-sm shadow-gray-400 text-gray-400 text-sm rounded-xl w-full focus:border-none"
        >
          <p
            className={`capitalize font-bold ${selectedMethod === "" ? "text-gray-400" : "text-black"
              }  pl-2 cursor-pointer outline-none py-4 bg-transparent focus:border-none`}
          >
            {selectedMethod === "" ? "Pilih Salah Satu..." : selectedMethod}
          </p>
          {isDropdownMethodOpen ? <IconChevronUp /> : <IconChevronDown />}
        </button>
        {isDropdownMethodOpen ? (
          <div className="flex flex-col px-4 py-0 shadow-sm shadow-gray-400 text-gray-400 text-sm rounded-xl w-full focus:border-none">
            {methodOptions.map((data, index) => (
              <div key={data.id} className="w-full flex justify-between">
                <button
                  onClick={() => {
                    setIsDropdownMethodOpen(false);
                    setSelectedMethod(data.value);
                    setSelectedChannel("");
                  }}
                  className="flex flex-row justify-between w-full items-center py-3 cursor-pointer "
                >
                  <label htmlFor="ewallet" className="font-bold text-black">
                    {data.label}
                  </label>
                  <input
                    type="radio"
                    id={data.value}
                    name="paymentOption"
                    value={data.value}
                    className="hidden"
                  />
                  <div
                    className={`w-[10px] h-[10px] ${data.value === selectedMethod && "bg-primary"
                      } rounded-full flex justify-center items-center`}
                  >
                    <div
                      className={`rounded-full p-2 ${data.value === selectedMethod && "border-primary"
                        } border-2`}
                    />
                  </div>
                </button>
                {index !== methodOptions.length - 1 ? <hr /> : ""}
              </div>
            ))}
          </div>
        ) : (
          ""
        )}
        {selectedMethod !== "" && (
          <>
            <button
              disabled={selectedMethod === "agnostic"}
              onClick={() => {
                setIsDropdownChannelOpen(!isDropdownChannelOpen);
                setIsDropdownMethodOpen(false);
              }}
              className={`flex flex-row items-center justify-between px-2 py-0 shadow-sm shadow-gray-400 text-gray-400 text-sm rounded-xl w-full focus:border-none ${selectedMethod === "agnostic"
                ? "bg-[#1D5882] cursor-normal"
                : ""
                }`}
            >
              {selectedMethod === "agnostic" ? (
                <>
                  <p
                    className={`font-bold text-xs text-white pl-2 outline-none py-4 focus:border-none`}
                  >
                    Nilai Tabungan
                  </p>
                  <p
                    className={`font-bold text-base text-white pl-2 outline-none py-4 focus:border-none pr-2`}
                  >
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(wallet_balance)}
                  </p>
                </>
              ) : (
                <>
                  <p
                    className={`capitalize font-bold ${selectedChannel === "" ? "text-gray-400" : "text-black"
                      }  pl-2 cursor-pointer outline-none py-4  focus:border-none`}
                  >
                    {selectedChannel === "" ? (
                      `Pilih ${selectedMethod}...`
                    ) : (
                      <p className="flex flex-row items-center gap-2">
                        <Image width={30} src={selectedChannelLogo} />
                        {selectedChannel}
                      </p>
                    )}
                  </p>
                  {isDropdownChannelOpen ? (
                    <IconChevronUp />
                  ) : (
                    <IconChevronDown />
                  )}
                </>
              )}
            </button>
            <p
              className={
                selectedMethod === "agnostic" && nominalDonasi > wallet_balance
                  ? "instructions italic text-[10px] flex items-center"
                  : "hidden"
              }
            >
              <IconInfoCircle size={15} className="mr-1 text-red-600" />
              <span className="text-red-600">Dana tidak cukup</span>
            </p>
          </>
        )}
        {isDropdownChannelOpen ? (
          <div className="flex flex-col px-4 py-0 shadow-sm shadow-gray-400 text-gray-400 text-sm rounded-xl w-full focus:border-none">
            {selectedMethod === "ewallet"
              ? eWalletChannelOptions.map((data, index) => (
                <>
                  <button
                    onClick={() => {
                      setIsDropdownChannelOpen(false);
                      setSelectedChannel(data.value);
                      setSelectedChannelLogo(data.logo);
                    }}
                    className="flex flex-row justify-between items-center cursor-pointer py-3 w-full"
                  >
                    <div className="flex items-center gap-2">
                      <Image width={30} src={data.logo} />
                      <label
                        htmlFor="ewallet"
                        className="font-bold text-black"
                      >
                        {data.value}
                      </label>
                    </div>
                    <input
                      type="radio"
                      id={data.value}
                      name="paymentOption"
                      value={data.value}
                      className="hidden"
                    />
                    <div
                      className={`w-[10px] h-[10px] ${data.value === selectedChannel && "bg-primary"
                        } rounded-full flex justify-center items-center`}
                    >
                      <div
                        className={`rounded-full p-2 ${data.value === selectedChannel && "border-primary"
                          } border-2`}
                      />
                    </div>
                  </button>
                  {index !== eWalletChannelOptions.length - 1 ? <hr /> : ""}
                </>
              ))
              : bankChannelOptions.map((data, index) => (
                <>
                  <button
                    onClick={() => {
                      setIsDropdownMethodOpen(false);
                      setSelectedChannel(data.value);
                      setSelectedChannelLogo(data.logo);
                    }}
                    className="flex flex-row justify-between items-center cursor-pointer py-3 w-full"
                  >
                    <div className="flex items-center gap-2">
                      <Image width={30} src={data.logo} />
                      <label
                        htmlFor="ewallet"
                        className="font-bold text-black"
                      >
                        {data.value}
                      </label>
                    </div>
                    <input
                      type="radio"
                      id={data.value}
                      name="paymentOption"
                      value={data.value}
                      className="hidden"
                    />
                    <div
                      className={`w-[10px] h-[10px] ${data.value === selectedChannel && "bg-primary"
                        } rounded-full flex justify-center items-center`}
                    >
                      <div
                        className={`rounded-full p-2 ${data.value === selectedChannel && "border-primary"
                          } border-2`}
                      />
                    </div>
                  </button>
                  {index !== bankChannelOptions.length - 1 ? <hr /> : ""}
                </>
              ))}
          </div>
        ) : (
          ""
        )}
      </div>
      <div className="container mx-auto pt-4">
        <div className="p-4 mobile-w h-56 mx-auto w-full max-w-screen-sm bg-white rounded-lg">
          <h1 className="text-xs font-medium">Rincian Donasi</h1>
          <div className="shadow-[rgba(0,0,13,0.5)_0px_0px_3px_0px] mt-3 p-3 rounded-lg">
            <div className="text-center font-bold">
              {titleCard !== ""
                ? titleCard
                : state.donation?.detail?.campaign_name}
            </div>
            <hr className="w-full mx-auto my-2 bg-gray-300 rounded" />
            <div className="flex justify-between">
              <h1 className="font-bold text-gray-400">Nominal Donasi</h1>
              <p className="font-semibold">{formatRupiah(nominalDonasi)}</p>
            </div>
            {/* <div className="flex justify-between">
                <h1 className="font-bold text-gray-400">
                  Biaya Pembayaran {"(2,5%)"}
                </h1>
                <p className="font-semibold">{formatRupiah(pajak)}</p>
              </div> */}
            <hr className="w-full mx-auto my-2 bg-gray-300 rounded" />
            <div className="flex justify-between">
              <h1 className="font-medium text-black">Total</h1>
              <p className="font-semibold text-primary">
                {formatRupiah(nominalDonasi)}
              </p>
            </div>
          </div>
          {type == "campaign-donation" && (
            <div className="flex justify-between items-center w-full mt-[10px]">
              <p className="text-[12px] font-semibold">Sembunyikan nama?</p>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={hiddenName}
                  onChange={handleHiddenName}
                />
                <div
                  className="relative w-[40px] h-[20px] bg-gray-200 rounded-full peer 
              dark:bg-[#A1A5C1] peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full 
              peer-checked:after:border-[#D9D9D9] after:content-[''] after:absolute after:top-[1px] after:start-[1px] 
              after:bg-[#D9D9D9] after:border-gray-300 after:border after:rounded-full after:h-[18px] after:w-[18px] after:transition-all 
              dark:border-[#A1A5C1] peer-checked:bg-primary"
                ></div>
              </label>
            </div>
          )}

        </div>
        <div className="text-center pt-20 mobile-w bottom-0 fixed px-6 py-5">
          <button
            disabled={
              selectedMethod === "" ||
              (selectedMethod !== "agnostic" && selectedChannel === "") ||
              (selectedMethod === "agnostic" && nominalDonasi > wallet_balance)
            }
            className={`${selectedMethod === "" ||
              (selectedMethod !== "agnostic" && selectedChannel === "") ||
              (selectedMethod === "agnostic" && nominalDonasi > wallet_balance)
              ? "bg-gray-400"
              : "bg-primary"
              } text-white w-full h-12 rounded-xl font-bold`}
            onClick={handleBayarSekarang}
          >
            Lanjutkan Pembayaran
          </button>
        </div>
      </div>
      {loading && <Loading />}
    </div>
  );
};

export default MetodePembayaran;
