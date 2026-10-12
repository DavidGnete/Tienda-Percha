"use client";
import { Product } from '@/interfaces'
import React, { useState } from 'react'
import Image from 'next/image';
import Link from 'next/link';
import { ImageProducts } from '@/components/product/product-image/productImage';
import { CurrencyFormat } from '@/utils';

interface Props {
    product : Product;
}

export const ProductGridItem = ({ product}: Props ) => {
    const [displayImages, setdisplayImages] = useState<string>(product.images?.[0] ?? '');


  return (
    <div className="rounded-md overflow-hidden fade-in">  
        <Link  href={`/product/${product.slug}`}>    
    <div className='relative w-full aspect-square overflow-hidden rounded'>
        <ImageProducts
        src={displayImages}
        alt={product.title}
        className="object-cover rounded w-full h-full"
        width={500}
        height={500}
        onMouseEnter={ () => setdisplayImages(product.images?.[1] ?? '' )}
        onMouseLeave={ () => setdisplayImages(product.images?.[0] ?? '')}
        ></ImageProducts>
        
        </div>
        </Link>
        

        <div className='py-2 px-1 sm:p-4 flex flex-col '>
            <Link
            className='hover:text-blue-700 text-sm sm:text-base line-clamp-2'
            href={`/product/${product.slug}`}>
            {product.title}
            </Link>
            <span className='font-bold'>{CurrencyFormat(product.price)}</span>

        </div>
    </div>
  )
}

