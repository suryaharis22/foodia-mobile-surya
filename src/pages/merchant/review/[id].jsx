import Header from "@/components/Header";
import Loading from "@/components/Loading";
import Error401 from "@/components/error401";
import { useAppState } from "@/components/page/UserContext";
import { IconFileDescription } from "@tabler/icons-react";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const ReviewCamp = () => {
  const router = useRouter();
  const id_order = router.query.id;
  const id_camp = router.query.id_camp;
  const [newReport, setnewReport] = useState({});
  const [star, setStar] = useState(newReport?.star || 0);
  const [description, setDescription] = useState(newReport?.description ?? "");
  const [loading, setloading] = useState(true);

  useEffect(() => {
    setloading(true);
    const token = localStorage.getItem("token");
    axios
      .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}campaign/fetch/${id_camp}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      .then((response) => {
        setnewReport(response.data.body);

        // setnewReport(response.data.body);
        setloading(false);
      })
      .catch((error) => {
        setloading(false);
        Error401(error, router);
      });
  }, [id_camp]);

  const handleStarChange = (index) => {
    setStar(index);
  };

  const handledescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleSubmit = () => {
    setloading(true);
    const token = localStorage.getItem("token");
    // const id_merchant = newReport?.merchant?.id;
    const relation_id = newReport?.detonator?.id;
    axios
      .post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}rating/create`,
        {
          relation_id: parseInt(relation_id),
          relation_type: "detonator",
          order_id: parseInt(id_order),
          star: star,
          photo: "-",
          note: description ? description : "-",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setloading(false);
        Swal.fire({
          icon: "success",
          title: "Review Berhasil Disimpan",
          text: "Terima kasih telah memberi review",
          showConfirmButton: true,
          confirmButtonColor: "#6CB28E",
          confirmButtonText: "OK",
        }).then(() => {
          setloading(false);
          router.push("/merchant/review");
        });
      })
      .catch((error) => {
        setloading(false);
        Error401(error, router);
      });
  };

  return (
    <div className="container mx-auto pt-14 bg-white h-screen">
      <Header title="Review Volunteer" />
      <div className="place-content-center">
        <div className=" w-full p-2">
          <div className="flex justify-between items-center w-full p-2 border border-gray-200 ">
            <div className="flex items-center">
              <img
                src={`${process.env.NEXT_PUBLIC_URL_STORAGE}${newReport?.detonator?.self_photo}`}
                alt={`${process.env.NEXT_PUBLIC_URL_STORAGE}${newReport?.detonator?.self_photo}`}
                className="w-20 h-20 object-cover rounded-full"
              />
              <div className="ml-2">
                <p className="text-[14px] text-primary font-medium">
                  {newReport?.detonator?.oauth?.fullname}
                </p>
                <p className="text-[10px] font-normal">Verified Campaigner</p>
              </div>
            </div>
          </div>
        </div>
        <hr className="w-full h-0.5 mx-auto mt-2 bg-gray-300 border-0 rounded" />
        <div className="p-2 mt-2 w-full">
          <div className="py-2">
            <div className="flex flex-row p-4 pr-4 py-0 bg-gray-100 text-gray-400 text-sm rounded-lg focus:ring-blue-500 w-full focus:border-none">
              <IconFileDescription className="mt-3.5" />
              <textarea
                // maxLength={256}
                onChange={handledescriptionChange}
                value={description}
                type="text"
                className="text-black ml-2 w-full min-h-[86px] p-0 py-4 pl-1 bg-transparent focus:border-none outline-none"
                placeholder="Komentar"
                required
                style={{ resize: "none" }}
              />
            </div>
            <p className="text-end text-sm text-gray-400">
              <span className={description.length > 256 && "text-red-500"}>
                {description.length}
              </span>
              /256
            </p>
          </div>
          <div className="mb-2 ml-4 flex justify-center">
            {[1, 2, 3, 4, 5].map((index) => (
              <svg
                key={index}
                className={`w-12 h-12 cursor-pointer ${index <= star ? "text-yellow-300" : "text-gray-500"
                  }`}
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 33 18"
                onClick={() => handleStarChange(index)}
              >
                <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
              </svg>
            ))}
          </div>
          <div className="grid gap-4 mt-40 content-center">
            <button
              disabled={!star || loading}
              onClick={() => handleSubmit()}
              type="submit"
              className={`disabled:bg-gray-300 bg-primary text-white hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-xl text-sm w-full sm:w-auto px-5 py-2.5 text-center`}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
      {loading && <Loading />}
    </div>
  );
};

export default ReviewCamp;
