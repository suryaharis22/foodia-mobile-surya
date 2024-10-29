import { IconSoup, IconCheck } from "@tabler/icons-react";
import Link from "next/link";

const CardFood = (props) => {
  const { to, img, title, name, status, qty, status_makanan } = props;

  return (
    <Link
      href={`${to}`}
      className="w-full bg-white hover:bg-gray-100  text-black rounded-lg inline-flex items-center px-4 py-2.5 "
    >
      <div className="flex justify-between w-full">
        <div className="flex">
          <div className="w-10 h-10 rounded-full bg-blue-100 grid place-items-center mr-2 text-blue-600">
            <IconSoup className=" w-7 h-7" />
          </div>
          <div className="text-left place-items-start">
            <div className="mb-1 ">{title}</div>
            <div className="  text-xs text-gray-500">{name}</div>
            <div className="flex">
              <p className=" text-xs text-gray-500 mr-2">qty : {qty}</p>
              <div
                className={` text-xs text-white  rounded-lg  flex justify-center items-center ${
                  status == "Waiting approval"
                    ? "bg-blue-600 w-24"
                    : status == "Approved"
                    ? "bg-green-500 w-14"
                    : status == "Rejected"
                    ? "bg-red-500 w-14"
                    : "bg-gray-500 w-14"
                } `}
              >
                <p className="">{status}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="grid place-items-center">
          <button className="flex items-center rounded-lg w-28 h-10 text-white bg-primary p-2">
            <IconCheck className="mr-2" size={50} />
            <span>{status_makanan}</span>
          </button>
        </div>
      </div>
    </Link>
  );
};

export default CardFood;
