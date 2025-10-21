import Button from "@mui/material/Button";
import { FaAngleUp, FaAngleDown } from "react-icons/fa6";
import toast from "react-hot-toast";

const QtyBox = ({ product, setQty, qty }) => {
  const handleIncrease = () => {
    if (qty >= product.stock) {
      return toast.error(`Adding more than ${product?.stock} products is not allowed for this Product `);
    } else if (qty >= 5) {
      return toast.error(
        `Adding more than 5 products is not allowed for per product `
      );
    } else {
      setQty((prev) => prev + 1)
    }
 }
  return (
    <div
      className={`qtyBox w-full h-full flex items-center relative`}
    >
      <input
        type="number"
        defaultValue={1}
        value={qty}
        className={`w-full h-full p-2 pl-4 text-[15px] focus:outline-none border-1 border-[rgba(0,0,0,0.2)] rounded-md`}
      />
      <div className="flex flex-col items-center h-full justify-between border-l-1 border-[rgba(0,0,0,0.2)] absolute top-0 right-0">
        <Button
          className={`!min-w-[30px] !h-[20px] !text-[12px] !text-black !rounded-none`}
          onClick={handleIncrease}
        >
          <FaAngleUp />
        </Button>
        <Button
          className={` !min-w-[30px] !h-[20px] !text-[12px] !text-black !rounded-none`}
          onClick={() => setQty((prev) => (prev > 1 ? prev - 1 : 1))}
        >
          <FaAngleDown />
        </Button>
      </div>
    </div>
  );
};

export default QtyBox;
