import React from "react";
import TitleCard from "../../../components/Cards/TitleCard";
import { Link } from "react-router-dom";

const Category = () => {
  return (
    <TitleCard topMargin="mt-2" title={`All Categories`}>
      <div className="flex flex-col justify-center items-center gap-6  sm:flex-row  max-sm:mt-4">
        <div className="relative md:hover:scale-[110%] duration-100">
          <Link
            to="demat_account"
            class="block max-w-sm p-6 h-60 w-60 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
          >
            <h5 class="mb-2 text-2xl font-bold">Demat Account</h5>
            <p class="font-normal text-gray-700 dark:text-gray-400">
              Electronically holds securities for easy trading, eliminating the
              need for physical certificates.
            </p>
          </Link>
        </div>

        <div className="relative md:hover:scale-[110%] duration-100">
          <Link
            to="savings_account"
            class="block max-w-sm p-6 h-60 w-60 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
          >
            <h5 class="mb-2 text-2xl font-bold">Saving Account</h5>
            <p class="font-normal text-gray-700 dark:text-gray-400">
              Bank account for storing funds with minimal interest, providing
              liquidity and easy access for everyday transactions.
            </p>
          </Link>
        </div>
        <div className="relative md:hover:scale-[110%] duration-100">
          <Link
            to="special_products"
            class="block max-w-sm p-6 h-60 w-60 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
          >
            <h5 class="mb-2 text-2xl font-bold">Special Products</h5>
            <p class="font-normal text-gray-700 dark:text-gray-400">
              Tailored financial offerings, such as high-yield savings accounts,
              premium credit cards, and exclusive investment opportunities.
            </p>
          </Link>
        </div>
        <div className="relative md:hover:scale-[110%] duration-100">
          <Link
            to="all_products"
            class="block max-w-sm p-6 h-60 w-60 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
          >
            <h5 class="mb-2 text-2xl font-bold">All Products</h5>
            <p class="font-normal text-gray-700 dark:text-gray-400">
              All category included in this like Demat Account, Special Products and Saving Account
            </p>
          </Link>
        </div>
      </div>
    </TitleCard>
  );
};

export default Category;
