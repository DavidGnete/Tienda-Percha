
import { initialData } from '../seed/seed.js';
import prisma from '../lib/prisma.js'

import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'
import path from 'path';

declare var process: any;
cloudinary.config(process.env.CLOUDINARY_URL ?? '');


async function uploadImageToCloudinary(imagePath: string) {
  const absolutePath = path.join(process.cwd(), 'public/products', imagePath);

  if (!fs.existsSync(absolutePath)) {
    throw new Error(`Imagen no encontrada: ${absolutePath}`);
  }

  const result = await cloudinary.uploader.upload(absolutePath, {
    folder: 'products'
  });

  return result.secure_url;
}


async function main () {

 /*    await Promise.all([ */
    await prisma.productImage.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
 /*    ]); */

    // No toca la tabla de usuarios: el admin se crea con npm run create-admin
    const {categories, products} = initialData;

/* {
    name: 'Shirt'
} */

    const CategoriesData = categories.map( (name) => ({name}));

    await prisma.category.createMany({
        data: CategoriesData
    });

    const categoryDB = await prisma.category.findMany();

    const categoriesMap = categoryDB.reduce((map, category) => {
    
    map[ category.name.toLowerCase()] = category.id;
    return map;
    }, {} as Record<string, string> );


    //productos

    for (const product of products) {
    const { type, images, sizes, ...rest } = product;

    // Creamos el producto
    const dbProduct = await prisma.product.create({
      data: {
        ...rest,
        // Si tu schema dice 'sizes' con minúscula, cámbialo aquí
        Size: sizes ,
        categoryId: categoriesMap[type.toLowerCase()]!
      }
    });

    //Images
    const uploadedImages: { url: string; productId: string }[] = [];

  for (const image of images) {
    const cloudinaryUrl = await uploadImageToCloudinary(image);

    uploadedImages.push({
      url: cloudinaryUrl,
      productId: dbProduct.id
    });
  }
 await prisma.productImage.createMany({
    data: uploadedImages
  });

}
console.log("seed ejecutado correctamente")
}

(async () => {
    if (process.env.NODE_ENV === 'production') return;
    try {
        await main();
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
})();