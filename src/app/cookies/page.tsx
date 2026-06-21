import type { Metadata } from "next";
import { PolicyPage } from "@/components/PolicyPage";
import { policies } from "@/lib/policies";

export const metadata: Metadata = {
  title: policies.cookies.metadataTitle,
  description: policies.cookies.description,
  alternates: {
    canonical: policies.cookies.href
  }
};

export default function CookiesPage() {
  return <PolicyPage policy={policies.cookies} />;
}
