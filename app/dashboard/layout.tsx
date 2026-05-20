import { Metadata } from "next";
import DashboardShell from "./DashboardShell";

/**
 * Dashboard Layout — Server Component with metadata
 * Contains DashboardShell (Client Component) for interactive UI
 */

export const metadata: Metadata = {
  title: {
    default: "لوحة التحكم",
    template: "%s | لوحة التحكم",
  },
  description: "لوحة تحكم مسوقي التسويق بالعمولة — إحصائيات، روابط، وعمولات",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell>{children}</DashboardShell>;
}