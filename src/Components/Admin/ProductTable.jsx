import React, { useState } from "react";
import AdminTable from "./AdminTable";
import { Button, Tooltip } from "@mui/material";
import EditProductModal from "./EditProductModal";
import {
  useGetProductsQuery,
  useUnlistProductMutation,
} from "../../Store/Api/admin/product";
import BlockConfirmModal from "./BlockConfirmModel";
import { Link } from "react-router-dom";
const ProductsColumns = [
  { id: "productId", label: "Product Id", minWidth: 100 },
  { id: "productName", label: "Product Name", minWidth: 300 },
  { id: "brand", label: "Brand", minWidth: 100, align: "center" },
  {
    id: "category",
    label: "Category",
    minWidth: 100,
    align: "center",
  },
  {
    id: "sales",
    label: "Sales",
    minWidth: 100,
    align: "center",
  },
  {
    id: "stock",
    label: "Stock",
    minWidth: 100,
    align: "center",
  },
  {
    id: "offer",
    label: "Offer %",
    minWidth: 100,
    align: "center",
  },
  {
    id: "edit",
    label: "Edit",
    minWidth: 120,
    align: "center",
  },
  {
    id: "addOffer",
    label: "Add Offer",
    minWidth: 120,
    align: "center",
  },
  {
    id: "view",
    label: "View More",
    minWidth: 120,
    align: "center",
  },
  {
    id: "block",
    label: "Block",
    minWidth: 100,
    align: "center",
  },
];

function productsCreateData(
  productId,
  productName,
  brand,
  category,
  sales,
  stock,
  offer,
  edit,
  addOffer,
  view,
  block
) {
  return {
    productId,
    productName,
    brand,
    category,
    sales,
    stock,
    offer,
    edit,
    addOffer,
    view,
    block,
  };
}

const ProductTable = ({ params, setParams }) => {
  const [unlist, { isLoading: unlistLoading }] = useUnlistProductMutation();
  const [open, setOpen] = useState(false);
  const [confOpen, setConfOpen] = useState(false);
  const [isUnlisted, setIsUnlisted] = useState();
  const { data, isLoading } = useGetProductsQuery(params);
  const [product, setProduct] = useState(null);
  const handleEdit = (product) => {
    setProduct(product);
    setOpen(true);
  };
  const handleBlock = (id, isUnlisted) => {
    setProduct(id);
    setConfOpen(true);
    setIsUnlisted(isUnlisted);
  };
  if (isLoading) {
    return <h1>Loading...</h1>;
  }
  const ProductsRows = data.products.map((product) =>
    productsCreateData(
      product._id,
      <div className="flex items-center gap-3">
        <div className="imgWrapper w-[50px] h-[50px] flex-shrink-0 overflow-hidden cursor-pointer rounded">
          <img
            src={product.defaultVariant?.images[0]}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        <Tooltip title={product.name} placement="top">
          <div className="info max-w-[180px] truncate">{product.name}</div>
        </Tooltip>
      </div>,
      product.brand,
      product.category.name,
      "56",
      product.stock,
      product.discount + "%",
      <Button
        onClick={() => handleEdit(product)}
        className="!bg-blue-500 !text-white !capitalize !text-[12px]"
      >
        Edit
      </Button>,
      <Button className="!bg-blue-400 !text-white !capitalize !text-[12px]">
        Add Offer
      </Button>,
      <Link to={`/admin/products/${product._id}`}>
        <Button className="!bg-green-500 !text-white !capitalize !text-[12px]">
          View More
        </Button>
      </Link>,
      product.isUnlisted ? (
        <Button
          onClick={() => handleBlock(product._id, product.isUnlisted)}
          className="!bg-green-500 !text-white !capitalize !text-[12px]"
        >
          List
        </Button>
      ) : (
        <Button
          onClick={() => handleBlock(product._id, product.isUnlisted)}
          className="!bg-red-500 !text-white !capitalize !text-[12px]"
        >
          Unlist
        </Button>
      )
    )
  );

  return (
    <>
      {open && (
        <EditProductModal
          open={open}
          handleClose={() => setOpen(false)}
          product={product}
        />
      )}
      <AdminTable
        columns={ProductsColumns}
        rows={ProductsRows}
        page={data.page}
        setParams={setParams}
        totalPosts={data.totalPosts}
      />
      {confOpen && (
        <BlockConfirmModal
          isBlocked={isUnlisted}
          unlist={true}
          isLoading={unlistLoading}
          open={confOpen}
          block={unlist}
          handleClose={() => setConfOpen(false)}
          id={product}
        />
      )}
    </>
  );
};

export default ProductTable;
