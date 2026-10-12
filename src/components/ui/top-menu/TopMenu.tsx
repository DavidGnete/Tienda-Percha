"use client";
import { titleFont } from "@/config/fonts";
import Link from "next/link";
import { IoCartOutline, IoMenuOutline } from "react-icons/io5";
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
    <nav className="flex px-4 py-3 sm:px-10 justify-between items-center w-full">
      <div>
        <Link href="/" className="whitespace-nowrap">
          <span className={`${titleFont.className} antialiased font-bold`}>
            Tu Perchita{" "}
          </span>
          <span className="hidden sm:inline"> | Tienda</span>
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
        <Link
          className="m-2 p-2 rounded-md transition-all hover:bg-gray-100"
          href="/gender/unisex"
        >
          Unisex
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
        }  className="p-2 sm:m-10" aria-label="Carrito">
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
          type="button"
          onClick={openMobileMenu}
          aria-label="Abrir menú"
          className="sm:hidden ml-1 p-2 hover:bg-gray-100 rounded-md"
        >
          <IoMenuOutline className="w-7 h-7" />
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
