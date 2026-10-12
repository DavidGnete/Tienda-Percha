import {Title } from "@/components";
import Link from "next/link";
import { ProductsInCart } from "./ui/productsInCart";
import { OrderSumari} from './ui/orderSumari';


export default function CartPage() {

/*   redirect('/empty')
 */


  return (
    <div className="flex justify-center items-center mb-20 px-4 sm:px-0">
      <div className="flex flex-col w-full max-w-4xl">

        <Title 
        title="Carrito"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">

          {/* carrito */}
          <div className="flex flex-col mt-5">
            <span className="text-xl">¿Quieres agregar más productos?</span>
            <Link href="/" className="underline mb-5">
            Seguir comprando
            </Link>
          


         {/*  Items  */}
        
        <ProductsInCart />
         </div>

          {/* checkout compra- resumen */}
          <div className="bg-white rounded-xl shadow-xl p-5 sm:p-7 h-fit">
            <h2 className="text-2xl mb-2">Resumen de compra</h2>

          <OrderSumari />

            <div className="mt-5 mb-2 w-full">
              <Link href="/checkout"
              className="flex btn-primary justify-center"
              >
              Continuar con el pedido
              </Link>
            </div>

          </div>



        </div>


      </div>


    </div>
  );
}