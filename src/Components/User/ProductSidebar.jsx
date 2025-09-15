import React, { useState } from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { Collapse } from "react-collapse";
import Rating from "@mui/material/Rating";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";
import { useGetCategoriesByLevelQuery } from "../../Store/Api/admin/category";
import { useGetSizesQuery } from "../../Store/Api/admin/size";
import { useDispatch, useSelector } from "react-redux";
import { setParams } from "../../Store/StoreSlices/uiSlice";
const ProductSidebar = ({ catParams }) => {
  const { params } = useSelector((state) => state.ui);
  const dispatch = useDispatch();
  const [isOpenCat, setIsOpenCat] = useState(true);
  const [isOpenAvai, setIsOpenAvai] = useState(true);
  const [isOpenSize, setIsOpenSize] = useState(true);

  let { data: subCats, isLoading: isSubCatLoading } =
    useGetCategoriesByLevelQuery({ level: "second" });
  let { data: rootCats, isLoading: isRootCatLoading } =
    useGetCategoriesByLevelQuery({ level: "first" });
  let { data: thirdCats, isLoading: isThirdCatLoading } =
    useGetCategoriesByLevelQuery({ level: "third" });
  const { data: sizes, isLoading: sizeLoading } = useGetSizesQuery();
  if (isSubCatLoading || isRootCatLoading || isThirdCatLoading || sizeLoading) {
    return <h1>Loading</h1>;
  }
  subCats = subCats.categories.filter((cat) => !cat.isBlocked);
  rootCats = rootCats.categories.filter((cat) => !cat.isBlocked);
  thirdCats = thirdCats.categories.filter((cat) => !cat.isBlocked);
  console.log(catParams.subCategory);
  return (
    <aside className="sidebar py-5 flex flex-col gap-5">
      {!catParams.thirdCategory && (
        <div className="box">
          <h1
            className="mb-3 text-[16px] font-[600] flex items-center justify-between cursor-pointer"
            onClick={() => setIsOpenCat(!isOpenCat)}
          >
            Shop By Categories{" "}
            {isOpenCat ? <IoIosArrowUp /> : <IoIosArrowDown />}
          </h1>
          <Collapse isOpened={isOpenCat}>
            <div className="scroll px-3 w-full relative -left-[10px]">
              {(() => {
                let items = [];
                if (catParams?.subCategory) {
                  items = thirdCats
                    .filter((cat) => cat.parentCatName == catParams.subCategory)
                    .map((cat) => (
                      <FormControlLabel
                        onChange={(e) => {
                          let setThird = () => {
                            let updated = params.thirdCategory
                              ? [...params.thirdCategory]
                              : [];
                            if (e.target.checked) {
                              updated.push(cat.name);
                            } else {
                              updated = updated.filter((c) => c !== cat.name);
                            }
                            return { thirdCategory: updated };
                          };
                          dispatch(setParams(setThird()));
                        }}
                        key={cat._id}
                        control={<Checkbox size="small" />}
                        label={cat.name}
                        className="w-full"
                      />
                    ));
                } else if (catParams?.category) {
                  items = subCats
                    .filter((cat) => cat.parentCatName == catParams.category)
                    .map((cat) => (
                      <FormControlLabel
                        onChange={(e) => {
                          let setSec = () => {
                            let updated = params.subCategory
                              ? [...params.subCategory]
                              : [];
                            if (e.target.checked) {
                              updated.push(cat.name);
                            } else {
                              updated = updated.filter((c) => c !== cat.name);
                            }
                            return { subCategory: updated };
                          };
                          dispatch(setParams(setSec()));
                        }}
                        key={cat._id}
                        control={<Checkbox size="small" />}
                        label={cat.name}
                        className="w-full"
                      />
                    ));
                } else {
                  items = rootCats.map((cat) => (
                    <FormControlLabel
                      onChange={(e) => {
                        let set = () => {
                          let updated = params.category
                            ? [...params.category]
                            : [];
                          if (e.target.checked) {
                            updated.push(cat.name);
                          } else {
                            updated = updated.filter((c) => c !== cat.name);
                          }
                          return { category: updated };
                        };
                        dispatch(setParams(set()));
                      }}
                      key={cat._id}
                      control={<Checkbox size="small" />}
                      label={cat.name}
                      className="w-full"
                    />
                  ));
                }
                return items;
              })()}
            </div>
          </Collapse>
        </div>
      )}
      <div className="box">
        <h1
          className="mb-3 text-[16px] font-[600] flex items-center justify-between cursor-pointer"
          onClick={() => setIsOpenAvai(!isOpenAvai)}
        >
          Availability {isOpenAvai ? <IoIosArrowUp /> : <IoIosArrowDown />}
        </h1>
        <Collapse isOpened={isOpenAvai}>
          <div className="scroll px-3 w-full relative -left-[10px]">
            <FormControlLabel
              control={<Checkbox size="small" />}
              onChange={(e) => {
                dispatch(
                  setParams({
                    availability: e.target.checked ? true : undefined,
                  })
                );
              }}
              label="Available (17)"
              className="w-full"
            />
          </div>
        </Collapse>
      </div>
      {catParams.category == "fashion" && (
        <div className="box">
          <h1
            className="mb-3 text-[16px] font-[600] flex items-center justify-between gap-10 cursor-pointer"
            onClick={() => setIsOpenSize(!isOpenSize)}
          >
            Size {isOpenSize ? <IoIosArrowUp /> : <IoIosArrowDown />}
          </h1>
          <Collapse isOpened={isOpenSize}>
            <div className="scroll px-3 w-full relative -left-[10px]">
              {sizes?.sizes.map((size) => (
                <FormControlLabel
                  key={size}
                  onChange={(e) => {
                    let setSizes = () => {
                      let updated = params.sizes ? [...params.sizes] : [];
                      if (e.target.checked) {
                        updated.push(size.label);
                      } else {
                        updated = updated.filter((c) => c != size.label);
                      }
                      return { sizes: updated };
                    };
                    dispatch(setParams(setSizes()));
                  }}
                  control={<Checkbox size="small" />}
                  label={size.label}
                  className="w-full"
                />
              ))}
            </div>
          </Collapse>
        </div>
      )}

      <div className="box">
        <h1
          className="mb-3 text-[16px] font-[600] flex items-center justify-between gap-10 cursor-pointer"
          onClick={() => setIsOpenSize(!isOpenSize)}
        >
          Filter By Price
        </h1>
        <RangeSlider
          min={100}
          max={1500}
          step={50}
          value={[params.minPrice || 100, params.maxPrice || 750]}
          onInput={(values) =>
            dispatch(setParams({ minPrice: values[0], maxPrice: values[1] }))
          }
        />
        <div className="flex justify-between pb-2 pt-4">
          <p className="text-[14px]">
            From <span className="font-[700]">Rs: 100</span>
          </p>
          <p className="text-[14px]">
            To <span className="font-[700]">Rs: 1500</span>
          </p>
        </div>
      </div>
      <div className="box">
        <h1 className="mb-3 text-[16px] font-[600] flex items-center justify-between gap-10 cursor-pointer">
          Filter By Discount
        </h1>
        <div className="flex flex-col gap-1 px-3">
          {[10, 20, 30, 40, 50].map((discount) => (
            <FormControlLabel
              key={discount}
              control={
                <Checkbox
                  size="small"
                  checked={params.discount === discount}
                  onChange={(e) => {
                    dispatch(
                      setParams({
                        discount: e.target.checked ? discount : undefined,
                      })
                    );
                  }}
                />
              }
              label={`Above ${discount}% Off`}
              className="w-full"
            />
          ))}
        </div>
      </div>

      <div className="box">
        <h1
          className="mb-3 text-[16px] font-[600] flex items-center justify-between gap-10 cursor-pointer"
          onClick={() => setIsOpenSize(!isOpenSize)}
        >
          Filter By Rating
        </h1>
        <div className="flex flex-col gap-1 px-3">
          {[1, 2, 3, 4, 5].map((rating) => (
            <FormControlLabel
              key={rating}
              control={<Checkbox size="small" />}
              onChange={(e) => {
                let setRating = () => {
                  let updated = params.rating ? [...params.rating] : [];
                  if (e.target.checked) {
                    updated.push(rating);
                  } else {
                    updated = updated.filter((c) => c != rating);
                  }
                  return { rating: updated };
                };
                dispatch(setParams(setRating()));
              }}
              label={
                <Rating
                  name="size-small"
                  defaultValue={rating}
                  size="small"
                  readOnly
                />
              }
              className="w-full"
            />
          ))}
        </div>
      </div>
    </aside>
  );
};

export default ProductSidebar;
