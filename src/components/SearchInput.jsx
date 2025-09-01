import React, { useState, useEffect } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { useSearchParams } from "react-router-dom";

export default function SearchInput() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );

  // Only update searchParams if the searchTerm is changed
  useEffect(() => {
    if (searchTerm !== searchParams.get("search")) {
      const timer = setTimeout(() => {
        searchParams.set("page", 1); // Reset page to 1 whenever search term changes
        searchParams.set("search", searchTerm);
        setSearchParams(searchParams);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [searchTerm, searchParams, setSearchParams]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
    searchParams.delete("search");
    searchParams.set("page", 1);
    setSearchParams(searchParams);
  };

  return (
    <div className="flex items-center border rounded-md p-2 shadow-sm w-full max-w-md bg-white">
      <FiSearch className="text-gray-500 mr-2" size={20} />
      <input
        id="search"
        name="search"
        value={searchTerm}
        type="text"
        placeholder="Search..."
        className="w-full outline-none text-gray-700"
        onChange={handleSearch}
      />
      {searchTerm && (
        <FiX
          className="text-gray-500 ml-2 cursor-pointer"
          size={20}
          onClick={clearSearch}
        />
      )}
    </div>
  );
}
