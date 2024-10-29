import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";
import {
  IconChevronDown,
  IconChevronRight,
  IconChevronUp,
} from "@tabler/icons-react";
import { useRouter } from "next/router";
import { useState } from "react";

const contactUs = (profile) => {
  const router = useRouter();
  const [openItems, setOpenItems] = useState({});
  const [openItemsChild, setOpenItemsChild] = useState({});

  // Function to toggle the open state of a specific item
  const toggleItem = (id) => {
    setOpenItems((prevOpenItems) => ({
      ...prevOpenItems,
      [id]: !prevOpenItems[id], // Toggle the specific item
    }));
  };

  const toggleItemChild = (id) => {
    setOpenItemsChild((prevOpenItems) => ({
      ...prevOpenItems,
      [id]: !prevOpenItems[id], // Toggle the specific item
    }));
  };

  const cardFAQContentsChild = [
    {
      id: 1,
      title: "Bagaimana cara kerja Foodia?",
      content: (
        <div className="pl-5 flex flex-col gap-4">
          <p>
            Ada 2 cara untuk membantu para Penerima Manfaat di platform Foodia
          </p>
          <div className="flex flex-col items-start">
            <p>a. Melalui Campaign</p>
            <p className="pl-3">
              Relawan menginisiasi sebuah campaign yang di dalamnya terdapat pilihan item dari Mitra UMKM, yang kemudian dibantu oleh para donatur untuk menyukseskan penggalangan dana campaign tersebut. Relawan akan menjadi penanggung jawab seluruh kegiatan campaign, mulai dari penggalangan hingga pelaporan distribusi item kepada penerima manfaat. Donatur akan menerima laporan transaksi setelah campaign selesai dilakukan.
            </p>
          </div>
          <div className="flex flex-col items-start">
            <p>b. Melalui Kupon Makan Gratis</p>
            <p className="pl-3">
              Foodia menyediakan wadah dana Kupon Makan Gratis yang berasal dari Tabungan Donasi para donatur (yang telah memberikan izin untuk dikelola oleh Foodia). Kupon didistribusikan melalui sistem kupon bersama, sehingga dapat diakses oleh seluruh penerima manfaat yang telah terverifikasi di Foodia. Setiap penerima manfaat dapat mengklaim kupon maksimal 1 kali per hari. Kupon hanya dapat dipindai di Mitra UMKM yang telah dipilih. Donatur akan menerima laporan transaksi setelah klaim kupon selesai dilakukan.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      title: "Bagaimana cara mendaftar menjadi Relawan (Volunteer)?",
      content: (
        <div className="pl-5">
          <p>
            User perlu mendaftar akun dasar terlebih dahulu di Foodia (Donatur).
            Kemudian user bisa mendaftar menjadi Volunteer dengan mengklik menu
            Relawan
          </p>
        </div>
      ),
    },
    {
      id: 3,
      title: "Bagaimana cara mendaftar menjadi Mitra UMKM (Merchant)?",
      content: (
        <div className="pl-5">
          <p>
            User perlu mendaftar akun dasar terlebih dahulu di Foodia (Donatur).
            Kemudian user bisa mendaftar menjadi Merchant dengan mengklik menu
            UMKM
          </p>
        </div>
      ),
    },
    {
      id: 4,
      title:
        "Bagaimana cara mendaftar menjadi Penerima Manfaat (Beneficiaries)?",
      content: (
        <div className="pl-5">
          <p>
            User perlu mendaftar akun dasar terlebih dahulu di Foodia (Donatur).
            Kemudian user bisa mendaftar menjadi Beneficiaries dengan mengklik
            menu Makan Gratis
          </p>
        </div>
      ),
    },
    {
      id: 5,
      title: "Bagaimana Foodia menjalankan operasional aplikasinya?",
      content: (
        <div className="pl-5">
          <p>
            Foodia sebagai tempat berkumpulnya Mitra UMKM memberikan biaya
            tambahan pada setiap menu yang dibuat sebesar Rp 1.000 sebagai biaya
            platform untuk menunjang operasional infra & aplikasi
          </p>
        </div>
      ),
    },
  ];

  const cardManualsContentsChild = [
    {
      id: 1,
      title: "Donatur",
    },
    {
      id: 2,
      title: "Mitra UMKM (Merchant)",
    },
    {
      id: 3,
      title: "Relawan (Volunteer)",
    },
    {
      id: 4,
      title: "Penerima Manfaat (Beneficiaries)",
    },
  ];

  const cardContents = [
    {
      id: 1,
      title: "Tentang Foodia",
      content: (
        <div className="flex text-sm flex-col gap-4">
          <p>
            Foodia adalah Platform Sosial Hub untuk mempertemukan Mitra UMKM,
            Relawan, Donatur dan Penerima Manfaat.
          </p>
          <p>
            Foodia mengedepankan transparasi transaksi kegiatan secara realtime
            untuk menjaga seluruh kegiatan yang berada di Platform ini agar
            tetap terjaga
          </p>
          <p>
            Foodia memiliki 2 cara dalam membantu para penerima manfaat, yaitu
            melalui Campaign yang diinisiasi oleh Volunteer dan juga melalui
            Kupon Makan Gratis yang dapat diklaim oleh Penerima Manfaat langsung
            ke lokasi Mitra UMKM yang tersedia di platform ini
          </p>
          <p>
            Foodia memberikan ruang dan kesempatan bagi para pelaku diatas untuk
            berlomba-lomba berbuat kebaikan kepada sesama. Mari jadi bagian dari
            kebaikan untuk mereka yang membutuhkan
          </p>
        </div>
      ),
    },
    {
      id: 2,
      title: "FAQ",
      content: (
        <div className="flex text-sm flex-col gap-2 w-full">
          {cardFAQContentsChild.map((items) => (
            <div className="flex flex-col">
              <button
                className="flex flex-row text-left items-center justify-between text-primary w-full"
                onClick={() => toggleItemChild(items.id)}
              >
                <div className="flex flex-row text-[15px] items-start gap-2 w-[250px]">
                  <p>{items.id}.</p>
                  <p>{items.title}</p>
                </div>
                {openItemsChild[items.id] ? (
                  <IconChevronUp size={20} className="text-primary" />
                ) : (
                  <IconChevronDown size={20} className="text-primary" />
                )}
              </button>
              {openItemsChild[items.id] && (
                <div className="text-black text-[12px]">{items.content}</div>
              )}
            </div>
          ))}
        </div>
      ),
    },
    // {
    //   id: 3,
    //   title: "Nomor Whatsapp Foodia",
    //   content: (
    //     <div className="flex text-sm flex-col gap-2">
    //       <p className="flex flex-row items-center gap-1 text-primary">
    //         <svg
    //           width="16"
    //           height="16"
    //           viewBox="0 0 16 16"
    //           fill="none"
    //           xmlns="http://www.w3.org/2000/svg"
    //         >
    //           <path
    //             fill-rule="evenodd"
    //             clip-rule="evenodd"
    //             d="M2.51428 8.00077C2.51428 4.78174 5.12382 2.17221 8.34283 2.17221C11.5618 2.17221 14.1714 4.78174 14.1714 8.00077C14.1714 11.2198 11.5618 13.8293 8.34283 13.8293C7.19618 13.8293 6.12885 13.4989 5.22831 12.9284C5.06071 12.8222 4.85535 12.7938 4.66524 12.8505L2.69097 13.4398L3.43431 11.7004C3.52217 11.4948 3.5043 11.2593 3.38641 11.0694C2.83361 10.1786 2.51428 9.12801 2.51428 8.00077ZM8.34283 0.800781C4.3664 0.800781 1.14286 4.02432 1.14286 8.00077C1.14286 9.26117 1.4673 10.4476 2.03746 11.4792L0.855168 14.2456C0.75065 14.4901 0.796978 14.7731 0.974036 14.9715C1.15109 15.17 1.42695 15.2482 1.68181 15.1721L4.76712 14.2514C5.82109 14.8555 7.04251 15.2007 8.34283 15.2007C12.3193 15.2007 15.5428 11.9772 15.5428 8.00077C15.5428 4.02432 12.3193 0.800781 8.34283 0.800781ZM9.91483 9.49726L9.01366 10.132C8.59161 9.89162 8.12498 9.55603 7.65691 9.08796C7.17033 8.60138 6.80959 8.09903 6.5436 7.63823L7.11629 7.15213C7.36205 6.94353 7.42932 6.59185 7.27792 6.30725L6.54821 4.93582C6.44995 4.75115 6.27277 4.62144 6.06705 4.58354C5.86132 4.54566 5.64956 4.60374 5.49196 4.74129L5.27561 4.93011C4.75534 5.38418 4.44764 6.13035 4.70266 6.88586C4.96705 7.66909 5.53129 8.90179 6.68719 10.0577C7.93078 11.3013 9.194 11.791 9.93272 11.9813C10.5279 12.1344 11.0912 11.9291 11.4881 11.6057L11.8937 11.2752C12.0671 11.1339 12.1607 10.9167 12.1444 10.6935C12.128 10.4703 12.0038 10.2691 11.8115 10.1545L10.6607 9.46881C10.4282 9.33036 10.1361 9.34147 9.91483 9.49726Z"
    //             fill="#3FB648"
    //           />
    //         </svg>
    //         +6811-9201-2182
    //       </p>
    //       <p>
    //         Digunakan untuk mengirim notifikasi melalui whatsapp. Tidak dapat
    //         membalas pesan
    //       </p>
    //     </div>
    //   ),
    // },
    {
      id: 4,
      title: "Unduh Cara Menggunakan Foodia",
      content: (
        <div className="flex text-sm flex-col gap-4 w-full">
          {cardManualsContentsChild.map((items) => (
            <button
              className="flex flex-row text-left items-center justify-between text-[#1D5882] w-full"
              onClick={() => toggleItemChild(items.id)}
            >
              <p>{items.title}</p>
              <svg
                width="18"
                height="18"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_3871_39028)">
                  <g clip-path="url(#clip1_3871_39028)">
                    <path
                      d="M8.86911 0H4.88202H4.57306L4.35474 0.218297L1.33646 3.23677L1.11816 3.45506V3.76387V9.98686C1.11816 11.0969 2.02116 12 3.13135 12H8.86911C9.97894 12 10.8819 11.0969 10.8819 9.98686V2.01319C10.8819 0.903 9.97894 0 8.86911 0ZM10.1367 9.98684C10.1367 10.6871 9.56919 11.2546 8.86911 11.2546H3.13135C2.43095 11.2546 1.86343 10.6871 1.86343 9.98684V3.76385H3.82552C4.40877 3.76385 4.88202 3.29093 4.88202 2.70752V0.745406H8.86911C9.56919 0.745406 10.1367 1.31292 10.1367 2.01319V9.98684Z"
                      fill="#1D5882"
                    />
                    <path
                      d="M4.03006 5.92578H3.36142C3.2341 5.92578 3.15784 6.00859 3.15784 6.13262V7.86123C3.15784 8.01095 3.25637 8.10964 3.39317 8.10964C3.52702 8.10964 3.62553 8.01097 3.62553 7.86123V7.33609C3.62553 7.32331 3.63207 7.31694 3.64484 7.31694H4.03006C4.50104 7.31694 4.78447 7.03039 4.78447 6.62291C4.78449 6.20905 4.50432 5.92578 4.03006 5.92578ZM4.00128 6.91257H3.64484C3.63207 6.91257 3.62553 6.9062 3.62553 6.89359V6.34913C3.62553 6.33636 3.63207 6.33001 3.64484 6.33001H4.00128C4.19863 6.33001 4.31645 6.44783 4.31645 6.62293C4.31647 6.79801 4.19863 6.91257 4.00128 6.91257Z"
                      fill="#1D5882"
                    />
                    <path
                      d="M5.86394 5.92578H5.35141C5.22409 5.92578 5.14783 6.00859 5.14783 6.13262V7.88675C5.14783 8.01097 5.22407 8.09049 5.35141 8.09049H5.86394C6.32542 8.09049 6.61213 7.94403 6.72667 7.59071C6.76792 7.46649 6.79049 7.31694 6.79049 7.00812C6.79049 6.69934 6.7679 6.54976 6.72667 6.42556C6.61211 6.07224 6.32542 5.92578 5.86394 5.92578ZM6.27796 7.42838C6.22363 7.6002 6.06784 7.67352 5.85116 7.67352H5.63484C5.62206 7.67352 5.61552 7.66714 5.61552 7.65439V6.36191C5.61552 6.34913 5.62206 6.34276 5.63484 6.34276H5.85116C6.06784 6.34276 6.22363 6.41607 6.27796 6.58791C6.30023 6.66123 6.31593 6.78854 6.31593 7.00815C6.31593 7.22776 6.3002 7.35507 6.27796 7.42838Z"
                      fill="#1D5882"
                    />
                    <path
                      d="M8.46488 5.92578H7.4146C7.28729 5.92578 7.21069 6.00859 7.21069 6.13262V7.86123C7.21069 8.01095 7.30955 8.10964 7.44636 8.10964C7.57988 8.10964 7.67872 8.01097 7.67872 7.86123V7.24362C7.67872 7.23102 7.68493 7.22464 7.6977 7.22464H8.30909C8.4459 7.22464 8.52542 7.14186 8.52542 7.02402C8.52542 6.90617 8.4459 6.82355 8.30909 6.82355H7.6977C7.68493 6.82355 7.67872 6.81718 7.67872 6.80441V6.34913C7.67872 6.33636 7.68493 6.33001 7.6977 6.33001H8.46488C8.59547 6.33001 8.68156 6.24409 8.68156 6.12955C8.68154 6.01168 8.59545 5.92578 8.46488 5.92578Z"
                      fill="#1D5882"
                    />
                  </g>
                </g>
                <defs>
                  <clipPath id="clip0_3871_39028">
                    <rect width="12" height="12" fill="white" />
                  </clipPath>
                  <clipPath id="clip1_3871_39028">
                    <rect width="12" height="12" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </button>
          ))}
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="bg-white flex flex-col w-full">
        <Header title="Tentang Foodia" />
        <div className="pt-16 pb-32 flex flex-col p-5 overflow-auto h-screen gap-4">
          {cardContents.map((items) => (
            <div
              key={items.id}
              className="flex items-center flex-col shadow-[0_1px_5px_3px_#F5F4F8] rounded-[16px] "
            >
              <button
                onClick={() => toggleItem(items.id)}
                className="flex items-center w-full bg-white flex-row justify-between rounded-2xl p-4 shadow-[0_1px_5px_3px_#F5F4F8]"
              >
                <p className="font-[800] text-[14px]">{items.title}</p>
                {openItems[items.id] ? (
                  <IconChevronUp size={20} className="text-primary" />
                ) : (
                  <IconChevronDown size={20} className="text-primary" />
                )}
              </button>
              {openItems[items.id] && (
                <div className="p-4 w-full">{items.content}</div>
              )}
            </div>
          ))}
          <button
            onClick={() => router.push("/send-questions")}
            className="flex items-center w-full bg-white flex-row justify-between rounded-2xl p-4 border-2 border-primary"
          >
            <p className="font-[750] text-[14px] text-primary">
              Kirim Pertanyaan
            </p>
            <IconChevronRight size={20} className="text-primary" />
          </button>
        </div>
      </div>
      <BottomNav />
    </>
  );
};

export default contactUs;
