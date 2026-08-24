import FranchiseesList from '@/components/admin/FranchiseesList';

export const metadata = {
  title: 'Gestión de Franquiciados | Admin Carrefour B2B',
  description: 'Administra los franquiciados del marketplace B2B de Carrefour',
};

export default function AdminFranchiseesPage() {
  return <FranchiseesList />;
}
