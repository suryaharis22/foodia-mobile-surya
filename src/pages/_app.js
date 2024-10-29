import { AppStateProvider } from "@/components/page/UserContext";
import MainLayout from "@/layouts/MainLayout";
import "@/styles/globals.css";
import NextTopLoader from "nextjs-toploader";

export default function App({ Component, pageProps }) {
  return (
    <AppStateProvider>
      <MainLayout>
        <NextTopLoader />
        <Component {...pageProps} />
      </MainLayout>
    </AppStateProvider>
  );
}
