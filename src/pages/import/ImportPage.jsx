import { Header } from "@/components/Header";
import { ImportReceiptForm } from "@/components/import/ImportReceiptForm";
import { Sidebar } from "@/components/Sidebar";

export default function ImportPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold text-foreground">
                Tạo phiếu nhập kho
              </h1>
              <p className="text-muted-foreground">
                Nhập thông tin phiếu nhập thuốc mới
              </p>
            </div>
            <ImportReceiptForm />
          </div>
        </main>
      </div>
    </div>
  );
}
