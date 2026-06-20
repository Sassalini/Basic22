import type { Metadata } from "next";
import { PolicyPage } from "@/components/PolicyPage";
import { policies } from "@/lib/policies";

export const metadata: Metadata = {
  title: policies.terms.metadataTitle,
  description: policies.terms.description
};

export default function TermsPage() {
  return <PolicyPage policy={policies.terms} />;
}
