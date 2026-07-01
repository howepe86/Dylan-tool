import type { Metadata } from "next";
import Link from "next/link";

import { LegalDocument } from "@/components/marketing/LegalDocument";

export const metadata: Metadata = {
  title: "Terms of Service — ClientLedger",
  description: "Terms and conditions for using ClientLedger.",
};

export default function TermsPage() {
  return (
    <LegalDocument title="Terms of Service" lastUpdated="June 30, 2026">
      <LegalDocument.Section title="1. Agreement to terms">
        <p>
          These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of ClientLedger
          (the &ldquo;Service&rdquo;), operated by ClientLedger (&ldquo;we,&rdquo;
          &ldquo;us,&rdquo; or &ldquo;our&rdquo;). By creating an account or using the Service, you
          agree to these Terms. If you are using the Service on behalf of an organization, you
          represent that you have authority to bind that organization.
        </p>
      </LegalDocument.Section>

      <LegalDocument.Section title="2. Description of service">
        <p>
          ClientLedger is a client relationship ROI platform that helps users log client
          interactions, track expenses, manage deals, and generate financial reports. Features may
          change over time. We may add, modify, or discontinue features with reasonable notice where
          practicable.
        </p>
      </LegalDocument.Section>

      <LegalDocument.Section title="3. Accounts">
        <p>
          You must provide accurate registration information and keep your credentials secure. You
          are responsible for all activity under your account. Notify us immediately at{" "}
          <a href="mailto:support@clientledger.app" className="text-indigo-600 hover:text-indigo-500">
            support@clientledger.app
          </a>{" "}
          if you suspect unauthorized access.
        </p>
        <p>
          The demo account is provided for evaluation purposes only. Demo data may be reset at any
          time and is not guaranteed to persist.
        </p>
      </LegalDocument.Section>

      <LegalDocument.Section title="4. Acceptable use">
        <p>You agree not to:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Use the Service for any unlawful purpose or in violation of applicable laws</li>
          <li>Upload malicious code, attempt unauthorized access, or interfere with the Service</li>
          <li>Reverse engineer, scrape, or resell the Service without written permission</li>
          <li>Upload content that infringes third-party intellectual property or privacy rights</li>
          <li>Use the Service to store highly sensitive data (e.g., health records, SSNs) unless expressly permitted</li>
        </ul>
        <p>
          We may suspend or terminate accounts that violate these Terms or pose a security risk.
        </p>
      </LegalDocument.Section>

      <LegalDocument.Section title="5. Your content">
        <p>
          You retain ownership of client data, notes, and other content you submit
          (&ldquo;Your Content&rdquo;). You grant us a limited license to host, process, and display
          Your Content solely to provide and improve the Service.
        </p>
        <p>
          You are solely responsible for the accuracy of Your Content and for ensuring you have the
          right to store and process client information you enter. ClientLedger is a tracking tool,
          not financial, legal, or tax advice.
        </p>
      </LegalDocument.Section>

      <LegalDocument.Section title="6. Intellectual property">
        <p>
          The Service, including its design, code, trademarks, and documentation, is owned by
          ClientLedger and protected by intellectual property laws. These Terms do not grant you any
          rights to our branding or proprietary technology except as needed to use the Service.
        </p>
      </LegalDocument.Section>

      <LegalDocument.Section title="7. Fees and payment">
        <p>
          ClientLedger may offer free and paid plans. Paid features, if offered, will be described
          at the time of purchase. Fees are non-refundable except where required by law or
          explicitly stated otherwise. We may change pricing with advance notice to existing
          subscribers.
        </p>
      </LegalDocument.Section>

      <LegalDocument.Section title="8. Disclaimers">
        <p>
          THE SERVICE IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; WITHOUT
          WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A
          PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICE WILL BE
          UNINTERRUPTED, ERROR-FREE, OR THAT REPORTS WILL BE ACCURATE FOR YOUR SPECIFIC TAX OR
          COMPLIANCE NEEDS.
        </p>
      </LegalDocument.Section>

      <LegalDocument.Section title="9. Limitation of liability">
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, CLIENTLEDGER AND ITS OFFICERS, DIRECTORS,
          EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
          CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, DATA, OR GOODWILL, ARISING
          FROM YOUR USE OF THE SERVICE.
        </p>
        <p>
          OUR TOTAL LIABILITY FOR ANY CLAIM ARISING FROM THESE TERMS OR THE SERVICE SHALL NOT EXCEED
          THE GREATER OF (A) THE AMOUNT YOU PAID US IN THE TWELVE MONTHS PRECEDING THE CLAIM, OR
          (B) ONE HUNDRED U.S. DOLLARS ($100).
        </p>
      </LegalDocument.Section>

      <LegalDocument.Section title="10. Indemnification">
        <p>
          You agree to indemnify and hold harmless ClientLedger from claims, damages, and expenses
          (including reasonable attorneys&apos; fees) arising from Your Content, your use of the
          Service, or your violation of these Terms.
        </p>
      </LegalDocument.Section>

      <LegalDocument.Section title="11. Termination">
        <p>
          You may stop using the Service and delete your account at any time. We may suspend or
          terminate your access for violation of these Terms, non-payment, or extended inactivity.
          Upon termination, your right to use the Service ceases. Provisions that by nature should
          survive (e.g., disclaimers, liability limits) will survive.
        </p>
      </LegalDocument.Section>

      <LegalDocument.Section title="12. Governing law">
        <p>
          These Terms are governed by the laws of the State of Delaware, United States, without
          regard to conflict-of-law principles. Disputes shall be resolved in the state or federal
          courts located in Delaware, and you consent to personal jurisdiction there.
        </p>
      </LegalDocument.Section>

      <LegalDocument.Section title="13. Changes to terms">
        <p>
          We may revise these Terms at any time. Continued use after changes become effective
          constitutes acceptance. If you do not agree to revised Terms, you must stop using the
          Service.
        </p>
      </LegalDocument.Section>

      <LegalDocument.Section title="14. Contact">
        <p>
          Questions about these Terms? Contact{" "}
          <a href="mailto:legal@clientledger.app" className="text-indigo-600 hover:text-indigo-500">
            legal@clientledger.app
          </a>
          .
        </p>
        <p>
          See our{" "}
          <Link href="/privacy" className="text-indigo-600 hover:text-indigo-500">
            Privacy Policy
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
