// src/pages/creatcampaign.jsx
import { ContextAddCampaignProvider } from "@/components/FormCampaing/ContextAddCampaign";
import Header from "@/components/Header";
import FormGantiMenu from "@/components/page/Detonator/FormGantiMenu";
import { useRouter } from "next/router";

const GantiMenu = ({ pageProps }) => {
  const router = useRouter();
  const { step } = router.query;

  return (
    <ContextAddCampaignProvider>
      <main className="my-0 mx-auto min-h-full mobile-w">
        <div className="my-0 mx-auto min-h-screen max-w-480 overflow-x-hidden bg-white flex flex-col">
          <Header title={"Pilih Merchant"} />
          <FormGantiMenu {...pageProps} />
        </div>
      </main>
    </ContextAddCampaignProvider>
  );
};

export default GantiMenu;
