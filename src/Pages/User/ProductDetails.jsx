import React, { useEffect, useState } from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { Link, useParams } from "react-router-dom";
import Typography from "@mui/material/Typography";
import {
  ProductDetailsComponent,
  ProductSlider,
  ProductZoom,
  QtyBox,
  Review,
} from "../../Components/User";
import {
  useGetProductByIdQuery,
  useGetProductsQuery,
} from "../../Store/Api/admin/product";
import NotFound from "./NotFound";
import { useGetReviewsQuery } from "../../Store/Api/user/order";
const ProductDetails = () => {
  const { id } = useParams();
  const { data, isLoading } = useGetProductByIdQuery(id, { refetchOnMountOrArgChange: true });
  const { data: reviews, isLoading: reviewsLoading } =useGetReviewsQuery(id)
  console.log(reviews)
  const [selectedSize, setSelectedSize] = useState();
  const [selectedColor, setSelectedColor] = useState();
  const [activeVariant, setActiveVariant] = useState();
  const [activeTab, setActiveTab] = useState(0);  
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
 
  const { data: related, isLoading: relatedLoading } = useGetProductsQuery({
    category: data?.product.category.name,
    subCategory: data?.product.subCategory.name,
    thirdCategory: data?.product.thirdCategory.name,
    related: data?.product._id,
  });
  if (isLoading || relatedLoading || reviewsLoading) {
    return <h1>Loading...</h1>;
  }
     if (!data?.product) {
      return <NotFound/>
     }
  return (
    <>
      <div className="py-5">
        <div className="breadCrumbs container">
          <Breadcrumbs aria-label="breadcrumb">
            <Link
              underline="hover"
              color="inherit"
              to={"/"}
              className="link transition !text-[14px]"
            >
              Home
            </Link>
            <Link
              underline="hover"
              color="inherit"
              to={`/${data.product?.category.name.toLowerCase()}/`}
              className="link transition !text-[14px]"
            >
              {data.product?.category.name}
            </Link>
            <Link
              underline="hover"
              color="inherit"
              to={`/${data.product?.category.name.toLowerCase()}/${data.product?.subCategory.name.toLowerCase()}/`}
              className="link transition !text-[14px]"
            >
              {data.product?.subCategory.name}
            </Link>
            <Link
              underline="hover"
              color="inherit"
              to={`/${data.product?.category.name.toLowerCase()}/${data.product?.subCategory.name.toLowerCase()}/${data.product?.thirdCategory.name.toLowerCase()}/`}
              className="link transition !text-[14px]"
            >
              {data.product?.thirdCategory.name}
            </Link>
            <Typography className="!text-[14px]" sx={{ color: "text.primary" }}>
              {data.product?.name}
            </Typography>
          </Breadcrumbs>
        </div>
      </div>
      <section className="bg-white py-5">
        <div className="container items-center flex gap-8 ">
          <div className="productZoomContainer w-[40%]">
            <ProductZoom variant={activeVariant} />
          </div>
          <div className="productContent pr-10 w-[60%]">
            <ProductDetailsComponent
              product={data.product}
              activeVariant={activeVariant}
              setActiveVariant={setActiveVariant}
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}
              selectedSize={selectedSize}
              setSelectedSize={setSelectedSize}
            />
          </div>
        </div>
        <div className="container pt-10 ">
          <div className="flex items-center gap-8 mb-5">
            <span
              className={`${activeTab === 0 && "text-primary "} text-[17px] font-[600] cursor-pointer link`}
              onClick={() => setActiveTab(0)}
            >
              Description
            </span>
            <span
              className={`${activeTab === 1 && "text-primary "} text-[17px] font-[600] cursor-pointer link`}
              onClick={() => setActiveTab(1)}
            >
              Product Details
            </span>
            <span
              className={`${activeTab === 2 && "text-primary "} text-[17px] font-[600] cursor-pointer link`}
              onClick={() => setActiveTab(2)}
            >
              Reviews ({data.product.reviewCount})
            </span>
          </div>
          <div className="shadow-md py-5 px-8 w-full rounded-md">
            {activeTab === 0 && (
              <>
                <p className="text-[14px] mb-[10px]">
                  {data.product.description}
                </p>
              </>
            )}
            {activeTab === 1 && (
              <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <tbody>
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        Stock
                      </th>
                      <td className="px-6 py-4">{activeVariant?.stock}</td>
                    </tr>
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        Discount
                      </th>
                      <td className="px-6 py-4">{activeVariant?.discount}%</td>
                    </tr>
                    <tr className="bg-white dark:bg-gray-800">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        Price
                      </th>
                      <td className="px-6 py-4">₹{activeVariant?.price}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
            {activeTab === 2 && (
              <div className="reviewsWrapper max-h-[500px] overflow-x-hidden overflow-y-scroll w-full">
                {reviews.reviews.map((review) => (
                  <Review review={review} />
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="container !mt-10">
          <h2 className="text-[22px] mb-3 font-[600]">Related Products</h2>
          <ProductSlider items={6} products={related.products} />
        </div>
      </section>
    </>
  );
};

export default ProductDetails;
