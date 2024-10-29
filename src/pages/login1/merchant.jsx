import LoginPage from "@/components/page/LoginPage";


const LoginMerchant = () => {
    return (
        <main className="my-0 mx-auto min-h-full mobile-w">
            <div className="my-0 mx-auto min-h-screen max-w-480 overflow-x-hidden bg-white flex flex-col">

                <LoginPage register={'/registrasi/merchant?step=1'} Btn={'Daftar Merchant'} />
            </div>

        </main>
    );
}

export default LoginMerchant;