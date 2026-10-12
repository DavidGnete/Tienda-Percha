export const revalidate = 60;

import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Pagination, ProductGrid, Title } from "@/components";
import { getPaginateProductsWithImages } from "@/actions";
/* import { Gender } from '../../../../generated/prisma/enums'; */
import { Gender } from '@prisma/client';


interface Props {
  params: {
    gender: string;
  },
  searchParams: {
    page?: string;

  }
}
export default async function ({params, searchParams}: Props) {

  const {gender} = await params;

  // /gender/xyz: género inexistente -> 404 (evita un error de Prisma con un valor fuera del enum)
  if ( !Object.values(Gender).includes(gender as Gender) ) {
    notFound();
  }

  const {page: pageParams} = await searchParams;
  
    const page =  pageParams ? parseInt(pageParams) : 1;
  
    const {products, currentPage, totalPages} = await getPaginateProductsWithImages({ page, gender: gender as Gender});
  
    // Página fuera de rango (ej. ?page=99) -> primera página.
    // Solo si page > 1: redirigir desde la página 1 a sí misma creaba un bucle infinito
    // de peticiones GET cuando el género no tenía productos.
    if (products.length === 0 && page > 1) {
      redirect(`/gender/${gender}`);
    }
  




  const  labels: Record<string, string> = {
    'men': 'De Hombres',
    'women': 'De Mujeres',
    'kid': 'De Niños',
    'unisex': 'Para Todos'
  }

 /*  if ( id === 'kids'){
    notFound();
  } */


  return (
    <>
    <Title
          title={`Articulos ${ (labels)[gender] }`}
          className="mb-2"
          />
      
    {
      products.length === 0 ? (
        <div className="flex flex-col items-center justify-center my-20 text-center px-5">
          <p className="text-lg">Aún no hay artículos en esta sección.</p>
          <Link href="/" className="mt-4 underline">
            Ver todos los productos
          </Link>
        </div>
      ) : (
        <>
          <ProductGrid
            products={products}
          />
          <Pagination totalPages={totalPages} />
        </>
      )
    }
    </>
  );
}