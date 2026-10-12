"use client";

import Link from "next/link";
import clsx from "clsx";
import { useUIStore } from "@/store";
import { IoAddCircleOutline, IoCloseOutline, IoLogInOutline, IoLogOutOutline, IoPersonOutline, IoShirtOutline } from "react-icons/io5";
import { useSession } from "next-auth/react";
import { titleFont } from '../../../config/fonts';
import { Logout } from "@/actions";

const linkClass = "flex items-center p-2 hover:bg-gray-300 rounded transition-all";

export const MovilMenu = () => {
  const isMobileMenuOpen = useUIStore((state) => state.isMobileMenuOpen);
  const closeMobileMenu = useUIStore((state) => state.closeMobileMenu);

  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;
  const isAdmin = session?.user?.role === "admin";

  const onLogout = async () => {
    closeMobileMenu();
    try {
      await Logout();
    } finally {
      // Recarga completa para que la sesión del cliente se actualice
      window.location.replace("/");
    }
  };

  return (
    <div className="sm:hidden">

      {/* background */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-10 bg-black opacity-30 sm:hidden" />
      )}

      {/* blur + click cerrar */}
      {isMobileMenuOpen && (
        <div
          onClick={closeMobileMenu}
          className="fade-in fixed inset-0 z-10 backdrop-filter backdrop-blur-sm sm:hidden"
        />
      )}

      {/* SideMenu */}
      <nav
        className={clsx(
          "fixed p-5 right-0 top-0 w-72 h-screen overflow-y-auto bg-white z-20 transform transition-all duration-300 sm:hidden",
          {
            "translate-x-full": !isMobileMenuOpen,
            "shadow-2xl": isMobileMenuOpen,
          }
        )}
      >
        {/* cerrar */}
        <IoCloseOutline
          size={40}
          className="absolute top-5 right-5 cursor-pointer"
          onClick={closeMobileMenu}
        />

        {/* CATEGORÍAS */}
        <div className="mt-14 flex flex-col gap-2 sm:hidden">
            
            <span className={`${titleFont.className} pl-6 antialiased font-bold`}>
                Categorías
            </span>
            
          <Link
            href="/gender/men"
            onClick={closeMobileMenu}
            className="flex items-center p-2 hover:bg-gray-300 rounded transition-all"
          >
            <span className="ml-3 text-xl">Hombres</span>
          </Link>

          <Link
            href="/gender/women"
            onClick={closeMobileMenu}
            className="flex items-center p-2 hover:bg-gray-300 rounded transition-all"
          >
            <span className="ml-3 text-xl">Mujeres</span>
          </Link>

          <Link
            href="/gender/kid"
            onClick={closeMobileMenu}
            className="flex items-center p-2 hover:bg-gray-300 rounded transition-all"
          >
            <span className="ml-3 text-xl">Niños</span>
          </Link>

          <Link
            href="/gender/unisex"
            onClick={closeMobileMenu}
            className="flex items-center p-2 hover:bg-gray-300 rounded transition-all"
          >
            <span className="ml-3 text-xl">Unisex</span>
          </Link>
        </div>

        {/* CUENTA */}
        <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col gap-2">
          {isAuthenticated ? (
            <>
              <Link href="/profile" onClick={closeMobileMenu} className={linkClass}>
                <IoPersonOutline size={26} />
                <span className="ml-3 text-xl">Perfil</span>
              </Link>

              <button type="button" onClick={onLogout} className={`${linkClass} w-full text-left cursor-pointer`}>
                <IoLogOutOutline size={26} />
                <span className="ml-3 text-xl">Salir</span>
              </button>
            </>
          ) : (
            <Link href="/auth/login" onClick={closeMobileMenu} className={linkClass}>
              <IoLogInOutline size={26} />
              <span className="ml-3 text-xl">Ingresar</span>
            </Link>
          )}
        </div>

        {/* ADMIN */}
        {isAdmin && (
          <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col gap-2">
            <span className={`${titleFont.className} pl-6 antialiased font-bold`}>
              Administración
            </span>

            <Link href="/admin/products" onClick={closeMobileMenu} className={linkClass}>
              <IoShirtOutline size={26} />
              <span className="ml-3 text-xl">Productos</span>
            </Link>

            <Link href="/admin/product/new" onClick={closeMobileMenu} className={linkClass}>
              <IoAddCircleOutline size={26} />
              <span className="ml-3 text-xl">Nuevo producto</span>
            </Link>
          </div>
        )}
      </nav>
    </div>
  );
};