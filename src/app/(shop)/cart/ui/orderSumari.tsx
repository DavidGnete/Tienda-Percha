"use client";

import { useCartStore } from "@/store";
import { CurrencyFormat } from "@/utils";
import { useEffect, useMemo, useState } from "react";

interface Props {
  sendMessage?: (summary:{
    subTotal: number,
    tax: number,
    total: number,
    itemsInCart:number,
  }) => void;
}

export const OrderSumari = ({sendMessage}:Props ) => {
  const [loaded, setLoaded] = useState(false);
  const cart = useCartStore(state => state.cart);

  const summary = useMemo(() => {
    const subTotal = cart.reduce(
      (sum, product) => sum + product.price * product.quantity,
      0
    );

    const tax = subTotal * 0.15;
    const total = subTotal + tax;
    const itemsInCart = cart.reduce((sum, item) => sum + item.quantity, 0);

    return { subTotal, tax, total, itemsInCart };
  }, [cart]);

  useEffect(() => {
    setLoaded(true);
  }, []);

  useEffect(() => {
    sendMessage?.(summary);
  }, [summary, sendMessage])

  if (!loaded) return <p>Cargando...</p>;

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-1">
      <span>Artículos</span>
      <span className="text-right">{summary.itemsInCart}</span>

      <span>Subtotal</span>
      <span className="text-right">{CurrencyFormat(summary.subTotal)}</span>

      <span>Impuestos (15%)</span>
      <span className="text-right">{CurrencyFormat(summary.tax)}</span>

      <span className="mt-5 text-2xl">Total</span>
      <span className="mt-5 text-2xl text-right">{CurrencyFormat(summary.total)}</span>
    </div>
  );
};
