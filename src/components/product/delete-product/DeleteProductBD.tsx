"use client";
import { DeleteProductBD } from "@/actions/product/delete-productDB";
import { IoTrash } from 'react-icons/io5';


interface Props {
    productId: string,
}

export const DeleteProductsBD =({productId}:Props) => {

    const onDelete = async () => {
        if (!confirm('¿Eliminar este producto? Esta acción no se puede deshacer.')) return;

        const { ok, message } = await DeleteProductBD(productId);
        if (!ok) alert(message);
    };
  return (
    <button 
    onClick={onDelete} className="text-xl cursor-pointer">
        <IoTrash />
    </button>
  );
}