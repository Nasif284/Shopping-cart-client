import React, { useState, useEffect, useRef } from "react";
import Button from "@mui/material/Button";
import { IoSearch } from "react-icons/io5";
import { MdClose } from "react-icons/md";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setParams } from "../../Store/StoreSlices/uiSlice";
import { useGetSearchSuggestionsQuery } from "../../Store/Api/admin/product";

const Search = () => {
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [clear, setClear] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [suggestionsShow, setSuggestionsShow] = useState(false);
  const [history, setHistory] = useState({ products: [], categories: [] });
  const navigate = useNavigate();
  const searchRef = useRef();
  const [suggestions, setSuggestions] = useState({});
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("searchHistory")) || [];
    setHistory(stored);
    const timer = setTimeout(() => {
      if (search.trim().length > 0) {
        setDebouncedSearch(search);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);
  const { data } = useGetSearchSuggestionsQuery(
    { q: debouncedSearch },
    {
      skip: !debouncedSearch.trim(),
    }
  );
  useEffect(() => {
    setSuggestions(data);
  }, [data]);
  const handleSearch = () => {
    navigate("/search");
    dispatch(setParams({ search }));
    setClear(true);
    setSuggestionsShow(false);
    setSuggestions({ products: [], categories: [] });

    let stored = JSON.parse(localStorage.getItem("searchHistory")) || [];
    stored = [search, ...stored.filter((e) => e !== search)];
    stored = stored.slice(0, 10);

    localStorage.setItem("searchHistory", JSON.stringify(stored));
    setHistory(stored);
  };

  const handleSuggestionSearch = (item) => {
    setSearch(item);
    dispatch(setParams({ search: item }));
    navigate("/search");
    setClear(true);
    setSuggestionsShow(false);
        setSuggestions({ products: [], categories: [] });

    let stored = JSON.parse(localStorage.getItem("searchHistory")) || [];
    stored = [item, ...stored.filter((e) => e !== item)];
    stored = stored.slice(0, 10);

    localStorage.setItem("searchHistory", JSON.stringify(stored));
    setHistory(stored);
  };
  const handleClearHistory = () => {
    localStorage.removeItem("searchHistory");
    setHistory([]);
  };

  const handleClear = () => {
    setClear(false);
    setSearch("");
    dispatch(setParams({ search: undefined }));
  };
  useEffect(() => {
    const handleClickOutside = () => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSuggestionsShow(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);
  return (
    <div
      ref={searchRef}
      className="searchBox relative w-full h-[50px] bg-[#e5e5e5] flex items-center rounded-[5px] p-2"
    >
      <input
        type="text"
        value={search}
        onChange={(e) => {
          if (e.target.value.length == 0) {
             handleClear()
          } else {
            setSearch(e.target.value);
            setSuggestionsShow(true);
           } 
        }}
        onClick={() => {
          setSuggestionsShow(true);
        }}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        placeholder="Search for products..."
        className="w-full h-[35px] focus:outline-none bg-inherit p-2 text-[15px]"
      />

      {clear  ? (
        <Button
          onClick={handleClear}
          className="!w-[37px] !min-w-[37px] !h-[37px] !rounded-full !text-black"
        >
          <MdClose className="text-black text-[22px]" />
        </Button>
      ) : (
        <Button
          onClick={handleSearch}
          className="!w-[37px] !min-w-[37px] !h-[37px] !rounded-full !text-black"
        >
          <IoSearch className="text-black text-[22px]" />
        </Button>
      )}

      {suggestionsShow &&
        (suggestions?.products.length > 0 ||
          suggestions?.categories.length > 0 ||
          history?.length > 0) && (
          <div className="absolute  top-[110%] left-0 w-full bg-white shadow-lg rounded-lg border max-h-[300px] overflow-y-auto z-[1000]">
            {history?.length > 0 && !search && (
              <div>
                <div className="flex justify-between items-center px-3 py-1">
                  <span className="text-gray-500 text-sm font-semibold">
                    Recent Searches
                  </span>
                  <button
                    onClick={handleClearHistory}
                    className="text-xs text-blue-500 hover:underline"
                  >
                    Clear All
                  </button>
                </div>

                {history.map((item, index) => (
                  <div
                    key={index}
                    className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSuggestionSearch(item)}
                  >
                    {item}
                  </div>
                ))}
              </div>
            )}

            {suggestions?.categories.length > 0 && (
              <div>
                <div className="px-3 py-1 text-gray-500 text-sm font-semibold">
                  Categories
                </div>
                {suggestions.categories.map((cat) => (
                  <div
                    key={cat._id}
                    className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSuggestionSearch(cat.name)}
                  >
                    {cat.ancestors.length > 0 && (
                      <span className="text-gray-500 text-sm">
                        {cat.ancestors
                          .map((a) => a.name)
                          .reverse()
                          .join(" > ")}{" "}
                        &gt;{" "}
                      </span>
                    )}
                    <span className="font-medium">{cat.name}</span>
                  </div>
                ))}
              </div>
            )}

            {suggestions?.products.length > 0 && (
              <div>
                <div className="px-3 py-1 text-gray-500 text-sm font-semibold">
                  Products
                </div>
                {suggestions.products.map((p) => (
                  <div
                    key={p._id}
                    className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => {
                      navigate(`/product/${p._id}`);
                    }}
                  >
                    <img
                      src={p.variants[0].images[0]}
                      alt={"error"}
                      className="w-8 h-8 object-cover rounded"
                    />
                    <span className="text-[13px]">{p.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
    </div>
  );
};

export default Search;
