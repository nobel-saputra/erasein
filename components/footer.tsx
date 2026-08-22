// Site footer with brand info, navigation links, and source repository.
import Link from 'next/link';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-surface-container-low w-full py-12 mt-20 border-t border-outline-variant relative z-10">
      {/* Main Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-stack-lg lg:gap-gutter max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        {/* Column 1: Brand */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-stack-sm">
            <span className="font-headline-sm text-headline-sm font-bold text-on-surface">EraseIn</span>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant max-w-xs leading-relaxed">
            Smart background remover. Fast, clean, and private.
          </p>
        </div>
        {/* Column 2: Product Links */}
        <div className="flex flex-col">
          <h3 className="font-label-md text-label-md text-on-surface font-semibold mb-stack-md">Product</h3>
          <ul className="space-y-stack-sm flex flex-col">
            <li><Link className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors opacity-80 hover:opacity-100 block py-1" href="/">Dashboard</Link></li>
            <li><Link className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors opacity-80 hover:opacity-100 block py-1" href="/history">History</Link></li>
            <li><Link className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors opacity-80 hover:opacity-100 block py-1" href="/documentation">Documentation</Link></li>
          </ul>
        </div>
        {/* Column 3: Company Links */}
        <div className="flex flex-col">
          <h3 className="font-label-md text-label-md text-on-surface font-semibold mb-stack-md">Company</h3>
          <ul className="space-y-stack-sm flex flex-col">
            <li><Link className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors opacity-80 hover:opacity-100 block py-1" href="/privacy-policy">Privacy Policy</Link></li>
            <li><Link className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors opacity-80 hover:opacity-100 block py-1" href="/terms-of-service">Terms of Service</Link></li>
            <li><Link className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors opacity-80 hover:opacity-100 block py-1" href="/support">Support</Link></li>
          </ul>
        </div>
        {/* Column 4: Source */}
        <div className="flex flex-col">
          <h3 className="font-label-md text-label-md text-on-surface font-semibold mb-stack-md">Source</h3>
          <ul className="space-y-stack-sm flex flex-col">
            <li>
              <a
                className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors opacity-80 hover:opacity-100 block py-1"
                href="https://github.com/nobel-saputra/erasein"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub Repository
              </a>
            </li>
          </ul>
        </div>
      </div>
      {/* Bottom Copyright */}
      <div className="mt-16 pt-8 border-t border-outline-variant/30 flex flex-col md:flex-row justify-between items-center max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop gap-4 text-center md:text-left">
        <p className="font-body-sm text-body-sm text-on-surface-variant opacity-80">
          © {year} EraseIn. All rights reserved. Made by{" "}
          <a href="https://nobelsaputra.my.id/" target="_blank" rel="noopener noreferrer" className="font-bold text-on-surface hover:text-primary transition-colors">nobelsaputra</a>.
        </p>
      </div>
    </footer>
  );
}
