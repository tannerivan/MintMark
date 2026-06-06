import { auth } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import CoinSearchForm from "@/components/search/CoinSearchForm";

export default async function Home() {
  const { userId } = await auth();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Nav */}
      <header className="flex items-center justify-between px-5 py-4 border-b border-border">
        <span className="font-display font-bold text-xl text-copper tracking-tight">
          MintMark™
        </span>
        <div className="flex items-center gap-3">
          {userId ? (
            <>
              <a href="/collection" className="text-sm text-text-secondary hover:text-copper transition-colors">
                My Collection
              </a>
              <UserButton />
            </>
          ) : (
            <>
              <a href="/sign-in" className="text-sm text-text-secondary hover:text-copper transition-colors">
                Sign in
              </a>
              <a
                href="/sign-up"
                className="text-sm font-medium px-3 py-1.5 rounded-lg border border-copper/50 text-copper hover:bg-copper/10 transition-all"
              >
                Sign up
              </a>
            </>
          )}
        </div>
      </header>

      {/* Hero + Search */}
      <main className="flex flex-1 flex-col items-center justify-center px-5 py-12 sm:py-20">
        <div className="w-full max-w-lg">
          <div className="text-center mb-10">
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-text leading-tight mb-3">
              What did you find?
            </h1>
            <p className="text-text-secondary text-lg leading-relaxed">
              Type in any US coin and instantly know if you're holding something.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-6 shadow-[0_0_60px_-15px_rgba(184,115,51,0.15)]">
            <CoinSearchForm />
          </div>

          <p className="text-center text-xs text-text-muted mt-4">
            5 free lookups per day · No account required ·{" "}
            <a href="/upgrade" className="text-copper hover:text-copper-light transition-colors">
              Go Pro for unlimited →
            </a>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border px-5 py-5 flex flex-wrap items-center justify-between gap-3">
        <span className="font-display font-semibold text-sm text-copper">MintMark™</span>
        <div className="flex items-center gap-4 text-xs text-text-muted">
          <a href="/learn" className="hover:text-copper transition-colors">Learn</a>
          <a href="/pocket-change" className="hover:text-copper transition-colors">Daily Challenge</a>
          <a href="/upgrade" className="hover:text-copper transition-colors">Pro</a>
        </div>
      </footer>
    </div>
  );
}
