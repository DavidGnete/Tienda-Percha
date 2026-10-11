'use server';

import prisma from '@/lib/prisma';
import { auth } from '@/auth.config';
import { v2 as cloudinary} from 'cloudinary';
import { revalidatePath } from 'next/cache';
cloudinary.config(process.env.CLOUDINARY_URL ?? '');

export const DeleteProductImage = async (imageId: number, imageUrl: string) => {

    if (!imageUrl.startsWith('http')) {
        return {
            ok: false,
            error: 'No se puede borrar imagenes de File System'
        }
    }

    const session = await auth();
    if ( session?.user?.role !== 'admin') {
        return { ok: false, message: 'No autorizado' };
    }

    // https://res.cloudinary.com/<cloud>/image/upload/v123/products/abc.jpg -> products/abc
    const imageName = imageUrl.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-z0-9]+$/i)?.[1] ?? '';

    try {

        await cloudinary.uploader.destroy(imageName);
        const deleteImage = await prisma.productImage.delete({
            where: {
                id: imageId
            },
            select: {
                product: {
                    select: {
                        slug: true
                    }
                }
            }
        })


        //revalido los pats
        revalidatePath(`/admin/products`);
        revalidatePath(`/admin/product/${deleteImage.product.slug}`);
        revalidatePath(`/product/${deleteImage.product.slug}`);

        return { ok: true };

    } catch (error) {
        console.log(error)
        return {
            ok: false,
            message: 'No se pudo eliminar la imagen'
        }
        
    }






} 