import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import Rating from "@mui/material/Rating";
import { MdOutlineZoomOutMap } from "react-icons/md";
import { FaRegHeart } from "react-icons/fa";
import { IoGitCompareOutline, IoCartOutline } from "react-icons/io5";
import Tooltip from "@mui/material/Tooltip";
import { useDispatch } from "react-redux";
import { setModalOpen, setProductId } from "../../Store/StoreSlices/uiSlice";

const ProductListView = ({ product }) => {
  const dispatch = useDispatch();
  return (
    <div className="productCard rounded-md border bg-white border-[#d8d8d8] overflow-hidden shadow-md flex items-center">
      <div className="imgWrapper w-[25%] h-[280px] group overflow-hidden rounded-md ml-1 relative transition-all">
        <Link>
          <div className="image w-full h-full overflow-hidden ">
            <img
              src={product?.defaultVariant?.images[0]}
              alt=""
              className="w-full h-full object-cover object-top"
            />
            <img
              src={product?.defaultVariant?.images[1]}
              alt=""
              className="w-full h-full object-top object-cover absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-all duration-300"
            />
          </div>
        </Link>
        <span className="discount flex items-center absolute top-[10px] left-[10px] bg-primary text-white z-50 rounded-lg p-1 text-[10px] font-[500]">
          {product.defaultVariant.discount}%
        </span>
        <div className="actions duration-300 transition-all absolute group-hover:top-[10px] right-[15px] top-[-200px] flex-col flex z-50 items-center gap-2">
          <Tooltip title={"zoom"} placement="left">
            <Button
              onClick={() => {
                dispatch(setModalOpen(true));
                dispatch(setProductId(product._id));
              }}
              className="!w-[35px] !text-[18px]  !h-[35px] !min-w-[35px] !bg-white !rounded-full hover:!bg-primary !text-black hover:!text-white transition-all"
            >
              <MdOutlineZoomOutMap />
            </Button>
          </Tooltip>
          <Tooltip title={"Add to Wish list"} placement="left">
            <Button className="!w-[35px] !text-[18px] !h-[35px] !min-w-[35px] !bg-white !rounded-full hover:!bg-primary !text-black hover:!text-white transition-all">
              <FaRegHeart />
            </Button>
          </Tooltip>
        </div>
      </div>

      <div className="product-info px-8 w-[75%] py-5">
        <h6 className="text-[15px]">
          <Link className="link transition-all">kasee</Link>
        </h6>
        <h3 className="text-[18px] leading-[18px]  mt-3 font-[500] mb-3">
          <Link to={`/product/${product._id}`} className="link transition-all">
            {product.name}
          </Link>
        </h3>
        <p className="text-[14px] mb-3">{product.description}</p>
        <Rating name="size-small" defaultValue={2} size="small" readOnly />
        <div className="price-box flex items-center gap-4">
          <span className="line-through text-gray-500 font-[500] text-[15px]">
            ${product.defaultVariant.oldPrice}
          </span>
          <span className="text-primary font-[600] text-[15px] ">
            ${product.defaultVariant.price}
          </span>
        </div>

        <Button className="!bg-primary !text-white !text-[13px] !px-3 !py-2 flex gap-2 !mt-3 hover:!bg-[rgba(0,0,0,0.8)] !font-[500]">
          <IoCartOutline className="!text-[19px]" />
          Add To Cart
        </Button>
      </div>
    </div>
  );
};

export default ProductListView;
