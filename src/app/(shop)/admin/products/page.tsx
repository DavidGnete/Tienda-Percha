import { getPaginateProductsWithImages } from "@/actions";
import { Pagination, ImageProducts, Title } from "@/components";
import { CurrencyFormat, genderLabel } from "@/utils";
import { IoTrash} from "react-icons/io5";
import { DeleteProductsBD } from "@/components/product/delete-product/DeleteProductBD";
import Image from "next/image";

import Link from "next/link";

import { Redirect } from "next";
import { ProductImage } from '../../../../interfaces/product.interface';


interface Props {
  searchParams: {
    page?: string;
  };
}


export default async function ProductsView({ searchParams}: Props ) {

    const params = await searchParams;
  const page = params.page ? parseInt(params.page) : 1;

  const { products, currentPage, totalPages } = await getPaginateProductsWithImages({ page });


  return (
    <>
      <Title title="Mantenimeinto de Productos" />


      <div className="flex justify-end mb-5">
        <Link href='/admin/product/new' className="btn-primary">
            Nuevo Producto
        </Link>

      </div>

      <div className="mb-10">
        <table className="min-w-full">
          <thead className="bg-gray-200 border-b">
            <tr>
              <th
                scope="col"
                className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
              >
                Imagen
              </th>
              <th
                scope="col"
                className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
              >
                Titulo
              </th>
              <th
                scope="col"
                className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
              >
                Precio
              </th>
              <th
                scope="col"
                className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
              >
                Genero
              </th>
              <th
                scope="col"
                className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
              >
                Inventario
              </th>
              <th
                scope="col"
                className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
              >
                Tallas
              </th>
              <th
                scope="col"
                className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
              >
                Eliminar
         
              </th>
            </tr>
          </thead>
          <tbody>

            {products.map((product) => (
            <tr 
            key={product.id}
            className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100"
            >

              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                
            <Link href={`/product/${product.slug}`}>

              <ImageProducts
                src={product.ProductImage[0]?.url }
                width={80}
                height={80}
                alt={product.title }
                className="w-20 h-20 object-cover rounded"
                />

            </Link>

              </td>

              <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                
                <Link 
                href={`/admin/product/${product.slug}`}
                className="hover:underline"
                >
                    {product.title}
                </Link>
              </td>

              <td className="text-sm  text-gray-900 font-bold px-6 py-4 whitespace-nowrap">
            {CurrencyFormat( product.price)}
              </td>

              <td className="text-sm  text-gray-900 font-ligth px-6 py-4 whitespace-nowrap">
            {genderLabel(product.gender)}
              </td>

               <td className="text-sm  text-gray-900 font-bold px-6 py-4 whitespace-nowrap">
            {product.inStock}
              </td>
            
             <td className="text-sm  text-gray-900 font-bold px-6 py-4 whitespace-nowrap">
            {product.Size.join(', ')}
              </td>


             <td className="text-sm  text-gray-900 font-bold px-6 py-4 whitespace-nowrap">
            <DeleteProductsBD productId={product.id} />
              </td>

  
            </tr>
            ))}



          </tbody>
        </table>

        <Pagination totalPages={ totalPages } />
      </div>
    </>
  );
}
