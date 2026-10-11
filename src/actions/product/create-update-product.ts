'use server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth.config';
import { Gender, Size, Product } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { categoryLabel, genderLabel, slugify } from '@/utils';
import {z} from 'zod';
import { v2 as cloudinary} from 'cloudinary';
cloudinary.config(process.env.CLOUDINARY_URL ?? '');

const productSchema = z.object({
    id: z.uuid().optional().nullable(),
    title: z.string().trim().min(3).max(255),
    // Opcional: si viene vacío se genera a partir del título
    slug: z.string().trim().max(255).optional().default(''),
    description: z.string(),
    price: z.coerce
    .number()
    .min(0)
    .transform( val => Number(val.toFixed(2)) ),
    // Opcional: vacío = 0
    inStock: z.preprocess(
        val => (val === '' || val === undefined || val === null) ? 0 : val,
        z.coerce.number().min(0).transform( val => Number(val.toFixed(0)) ),
    ),
    categoryId: z.uuid(),
    // "S,M,L" -> ['S','M','L'], al menos una talla válida
    sizes: z.string()
    .transform( val => val.split(',').map( s => s.trim()).filter(Boolean))
    .pipe( z.array(z.enum(Size)).min(1, 'Seleccione al menos una talla') ),
    // Opcional: si viene vacío se generan del título, la categoría y el género
    tags: z.string().optional().default(''),
    gender:z.enum(Gender),
});

export const CreateUpdateProduct = async ( formData:FormData) => {

    // Solo los administradores pueden crear/editar productos
    const session = await auth();
    if ( session?.user?.role !== 'admin') {
        return { ok: false, message: 'No autorizado' };
    }

    const { images: _, ...data } = Object.fromEntries( formData);
    const productParsed = productSchema.safeParse(data);

    if (!productParsed.success){
        console.log( productParsed.error)
        return {
            ok: false,
            message: productParsed.error.issues.map( issue => `${issue.path.join('.')}: ${issue.message}`).join('\n'),
        }
    }
    const product = productParsed.data;

    const  {id, categoryId, sizes, tags, ...scalarData} = product;

    try{
        scalarData.slug = await getUniqueSlug( slugify(scalarData.slug || scalarData.title), id );
        if ( !scalarData.slug ) {
            return { ok: false, message: 'El título debe contener letras o números' };
        }

        const tagsArray = tags.trim()
            ? tags.split(',').map( tag => tag.trim().toLowerCase()).filter(Boolean)
            : await getDefaultTags( scalarData.title, categoryId, scalarData.gender );

        // Las imágenes se suben ANTES de la transacción para no mantenerla abierta
        // mientras Cloudinary responde (la transacción tiene timeout de 5s)
        const files = (formData.getAll('images') as File[]).filter( file => file.size > 0);
        const imageUrls = await UploadImages(files);
        if ( !imageUrls ){
            return { ok: false, message: 'No se pudieron cargar las imágenes' };
        }

        const savedProduct = await prisma.$transaction( async (tx)=> {

            const productData = {
                ...scalarData,
                category: { connect: { id: categoryId } },
                Size: { set: sizes as Size[] },
                tags: { set: tagsArray },
            };

            const product: Product = id
                ? await tx.product.update({ where: { id }, data: productData })
                : await tx.product.create({ data: productData });

            if ( imageUrls.length > 0 ) {
                await tx.productImage.createMany({
                    data: imageUrls.map( url => ({
                        url,
                        productId: product.id
                    }))
                });
            }

            return product;
        });

        revalidatePath('/');
        revalidatePath(`/gender/${savedProduct.gender}`);
        revalidatePath('/admin/products');
        revalidatePath(`/admin/product/${savedProduct.slug}`);
        revalidatePath(`/product/${savedProduct.slug}`);

        return {
            ok: true,
            product: savedProduct,
        }

    }catch(error) {
        console.log(error);

        const isDuplicatedSlug = (error as { code?: string })?.code === 'P2002';
        return {
            ok: false,
            message: isDuplicatedSlug
                ? 'Ya existe un producto con ese slug'
                : 'Revisar los logs, no se puede actualizar/crear'
        }

    }
}

// Si el slug ya lo usa otro producto agrega un sufijo: camiseta, camiseta-2, camiseta-3...
const getUniqueSlug = async ( baseSlug: string, productId?: string | null ) => {
    if ( !baseSlug ) return '';

    let slug = baseSlug;
    for ( let i = 2; ; i++ ) {
        const existing = await prisma.product.findUnique({ where: { slug }, select: { id: true } });
        if ( !existing || existing.id === productId ) return slug;
        slug = `${baseSlug}-${i}`;
    }
}

// Tags por defecto: palabras del título + categoría + género, en español
const getDefaultTags = async ( title: string, categoryId: string, gender: Gender ) => {
    const category = await prisma.category.findUnique({ where: { id: categoryId }, select: { name: true } });

    const words = slugify(title).split('-').filter( word => word.length >= 3 );
    const extra = [
        category ? slugify(categoryLabel(category.name)) : '',
        slugify(genderLabel(gender)),
    ];

    return Array.from( new Set([ ...words, ...extra ].filter(Boolean)) );
}

// Devuelve las URLs subidas, o null si alguna imagen falló
const UploadImages = async( images: File[]) => {

    try {
        const uploadPromises = images.map( async (image) => {
            const buffer = await image.arrayBuffer();
            const base64Image = Buffer.from(buffer).toString('base64');
            const mimeType = image.type || 'image/png';

            const result = await cloudinary.uploader.upload(`data:${mimeType};base64,${base64Image}`, {
                folder: 'products'
            });
            return result.secure_url;
        });

        return await Promise.all( uploadPromises);

    }catch (error){
        console.log(error);
        return null;
    }
}
