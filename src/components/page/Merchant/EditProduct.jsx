// src/components/formCampaing/StepDetonator.jsx

import Loading from "@/components/Loading";
import Error401 from "@/components/error401";
import { IconBowlFilled, IconFileDescription } from "@tabler/icons-react";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

function EditProduct() {
  // const { stepForm } = props;
  const router = useRouter();
  const [dataProduct, setDataProduct] = useState();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [qty, setQty] = useState("");
  const [images, setImages] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const ressponse = axios
      .get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}merchant-product/fetch/${router.query.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setLoading(false);
        setDataProduct(response.data.body);
        setName(response.data.body.name);
        setDescription(response.data.body.description);
        setPrice(response.data.body.price);
        setQty(response.data.body.qty);
        // setImages(response.data.body.images);
      })
      .catch((error) => {
        setLoading(false);
        Error401(error, router);
      });
  }, [router.query.id]);

  const Toast = Swal.mixin({
    toast: true,
    position: "center",
    iconColor: "white",
    customClass: {
      popup: "colored-toast",
    },
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });

  const handleNameChange = (event) => {
    setName(event.target.value);
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
    setImages(event.target.files[0]);
  };
  // const [error, setError] = useState("");

  // Function to handle form submission
  const handleSubmit = async (event) => {
    // event.preventDefault(); // Prevents the default form submission
    setLoading(true);
    let parsedPrice = price;

    if (typeof price === `string`) {
      parsedPrice = parseInt(price.replace(/\./g, ""), 10);
    }

    // Validation checks
    if (!name || !description || !price || !qty) {
      window.alert("All fields are required");
      return;
    }
    if (!/^\d+$/.test(qty)) {
      window.alert("Quantity must contain only digits");
      return;
    }
    // if (!/^\d+$/.test(price)) {
    //   window.alert("Price must contain only digits");
    //   return;
    // }

    if (parsedPrice > dataProduct.price * 1.3) {
      Toast.fire({
        icon: "error",
        title: "Harga tidak boleh melebihi 30% dari harga asli",
        iconColor: "bg-black",
      });
      return;
    }

    const token = localStorage.getItem("token");
    const idMerchant = localStorage.getItem("id");

    // Check if an image file is selected
    if (images) {
      const formData = new FormData();
      formData.append("destination", "merchant");
      formData.append("file", images);

      axios
        .post(`${process.env.NEXT_PUBLIC_API_BASE_URL}media/upload`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data", // Set content type for FormData
          },
        })
        .then((res) => {
          const dataRequest = {
            merchant_id: parseInt(idMerchant),
            name: name,
            description: description,
            price: parsedPrice,
            qty: parseInt(qty),
            images: [
              {
                image_url: res.data.body.file_url,
              },
            ],
          };
          axios
            .put(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}merchant-product/update/${router.query.id}`,
              dataRequest,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            )
            .then((res) => {
              setLoading(false);
              Swal.fire({
                position: "bottom",
                customClass: {
                  popup: "custom-swal",
                  icon: "custom-icon-swal",
                  title: "custom-title-swal",
                  confirmButton: "custom-confirm-button-swal",
                },
                icon: "success",
                title: `<p class="w-auto pl-1 font-bold text-md">Berhasil Ubah Menu</p><p class="text-sm w-auto pl-1 font-light">Menu kamu sudah berubah</p>`,
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
                setLoading(false);
                if (result.isConfirmed) {
                  router.push("/merchant");
                }
              });
            })
            .catch((error) => {
              setLoading(false);
              if (error.response && error.response.status === 401) {
                Error401(error, router);
              } else {
                Swal.fire({
                  icon: "error",
                  title: "Gagal update Menu",
                  text: "Gagal update Menu Mohon Coba Lagi",
                  showConfirmButton: false,
                  timer: 2000,
                });
              }
            });
        })
        .catch((error) => {
          setLoading(false);
          Error401(error, router);
        });
    } else {
      const dataRequest = {
        merchant_id: parseInt(idMerchant),
        name: name,
        description: description,
        price: parsedPrice,
        qty: parseInt(qty),
      };
      axios
        .put(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}merchant-product/update/${router.query.id}`,
          dataRequest,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          setLoading(false);
          Swal.fire({
            position: "bottom",
            customClass: {
              popup: "custom-swal",
              icon: "custom-icon-swal",
              title: "custom-title-swal",
              confirmButton: "custom-confirm-button-swal",
            },
            icon: "success",
            title: `<p class="w-auto pl-1 font-bold text-md">Berhasil Ubah Menu</p><p class="text-sm w-auto pl-1 font-light">Menu kamu sudah berubah</p>`,
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
            setLoading(false);
            if (result.isConfirmed) {
              router.push("/merchant");
            }
          });
        })
        .catch((error) => {
          setLoading(false);
          if (error.response && error.response.status === 401) {
            Error401(error, router);
          } else {
            Swal.fire({
              icon: "error",
              title: "Gagal update Menu",
              text: "Gagal update Menu Mohon Coba Lagi",
              showConfirmButton: false,
              timer: 2000,
            });
          }
        });
    }
  };

  return (
    <>
      {/* <h1>Campain: 1</h1> */}
      <div className="p-5 space-y-5 py-0 w-full">
        <div className="flex flex-row items-center p-4 pr-4 py-0 bg-gray-100 text-gray-400 text-sm rounded-lg focus:ring-blue-500 w-full focus:border-none">
          <IconBowlFilled />
          <input
            onChange={handleNameChange}
            value={name}
            id="name"
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
          Max.
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
            className="ml-2 w-full p-0 py-4 pl-1 bg-transparent focus:border-none"
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

        <div className="mb-2">
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="images"
              className="flex flex-col items-center justify-center w-full h-36 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-200 dark:hover:bg-gray-800 hover:bg-gray-100"
            >
              {images ? (
                <img
                  src={URL.createObjectURL(images)}
                  alt="images Food"
                  className="w-full h-full rounded-lg object-cover"
                />
              ) : (
                <img
                  // src={`${process.env.NEXT_PUBLIC_URL_STORAGE}${dataProduct?.self_photo || ''}`}
                  src={`${process.env.NEXT_PUBLIC_URL_STORAGE}${dataProduct?.images[0].image_url}`}
                  alt="images Food"
                  className="w-full h-full rounded-lg object-cover"
                />
              )}
              <input
                id="images"
                type="file"
                className="hidden"
                onChange={handleImagesChange}
              />
            </label>
          </div>
        </div>

        <div className="grid gap-4 content-center">
          <button
            disabled={
              name.length === 0 ||
              price.length === 0 ||
              qty.length === 0 ||
              description.length > 256 ||
              description.length === 0
            }
            onClick={() => handleSubmit()}
            type="submit"
            className={
              name.length === 0 ||
                price.length === 0 ||
                qty.length === 0 ||
                description.length > 256 ||
                description.length === 0
                ? "bg-slate-400 text-white focus:ring-4 focus:outline-none focus:ring-gray-300 font-bold rounded-xl text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                : "text-white bg-primary hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-bold rounded-xl text-sm w-full sm:w-auto px-5 py-2.5 text-center"
            }
          >
            Ubah
          </button>
        </div>
        {loading && <Loading />}
      </div>
    </>
  );
}

export default EditProduct;
