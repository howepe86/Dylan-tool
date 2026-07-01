const caseStudies = [
  {
    company: "Acme Corp",
    quote:
      "We finally know which client dinners actually close deals. ClientLedger paid for itself in the first quarter.",
    author: "Sarah Chen",
    role: "VP Sales",
    metrics: [
      { value: "3.1×", label: "ROI on entertainment spend" },
      { value: "$284K", label: "Closed revenue tracked" },
    ],
  },
  {
    company: "Northwind Logistics",
    quote:
      "Fastest insight ever: we spotted a stale $120K pipeline deal and re-engaged before it went cold.",
    author: "Marcus Webb",
    role: "Account Executive",
    metrics: [
      { value: "18", label: "Touchpoints logged in 30 days" },
      { value: "92", label: "Client health score" },
    ],
  },
  {
    company: "Brightpath Consulting",
    quote:
      "Quarterly reports that used to take a day now take five minutes. Finance actually trusts the numbers.",
    author: "Elena Ruiz",
    role: "Founder",
    metrics: [
      { value: "70%", label: "Less time on reporting" },
      { value: "100%", label: "Client coverage" },
    ],
  },
];

export function MetricsSection() {
  return (
    <section id="case-studies" className="py-20">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
          Results
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Teams that track ROI, win more
        </h2>
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {caseStudies.map((study) => (
          <article
            key={study.company}
            className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:border-indigo-200 hover:shadow-md hover:shadow-indigo-50"
          >
            <blockquote className="flex-1 text-slate-700 leading-relaxed">
              &ldquo;{study.quote}&rdquo;
            </blockquote>
            <div className="mt-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
                {study.author.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-slate-900">{study.author}</p>
                <p className="text-sm text-slate-500">
                  {study.role}, {study.company}
                </p>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-100 pt-6">
              {study.metrics.map((m) => (
                <div key={m.label}>
                  <p className="text-2xl font-bold text-indigo-600">{m.value}</p>
                  <p className="text-xs text-slate-500">{m.label}</p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
