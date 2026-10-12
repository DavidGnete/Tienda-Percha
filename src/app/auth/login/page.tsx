import { titleFont } from '@/config/fonts';
import Link from 'next/link';
import { LoginForm } from './ui/loginForm';


export default function () {
  return (
    <div className="flex flex-col min-h-screen pt-16 sm:pt-52">

      <Link href="/" className="text-sm underline mb-10 w-fit">
        ← Volver a la tienda
      </Link>

      <h1 className={ `${ titleFont.className } text-4xl mb-5` }>Ingresar</h1>
      <LoginForm />
    </div>
  );
}