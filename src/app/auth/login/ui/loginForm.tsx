"use client";
import React, { useEffect } from 'react'
import Link from 'next/link';
import { useActionState } from 'react';
import { authenticate } from '@/actions/auth/login';
import { useSearchParams } from 'next/navigation';
import { IoInformationOutline } from 'react-icons/io5';
import { useSession } from "next-auth/react";

 

export const LoginForm = () => {
  
    const searchParams = useSearchParams();
    const { status } = useSession();
    const [errorMessage, formAction, isPending] = useActionState(
authenticate,undefined);



      
useEffect(() => {
  if ( status === "authenticated") {
    window.location.replace('/');
  
  }
}, [status]);



  return (
    <form action={formAction} className="space-y-3">  
      <div className="flex flex-col">

        <label htmlFor="email">Correo electrónico</label>
        <input
          className="px-5 py-2 border bg-gray-200 rounded mb-5"
          id='email'
          name='email'
          type="email"
          autoComplete="email" />


        <label htmlFor="password">Contraseña</label>
        <input
          className="px-5 py-2 border bg-gray-200 rounded mb-5"
          id='password'
          name='password'
          type="password"
          autoComplete="current-password" />

         {errorMessage && (
            <div  className='flex flex-row mg-2'>
              <IoInformationOutline className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{errorMessage}</p>
            </div>
          )}

        <button type='submit'
          disabled={isPending}
          className="btn-primary disabled:opacity-50">
          {isPending ? 'Ingresando...' : 'Ingresar'}

        </button>


        {/* divisor l ine */ }
        <div className="flex items-center my-5">
          <div className="flex-1 border-t border-gray-500"></div>
          <div className="px-2 text-gray-800">O</div>
          <div className="flex-1 border-t border-gray-500"></div>
        </div>

        <Link type='submit'
          href="/auth/new-account" 
          className="btn-secondary text-center">
          Crear una nueva cuenta
        </Link>

      </div>
    </form>
  )
}
