import React from "react";
import { useSearchParams } from "react-router-dom";
import Button from "./Button";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

export default function Pagination({ totalPages, currentPage, isLoading }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      searchParams.set("page", newPage);
      setSearchParams(searchParams);
    }
  };

  const pageLessThan1 = isLoading ? true : currentPage <= 1;
  const pageGreaterThanPages = isLoading ? true : currentPage >= totalPages;

  return (
    <div className="flex justify-end items-center mt-4">
      <div className="flex items-center space-x-4">
        <Button
          text={
            <span
              className={` flex items-center ${
                pageLessThan1 ? " text-gray-500" : ""
              }`}
            >
              <IoIosArrowBack size={22} color="" />
            </span>
          }
          className="border p-2 rounded"
          onClick={() => handlePageChange(Number(currentPage) - 1)}
          disabled={pageLessThan1}
        />
        <span className="border p-2 px-4 rounded">{currentPage}</span>
        <Button
          text={
            <span
              className={` flex items-center ${
                pageGreaterThanPages ? " text-gray-500" : ""
              }`}
            >
              <IoIosArrowForward size={22} />
            </span>
          }
          className="border p-2 rounded"
          onClick={() => handlePageChange(Number(currentPage) + 1)}
          disabled={pageGreaterThanPages}
        />
        <span className="">of {totalPages}</span>
      </div>
    </div>
  );
}
