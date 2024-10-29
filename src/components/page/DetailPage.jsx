import {
  IconArrowNarrowRight,
  IconChevronDown,
  IconChevronUp,
  IconClock,
  IconClockFilled,
  IconMapPin,
  IconUser,
} from "@tabler/icons-react";
import moment from "moment/moment";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Loading from "../Loading";
import { useAppState } from "./UserContext";
import Error401 from "../error401";
import axios from "axios";
import { decryptId } from "@/utils/EndCodeHelper1";

const DetailCamp = ({ data }) => {
  const router = useRouter();
  const idCamp = router.query.id;
  const [showFullText, setShowFullText] = useState(false);
  const [loading, setloading] = useState(true);
  const [merchantReportLength, setMerchantReportLength] = useState();
  const [detonatorReportLength, setDetonatorReportLength] = useState();
  const { state, setDonation } = useAppState();
  const [nominalDonasi, setNominalDonasi] = useState(0);

  useEffect(() => {
    const fetchReports = async (type) => {
      const queryParams = new URLSearchParams({
        campaign_id: idCamp,
        type: type,
      });

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}campaign-report/filter?${queryParams.toString()}`
        );
        return response.data.body.length;
      } catch (error) {
        Error401(error, router);
        return 0;
      }
    };

    const fetchAllReports = async () => {
      setloading(true);

      // Fetch merchant report
      const merchantLength = await fetchReports('merchant');
      setMerchantReportLength(merchantLength);

      // Fetch detonator report
      const detonatorLength = await fetchReports('detonator');
      setDetonatorReportLength(detonatorLength);

      setloading(false);
    };

    if (idCamp) {
      fetchAllReports();
    }
  }, [idCamp, router]);


  const toggleReadMore = () => {
    setShowFullText((prevShowFullText) => !prevShowFullText);
  };

  const formatUang = (nominal) => {
    const formatter = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    });

    return formatter.format(nominal);
  };

  const calculateRemainingTime = (eventDate) => {
    const currentDate = new Date();
    const eventDateObject = new Date(eventDate);
    const timeDifference = eventDateObject - currentDate;

    // Calculate remaining time in days
    const remainingDays = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

    return remainingDays;
  };



  const showSweetAlert = async () => {
    const swal = Swal.mixin({
      customClass: {
        popup: "custom-swal",
        icon: "custom-icon-swal",
        confirmButton: "custom-confirm-button-swal", // Custom class for styling
      },
      willOpen: () => {
        Swal.getPopup().classList.add("swal2-show-swipeup");
      },
      willClose: () => {
        Swal.getPopup().classList.add("swal2-show-swipedown");
      },
      didRender: () => {
        let nominal;
        let radios;
        const nominalInput = document.querySelector('input[name="nominal"]');
        const donationRadios = document.querySelectorAll(
          'input[name="donation"]'
        );

        // Menambahkan event listener untuk setiap radio button nominal
        donationRadios.forEach((radio) => {
          radio.addEventListener("click", () => {
            // Menghapus nilai input nominal jika opsi nominal dipilih
            nominalInput.value = "";
            if (!radio.checked) {
              Swal.getConfirmButton().style.backgroundColor = "#a0aec0";
              Swal.disableButtons();
            } else {
              Swal.getConfirmButton().style.backgroundColor = "#3FB648";
              Swal.enableButtons();
            }
          });
        });

        // Menghapus nilai input nominal jika pengguna mulai mengetik di dalamnya
        nominalInput.addEventListener("input", () => {
          // Format input nominal dengan titik setiap 3 digit
          nominalInput.value = formatNominal(nominalInput.value);
          donationRadios.forEach((radio) => {
            radio.checked = false;
          });
          nominal = parseInt(nominalInput.value.replace(/\./g, ""));
          if (
            nominal + data.donation_collected > data.donation_target ||
            nominal < 1000 ||
            nominalInput.value === ""
          ) {
            Swal.getConfirmButton().style.backgroundColor = "#a0aec0";
            Swal.disableButtons();
          } else {
            Swal.getConfirmButton().style.backgroundColor = "#3FB648";
            Swal.enableButtons();
          }
        });
        if (radios == undefined || nominalInput.value === "") {
          Swal.getConfirmButton().style.backgroundColor = "#a0aec0";
          Swal.disableButtons();
        }
      },
    });
    swal
      .fire({
        position: "bottom",
        html: `
      <div class="absolute px-24 ml-10 top-0 mt-4">
      <hr class="border border-gray-400 w-10 h-1 bg-gray-400 rounded-lg "/>
    </div>
    <div class="mt-4">
      <p class="text-md font-bold">Pilih Nominal Donasi</p>
      <div class="flex flex-col space-y-2 pt-5">
      <label>
        <input type="radio" name="donation" id="donation_20000" class="hidden peer" value="20000"  ${20000 + data.donation_collected > data.donation_target
            ? "disabled"
            : ""
          }/>
        <div class=" ${data.donation_collected + 20000 > data.donation_target
            ? "cursor-not-allowed bg-gray-300"
            : "cursor-pointer peer-checked:bg-blue-900 peer-checked:text-white bg-gray-100"
          }   py-2 px-4 rounded-lg font-semibold">Rp 20.000</div>
      </label>
      <label>
          <input  type="radio" name="donation" id="donation_50000" class="hidden peer" value="50000"  ${50000 + data.donation_collected > data.donation_target
            ? "disabled"
            : ""
          }/>
          <div class=" ${data.donation_collected + 50000 > data.donation_target
            ? "cursor-not-allowed bg-gray-300"
            : "cursor-pointer peer-checked:bg-blue-900 peer-checked:text-white bg-gray-100"
          }   py-2 px-4 rounded-lg font-semibold">Rp 50.000</div>
      </label>
      <label>
      <input  type="radio" name="donation" id="donation_100000" class="hidden peer" value="100000"  ${100000 + data.donation_collected > data.donation_target
            ? "disabled"
            : ""
          }/>
      <div class=" ${data.donation_collected + 100000 > data.donation_target
            ? "cursor-not-allowed bg-gray-300"
            : "cursor-pointer peer-checked:bg-blue-900 peer-checked:text-white bg-gray-100"
          }   py-2 px-4 rounded-lg font-semibold">Rp 100.000</div>
      </label>
      <label>
          <input  type="radio" name="donation" id="donation_200000" class="hidden peer" value="200000"  ${200000 + data.donation_collected > data.donation_target
            ? "disabled"
            : ""
          }/>
          <div class=" ${data.donation_collected + 200000 > data.donation_target
            ? "cursor-not-allowed bg-gray-300"
            : "cursor-pointer peer-checked:bg-blue-900 peer-checked:text-white bg-gray-100"
          }   py-2 px-4 rounded-lg font-semibold">Rp 200.000</div>
      </label>
        <div class="bg-gray-100 p-3 rounded-lg">
          <label class=" items-center text-base ">
            Nominal Donasi Lainnya
          </label>
          <div class="pl-5 gap-4 flex flex-row items-center mt-2 bg-white text-sm rounded-xl focus:ring-blue-500 ">
            <label class="w-6">Rp</label>
            <input type="text" name="nominal" class="p-2.5 focus:border-blue-500 dark:placeholder-gray-400 outline-none w-full rounded-xl" > 
          </div>
          <p class="text-xs pt-2 text-primary font-semibold">Sisa maksimal donasi Rp. ${new Intl.NumberFormat(
            "id-ID"
          ).format(data.donation_target - data.donation_collected)}
          </p>
        </div>
      </div>
    </div>
        `,
        width: "375px",
        showConfirmButton: true,
        confirmButtonText: "Donasi",
        confirmButtonColor: "#3FB648",
        preConfirm: () => {
          const radioValue = document.querySelector(
            'input[name="donation"]:checked'
          );
          if (!radioValue) {
            const nominalValue = document.querySelector(
              'input[name="nominal"]'
            );
            if (nominalValue && nominalValue.value) {
              handleSubmit(nominalValue.value.replace(/\./g, ""));
            } else {
              return "input nominal value";
            }
          } else {
            handleSubmit(radioValue.value);
          }
        },
      })
      .then((result) => {
        if (result.isConfirmed) {
          const radioValue = document.querySelector(
            'input[name="donation"]:checked'
          );
          const nominalValue = document.querySelector('input[name="nominal"]');
          if (!radioValue && nominalValue && nominalValue.value) {
            handleSubmit(nominalValue.value.replace(/\./g, ""));
          } else if (radioValue) {
            handleSubmit(radioValue.value);
          } else {
            Swal.fire(
              "Melewati Target Donasi",
              "Nominal donasi tidak dapat melebihi target donasi.",
              "error"
            );
          }
        }
      });
  };

  function formatNominal(value) {
    value = value.replace(/\D/g, "");
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  const handleSubmit = (value) => {
    setNominalDonasi(parseInt(value));
    const totalDonasi = parseInt(data.donation_collected);
    const DonasiNominal = parseInt(value);
    if (data.donation_target < totalDonasi + DonasiNominal) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `Donasi melebihi batas target`,
      });
    } else {
      const datas = {
        amount: parseInt(value),
        payment_channel: "",
        success_url: `${process.env.NEXT_PUBLIC_URL_PAYMEN}`,
        detail: {
          campaign_name: data?.event_name,
          campaign_id: idCamp,
          description: "Donation",
          donation_type: "campaign",
        },
      };
      setDonation(datas);
      // localStorage.setItem("prevPath", "DetailPage");
      router.push("/metode_pembayaran?type=campaign-donation");
    }
  };

  const cart = data?.campaign_donation || [];
  const [showAll, setShowAll] = useState(false);

  // Mengurutkan item dalam keranjang belanja
  const sortedCart = [...cart].reverse();

  const calculateTimeAgo = (createdAt) => {
    const now = new Date();
    const createdAtDate = new Date(createdAt);
    const difference = now - createdAtDate;

    const seconds = Math.floor(difference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return ` ${days} hari lalu`;
    } else if (hours > 0) {
      return ` ${hours} jam lalu`;
    } else if (minutes > 0) {
      return ` ${minutes} menit lalu`;
    } else {
      return ` ${seconds} detik lalu`;
    }
  };

  const formatToRupiah = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };
  let percentageCollected = 0;
  data?.donation_target > 0
    ? (percentageCollected =
      (data.donation_collected / data.donation_target) * 100)
    : (percentageCollected = 0);

  const totalCollected = (percentageCollected) => {
    if (percentageCollected === undefined || percentageCollected === null) {
      return 0;
    } else if (percentageCollected > 100) {
      return 100;
    } else {
      return percentageCollected;
    }
  };

  const censorName = (name) => {
    const nameParts = name.split(" ");
    return nameParts.map((part) => `${part[0]}***`).join(" ");
  };

  const remainingDays = calculateRemainingTime(data?.event_date);
  return (
    <>
      {loading ? <Loading /> : <div className="container mx-auto pt-24 bg-white h-full">
        <div className="place-content-center px-4">
          <img
            src={`${process.env.NEXT_PUBLIC_URL_STORAGE}${data?.image_url}`}
            alt=""
            className="rounded-lg"
            style={{ width: "390px", height: "195px", objectFit: "cover" }}
          />
        </div>
        <div className="items-start justify-start px-4 mt-0 p-2 flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <h1 className="font-extrabold text-[19px]">{data?.event_name}</h1>
            <span className=" text-sm font-bold">
              Tanggal Kegiatan :
              {moment(data?.event_date).format(" DD MMM YYYY") +
                " " +
                data?.event_time +
                " WIB"}
            </span>
            <div className="flex flex-row justify-center items-center mb-1 gap-5">
              <p className="text-sm font-normal">{data?.address}</p>
              <Link
                href={`/lokasi_camp/${idCamp}`}
                className="text-sm font-normal mb-4 text-red-500"
              >
                <IconMapPin />
              </Link>
            </div>
          </div>
          <div className="w-full">
            <div className="flex justify-between">
              <p className="font-semibold text-sm">
                Target Donasi :
                <span className="font-bold text-[#1D5882] ml-1">
                  {formatUang(data?.donation_target ? data?.donation_target : 0)}
                </span>
              </p>
              <div className="flex items-center text-[#1D5882]  text-sm">
                <IconClock size={11} />
                <p className=" ml-1">
                  {remainingDays > 0 ? remainingDays : 0} Hari
                </p>
              </div>
            </div>
            <div className="flex justify-between">
              <p className="font-semibold text-sm">
                Donasi Terkumpul :
                <span className=" text-sm font-bold text-[#1D5882] ml-1">
                  {formatUang(
                    data?.donation_collected > data?.donation_target
                      ? data?.donation_target
                      : data?.donation_collected
                        ? data?.donation_collected
                        : 0
                  )}
                </span>
              </p>
            </div>
            {/* <div className="flex justify-between px-1.5 items-center ">
              <div className="w-full rounded-full h-2.5 bg-gray-200">
                <div
                  className="bg-primary h-2.5 rounded-full w-max-"
                  style={{
                    width: `${totalCollected(percentageCollected)}%`,
                    maxWidth: "100%",
                  }}
                ></div>
              </div>
              <p className="text-primary  ml-1 mb-1 text-xs">
                {totalCollected(percentageCollected).toFixed()}%
              </p>
            </div> */}
            <button
              disabled={
                data?.campaign_status === "FINISHED" || remainingDays < 1
              }
              onClick={showSweetAlert}
              className={`w-full h-14 mt-4 text-white rounded-2xl inline-flex items-center justify-center px-2.5 py-2.5 ${data?.campaign_status === "FINISHED" || remainingDays < 1
                ? "bg-gray-400"
                : "bg-primary"
                } font-bold text-lg`}
            >
              Donasi
            </button>
          </div>
        </div>
        <hr className="w-full h-1 mx-auto mt-2 bg-gray-300 border-0" />
        <div className="items-center justify-center mt-1 w-full">
          {/* Detonator */}
          <div
            href={`/food/${idCamp}`}
            className="w-full h-16  px-4 bg-white hover:bg-gray-100  text-black rounded-lg inline-flex items-center py-2.5 "
          >
            <div className="flex justify-between w-full">
              <div className="flex">
                {/* <IconSoup className=" w-7 h-7" /> */}
                <div className="w-12 h-12 rounded-full bg-blue-100 grid place-items-center mr-2 text-blue-600">
                  {data?.detonator?.self_photo ? (
                    <img
                      src={`${process.env.NEXT_PUBLIC_URL_STORAGE}${data?.detonator.self_photo}`}
                      className="grid grid-cols-3 gap-4 place-items-end text-gray-500 w-12 h-12 object-cover rounded-full"
                      alt="NotFound"
                      width={100}
                      height={100}
                    />
                  ) : (
                    <IconUser className="grid grid-cols-3 gap-4 place-items-end text-gray-500" />
                  )}
                </div>
                <div className="text-left place-items-start">
                  <div className="mb-1 text-primary">
                    {data?.detonator?.oauth?.fullname}
                  </div>
                  <div className="-mt-1  text-xs text-gray-500">
                    Verified Campaigner{" "}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <hr className="w-80 h-0.5 mx-auto mt-2 mb-2 bg-gray-100 border-0 rounded" />
          {/* Merchants */}
          <Link
            onClick={() => localStorage.setItem("prevPath", "/home")}
            href={`/food/${idCamp}`}
            className="w-full h-16 bg-white hover:bg-gray-100 px-4 text-black rounded-lg inline-flex items-center py-2.5 "
          >
            <div className="flex justify-between w-full">
              <div className="flex">
                {/* <IconSoup className=" w-7 h-7" /> */}
                <div className="w-12 h-12 rounded-full bg-blue-100 grid place-items-center mr-2 text-blue-600">
                  <img
                    src="/img/icon/icon_food_order.png"
                    alt=""
                    className="w-8 h-8"
                  />
                </div>
                <div className="text-left place-items-start">
                  <div className="mb-1 text-primary">Lacak Merchant</div>
                  <div className="-mt-1  text-xs text-gray-500">
                    {data?.orders ? data.orders.length : 0} Verified Merchants{" "}
                  </div>
                </div>
              </div>
              <div className="grid place-items-center">
                <IconArrowNarrowRight className=" grid grid-cols-3 gap-4 place-items-end text-gray-500" />
              </div>
            </div>
          </Link>

          <hr className="w-full h-1 mx-auto mt-2 bg-gray-300 border-0 rounded" />
          <Link
            href={`/report/${idCamp}`}
            className="w-full h-16  px-4 bg-white hover:bg-gray-100  text-black rounded-lg inline-flex items-center  py-2.5 mt-2 "
          >
            <div className="flex justify-between w-full">
              <div className="flex">
                <div className="text-left place-items-start">
                  <div className="mb-1 text-primary flex">
                    Laporan Kegiatan{" "}
                    <div className="bg-[#DE0606] px-1 rounded-xl ml-2 flex items-center justify-center">
                      <p className="text-xs font-bold flex items-center justify-center text-white">
                        {detonatorReportLength + merchantReportLength || 0}
                      </p>
                    </div>
                  </div>
                  <div className="-mt-1  text-xs text-gray-500">
                    Terakhir Update{" "}
                    {moment(data?.updated_at).format("DD MMM YYYY")}
                  </div>
                </div>
              </div>
              <div className="grid place-items-center">
                <IconArrowNarrowRight className=" grid grid-cols-3 gap-4 place-items-end text-gray-500" />
              </div>
            </div>
          </Link>
        </div>
        <hr className="w-full h-1 mx-auto mt-2 bg-gray-300 border-0" />
        <div className="block mt-1 p-2 bg-white max-w-full px-4">
          <h5 className="mb-2 text-md tracking-tight text-primary">
            Tentang Program
          </h5>
          <p
            className={`font-normal text-gray-700 text-xs ${!showFullText && "truncate"
              }`}
          >
            {data?.description}
          </p>
          <hr className="w-full h-0.5 mx-auto mt-2 bg-gray-100 border-0 rounded" />
          {data?.description?.length > 49 && (
            <div className="bg-white grid place-content-center rounded-sm text-primary text-xs mt-2">
              {showFullText ? (
                <button className="flex" onClick={toggleReadMore}>
                  Lebih Sedikit <IconChevronUp size={20} />
                </button>
              ) : (
                <button className="flex" onClick={toggleReadMore}>
                  Selengkapnya <IconChevronDown size={20} />
                </button>
              )}
            </div>
          )}
        </div>
        <hr className="w-full h-1 mx-auto mt-2 bg-gray-300 border-0" />
        <div className="w-full rounded-lg items-center px-4 py-2.5 mt-4">
          <div className="flex mb-4">
            <p className="text-base font-bold text-black">Donatur</p>
            <div className="bg-primary px-1 rounded-xl ml-2 flex items-center justify-start">
              <p className="text-xs font-bold flex items-center justify-center text-white">
                {cart.length}
              </p>
            </div>
          </div>
          {/* Looping untuk menampilkan item yang dimuat dalam keranjang belanja */}
          {(showAll ? sortedCart : sortedCart.slice(0, 4)).map(
            (item, index) => (
              <div
                key={index}
                className="w-full h-16 text-black flex flex-col mb-1 items-center"
              >
                <div className="flex justify-between w-full rounded-lg">
                  <div className="flex">
                    {/* <IconSoup className=" w-7 h-7" /> */}
                    <div className="w-12 h-12 rounded-full bg-blue-100 grid place-items-center mr-2 text-blue-600">
                      <img src="/icon/user.png" alt="" className="w-6 h-6" />
                    </div>
                    <div className="text-left place-items-start">
                      {item.transaction.hide_name === 1 ? (
                        <div className="text-primary text-sm font-bold">
                          {" "}
                          {censorName(item.transaction.sender_name)}
                        </div>
                      ) : (
                        <div className="text-primary text-sm font-bold">
                          {" "}
                          {item.transaction.sender_name}
                        </div>
                      )}
                      {/* {censorName(item.transaction.sender_name)} */}
                      <div className=" text-xs text-gray-500">
                        Berdonasi Sebesar{" "}
                        <span className="font-bold">
                          {formatUang(item.amount ? item.amount : 0)}
                        </span>
                      </div>
                      <div className="flex mt-1  text-xs items-center gap-1 text-gray-500">
                        <IconClockFilled size={12} className="mt-0.5" />
                        {calculateTimeAgo(item.created_at)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
          <hr className="w-full h-0.5 mx-auto mt-2 bg-gray-100 border-0 rounded" />
          <div className="block mt-1 p-2 ">
            <div className="bg-white grid place-content-center rounded-sm text-primary text-xs mt-2">
              {!showAll && cart.length > 4 ? (
                <button
                  className="flex focus:outline-none"
                  onClick={() => setShowAll(true)}
                >
                  Selengkapnya <IconChevronDown size={20} />
                </button>
              ) : (
                showAll &&
                cart.length > 4 && (
                  <button
                    className="flex focus:outline-none"
                    onClick={() => setShowAll(false)}
                  >
                    Lebih Sedikit <IconChevronUp size={20} />
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </div>}


    </>
  );
};

export default DetailCamp;
