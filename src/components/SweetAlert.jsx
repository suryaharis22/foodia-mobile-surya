// Compare this snippet from src/components/SweetAlert.jsx:

import Swal from "sweetalert2";

const SweetAlert = ({
  title,
  text,
  imageUrl = "/img/illustration/checklist.png",
  imageWidth,
  imageHeight,
  imageAlt,
  width,
  onClose,
}) => {
  Swal.fire({
    html: `
            <div class="grid justify-items-center">
                <h3 class="text-xl font-semibold text-primary text-center">
                    ${title}
                </h3>
            </div>
            <!-- Modal body -->
            <div class="grid justify-items-center">
            <img src="${imageUrl}" alt="${imageAlt}" width="${imageWidth}" height="${imageHeight} class="">
                <p class="text-base leading-relaxed text-gray-500 font-bold dark:text-gray-400">
                    ${text}
                </p>
            </div>
            `,
    width,
    showConfirmButton: false,
    timer: 2000,
  });

  return null; // Komponen ini tidak mengembalikan apa-apa ke tampilan
};

export default SweetAlert;
