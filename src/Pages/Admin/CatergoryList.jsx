import CategoryListTable from "../../Components/Admin/CategoryListTable";

const CategoryList = () => {
  return (
    <div className="my-4 w-full shadow-md sm:rounded-lg bg-white p-5">
      <div className="flex items-center justify-between ">
        <h2 className="text-[18px] font-[600]">Category List</h2>
      </div>
      <CategoryListTable />
    </div>
  );
};

export default CategoryList;
