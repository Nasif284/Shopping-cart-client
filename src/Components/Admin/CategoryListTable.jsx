import { Button, CircularProgress } from "@mui/material";
import {
  useBlockCategoryMutation,
  useGetCategoriesByLevelQuery,
} from "../../Store/Api/admin/category";
import AdminTable from "./AdminTable";
import EditCatModal from "./EditCatModal";
import { useState } from "react";
import BlockConfirmModal from "./BlockConfirmModel";
import SearchBox from "./SearchBox";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import AddCategoryOfferModal from "./AddCategoryOfferModal";
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
  const [offerOpen, setOfferOpen] = useState(false)
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
    return (
      <div className="w-full h-[100vh] flex items-center justify-center">
        <CircularProgress color="inherit" />
      </div>
    );
  }
  const toggleBlock = (id, isBlocked) => {
    setCategory(id);
    setConfOpen(true);
    setIsBlocked(isBlocked);
  };
  const handleAddOffer = (id) => {
    setOfferOpen(true)
    setCategory(id)
  }
  const CategoryRows = data.categories.map((cat) =>
    CategoryCreateData(
      <div className="w-[70px] rounded-md overflow-hidden">
        <img src={cat.image} alt="" className="w-full" />
      </div>,
      cat.name,
      <div className="flex gap-2 !text-[18px] justify-center items-center ">
        <Button
          onClick={() => handleAddOffer(cat._id)}
          className="!bg-blue-400 !text-white !capitalize !text-[12px]"
        >
          Add Offer
        </Button>
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
      <div className=" flex justify-between mt-3 ">
        <div className="w-[30%]">
          <SearchBox
            onSearch={(search) =>
              setParams((prev) => ({ ...prev, search: search || undefined }))
            }
          />
        </div>

        <Link to={"/admin/category/main/add"}>
          <Button className="!flex !bg-blue-500 !text-white !font-[600] !capitalize !px-5 !gap-3">
            <FaPlus />
            Add New Category
          </Button>
        </Link>
      </div>
      <div className="relative w-full overflow-x-scroll shadow-md sm:rounded-lg">
        <AdminTable
          columns={CategoryColumns}
          rows={CategoryRows}
          setParams={setParams}
          totalPosts={data.totalPosts}
          page={data.page}
        />
      </div>

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
      {offerOpen && <AddCategoryOfferModal open={offerOpen} handleClose={()=> setOfferOpen(false)} categoryId={category}/>}
    </>
  );
};

export default CategoryListTable;
