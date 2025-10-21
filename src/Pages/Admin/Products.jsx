import { ProductTable} from "../../Components/Admin";
import { FaPlus } from "react-icons/fa";
import { Button } from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";
import FilterAndSearchHeader from "../../Components/Admin/FilterAndSearhcHeader";
const Products = () => {
  const [params, setParams] = useState({ page: 1, perPage: 10, admin: true });
  return (
    <div className=" my-4 w-full shadow-md sm:rounded-lg bg-white">
      <div className="flex items-center justify-between p-5">
        <h2 className="text-[18px] font-[600]">All Products </h2>
        <div className="flex gap-4">
          <Link to={"/admin/products/add"}>
            <Button className="!flex !bg-blue-500 !text-white !font-[600] !capitalize !px-5 !gap-3 !mt-4">
              <FaPlus />
              Add Products
            </Button>
          </Link>
        </div>
      </div>
      <FilterAndSearchHeader setParams={setParams} />
      <div className="relative w-full overflow-x-scroll shadow-md sm:rounded-lg">
        <ProductTable params={params} setParams={setParams} />
      </div>
    </div>
  );
};

export default Products;
