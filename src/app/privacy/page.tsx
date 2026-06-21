import type { Metadata } from "next";
import { PolicyPage } from "@/components/PolicyPage";
import { policies } from "@/lib/policies";

export const metadata: Metadata = {
  title: policies.privacy.metadataTitle,
  description: policies.privacy.description,
  alternates: {
    canonical: policies.privacy.href
  }
};

export default function PrivacyPage() {
  return <PolicyPage policy={policies.privacy} />;
}
