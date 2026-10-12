export const revalidate = 60;
import { getPaginateProductsWithImages } from "@/actions";
import { Pagination, ProductGrid, Title } from "@/components";
import { Mainswiper } from "@/components/ui/main-Swiper/Mainswiper";
import { TextWhattsap } from "@/components/ui/TextWhattsap/TextWhattsap";
import { redirect } from "next/navigation";
import { Suspense } from "react";

interface Props {
  searchParams: {
    page: string;
    images: string[

    ];
  };
}

const slidePromo = [
  'Percha.webp',
  'percha3.webp',
  'percha2.webp',
]

export default async function Home({ searchParams }: Props) {
  const params = await searchParams;

  const page = params.page ? parseInt(params.page) : 1;

  const { products, currentPage, totalPages } =
    await getPaginateProductsWithImages({ page });

  return (
    <>
    <Mainswiper  images= {slidePromo} />

      <TextWhattsap  />

      <Title  subtitle="Todos los productos " className="font-bold"  />
      {/*  Comente la linea SIZE en interface/productinterface */}

      {/* Este es el contenido Principal */}
      <ProductGrid products={products} />
      <Suspense fallback={<div>Cargando....</div>}>
        <Pagination totalPages={totalPages} />
      </Suspense>
    </>
  );
}
