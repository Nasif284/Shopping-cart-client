import { Button, CircularProgress } from "@mui/material";
import AdminTable from "./AdminTable";
import EditCatModal from "./EditCatModal";
import { useState } from "react";
import SearchBox from "./SearchBox";
import {
  useGetCategoryOffersQuery,
  useToggleCategoryOfferStatusMutation,
} from "../../Store/Api/admin/offer";
import BlockConfirmModal from "./BlockConfirmModel";
import EditCategoryOfferModal from "./EditCategoryOfferModal";
const CategoryColumns = [
  { id: "category", label: "Category", minWidth: 100 },
  { id: "offer", label: "Offer", minWidth: 100, align: "center" },
  { id: "action", label: "Action", minWidth: 100, align: "center" },
];

function CategoryCreateData(category, offer, action) {
  return { category, offer, action };
}

const CategoryOfferTable = ({ params, setParams }) => {
  const { data, isLoading } = useGetCategoryOffersQuery(params);
  const [block, { isLoading: isBlockLoading }] =
    useToggleCategoryOfferStatusMutation();
  const [open, setOpen] = useState(false);
  const [confOpen, setConfOpen] = useState(false);
  const [isBlocked, setIsBlocked] = useState();
  const [category, setCategory] = useState();
  const handleClose = () => {
    setOpen(false);
  };
  const handleEdit = (offer) => {
    setCategory(offer);
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
  const CategoryRows = data.offers.map((offer) =>
    CategoryCreateData(
      offer.category.name,
      <span>{offer.discountValue}%</span>,
      <div className="flex gap-2 !text-[18px] justify-center items-center ">
        {!offer.isActive ? (
          <Button
            onClick={() => toggleBlock(offer._id, !offer.isActive)}
            className="!bg-green-500 !text-white !capitalize !text-[12px]"
          >
            list
          </Button>
        ) : (
          <Button
            onClick={() => toggleBlock(offer._id, !offer.isActive)}
            className="!bg-red-500 !text-white !capitalize !text-[12px]"
          >
            Unlist
          </Button>
        )}
        <Button
          onClick={() => handleEdit(offer)}
          className="!bg-blue-500 !text-white !capitalize !text-[12px]"
        >
          Edit
        </Button>
      </div>
    )
  );

  return (
    <>
      <div className="relative w-full  overflow-x-scroll shadow-md sm:rounded-lg">
        <AdminTable
          columns={CategoryColumns}
          rows={CategoryRows}
          setParams={setParams}
          totalPosts={data.totalPosts}
          page={data.page}
        />
      </div>

      {open && (
        <EditCategoryOfferModal
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

export default CategoryOfferTable;
