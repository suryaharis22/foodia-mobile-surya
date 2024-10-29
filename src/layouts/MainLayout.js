import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";
import { useEffect, useState } from "react";

const MainLayout = (props) => {
  // const [isSafari, setIsSafari] = useState(false);

  // useEffect(() => {
  //   const userAgent = navigator.userAgent;
  //   const isSafariBrowser =
  //     /Safari/.test(userAgent) && !/Chrome/.test(userAgent);
  //   // const isChromeBrowser =
  //   //   /Chrome/.test(userAgent) &&
  //   //   !/Edge/.test(userAgent) &&
  //   //   !/OPR/.test(userAgent);
  //   setIsSafari(isSafariBrowser);
  // }, []);

  // if (isSafari) {
  //   return (
  //     <div>
  //       <h1>Foodia Belum Mendukung Browser Ini</h1>
  //       <p>Silahkan Coba Browser Lain (Chrome)</p>
  //     </div>
  //   );
  // }

  return <main className="my-0 mx-auto mobile-w">{props.children}</main>;
};
export default MainLayout;
