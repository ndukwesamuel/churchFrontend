import React, { useEffect, useState } from "react";
import Topbar from "../../components/Topbar/Topbar";
import {
  useCandiateActions,
  useCandidateStore,
} from "../../store/useCandidateStore";
import Table from "../../components/Table";
import Button from "../../components/Button";
import SearchInput from "../../components/SearchInput";
import { useSearchParams } from "react-router-dom";
import Pagination from "../../components/Pagination";
import FilterModal from "../../components/FilterModal";

const columns = [
  { header: "Surname", accessor: "data.surname" },
  { header: "First Name", accessor: "data.firstname" },
  { header: "Email", accessor: "data.email_address" },
  { header: "Staff ID", accessor: "staff_id" },
  { header: "Submitted", accessor: "submittedStatus" },
  { header: "Status", accessor: "status" },
];

export default function Candidates() {
  const { candidates, pagination, isLoading } = useCandidateStore();
  const { getAllCandidates } = useCandiateActions();

  const [searchParams, setSearchParams] = useSearchParams();
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  useEffect(() => {
    // Load saved search params from localStorage, or set default perPage to 10
    const savedParams = JSON.parse(localStorage.getItem("searchParams"));

    console.log(savedParams);

    if (Object.keys(savedParams).length > 0) {
      // Only update the searchParams with savedParams if needed
      setSearchParams((prevParams) => {
        const newParams = new URLSearchParams(prevParams);
        Object.keys(savedParams).forEach((key) => {
          if (!newParams.has(key)) {
            newParams.set(key, savedParams[key]);
          }
        });
        return newParams;
      });
    } else if (!searchParams.has("perPage")) {
      setSearchParams((prevParams) => {
        const newParams = new URLSearchParams(prevParams);
        newParams.set("perPage", "10");
        return newParams;
      });
    }
  }, [setSearchParams, searchParams]);

  useEffect(() => {
    // Fetch candidates and save params to localStorage each time they change
    const params = Object.fromEntries(searchParams.entries());
    getAllCandidates(params);
    return () => localStorage.setItem("searchParams", JSON.stringify(params));
  }, [searchParams, getAllCandidates]);

  const handleApplyFilters = (filters) => {
    setSearchParams((prevParams) => {
      const newParams = new URLSearchParams(prevParams);
      Object.keys(filters).forEach((key) => {
        if (filters[key]) {
          newParams.set(key, filters[key]);
        } else {
          newParams.delete(key);
        }
      });
      return newParams;
    });
  };

  return (
    <div className="overflow-hidden w-full">
      <div className="flex-1 min-h-dvh">
        <Topbar />
        <div className="mt-4 bg-white border rounded p-5">
          <div className="py-4 flex items-center justify-between">
            <p className=" text-3xl text-secondary font-semibold">Candidates</p>

            <div className=" flex gap-2 relative">
              <SearchInput />
              <Button
                text="Filter"
                className="bg-primary p-2 rounded-lg text-white"
                onClick={() => setIsFilterModalOpen(true)}
              />
              <FilterModal
                isOpen={isFilterModalOpen}
                onClose={() => setIsFilterModalOpen(false)}
                onApply={handleApplyFilters}
              />
            </div>
          </div>
          <Table columns={columns} data={candidates} />
          <Pagination
            totalPages={pagination.totalPages}
            currentPage={pagination.currentPage}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
