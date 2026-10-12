"use client";
import { titleFont } from "@/config/fonts";
import Link from "next/link";
import { IoSearchOutline, IoCartOutline} from "react-icons/io5";
import React, { useEffect, useState } from "react";
import { useCartStore, useUIStore } from "@/store";

export const TopMenu = () => {
  const openSideMenu = useUIStore((state) => state.openSideMenu);
  
  const openMobileMenu = useUIStore((state) => state.openMobileMenu);
  const totalItemInCart = useCartStore((state) => state.getTotalItems());

  const [loaded, setloaded] = useState(false);

  useEffect(() => {
    setloaded(true)
  },[])

  return (
    <nav className="flex px-10 justify-between items-center w-full">
      <div>
        <Link href="/">
          <span className={`${titleFont.className} antialiased font-bold`}>
            Tu Perchita{" "}
          </span>
          <span> | Tienda</span>
        </Link>
      </div>

      <div className="hidden sm:block">
        <Link
          className="m-2 p-2 rounded-md transition-all hover:bg-gray-100"
          href="/gender/men"
        >
          Hombres
        </Link>
        <Link
          className="m-2 p-2 rounded-md transition-all hover:bg-gray-100"
          href="/gender/women"
        >
          Mujeres
        </Link>
        <Link
          className="m-2 p-2 rounded-md transition-all hover:bg-gray-100"
          href="/gender/kid"
        >
          Niños
        </Link>
      </div>

      <div className="flex items-center">
        {/* <Link href="/search" className="mx-2">
          <IoSearchOutline className="w-5 h-5" />
        </Link> */}

        <Link href={
          ((totalItemInCart === 0) && loaded)
          ? "/empty"
          : "/cart"
        }  className="m-10">
          <div className="relative">
            {(loaded && totalItemInCart > 0) && (
              <span className="fade-in absolute  text-xs  rounded-full px-1 font-bold -top-2 -right-2 bg-blue-700 text-white">
                {totalItemInCart}
              </span>
            )}
            <IoCartOutline className="w-7 h-7" />
          </div>
        </Link>

        <button
          onClick={openMobileMenu}
          className="sm:hidden m-2 p-2 hover:bg-gray-100 rounded-md"
        >
          Menu
        </button>

        {/* BOTÓN DESKTOP */}
        <button
          onClick={openSideMenu}
          className="hidden sm:block m-2 p-2 hover:bg-gray-100 rounded-md"
        >
          Menu
        </button>
      </div>
    </nav>
  );
};
