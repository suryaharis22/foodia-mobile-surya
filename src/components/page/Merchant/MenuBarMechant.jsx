// #region constants

import { IconCirclePlus } from "@tabler/icons-react";
import Link from "next/link";
import styles from "@/styles/Home.module.css";
import Image from "next/image";
import { useRouter } from "next/router";
import { IconBowlFilled } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import axios from "axios";
import Error401 from "@/components/error401";

const MenuBarMechant = () => {
  const router = useRouter();
  const pathname = router.pathname;
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState(0);
  const [role, setRole] = useState();
  const [jumlah, setJumlah] = useState(0);
  const [jumlahKupon, setJumlahKupon] = useState(0);

  useEffect(() => {
    setId(localStorage.getItem("id"));
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    const fetchData = () => {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}rating/not-reviewed?type=merchant&id=${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          setLoading(false);
          setJumlah(res.data.body.length);
        })
        .catch((error) => {
          setLoading(false);
          Error401(error, router);
        });
    };

    const kuponReserved = () => {
      const merchant_id = localStorage.getItem("id_merchant");

      // API endpoints
      const reservedUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}coupon/filter?merchant_id=${merchant_id}&status=reserved`;
      const activeUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}coupon/filter?merchant_id=${merchant_id}&status=active`;

      // Fetch both reserved and active coupons concurrently
      Promise.all([
        axios.get(reservedUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        axios.get(activeUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ])
        .then(([reservedRes, activeRes]) => {
          setLoading(false);

          // Sum the lengths of both responses
          const totalCoupons =
            reservedRes.data.body.length + activeRes.data.body.length;

          // Set the total number of coupons
          setJumlahKupon(totalCoupons);
        })
        .catch((error) => {
          setLoading(false);
          Error401(error, router);
        });
    };

    if (role === "merchant") {
      setRole(role);
      setId(localStorage.getItem("id"));
      fetchData();
      kuponReserved();
    } else {
      const interval = setInterval(() => {
        const updatedRole = localStorage.getItem("role");
        if (updatedRole === "merchant") {
          clearInterval(interval);
          setRole(updatedRole);
          setId(localStorage.getItem("id"));
          fetchData();
          kuponReserved();
        }
      }, 1000);
    }
  }, [id, pathname]);

  return (
    <div className="flex items-center justify-center px-6 pt-16 ">
      <div className="bg-gray-100 rounded-2xl w-full p-3">
        <div className="flex justify-between items-center text-center text-[12px] font-lato">
          {/* Menu or Create Menu Button */}
          {pathname !== "/merchant" ? (
            <Link href="/merchant" className="flex flex-col items-center gap-1 w-28">
              <div className={styles.iconMenu}>
                <IconBowlFilled />
              </div>
              <p className="font-normal text-black truncate">Daftar Menu</p>
            </Link>
          ) : (
            <Link href="/createmenu?step=1" className="flex flex-col items-center gap-1 w-full max-w-[100px] flex-grow">
              <div className={styles.iconMenu}>
                <IconCirclePlus />
              </div>
              <p className="font-normal text-black truncate">Buat Menu</p>
            </Link>
          )}

          {/* Pesanan */}
          <Link href="/merchant/pesanan" className="flex flex-col items-center gap-1 w-full max-w-[100px] flex-grow">
            <div className={styles.iconMenu}>
              <Image src="/icon/pesanan.png" alt="Pesanan" width={30} height={30} />
            </div>
            <p className="font-normal text-black truncate">Pesanan</p>
          </Link>

          {/* Saldo */}
          <Link href="/merchant/saldo" className="flex flex-col items-center gap-1 w-full max-w-[100px] flex-grow">
            <div className={styles.iconMenu}>
              <Image src="/icon/saldo.png" alt="Saldo" width={30} height={30} />
            </div>
            <p className="font-normal text-black truncate">Saldo</p>
          </Link>

          {/* Review with Badge */}
          <Link href="/merchant/review" className="flex flex-col items-center gap-1 w-full max-w-[100px] flex-grow">
            <div className="relative w-[48px] h-[48px] rounded-md bg-menu text-green flex items-center justify-center">
              {jumlah > 0 && (
                <div className="absolute top-0 right-0 h-[13px] w-[13px] bg-red-500 text-white rounded-full flex items-center justify-center text-[8px] font-bold">
                  <span>{jumlah}</span>
                </div>
              )}
              <Image src="/icon/ulasan.png" alt="Ulasan" width={30} height={30} />
            </div>
            <p className="text-xs font-normal text-black truncate">Ulasan</p>
          </Link>

          {/* Kupon with Badge */}
          <Link href="/merchant/kupon" className="flex flex-col items-center gap-1 w-full max-w-[100px] flex-grow">
            <div className="relative w-[48px] h-[48px] rounded-md bg-menu text-green flex items-center justify-center">
              {jumlahKupon > 0 && (
                <div className="absolute top-0 right-0 h-[13px] w-[13px] bg-red-500 text-white rounded-full flex items-center justify-center text-[8px] font-bold">
                  <span>{jumlahKupon}</span>
                </div>
              )}
              <Image src="/icon/kupon.png" alt="Kupon" width={30} height={30} />
            </div>
            <p className="text-xs font-normal text-black truncate">Kupon</p>
          </Link>
        </div>
      </div>

    </div>
  );
};

export default MenuBarMechant;
