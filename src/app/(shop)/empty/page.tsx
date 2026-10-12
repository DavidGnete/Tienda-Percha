import { IoCafeOutline, IoCartOutline } from "react-icons/io5"
import Link from "next/link";

export default function () {
  return (
    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 min-h-[60vh] px-4 text-center">
      <IoCartOutline size={90} />
      <div className="flex flex-col items-center">
        <h1 className="text-xl font-semibold">Tu carrito está vacío</h1>
        <Link href='/'
        className="text-blue-500 mt-2 text-2xl sm:text-4xl">
        Ver productos</Link>
      </div>
    </div>
  );
}