import CameraScan from "@/components/page/Merchant/CameraScan";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Swal from "sweetalert2";

const ScanKupon = () => {
    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        Swal.fire({
            title: 'Informasi Kupon Makan',
            html: `
              <ol class="list-decimal text-start text-[14px] font-normal">
                <li><p class="font-bold text-primary">Anda akan menerima pembayaran setelah selesai melaporkan kegiatan pemberian makan</p> kepada penerima manfaat menggunakan fitur kupon. Foto yang harus dilaporkan :</li>
                    <ul class="list-alpha ml-4">
                        <li >Melaporkan foto makanan yang disajikan sesuai pesanan pada kupon makan</li>
                        <li >Melaporkan foto wajah Penerima Manfaat yang mengklaim Kupon Makan</li>
                    </ul>
                <li>Pelaporan permintaan kupon makan hanya berlaku 1 jam dari scan kupon berhasil dilakukan. Jika melebihi dari 1 jam, maka kupon akan dianggap hangus sehingga anda tidak berhak menerima pembayaran makanan tersebut</li>  
            </ol>
              <div class="flex justify-center mt-4">
                <button id="cancelBtn" class="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-red-200 via-red-300 to-yellow-200 group-hover:from-red-200 group-hover:via-red-300 group-hover:to-yellow-200 dark:text-white dark:hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400">
                <span class="font-semibold relative px-5 py-2.5 transition-all ease-in duration-75 bg-white text-gray-900 rounded-md group-hover:bg-opacity-0">
                    Batal
                </span>
            </button>
                <button id="confirmBtn" class="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-primary via-[#22c55e] to-primary hover:from-[#205c24] hover:via-[#22c55e] hover:to-[#205c24] dark:text-white dark:hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400">
                  <span class="font-semibold relative px-5 py-2.5 transition-all ease-in duration-75 bg-white text-white rounded-md bg-opacity-0">
                      Lanjut
                  </span>
                </button>
              </div>
            `,
            // showConfirmButton: false,
            // showCancelButton: false,
            // buttonsStyling: false
        });

        // Attach event listeners to the custom buttons after rendering
        document.getElementById('confirmBtn').addEventListener('click', () => {
            Swal.close(); // Close the modal after confirming
        });

        document.getElementById('cancelBtn').addEventListener('click', () => {
            Swal.close(); // Close the modal after canceling
        });
    }, [router.query]);

    return (
        <main className="my-0 mx-auto min-h-full mobile-w">
            <CameraScan />
        </main>
    );
};

export default ScanKupon;
