import { CategoriesHeader } from "@/components/categories/CategoriesHeader";
import { CategoriesTable } from "@/components/categories/CategoriesTable";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";

export default function CategoriesPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-8 space-y-6">
          <CategoriesHeader />
          <CategoriesTable />
        </main>
      </div>
    </div>
  );
}
