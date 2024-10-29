import Header from "@/components/Header";
import {
  Icon360View,
  IconCamera,
  IconFileDescription,
} from "@tabler/icons-react";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useAppState } from "../UserContext";
import Loading from "@/components/Loading";
import Error401 from "@/components/error401";
import j from "../../../../public/img/card/geprek.jpg";
import CompressImage from "@/components/CompressImage";

const DetonatorRating = (DetonatorRating) => {
  const router = useRouter();
  const id_order = router.query.id;
  const id_camp = router.query.id_camp;
  // const id_merchant = router.query.id_mrc;
  const { state, setReportMechant } = useAppState();
  const [newReport, setnewReport] = useState({});
  const [dataOrder, setDataOrder] = useState({});
  const [star, setStar] = useState(newReport?.star || 0);
  const [description, setDescription] = useState(newReport?.description ?? "");
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState("");
  const [loadingImage, setLoadingImage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const Toast = Swal.mixin({
    toast: true,
    position: "center",
    iconColor: "white",
    customClass: {
      popup: "colored-toast",
    },
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    setLoading(false);
    axios
      .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}campaign/fetch/${id_camp}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const orderData = response.data.body.orders.filter(
          (order) => order.id === parseInt(id_order)
        );
        setDataOrder(orderData[0]);
        setnewReport(response.data.body);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        Error401(error, router);
      });
  }, [id_camp]);

  useEffect(() => {
    setLoading(false);
  }, [star]);

  const handleStarChange = (index) => {
    setStar(index);
  };

  const handledescriptionChange = (event) => {
    setDescription(event.target.value);
  };
  const handleSubmit = (event) => {
    // event.preventDefault();
    setLoading(true);
    const id_merchant = localStorage.getItem("id_detonator");
    const token = localStorage.getItem("token");

    // Validation checks
    if (!star || !description) {
      window.alert("All fields are required");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("destination", "rating");
    if (images) {
      formData.append("file", images);
    }

    const submitRating = (photoUrl) => {
      const eventData = {
        relation_id: parseInt(dataOrder?.merchant_id),
        relation_type: "merchant",
        order_id: parseInt(id_order),
        star,
        photo: photoUrl,
        note: description,
      };

      axios
        .post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}rating/create`,
          eventData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((createRatingResponse) => {
          setLoading(false);
          Swal.fire({
            icon: "success",
            title: "Review Berhasil Disimpan",
            text: "Terima kasih telah memberi review",
            showConfirmButton: true,
            confirmButtonColor: "#6CB28E",
            confirmButtonText: "OK",
          }).then(() => {
            setLoading(false);
            router.push("/detonator/review");
          });
        })
        .catch((error) => {
          setLoading(false);
          Error401(error, router);
        });
    };

    if (images) {
      axios
        .post(`${process.env.NEXT_PUBLIC_API_BASE_URL}media/upload`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          setLoading(false);
          if (response.status === 200) {
            submitRating(response.data.body.file_url);
          } else {
            submitRating("-");
          }
        })
        .catch((error) => {
          setLoading(false);
          if (error.response && error.response.status === 401) {
            Error401(error, router);
          } else {
            submitRating("-");
          }
        });
    } else {
      submitRating("-");
    }
  };

  // Swal.fire({
  //   icon: "error",
  //   title: "Gagal Upload Image",
  //   text: "Gagal Upload Image, Mohon Coba Lagi",
  //   showConfirmButton: false,
  //   timer: 2000,
  // })

  const handleImagesChange = (event) => {
    const file = event.target.files[0];
    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/heif",
      "image/heic",
    ];
    const maxSize = 5 * 1024 * 1024;
    if (!file) {
      return;
    }
    setLoadingImage(true);
    if (!allowedTypes.includes(file.type)) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Hanya file PNG, JPG, dan JPEG yang diizinkan!",
      });
      setLoadingImage(false);
      return;
    }
    if (file.size <= maxSize) {
      setImages(file);
      setLoadingImage(false);
    } else {
      CompressImage(file)
        .then((compressedFile) => {
          const size = (compressedFile.size / (1024 * 1024)).toFixed(2);
          if (size <= maxSize) {
            setImages(compressedFile);
          } else {
            Toast.fire({
              icon: "error",
              title: "Ukuran gambar melebihi 5MB!",
              iconColor: "bg-black",
            });
          }
          setLoadingImage(false);
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Ukuran gambar melebihi 5MB!",
          });
          setLoadingImage(false);
          setLoading(false);
        });
    }
  };

  return (
    <>
      <div className="container mx-auto pt-14 bg-white h-screen">
        <Header title="Review Menu Merchant" />
        <div className="place-content-center">
          <div className=" w-full p-2">
            <div className="flex justify-between items-center w-full p-2 border border-gray-200 rounded-lg">
              <div className="flex items-center">
                {/* ${process.env.NEXT_PUBLIC_URL_STORAGE} */}
                <img
                  src={`${process.env.NEXT_PUBLIC_URL_STORAGE}${dataOrder?.merchant_product?.images[0].image_url}`}
                  alt={`${process.env.NEXT_PUBLIC_URL_STORAGE}${dataOrder?.merchant_product?.images[0].image_url}`}
                  className="w-20 h-20"
                />
                <div className="ml-2">
                  <p className="text-sm font-bold">
                    {dataOrder?.qty}x {dataOrder?.merchant_product?.name}
                  </p>
                  <p className="text-xs font-normal">
                    {dataOrder?.merchant?.merchant_name}
                  </p>
                  <p className="text-[11px] font-normal text-gray-400">
                    {`${newReport?.event_date} ${newReport?.event_time}`}
                  </p>
                  <p className="text-[11px] font-medium">
                    {dataOrder?.merchant_product?.note}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* <hr className="w-full h-0.5 mx-auto mt-2 bg-gray-300 border-0 rounded" /> */}
          <div className="p-2 mt-2 relative">
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="images"
                className="flex flex-col justify-center w-full h-32 border-2 border-black border-dashed rounded-lg cursor-pointer bg-gray-200 hover:bg-gray-100"
              >
                {images ? (
                  <img
                    src={URL.createObjectURL(images)}
                    alt="Foto KTP"
                    className="w-full h-full rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex items-center gap-2 px-3">
                    <div className="bg-primary text-white font-light w-20 py-5 rounded-xl flex items-center justify-center">
                      <IconCamera size={40} />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Foto Makanan</p>
                      <p className="font-light text-xs">Ambil foto makanan</p>
                    </div>
                  </div>
                )}
                <input
                  id="images"
                  type="file"
                  className="hidden"
                  onChange={handleImagesChange}
                />
              </label>
            </div>
            {loadingImage && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 rounded-lg">
                <svg
                  aria-hidden="true"
                  className="w-12 h-12 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
              </div>
            )}
          </div>

          <div className="p-2 w-full">
            <div>
              <div className="flex flex-row p-4 pr-4 py-0 bg-gray-100 text-gray-400 text-sm rounded-lg focus:ring-blue-500 w-full focus:border-none">
                <IconFileDescription className="mt-3.5" />
                <textarea
                  // maxLength={256}
                  onChange={handledescriptionChange}
                  value={description}
                  type="text"
                  className="ml-2 w-full min-h-[135px] p-0 py-4 pl-1 bg-transparent focus:border-none outline-none"
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
            <div className="grid gap-4 mt-10 content-center">
              <button
                disabled={!star || !description || loading}
                onClick={() => handleSubmit()}
                type="submit"
                className={`disabled:bg-gray-300 bg-primary text-white hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-xl text-sm w-full sm:w-auto px-5 py-2.5 text-center`}
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
        {loading && <Loading />}
      </div>
    </>
  );
};

export default DetonatorRating;
