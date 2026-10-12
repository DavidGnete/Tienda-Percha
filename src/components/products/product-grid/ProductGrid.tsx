import React from "react";
import { ProductGridItem } from "./ProductGridItem";
import { Product } from "@/interfaces";

interface Props {
  products: Product[];
}

export const ProductGrid = ({ products}: Props) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-3 gap-y-6 px-3 sm:px-0 sm:gap-10 mb-10">
      {products.map((product) => (
        <ProductGridItem key={product.slug} product={product}></ProductGridItem>
      ))}
    </div>
  );
};
