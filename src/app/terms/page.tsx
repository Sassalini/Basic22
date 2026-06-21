import type { Metadata } from "next";
import { PolicyPage } from "@/components/PolicyPage";
import { policies } from "@/lib/policies";

export const metadata: Metadata = {
  title: policies.terms.metadataTitle,
  description: policies.terms.description,
  alternates: {
    canonical: policies.terms.href
  }
};

export default function TermsPage() {
  return <PolicyPage policy={policies.terms} />;
}
