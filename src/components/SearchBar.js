import { useEffect, useState } from "react";
import {
  IconSearch,
  IconChevronCompactLeft,
  IconArrowLeft,
} from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/router";

const SearchBar = () => {
  return (
    <div className="flex relative w-full bg-white px-5 pt-2">
      <div className="w-full flex flex-row pl-4 rounded-xl gap-3 bg-gray-100 text-sm">
        <svg
          className="w-4 text-primary"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 20"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
          />
        </svg>
        <input
          type="search"
          id="default-search"
          className="bg-transparent w-full py-4 px-1 focus:outline-none"
          placeholder="Cari..."
          required
        />
      </div>
    </div>
  );
};

export default SearchBar;
