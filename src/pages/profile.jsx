import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import styles from "@/styles/Home.module.css";
import Error401 from "@/components/error401";
import ProfileDetonator from "@/components/page/Profile/ProfileDetonator";
import ProfileMerchant from "@/components/page/Profile/ProfileMerchant";
import {
  IconChevronRight,
  IconEdit,
  IconQuestionMark,
  IconUser,
} from "@tabler/icons-react";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Profile = () => {
  const router = useRouter();
  const [role, setRole] = useState("");
  const [dataUser, setDataUser] = useState();
  const [dataRegister, setDataRegister] = useState("");

  const [isMerchant, setIsMerchant] = useState(false);
  const [merchantStatus, setMerchantStatus] = useState("");
  const [merchantId, setMerchantId] = useState();

  const [isDetonator, setIsDetonator] = useState(false);
  const [detonatorStatus, setDetonatorStatus] = useState("");
  const [detonatorId, setDetonatorId] = useState();

  const [isBeneficiary, setIsBeneficiary] = useState(false);
  const [beneficiariesStatus, setBeneficiariesStatus] = useState("");
  const [beneficiariesId, setBeneficiariesId] = useState();

  const [loading, setLoading] = useState(true);

  const fetchProfileData = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}auth/profile/fetch`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setDataUser(res.data.body);
      setRole(res.data.body.role);
    } catch (error) {
      Error401(error, router);
    } finally {
      setLoading(false);
    }
  };

  const fetchRegisterStatus = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}auth/check-register-status`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setDataRegister(response.data.body);

      const cekData = response.data.body;
      // Menangani Detonator
      setIsDetonator(!!cekData.detonator);
      if (cekData.detonator) {
        setDetonatorId(cekData.detonator.detonator_id);
        setDetonatorStatus(
          cekData.detonator.status === "approved" ? "Verified Detonator" :
            cekData.detonator.status === "waiting" ? "Waiting For Verification" :
              "Rejected"
        );
      }

      // Menangani Merchant
      setIsMerchant(!!cekData.merchant);
      if (cekData.merchant) {
        setMerchantId(cekData.merchant.merchant_id);
        setMerchantStatus(cekData.merchant.status);
      }

      // Menangani Beneficiaries
      setIsBeneficiary(!!cekData.beneficiary); // Memeriksa keberadaan data beneficiary
      if (cekData.beneficiary) {
        setBeneficiariesId(cekData.beneficiary.beneficiary_id);
        setBeneficiariesStatus(cekData.beneficiary.status);
      }
    } catch (error) {
      Error401(error, router);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
    fetchRegisterStatus();
  }, []);

  const btnLogout = () => {
    setLoading(true);
    localStorage.clear();
    localStorage.clear();
    localStorage.removeItem("cart");
    localStorage.removeItem("formData");
    router.push("/login");
  };

  const UpdateProfile = () => {
    router.push("/profile-update");
  };

  const ChangePassword = () => {
    router.push("/change-password");
  };

  const MerchantUpdateProfile = () => {
    localStorage.setItem("Merchant_id", merchantId);
    router.push("/merchant-profile-update");
  };

  return (
    <>
      <div className="bg-white h-screen overflow-auto flex flex-col px-5 pb-[180px]">
        {/* <Header /> */}
        <div classname="w-full mb-16 pb-16">
          <div className="pt-4 flex flex-row items-center justify-between">
            <p className="text-center font-bold text-lg"></p>
            <p className="text-center font-bold text-lg">Profile</p>
            <button
              onClick={() => router.push("/contact-us")}
              className="bg-primary text-end p-0.4 rounded-full"
            >
              <IconQuestionMark color="white" size={17} />
            </button>
          </div>
          {loading ? (
            <div className={`${styles.card} `}>
              {[...Array(3)].map((_, index) => (
                <div key={index} className={`${styles.loadingCard}`}>
                  <div className={`${styles.shimmer}`}></div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="items-center justify-center mt-5 w-full mb-4">
                <div className="flex">
                  <div className="w-20 h-20 rounded-full bg-blue-100 grid place-items-center mr-2 text-blue-600">
                    {dataUser?.profile_pic !== "" ? (
                      <img
                        src={`${process.env.NEXT_PUBLIC_URL_STORAGE}${dataUser?.profile_pic}`}
                        alt=""
                        className="w-20 h-20 rounded-full bg-blue-100 object-cover"
                      />
                    ) : (
                      <IconUser />
                    )}
                  </div>
                  <div className="text-left flex flex-row justify-between w-full">
                    <div className="flex flex-col justify-center">
                      <p className="text-md text-primary">{dataUser?.fullname}</p>

                      {/* Menampilkan status Detonator dan Beneficiaries */}
                      <p className="font-normal text-xs">
                        {dataRegister?.detonator?.status === "approved" && dataRegister?.beneficiaries?.status === "approved"
                          ? "Verified Beneficiaries & Detonator"
                          : dataRegister?.detonator?.status === "approved"
                            ? "Verified Detonator"
                            : dataRegister?.beneficiaries?.status === "approved"
                              ? "Verified Beneficiaries"
                              : null}
                      </p>

                      {/* Jika Detonator ada dan statusnya ditentukan */}
                      {/* {isDetonator && (
                        <p className="font-normal text-xs">{detonatorStatus}</p>
                      )} */}
                    </div>

                    {!isDetonator && (
                      <button onClick={() => UpdateProfile()}>
                        <IconEdit />
                      </button>
                    )}
                  </div>
                </div>

              </div>
              <button
                onClick={() => ChangePassword()}
                className="shadow rounded-xl flex flex-row justify-between w-full text-left filter-none mb-4 p-3"
              >
                <p>Ubah Kata Sandi</p>
                <IconChevronRight className="text-primary" />
              </button>
              <div className="shadow rounded-xl filter-none mb-4 p-3 px-5">
                <div class="card flex max-w-lg">
                  <div class="flex-grow text-left">
                    <div className="mt-2 text-left mb-3">
                      <p class="font-bold">Email</p>
                      <p>{dataUser?.email}</p>
                    </div>
                  </div>
                </div>
                <div class="card flex max-w-lg">
                  <div class="flex-grow text-left">
                    <div className="mt-2 text-left mb-3">
                      <p class="font-bold">Nomer HP</p>
                      <p>{dataUser?.phone}</p>
                    </div>
                  </div>
                </div>
                {isDetonator && <ProfileDetonator id={detonatorId} />}
              </div>

              {isMerchant && (
                <ProfileMerchant
                  id={merchantId}
                  merchantStatus={merchantStatus}
                  MerchantUpdateProfile={MerchantUpdateProfile}
                />
              )}

              <button
                onClick={btnLogout}
                className="flex items-center justify-center bg-white border-2 border-primary rounded-lg w-full h-10 text-primary font-bold text-center"
              >
                Keluar
              </button>
            </>
          )}
        </div>
        {loading && <Loading />}
      </div>
      <BottomNav />
    </>
  );
};

export default Profile;
