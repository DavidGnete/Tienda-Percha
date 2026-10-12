import { titleFont } from '@/config/fonts'
import Link from 'next/link'
import React from 'react'
import { WHATSAPP_NUMBER } from '@/config/whatsapp'

export const Footer = () => {
  return (
    <footer className='flex flex-wrap w-full justify-center items-center gap-x-4 gap-y-2 px-4 py-8 text-xs'>

        <Link href="/">
        <span className={`${titleFont.className} antialiased font-bold`}>Tu Perchita</span>
        <span> © { new Date().getFullYear() }</span>
        </Link>

        <a
        href={`https://wa.me/${WHATSAPP_NUMBER}`}
        target='_blank'
        rel='noopener noreferrer'
        className='font-bold'
        >
            Escríbenos por WhatsApp
        </a>

    </footer>
  )
}
