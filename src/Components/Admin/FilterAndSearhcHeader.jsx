import React, { useState } from "react";
import { useGetCategoriesByLevelQuery } from "../../Store/Api/admin/category";
import SelectBox from "./SelectBox";
import SearchBox from "./SearchBox";

const FilterAndSearchHeader = ({ setParams }) => {
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
  );
};

export default FilterAndSearchHeader;
