import { Button, CircularProgress } from "@mui/material";
import React, { useState } from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import {
  useBlockCategoryMutation,
  useGetAllCategoriesQuery,
} from "../../Store/Api/admin/category";
import { EditSubCatModal, SearchBox } from "../../Components/Admin";
import BlockConfirmModal from "../../Components/Admin/BlockConfirmModel";
import toast from "react-hot-toast";
import AddCategoryOfferModal from "../../Components/Admin/AddCategoryOfferModal";
const SubCategoryList = () => {
  const [params, setParams] = useState();
  const [dropdown, setDropdown] = useState(null);
  const [thirdDropdown, setThirdDropdown] = useState(null);
  const { data, isLoading } = useGetAllCategoriesQuery({ search: params });
  const [open, setOpen] = useState(false);
  const [selectedCat, setSelectedCat] = useState();
  const [confOpen, setConfOpen] = useState(false);
  const [offerOpen, setOfferOpen] = useState(false);
  const [isUnlisted, setIsUnlisted] = useState();
  const [level, setLevel] = useState();
  const handleEdit = (cat, level) => {
    setOpen(true);
    setSelectedCat(cat);
    setLevel(level);
  };
  const [block, { isLoading: blockLoading }] = useBlockCategoryMutation();
  if (isLoading) {
    return (
      <div className="w-full h-[100vh] flex items-center justify-center">
        <CircularProgress color="inherit" />
      </div>
    );
  }
  const toggleBlock = (id, isUnlisted) => {
    setConfOpen(true);
    setIsUnlisted(isUnlisted);
    setSelectedCat(id);
  };
  const toggle = (index) => {
    if (dropdown == index) {
      setDropdown(null);
    } else {
      setDropdown(index);
    }
  };
  const toggleSec = (index) => {
    if (thirdDropdown == index) {
      setThirdDropdown(null);
    } else {
      setThirdDropdown(index);
    }
  };
  const handleAddOffer = (id) => {
    setOfferOpen(true);
    setSelectedCat(id);
  };
  return (
    <div className=" my-4 w-full shadow-md sm:rounded-lg bg-white">
      <div className="flex w-full items-center justify-between p-5">
        <h2 className="text-[18px]  font-[600]">Sub Category List</h2>
        <div className="w-[30%]">
          <SearchBox
            onSearch={(search) => {
              setParams(search);
            }}
          />
        </div>
      </div>
      {data.rootCategories.map((cat, i) => (
        <div key={cat._id} className="list w-full px-5 pb-5">
          <div className="mainCat w-full text-[18px] font-[500] bg-[#f1f1f1] px-4 py-3 flex items-center justify-between rounded-md">
            {cat.name}
            <Button
              className="!w-[40px] !h-[40px] !min-w-[40px] !text-black !rounded-full !text-[22px]"
              onClick={() => toggle(i)}
            >
              {dropdown == i ? <FaAngleUp /> : <FaAngleDown />}
            </Button>
          </div>
          <div>
            {dropdown == i &&
              cat.children.map((cat, i) => (
                <>
                  <ul key={cat._id}>
                    <li className="w-full flex items-center justify-between px-4 py-3 font-[500] ">
                      {cat.name}
                      <div className="flex gap-2 !text-[18px] justify-center items-center ">
                        <Button
                          onClick={() => handleAddOffer(cat._id)}
                          className="!bg-blue-400 !text-white !capitalize !text-[12px]"
                        >
                          Add Offer
                        </Button>
                        <Button
                          onClick={() => handleEdit(cat, "second")}
                          className="!bg-green-500 !text-white !capitalize !text-[12px]"
                        >
                          Edit
                        </Button>
                        {cat.isBlocked ? (
                          <Button
                            onClick={() => toggleBlock(cat._id, cat.isBlocked)}
                            className="!bg-green-500 !text-white !capitalize !text-[12px]"
                          >
                            List
                          </Button>
                        ) : (
                          <Button
                            onClick={() => {
                              toggleBlock(cat._id, cat.isBlocked);
                              setThirdDropdown(null);
                            }}
                            className="!bg-red-500 !text-white !capitalize !text-[12px]"
                          >
                            Unlist
                          </Button>
                        )}

                        <Button
                          disabled={!cat.children.length > 0}
                          className={`!w-[40px] !h-[40px] !min-w-[40px] ${cat.isBlocked || !cat.children.length > 0 ? "!text-gray-300" : "!text-black"} !rounded-full !text-[22px]`}
                          onClick={() => {
                            cat.isBlocked
                              ? toast.error(
                                  "list the parent category to see sub categories"
                                )
                              : toggleSec(i);
                          }}
                        >
                          {thirdDropdown == i ? <FaAngleUp /> : <FaAngleDown />}
                        </Button>
                      </div>
                    </li>
                  </ul>
                  {thirdDropdown == i &&
                    cat.children.map((cat) => (
                      <ul key={cat._id}>
                        <li className="w-full flex items-center justify-between pl-10 pr-4 py-1 font-[500]">
                          {cat.name}
                          <div className="flex gap-2 !text-[18px] justify-center items-center ">
                            <Button
                              onClick={() => handleAddOffer(cat._id)}
                              className="!bg-blue-400 !text-white !capitalize !text-[12px]"
                            >
                              Add Offer
                            </Button>
                            <Button
                              onClick={() => handleEdit(cat, "third")}
                              className="!bg-green-500 !text-white !capitalize !text-[12px]"
                            >
                              Edit
                            </Button>
                            {cat.isBlocked ? (
                              <Button
                                onClick={() =>
                                  toggleBlock(cat._id, cat.isBlocked)
                                }
                                className="!bg-green-500 !text-white !capitalize !text-[12px]"
                              >
                                List
                              </Button>
                            ) : (
                              <Button
                                onClick={() =>
                                  toggleBlock(cat._id, cat.isBlocked)
                                }
                                className="!bg-red-500 !text-white !capitalize !text-[12px]"
                              >
                                Unlist
                              </Button>
                            )}
                          </div>
                        </li>
                      </ul>
                    ))}
                </>
              ))}
          </div>
        </div>
      ))}
      {open && (
        <EditSubCatModal
          handleClose={() => setOpen(false)}
          level={level}
          category={selectedCat}
          open={open}
        />
      )}
      {confOpen && (
        <BlockConfirmModal
          unlist={true}
          isBlocked={isUnlisted}
          block={block}
          isLoading={blockLoading}
          id={selectedCat}
          open={confOpen}
          handleClose={() => setConfOpen(false)}
        />
      )}
      {offerOpen && (
        <AddCategoryOfferModal
          open={offerOpen}
          handleClose={() => setOfferOpen(false)}
          categoryId={selectedCat}
        />
      )}
    </div>
  );
};

export default SubCategoryList;
