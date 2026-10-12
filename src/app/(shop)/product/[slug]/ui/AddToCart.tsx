"use client";
import { QuantitySelector, SizeSelector } from '@/components'
import type { Product, Size, CartProduct  } from '@/interfaces';
import { useCartStore } from '@/store';
import React, { useState } from 'react'


interface Props {
    product: Product;
}

export const AddToCart = ({product}: Props) => {
    const addProductToCart = useCartStore( state => state.addProductTocart);


    const [size, setside] =useState<Size | undefined>();
    const [quantity, setquantity] =useState<number>(1);
    const [posted, setposted]= useState(false);

    // Sin tallas/opciones (ej. accesorios) se agrega directo al carrito
    const requiresSize = product.Size.length > 0;

    const addToCart = () =>{
        setposted(true);
        if (requiresSize && !size) return;

        const cartProduct : CartProduct = {
          id: product.id,
          slug: product.slug,
          title: product.title,
          price: product.price,
          quantity: quantity,
          size: size,
          image: product.images?.[0] 
        }


        addProductToCart(cartProduct)
        setposted(false);
        setquantity(1);
        setside (undefined);
    };

  return (
    <>
    {
        posted && requiresSize && !size && (
         <span className='mg-2 text-red-300'>
        Debe seleccionar una talla u opción
    </span>
        )
    }
    {/*  selector de tallas */}
       <SizeSelector 
        selectedSize={size}
       availableSize={product.Size }
       onSizeChanged={setside}
       
       />


      {/*  selector de cantidad */}
      <QuantitySelector  
      quantity={quantity}
      onQuantityChange={setquantity}/>


      {/* button */}
      <button 
      onClick={addToCart}
      className="btn-primary my-5">
        Agregar al carrito
      </button>
    
    </>
  )
}
