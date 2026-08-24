import FranchiseeDetail from '@/components/admin/FranchiseeDetail';

export const metadata = {
  title: 'Detalles del Franquiciado | Admin Carrefour B2B',
  description: 'Ver detalles completos del franquiciado',
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function FranchiseeDetailPage({ params }: Props) {
  const { id } = await params;
  return <FranchiseeDetail franchiseeId={id} />;
}
