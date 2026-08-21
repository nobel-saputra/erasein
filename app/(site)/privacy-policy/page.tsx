// app/(site)/privacy-policy/page.tsx
export const metadata = {
  title: "Privacy Policy - EraseIn",
  description: "Privacy Policy for EraseIn, a free in browser background remover.",
};
  
export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-surface w-full pt-16">
      <div className="max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop py-stack-xl">
        <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold mb-stack-sm">
          Privacy Policy
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant mb-12 leading-relaxed">
          EraseIn processes images locally in your browser. Your files never leave your device.
        </p>

        <div className="flex flex-col gap-stack-md">
          <div className="legal-card rounded-xl border p-6">
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              Local processing. All background removal runs inside your browser. Images are never
              uploaded to or stored on any server.
            </p>
          </div>
          <div className="legal-card rounded-xl border p-6">
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              No account. EraseIn needs no registration or personal information to work.
            </p>
          </div>
          <div className="legal-card rounded-xl border p-6">
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              Local storage. Processed images are kept only in your browser IndexedDB to restore your
              queue and History, and are never shared.
            </p>
          </div>
          <div className="legal-card rounded-xl border p-6">
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              Automatic deletion. History images are permanently deleted after twenty four hours. You
              can clear all data anytime.
            </p>
          </div>
          <div className="legal-card rounded-xl border p-6">
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              No tracking. EraseIn uses no advertising trackers, analytics, or third party cookies.
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}
