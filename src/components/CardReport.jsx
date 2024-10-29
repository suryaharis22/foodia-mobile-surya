import styles from "@/styles/Campaign.module.css";
import { IconCaretDown, IconCaretUp } from "@tabler/icons-react";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const CardReport = ({ data }) => {
  const router = useRouter();
  const { id } = router.query;
  const [showFullText, setShowFullText] = useState(false);
  const [buttonStatus, setButtonStatus] = useState(false);
  const toggleReadMore = () => {
    setShowFullText((prevShowFullText) => !prevShowFullText);
  };

  useEffect(() => {
    const id_detonator = localStorage.getItem("id");
    const role = localStorage.getItem("role");
    if (data.order == null) {
      setButtonStatus(false);
    } else {
      if (data.order.is_rating) {
        setButtonStatus(false);
      } else {
        if (role === "detonator") {
          if (data.campaign.detonator_id === parseInt(id_detonator)) {
            setButtonStatus(true);
          }
        } else {
          setButtonStatus(false);
        }
      }
    }
  });
  const hendleButton = () => {
    const role = localStorage.getItem("role");
    const id_detonator = localStorage.getItem("id");
    if (data.order == null) {
      return;
    } else {
      if (data.order.is_rating) {
        return;
      } else {
        if (role === "detonator") {
          if (data.campaign.detonator_id === parseInt(id_detonator)) {
            router.push(`/detonator/reportfood/${data.order.id}`);
          }
        } else {
          return;
        }
      }
    }
  };
  return (
    <div
      className={`block m-2  bg-white rounded-lg hover:shadow-md border bg-blue-100 ${buttonStatus ? "cursor-pointer" : ""
        }`}
    >
      <div className="flex p-2 ">
        <div className="w-1/3 mr-4">
          <img
            src={`${process.env.NEXT_PUBLIC_URL_STORAGE}${data.images[0]?.image_url}`}
            className={`rounded-lg object-cover ${styles.img_card}`}
            alt=""
          />
        </div>
        <div className="w-full">
          <div className="flex justify-between">
            <h5 className="mb-1 text-sm font-bold tracking-tight text-gray-900 capitalize">{` ${data.order ? data.order.merchant_product.name : data.title
              }`}</h5>

            {data.order && data.order.is_rating ? (
              <div className="h-4 p-2 bg-primary text-white rounded items-center flex justify-center">
                <p className="text-xs">Completed</p>
              </div>
            ) : null}
          </div>
          <p className="mb-1 text-sm font-bold tracking-tight text-gray-900">
            {data.order ? data.order.merchant.merchant_name : ""}{" "}
          </p>
          <p className="text-xs text-gray-900">
            {moment(data.created_at).add(7, 'hours').format('DD/MM/YYYY HH:mm')}
          </p>

          <p
            className={`font-normal text-gray-700 text-xs  ${showFullText ? "" : styles.report_truncate
              }`}
          >
            {data.description}
          </p>
          <div className="bg-white hover:bg-gray-100 w-full grid place-content-center rounded-sm text-primary text-xs mt-2">
            <button className="flex" onClick={toggleReadMore}>
              {showFullText ? (
                <>
                  Lebih Sedikit <IconCaretUp size={20} />
                </>
              ) : (
                <>
                  Selengkapnya <IconCaretDown size={20} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardReport;
