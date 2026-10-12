// Etiquetas en español para mostrar en pantalla.
// Los valores del enum Gender en la base de datos siguen en inglés.
// Las categorías se guardan en español (npm run setup); este mapa cubre nombres antiguos en inglés.

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
