import { auth } from "@/auth.config";
import { redirect } from "next/navigation";

// Protege todas las páginas bajo /admin: solo usuarios con rol admin.
// Las acciones del servidor (crear, editar, borrar) validan el rol por su cuenta,
// porque se pueden llamar directamente sin pasar por estas páginas.
export default async function AdminLayout({children}: {
  children: React.ReactNode;
}) {

  const session = await auth();

  if ( !session?.user ) {
    redirect('/auth/login');
  }

  if ( session.user.role !== 'admin' ) {
    redirect('/');
  }

  return <>{children}</>;
}
