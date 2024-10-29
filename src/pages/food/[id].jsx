import CardRepordFood from "@/components/CardRepordFood";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import Error401 from "@/components/error401";
import { encryptId } from "@/utils/EndCodeHelper1";
import { IconBrandWhatsapp } from "@tabler/icons-react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const FoodCampaign = () => {
  const router = useRouter();
  const { id } = router.query;
  const [foodOrder, setFoodOrder] = useState([]);
  const [DataAPI, setDataApi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [campDetonator, setCampDetonator] = useState();
  const [detonator_id, setDetonatorId] = useState();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const id_detonator = localStorage.getItem("id_detonator");
    setDetonatorId(parseInt(id_detonator));
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}campaign/fetch/${id}`
        )
        setFoodOrder(response.data.body.orders);
        setDataApi(response.data.body);
        setCampDetonator(response.data.body.detonator_id);
        setLoading(false);
      } catch (error) {
        Error401(error, router);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, campDetonator]);

  const groupedOrders = foodOrder.reduce((acc, order) => {
    const merchantName = order.merchant.merchant_name;
    if (!acc[merchantName]) {
      acc[merchantName] = [];
    }
    acc[merchantName].push(order);
    return acc;
  }, {});

  const jumlahPesananDiproses = foodOrder.reduce((total, item) => {
    if (item.approval_status === "approved") {
      total += 1;
    }
    return total;
  }, 0);

  return (
    <>
      <main className="overflow-hidden">
        <div className="my-0 mx-auto max-w-480 h-screen overflow-hidden bg-white flex flex-col">
          <Header title="Status Merchant" />
          <div className="container mx-auto mt-14 bg-white h-screen">
            <p className="px-4">
              Pesanan Terkonfirmasi : {jumlahPesananDiproses} / {foodOrder.length}
            </p>
            <div className="items-center justify-center overflow-auto h-screen pb-[100px] w-full">
              {Object.keys(groupedOrders).map((merchantName) => (
                <div key={merchantName}>
                  <div className="flex justify-between items-center text-md font-bold w-full px-4">
                    <p className="mr-2 my-1">{merchantName}</p>
                    {campDetonator === detonator_id && (
                      <Link
                        className="px-1 py-1 hover:text-primary"
                        target="_blank"
                        href={`https://api.whatsapp.com/send?phone=62${groupedOrders[merchantName][0].merchant.oauth.phone.replace(/^0+/, '')}&text=Halo%20${merchantName}%2C%20Saya%20dengan%20${DataAPI?.detonator?.oauth?.fullname}%20ingin%20menanyakan%20terkait%20campaign%20Foodia%20${DataAPI?.event_name}%20pada%20link%20berikut%0A%0Ahttps%3A%2F%2Ffoodia.id%2Fcampaign%2F${DataAPI?.id}`}
                      // href={`https://wa.me/62${groupedOrders[merchantName][0].merchant.oauth.phone.replace(/^0+/, '')}`}
                      >
                        <div className="flex items-center mr-4">
                          <IconBrandWhatsapp className="m-1 text-primary" />
                          <p>Hubungi</p>
                        </div>
                      </Link>
                    )}
                  </div>
                  {groupedOrders[merchantName].map((item) => (
                    <CardRepordFood
                      key={item.id}
                      detonator_id={campDetonator}
                      campaign_id={item.campaign_id}
                      id_order={item.id}
                      img={
                        item.merchant_product.images.length > 0
                          ? `${process.env.NEXT_PUBLIC_URL_STORAGE}${item.merchant_product.images[0].image_url}`
                          : "/img/default-image.png"
                      }
                      title={item.merchant_product.name}
                      price={item.total_amount}
                      price_product={item.total_price_product}
                      nameMerchant={item.merchant.merchant_name}
                      qty={item.qty}
                      approval_status={item.approval_status}
                      order_status={item.order_status}
                      is_report={item.is_report}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
        {loading && <Loading />}
      </main>

    </>
  );
};

export default FoodCampaign;
