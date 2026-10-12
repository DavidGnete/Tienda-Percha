import { Size } from '@/interfaces'
import clsx from 'clsx';
import React from 'react'

interface Props {
    selectedSize?: Size;
    availableSize: Size[];

    onSizeChanged: (size: Size) => void;
}

export const SizeSelector = ({selectedSize, availableSize, onSizeChanged }:Props ) => {

  // Productos sin tallas/opciones (accesorios, etc.) no muestran selector
  if (availableSize.length === 0) return null;

  return (
    <div className='my-5'>
    <h3 className='font-bold mb-4'>Tallas / opciones disponibles</h3>

    <div className='flex flex-wrap gap-2'>

        {
            availableSize.map( size => (
                <button
                key={size}
                type='button'
                onClick={() => onSizeChanged(size)}
                className={
                    clsx(
                        'px-3 py-1 border rounded-md text-lg cursor-pointer transition-all',
                        {
                            'bg-blue-500 text-white border-blue-500': size === selectedSize,
                            'hover:bg-gray-100': size !== selectedSize,
                        }
                    )
                }
                >
                {size}
                </button>
            ))
        }

    </div>


    </div>
  )
}
