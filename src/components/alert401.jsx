import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

const alert401 = (error, title, text,) => {
    const router = useRouter();

    Swal.fire({
        icon: error,
        title: title,
        text: text,
        showConfirmButton: true,
        confirmButtonText: "Login",
        confirmButtonColor: "green",
        showCancelButton: true,
        cancelButtonText: "Tutup",
        cancelButtonColor: "red",
        // timer: 2000,
    }).then((result) => {
        if (result.isConfirmed) {
            router.push('/login');
        } else if (result.isDismissed) {
            router.push("/home");
        }
    });
}

export default alert401;