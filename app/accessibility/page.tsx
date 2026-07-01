import type { Metadata } from "next";
import Link from "next/link";

import { LegalDocument } from "@/components/marketing/LegalDocument";

export const metadata: Metadata = {
  title: "Accessibility Statement — ClientLedger",
  description:
    "ClientLedger commitment to digital accessibility and ADA compliance.",
};

export default function AccessibilityPage() {
  return (
    <LegalDocument title="Accessibility Statement" lastUpdated="June 30, 2026">
      <LegalDocument.Section title="Our commitment">
        <p>
          ClientLedger is committed to ensuring digital accessibility for people with disabilities.
          We continually improve the user experience for everyone and apply relevant accessibility
          standards, including the Americans with Disabilities Act (ADA) and Section 508 of the
          Rehabilitation Act, where applicable to our public-facing web application.
        </p>
        <p>
          Our goal is to conform with the{" "}
          <a
            href="https://www.w3.org/WAI/standards-guidelines/wcag/"
            className="text-indigo-600 hover:text-indigo-500"
            target="_blank"
            rel="noopener noreferrer"
          >
            Web Content Accessibility Guidelines (WCAG) 2.1
          </a>{" "}
          at Level AA.
        </p>
      </LegalDocument.Section>

      <LegalDocument.Section title="Measures we take">
        <p>ClientLedger incorporates the following accessibility practices:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Semantic HTML.</strong> Pages use proper heading hierarchy, landmarks, and
            form labels so screen readers can navigate content logically.
          </li>
          <li>
            <strong>Keyboard navigation.</strong> Interactive elements are reachable and operable
            via keyboard. Focus states are visible on buttons, links, and form controls.
          </li>
          <li>
            <strong>Color and contrast.</strong> Text meets WCAG AA contrast ratios. Financial
            indicators pair color with icons, signs (+/−), or labels — never color alone.
          </li>
          <li>
            <strong>Skip navigation.</strong> A &ldquo;Skip to main content&rdquo; link allows
            keyboard users to bypass repetitive navigation.
          </li>
          <li>
            <strong>Alternative text.</strong> Decorative icons are marked with{" "}
            <code className="rounded bg-slate-100 px-1 text-xs">aria-hidden</code>. Meaningful
            images include descriptive alt text.
          </li>
          <li>
            <strong>Charts and data.</strong> Charts include text labels or table fallbacks where
            possible. KPI cards display values as readable text, not images.
          </li>
          <li>
            <strong>Responsive design.</strong> The interface adapts to different screen sizes and
            zoom levels up to 200% without loss of content or functionality.
          </li>
          <li>
            <strong>Form accessibility.</strong> All inputs have visible labels and error messages
            associated via <code className="rounded bg-slate-100 px-1 text-xs">aria-describedby</code>.
          </li>
        </ul>
      </LegalDocument.Section>

      <LegalDocument.Section title="Assistive technology compatibility">
        <p>
          ClientLedger is designed to work with commonly used assistive technologies, including:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Screen readers (VoiceOver, NVDA, JAWS)</li>
          <li>Keyboard-only navigation</li>
          <li>Browser zoom and system text-size settings</li>
          <li>Voice control software (where supported by the browser)</li>
        </ul>
        <p>
          We test on current versions of Chrome, Safari, Firefox, and Edge on desktop and mobile.
        </p>
      </LegalDocument.Section>

      <LegalDocument.Section title="Known limitations">
        <p>
          We are actively working to improve accessibility. Known areas under improvement include:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            Some data visualizations (charts) may not expose full data to screen readers; tabular
            report views are available as an alternative on the Reports page.
          </li>
          <li>
            Third-party components may have varying levels of accessibility support; we evaluate
            and replace components that do not meet our standards.
          </li>
          <li>
            Voice memo playback depends on browser audio support and may lack captions until
            transcription is available.
          </li>
        </ul>
      </LegalDocument.Section>

      <LegalDocument.Section title="Conformance status">
        <p>
          ClientLedger is <strong>partially conformant</strong> with WCAG 2.1 Level AA. Partially
          conformant means that some parts of the content do not fully conform to the accessibility
          standard. We are on a continuous improvement path and prioritize accessibility in new
          feature development.
        </p>
      </LegalDocument.Section>

      <LegalDocument.Section title="Feedback and accommodation requests">
        <p>
          We welcome your feedback on the accessibility of ClientLedger. If you encounter
          accessibility barriers or need an accommodation, please contact us:
        </p>
        <ul className="list-none space-y-2 pl-0">
          <li>
            Email:{" "}
            <a
              href="mailto:accessibility@clientledger.app"
              className="text-indigo-600 hover:text-indigo-500"
            >
              accessibility@clientledger.app
            </a>
          </li>
          <li>
            General support:{" "}
            <a
              href="mailto:support@clientledger.app"
              className="text-indigo-600 hover:text-indigo-500"
            >
              support@clientledger.app
            </a>
          </li>
        </ul>
        <p>
          Please include the page URL, a description of the issue, and the assistive technology
          you use (if applicable). We aim to respond within five business days and to resolve
          issues within a reasonable timeframe.
        </p>
      </LegalDocument.Section>

      <LegalDocument.Section title="Formal complaints (ADA)">
        <p>
          If you are not satisfied with our response, you may file a complaint with the U.S.
          Department of Justice, Civil Rights Division, or your state&apos;s disability rights
          agency. We prefer to resolve concerns directly and encourage you to contact us first.
        </p>
      </LegalDocument.Section>

      <LegalDocument.Section title="Assessment approach">
        <p>
          Accessibility is evaluated through a combination of automated tooling (e.g., axe,
          Lighthouse), manual keyboard testing, screen reader spot checks, and code review against
          our internal UI standards. We reassess after significant product changes.
        </p>
      </LegalDocument.Section>

      <LegalDocument.Section title="Related policies">
        <p>
          <Link href="/privacy" className="text-indigo-600 hover:text-indigo-500">
            Privacy Policy
          </Link>
          {" · "}
          <Link href="/terms" className="text-indigo-600 hover:text-indigo-500">
            Terms of Service
          </Link>
        </p>
      </LegalDocument.Section>
    </LegalDocument>
  );
}
