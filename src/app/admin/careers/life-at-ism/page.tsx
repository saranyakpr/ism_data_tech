
import type { Metadata } from "next";
import LifeAtISMManagement from "@/components/admin/LifeAtISMManagement";

export const metadata: Metadata = {
  title: "Life at ISM – Admin",
  description: "Manage Life at ISM gallery photos.",
  robots: { index: false, follow: false },
};

export default function AdminLifeAtISMPage() {
  return <LifeAtISMManagement />;
}
