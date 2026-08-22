import { redirect } from "next/navigation";

export default function ProductsPage() {
  // Redirect to main marketplace page which has the full catalog
  redirect("/marketplace");
}
