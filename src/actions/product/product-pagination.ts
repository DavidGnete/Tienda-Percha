'use server';
import { Gender } from "@prisma/client";
import prisma from "@/lib/prisma"; 

interface PaginationOption{
    page?: number;
    take?: number;
    gender?: Gender;

}


export const getPaginateProductsWithImages =async({
    page =  1,
    take = 12,
    gender,
}: PaginationOption ) => {

    if (isNaN( Number (page))) page = 1;
    if (page < 1 ) page = 1;

    try{
        //obtener los productos 
        const products = await prisma.product.findMany({
            take: take,
            skip: (page - 1 ) * take,
            include: {
                ProductImage: {
                    take: 2,
                    select: {
                        url: true   
                    }
                }
            },
            where: {
                gender: gender,
            },
        });

        //obtener el total de las paginas 
        
        const totalCount = await prisma.product.count({
            where: {
                gender: gender,
            },
        });
        const totalPages  = Math.ceil(totalCount/ take);

        return {
            currentPage: page,
            totalPages: totalPages,
            products: products.map( product => ({
                ...product,
                images: product.ProductImage.map( (image) => image.url)
            })),
        };
    }catch (error) {
        console.error("No se pudieron cargar los productos",error)
        throw new Error

    }
}