import styles from "@/styles/Home.module.css";
import { IconChevronRight } from "@tabler/icons-react";
import Link from "next/link";

const SlideCard = (props) => {
  const { to, img, title, address, date, status } = props;
  return (
    <div className="flex justify-center w-full m-2">
      <Link
        href="#"
        className={` bg-white hover:bg-gray-100  text-black rounded-lg flex justify-between ${styles.items_slide}`}
      >
        <div className="flex justify-between w-80   py-4 px-2.5">
          <div className="flex p-1">
            <div className={`relative text-left ml-1 w-36 h-32`}>
              <p className="mb-1 text-black  font-semibold text-sm truncate">
                {title}
              </p>

              <p
                className={` text-xs text-gray-500 mr-2 whitespace-normal ${styles.truncate}`}
              >
                {address}
              </p>

              <button className="absolute bottom-0 left-0 bg-primary text-white p-2 rounded-lg flex mt-1">
                <span>Donasi</span>
                <IconChevronRight />
              </button>
            </div>
          </div>
        </div>
        <div className={`rounded-lg overflow-hidden ${styles.img_slide}`}>
          <img src={img} className="w-full h-full object-cover" alt="" />
        </div>
      </Link>
    </div>
  );
};

export default SlideCard;
