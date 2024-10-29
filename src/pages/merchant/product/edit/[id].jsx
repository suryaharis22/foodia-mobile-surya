// #region constants

import Header from "@/components/Header";
import EditProduct from "@/components/page/Merchant/EditProduct";

// #endregion

// #region functions

// #endregion

/**
 *
 */
const editProduct = () => {
  return (
    <main className="my-0 mx-auto min-h-full mobile-w">
      <div className="my-0 mx-auto min-h-screen max-w-480 overflow-x-hidden bg-white flex flex-col">
        <Header title="Ubah Menu" backto="/merchant" />
        <div className="grid justify-items-center w-full mt-24">
          <EditProduct />
        </div>
      </div>
    </main>
  );
};

export default editProduct;
