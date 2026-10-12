import { Footer, Sidebar, TopMenu} from "@/components";
import { MovilMenu } from "@/components/ui/top-menu/MovilMenu";
import { AnuncioModal } from "./modal/AnuncioModal";

export default function ShopLayout({children}: {
 children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen ">
      {/* <AnuncioModal /> */}
      <TopMenu />
      <Sidebar />
      <MovilMenu />
      <div className="px-0 sm:px-10">
        {children}
      </div>
      <Footer />
    </main>
  );
}