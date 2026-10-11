// Etiquetas en español para mostrar en pantalla.
// Los valores guardados en la base de datos (enum Gender y Category.name) no cambian.

export const genderLabels: Record<string, string> = {
    men: 'Hombre',
    women: 'Mujer',
    kid: 'Niño',
    unisex: 'Unisex',
};

const categoryLabels: Record<string, string> = {
    shirts: 'Camisetas',
    pants: 'Pantalones',
    hoodies: 'Sudaderas',
    hats: 'Gorras',
};

export const genderLabel = (gender: string) => genderLabels[gender] ?? gender;

export const categoryLabel = (name: string) => categoryLabels[name.toLowerCase()] ?? name;

// "Camiseta Niño Azul!" -> "camiseta-nino-azul"
export const slugify = (text: string) =>
    text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
