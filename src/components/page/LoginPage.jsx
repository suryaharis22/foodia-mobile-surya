import {
  IconEye,
  IconEyeClosed,
  IconLock,
  IconMail,
  IconRefresh,
} from "@tabler/icons-react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import Header from "../Header";
import Loading from "../Loading";
import { useAppState } from "./UserContext";
import Error401 from "../error401";
import Image from "next/image";

const LoginPage = () => {
  const [inputEmail, setEmail] = useState("");
  const [inputPassword, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { state, setRegistrasi } = useAppState();
  const [showPassword, setShowPassword] = useState(true);
  const [captcha, setCaptcha] = useState("");
  const [message, setMessage] = useState("");
  const [inputCaptcha, setInputCaptcha] = useState("");
  const userInputRef = useRef(null);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const Toast = Swal.mixin({
    toast: true,
    position: "center",
    iconColor: "white",
    customClass: {
      popup: "colored-toast",
    },
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
  });

  useEffect(() => {
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");
    const status = localStorage.getItem("status");

    if (role === "detonator" && token && status === "approved") {
      router.push("/detonator");
    } else if (role === "merchant" && token && status === "approved") {
      router.push("/merchant");
    }
  }, [router]);

  const handleSubmit = async () => {
    setLoading(true);

    if (inputPassword.length < 8) {
      Toast.fire({
        icon: "error",
        title: "Password must be at least 8 characters",
        iconColor: "bg-black",
      });
      setLoading(false);
      return;
    }

    try {
      // Login request
      const {
        data: { body: responseData },
      } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}auth/login`,
        { email: inputEmail, password: inputPassword }
      );

      if (!responseData.is_active) {
        handleInactiveAccount();
        return;
      }

      // Check registration status
      const {
        data: { body },
      } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}auth/check-register-status`,
        { headers: { Authorization: `Bearer ${responseData.token}` } }
      );

      // Store registration details
      storeUserDetails(responseData, body);

      // Login success notification
      Swal.fire({
        icon: "success",
        title: "Login Success",
        text: `Welcome ${responseData.fullname}`,
        showConfirmButton: false,
        timer: 2000,
      });

      // Redirect after 2 seconds
      setTimeout(() => router.push("/home"), 2000);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle inactive account
  const handleInactiveAccount = () => {
    const formData = { email: inputEmail };
    setRegistrasi(formData);

    Swal.fire({
      icon: "error",
      title: "Account Inactive",
      text: "Your account is not active. Please contact support.",
      showConfirmButton: false,
      timer: 2000,
    });

    setTimeout(() => router.push("/otp"), 2000);
  };

  // Store user details in localStorage
  const storeUserDetails = (responseData, body) => {
    const { detonator, merchant, beneficiaries } = body;

    localStorage.setItem(
      "id_detonator",
      detonator?.status === "approved" ? detonator.detonator_id : "-"
    );
    localStorage.setItem(
      "id_merchant",
      merchant?.status === "approved" ? merchant.merchant_id : "-"
    );
    localStorage.setItem(
      "id_beneficiaries",
      beneficiaries?.status === "approved"
        ? beneficiaries.beneficiaries_id
        : "-"
    );

    // Ambil status dari detonator, merchant, atau beneficiaries
    const status =
      detonator?.status || merchant?.status || beneficiaries?.status || " ";

    // Ambil note dari detonator, merchant, atau beneficiaries
    const note =
      detonator?.note || merchant?.note || beneficiaries?.note || " ";

    localStorage.setItem("fullname", responseData.fullname);
    localStorage.setItem("phone", responseData.phone);
    localStorage.setItem("email", responseData.email);
    localStorage.setItem("role", responseData.role);
    localStorage.setItem("token", responseData.token);
    localStorage.setItem("id", responseData.user_id || " ");
    localStorage.setItem("status", status);
    localStorage.setItem("note", note);
  };

  // Handle errors during login
  const handleError = (error) => {
    const messages = {
      title: "Login Failed",
      text: "Please check your email and password or try again",
    };

    Error401(error, router, messages);
    Swal.fire({
      icon: "error",
      title: messages.title,
      text: messages.text,
      showConfirmButton: false,
      timer: 2000,
    });
  };

  // Function to generate a new captcha
  const generateCaptcha = () => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let generatedCaptcha = "";
    for (let i = 0; i < 5; i++) {
      generatedCaptcha += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    setCaptcha(generatedCaptcha);
    // Clear the user input field
    if (userInputRef.current) userInputRef.current.value = "";
  };

  // Function to check the user input against the generated captcha
  const checkCaptcha = () => {
    const userInput = userInputRef.current.value;
    if (userInput === captcha) {
      handleSubmit();
    } else {
      setMessage("Captcha Tidak Sesuai");
      // generateCaptcha(); // Generate a new captcha after checking
    }
  };

  // Generate captcha when the component mounts
  useEffect(() => {
    generateCaptcha();
  }, []);

  return (
    <div className="container mx-auto mt-24">
      <Header backto="/" />
      <div className="flex justify-center ">
        <Image src="/img/LogoFoodia.png" alt="logo" width={200} height={0} className="w-[200px]  object-cover" />
        {/* <Image
          src="/img/LogoFoodia.png"
          alt="logo"
          width={0}
          height={0}
          className="w-[200px]  object-cover" />
        <h1 className="text-4xl text-primary font-bold">FOODIA</h1> */}
      </div>

      <div className="p-4 mt-32 flex flex-col gap-2">
        <div className="flex flex-row items-center p-4 pr-0 py-0 bg-gray-100 text-gray-400 text-sm rounded-lg focus:ring-blue-500 w-full focus:border-none">
          <IconMail />
          <input
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            id="email"
            className="text-black ml-2 w-full p-0 py-4 pl-1 bg-transparent focus:border-none"
            placeholder="Email"
            required
          />
        </div>
        <div className="flex flex-row items-center p-4 pr-2 py-0 bg-gray-100 text-sm rounded-lg focus:ring-blue-500 w-full text-gray-400">
          <IconLock />
          <input
            onChange={(e) => setPassword(e.target.value)}
            type={showPassword ? "password" : "text"}
            id="password"
            className="text-black ml-2 w-full p-0 py-4 pl-1 bg-transparent"
            placeholder="Password"
            required
          />
          <button onClick={handleClickShowPassword}>
            {showPassword ? <IconEye /> : <IconEyeClosed />}
          </button>
        </div>
        <div className="flex items-start mb-4">
          <Link
            href="/forgot-password"
            htmlFor="remember"
            className="text-xs font-bold text-blue-800 hover:underline"
          >
            Lupa Kata Sandi?
          </Link>
        </div>
        <div className="grid gap-6 content-center">
          <div className="flex flex-col gap-1">
            <div className="flex flex-row gap-2">
              <div id="captcha-container">
                <span className="font-sans" id="image">
                  {captcha}
                </span>
              </div>
              <div className="flex flex-col w-[50%]">
                <input
                  className="border-[1px] border-black rounded-sm"
                  type="text"
                  ref={userInputRef}
                  id="submit"
                  placeholder="Input Captcha"
                  onChange={(e) => setInputCaptcha(e.target.value)}
                />
                <div className="text-red-500 text-sm ">
                  {message !== "Matched" && message}
                </div>
              </div>
              <button onClick={() => generateCaptcha()}>
                <IconRefresh size={20} color="green" />
              </button>
            </div>
          </div>
          <button
            disabled={!inputEmail || !inputPassword || !inputCaptcha}
            onClick={checkCaptcha}
            type="submit"
            className={`text-white ${!inputEmail || !inputPassword || !inputCaptcha
              ? "bg-slate-400"
              : "bg-primary"
              } outline-none focus:ring-gray-300 font-bold rounded-xl text-md w-full sm:w-auto py-2 text-center `}
          >
            Masuk
          </button>
        </div>
      </div>

      <div className="mobile-w flex gap-1 justify-center pt-32">
        <label className="font-light text-sm">Tidak memiliki akun?</label>
        <Link
          className="text-blue-950 font-bold hover:underline text-sm"
          href="/registrasi"
        >
          Daftar
        </Link>
      </div>
      {loading && <Loading />}
    </div>
  );
};

export default LoginPage;
