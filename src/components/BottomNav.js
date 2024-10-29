import {
  IconSmartHome,
  IconSearch,
  IconBell,
  IconUser,
  IconQrcode,
  IconLogin,
  IconReceipt,
  IconMail,
} from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useAppState } from "./page/UserContext";
import Image from "next/image";
import bottomNav from "../../public/img/icon/BottomNavField.png";
import { usePathname } from "next/navigation";
import icon_agnostic from "../../public/img/icon/icon_agnostic.png";
import axios from "axios";
import Error401 from "./error401";

const BottomNav = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [token, setToken] = useState("");
  const { state, setDonation } = useAppState();
  const [nominalDonasi, setNominalDonasi] = useState(0);
  const [loading, setLoading] = useState(false);
  const [jumlahInbox, setJumlahInbox] = useState(0);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    // Fetch the token from localStorage when the component mounts
    if (storedToken) {
      setToken(storedToken);
    }
  }, [token]); // Empty dependency array to run once when the component mounts

  useEffect(() => {
    if (token) {
      setLoading(true);
      axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}inbox/list?inbox_type=donator`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          setJumlahInbox(response.data.body.total_unread);
          setLoading(false);
        })
        .catch((error) => {
          Error401(error, router);
          setLoading(false);
        });
    }
    else {
      setJumlahInbox(0);
      setLoading(false);
    }
  }, [token]);

  function formatNominal(value) {
    value = value.replace(/\D/g, "");
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  const showSweetAlert = () => {
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
          if (nominal < 1000 || nominalInput.value === "") {
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
                <p class="text-md font-bold">Pilih Nominal Tabungan Donasi</p>
                <div class="flex flex-col space-y-4 pt-5">
                    <label>
                        <input type="radio" name="donation" class="hidden peer" value="20000" />
                        <div class="cursor-pointer peer-checked:bg-blue-900 peer-checked:text-white bg-gray-100 py-2 px-4 rounded-lg font-semibold">Rp 20.000</div>
                    </label>
                    <label>
                        <input type="radio" name="donation" class="hidden peer" value="50000" />
                        <div class="cursor-pointer peer-checked:bg-blue-900 peer-checked:text-white bg-gray-100 py-2 px-4 rounded-lg font-semibold">Rp 50.000</div>
                    </label>
                    <label>
                        <input type="radio" name="donation" class="hidden peer" value="100000" />
                        <div class="cursor-pointer peer-checked:bg-blue-900 peer-checked:text-white bg-gray-100 py-2 px-4 rounded-lg font-semibold">Rp 100.000</div>
                    </label>
                    <label>
                        <input type="radio" name="donation" class="hidden peer" value="200000" />
                        <div class="cursor-pointer peer-checked:bg-blue-900 peer-checked:text-white bg-gray-100 py-2 px-4 rounded-lg font-semibold">Rp 200.000</div>
                    </label>
                    <div class="bg-gray-100 p-3 rounded-lg">
                        <label class=" items-center text-base ">
                            Nominal Donasi Lainnya
                        </label>
                        <div class="pl-5 gap-4 flex flex-row items-center mt-2 bg-white text-sm rounded-xl focus:ring-blue-500 ">
                          <label class="w-6">Rp</label>
                          <input type="text" name="nominal" class="p-2.5 focus:border-blue-500 dark:placeholder-gray-400 outline-none w-full rounded-xl" > 
                        </div>
                    </div>
                </div>
            </div>
            `,
        width: "375px",
        showConfirmButton: true,
        confirmButtonText: "Donasi",
        confirmButtonColor: "#3FB648",
      })
      .then((result) => {
        if (result.isConfirmed) {
          const radioValue = document.querySelector(
            'input[name="donation"]:checked'
          );
          const nominalValue = document.querySelector('input[name="nominal"]');

          setLoading(true);
          if (!radioValue && nominalValue && nominalValue.value) {
            handleSubmit(nominalValue.value.replace(/\./g, ""));
          } else if (radioValue) {
            handleSubmit(radioValue.value);
          } else {
            Swal.fire("Error", "Pilih atau isi nominal donasi.", "error");
          }
        }
      });
  };

  const handleSubmit = (value) => {
    setNominalDonasi(parseInt(value));
    const data = {
      amount: parseInt(value),
      payment_channel: "",
      success_url: `${process.env.NEXT_PUBLIC_URL_PAYMEN}`,
      detail: {
        campaign_id: "",
        description: "Tabungan Donasi",
        donation_type: "agnostic",
      },
    };
    setDonation(data);
    setLoading(false);
    localStorage.setItem("prevPath", "/mydonation");
    router.push("/metode_pembayaran?type=agnostik");
  };

  return (
    <div className="mobile-w bg-transparent fixed flex justify-center h-24 bottom-0 w-full max-w-screen-sm ">
      <Image src={bottomNav} className="bg-transparent" layout="fill"></Image>
      <div
        className={`menu1 icon_nav hover:text-primary 
        ${pathname === "/home" ? "text-primary" : "text-gray-400"}
        `}
      >
        <Link className="items-center flex flex-col gap-1" href="/home">
          <IconSmartHome />
          <p className="text-xs">Home</p>
        </Link>
      </div>
      <div
        className={`menu2 icon_nav hover:text-primary 
        ${pathname === "/mydonation" ? "text-primary" : "text-gray-400"}
        `}
      >
        <Link
          href="/mydonation"
          className="items-center w-20 flex flex-col gap-1"
        >
          <IconReceipt />
          <p className="text-xs">My Donation</p>
        </Link>
      </div>
      <div
        className={`menu3 icon_nav hover:text-primary 
        ${pathname === "/inbox" ? "text-primary" : "text-gray-400"}
        `}
      >
        <Link className="items-center flex flex-col gap-1 static" href="/inbox">
          {jumlahInbox > 0 ? (
            <div className="absolute top-[-5px] right-[-5px] w-3 p-[10px] bg-red-500 h-3 rounded-full flex justify-center items-center">
              <p
                className="text-center font-semibold text-white"
                style={{ fontSize: "9px" }}
              >
                {jumlahInbox}

              </p>
            </div>
          ) : null}

          <IconMail />
          <p className="text-xs">Inbox</p>
        </Link>
      </div>
      {token ? (
        <div
          className={`menu4 icon_nav hover:text-primary 
        ${pathname === "/profile" ? "text-primary" : "text-gray-400"}
        `}
        >
          <Link className="items-center flex flex-col gap-1" href="/profile">
            <IconUser />
            <p className="text-xs">Profile</p>
          </Link>
        </div>
      ) : (
        <div
          className={`menu4 icon_nav hover:text-primary 
        ${pathname === "/profile" ? "text-primary" : "text-gray-400"}
        `}
        >
          <Link className="items-center flex flex-col gap-1" href="/login">
            <IconLogin />
            <p className="text-xs">Login</p>
          </Link>
        </div>
      )}
      <div className="lingkaran cursor-pointer" onClick={showSweetAlert}>
        <div className="iconQr flex items-stretch p-1">
          <Image
            src={"/img/icon/icon_agnostic.png"}
            alt="Girl in a jacket"
            width={30}
            height={30}
          />
        </div>
      </div>
    </div>
    // </div>
  );
};

export default BottomNav;
