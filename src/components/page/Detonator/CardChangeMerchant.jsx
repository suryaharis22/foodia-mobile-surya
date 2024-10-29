import styles from "@/styles/Home.module.css";
import {
  IconBuildingStore,
  IconChevronDown,
  IconChevronUp,
} from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

const CardChangeMerchant = ({ data, order_id, id_camp }) => {
  const router = useRouter();
  const [showFullText, setShowFullText] = useState(false);
  const toggleReadMore = () => {
    setShowFullText((prevShowFullText) => !prevShowFullText);
  };

  const handleLink = (IdMerchan) => {
    router.push(
      `/detonator/ganti-menu?id=${IdMerchan}&name=${data.merchant_name}&ord=${order_id}&cmp=${id_camp}&step=2`
    );
  };
  const products = data.products;

  // Filter products by status "approved"
  const approvedProducts = products.filter(
    (product) => product.status === "approved"
  );

  // Count the number of approved products
  const numberOfApprovedProducts = approvedProducts.length;

  return (
    <div className="flex justify-center mt-1 w-full mb-2 ">
      <div
        onClick={() => handleLink(data.id)}
        href={"#"}
        className={`bg-white cursor-pointer py-2 border border-primary hover:bg-gray-100 text-black rounded-lg inline-flex ${styles.item_card}`}
      >
        <div className="w-full px-2">
          <div className="flex flex-row justify-between p-1 items-start">
            {/* <img
              src={Store}
              className={`grid grid-cols-3 gap-4 place-items-end text-gray-500 rounded-lg object-cover ${styles.img_card}`}
              alt=""
            /> */}
            <IconBuildingStore
              size="70px"
              className="flex items-center justify-center bg-green-200 rounded-lg p-2"
            />
            <div className={`text-left ml-1 ${styles.text_card}`}>
              <p className="mb-1 text-primary  font-semibold text-sm truncate">
                {data.merchant_name}
              </p>
              <div className="flex ">
                {/* <p className=" text-xs text-gray-500 mr-2">{`${data.data.address}, ${data.city}, ${data.province}`}</p> */}
                <p
                  className={` text-xs text-gray-500   ${
                    showFullText ? "" : styles.cutTextCard
                  }`}
                >
                  {data.address}
                </p>
              </div>
              {showFullText ? (
                <button
                  className="justify-end items-center text-xs py-1 text-primary w-full flex flex-row"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleReadMore();
                  }}
                >
                  <p>Lebih Sedikit</p>
                  <IconChevronUp size={20} />
                </button>
              ) : data.address.length > 80 ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleReadMore();
                  }}
                  className="justify-end items-center text-xs py-1 text-primary w-full flex flex-row"
                >
                  Selengkapnya{" "}
                  <IconChevronDown className="mt-0.5" size="15px" />
                </button>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardChangeMerchant;
