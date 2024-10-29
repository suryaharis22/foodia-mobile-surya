import {
  IconBowlFilled,
  IconCamera,
  IconFileDescription,
} from "@tabler/icons-react";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Loading from "../Loading";
import Error401 from "../error401";
import CompressImage from "../CompressImage";

function StepOne({ Menu, setMenu }) {
  // const { stepForm } = props;
  const router = useRouter();
  const [name, setName] = useState(Menu?.name ?? "");
  const [description, setDescription] = useState(Menu?.description ?? "");
  const [price, setPrice] = useState(Menu?.price ?? "");
  const [qty, setQty] = useState(Menu?.qty ?? "");
  const [images, setImages] = useState(Menu?.images ?? "");
  const [loading, setLoading] = useState(true);
  const [loadingImage, setLoadingImage] = useState(false);

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
    setLoading(false);
  }, []);

  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const handleNameChange = (event) => {
    setName(capitalizeFirstLetter(event.target.value));
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handlePriceChange = (event) => {
    let inputVal = event.target.value;
    inputVal = inputVal.replace(/\D/g, ""); // Remove all non-numeric characters
    inputVal = inputVal.replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Add dots every 3 digits
    setPrice(inputVal);
  };

  const handleQtyChange = (event) => {
    setQty(event.target.value);
  };

  const handleImagesChange = (event) => {
    const file = event.target.files[0];
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/heif", "image/heic"];
    const maxSize = 5 * 1024 * 1024;
    if (!file) {
      return;
    }
    setLoadingImage(true);
    if (!allowedTypes.includes(file.type)) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Hanya file PNG, JPG, JPEG dan HEIF yang diizinkan!",
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
              icon: 'error',
              title: 'Ukuran gambar melebihi 5MB!',
              iconColor: 'bg-black',
            })
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
          setLoading(false)
        });
    }
  };

  const handleSubmit = (event) => {
    // event.preventDefault(); // Prevents the default form submission

    setLoading(true);
    if (!name || !description || !price || !qty || !images) {
      window.alert("All fields are required");
      return;
    }
    if (!/^\d+$/.test(qty)) {
      window.alert("Quantity must contain only digits");
      return;
    }
    if (!/^\d+$/.test(parseInt(price.replace(/\./g, ""), 10))) {
      window.alert("Price must contain only digits");
      return;
    }

    setMenu({
      name,
      description,
      price: parseInt(price.replace(/\./g, ""), 10),
      qty,
      images,
    });

    const token = localStorage.getItem("token");
    const idMerchant = localStorage.getItem("id");
    // Check if an image file is selected
    if (images) {
      const formData = new FormData();
      formData.append("destination", "merchant");
      formData.append("file", images);
      setLoading(true);
      axios
        .post(`${process.env.NEXT_PUBLIC_API_BASE_URL}media/upload`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data", // Set content type for FormData
          },
        })
        .then((res) => {
          if (res.status === 200) {
            const dataRequest = {
              merchant_id: parseInt(idMerchant),
              name: name,
              description: description,
              price: parseInt(price.replace(/\./g, ""), 10),
              qty: parseInt(qty),
              images: [
                {
                  image_url: res.data.body.file_url,
                },
              ],
            };
            axios
              .post(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}merchant-product/create`,
                dataRequest,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              )
              .then(() => {
                Swal.fire({
                  position: "bottom",
                  customClass: {
                    popup: "custom-swal",
                    icon: "custom-icon-swal",
                    title: "custom-title-swal",
                    confirmButton: "custom-confirm-button-swal",
                  },
                  icon: "success",
                  title: `<p class="w-auto pl-1 font-bold text-md">Pengajuan Menu Berhasil Dibuat</p><p class="text-sm w-auto pl-1 font-light">Terima kasih telah mengirim pengajuan menu, akan segera kami proses review</p>`,
                  html: `
                      <div class="absolute px-28 ml-4 top-0 mt-4">
                        <hr class="border border-black w-16 h-1 bg-slate-700 rounded-lg "/>
                      </div>
                    `,
                  width: "375px",
                  showConfirmButton: true,
                  confirmButtonText: "Kembali",
                  confirmButtonColor: "#3FB648",
                }).then((result) => {
                  if (result.isConfirmed) {
                    router.push("/merchant");
                  }
                });
                setLoading(false);
              })
              .catch((error) => {
                setLoading(false);
                Error401(error, router);
              });
          }
        })
        .catch((error) => {
          setLoading(false);
          Error401(error, router);
        });
    } else {
      setLoading(false);
      // Handle the case where an image file is not selected
      window.alert("Please select an image file");
    }
  };

  return (
    <>
      <div className="p-5 space-y-5 py-0 w-full">
        <div className="flex flex-row items-center p-4 pr-4 py-0 bg-gray-100 text-gray-400 text-sm rounded-lg focus:ring-blue-500 w-full focus:border-none">
          <IconBowlFilled />
          <input
            onChange={handleNameChange}
            value={name}
            type="text"
            className="ml-2 w-full p-0 py-4 pl-1 bg-transparent focus:border-none"
            placeholder="Nama Menu"
            required
          />
        </div>
        <div className="flex flex-row items-center p-4 pr-4 py-0 bg-gray-100 text-gray-400 text-sm rounded-lg focus:ring-blue-500 w-full focus:border-none">
          Rp.
          <input
            onChange={handlePriceChange}
            value={price}
            type="text"
            className="ml-2 w-full p-0 py-4 pl-1 bg-transparent focus:border-none"
            placeholder="Harga Menu"
            required
          />
        </div>
        <div className="flex flex-row items-center p-4 pr-4 py-0 bg-gray-100 text-gray-400 text-sm rounded-lg focus:ring-blue-500 w-full focus:border-none">
          <p className="text-xs">Max.</p>
          <input
            onChange={handleQtyChange}
            value={qty}
            type="number"
            min="0"
            onKeyDown={(e) => {
              if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                e.preventDefault();
              }
            }}
            className="ml-2 w-full p-0 py-4 bg-transparent focus:border-none"
            placeholder="Maksimal Pesanan"
            required
          />
        </div>
        <div>
          <div className="flex flex-row p-4 pr-4 py-0 bg-gray-100 text-gray-400 text-sm rounded-lg focus:ring-blue-500 w-full focus:border-none">
            <IconFileDescription className="mt-3.5" />
            <textarea
              // maxLength={256}
              onChange={handleDescriptionChange}
              value={description}
              type="text"
              className="ml-2 w-full min-h-[135px] p-0 py-4 pl-1 bg-transparent focus:border-none outline-none"
              placeholder="Deskripsi Menu"
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
        <div className="mb-2 ">
          <div className="flex items-center justify-center w-full relative">
            <label
              htmlFor="images"
              className="flex flex-col justify-center w-full h-32 border-2 border-black border-dashed rounded-lg cursor-pointer bg-gray-200 hover:bg-gray-100 relative"
            >
              {images ? (
                <img
                  src={URL.createObjectURL(images)}
                  alt="Foto Makanan"
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
        </div>


        <div className="grid gap-4 content-center">
          <button
            disabled={
              !name ||
              !description ||
              !price ||
              !qty ||
              !images ||
              description.length > 256
            }
            onClick={() => handleSubmit()}
            type="submit"
            className={
              !name ||
                !description ||
                !price ||
                !qty ||
                !images ||
                description.length > 256
                ? "bg-slate-400 text-white focus:ring-4 focus:outline-none focus:ring-gray-300 font-bold rounded-xl text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                : "text-white bg-primary hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-bold rounded-xl text-sm w-full sm:w-auto px-5 py-2.5 text-center"
            }
          >
            Ajukan
          </button>
        </div>
        {loading && <Loading />}
      </div>
    </>
  );
}

export { StepOne };
