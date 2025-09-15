import { Button } from "@mui/material";
import {
  useBlockCategoryMutation,
  useGetCategoriesByLevelQuery,
} from "../../Store/Api/admin/category";
import AdminTable from "./AdminTable";
import EditCatModal from "./EditCatModal";
import { useState } from "react";
import BlockConfirmModal from "./BlockConfirmModel";
const CategoryColumns = [
  { id: "image", label: "Image", minWidth: 100 },
  { id: "name", label: "Category Name", minWidth: 100, align: "center" },
  { id: "action", label: "Action", minWidth: 100, align: "center" },
];

function CategoryCreateData(image, name, action) {
  return { image, name, action };
}

const CategoryListTable = () => {
  const [params, setParams] = useState({ page: 1, perPage: 10 });
  const { data, isLoading } = useGetCategoriesByLevelQuery({
    level: "first",
    params,
  });
  const [block, { isLoading: isBlockLoading }] = useBlockCategoryMutation();
  const [open, setOpen] = useState(false);
  const [confOpen, setConfOpen] = useState(false);
  const [isBlocked, setIsBlocked] = useState();
  const [category, setCategory] = useState();
  const handleClose = () => {
    setOpen(false);
  };
  const handleEdit = (cat) => {
    setCategory(cat);
    setOpen(true);
  };
  if (isLoading) {
    return <h1>Loading...</h1>;
  }
  const toggleBlock = (id, isBlocked) => {
    setCategory(id);
    setConfOpen(true);
    setIsBlocked(isBlocked);
  };
  const CategoryRows = data.categories.map((cat) =>
    CategoryCreateData(
      <div className="w-[70px] rounded-md overflow-hidden">
        <img src={cat.image} alt="" className="w-full" />
      </div>,
      cat.name,
      <div className="flex gap-2 !text-[18px] justify-center items-center ">
        <Button
          onClick={() => handleEdit(cat)}
          className="!bg-green-500 !text-white !capitalize !text-[12px]"
        >
          Edit
        </Button>
        {cat.isBlocked ? (
          <Button
            onClick={() => toggleBlock(cat._id, cat.isBlocked)}
            className="!bg-green-500 !text-white !capitalize !text-[12px]"
          >
            list
          </Button>
        ) : (
          <Button
            onClick={() => toggleBlock(cat._id, cat.isBlocked)}
            className="!bg-red-500 !text-white !capitalize !text-[12px]"
          >
            Unlist
          </Button>
        )}
      </div>
    )
  );
  return (
    <>
      <AdminTable
        columns={CategoryColumns}
        rows={CategoryRows}
        setParams={setParams}
        totalPosts={data.totalPosts}
        page={data.page}
      />
      {open && (
        <EditCatModal
          open={open}
          category={category}
          handleClose={handleClose}
        />
      )}
      {confOpen && (
        <BlockConfirmModal
          open={confOpen}
          id={category}
          unlist={true}
          block={block}
          isBlocked={isBlocked}
          isLoading={isBlockLoading}
          handleClose={() => setConfOpen(false)}
        />
      )}
    </>
  );
};

export default CategoryListTable;
