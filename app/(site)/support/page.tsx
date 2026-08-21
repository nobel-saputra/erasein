// app/(site)/support/page.tsx
export const metadata = {
  title: "Support - EraseIn",
  description: "Support and help for EraseIn, a free in browser background remover.",
};
  
export default function SupportPage() {
  return (
    <main className="min-h-screen bg-surface w-full pt-16">
      <div className="max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop py-stack-xl">
        <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold mb-stack-sm">
          Support
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant mb-12 leading-relaxed">
          EraseIn is a community project. Get help through the channels below, or read the full{" "}
          <a href="/documentation" className="font-bold text-primary hover:underline">Documentation</a> for a step-by-step tutorial.
        </p>

        <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold mb-stack-md">
          Get help
        </h2>
        <div className="flex flex-col gap-stack-md">
          <div className="legal-card rounded-xl border p-6">
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              Source code. Report issues, request features, and review the code on GitHub.
            </p>
            <a
              className="font-bold text-primary hover:underline block mt-2"
              href="https://github.com/nobel-saputra/erasein"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://github.com/nobel-saputra/erasein
            </a>
          </div>
          <div className="legal-card rounded-xl border p-6">
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              Buy me a coffee for more free tools. Your support really help a lot
            </p>
            <a
              className="font-bold text-primary hover:underline block mt-2"
              href="https://ko-fi.com/nobelsaputra"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://ko-fi.com/nobelsaputra
            </a>
          </div>
        </div>

      </div>
    </main>
  );
}
