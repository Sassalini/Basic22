export type PolicyBlock =
  | {
      type: "heading";
      text: string;
    }
  | {
      type: "paragraph";
      text: string;
    }
  | {
      type: "list";
      items: readonly string[];
    };

export type Policy = {
  title: string;
  label: string;
  href: string;
  metadataTitle: string;
  description: string;
  updated: string;
  blocks: readonly PolicyBlock[];
};

export const policyOrder = [
  "privacy",
  "terms",
  "communityStandards",
  "cookies"
] as const;

export const policies = {
  "privacy": {
    "title": "Privacy Policy",
    "label": "Privacy Policy",
    "href": "/privacy",
    "metadataTitle": "Privacy Policy | Basic22",
    "description": "How Basic22 collects, uses, stores, and protects personal information.",
    "updated": "17 June 2026",
    "blocks": [
      {
        "type": "heading",
        "text": "1. Introduction"
      },
      {
        "type": "paragraph",
        "text": "This Privacy Policy explains how CentrumDisce (\"we\", \"our\", \"us\") collects, uses, stores, shares and protects your personal information when you access or use Basic22.com (\"the Platform\"). We are committed to protecting your privacy and handling your personal information in accordance with applicable data protection laws, including:"
      },
      {
        "type": "list",
        "items": [
          "UK General Data Protection Regulation (UK GDPR)",
          "Data Protection Act 2018",
          "Privacy and Electronic Communications Regulations (PECR)"
        ]
      },
      {
        "type": "paragraph",
        "text": "Please read this Privacy Policy carefully before using the Platform."
      },
      {
        "type": "heading",
        "text": "2. Who We Are"
      },
      {
        "type": "paragraph",
        "text": "Basic22.com is operated by: CentrumDisce United Kingdom Email: centrumdisce@gmail.com For the purposes of applicable data protection legislation, CentrumDisce is the Data Controller responsible for determining how and why your personal information is processed."
      },
      {
        "type": "heading",
        "text": "3. Scope of This Policy"
      },
      {
        "type": "paragraph",
        "text": "This Privacy Policy applies to:"
      },
      {
        "type": "list",
        "items": [
          "Basic22.com",
          "Any associated subdomains operated by CentrumDisce",
          "User accounts created through the Platform",
          "Services and features provided through Basic22.com"
        ]
      },
      {
        "type": "paragraph",
        "text": "This Privacy Policy does not apply to third-party websites, services or applications that may be linked from our Platform."
      },
      {
        "type": "heading",
        "text": "4. Information We Collect"
      },
      {
        "type": "heading",
        "text": "Information You Provide"
      },
      {
        "type": "paragraph",
        "text": "When you create an account or use the Platform, you may provide:"
      },
      {
        "type": "list",
        "items": [
          "Username",
          "Email address",
          "Password",
          "Profile information",
          "Biographical information",
          "Content you publish",
          "Comments",
          "Messages",
          "Reports submitted to moderators",
          "Communications with support"
        ]
      },
      {
        "type": "paragraph",
        "text": "You may choose to provide additional information through profile settings or user-generated content."
      },
      {
        "type": "heading",
        "text": "Information Collected Automatically"
      },
      {
        "type": "paragraph",
        "text": "When you access the Platform, we may automatically collect:"
      },
      {
        "type": "list",
        "items": [
          "IP address",
          "Browser type and version",
          "Device information",
          "Operating system",
          "Language preferences",
          "Referring URLs",
          "Date and time of access",
          "Pages viewed",
          "Usage statistics",
          "Security logs"
        ]
      },
      {
        "type": "paragraph",
        "text": "Analytics Information We use Google Analytics to understand how users interact with the Platform. Analytics data may include:"
      },
      {
        "type": "list",
        "items": [
          "Session duration",
          "Page visits",
          "Navigation paths",
          "Device type",
          "Geographic region (approximate)",
          "Traffic sources"
        ]
      },
      {
        "type": "paragraph",
        "text": "Analytics data is used in aggregate form to improve the Platform. Advertising Information We use Google AdSense to display advertisements. Google and its partners may use cookies or similar technologies to deliver and measure advertisements. The information collected is governed by Google's own privacy policies and consent mechanisms."
      },
      {
        "type": "heading",
        "text": "5. Information We Do Not Collect"
      },
      {
        "type": "paragraph",
        "text": "We do not intentionally collect:"
      },
      {
        "type": "list",
        "items": [
          "Payment card information",
          "Banking information",
          "Government-issued identification documents",
          "Biometric information",
          "Sensitive health information"
        ]
      },
      {
        "type": "paragraph",
        "text": "Users should avoid publishing sensitive personal information publicly through posts, comments or profile fields."
      },
      {
        "type": "heading",
        "text": "6. How We Collect Information"
      },
      {
        "type": "paragraph",
        "text": "We collect information when:"
      },
      {
        "type": "list",
        "items": [
          "You create an account",
          "You update your profile",
          "You publish content",
          "You submit comments",
          "You contact us",
          "You report content",
          "You interact with Platform features",
          "You browse the Platform",
          "Cookies and analytics technologies operate on your device"
        ]
      },
      {
        "type": "heading",
        "text": "7. How We Use Your Information"
      },
      {
        "type": "paragraph",
        "text": "We use personal information to: Provide Services"
      },
      {
        "type": "list",
        "items": [
          "Create user accounts",
          "Authenticate users",
          "Operate Platform features",
          "Display user-generated content"
        ]
      },
      {
        "type": "paragraph",
        "text": "Improve the Platform"
      },
      {
        "type": "list",
        "items": [
          "Analyse usage patterns",
          "Improve performance",
          "Fix technical issues",
          "Develop new features"
        ]
      },
      {
        "type": "paragraph",
        "text": "Security and Moderation"
      },
      {
        "type": "list",
        "items": [
          "Detect spam",
          "Prevent abuse",
          "Investigate suspicious activity",
          "Enforce community standards",
          "Protect user accounts"
        ]
      },
      {
        "type": "paragraph",
        "text": "Communications"
      },
      {
        "type": "list",
        "items": [
          "Respond to enquiries",
          "Provide support",
          "Send service-related notifications"
        ]
      },
      {
        "type": "paragraph",
        "text": "Legal Compliance"
      },
      {
        "type": "list",
        "items": [
          "Comply with applicable laws",
          "Respond to lawful requests",
          "Protect legal rights and interests"
        ]
      },
      {
        "type": "paragraph",
        "text": "Advertising"
      },
      {
        "type": "list",
        "items": [
          "Display advertisements through Google AdSense",
          "Measure advertising performance",
          "Manage consent preferences where required"
        ]
      },
      {
        "type": "paragraph",
        "text": "We do not sell personal information to third parties."
      },
      {
        "type": "heading",
        "text": "8. Legal Bases for Processing"
      },
      {
        "type": "paragraph",
        "text": "Under UK GDPR, we rely on one or more of the following lawful bases: Contract Processing necessary to provide services requested by users, including:"
      },
      {
        "type": "list",
        "items": [
          "Account creation",
          "User authentication",
          "Platform functionality"
        ]
      },
      {
        "type": "paragraph",
        "text": "Legitimate Interests Processing necessary for:"
      },
      {
        "type": "list",
        "items": [
          "Platform security",
          "Fraud prevention",
          "Service improvement",
          "Moderation",
          "Business administration"
        ]
      },
      {
        "type": "paragraph",
        "text": "We balance these interests against users' privacy rights. Legal Obligations Processing required to comply with legal obligations, court orders or regulatory requirements. Consent Where required by law, including certain cookies and advertising technologies, processing is based on user consent. Users may withdraw consent at any time through available controls."
      },
      {
        "type": "heading",
        "text": "9. User-Generated Content"
      },
      {
        "type": "paragraph",
        "text": "Basic22 is a social platform that allows users to publish content. Information voluntarily published by users may become visible to:"
      },
      {
        "type": "list",
        "items": [
          "Other users",
          "Search engines",
          "Members of the public"
        ]
      },
      {
        "type": "paragraph",
        "text": "Users remain responsible for information they choose to publish. Once information becomes publicly accessible, complete removal from third-party archives, search indexes or screenshots may not be possible."
      },
      {
        "type": "heading",
        "text": "10. Account Security"
      },
      {
        "type": "paragraph",
        "text": "Users are responsible for:"
      },
      {
        "type": "list",
        "items": [
          "Maintaining password confidentiality",
          "Securing access to their devices",
          "Preventing unauthorised account access"
        ]
      },
      {
        "type": "paragraph",
        "text": "We recommend:"
      },
      {
        "type": "list",
        "items": [
          "Strong passwords",
          "Unique credentials",
          "Multi-device security practices"
        ]
      },
      {
        "type": "paragraph",
        "text": "Users must notify us immediately if they believe their account has been compromised."
      },
      {
        "type": "heading",
        "text": "11. Sharing Information"
      },
      {
        "type": "paragraph",
        "text": "We may share information with trusted service providers where necessary to operate the Platform. These may include: Hosting and Infrastructure Providers Including services used for:"
      },
      {
        "type": "list",
        "items": [
          "Website hosting",
          "Data storage",
          "Database management",
          "Authentication services"
        ]
      },
      {
        "type": "paragraph",
        "text": "Supabase We use Supabase to provide database, authentication and infrastructure services. Analytics Providers Google Analytics processes certain usage information to help us understand Platform performance. Advertising Providers Google AdSense may process information necessary to display advertisements and measure advertising performance. Professional Advisers Including:"
      },
      {
        "type": "list",
        "items": [
          "Legal advisers",
          "Accountants",
          "Security consultants"
        ]
      },
      {
        "type": "paragraph",
        "text": "Authorities Where required by law, regulation or lawful request. We do not sell user data."
      },
      {
        "type": "heading",
        "text": "12. International Transfers"
      },
      {
        "type": "paragraph",
        "text": "Some service providers may process information outside the United Kingdom. Where international transfers occur, we take reasonable steps to ensure appropriate safeguards exist, including:"
      },
      {
        "type": "list",
        "items": [
          "Adequacy regulations",
          "Standard Contractual Clauses",
          "Equivalent legal protection mechanisms"
        ]
      },
      {
        "type": "paragraph",
        "text": "We seek to ensure transferred information receives a level of protection comparable to that required under UK law."
      },
      {
        "type": "heading",
        "text": "13. Data Retention"
      },
      {
        "type": "paragraph",
        "text": "We retain information only for as long as reasonably necessary. Retention periods may vary depending on the purpose of processing. Examples include: Account Information Retained while an account remains active. Security Logs Typically retained for security and abuse prevention purposes. Support Communications Retained for customer service and dispute resolution. Legal Records Retained as required by law. Where possible, information is deleted, anonymised or aggregated when no longer required."
      },
      {
        "type": "heading",
        "text": "14. Data Security"
      },
      {
        "type": "paragraph",
        "text": "We implement reasonable technical and organisational measures designed to protect information from:"
      },
      {
        "type": "list",
        "items": [
          "Unauthorised access",
          "Loss",
          "Misuse",
          "Disclosure",
          "Alteration",
          "Destruction"
        ]
      },
      {
        "type": "paragraph",
        "text": "Measures may include:"
      },
      {
        "type": "list",
        "items": [
          "Encrypted connections (HTTPS)",
          "Access controls",
          "Authentication systems",
          "Security monitoring",
          "Infrastructure protections"
        ]
      },
      {
        "type": "paragraph",
        "text": "No internet-based service can guarantee absolute security. Users acknowledge that information transmitted online carries inherent risks."
      },
      {
        "type": "heading",
        "text": "15. Children's Privacy"
      },
      {
        "type": "paragraph",
        "text": "Basic22 is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that such information has been collected, we may remove the information and terminate associated accounts. Parents or guardians who believe a child has provided personal information should contact us immediately."
      },
      {
        "type": "heading",
        "text": "16. Your Rights"
      },
      {
        "type": "paragraph",
        "text": "Subject to applicable law, users may have the right to: Access Request a copy of personal information we hold. Rectification Request correction of inaccurate information. Erasure Request deletion of personal information in certain circumstances. Restriction Request limitation of processing activities. Data Portability Receive certain information in a structured format. Objection Object to certain forms of processing. Withdraw Consent Withdraw consent where processing is based on consent. Requests may be submitted to: centrumdisce@gmail.com We may request reasonable verification of identity before responding."
      },
      {
        "type": "heading",
        "text": "17. Complaints"
      },
      {
        "type": "paragraph",
        "text": "If you believe we have not handled your information appropriately, please contact us first. You also have the right to lodge a complaint with the UK Information Commissioner's Office (ICO)."
      },
      {
        "type": "heading",
        "text": "18. Cookies and Similar Technologies"
      },
      {
        "type": "paragraph",
        "text": "Basic22 uses cookies and similar technologies for: Essential Functions Required for:"
      },
      {
        "type": "list",
        "items": [
          "Authentication",
          "Security",
          "Session management",
          "Site operation"
        ]
      },
      {
        "type": "paragraph",
        "text": "Analytics Used to understand:"
      },
      {
        "type": "list",
        "items": [
          "Visitor behaviour",
          "Site performance",
          "Usage trends"
        ]
      },
      {
        "type": "paragraph",
        "text": "Advertising Used by advertising providers including Google AdSense to display and measure advertisements. Users can manage cookie preferences through browser settings and consent tools where available. Disabling certain cookies may affect Platform functionality."
      },
      {
        "type": "heading",
        "text": "19. Third-Party Services"
      },
      {
        "type": "paragraph",
        "text": "The Platform may integrate with or rely upon third-party providers. These may include:"
      },
      {
        "type": "list",
        "items": [
          "Supabase",
          "Google Analytics",
          "Google AdSense",
          "Content delivery services",
          "Security services"
        ]
      },
      {
        "type": "paragraph",
        "text": "Third-party providers maintain their own privacy policies and practices. We are not responsible for the privacy practices of independent third parties."
      },
      {
        "type": "heading",
        "text": "20. Business Transfers"
      },
      {
        "type": "paragraph",
        "text": "If CentrumDisce undergoes:"
      },
      {
        "type": "list",
        "items": [
          "Merger",
          "Acquisition",
          "Sale of assets",
          "Corporate restructuring"
        ]
      },
      {
        "type": "paragraph",
        "text": "Personal information may be transferred as part of that transaction. Any successor organisation will be required to continue protecting personal information in accordance with applicable law."
      },
      {
        "type": "heading",
        "text": "21. Changes to This Privacy Policy"
      },
      {
        "type": "paragraph",
        "text": "We may update this Privacy Policy periodically. Material changes may be communicated through:"
      },
      {
        "type": "list",
        "items": [
          "Website notices",
          "Account notifications",
          "Other reasonable methods"
        ]
      },
      {
        "type": "paragraph",
        "text": "The latest version will always be available on Basic22.com. Continued use of the Platform after changes become effective constitutes acceptance of the updated Privacy Policy."
      },
      {
        "type": "heading",
        "text": "22. Contact Information"
      },
      {
        "type": "paragraph",
        "text": "Questions regarding this Privacy Policy may be directed to: CentrumDisce Email: centrumdisce@gmail.com Basic22.com United Kingdom"
      }
    ]
  },
  "terms": {
    "title": "Terms of Service",
    "label": "Terms of Service",
    "href": "/terms",
    "metadataTitle": "Terms of Service | Basic22",
    "description": "The terms that apply when using Basic22.",
    "updated": "17 June 2026",
    "blocks": [
      {
        "type": "heading",
        "text": "1. Introduction"
      },
      {
        "type": "paragraph",
        "text": "Welcome to Basic22.com (\"Basic22\", \"the Platform\"). These Terms of Service (\"Terms\") form a legally binding agreement between you and CentrumDisce (\"we\", \"us\", \"our\") regarding your access to and use of Basic22.com and any related services. By creating an account, accessing, or using the Platform, you agree to these Terms. If you do not agree to these Terms, you must not use the Platform."
      },
      {
        "type": "heading",
        "text": "2. Service Provider"
      },
      {
        "type": "paragraph",
        "text": "Basic22 is operated by: CentrumDisce United Kingdom Contact: centrumdisce@gmail.com"
      },
      {
        "type": "heading",
        "text": "3. Description of the Service"
      },
      {
        "type": "paragraph",
        "text": "Basic22 is a social platform that enables users to:"
      },
      {
        "type": "list",
        "items": [
          "Create accounts",
          "Publish content",
          "Interact with other users",
          "Share information and opinions",
          "Participate in communities",
          "Communicate through platform features"
        ]
      },
      {
        "type": "paragraph",
        "text": "We reserve the right to modify, suspend, remove, or discontinue any feature of the Platform at any time."
      },
      {
        "type": "heading",
        "text": "4. Eligibility"
      },
      {
        "type": "paragraph",
        "text": "You must be at least 13 years old to use Basic22. If you are under 18, you confirm that you have permission from a parent or legal guardian to use the Platform. By using Basic22, you represent that:"
      },
      {
        "type": "list",
        "items": [
          "You can legally enter into agreements.",
          "Information you provide is accurate.",
          "You will comply with these Terms."
        ]
      },
      {
        "type": "heading",
        "text": "5. Account Registration"
      },
      {
        "type": "paragraph",
        "text": "Certain features require an account. You agree to:"
      },
      {
        "type": "list",
        "items": [
          "Provide accurate information.",
          "Keep account information current.",
          "Keep your password confidential.",
          "Accept responsibility for activity conducted through your account."
        ]
      },
      {
        "type": "paragraph",
        "text": "You may not:"
      },
      {
        "type": "list",
        "items": [
          "Create accounts using false identities.",
          "Impersonate another person.",
          "Transfer accounts without permission.",
          "Share accounts with others."
        ]
      },
      {
        "type": "paragraph",
        "text": "We may require verification where necessary."
      },
      {
        "type": "heading",
        "text": "6. User Content"
      },
      {
        "type": "paragraph",
        "text": "\"User Content\" means any material you publish, upload, submit, post, transmit or otherwise make available through the Platform, including:"
      },
      {
        "type": "list",
        "items": [
          "Posts",
          "Comments",
          "Images",
          "Videos",
          "Messages",
          "Profile information",
          "Usernames"
        ]
      },
      {
        "type": "paragraph",
        "text": "You retain ownership of your User Content. You are solely responsible for anything you publish."
      },
      {
        "type": "heading",
        "text": "7. Content Licence"
      },
      {
        "type": "paragraph",
        "text": "By posting content to Basic22, you grant CentrumDisce a worldwide, non-exclusive, royalty-free licence to:"
      },
      {
        "type": "list",
        "items": [
          "Store",
          "Host",
          "Display",
          "Reproduce",
          "Modify",
          "Distribute",
          "Adapt",
          "Format"
        ]
      },
      {
        "type": "paragraph",
        "text": "your content solely for the purpose of operating, securing, improving and promoting the Platform. This licence ends when content is permanently removed, except where:"
      },
      {
        "type": "list",
        "items": [
          "Legal retention is required.",
          "Copies remain in backups.",
          "Other users have already shared or quoted content.",
          "Removal is technically impractical for archived systems."
        ]
      },
      {
        "type": "heading",
        "text": "8. Acceptable Use"
      },
      {
        "type": "paragraph",
        "text": "You agree not to use Basic22 to: Illegal Activity"
      },
      {
        "type": "list",
        "items": [
          "Break any law.",
          "Facilitate criminal activity.",
          "Promote illegal conduct."
        ]
      },
      {
        "type": "paragraph",
        "text": "Harassment"
      },
      {
        "type": "list",
        "items": [
          "Threaten users.",
          "Harass individuals.",
          "Encourage abuse.",
          "Conduct targeted harassment campaigns."
        ]
      },
      {
        "type": "paragraph",
        "text": "Fraud"
      },
      {
        "type": "list",
        "items": [
          "Scam users.",
          "Misrepresent identities.",
          "Conduct phishing attacks.",
          "Collect credentials."
        ]
      },
      {
        "type": "paragraph",
        "text": "Spam"
      },
      {
        "type": "list",
        "items": [
          "Send unsolicited promotions.",
          "Mass-message users.",
          "Operate spam networks."
        ]
      },
      {
        "type": "paragraph",
        "text": "Malicious Activity"
      },
      {
        "type": "list",
        "items": [
          "Upload malware.",
          "Attempt unauthorised access.",
          "Interfere with systems.",
          "Circumvent security measures."
        ]
      },
      {
        "type": "paragraph",
        "text": "Harmful Content"
      },
      {
        "type": "list",
        "items": [
          "Publish content intended to cause harm.",
          "Promote violence.",
          "Incite criminal acts."
        ]
      },
      {
        "type": "paragraph",
        "text": "Platform Manipulation"
      },
      {
        "type": "list",
        "items": [
          "Artificially inflate engagement.",
          "Use bots without permission.",
          "Manipulate platform metrics."
        ]
      },
      {
        "type": "heading",
        "text": "9. Community Standards"
      },
      {
        "type": "paragraph",
        "text": "We want Basic22 to remain usable and constructive. We may remove content that:"
      },
      {
        "type": "list",
        "items": [
          "Violates these Terms.",
          "Violates applicable law.",
          "Harasses others.",
          "Promotes scams.",
          "Contains malware.",
          "Threatens platform integrity.",
          "Creates significant risk to users."
        ]
      },
      {
        "type": "paragraph",
        "text": "Not all moderation decisions will be publicly explained."
      },
      {
        "type": "heading",
        "text": "10. Content Moderation"
      },
      {
        "type": "paragraph",
        "text": "We reserve the right to:"
      },
      {
        "type": "list",
        "items": [
          "Review content.",
          "Restrict visibility.",
          "Add warnings.",
          "Remove content.",
          "Suspend accounts.",
          "Terminate accounts."
        ]
      },
      {
        "type": "paragraph",
        "text": "Moderation decisions may be made:"
      },
      {
        "type": "list",
        "items": [
          "By human review.",
          "Through automated systems.",
          "Through user reports."
        ]
      },
      {
        "type": "paragraph",
        "text": "We are not obligated to host any particular content."
      },
      {
        "type": "heading",
        "text": "11. Reporting Violations"
      },
      {
        "type": "paragraph",
        "text": "Users may report:"
      },
      {
        "type": "list",
        "items": [
          "Illegal content",
          "Copyright infringement",
          "Harassment",
          "Spam",
          "Security concerns"
        ]
      },
      {
        "type": "paragraph",
        "text": "Submitting knowingly false reports may itself constitute a violation of these Terms."
      },
      {
        "type": "heading",
        "text": "12. Intellectual Property"
      },
      {
        "type": "paragraph",
        "text": "The Platform, including its design, branding, software and systems, is owned by CentrumDisce or its licensors. Nothing in these Terms transfers ownership of intellectual property rights. You may not:"
      },
      {
        "type": "list",
        "items": [
          "Copy Platform software.",
          "Reverse engineer services.",
          "Remove copyright notices.",
          "Reproduce substantial portions of the Platform."
        ]
      },
      {
        "type": "paragraph",
        "text": "Except where permitted by law."
      },
      {
        "type": "heading",
        "text": "13. Copyright Complaints"
      },
      {
        "type": "paragraph",
        "text": "If you believe content infringes your copyright, contact: centrumdisce@gmail.com Please include:"
      },
      {
        "type": "list",
        "items": [
          "Identification of the work.",
          "Location of the content.",
          "Evidence of ownership.",
          "Contact details."
        ]
      },
      {
        "type": "paragraph",
        "text": "We may remove content while investigating complaints. Repeat infringers may have accounts terminated."
      },
      {
        "type": "heading",
        "text": "14. Third-Party Services"
      },
      {
        "type": "paragraph",
        "text": "Basic22 may use third-party services including:"
      },
      {
        "type": "list",
        "items": [
          "Supabase",
          "Google Analytics",
          "Google AdSense",
          "Infrastructure providers",
          "Security providers"
        ]
      },
      {
        "type": "paragraph",
        "text": "We are not responsible for third-party services or external websites linked through the Platform. Use of those services may be governed by separate terms."
      },
      {
        "type": "heading",
        "text": "15. Advertising"
      },
      {
        "type": "paragraph",
        "text": "Basic22 may display advertisements. Advertisements may appear:"
      },
      {
        "type": "list",
        "items": [
          "Alongside content",
          "Within feeds",
          "Throughout the Platform"
        ]
      },
      {
        "type": "paragraph",
        "text": "Users may not:"
      },
      {
        "type": "list",
        "items": [
          "Interfere with advertising systems.",
          "Manipulate advertising metrics.",
          "Circumvent technical measures used to deliver advertisements."
        ]
      },
      {
        "type": "paragraph",
        "text": "We make no guarantees regarding advertised products or services. Any transaction between a user and an advertiser is solely between those parties."
      },
      {
        "type": "heading",
        "text": "16. Availability of Service"
      },
      {
        "type": "paragraph",
        "text": "We aim to keep Basic22 available and functioning properly. However, we do not guarantee:"
      },
      {
        "type": "list",
        "items": [
          "Continuous availability.",
          "Error-free operation.",
          "Uninterrupted access.",
          "Permanent storage of content."
        ]
      },
      {
        "type": "paragraph",
        "text": "The Platform is provided on an \"as available\" basis. Maintenance, updates, outages and unforeseen issues may occur."
      },
      {
        "type": "heading",
        "text": "17. Account Suspension"
      },
      {
        "type": "paragraph",
        "text": "We may suspend accounts where we reasonably believe:"
      },
      {
        "type": "list",
        "items": [
          "These Terms have been breached.",
          "Platform security is at risk.",
          "Legal obligations require action.",
          "Fraudulent activity is occurring.",
          "User safety is threatened."
        ]
      },
      {
        "type": "paragraph",
        "text": "Suspension may be temporary or permanent."
      },
      {
        "type": "heading",
        "text": "18. Account Termination"
      },
      {
        "type": "paragraph",
        "text": "You may stop using Basic22 at any time. We may terminate access immediately if:"
      },
      {
        "type": "list",
        "items": [
          "Serious violations occur.",
          "Illegal activity is detected.",
          "Abuse continues after warnings.",
          "Platform integrity is threatened."
        ]
      },
      {
        "type": "paragraph",
        "text": "Termination decisions are made at our discretion."
      },
      {
        "type": "heading",
        "text": "19. Data and Privacy"
      },
      {
        "type": "paragraph",
        "text": "Your use of Basic22 is also governed by our Privacy Policy. The Privacy Policy explains:"
      },
      {
        "type": "list",
        "items": [
          "What information we collect.",
          "How information is processed.",
          "Your rights regarding personal data."
        ]
      },
      {
        "type": "paragraph",
        "text": "By using the Platform, you acknowledge that information may be processed as described in the Privacy Policy."
      },
      {
        "type": "heading",
        "text": "20. Disclaimers"
      },
      {
        "type": "paragraph",
        "text": "To the maximum extent permitted by law: Basic22 is provided \"as is\" and \"as available\". We do not guarantee:"
      },
      {
        "type": "list",
        "items": [
          "Accuracy of user content.",
          "Reliability of information.",
          "Suitability for any purpose.",
          "Continuous service availability."
        ]
      },
      {
        "type": "paragraph",
        "text": "User-generated content reflects the views of individual users and not CentrumDisce."
      },
      {
        "type": "heading",
        "text": "21. Limitation of Liability"
      },
      {
        "type": "paragraph",
        "text": "Nothing in these Terms excludes liability that cannot legally be excluded. To the maximum extent permitted by law, CentrumDisce shall not be liable for:"
      },
      {
        "type": "list",
        "items": [
          "Indirect losses.",
          "Consequential losses.",
          "Loss of profits.",
          "Loss of opportunity.",
          "Loss of reputation.",
          "Data loss.",
          "Service interruptions."
        ]
      },
      {
        "type": "paragraph",
        "text": "Where liability cannot be excluded, our aggregate liability shall not exceed \u00a3100 GBP or the amount paid by you to us during the previous 12 months, whichever is greater."
      },
      {
        "type": "heading",
        "text": "22. Indemnity"
      },
      {
        "type": "paragraph",
        "text": "You agree to indemnify and hold harmless CentrumDisce from claims, liabilities, damages and expenses arising from:"
      },
      {
        "type": "list",
        "items": [
          "Your use of the Platform.",
          "Your content.",
          "Your violation of these Terms.",
          "Your violation of applicable law."
        ]
      },
      {
        "type": "heading",
        "text": "23. Changes to the Service"
      },
      {
        "type": "paragraph",
        "text": "We may modify, suspend or discontinue:"
      },
      {
        "type": "list",
        "items": [
          "Features",
          "Functionality",
          "User interfaces",
          "Platform services"
        ]
      },
      {
        "type": "paragraph",
        "text": "at any time. We are not liable for changes made to the Platform."
      },
      {
        "type": "heading",
        "text": "24. Changes to These Terms"
      },
      {
        "type": "paragraph",
        "text": "We may update these Terms periodically. Material changes may be communicated through:"
      },
      {
        "type": "list",
        "items": [
          "Website notices",
          "Account notifications",
          "Other reasonable methods"
        ]
      },
      {
        "type": "paragraph",
        "text": "Continued use of Basic22 after changes become effective constitutes acceptance of the updated Terms."
      },
      {
        "type": "heading",
        "text": "25. Severability"
      },
      {
        "type": "paragraph",
        "text": "If any provision of these Terms is found unenforceable, the remaining provisions remain in full force and effect."
      },
      {
        "type": "heading",
        "text": "26. Entire Agreement"
      },
      {
        "type": "paragraph",
        "text": "These Terms, together with our Privacy Policy and any referenced policies, constitute the entire agreement between you and CentrumDisce regarding Basic22."
      },
      {
        "type": "heading",
        "text": "27. Governing Law"
      },
      {
        "type": "paragraph",
        "text": "These Terms shall be governed by the laws of England and Wales. Any dispute arising from or relating to these Terms shall be subject to the exclusive jurisdiction of the courts of England and Wales."
      },
      {
        "type": "heading",
        "text": "28. Contact"
      },
      {
        "type": "paragraph",
        "text": "Questions regarding these Terms may be sent to: CentrumDisce Email: centrumdisce@gmail.com Basic22.com United Kingdom"
      }
    ]
  },
  "communityStandards": {
    "title": "Community Standards & Acceptable Use Policy",
    "label": "Community Standards",
    "href": "/community-standards",
    "metadataTitle": "Community Standards | Basic22",
    "description": "The community standards and acceptable use rules for Basic22.",
    "updated": "17 June 2026",
    "blocks": [
      {
        "type": "heading",
        "text": "Introduction"
      },
      {
        "type": "paragraph",
        "text": "Basic22 is intended to be a platform for genuine people to communicate, share information, discuss ideas and participate in communities. These Community Standards explain what is and is not permitted on Basic22. All users must comply with:"
      },
      {
        "type": "list",
        "items": [
          "These Community Standards",
          "Our Terms of Service",
          "Applicable laws"
        ]
      },
      {
        "type": "paragraph",
        "text": "Violations may result in:"
      },
      {
        "type": "list",
        "items": [
          "Content removal",
          "Reduced visibility",
          "Feature restrictions",
          "Account suspension",
          "Permanent account termination",
          "Referral to law enforcement where required"
        ]
      },
      {
        "type": "paragraph",
        "text": "Our moderation decisions are made at our discretion and may be based on context, intent, severity, repetition, risk and user safety."
      },
      {
        "type": "heading",
        "text": "1. Follow the Law"
      },
      {
        "type": "paragraph",
        "text": "Users may not use Basic22 for unlawful activity. This includes, but is not limited to:"
      },
      {
        "type": "list",
        "items": [
          "Fraud",
          "Theft",
          "Identity theft",
          "Money laundering",
          "Criminal conspiracy",
          "Distribution of illegal material",
          "Sale of prohibited goods",
          "Circumvention of legal restrictions"
        ]
      },
      {
        "type": "paragraph",
        "text": "Content encouraging illegal conduct may be removed even where no crime has yet occurred."
      },
      {
        "type": "heading",
        "text": "2. Authentic Accounts"
      },
      {
        "type": "paragraph",
        "text": "Users must represent themselves honestly. You may not:"
      },
      {
        "type": "list",
        "items": [
          "Impersonate another person",
          "Impersonate a business",
          "Impersonate public figures",
          "Create misleading identities",
          "Pretend to be affiliated with organisations when you are not"
        ]
      },
      {
        "type": "paragraph",
        "text": "Parody, satire and roleplay accounts may be permitted where they are clearly identified and unlikely to mislead users."
      },
      {
        "type": "heading",
        "text": "3. Harassment and Abuse"
      },
      {
        "type": "paragraph",
        "text": "Basic22 does not permit targeted abuse. Users may not:"
      },
      {
        "type": "list",
        "items": [
          "Threaten violence",
          "Encourage self-harm",
          "Conduct harassment campaigns",
          "Encourage others to attack users",
          "Repeatedly target individuals",
          "Intimidate users",
          "Engage in stalking behaviour"
        ]
      },
      {
        "type": "paragraph",
        "text": "Disagreement, criticism, debate and strong opinions are permitted. Targeted harassment is not."
      },
      {
        "type": "heading",
        "text": "4. Hate and Discrimination"
      },
      {
        "type": "paragraph",
        "text": "Users may not attack, threaten, dehumanise or encourage discrimination against people based on protected characteristics. This includes:"
      },
      {
        "type": "list",
        "items": [
          "Race",
          "Ethnicity",
          "Nationality",
          "Disability",
          "Religion",
          "Sex",
          "Sexual orientation",
          "Gender identity",
          "Age"
        ]
      },
      {
        "type": "paragraph",
        "text": "Discussion of political, religious or social issues is permitted. Targeting individuals or groups with abuse based on protected characteristics is not."
      },
      {
        "type": "heading",
        "text": "5. Violent Content"
      },
      {
        "type": "paragraph",
        "text": "Content depicting violence may be removed where it:"
      },
      {
        "type": "list",
        "items": [
          "Glorifies violence",
          "Celebrates injury or death",
          "Encourages violence",
          "Promotes terrorist activity",
          "Encourages criminal harm"
        ]
      },
      {
        "type": "paragraph",
        "text": "Educational, documentary, historical or news-related discussion may be permitted where appropriate."
      },
      {
        "type": "heading",
        "text": "6. Self-Harm"
      },
      {
        "type": "paragraph",
        "text": "Users may not:"
      },
      {
        "type": "list",
        "items": [
          "Encourage suicide",
          "Encourage self-harm",
          "Promote eating disorders",
          "Promote dangerous challenges",
          "Share instructions intended to facilitate self-harm"
        ]
      },
      {
        "type": "paragraph",
        "text": "Content discussing recovery, prevention or support may be permitted."
      },
      {
        "type": "heading",
        "text": "7. Sexual Content"
      },
      {
        "type": "paragraph",
        "text": "Basic22 is not intended to host pornography. Users may not post:"
      },
      {
        "type": "list",
        "items": [
          "Pornographic material",
          "Explicit sexual content",
          "Sexual exploitation material",
          "Content involving minors",
          "Non-consensual sexual content"
        ]
      },
      {
        "type": "paragraph",
        "text": "Educational or medical discussion may be permitted where appropriate. Any content involving the sexual exploitation of minors will be removed immediately and may be reported to relevant authorities."
      },
      {
        "type": "heading",
        "text": "8. Spam and Platform Manipulation"
      },
      {
        "type": "paragraph",
        "text": "Users may not use Basic22 primarily for spam. This includes:"
      },
      {
        "type": "list",
        "items": [
          "Mass posting",
          "Automated spam",
          "Repetitive advertising",
          "Referral abuse",
          "Engagement farming",
          "Artificial amplification"
        ]
      },
      {
        "type": "paragraph",
        "text": "Users may not manipulate:"
      },
      {
        "type": "list",
        "items": [
          "Views",
          "Reactions",
          "Followers",
          "Trending systems",
          "Recommendations"
        ]
      },
      {
        "type": "heading",
        "text": "9. Scams and Deception"
      },
      {
        "type": "paragraph",
        "text": "Users may not engage in:"
      },
      {
        "type": "list",
        "items": [
          "Fraud",
          "Phishing",
          "Investment scams",
          "Fake giveaways",
          "Fake support services",
          "Deceptive schemes",
          "Financial impersonation"
        ]
      },
      {
        "type": "paragraph",
        "text": "We may remove content where there is a reasonable belief that users are being misled."
      },
      {
        "type": "heading",
        "text": "10. Misinformation"
      },
      {
        "type": "paragraph",
        "text": "Users are responsible for evaluating information they encounter online. Basic22 generally permits discussion, opinion, speculation and disagreement. However, we may remove content that presents demonstrably false information where it creates a substantial risk of:"
      },
      {
        "type": "list",
        "items": [
          "Physical harm",
          "Financial harm",
          "Public safety risks",
          "Criminal activity"
        ]
      },
      {
        "type": "paragraph",
        "text": "Moderation decisions may consider context, intent and potential consequences."
      },
      {
        "type": "heading",
        "text": "11. Privacy Violations"
      },
      {
        "type": "paragraph",
        "text": "Users must respect the privacy of others. You may not publish:"
      },
      {
        "type": "list",
        "items": [
          "Private addresses",
          "Phone numbers",
          "Personal email addresses",
          "Government identification numbers",
          "Financial information",
          "Private correspondence without permission"
        ]
      },
      {
        "type": "paragraph",
        "text": "\"Doxxing\" or publishing private information intended to harass or intimidate is prohibited."
      },
      {
        "type": "heading",
        "text": "12. Intellectual Property"
      },
      {
        "type": "paragraph",
        "text": "Users must respect intellectual property rights. You may not knowingly publish:"
      },
      {
        "type": "list",
        "items": [
          "Copyrighted material without permission",
          "Stolen content",
          "Unauthorised reproductions",
          "Pirated media"
        ]
      },
      {
        "type": "paragraph",
        "text": "If you believe your rights have been infringed, contact: centrumdisce@gmail.com"
      },
      {
        "type": "heading",
        "text": "13. Malicious Technical Activity"
      },
      {
        "type": "paragraph",
        "text": "Users may not:"
      },
      {
        "type": "list",
        "items": [
          "Upload malware",
          "Upload ransomware",
          "Distribute viruses",
          "Attempt account compromise",
          "Attack platform infrastructure",
          "Probe security systems",
          "Interfere with platform operation"
        ]
      },
      {
        "type": "paragraph",
        "text": "Security research conducted responsibly and disclosed privately may be treated differently."
      },
      {
        "type": "heading",
        "text": "14. Artificial Intelligence and Automated"
      },
      {
        "type": "paragraph",
        "text": "Systems Users may use AI-generated content. However:"
      },
      {
        "type": "list",
        "items": [
          "AI-generated content remains the responsibility of the user posting it.",
          "Users may not use AI to facilitate fraud, impersonation or abuse.",
          "Users may not use automation to manipulate platform systems."
        ]
      },
      {
        "type": "paragraph",
        "text": "We may require disclosure of AI-generated content in certain circumstances."
      },
      {
        "type": "heading",
        "text": "15. Advertising and Promotion"
      },
      {
        "type": "paragraph",
        "text": "Advertising is permitted only where allowed by the Platform. Users may not:"
      },
      {
        "type": "list",
        "items": [
          "Flood communities with advertisements",
          "Misrepresent products",
          "Operate deceptive promotions",
          "Hide sponsorships where disclosure is legally required"
        ]
      },
      {
        "type": "paragraph",
        "text": "Basic22 reserves the right to limit promotional activity."
      },
      {
        "type": "heading",
        "text": "16. Multiple Accounts and Ban Evasion"
      },
      {
        "type": "paragraph",
        "text": "Users may not create new accounts to evade:"
      },
      {
        "type": "list",
        "items": [
          "Suspensions",
          "Restrictions",
          "Content removals",
          "Enforcement actions"
        ]
      },
      {
        "type": "paragraph",
        "text": "Accounts connected to ban evasion may be removed without notice."
      },
      {
        "type": "heading",
        "text": "17. Community Moderation"
      },
      {
        "type": "paragraph",
        "text": "Moderators may take action including:"
      },
      {
        "type": "list",
        "items": [
          "Content removal",
          "Warnings",
          "Temporary restrictions",
          "Permanent restrictions"
        ]
      },
      {
        "type": "paragraph",
        "text": "Moderators may consider:"
      },
      {
        "type": "list",
        "items": [
          "Context",
          "Intent",
          "User history",
          "Severity",
          "Repetition"
        ]
      },
      {
        "type": "paragraph",
        "text": "Not every violation will result in immediate account removal. Not every violation will receive a warning first."
      },
      {
        "type": "heading",
        "text": "18. Reporting Violations"
      },
      {
        "type": "paragraph",
        "text": "Users are encouraged to report:"
      },
      {
        "type": "list",
        "items": [
          "Illegal content",
          "Spam",
          "Harassment",
          "Fraud",
          "Security concerns"
        ]
      },
      {
        "type": "paragraph",
        "text": "False or malicious reporting may itself result in enforcement action."
      },
      {
        "type": "heading",
        "text": "19. Enforcement Framework"
      },
      {
        "type": "paragraph",
        "text": "Violations may result in one or more of: Level 1 Minor violations Examples:"
      },
      {
        "type": "list",
        "items": [
          "Accidental spam",
          "Low-level disruption"
        ]
      },
      {
        "type": "paragraph",
        "text": "Possible actions:"
      },
      {
        "type": "list",
        "items": [
          "Warning",
          "Content removal"
        ]
      },
      {
        "type": "paragraph",
        "text": "Level 2 Repeated or significant violations Examples:"
      },
      {
        "type": "list",
        "items": [
          "Harassment",
          "Repeated spam",
          "Platform manipulation"
        ]
      },
      {
        "type": "paragraph",
        "text": "Possible actions:"
      },
      {
        "type": "list",
        "items": [
          "Temporary suspension",
          "Feature restrictions"
        ]
      },
      {
        "type": "paragraph",
        "text": "Level 3 Severe violations Examples:"
      },
      {
        "type": "list",
        "items": [
          "Fraud",
          "Doxxing",
          "Serious threats",
          "Illegal content",
          "Child exploitation material"
        ]
      },
      {
        "type": "paragraph",
        "text": "Possible actions:"
      },
      {
        "type": "list",
        "items": [
          "Immediate account termination",
          "Permanent bans",
          "Referral to law enforcement"
        ]
      },
      {
        "type": "heading",
        "text": "20. Appeals"
      },
      {
        "type": "paragraph",
        "text": "Users may appeal moderation decisions by contacting: centrumdisce@gmail.com Submitting an appeal does not guarantee reversal of a moderation decision."
      },
      {
        "type": "heading",
        "text": "21. Changes to These Standards"
      },
      {
        "type": "paragraph",
        "text": "We may update these Community Standards from time to time. Changes may be made to:"
      },
      {
        "type": "list",
        "items": [
          "Improve user safety",
          "Address new forms of abuse",
          "Comply with legal requirements",
          "Improve platform operation"
        ]
      },
      {
        "type": "paragraph",
        "text": "Continued use of Basic22 constitutes acceptance of the current version."
      },
      {
        "type": "heading",
        "text": "22. Contact"
      },
      {
        "type": "paragraph",
        "text": "Questions regarding these Community Standards may be directed to: CentrumDisce Email: centrumdisce@gmail.com Basic22.com United Kingdom"
      }
    ]
  },
  "cookies": {
    "title": "Cookie Policy",
    "label": "Cookie Policy",
    "href": "/cookies",
    "metadataTitle": "Cookie Policy | Basic22",
    "description": "How Basic22 uses cookies and similar technologies.",
    "updated": "17 June 2026",
    "blocks": [
      {
        "type": "heading",
        "text": "1. Introduction"
      },
      {
        "type": "paragraph",
        "text": "This Cookie Policy explains how Basic22.com (\"Basic22\", \"we\", \"us\", \"our\") uses cookies and similar technologies when you visit or use our website. This Cookie Policy should be read alongside our Privacy Policy. By using Basic22, you acknowledge that cookies and similar technologies may be used as described in this Policy."
      },
      {
        "type": "heading",
        "text": "2. What Are Cookies?"
      },
      {
        "type": "paragraph",
        "text": "Cookies are small text files stored on your device when you visit a website. Cookies help websites:"
      },
      {
        "type": "list",
        "items": [
          "Remember user preferences",
          "Keep users logged in",
          "Improve performance",
          "Analyse usage",
          "Deliver advertising",
          "Improve security"
        ]
      },
      {
        "type": "paragraph",
        "text": "Cookies may be set by Basic22 or by trusted third-party providers."
      },
      {
        "type": "heading",
        "text": "3. Types of Cookies We Use"
      },
      {
        "type": "heading",
        "text": "Essential Cookies"
      },
      {
        "type": "paragraph",
        "text": "These cookies are necessary for the operation of Basic22. Without these cookies, certain services may not function properly. Examples include:"
      },
      {
        "type": "list",
        "items": [
          "User authentication",
          "Session management",
          "Security protection",
          "Login functionality",
          "Account access",
          "Load balancing"
        ]
      },
      {
        "type": "paragraph",
        "text": "These cookies cannot normally be disabled through our systems because they are required for the Platform to function."
      },
      {
        "type": "heading",
        "text": "Analytics Cookies"
      },
      {
        "type": "paragraph",
        "text": "We use analytics technologies to understand how visitors interact with Basic22. Analytics cookies help us understand:"
      },
      {
        "type": "list",
        "items": [
          "Which pages are visited",
          "How users navigate the Platform",
          "Technical performance issues",
          "General usage trends"
        ]
      },
      {
        "type": "paragraph",
        "text": "We currently use:"
      },
      {
        "type": "list",
        "items": [
          "Google Analytics"
        ]
      },
      {
        "type": "paragraph",
        "text": "Analytics information is generally collected in aggregate form and helps us improve the Platform. Where required by law, analytics cookies are only used after obtaining appropriate consent. Advertising Cookies Basic22 displays advertising through advertising partners. Advertising cookies may be used to:"
      },
      {
        "type": "list",
        "items": [
          "Deliver advertisements",
          "Measure advertising performance",
          "Prevent advertising fraud",
          "Limit repetitive advertisements",
          "Improve advertising relevance"
        ]
      },
      {
        "type": "paragraph",
        "text": "Advertising technologies may be provided by:"
      },
      {
        "type": "list",
        "items": [
          "Google AdSense",
          "Google advertising partners"
        ]
      },
      {
        "type": "paragraph",
        "text": "Advertising providers may collect information according to their own privacy policies. Where required by law, advertising cookies will only be activated after consent has been provided. Functional Cookies Functional cookies help improve your experience on the Platform. They may remember:"
      },
      {
        "type": "list",
        "items": [
          "Language preferences",
          "Display settings",
          "Accessibility preferences",
          "User interface choices"
        ]
      },
      {
        "type": "paragraph",
        "text": "These cookies improve convenience but are not strictly necessary for operation."
      },
      {
        "type": "heading",
        "text": "4. Third-Party Cookies"
      },
      {
        "type": "paragraph",
        "text": "Some cookies may be placed by third-party services integrated with Basic22. These providers may include:"
      },
      {
        "type": "list",
        "items": [
          "Google Analytics",
          "Google AdSense",
          "Infrastructure providers",
          "Security services"
        ]
      },
      {
        "type": "paragraph",
        "text": "We do not directly control third-party cookies. Users should consult the relevant third-party privacy policies for additional information regarding how those providers process information."
      },
      {
        "type": "heading",
        "text": "5. Consent"
      },
      {
        "type": "paragraph",
        "text": "Where required by applicable law, Basic22 will request consent before placing non-essential cookies on your device. This includes cookies used for:"
      },
      {
        "type": "list",
        "items": [
          "Analytics",
          "Advertising",
          "Personalisation"
        ]
      },
      {
        "type": "paragraph",
        "text": "You may:"
      },
      {
        "type": "list",
        "items": [
          "Accept cookies",
          "Reject non-essential cookies",
          "Change your preferences later"
        ]
      },
      {
        "type": "paragraph",
        "text": "Your preferences can be modified through available cookie controls where provided."
      },
      {
        "type": "heading",
        "text": "6. Managing Cookies"
      },
      {
        "type": "paragraph",
        "text": "Most web browsers allow users to manage cookies through browser settings. You may be able to:"
      },
      {
        "type": "list",
        "items": [
          "View stored cookies",
          "Delete cookies",
          "Block cookies",
          "Restrict certain categories of cookies"
        ]
      },
      {
        "type": "paragraph",
        "text": "Browser settings are usually available through your browser's privacy or security settings. Please note that disabling certain cookies may affect Platform functionality."
      },
      {
        "type": "heading",
        "text": "7. Cookie Retention"
      },
      {
        "type": "paragraph",
        "text": "Different cookies remain active for different periods. Some cookies are deleted automatically when you close your browser session. Other cookies may remain for longer periods to remember preferences or support functionality. Retention periods are determined by the specific purpose of the cookie and the provider responsible for it."
      },
      {
        "type": "heading",
        "text": "8. Similar Technologies"
      },
      {
        "type": "paragraph",
        "text": "Basic22 and its service providers may also use technologies similar to cookies, including:"
      },
      {
        "type": "list",
        "items": [
          "Local storage",
          "Session storage",
          "Pixels",
          "Tags",
          "Device identifiers"
        ]
      },
      {
        "type": "paragraph",
        "text": "These technologies may be used for purposes similar to those described in this Policy."
      },
      {
        "type": "heading",
        "text": "9. Updates to This Policy"
      },
      {
        "type": "paragraph",
        "text": "We may update this Cookie Policy periodically to reflect:"
      },
      {
        "type": "list",
        "items": [
          "Changes in technology",
          "Changes to our services",
          "Legal requirements",
          "Changes to third-party providers"
        ]
      },
      {
        "type": "paragraph",
        "text": "The latest version will always be available on Basic22.com. Continued use of the Platform after updates become effective constitutes acceptance of the revised Cookie Policy."
      },
      {
        "type": "heading",
        "text": "10. Contact"
      },
      {
        "type": "paragraph",
        "text": "Questions regarding this Cookie Policy may be directed to: CentrumDisce Email: centrumdisce@gmail.com Basic22.com United Kingdom"
      }
    ]
  }
} as const satisfies Record<(typeof policyOrder)[number], Policy>;

export type PolicyKey = (typeof policyOrder)[number];

export const policyLinks = policyOrder.map((key) => {
  const policy = policies[key];

  return {
    href: policy.href,
    label: policy.label
  };
});
