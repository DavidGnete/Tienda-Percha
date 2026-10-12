"use server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth.config";
import { revalidatePath } from "next/cache";

export const DeleteProductBD = async (productId: string) => {

    // Solo los administradores pueden borrar productos
    const session = await auth();
    if ( session?.user?.role !== 'admin') {
        return { ok: false, message: 'No autorizado' };
    }

    if ( typeof productId !== 'string' || !productId ) {
        return { ok: false, message: 'Producto inválido' };
    }

    try {

        await prisma.$transaction(async(tx) => {
            await tx.productImage.deleteMany({
                where: {
                    productId
                },
            }),

            await tx.product.deleteMany({
                where:{
                    id: productId,
                },
            });
        
        });

        revalidatePath('/admin/products');
        return {ok: true}


        
    } catch (error) {
        console.error(error)
        return {
            ok: false,
            message:'No se pudo eliminar el producto'

        }

        
    }
}