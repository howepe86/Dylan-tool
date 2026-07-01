export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-800">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-8 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
        <p>Track client time, expenses, and revenue in one place.</p>
        <p>© {new Date().getFullYear()} ClientLedger</p>
      </div>
    </footer>
  );
}
