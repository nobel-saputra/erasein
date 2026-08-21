import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex-grow min-h-screen flex items-center justify-center px-margin-mobile md:px-margin-desktop py-stack-lg">
      <div className="flex flex-col items-center text-center max-w-md">
        <span className="font-headline-xl text-[96px] sm:text-[128px] leading-none font-bold text-primary">404</span>
        <h1 className="font-headline-xl text-headline-xl-mobile md:text-headline-xl font-bold text-on-surface mt-4">
          Page Not Found
        </h1>
        <p className="font-body-md text-body-md text-secondary mt-3">
          Sorry, the page you are looking for does not exist or may have been moved.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 h-11 px-6 rounded-lg bg-on-surface text-surface font-label-md text-label-md hover:bg-inverse-surface transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">home</span>
          Back to Home
        </Link>
      </div>
    </main>
  );
}
