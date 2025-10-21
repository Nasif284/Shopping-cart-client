import { Button, CircularProgress } from "@mui/material";
import AdminTable from "./AdminTable";
import EditCatModal from "./EditCatModal";
import { useState } from "react";
import SearchBox from "./SearchBox";
import {
  useGetGlobalOffersQuery,
  useToggleGlobalOfferStatusMutation,
} from "../../Store/Api/admin/offer";
import BlockConfirmModal from "./BlockConfirmModel";
import EditCategoryOfferModal from "./EditCategoryOfferModal";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import AddGlobalOfferModal from "./AddGlobalOfferModal";
import EditGlobalOfferModal from "./EditGlobalOfferModal";
const CategoryColumns = [
  { id: "title", label: "Title", minWidth: 100 },
  { id: "offer", label: "Offer", minWidth: 100, align: "center" },
  { id: "action", label: "Action", minWidth: 100, align: "center" },
];

function CategoryCreateData(title, offer, action) {
  return { title, offer, action };
}

const GlobalOfferTable = ({ params, setParams }) => {
  const { data, isLoading } = useGetGlobalOffersQuery(params);
  const [block, { isLoading: isBlockLoading }] =
    useToggleGlobalOfferStatusMutation();
  const [open, setOpen] = useState(false);
  const [confOpen, setConfOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [isBlocked, setIsBlocked] = useState();
  const [offer, setOffer] = useState();
  const handleClose = () => {
    setOpen(false);
  };
  const handleEdit = (offer) => {
    setOffer(offer);
    setOpen(true);
  };
  const handleAddOffer = () => {
    setAddOpen(true)
  };
  if (isLoading) {
    return (
      <div className="w-full h-[100vh] flex items-center justify-center">
        <CircularProgress color="inherit" />
      </div>
    );
  }
  const toggleBlock = (id, isBlocked) => {
    setOffer(id);
    setConfOpen(true);
    setIsBlocked(isBlocked);
    };
    console.log(data.offers);
  const CategoryRows = data.offers.map((offer) =>
    CategoryCreateData(
      offer.title,
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
          <div className="  flex justify-between my-4 ">
           <h2 className="text-[18px] font-[600]">Offers</h2>
        <Button
          onClick={handleAddOffer}
          className="!flex !bg-blue-500 !text-white !font-[600] !h-[40px] !capitalize !px-5 !gap-3"
        >
          <FaPlus />
          Add New Offer
        </Button>
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
        <EditGlobalOfferModal
          open={open}
          offer={offer}
          handleClose={handleClose}
        />
      )}
      {confOpen && (
        <BlockConfirmModal
          open={confOpen}
          id={offer}
          unlist={true}
          block={block}
          isBlocked={isBlocked}
          isLoading={isBlockLoading}
          handleClose={() => setConfOpen(false)}
        />
          )}
          {addOpen && <AddGlobalOfferModal open={addOpen} handleClose={()=> setAddOpen(false)}/>}
    </>
  );
};

export default GlobalOfferTable;
