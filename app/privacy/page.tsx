import type { Metadata } from "next";
import Link from "next/link";

import { LegalDocument } from "@/components/marketing/LegalDocument";

export const metadata: Metadata = {
  title: "Privacy Policy — ClientLedger",
  description: "How ClientLedger collects, uses, and protects your data.",
};

export default function PrivacyPage() {
  return (
    <LegalDocument title="Privacy Policy" lastUpdated="June 30, 2026">
      <LegalDocument.Section title="1. Introduction">
        <p>
          ClientLedger (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) operates the
          ClientLedger web application at{" "}
          <Link href="/" className="text-indigo-600 hover:text-indigo-500">
            clientledger.app
          </Link>{" "}
          and related services (collectively, the &ldquo;Service&rdquo;). This Privacy Policy
          explains how we collect, use, disclose, and safeguard information when you use the
          Service.
        </p>
        <p>
          By using ClientLedger, you agree to the collection and use of information in accordance
          with this policy. If you do not agree, please do not use the Service.
        </p>
      </LegalDocument.Section>

      <LegalDocument.Section title="2. Information we collect">
        <p>
          <strong>Account information.</strong> When you register, we collect your email address,
          name (if provided), and authentication credentials processed through Supabase Auth.
        </p>
        <p>
          <strong>Client and business data.</strong> You may enter client names, companies, contact
          details, interaction logs, expenses, deal values, notes, and uploaded voice memos. This
          data is stored to provide the Service and is treated as your content.
        </p>
        <p>
          <strong>Usage data.</strong> We automatically collect standard log data such as IP
          address, browser type, device information, pages visited, and timestamps. Our hosting
          provider (Vercel) and analytics tools may process this data to operate and improve the
          Service.
        </p>
        <p>
          <strong>Demo account.</strong> The public demo account uses sample data that is reset
          periodically. Do not enter real personal or confidential information into the demo.
        </p>
      </LegalDocument.Section>

      <LegalDocument.Section title="3. How we use your information">
        <p>We use collected information to:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Provide, maintain, and improve the Service</li>
          <li>Authenticate users and manage accounts</li>
          <li>Generate reports, dashboards, and ROI analytics you request</li>
          <li>Respond to support requests and security incidents</li>
          <li>Comply with legal obligations</li>
        </ul>
        <p>
          We do not sell your personal information. We do not use your client data to train
          third-party AI models.
        </p>
      </LegalDocument.Section>

      <LegalDocument.Section title="4. How we share information">
        <p>We share information only in these circumstances:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Service providers.</strong> We use Supabase (database, auth, storage), Vercel
            (hosting), and related infrastructure providers who process data on our behalf under
            contractual obligations.
          </li>
          <li>
            <strong>Legal requirements.</strong> We may disclose information if required by law,
            court order, or to protect rights, safety, or security.
          </li>
          <li>
            <strong>Business transfers.</strong> In connection with a merger, acquisition, or sale
            of assets, your information may be transferred with appropriate notice.
          </li>
        </ul>
      </LegalDocument.Section>

      <LegalDocument.Section title="5. Data retention">
        <p>
          We retain your account and client data for as long as your account is active or as needed
          to provide the Service. You may request deletion of your account and associated data by
          contacting us. Demo account data is refreshed on a recurring basis.
        </p>
      </LegalDocument.Section>

      <LegalDocument.Section title="6. Security">
        <p>
          We implement industry-standard safeguards including encrypted connections (HTTPS),
          authenticated database access, row-level security policies in Supabase, and HTTP-only
          session cookies. No method of transmission or storage is 100% secure; we cannot
          guarantee absolute security.
        </p>
      </LegalDocument.Section>

      <LegalDocument.Section title="7. Your rights">
        <p>
          Depending on your location, you may have rights to access, correct, delete, or export
          your personal data, and to object to or restrict certain processing. California residents
          may have additional rights under the CCPA. EU/UK residents may have rights under GDPR.
        </p>
        <p>
          To exercise these rights, contact us at{" "}
          <a href="mailto:privacy@clientledger.app" className="text-indigo-600 hover:text-indigo-500">
            privacy@clientledger.app
          </a>
          . We will respond within a reasonable timeframe.
        </p>
      </LegalDocument.Section>

      <LegalDocument.Section title="8. Cookies">
        <p>
          We use essential cookies for authentication and session management. These are required for
          the Service to function. We do not use third-party advertising cookies.
        </p>
      </LegalDocument.Section>

      <LegalDocument.Section title="9. Children">
        <p>
          ClientLedger is not directed to individuals under 18. We do not knowingly collect
          personal information from children. If you believe a child has provided us data, contact
          us and we will delete it.
        </p>
      </LegalDocument.Section>

      <LegalDocument.Section title="10. International transfers">
        <p>
          Your information may be processed in the United States and other countries where our
          service providers operate. We take steps to ensure appropriate safeguards for
          cross-border transfers where required by law.
        </p>
      </LegalDocument.Section>

      <LegalDocument.Section title="11. Changes to this policy">
        <p>
          We may update this Privacy Policy from time to time. We will post the revised policy on
          this page and update the &ldquo;Last updated&rdquo; date. Material changes may be
          communicated via email or in-app notice.
        </p>
      </LegalDocument.Section>

      <LegalDocument.Section title="12. Contact us">
        <p>
          Questions about this Privacy Policy? Contact us at{" "}
          <a href="mailto:privacy@clientledger.app" className="text-indigo-600 hover:text-indigo-500">
            privacy@clientledger.app
          </a>
          .
        </p>
        <p>
          See also our{" "}
          <Link href="/terms" className="text-indigo-600 hover:text-indigo-500">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/accessibility" className="text-indigo-600 hover:text-indigo-500">
            Accessibility Statement
          </Link>
          .
        </p>
      </LegalDocument.Section>
    </LegalDocument>
  );
}
