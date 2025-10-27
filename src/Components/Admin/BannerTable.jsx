import AdminTable from "./AdminTable";
import { Button, Tooltip } from "@mui/material";
import {
  useGetHomeSlidesQuery,
  useHomeSlidesToggleBlockMutation,
} from "../../Store/Api/admin/homeSlides";
import { useState } from "react";
import EditHomeSlidesModal from "./EditHomeSlideModal";
import BlockConfirmModal from "./BlockConfirmModel";
const ProductsColumns = [
  { id: "image", label: "Image", minWidth: 170 },
  { id: "description", label: "Description", minWidth: 170 },
  { id: "action", label: "Action", minWidth: 100, align: "center" },
];

function productsCreateData(image, description, action) {
  return { image, description, action };
}

const BannerTable = () => {
  const [params, setParams] = useState({ page: 1, perPage: 10 });
  const [slide, setSlide] = useState();
  const { data } = useGetHomeSlidesQuery(params);
  const [black, { isLoading }] = useHomeSlidesToggleBlockMutation(slide);
  const [editOpen, setEditOpen] = useState(false);
  const [confOpen, setConfOpen] = useState(false);
  const handleEdit = (slide) => {
    setSlide(slide);
    setEditOpen(true);
  };
  const toggleBlock = (slide) => {
    setConfOpen(true);
    setSlide({
      id: slide._id,
      isBlocked: slide.isUnlisted,
    });
  };
  const ProductsRows = data?.homeSlides.map((slide) =>
    productsCreateData(
      <div className="w-[300px] rounded-md overflow-hidden">
        <img src={slide.banner} alt="" className="w-full" />
      </div>,
      <span>{slide.description}</span>,
      <div className="flex gap-2 !text-[18px] justify-center items-center ">
        <Button
          onClick={() => handleEdit(slide)}
          className="!bg-green-500 !text-white !capitalize !text-[12px]"
        >
          Edit
        </Button>
        {slide.isUnlisted ? (
          <Button
            onClick={() => toggleBlock(slide, slide.isUnlisted)}
            className="!bg-green-500 !text-white !capitalize !text-[12px]"
          >
            list
          </Button>
        ) : (
          <Button
            onClick={() => toggleBlock(slide, slide.isUnlisted)}
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
        page={data?.page}
        totalPosts={data?.totalPosts}
        setParams={setParams}
        columns={ProductsColumns}
        rows={ProductsRows}
      />
      {editOpen && (
        <EditHomeSlidesModal
          open={editOpen}
          handleClose={() => setEditOpen(false)}
          slide={slide}
        />
      )}
      {confOpen && (
        <BlockConfirmModal
          open={confOpen}
          unlist={true}
          id={slide?.id}
          handleClose={() => setConfOpen(false)}
          block={black}
          isLoading={isLoading}
          isBlocked={slide?.isUnlisted}
        />
      )}
    </>
  );
};

export default BannerTable;
