import { VariantListView } from "../../Components/Admin";
import { Link, useParams } from "react-router-dom";
import {
  useGetProductByIdQuery,
  useGetVariantsQuery,
} from "../../Store/Api/admin/product";
import { Review } from "../../Components/User";
import { Button } from "@mui/material";
import { FaPlus } from "react-icons/fa6";
import AddVariantModal from "../../Components/Admin/AddVariantModal";
import { useState } from "react";

const ProductDetails = () => {
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const { data, isLoading } = useGetVariantsQuery(id);
  const { data: product, isLoading: isProductLoading } =
    useGetProductByIdQuery(id);

  if (isLoading || isProductLoading) return <h1>Loading...</h1>;

  return (
    <>
      <div className="mb-3 px-3 gap-2 flex-col py-5 rounded-md border bg-white border-[#d8d8d8] overflow-hidden shadow-md flex">
        <h1>
          Product Name:
          <span className="font-[400]">{product.product.name}</span>
        </h1>
        <h1>
          Description:
          <span className="font-[400]">{product.product.description}</span>
        </h1>
      </div>
      <div className="flex justify-between items-center mb-3">
        <h1 className="text-[18px]">Variants</h1>
        <Button
          onClick={() => setOpen(true)}
          className="!flex !bg-blue-500 !text-white !font-[600] !capitalize !px-5 !gap-3 !mt-4"
        >
          <FaPlus />
          Add New Variant
        </Button>
      </div>
      <VariantListView
        variants={data.variants}
        category={product.product.category.name}
      />
      <div className=" pt-10 bg-white w-full border-[#d8d8d8] overflow-hidden shadow-md rounded-md px-5 py-3">
        <div className="flex items-center gap-8 mb-5">
          <span className={` text-[17px] font-[600] cursor-pointer link`}>
            Reviews (12)
          </span>
        </div>
        <div className="shadow-md py-5 px-8 w-full rounded-md">
          <div className="reviewsWrapper max-h-[500px] overflow-x-hidden overflow-y-scroll w-full">
            <Review />
            <Review />
            <Review />
            <Review />
            <Review />
            <Review />
            <Review />
          </div>
        </div>
      </div>

      {open && (
        <AddVariantModal
          open={open}
          handleClose={() => setOpen(false)}
          id={id}
          category={product.product.category.name}
        />
      )}
    </>
  );
};

export default ProductDetails;
