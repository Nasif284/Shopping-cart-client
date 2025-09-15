import { ProductTable, SearchBox, SelectBox } from "../../Components/Admin";
import { FaPlus } from "react-icons/fa";
import { Button } from "@mui/material";
import { useGetCategoriesByLevelQuery } from "../../Store/Api/admin/category";
import { useState } from "react";
import { Link } from "react-router-dom";
const Products = () => {
  const [params, setParams] = useState({ page: 1, perPage: 10 });
  const [category, setCategory] = useState();
  const [subCat, setSubCat] = useState();
  let { data: subCats, isLoading: isSubCatLoading } =
    useGetCategoriesByLevelQuery({ level: "second" });
  let { data: rootCats, isLoading: isRootCatLoading } =
    useGetCategoriesByLevelQuery({ level: "first" });
  let { data: thirdCats, isLoading: isThirdCatLoading } =
    useGetCategoriesByLevelQuery({ level: "third" });
  if (isSubCatLoading || isRootCatLoading || isThirdCatLoading) {
    return <h1>Loading</h1>;
  }
  subCats = subCats.categories.filter((cat) => !cat.isBlocked);
  rootCats = rootCats.categories.filter((cat) => !cat.isBlocked);
  thirdCats = thirdCats.categories.filter((cat) => !cat.isBlocked);
  const handleCatChange = (selected) => {
    setParams((prev) => ({ ...prev, category: [selected] }));
    setCategory(selected.toLowerCase());
  };
  const handleSubCatChange = (selected) => {
    setParams((prev) => ({ ...prev, subCategory: [selected] }));
    setSubCat(selected.toLowerCase());
  };
  const handleThirdCatChange = (selected) => {
    setParams((prev) => ({ ...prev, thirdCategory: [selected] }));
  };
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
      <div className="flex items-center w-full pl-5 gap-5">
        <SelectBox
          placeholder={"Category"}
          category={rootCats}
          onChange={handleCatChange}
        />
        <SelectBox
          placeholder={"Sub Category"}
          category={subCats.filter((c) => c.parentCatName == category)}
          onChange={handleSubCatChange}
        />
        <SelectBox
          placeholder={"Third Level Category"}
          category={thirdCats.filter((c) => c.parentCatName == subCat)}
          onChange={handleThirdCatChange}
        />
        <SearchBox
          onSearch={(search) =>
            setParams((prev) => ({ ...prev, search: search || undefined }))
          }
        />
      </div>
      <div className="relative w-full overflow-x-scroll shadow-md sm:rounded-lg">
        <ProductTable params={params} setParams={setParams} />
      </div>
    </div>
  );
};

export default Products;
