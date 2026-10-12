export interface Product{
    id: string;
    description: string;
    images?: string[];
    inStock: number;
    price: number;
    Size: Size[];
    slug: string;
    tags: string[];
    title: string;
    //todo: type: ValidType;
    gender: ValidCategorie;
}

export interface CartProduct {
    id: string;
    slug: string,
    title: string,
    price: number,
    quantity: number,
    // Vacío o ausente si el producto no tiene tallas/opciones
    size?: Size,
    image?: string,
}


export interface ProductImage {
    id: number;
    url: string;
    productId?: string;
}


export type ValidCategorie ='men'|'women'|'kid'|'unisex';
// Talla u opción libre: 'M', '38', '100 ml'...
export type Size = string;
export type ValidType = 'shirts'|'pants'|'hoodies'|'hats';