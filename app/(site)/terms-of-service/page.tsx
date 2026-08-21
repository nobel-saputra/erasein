// app/(site)/terms-of-service/page.tsx
export const metadata = {
  title: "Terms of Service - EraseIn",
  description: "Terms of Service for EraseIn, a free in browser background remover.",
};
  
export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-surface w-full pt-16">
      <div className="max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop py-stack-xl">
        <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold mb-stack-sm">
          Terms of Service
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant mb-12 leading-relaxed">
          By using EraseIn you agree to the terms below.
        </p>

        <div className="flex flex-col gap-stack-md">
          <div className="legal-card rounded-xl border p-6">
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              Free and unlimited. EraseIn is free with no limits, no account, and no hidden costs.
            </p>
          </div>
          <div className="legal-card rounded-xl border p-6">
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              Acceptable use. Use EraseIn only for lawful purposes. You are responsible for the rights
              to the images you process.
            </p>
          </div>
          <div className="legal-card rounded-xl border p-6">
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              No warranty. The service is provided as is, without guarantees of uninterrupted or
              error free operation.
            </p>
          </div>
          <div className="legal-card rounded-xl border p-6">
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              Liability. To the maximum extent permitted by law, EraseIn is not liable for damages
              arising from your use.
            </p>
          </div>
          <div className="legal-card rounded-xl border p-6">
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              Changes. We may update these terms. Continued use after changes means you accept them.
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}
