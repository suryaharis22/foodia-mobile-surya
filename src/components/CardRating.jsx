import styles from "@/styles/Campaign.module.css";
import { IconCaretDown, IconCaretUp } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

const CardRating = ({ data }) => {
  const router = useRouter();
  const { id } = router.query;
  const [showFullText, setShowFullText] = useState(false);
  const toggleReadMore = () => {
    setShowFullText((prevShowFullText) => !prevShowFullText);
  };
  let retingImage;
  if (data.photo === "reting_merchat_to_cempain") {
    retingImage = "/img/foodia-hero.png";
  } else {
    retingImage = `${process.env.NEXT_PUBLIC_URL_STORAGE}${data.photo}`;
  }
  return (
    <div className="block m-2  bg-white rounded-lg hover:shadow-md border bg-blue-100">
      <div className="flex p-2 ">
        <div className="w-1/3 mr-2">
          <img
            src={`${retingImage}`}
            className={`rounded-lg object-cover ${styles.img_card}`}
            alt=""
          />
        </div>
        <div className="">
          <h5 className="mb-2 text-sm font-bold tracking-tight text-gray-900">{`Paket ${data.order.merchant_product.name} Sudah sampai`}</h5>
          <p className="text-xs text-gray-900">{data.created_at}</p>

          {/* star reting */}
          <div className="flex items-center">
            {[...Array(data.star)].map((_, index) => (
              <svg
                key={index}
                className="w-4 h-4 text-yellow-300 ms-1"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 22 20"
              >
                <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
              </svg>
            ))}
            {[...Array(5 - data.star)].map((_, index) => (
              <svg
                key={index}
                className="w-4 h-4 ms-1 text-gray-300 dark:text-gray-500"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 22 20"
              >
                <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
              </svg>
            ))}
          </div>

          <p
            className={`font-normal text-gray-700 text-xs  ${
              showFullText ? "" : styles.report_truncate
            }`}
          >
            {data.note} Lorem Ipsum is simply dummy text of the printing and
            typesetting industry. Lorem Lorem Ipsum is simply dummy text of the
            printing and typesetting industry. Lorem
          </p>
          <div className="bg-white hover:bg-gray-100 w-full grid place-content-center rounded-sm text-primary text-xs mt-2">
            <button className="flex" onClick={toggleReadMore}>
              Selengkapnya{" "}
              {showFullText ? (
                <IconCaretUp size={20} />
              ) : (
                <IconCaretDown size={20} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardRating;
