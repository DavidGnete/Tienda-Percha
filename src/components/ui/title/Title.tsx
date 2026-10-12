import { titleFont } from '@/config/fonts';
import React from 'react'

interface Props {
    title?:string;
    subtitle?:string;
    className?: string;
}

export const Title = ({title, subtitle, className}:Props ) => {
  return (
    <div className={`flex justify-center text-center px-4 mt-6 sm:mt-10 mb-0 ${className}`}>
    <h1 className={`${titleFont.className} antialiased text-2xl sm:text-4xl font-semibold my-6 sm:my-10`}>
        {title}
    </h1>

    {
        subtitle && (
            <h3 className="text-xl mb-0 ">{subtitle} </h3>
            
        )
        
    }
    </div>
  )
}
