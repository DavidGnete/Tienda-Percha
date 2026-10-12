"use client";
import { getProductBySlug, getStockBySlug } from '@/actions';

import { titleFont } from '@/config/fonts'
import React, { useEffect, useState } from 'react'

interface Props {
    slug: string;
}

export const StockLabel = ( {slug}: Props) => {

  const [Stock, setStock] = useState(0)
  const [isloading, setisloading] = useState(true)
  


  useEffect( () => {
    getStock();
  }, [])

  const getStock = async() => {
    const inStock= await getStockBySlug(slug);
    setStock(inStock)
    setisloading(false);
  }

    
  return (
    <>
    {
      isloading ? (

            <h1 className={`${titleFont.className} antialiased font-bold text-lg bg-gray-200 animate-pulse`} >
            &nbsp;
    </h1>
      ) :(
    Stock > 0 && (
    <p className={`${titleFont.className} antialiased font-bold text-sm text-gray-600`} >
              Disponibles: { Stock}
    </p>
    )

      )
    }    
    </>
  )
}
