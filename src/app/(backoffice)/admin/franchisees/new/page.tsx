import FranchiseeForm from '@/components/admin/FranchiseeForm';

export const metadata = {
  title: 'Nuevo Franquiciado | Admin Carrefour',
  description: 'Crear el acceso inicial de un franquiciado',
};

export default function NewFranchiseePage() {
  return <FranchiseeForm mode="create" />;
}
