import BottomNav from "@/components/BottomNav";
import CardInbox from "@/components/CardInbox";
import Error401 from "@/components/error401";
import styles from "@/styles/Home.module.css";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Inbox = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [dataInbox, setDataInbox] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("donator");
  const [isActive, setIsActive] = useState({
    donator: false,
    detonator: false,
    merchant: false,
    beneficiaries: false,
  });
  const [unreadCounts, setUnreadCounts] = useState({
    donator: 0,
    detonator: 0,
    merchant: 0,
    beneficiaries: 0,
  });

  // Check active status based on user data from localStorage
  useEffect(() => {
    const id = localStorage.getItem("id");
    const detonator_id = localStorage.getItem("id_detonator");
    const merchant_id = localStorage.getItem("id_merchant");
    const beneficiaries_id = localStorage.getItem("id_beneficiaries");

    if (id) {
      setIsActive((prevState) => ({
        ...prevState,
        donator: true,
        detonator: detonator_id !== "-",
        merchant: merchant_id !== "-",
        beneficiaries: beneficiaries_id !== "-",
      }));
    }
  }, []);

  // Fetch inbox data and unread count in a single API call
  const fetchInboxData = async (inboxType) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}inbox/list?inbox_type=${inboxType}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Calculate unread count
      const unreadCount = res.data.body.detail.filter((item) => item.is_read === 0).length;
      // Sort data by value (descending)
      const data = res.data.body.detail.sort((a, b) => b.value - a.value);

      // Update unread count for this inbox type
      setUnreadCounts((prevState) => ({ ...prevState, [inboxType]: unreadCount }));

      // Set dataInbox only if the selected inbox type matches
      if (inboxType === selectedStatus) {
        setDataInbox(data);
      }
    } catch (error) {
      Error401(error, router);
      setDataInbox([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch inbox data for all types on component mount
  useEffect(() => {
    ["donator", "detonator", "merchant", "beneficiaries"].forEach((type) =>
      fetchInboxData(type)
    );
  }, [selectedStatus]);

  // Handle inbox filter change
  const handleFilterChange = (status) => {
    setSelectedStatus(status);
    fetchInboxData(status);
  };

  return (
    <>
      <div className="container mx-auto h-screen overflow-hidden max-w-480 bg-white flex flex-col">
        <div className="bg-white h-screen">
          <div className="flex items-center justify-center px-6 py-4">
            <h1 className="text-xl font-bold">Inbox</h1>
          </div>

          <div className="flex flex-row px-6 py-4 justify-between items-end">
            {isActive.donator && (
              <div className="px-2 w-full">
                <div
                  className={`cursor-pointer text-center border border-t-0 border-x-0 font-semibold text-lg ${selectedStatus === "donator"
                    ? "text-primary border-b-primary"
                    : "text-gray-500 border-b-transparent"
                    }`}
                  onClick={() => handleFilterChange("donator")}
                >
                  <div className="flex relative justify-center items-center">
                    <span>Donator</span>
                    {unreadCounts.donator > 0 && (
                      <div className="w-[20px] h-[20px] rounded-full text-[12px] text-white bg-red-500 absolute top-0 right-0 flex justify-center items-center">
                        {unreadCounts.donator}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {isActive.detonator && (
              <div className="px-2 w-full">
                <div
                  className={`cursor-pointer text-center border border-t-0 border-x-0 font-semibold text-lg ${selectedStatus === "detonator"
                    ? "text-primary border-b-primary"
                    : "text-gray-500 border-b-transparent"
                    }`}
                  onClick={() => handleFilterChange("detonator")}
                >
                  <div className="flex relative justify-center items-center">
                    <span>Volunteer</span>
                    {unreadCounts.detonator > 0 && (
                      <div className="w-[20px] h-[20px] rounded-full text-[12px] text-white bg-red-500 absolute top-0 right-0 flex justify-center items-center">
                        {unreadCounts.detonator}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {isActive.merchant && (
              <div className="px-2 w-full">
                <div
                  className={`cursor-pointer text-center font-semibold text-lg ${selectedStatus === "merchant"
                    ? "text-primary border-b-primary"
                    : "text-gray-500"
                    }`}
                  onClick={() => handleFilterChange("merchant")}
                >
                  <div className="flex relative justify-center items-center">
                    <span>Merchant</span>
                    {unreadCounts.merchant > 0 && (
                      <div className="w-[20px] h-[20px] rounded-full text-[12px] text-white bg-red-500 absolute top-0 right-0 flex justify-center items-center">
                        {unreadCounts.merchant}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {isActive.beneficiaries && (
              <div className="px-2 w-full">
                <div
                  className={`cursor-pointer text-center font-semibold text-lg ${selectedStatus === "beneficiaries"
                    ? "text-primary border-b-primary"
                    : "text-gray-500"
                    }`}
                  onClick={() => handleFilterChange("beneficiaries")}
                >
                  <div className="flex relative justify-center items-center">
                    <span>Beneficiaries</span>
                    {unreadCounts.beneficiaries > 0 && (
                      <div className="w-[20px] h-[20px] rounded-full text-[12px] text-white bg-red-500 absolute top-0 right-0 flex justify-center items-center">
                        {unreadCounts.beneficiaries}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {loading ? (
            <div className={`${styles.card}`}>
              {[...Array(4)].map((_, index) => (
                <div key={index} className={`${styles.loadingCard}`}>
                  <div className={`${styles.shimmer}`}></div>
                </div>
              ))}
            </div>
          ) : (
            <div className={`overflow-auto h-screen px-1 pb-[300px]`}>
              {dataInbox.length > 0 ? (
                dataInbox.map((inboxData) => (
                  <CardInbox DataInbox={inboxData} key={inboxData.id} />
                ))
              ) : (
                <div className="flex justify-center items-center h-[326px] text-center font-semibold text-[#D9D9D9] text-[16px]">
                  No Data
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <BottomNav />
    </>
  );
};

export default Inbox;
