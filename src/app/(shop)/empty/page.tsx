import { IoCafeOutline, IoCartOutline } from "react-icons/io5"
import { Size } from '../../../interfaces/product.interface';
import Link from "next/link";

export default function () {
  return (
    <div className="flex justify-center items-center h-[800px]">
      <IoCartOutline size={90} className="mx-5"/>
      <div className="flex flex-col items-center">
        <h1 className="text-xl font-semibold">Tu carrito  esta vacio</h1>
        <Link href='/'
        className="text-blue-500 mt-2 text-4xl">
        Regresar</Link>
      </div>
    </div>
  );
}