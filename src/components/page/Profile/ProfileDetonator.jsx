import axios from "axios";
import { useEffect, useState } from "react";
import styles from "@/styles/Home.module.css";
import Loading from "@/components/Loading";
import Error401 from "@/components/error401";
import { useRouter } from "next/navigation";

const ProfileDetonator = ({ id }) => {
  const router = useRouter();
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}detonator/fetch/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setLoading(false);
        setData(response.data.body);
      })
      .catch((error) => {
        setLoading(false);
        Error401(error, router);
      });
  }, [id]);
  return (
    <>
      <div class="card flex flex-col max-w-lg justify-start items-start">
        <div class="flex-grow">
          <div className="mt-2 mb-3">
            <p class="font-bold">KTP</p>
            <p>{data?.ktp_number}</p>
          </div>
        </div>
        {loading && <Loading />}
      </div>
    </>
  );
};

export default ProfileDetonator;
