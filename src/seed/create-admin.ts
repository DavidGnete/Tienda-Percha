
import prisma from '../lib/prisma.js'
import bcryptjs from 'bcryptjs';

declare var process: any;

// Crea o actualiza un usuario administrador SIN borrar datos existentes.
// Las credenciales se leen de variables de entorno para no dejarlas en el código.
async function main() {

    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD;
    const name = process.env.ADMIN_NAME?.trim() || 'Administrador';

    if (!email || !password) {
        throw new Error('Defina ADMIN_EMAIL y ADMIN_PASSWORD en el archivo .env');
    }

    if (password.length < 8) {
        throw new Error('ADMIN_PASSWORD debe tener al menos 8 caracteres');
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);

    const user = await prisma.user.upsert({
        where: { email },
        update: { password: hashedPassword, role: 'admin' },
        create: { email, name, password: hashedPassword, role: 'admin' },
        select: { email: true, role: true },
    });

    console.log(`Usuario ${user.email} listo con rol ${user.role}`);
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
