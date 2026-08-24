import FranchiseeForm from '@/components/admin/FranchiseeForm';

export const metadata = {
  title: 'Nuevo Franquiciado | Admin Carrefour B2B',
  description: 'Crear un nuevo franquiciado en el marketplace B2B',
};

export default function NewFranchiseePage() {
  return <FranchiseeForm mode="create" />;
}
