import Link from "next/link";

const footerLinks = {
  Product: [
    { label: "Use cases", href: "/#use-cases" },
    { label: "Platform", href: "/#features" },
    { label: "Pricing", href: "/signup" },
  ],
  Resources: [
    { label: "Try demo", href: "/login" },
    { label: "Sign up", href: "/signup" },
  ],
  Legal: [
    { label: "Terms of Service", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Accessibility", href: "/accessibility" },
  ],
};

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-content px-6 py-12 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="text-lg font-bold text-slate-900">
              Client<span className="text-indigo-600">Ledger</span>
            </Link>
            <p className="mt-3 text-sm text-slate-500 leading-relaxed">
              Track client time, expenses, and revenue. Know your relationship ROI.
            </p>
          </div>
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <p className="text-sm font-semibold text-slate-900">{title}</p>
              <ul className="mt-3 space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-500 transition-colors hover:text-slate-900"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col gap-2 border-t border-slate-100 pt-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} ClientLedger. All rights reserved.</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <Link href="/terms" className="hover:text-slate-900">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-slate-900">
              Privacy
            </Link>
            <Link href="/accessibility" className="hover:text-slate-900">
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
