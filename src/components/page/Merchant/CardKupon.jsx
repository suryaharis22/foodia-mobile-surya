import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const CardKupon = (props) => {
  const router = useRouter();
  const [role, setRole] = useState("");
  const {
    img = "/img/default-image.png",
    title = "",
    desc = "",
    total_amount = 0,
    date = "",
    status = "",
    name_beneficiary = "",
    qty = 0,
    idOrder = 0,
    total_tax,
  } = props;
  let to = "#";


  useEffect(() => {
    setRole(localStorage.getItem("role"));
  }, []);

  if (router.pathname === "/merchant/kupon") {
    switch (status) {
      case "reserved":
        to = `/merchant/scan-kupon/${idOrder}`;
        break;
      case "active":
        to = `/merchant/kupon/pelaporan/${idOrder}`;
        break;
      case "claimed":
        to = `/merchant/kupon/claimed/${idOrder}`;
        break;
      default:
        break;
    }
  }

  const handleWarning = () => {
    if (status === "claimed") {
      router.push(to);
    } else {
      Swal.fire({
        title: 'Informasi Kupon Makan',
        html: `
          <div class="flex flex-col text-black space-y-4 px-4">
            <div class="text-justify text-[14px]">
              <ul class="list-decimal font-bold space-y-2">
                <li class="mb-4">
                  <p class="italic font-normal text-primary">
                    Anda akan menerima pembayaran setelah selesai melaporkan kegiatan pemberian makan 
                    <span class="not-italic text-black"> kepada penerima manfaat menggunakan fitur kupon. Foto yang harus dilaporkan:</span>
                  </p>
                  <ul class="list-alpha ml-6 font-bold space-y-1">
                    <li>
                      <p class="italic font-normal text-primary">
                        Melaporkan foto makanan yang disajikan 
                        <span class="not-italic text-black"> sesuai pesanan pada kupon makan</span>
                      </p>
                    </li>
                    <li>
                      <p class="italic font-normal text-primary">
                        Melaporkan foto wajah Penerima Manfaat 
                        <span class="not-italic text-black"> yang mengklaim Kupon Makan</span>
                      </p>
                    </li>
                  </ul>
                </li>
                <li>
                  <p class="font-normal">
                    Pelaporan permintaan kupon makan hanya berlaku 1 jam dari scan kupon berhasil dilakukan. 
                    <span class="text-red-500 font-semibold"> Jika melebihi dari 1 jam, maka kupon akan dianggap hangus 
                      <span class="text-black font-normal"> sehingga anda</span> tidak berhak menerima pembayaran </span> makanan tersebut.
                  </p>
                </li>
              </ul>
            </div>
          </div>
        `,
        showConfirmButton: false,
        footer: `
          <div class="grid grid-cols-2 gap-4 px-4">
            <button id="btn-batal" class="border-2 border-primary text-primary font-semibold px-4 py-2 rounded-xl hover:bg-primary hover:text-white transition duration-200">
              Batal
            </button>
            <button id="btn-lanjut" class="bg-primary text-white font-semibold px-4 py-2 rounded-xl hover:bg-opacity-80 transition duration-200">
              Lanjut
            </button>
          </div>
        `,
        didOpen: () => {
          const buttonLanjut = document.getElementById('btn-lanjut');
          const buttonBatal = document.getElementById('btn-batal');

          // Handle "Lanjut" button click
          buttonLanjut.addEventListener('click', () => {
            Swal.close();
            router.push(to);
          });

          // Handle "Batal" button click
          buttonBatal.addEventListener('click', () => {
            Swal.close();
          });
        }
      });
    }
  };


  return (
    <div className="flex justify-center mt-1 w-full mb-2 items-center">
      <button onClick={handleWarning} className="w-full items-center justify-center flex">
        <div className="w-[328px]  bg-white border border-gray-300 rounded-lg flex p-2">
          <img
            className="w-[100px] h-[100px] rounded-md object-cover"
            src={img}
            alt="Nasi Kuning"
          />
          <div className="ml-2 flex flex-col justify-between w-full">
            <div className="flex justify-between items-center">
              <h2 className="text-[14px] font-bold text-primary text-start">{title}</h2>
              <button
                className={`${status === "claimed" ? "bg-primary" : "bg-blue-500"
                  } capitalize text-white text-[8px] font-bold px-2 rounded-full`}
              >
                {status}
              </button>
            </div>
            <p className="text-[8px] pb-2 text-gray-600 overflow-hidden text-start">
              {desc}
            </p>
            <div className="flex justify-between items-start">
              <div className="w-[60%]">
                <p className="text-[#6CB28E] text-[18px] font-bold text-start">
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                  }).format(total_amount - 1000)}
                </p>
                {role === "merchant" && (
                  <div className="text-[9px] w-full text-[#1D5882] flexfont-bold text-start">
                    <p className="mt-[1px]">
                      {`( Termasuk ${new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                      }).format(1000)} Biaya Platform )`}
                    </p>
                  </div>
                )}
              </div>
              <div className="text-[8px] text-right flex flex-col items-end">
                <p className="italic text-gray-600">Permintaan oleh</p>
                <p className="font-semibold italic text-gray-600">
                  {name_beneficiary}
                </p>
                <p className="italic text-gray-600">Masa berlaku hingga</p>
                <p className="font-semibold italic text-gray-600">{date}</p>
              </div>
            </div>
          </div>
        </div>
      </button>
    </div>
  );
};

export default CardKupon;
