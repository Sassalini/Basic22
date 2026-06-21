import type { Metadata } from "next";
import { PolicyPage } from "@/components/PolicyPage";
import { policies } from "@/lib/policies";

export const metadata: Metadata = {
  title: policies.communityStandards.metadataTitle,
  description: policies.communityStandards.description,
  alternates: {
    canonical: policies.communityStandards.href
  }
};

export default function CommunityStandardsPage() {
  return <PolicyPage policy={policies.communityStandards} />;
}
