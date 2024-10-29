import BottomNav from "@/components/BottomNav";
import Error401 from "@/components/error401";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import SweetAlert from "@/components/SweetAlert";
import { IconInfoCircle } from "@tabler/icons-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const sendQuestions = (profile) => {
  const router = useRouter();
  const [questions, setQuestions] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setLoading(true); // Set loading to true when starting authentication

    // if (inputPassword.length < 8) {
    // Toast.fire({
    //   icon: "error",
    //   title: "Password must be at least 8 characters",
    //   iconColor: "bg-black",
    // });
    //   setLoading(false);
    //   return;
    // }

    const token = localStorage.getItem("token");

    axios
      .post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}media/send-question`,
        {
          question: questions,
        },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setLoading(false);
        Swal.fire({
          icon: "success",
          title: "Pertanyaan telah terkirim",
          text: "Kami akan segera membalas pertanyaanmu melalui Email",
          showConfirmButton: false,
          timer: 2000,
        });
        router.push("/contact-us");
      })
      .catch((error) => {
        setLoading(false);
        console.error("Token:", token); // Debugging the token
        console.error("Error:", error); // Debugging the error
        Error401(error, router);
      });
  };

  const QUESTION_REGEX = /^[a-zA-Z0-9?!,. ]+$/;
  const [validQuestion, setValidQuestion] = useState(false);
  useEffect(() => {
    setValidQuestion(QUESTION_REGEX.test(questions));
  }, [questions]);

  return (
    <>
      <div className="bg-white flex flex-col w-full">
        <Header title="Kirim Pertanyaan" />
        <div className="pt-16 pb-32 flex flex-col p-5 overflow-auto h-screen gap-2">
          <div className="flex flex-row p-4 py-0 bg-gray-100 text-gray-400 text-sm rounded-lg focus:ring-blue-500 w-full focus:border-none pr-2">
            <textarea
              maxLength={120}
              onChange={(e) => setQuestions(e.target.value)}
              value={questions}
              type="text"
              className="w-full text-black min-h-[95px] p-0 py-4 bg-transparent focus:border-none outline-none"
              placeholder="Pertanyaan"
              required
              style={{ resize: "none" }}
            />
          </div>
          <p
            className={
              questions && !validQuestion
                ? "font-semibold instructions italic text-[10px] flex items-center"
                : "hidden"
            }
          >
            <IconInfoCircle size={15} className="mr-1 text-red-600" />
            <span className="text-red-600">
              Karakter special tidak tidak diperbolehkan
            </span>
          </p>
          <p className="text-gray-400 text-start text-xs mb-8">
            Kami akan membalas pertanyaanmu melalui Email
          </p>
          <button
            disabled={!questions || !validQuestion}
            onClick={() => handleSubmit()}
            type="submit"
            className={
              !questions || !validQuestion
                ? "text-white bg-gray-400 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-xl text-xl w-full sm:w-auto px-5 py-2.5 text-center"
                : "text-white bg-primary hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-xl text-xl w-full sm:w-auto px-5 py-2.5 text-center"
            }
          >
            Kirim
          </button>
        </div>
        {loading && <Loading />}
      </div>
      <BottomNav />
    </>
  );
};

export default sendQuestions;
