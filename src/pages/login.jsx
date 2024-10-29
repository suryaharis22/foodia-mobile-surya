import Header from "@/components/Header";
import LoginPage from "@/components/page/LoginPage";

const login = (login) => {
  return (
    <main className="my-0 mx-auto min-h-full mobile-w">
      <div className="my-0 mx-auto h-screen max-w-480 overflow-x-hidden bg-white flex flex-col">
        <LoginPage />
      </div>
    </main>
  );
};

export default login;
