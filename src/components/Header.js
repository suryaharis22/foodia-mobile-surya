import { IconArrowLeft, IconShare } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const Header = ({ title = "", backto = "", share = false }) => {
  const router = useRouter();
  const [id_camp, setIdCamp] = useState(0);

  useEffect(() => {
    if (share) {
      setIdCamp(router.query.id);
    }
  }, [share]);


  // Handle the back button click
  const handleBackButtonClick = () => {
    // Navigate back to the previous page
    localStorage.removeItem("prevPath");
    if (backto) {
      if (localStorage.getItem("prevPath") !== "payment_reciept") {
        localStorage.removeItem("prevPath");
      } else if (localStorage.getItem("prevPath") === "order_confirmation") {
        localStorage.removeItem("prevPath");
      } else if (localStorage.getItem("prevPath") === "beneficiaries") {
        localStorage.removeItem("prevPath");
      }
      if (localStorage.getItem("rejectData") === "Reject_Data") {
        localStorage.removeItem("rejectData");
        localStorage.removeItem("DataMerchant");
        localStorage.removeItem("DataVolunteer");
        localStorage.removeItem("DataBeneficiaries");
      }
      localStorage.removeItem("statusSaldo");
      // localStorage.removeItem("phone");
      localStorage.removeItem("merchantName");
      localStorage.removeItem("updatedAddress");
      localStorage.removeItem("uploadedFile");
      // localStorage.removeItem("phone");
      localStorage.removeItem("merchantName");
      localStorage.removeItem("updatedAddress");
      localStorage.removeItem("uploadedFile");
      localStorage.removeItem("fileName");
      router.push(backto);
    } else {
      router.back();
    }
  };

  const [test, setTest] = useState("");

  useEffect(() => {
    const checkScroll = () => {
      setTest(window.scrollY === 0);
    };
    window.addEventListener("scroll", checkScroll);
  }, [test]);

  const showSweetAlert = () => {
    const swal = Swal.mixin({
      customClass: {
        popup: "h-[322px] rounded-t-[25px]",
      },
      willOpen: () => {
        Swal.getPopup().classList.add("swal2-show-swipeup");
      },
      willClose: () => {
        Swal.getPopup().classList.add("swal2-show-swipedown");
      },
    });
    swal.fire({
      position: "bottom",
      html: `
            <div class="absolute px-24 ml-10 top-0 mt-4">
                <hr class="border border-gray-400 w-10 h-1 bg-gray-400 rounded-lg "/>
            </div>
            <div class="mt-4">
                <p class="text-md font-bold">Kirim ke</p>
                <div class="flex flex-col space-y-4 pt-5">

                <div class="flex justify-between items-center py-2 px-[32px] bg-[#F5F4F8] rounded-lg h-[52px]">
                  <div class="flex justify-center items-center ">
                    <img src="/icon/whatsapp.png" alt="Icon_Nominal" class="w-5 h-5"/>
                    <p class="text-[16px] font-normal ml-2.5">Whatsapp</p>
                  </div>
                  <img src="/icon/row-right.png" alt="Icon_Nominal" class="w-5 h-5 "/>
                </div>
                
                <div class="flex justify-between items-center py-2 px-[32px] bg-[#F5F4F8] rounded-lg h-[52px]">
                  <div class="flex justify-center items-center ">
                    <img src="/icon/tiktok.png" alt="Icon_Nominal" class="w-5 h-5"/>
                    <p class="text-[16px] font-normal ml-2.5">TikTok</p>
                  </div>
                  <img src="/icon/link.png" alt="Icon_Nominal" class="w-5 h-5 "/>
                </div>

                <div class="flex justify-between items-center py-2 px-[32px] bg-[#F5F4F8] rounded-lg h-[52px]">
                  <div class="flex justify-center items-center ">
                    <img src="/icon/tiktok.png" alt="Icon_Nominal" class="w-5 h-5"/>
                    <p class="text-[16px] font-normal ml-2.5">TikTok</p>
                  </div>
                  <img src="/icon/link.png" alt="Icon_Nominal" class="w-5 h-5 "/>
                </div>

                </div>
            </div>
            `,
      width: "375px",
      showConfirmButton: false,
      confirmButtonText: "Donasi",
      confirmButtonColor: "#3FB648",
    })
      .then((result) => {
      });
  };

  return (
    <nav className="bg-transparent fixed w-full z-20 top-0 left-0">
      <div className="mobile-w flex flex-wrap items-center justify-between mx-auto py-2 bg-white rounded-lg">
        {/* {title ? ( */}
        <div className="flex">
          <div className="flex relative">
            <button
              className="px-3 py-1 text-sm rounded-full text-primary "
              onClick={handleBackButtonClick}
            >
              <IconArrowLeft />
            </button>
          </div>
          <p className="text-lg font-semibold text-black">{title}</p>
        </div>
        {share && (

          <IconShare size={20} className="mr-2" onClick={showSweetAlert} />
        )}
      </div>
    </nav>
  );
};

export default Header;
