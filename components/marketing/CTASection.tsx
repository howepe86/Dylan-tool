import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-20">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700 px-8 py-16 text-center lg:px-16">
        <div
          className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIwLjA1Ij48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLTZoLTJWMjRoMnY0ek0zNiAyMGgtMnYtNGgydjR6TTI0IDM0aC00di0yaDR2MnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40"
          aria-hidden
        />
        <div className="relative">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to know your client ROI?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-indigo-100">
            Jump into the live demo with pre-loaded clients, activities, and deals.
            No setup required.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="h-12 bg-white px-8 text-indigo-700 hover:bg-indigo-50"
            >
              <Link href="/login">
                Continue as Demo User
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-12 border-indigo-400/50 bg-transparent px-8 text-white hover:bg-indigo-600/50 hover:text-white"
            >
              <Link href="/signup">Create account</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
