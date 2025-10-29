import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { UsersHeader } from "@/components/users/UsersHeader";
import { UsersTable } from "@/components/users/UsersTable";

export default function UsersPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-8 space-y-6">
          <UsersHeader />
          <UsersTable />
        </main>
      </div>
    </div>
  );
}
