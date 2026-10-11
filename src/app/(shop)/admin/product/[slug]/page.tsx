
import { getProductBySlug } from "@/actions";
import { Title } from "@/components";
import { redirect } from "next/navigation";
import { ProductForm } from "./ui/ProductForm";
import { getCategories } from "@/actions";



interface Props {
    params: {
        slug: string;
    }
}


export default async  function productPage({params}: Props ) {
    

    const {slug} = await params;

    const [ product, categories] = await Promise.all([

        getProductBySlug(slug),
        getCategories()


    ])
    

    //Todo: new
    if( !product && slug !== 'new' ) {
        redirect('/admin/products')
    }

    const title = (slug === 'new') ? 'Nuevo Producto': 'Editar Producto'
  return (
    <div>
        
        <Title title={title}></Title>

        <ProductForm product={product ?? {}} categories ={categories} ></ProductForm>
    </div>
  );
}