import Header from "@/components/Header";
import Loading from "@/components/Loading";
import Error401 from "@/components/error401";
import DetailCamp from "@/components/page/DetailPage";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "@/styles/Home.module.css";

const Campaign = () => {
  const router = useRouter();
  const { id } = router.query; // Mengambil ID dari query parameters
  const [loading, setLoading] = useState(true);
  const [campaignData, setCampaignData] = useState(null);
  const [prevPath, setPrevPath] = useState("/");

  useEffect(() => {
    const prevPath = localStorage.getItem("prevPath");
    setPrevPath(prevPath === "payment_reciept" ? "/home" : prevPath || "/");

    const token = localStorage.getItem("token");
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}campaign/fetch/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCampaignData(response.data.body); // Mengatur data kampanye yang diterima
      } catch (error) {
        Error401(error, router); // Tangani kesalahan autentikasi
      } finally {
        setLoading(false); // Set loading ke false setelah selesai
      }
    };

    if (id) {
      fetchData(); // Memanggil fungsi fetchData jika ID tersedia
    }
  }, [id, router]);

  return (
    <div className="h-full max-w-480 bg-white flex flex-col">
      <Header title="Informasi" backto={prevPath ? prevPath : "/home"} />
      {loading ? (
        <div className={`${styles.card}`}>
          {[...Array(4)].map((_, index) => (
            <div key={index} className={`${styles.loadingCard}`}>
              <div className={`${styles.shimmer}`}></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <DetailCamp data={campaignData} />
        </>
      )}
      {loading && <Loading />}
    </div>
  );
};

export default Campaign;
