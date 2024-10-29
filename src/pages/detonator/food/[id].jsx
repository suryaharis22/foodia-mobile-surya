import styles from "@/styles/Campaign.module.css";
import { IconCirclePlus } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { Link } from "tabler-icons-react";
import Header from "@/components/Header";
import CardRepordFood from "@/components/CardRepordFood";
import Error401 from "@/components/error401";
import Loading from "@/components/Loading";
const FoodCampaign = () => {
  const router = useRouter();
  const { id } = router.query;
  const [foodOrder, setFoodOrder] = useState([]);
  const [DataAPI, setDataApi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detonator_id, setDetonatorId] = useState();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchData = async () => {
      try {
        if (!id) {
          throw new Error("Missing required session data");
        }

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}campaign/fetch/${id}`
        );

        setFoodOrder(response.data.body.orders);
        setDataApi(response.data.body);
        setDetonatorId(response.data.body.detonator_id);
        setLoading(false);
      } catch (error) {
        Error401(error, router);
      }
    };

    fetchData();
  }, [id, detonator_id]);

  const jumlahPesananDiproses = foodOrder.reduce((total, item) => {
    if (item.order_status === "selesai") {
      total = total + 1;
    }
    return total;
  }, 0);

  return (
    <>
      <main className="my-0 mx-auto min-h-full mobile-w">
        <div className="my-0 mx-auto min-h-screen max-w-480 overflow-x-hidden bg-white flex flex-col">
          {/* <Header title="Lacak Pesanan" backto={`/detonator/campaign/${id}`} /> */}
          <div className="container mx-auto mt-24 bg-white h-screen">
            <div className="mx-auto text-center p-2 text-primary">
              <h1 className="font-bold">Status Pesanan</h1>
              <h1>{DataAPI.event_name}</h1>
            </div>
            <hr className="w-full h-1 mx-auto mt-2 bg-gray-300 border-0 rounded" />

            {loading && <Loading />}
            <div className="items-center justify-center mt-2 w-full">
              {foodOrder.map((item) => (
                <>
                  <CardRepordFood
                    key={item.id}
                    detonator_id={detonator_id}
                    id_order={item.id}
                    img={
                      item.merchant_product.images.length > 0
                        ? `${process.env.NEXT_PUBLIC_URL_STORAGE}${item.merchant_product.images[0].image_url}`
                        : "/img/default-image.png"
                    }
                    title={item.merchant_product.name}
                    price={item.merchant_product.price}
                    nameMerchant={item.merchant.merchant_name}
                    qty={item.qty}
                    approval_status={item.approval_status}
                    order_status={item.order_status}
                    is_report={item.is_report}
                  />
                </>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default FoodCampaign;
