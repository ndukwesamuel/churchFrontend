import React from "react";
import { Link } from "react-router-dom";

const getValue = (obj, path) =>
  path.split(".").reduce((acc, part) => acc && acc[part], obj);

const getStatusClasses = (status) => {
  switch (status.toLowerCase()) {
    case "0/2 verified":
    case "0/2 submitted":
      return "bg-red-100 text-red-500 px-2 py-1 rounded-full";
    case "1/2 verified":
    case "1/2 submitted":
      return "bg-purple-200 text-purple-500 px-2 py-1 rounded-full";
    case "2/2 verified":
    case "2/2 submitted":
    case "3/2 verified":
    case "3/2 submitted":
      return "bg-green-200 text-green-500 px-2 py-1 rounded-full";
    default:
      return "bg-gray-200 text-gray-500 px-2 py-1 rounded-full";
  }
};

export default function Table({ columns, data }) {
  return (
    <div className="flex flex-col rounded-md overflow-hidden">
      <div className="flex text-gray-600 font-semibold text-sm">
        {columns.map((column) => (
          <div
            key={column.accessor}
            className="flex-1 py-3 px-4 text-left text-secondary"
          >
            {column.header}
          </div>
        ))}
      </div>

      <div className="flex flex-col divide-y">
        {data.map((row) => (
          <Link
            to={`/candidates/details`}
            key={row?.staff_id}
            state={row}
            className="flex hover:bg-sky-50 text-gray-700 text-sm py-2"
          >
            {columns.map((column) => {
              const value = getValue(row, column.accessor);

              // Custom display logic for the `submittedStatus` field
              const displayValue =
                column.accessor === "submittedStatus"
                  ? `${value}/2 Submitted`
                  : column.accessor === "status"
                  ? `${value}/2 Verified`
                  : value;

              return (
                <div
                  key={column.accessor}
                  className="flex-1 py-1 px-4 text-left whitespace-nowrap overflow-hidden"
                >
                  <span
                    className={`${
                      column.accessor === "status" ||
                      column.accessor === "submittedStatus"
                        ? getStatusClasses(displayValue)
                        : ""
                    }`}
                  >
                    {displayValue}
                  </span>
                </div>
              );
            })}
          </Link>
        ))}
      </div>
    </div>
  );
}
