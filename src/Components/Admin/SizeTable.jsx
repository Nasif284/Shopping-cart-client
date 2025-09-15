import AdminTable from "./AdminTable";
import {
  useBlockSizeMutation,
  useGetSizesQuery,
} from "../../Store/Api/admin/size";
import toast from "react-hot-toast";
import { Button } from "@mui/material";
import { useState } from "react";
import EditSizeModal from "./EditSizeModal";
const SizesColumns = [
  { id: "size", label: "Size", minWidth: 170 },
  { id: "action", label: "Action", minWidth: 100, align: "center" },
];

function SizesCreateData(size, action) {
  return { size, action };
}

const SizeTable = () => {
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState();
  const handleClose = () => {
    setOpen(false);
  };
  const { data, isLoading } = useGetSizesQuery();
  const [block] = useBlockSizeMutation();
  if (isLoading) {
    return <h1>Loading....</h1>;
  }
  const toggleBlock = async (id) => {
    try {
      const res = await block(id).unwrap();
      toast.success(res.message || "category updated Successfully");
    } catch (error) {
      toast.error(error.data || "category updating failed");
    }
  };
  const handleEdit = (size) => {
    console.log(size);
    setSize(size);
    setOpen(true);
  };
  const SizesRows = data.sizes.map((size) =>
    SizesCreateData(
      size.label,
      <div className="flex gap-2 !text-[18px] justify-center items-center ">
        <Button
          onClick={() => handleEdit(size)}
          className="!bg-green-500 !text-white !capitalize !text-[12px]"
        >
          Edit
        </Button>
        {size.isBlocked ? (
          <Button
            onClick={() => toggleBlock(size._id)}
            className="!bg-green-500 !text-white !capitalize !text-[12px]"
          >
            Unblock
          </Button>
        ) : (
          <Button
            onClick={() => toggleBlock(size._id)}
            className="!bg-red-500 !text-white !capitalize !text-[12px]"
          >
            Block
          </Button>
        )}
      </div>
    )
  );
  return (
    <>
      <AdminTable columns={SizesColumns} rows={SizesRows} />
      {open && (
        <EditSizeModal open={open} handleClose={handleClose} size={size} />
      )}
    </>
  );
};

export default SizeTable;
