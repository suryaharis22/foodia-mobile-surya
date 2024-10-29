import Swal from "sweetalert2";

const Error401 = (errCode, router, messages) => {
  const code = errCode?.response?.data?.code;
  if (code === 401) {
    localStorage.clear();
    Swal.fire({
      icon: "error",
      title: "Sesi Anda Berakhir",
      text: `Silakan Login Kembali untuk Melanjutkan`,
      showConfirmButton: true,
      confirmButtonText: "Login",
      confirmButtonColor: "green",
      showCancelButton: true,
      cancelButtonText: "Tutup",
      cancelButtonColor: "red",
      // timer: 2000,
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        localStorage.clear();
        router.push("/login");
      } else if (result.isDismissed) {
        localStorage.clear();
        localStorage.clear();
        router.push("/home");
      }
    });
    // router.push('/login');
  } else if (code === 500) {
    Swal.fire({
      position: "bottom",
      customClass: {
        popup: "custom-swal",
        icon: "custom-icon-swal",
        title: "custom-title-swal",
        confirmButton: "custom-confirm-button-swal",
      },
      icon: "error",
      title: `<p class="w-auto pl-1 font-bold text-md">Oops! Ada Kendala</p><p class="text-sm w-auto pl-1 font-light">Mohon maaf sedang ada gangguan, bisa dicoba beberapa saat lagi ya, terimakasih</p>`,
      html: `
            <div class="absolute px-28 ml-4 top-0 mt-4">
              <hr class="border border-black w-16 h-1 bg-slate-700 rounded-lg "/>
            </div>
          `,
      width: "375px",
      showConfirmButton: true,
      confirmButtonText: "Tutup",
      confirmButtonColor: "#3FB648",
    });
  } else if (errCode.code === "ERR_NETWORK") {
    Swal.fire({
      position: "bottom",
      customClass: {
        popup: "custom-swal",
        icon: "custom-icon-swal",
        title: "custom-title-swal",
        confirmButton: "custom-confirm-button-swal",
      },
      icon: "error",
      title: `<p class="w-auto pl-1 font-bold text-md">Kendala Jaringan</p><p class="text-sm w-auto pl-1 font-light">Pastikan koneksi anda terhubung dengan jaringan internet</p>`,
      html: `
            <div class="absolute px-28 ml-4 top-0 mt-4">
              <hr class="border border-black w-16 h-1 bg-slate-700 rounded-lg "/>
            </div>
          `,
      width: "375px",
      showConfirmButton: true,
      confirmButtonText: "Tutup",
      confirmButtonColor: "#3FB648",
    });
  } else if (code === 400) {
    Swal.fire({
      position: "bottom",
      customClass: {
        popup: "custom-swal",
        icon: "custom-icon-swal",
        title: "custom-title-swal",
        confirmButton: "custom-confirm-button-swal",
      },
      icon: "error",
      title: `<p class="w-auto pl-1 font-bold text-md">${messages ? messages.title : "Data Tidak Sesuai"
        }</p><p class="text-sm w-auto pl-1 font-light">${messages ? messages.text : "Silahkan Cek Kembali Data"
        }</p>`,
      html: `
            <div class="absolute px-28 ml-4 top-0 mt-4">
              <hr class="border border-black w-16 h-1 bg-slate-700 rounded-lg "/>
            </div>
          `,
      width: "375px",
      showConfirmButton: true,
      confirmButtonText: "Tutup",
      confirmButtonColor: "#3FB648",
    });
  } else if (code === 404) {
    // Not Found
    Swal.fire({
      position: "bottom",
      customClass: {
        popup: "custom-swal",
        icon: "custom-icon-swal",
        title: "custom-title-swal",
        confirmButton: "custom-confirm-button-swal",
      },
      icon: "error",
      title: `<p class="w-auto pl-1 font-bold text-md">${messages ? messages.title : "Data tidak ditemukan"
        }</p><p class="text-sm w-auto pl-1 font-light">${messages ? messages.text : "Silahkan coba lagi"
        }</p>`,
      html: `
            <div class="absolute px-28 ml-4 top-0 mt-4">
              <hr class="border border-black w-16 h-1 bg-slate-700 rounded-lg "/>
            </div>
          `,
      width: "375px",
      showConfirmButton: true,
      confirmButtonText: "Tutup",
      confirmButtonColor: "#3FB648",
    });
  }

  return null;
};

export default Error401;
