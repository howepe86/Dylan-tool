export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-content flex-col gap-4 px-6 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <p>Track client time, expenses, and revenue in one place.</p>
        <p>© {new Date().getFullYear()} ClientLedger</p>
      </div>
    </footer>
  );
}
