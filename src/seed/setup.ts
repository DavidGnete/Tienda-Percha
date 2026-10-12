
import prisma from '../lib/prisma.js'
import { initialData } from './seed.js';
import { categoryLabel } from '../utils/labels.js';

declare var process: any;

// Para agregar otra categoría, súmala a esta lista y corre: npm run setup
const extraCategories = ['Zapatos', 'Accesorios', 'Lociones'];


// Deja la base lista para cargar productos propios desde el panel de admin:
// - Borra SOLO los productos de ejemplo del seed (por slug).
// - Deja las categorías en español (renombra las del seed o las crea si faltan).
// No sube nada a Cloudinary y no toca los productos creados por ti ni los usuarios.
async function main() {

    const seedSlugs = initialData.products.map(product => product.slug);

    const seedProducts = await prisma.product.findMany({
        where: { slug: { in: seedSlugs } },
        select: { id: true },
    });
    const seedProductIds = seedProducts.map(product => product.id);

    await prisma.productImage.deleteMany({ where: { productId: { in: seedProductIds } } });
    const deletedProducts = await prisma.product.deleteMany({ where: { id: { in: seedProductIds } } });

    // 'Shirts' -> 'Camisetas', etc. Se renombra para conservar el id de la categoría.
    for (const name of initialData.categories) {
        const spanishName = categoryLabel(name);

        const existing = await prisma.category.findFirst({ where: { name: spanishName } });
        if (existing) continue;

        const english = await prisma.category.findFirst({ where: { name } });
        if (english) {
            await prisma.category.update({ where: { id: english.id }, data: { name: spanishName } });
        } else {
            await prisma.category.create({ data: { name: spanishName } });
        }
    }

    // Categorías propias de la tienda que no vienen del seed
    for (const name of extraCategories) {
        const existing = await prisma.category.findFirst({ where: { name } });
        if (!existing) await prisma.category.create({ data: { name } });
    }

    const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });

    console.log(`Productos de ejemplo eliminados: ${deletedProducts.count}`);
    console.log(`Categorías: ${categories.map(category => category.name).join(', ')}`);
}

(async () => {
    try {
        await main();
    } catch (e) {
        console.error((e as Error).message);
        process.exitCode = 1;
    } finally {
        await prisma.$disconnect();
    }
})();
