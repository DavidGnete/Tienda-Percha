"use client";
import { ImageProducts, Title } from "@/components";
import Link from "next/link";
import { OrderSumari } from "../cart/ui/orderSumari";
import { useCartStore } from "@/store";
import { WhattsapInformation } from "@/actions/WhattsappText/whattsap-text";
import { useState } from "react";
import { WHATSAPP_NUMBER } from "@/config/whatsapp";
import { CurrencyFormat } from "@/utils";

interface ordesumarryData {
  subTotal: number,
  tax: number,
  total: number,
  itemsInCart: number
}

export default function () {
  const productos = useCartStore((state) => state.cart);
  const [summary, setsummary] =useState<ordesumarryData | null>(null);

    const handlePlaceOrder = () => {
    // 1️⃣ Validaciones
    if (productos.length === 0) {
      alert('El carrito está vacío');
      return;
    }

    if (!summary) {
      alert('No se pudo obtener el resumen de la orden');
      return;
    }

    const orderData = {
      products: productos,
      summary,
      orderDate: new Date().toISOString(),
    };

    // 3️⃣ Enviar a WhatsApp
    WhattsapInformation(orderData, WHATSAPP_NUMBER);
  };
  return (
    <div className="flex justify-center items-center mb-20 px-4 sm:px-0">
      <div className="flex flex-col w-full max-w-4xl">
        <Title title="Confirmar pedido" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {/* carrito */}
          <div className="flex flex-col mt-5">
            <span className="text-xl">Tu pedido</span>
            <Link href="/cart" className="underline mb-5">
              Editar carrito
            </Link>

            {/*  Items del Carrito */}
            {productos.map((product) => (
              <div key={`${product.slug}-${product.size ?? ''}`} className="flex mb-10">
                <ImageProducts
                  src={product.image ?? "/placeholder.png"}
                  width={100}
                  height={100}
                  style={{
                    width: "100px",
                    height: "100px",
                  }}
                  alt={product.title}
                  className="mr-5 rounded"
                />

                <div>
                  <p>{product.title} </p>
                  {product.size && <p className="text-sm text-gray-500">{product.size}</p>}
                  <p>
                    {CurrencyFormat(product.price)} x {product.quantity}
                  </p>
                  <p className="font-bold">
                    Subtotal: {CurrencyFormat(product.price * product.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* checkout compra- resumen */}
          <div className="bg-white rounded-xl shadow-xl p-5 sm:p-7 h-fit">
            <h2 className="text-2xl mb-2">Resumen</h2>

            <OrderSumari  sendMessage={setsummary}/>


            <button
              type="button"
              onClick={handlePlaceOrder}
              className="mt-5 mb-2 w-full flex btn-primary justify-center cursor-pointer"
            >
              Enviar pedido por WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
