import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import ProductZoom from "./ProductZoom";
import ProductDetailsComponent from "./ProductDetailsComponent";
import Button from "@mui/material/Button";
import { IoMdClose } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { setModalOpen } from "../../Store/StoreSlices/uiSlice";
import { useEffect, useState } from "react";
import { useGetProductByIdQuery } from "../../Store/Api/admin/product";

const ProductDialogBox = () => {
  const dispatch = useDispatch();
  const { modalOpen: open, id } = useSelector((state) => state.ui);
  const handleClose = () => {
    dispatch(setModalOpen(false));
  };
  const { data, isLoading } = useGetProductByIdQuery(id);
  const [selectedSize, setSelectedSize] = useState();
  const [selectedColor, setSelectedColor] = useState();
  const [activeVariant, setActiveVariant] = useState();
  useEffect(() => {
    if (data?.product) {
      const colors = Object.keys(data.product.groupedVariants);
      const defaultColor = colors[0];
      const defaultSize =
        data.product.groupedVariants[defaultColor].variants[0].size;
      setSelectedColor(defaultColor);
      setSelectedSize(defaultSize);
      setActiveVariant(
        data.product.groupedVariants[defaultColor].variants.find(
          (v) => v.size == defaultSize
        )
      );
    }
  }, [data]);
  if (isLoading) {
    return <h1>Loading...</h1>;
  }
  return (
    <Dialog
      fullWidth={true}
      maxWidth={"lg"}
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent>
        <div className="flex items-center w-full relative">
          <div className="col1 w-[40%]">
            <ProductZoom variant={activeVariant} />
          </div>
          <div className="col2 w-[60%] pl-10 pr-7">
            <ProductDetailsComponent
              product={data?.product}
              activeVariant={activeVariant}
              setActiveVariant={setActiveVariant}
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}
              selectedSize={selectedSize}
              setSelectedSize={setSelectedSize}
            />
          </div>
          <Button
            onClick={handleClose}
            className="!absolute !top-0 !right-0 !rounded-full w-[40px] h-[40px] !min-w-[40px] !text-[rgba(0,0,0,0.7)]"
          >
            <IoMdClose className="text-[25px]" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDialogBox;
