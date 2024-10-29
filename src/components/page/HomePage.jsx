import styles from "@/styles/Home.module.css";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import CardCampaign from "../CardCampaign";
import Error401 from "../error401";
import { encryptId } from "@/utils/EndCodeHelper1";

const HomePage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [DataCamp, setDataCamp] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("OPEN");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  // Reference to the scrollable div
  const scrollRef = useRef(null);

  const fetchCampaigns = async (currentPage = 1) => {
    if (loading || !hasMore) return;
    try {
      setLoading(true);

      // Get token from localStorage
      const token = localStorage.getItem("token");

      // Build query parameters
      const queryParams = new URLSearchParams({
        campaign_status: selectedStatus, // Apply the selected status filter
        page: currentPage,
        per_page: 20,
      });

      // Fetch campaigns from API
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}campaign/filter?${queryParams.toString()}`,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        }
      );

      if (response.status === 200) {
        const { body: newCampaigns, meta } = response.data;

        const { page: currentPage, page_count } = meta;
        setTotalPages(page_count);

        const existingIds = new Set(DataCamp.map((campaign) => campaign.id));
        const uniqueCampaigns = newCampaigns.filter((campaign) => !existingIds.has(campaign.id));

        setDataCamp((prevData) => [...prevData, ...uniqueCampaigns]);

        if (currentPage >= page_count || newCampaigns.length === 0) {
          setHasMore(false);
        }
      }
    } catch (error) {
      if (error.response?.status === 401) {
        Error401(error, router);
      } else {
        console.error("Error fetching campaigns:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  // Load the initial campaigns when the component mounts or the selected status changes
  useEffect(() => {
    setDataCamp([]);
    setPage(1);
    setHasMore(true);
    setTotalPages(1);
    fetchCampaigns();
  }, [selectedStatus]);

  // Infinite scroll handler using the event from the scroll
  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;

    if (scrollTop + clientHeight >= scrollHeight - 50 && !loading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    const scrollableDiv = scrollRef.current;

    if (scrollableDiv) {
      scrollableDiv.addEventListener("scroll", handleScroll);
      return () => {
        scrollableDiv.removeEventListener("scroll", handleScroll);
      };
    }
  }, [loading, hasMore]);

  useEffect(() => {
    if (page > 1 && page <= totalPages) {
      fetchCampaigns(page);
    }
  }, [page]);

  // Handle filter change for campaign status
  const handleFilterChange = (status) => {
    setSelectedStatus(status);
    setPage(1);
    setHasMore(true);
  };

  return (
    <>
      <div className="bg-white overflow-hidden">
        <div className="flex items-center justify-center px-6 my-2">
          <div className="bg-gray-100 rounded-xl py-2 w-full">
            <div className="flex justify-around gap-5 px-1 py-3 text-[12px] font-lato">
              <Link
                href={"/detonator"}
                className="grid gap-2 justify-items-center w-24"
              >
                <div className={`${styles.iconMenu}`}>
                  <Image
                    src={"/icon/campaint.png"}
                    alt="Girl in a jacket"
                    width={30}
                    height={30}
                  />
                </div>
                <p className=" text-gray-500 dark:text-gray-400">Relawan</p>
              </Link>
              <Link
                href={"/merchant"}
                className="grid gap-2 justify-items-center w-24"
              >
                <div className={`${styles.iconMenu}`}>
                  <Image
                    sizes="100%"
                    src={"/img/icon/store.png"}
                    alt="Girl in a jacket"
                    width={30}
                    height={30}
                  />
                </div>
                <p className=" text-gray-500 dark:text-gray-400">UMKM</p>
              </Link>
              <Link
                href={"/beneficiaries"}
                className="grid gap-2 justify-items-center w-24"
              >
                <div className={`${styles.iconMenu}`}>
                  <Image
                    src={"/img/icon/icon_camp_terdekat.png"}
                    alt="Girl in a jacket"
                    width={30}
                    height={30}
                  />
                </div>
                <p className=" text-gray-500 dark:text-gray-400">
                  Makan Gratis
                </p>
              </Link>
            </div>
          </div>
        </div>
        <div className="flex flex-row px-6 py-4 justify-between items-end w-full">
          <div
            className={`cursor-pointer px-0 w-36 ${selectedStatus === "OPEN"
              ? "text-primary text-center border border-t-0 border-x-0 border-b-primary"
              : "cursor-pointer text-center text-gray-500 border border-t-0 border-x-0 border-b-transparent"
              }`}
            onClick={() => handleFilterChange("OPEN")}
          >
            <span>Yuk Berdonasi</span>
          </div>
          <div
            className={`cursor-pointer text-center${selectedStatus === "INPROGRESS"
              ? " text-primary text-center border border-t-0 border-x-0 border-b-primary"
              : "cursor-pointer text-center text-gray-500 border border-t-0 border-x-0 border-b-transparent"
              }`}
            onClick={() => handleFilterChange("INPROGRESS")}
          >
            <span>Campaign Berjalan</span>
          </div>
          <div
            className={`cursor-pointer text-center ${selectedStatus === "FINISHED"
              ? "text-primary text-center border border-t-0 border-x-0 border-b-primary"
              : "cursor-pointer text-center text-gray-500 border border-t-0 border-x-0 border-b-transparent"
              }`}
            onClick={() => handleFilterChange("FINISHED")}
          >
            <span>Campaign Selesai</span>
          </div>
        </div>

        {loading && page === 1 ? (
          <div className={`${styles.card}`}>
            {[...Array(4)].map((_, index) => (
              <div key={index} className={`${styles.loadingCard}`}>
                <div className={`${styles.shimmer}`}></div>
              </div>
            ))}
          </div>
        ) : (
          <div ref={scrollRef} className="overflow-auto h-screen px-1 pb-[400px]">
            {DataCamp.map((campData) => (
              <CardCampaign
                key={campData.id}
                from={"home"}
                to={`/campaign/${campData.id}`}
                img={`${process.env.NEXT_PUBLIC_URL_STORAGE}${campData.image_url}`}
                title={campData.event_name}
                address={campData.address}
                date={campData.event_date}
                status={campData.status}
                donation_target={campData.donation_target}
                donation_collected={campData.donation_collected}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default HomePage;
