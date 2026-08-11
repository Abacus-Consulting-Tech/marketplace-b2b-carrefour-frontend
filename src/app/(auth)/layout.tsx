import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <Image
            src="/images/logo-express-franquicias-inicio_20180820_tcm5-49264.png.webp"
            alt="Carrefour Express"
            width={180}
            height={64}
            className="object-contain mb-3"
            priority
          />
          <p className="text-gray-600 dark:text-gray-400">
            Marketplace para Franquiciados y Proveedores
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
