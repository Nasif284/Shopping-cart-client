import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import { IoMdClose } from "react-icons/io";
import Button from "@mui/material/Button";
import { FiPlusSquare } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useState } from "react";
import { FiMinusSquare } from "react-icons/fi";
import { useGetAllCategoriesQuery } from "../../Store/Api/admin/category";
const CategoryPanel = ({ toggleFunc }) => {
  const [submenuIndex, setSubmenuIndex] = useState(null);
  const { data, isLoading } = useGetAllCategoriesQuery({ user: true });
  const [secIndex, setSecIndex] = useState(null);
  function toggle(index) {
    if (index === submenuIndex) {
      setSubmenuIndex(null);
    } else {
      setSubmenuIndex(index);
    }
  }
  function toggleSec(index) {
    if (index === secIndex) {
      setSecIndex(null);
    } else {
      setSecIndex(index);
    }
  }

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" className="catPanel">
      <div className="p-3 flex items-center justify-between text-[16px] font-[500]">
        <h1>Shop by categories</h1>
        <IoMdClose onClick={() => toggleFunc(false)} className="text-[22px]" />
      </div>
      <Divider />
      <div className="scroll">
        <ul className="w-full relative first-level">
          {data.rootCategories.map((cat, i) => (
            <li key={cat._id} className="flex items-center pr-5 flex-col">
              <div className="flex items-center w-full">
                <Link to={`/${cat.name.toLowerCase()}`} className="w-full">
                  <Button className="w-full !justify-start !px-3 !text-black ">
                    {cat.name}
                  </Button>
                </Link>
                {submenuIndex === i ? (
                  <FiMinusSquare
                    className="cursor-pointer"
                    onClick={() => toggle(i)}
                  />
                ) : (
                  <FiPlusSquare
                    className="cursor-pointer"
                    onClick={() => toggle(i)}
                  />
                )}
              </div>
              {submenuIndex === i && (
                <ul className="sec-level w-full pl-4">
                  {cat?.children.map((subCat) => (
                    <li key={subCat._id} className="flex items-center flex-col">
                      <div className="flex items-center w-full ">
                        <Link
                          to={`/${cat.name.toLowerCase()}/${subCat.name.toLowerCase()}`}
                          className="w-full"
                        >
                          <Button className="w-full !justify-start !px-3 !text-black ">
                            {subCat.name}
                          </Button>
                        </Link>
                        {secIndex === i ? (
                          <FiMinusSquare
                            className="cursor-pointer"
                            onClick={() => toggleSec(i)}
                          />
                        ) : (
                          <FiPlusSquare
                            className="cursor-pointer"
                            onClick={() => toggleSec(i)}
                          />
                        )}
                      </div>
                      {secIndex === i &&
                        subCat.children.map((thirdCat) => (
                          <ul
                            key={thirdCat._id}
                            className="third-level w-full pl-4"
                          >
                            <li className="pl-5">
                              <Link
                                to={`/${cat.name.toLowerCase()}/${subCat.name.toLowerCase()}/${thirdCat.name.toLowerCase()}`}
                                className="w-full !text-[14px] font-[500] !justify-start !px-3 flex link mb-2 "
                              >
                                {thirdCat.name}
                              </Link>
                            </li>
                          </ul>
                        ))}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </Box>
  );
  if (isLoading) {
    return <h1>Loading</h1>;
  }
  return (
    <div>
      <Drawer open={open} onClose={() => toggleFunc(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
};

export default CategoryPanel;
