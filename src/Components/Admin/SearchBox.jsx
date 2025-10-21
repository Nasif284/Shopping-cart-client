import React, { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { MdClose } from "react-icons/md";
const SearchBox = ({ onSearch }) => {
  const [search, setSearch] = useState("");
  const handleChange = (e) => {
    if (!e.target.value) {
            setSearch("");
            onSearch("");
      } setSearch(e.target.value);
    };
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search.trim().length > 0) {
        onSearch(search)
      }
    }, 300)
    return ()=>  clearTimeout(timer)
  },[search,onSearch])

  const handleClear = () => {
    setSearch("");
    onSearch("");
  };
  return (
    <div className="w-full h-[40px] items-center bg-[#f1f1f1] border-1 border-[rgba(0,0,0,0.1)] mb-5 mr-5 rounded-sm relative">
      <IoSearch className="absolute top-[8px] left-[5px] text-[20px] pointer-events-none text-[rgba(0,0,0,0.5)]" />
      <input
        value={search}
        onChange={handleChange}
        type="text"
        placeholder="Search Here..."
        className="w-full h-full pl-8 bg-transparent p-2 focus:outline-none"
      />
      {search && (
        <button
          onClick={handleClear}
          className="absolute top-[10px] right-[5px] text-[18px] text-gray-500 hover:text-black"
        >
          <MdClose />
        </button>
      )}
    </div>
  );
};

export default SearchBox;
