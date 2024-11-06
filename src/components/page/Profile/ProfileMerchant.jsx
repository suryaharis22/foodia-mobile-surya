import Loading from "@/components/Loading";
import Error401 from "@/components/error401";
import { IconEdit, IconUser } from "@tabler/icons-react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ProfileMerchant = ({ id = 0, merchantStatus, MerchantUpdateProfile }) => {
  const router = useRouter();
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}merchant/fetch/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setData(response.data.body);
        setLoading(false);
      })
      .catch((error) => {
        Error401(error, router);
      });
  }, [id]);

  return (
    <>
      <div className="items-center justify-center mt-5 w-full mb-2">
        <div className="w-full h-16 bg-white text-black rounded-lg inline-flex items-center px-1">
          <div className="flex justify-between w-full">
            <div className="flex items-center">
              <div className="w-20 h-20 rounded-full bg-blue-100 grid place-items-center mr-2 text-blue-600">
                {data?.merchant_photo !== "" ? (
                  <div className="w-20 h-20 rounded-full bg-blue-100 grid place-items-center mr-2 text-blue-600">
                    <img
                      src={`${process.env.NEXT_PUBLIC_URL_STORAGE}${data?.merchant_photo}`}
                      alt=""
                      className="w-20 h-20 rounded-full bg-blue-100 grid place-items-center text-blue-600 object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-full bg-blue-100 grid place-items-center mr-2 text-blue-600">
                    <IconUser />
                  </div>
                )}
              </div>
              <div className="text-left flex flex-col justify-center">
                <div className=" text-primary">Merchant</div>
                <div className=" text-xs">
                  {merchantStatus === "approved"
                    ? "Approved"
                    : merchantStatus === "waiting"
                      ? "Registrasi sedang diproses"
                      : merchantStatus === "rejected"
                        ? "Registrasi ditolak"
                        : ""}
                </div>


              </div>
            </div>
          </div>
        </div>
      </div>
      {(merchantStatus === "approved" || merchantStatus === "waiting") && (
        <div className="shadow rounded-xl filter-none mb-4 p-3 px-5">
          <div className="card md:flex max-w-lg w-full">
            <div className="flex justify-between text-left w-full items-start flex-row md:text-left">
              <div className="mt-2 text-left mb-3">
                <p className="font-bold">Nama Toko</p>
                <p>{data?.merchant_name}</p>
              </div>

              {merchantStatus === "approved" && (
                <button onClick={() => MerchantUpdateProfile()}>
                  <IconEdit />
                </button>
              )}

            </div>
          </div>
          <div className="card md:flex max-w-lg">
            <div className="flex-grow text-left md:text-left">
              <div className="mt-2 text-left mb-3">
                <p className="font-bold">Nomor Link Aja</p>
                <p>{data?.no_link_aja}</p>
              </div>
            </div>
          </div>
          <div className="card md:flex max-w-lg">
            <div className="flex-grow text-left md:text-left">
              <div className="mt-2 text-left mb-3">
                <p className="font-bold">Alamat Toko</p>
                <p>{data?.address}</p>
              </div>
            </div>
          </div>
          {loading && <Loading />}
        </div>
      )}
    </>
  );
};

export default ProfileMerchant;
