import Header from "@/components/Header";
import InputForm from "@/components/Imput";
import Loading from "@/components/Loading";
import Error401 from "@/components/error401";
import { IconCircleX, IconInfoCircle } from "@tabler/icons-react";
import { IconCircleCheck } from "@tabler/icons-react";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const penarikan = (penarikan) => {
  const router = useRouter();
  const [amount, setamount] = useState("");
  const [balance, setBalance] = useState("");
  const [bank, setBank] = useState("");
  const [recipient_name, setRecipient_name] = useState("");
  const [loading, setLoading] = useState(true);
  const [rekening, setRekening] = useState("");
  const [method, setMethod] = useState("");
  const parsedAmount = parseInt(amount.replace(/\./g, ""), 10);
  const eWalletFee = 4000;
  const bankFee = 4000;
  const maxWitdrawalEwallet = `${balance > 0 ? balance - bankFee : balance}`;
  const maxWitdrawalBank = `${balance > 0 ? balance - bankFee : balance}`;

  const PHONE_REGEX = /^(\+62|62|0)8[1-9][0-9]{7,10}$/;
  const [validPhone, setValidPhone] = useState(false);

  useEffect(() => {
    setValidPhone(PHONE_REGEX.test(rekening));
  }, [rekening]);

  useEffect(() => {
    const id = localStorage.getItem("id");
    const token = localStorage.getItem("token");

    axios
      .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}merchant/fetch/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setLoading(false);
        setBalance(response.data.body.wallet.balance);
      })
      .catch((error) => {
        setLoading(false);
        if (error.response && error.response.status === 401) {
          Error401(error, router);
        }
        console.error("Error fetching data:", error);
      });
  }, [balance]);

  const handlerecipient_nameChange = (event) => {
    setRecipient_name(event.target.value);
  };

  const handleBankChange = (event) => {
    setBank(event.target.value);
  };

  const handleMethodChange = (event) => {
    setMethod(event.target.value);
    // setamount("");
  };

  const handlerekeningChange = (event) => {
    setRekening(event.target.value);
  };

  const handleTarikSaldo = () => {
    Swal.fire({
      title: "Konfirmasi Penarikan",
      text: `Total penarikan setelah ditambah biaya penarikan adalah ${
        method === "BANK"
          ? formatPrice(parsedAmount + bankFee)
          : formatPrice(parsedAmount + eWalletFee)
      }`,
      showCancelButton: true,
      confirmButtonText: "Lanjut",
      cancelButtonText: "Batal",
      confirmButtonColor: "#3fb648",
      cancelButtonColor: "#c0bfbf",
    }).then((result) => {
      if (result.isConfirmed) {
        setLoading(true);
        const merchant_id = localStorage.getItem("id");
        const token = localStorage.getItem("token");
        const bankMethod = {
          merchant_id: parseInt(merchant_id),
          recipient_name: recipient_name,
          bank: bank,
          rekening: rekening,
          amount: parsedAmount + bankFee,
          admin_fee: bankFee,
          payment_method: method,
        };
        const eWalletMethod = {
          merchant_id: parseInt(merchant_id),
          bank: bank,
          rekening: rekening,
          amount: parsedAmount + eWalletFee,
          admin_fee: eWalletFee,
          payment_method: method,
        };
        {
          method === "BANK"
            ? axios
                .post(
                  `${process.env.NEXT_PUBLIC_API_BASE_URL}disbursement/request`,
                  bankMethod,
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                )
                .then((response) => {
                  setLoading(false);
                  Swal.fire({
                    icon: "success",
                    title: "Pengajuan Penarikan Saldo Berhasil",
                    text: "Silahkan cek rekening anda atau jika belum masuk sampai 1 x 24 jam, harap menghubungi admin@foodia.com",
                    showConfirmButton: true,
                    confirmButtonText: "Tutup",
                  }).then((result) => {
                    if (result.isConfirmed) {
                      router.push("/merchant/saldo");
                    }
                  });
                })
                .catch((error) => {
                  setLoading(false);
                  if (error.response && error.response.status === 401) {
                    Error401(error, router);
                  }
                  Swal.fire(
                    "Oops!",
                    "Terjadi kesalahan saat menarik saldo.",
                    "error"
                  );
                })
            : axios
                .post(
                  `${process.env.NEXT_PUBLIC_API_BASE_URL}disbursement/request`,
                  eWalletMethod,
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                )
                .then((response) => {
                  setLoading(false);
                  Swal.fire({
                    icon: "success",
                    title: "Pengajuan Penarikan Saldo Berhasil",
                    text: "Silahkan cek Link Aja anda atau jika belum masuk sampai 1 x 24 jam, harap menghubungi admin@foodia.com",
                    showConfirmButton: true,
                    confirmButtonText: "Tutup",
                  }).then((result) => {
                    if (result.isConfirmed) {
                      router.push("/merchant/saldo");
                    }
                  });
                })
                .catch((error) => {
                  setLoading(false);
                  if (error.response && error.response.status === 401) {
                    Error401(error, router);
                  }
                  Swal.fire(
                    "Oops!",
                    "Terjadi kesalahan saat menarik saldo.",
                    "error"
                  );
                });
        }
      }
    });
  };

  const formatPrice = (price) => {
    const formatter = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    });

    return formatter.format(price);
  };

  const handlePriceChange = (event) => {
    let inputVal = event.target.value;
    inputVal = inputVal.replace(/\D/g, ""); // Remove all non-numeric characters
    inputVal = inputVal.replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Add dots every 3 digits
    setamount(inputVal);
  };

  const bankOptions = [
    {
      id: 1,
      value: "Mandiri",
      label: "Mandiri",
    },
    {
      id: 2,
      value: "BNI",
      label: "BNI",
    },
    {
      id: 3,
      value: "BCA",
      label: "BCA",
    },
    {
      id: 4,
      value: "BRI",
      label: "BRI",
    },
    {
      id: 5,
      value: "BSI",
      label: "BSI",
    },
    {
      id: 6,
      value: "Permata",
      label: "Permata",
    },
    {
      id: 7,
      value: "CIMB Niaga",
      label: "CIMB Niaga",
    },
  ];

  const eWalletOptions = [
    {
      id: 1,
      value: "Link Aja",
      label: "Link Aja",
    },
  ];

  return (
    <div className="overflow-hidden bg-white flex flex-col">
      <Header title="Penarikan Saldo" />
      <div className="h-screen pt-20 overflow-auto flex flex-col justify-between pb-10">
        <div>
          <div className="mx-4 p-3 rounded-lg border-solid border-2 border-gray-300">
            <div className="flex items-center justify-between">
              <p>Saldo Penghasilan</p>
              <p className="text-xs font-bold text-primary">
                {formatPrice(balance)}
              </p>
            </div>
          </div>
          <div className="px-4 mt-4">
            <div className="mt-1 flex flex-row items-center pl-3 pr-4 py-0 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full h-10">
              {/* <IconBuildingBank /> */}
              <select
                name="bank"
                value={method}
                id="bank"
                onChange={handleMethodChange}
                className={
                  method === ""
                    ? "text-gray-400 w-full p-0 py-2 bg-transparent focus:border-none outline-none"
                    : "text-black w-full p-0 py-2 bg-transparent focus:border-none outline-none"
                }
              >
                <option className="text-gray-400" value="">
                  Metode Penarikan
                </option>
                <option value="BANK">Bank</option>
                <option value="E_WALLET">E-Wallet</option>
              </select>
            </div>

            {method ? (
              <>
                <div className="mt-2 flex flex-row items-center pl-3 pr-4 py-0 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg outline-none w-full h-10">
                  {/* <IconBuildingBank /> */}
                  <select
                    name="bank"
                    value={bank}
                    id="bank"
                    onChange={handleBankChange}
                    className={
                      bank === ""
                        ? "text-gray-400 w-full p-0 py-2 bg-transparent focus:border-none outline-none"
                        : "text-black w-full p-0 py-2 bg-transparent focus:border-none outline-none"
                    }
                  >
                    <option className="text-gray-400" value="">
                      {method === "BANK" ? "Pilih Bank" : "Pilih E-Wallet"}
                    </option>
                    {method === "BANK"
                      ? bankOptions.map((data) => (
                          <option key={data.id} value={data.value}>
                            {data.label}
                          </option>
                        ))
                      : eWalletOptions.map((data) => (
                          <option key={data.id} value={data.value}>
                            {data.label}
                          </option>
                        ))}
                  </select>
                </div>

                {bank && (
                  <>
                    {method === "BANK" && (
                      <div className="mt-2 flex flex-row items-center p-4 pr-0 py-0 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg outline-none w-full h-10 ">
                        <input
                          onChange={handlerecipient_nameChange}
                          value={recipient_name}
                          name="recipient_name"
                          type="text"
                          id="recipient_name"
                          className="w-full p-0 py-2 bg-transparent border-none outline-none"
                          placeholder="Nama Penerima"
                          required
                        />
                      </div>
                    )}
                    <div>
                      <div className="mt-2 flex flex-row items-center p-4 pr-0 py-0 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg outline-none w-full h-10 ">
                        {/* <IconCreditCard /> */}
                        <input
                          onChange={handlerekeningChange}
                          value={rekening}
                          name="rekening"
                          type="number"
                          min="0"
                          onKeyDown={(e) => {
                            if (
                              e.key === "e" ||
                              e.key === "E" ||
                              e.key === "+" ||
                              e.key === "-"
                            ) {
                              e.preventDefault();
                            }
                          }}
                          id="rekening"
                          className="w-full p-0 py-2 bg-transparent border-none outline-none"
                          placeholder={
                            method === "BANK"
                              ? "Nomor Rekening"
                              : "Nomor E-Wallet"
                          }
                          required
                        />
                        {method === "E_WALLET" && (
                          <>
                            <IconCircleCheck
                              className={
                                validPhone ? "text-green-600 pr-1" : "hidden"
                              }
                            />
                            <IconCircleX
                              className={
                                !rekening || validPhone
                                  ? "hidden"
                                  : "text-red-600 pr-1"
                              }
                            />
                          </>
                        )}
                      </div>
                      {method === "E_WALLET" && (
                        <p
                          className={
                            rekening && !validPhone
                              ? "instructions italic text-[10px] flex items-center"
                              : "hidden"
                          }
                        >
                          <IconInfoCircle
                            size={15}
                            className="mr-1 text-red-600"
                          />
                          <span className="text-red-600">
                            Diawali (08), Minimal 10 dan maksimal 13 angka.
                          </span>
                        </p>
                      )}
                    </div>
                  </>
                )}
              </>
            ) : (
              ""
            )}
          </div>
          {method && (
            <div className="mx-4 mt-4">
              <div className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full h-10 flex gap-2 items-center pl-4 pr-4">
                <p className="">Rp</p>
                <InputForm
                  cssInput="bg-gray-50 border text-gray-900 text-sm w-full outline-none border-none h-full rounded-lg"
                  // label="amount"
                  type="text"
                  name="amount"
                  value={amount}
                  onChange={handlePriceChange}
                  placeholder="Nominal Penarikan"
                />
                <button
                  // hidden={!method}
                  onClick={() =>
                    method === "BANK"
                      ? setamount(
                          maxWitdrawalBank.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                        )
                      : setamount(
                          maxWitdrawalEwallet.replace(
                            /\B(?=(\d{3})+(?!\d))/g,
                            "."
                          )
                        )
                  }
                  title="Tarik Maksimal Penarikan"
                  className="text-primary"
                >
                  Max.
                </button>
              </div>

              <div className="flex justify-between">
                {parsedAmount + bankFee > balance ||
                parsedAmount + eWalletFee > balance ? (
                  <p className="text-[10px] text-red-500 font-semibold mt-2">
                    Saldo anda tidak mencukupi
                  </p>
                ) : (
                  <div className="flex flex-row items-center text-center justify-between w-full">
                    <p className="text-[10px] text-blue-800 font-semibold mt-2">
                      Minimal Penarikan Rp 10.000
                    </p>
                    {method === "BANK" ? (
                      <p className="text-[10px] text-blue-800 font-semibold mt-2">
                        Max Penarikan {formatPrice(maxWitdrawalBank)}
                      </p>
                    ) : method === "E_WALLET" ? (
                      <p className="text-[10px] text-blue-800 font-semibold mt-2">
                        Max Penarikan {formatPrice(maxWitdrawalEwallet)}
                      </p>
                    ) : (
                      ""
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="flex pt-4 justify-end flex-col px-4">
          <p className="text-center text-xs font-semibold mx-4 my-2">
            Dengan klik tombol di bawah, anda telah memastikan tidak ada
            kesalahan dalam pengisian data
          </p>
          <p className="text-[10px] py-1 text-blue-800 font-semibold">
            {method === "BANK"
              ? `*Dikenakan biaya layanan transaksi penarikan ${formatPrice(
                  bankFee
                )} dari jumlah penarikan`
              : `*Dikenakan biaya layanan transaksi penarikan ${formatPrice(
                  eWalletFee
                )} dari jumlah penarikan`}
          </p>
          {method === "BANK" ? (
            <button
              disabled={
                parsedAmount + bankFee > balance ||
                parsedAmount < 10000 ||
                amount == "" ||
                balance == "" ||
                bank == "" ||
                recipient_name == "" ||
                rekening == ""
              }
              className={
                parsedAmount + bankFee > balance ||
                parsedAmount < 10000 ||
                amount == "" ||
                balance == "" ||
                bank == "" ||
                recipient_name == "" ||
                rekening == ""
                  ? "bg-gray-400 text-white w-full h-12 rounded-lg font-bold"
                  : "bg-primary text-white w-full h-12 rounded-lg font-bold"
              }
              onClick={handleTarikSaldo}
            >
              Ajukan Penarikan Saldo
            </button>
          ) : (
            <button
              disabled={
                parsedAmount + eWalletFee > balance ||
                parsedAmount < 10000 ||
                amount == "" ||
                balance == "" ||
                bank == "" ||
                // recipient_name == "" ||
                rekening == "" ||
                !validPhone
              }
              className={
                parsedAmount + eWalletFee > balance ||
                parsedAmount < 10000 ||
                amount == "" ||
                balance == "" ||
                bank == "" ||
                // recipient_name == "" ||
                rekening == "" ||
                !validPhone
                  ? "bg-gray-400 text-white w-full h-12 rounded-lg font-bold"
                  : "bg-primary text-white w-full h-12 rounded-lg font-bold"
              }
              onClick={handleTarikSaldo}
            >
              Ajukan Penarikan Saldo
            </button>
          )}
        </div>
      </div>
      {loading && <Loading />}
    </div>
  );
};

export default penarikan;
