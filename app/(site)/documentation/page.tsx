// app/(site)/documentation/page.tsx
export const metadata = {
  title: 'Documentation - EraseIn',
  description: 'Complete tutorial for EraseIn, a free in-browser background remover.',
};

export default function DocumentationPage() {
  const year = new Date().getFullYear();
  return (
    <main className='min-h-screen bg-surface w-full pt-16'>
      <div className='max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop py-stack-xl'>
        <h1 className='font-headline-lg text-headline-lg text-on-surface font-bold mb-stack-sm'>
          Documentation
        </h1>
        <p className='font-body-md text-body-md text-on-surface-variant mb-12 leading-relaxed'>
          EraseIn removes image backgrounds directly in your browser - no uploads, no accounts, no limits. This guide walks you through every step.
        </p>

        <div className='flex flex-col gap-stack-lg'>
          <section>
            <h2 className='font-headline-sm text-headline-sm text-on-surface font-semibold mb-stack-sm'>
              1. Add your images
            </h2>
            <div className='legal-card rounded-xl border p-6'>
              <p className='font-body-md text-body-md text-on-surface-variant leading-relaxed'>
                On the Dashboard, drag and drop one or many image files anywhere onto the dashed upload area, or click it to open your file picker. EraseIn accepts JPG, PNG, WEBP, GIF, AVIF, and BMP. Everything stays on your device - files are never sent to a server.
              </p>
            </div>
          </section>

          <section>
            <h2 className='font-headline-sm text-headline-sm text-on-surface font-semibold mb-stack-sm'>
              2. Let the engine process
            </h2>
            <div className='legal-card rounded-xl border p-6'>
              <p className='font-body-md text-body-md text-on-surface-variant leading-relaxed'>
                The first time you use EraseIn, a small AI model downloads into your browser&apos;s memory. You&apos;ll see a &quot;Setting Up Local Engine&quot; notice with a spinner. After that, each image moves through four states shown as badges:
              </p>
              <ul className='mt-3 flex flex-col gap-2 font-body-sm text-body-sm text-on-surface-variant'>
                <li><span className='font-semibold text-on-surface'>Waiting</span> - queued, not started yet.</li>
                <li><span className='font-semibold text-on-surface'>Processing</span> - the background is being removed.</li>
                <li><span className='font-semibold text-on-surface'>Done</span> - ready to view or download.</li>
                <li><span className='font-semibold text-on-surface'>Failed</span> - something went wrong; you can delete and retry.</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className='font-headline-sm text-headline-sm text-on-surface font-semibold mb-stack-sm'>
              3. Customize the output
            </h2>
            <div className='legal-card rounded-xl border p-6'>
              <p className='font-body-md text-body-md text-on-surface-variant leading-relaxed'>
                Click the <span className='material-symbols-outlined text-[16px] align-middle'>tune</span> (Settings) button - either the one at the top of the queue or the per-image icon - to open the options panel. These settings apply to the entire queue at once:
              </p>
              <ul className='mt-3 flex flex-col gap-2 font-body-sm text-body-sm text-on-surface-variant'>
                <li><span className='font-semibold text-on-surface'>Format</span> - PNG (supports transparency), JPG, or WEBP.</li>
                <li><span className='font-semibold text-on-surface'>Background</span> - Transparent, White, Black, Red, a custom color picker, or a random color.</li>
                <li><span className='font-semibold text-on-surface'>Quality</span> - Low (0.5&times;), Standard (1&times;), or HD (2&times; scale).</li>
              </ul>
              <p className='mt-3 font-body-sm text-body-sm text-on-surface-variant leading-relaxed'>
                Tip: choosing a non-transparent background or a format other than PNG will re-compose the image on a canvas before download.
              </p>
            </div>
          </section>

          <section>
            <h2 className='font-headline-sm text-headline-sm text-on-surface font-semibold mb-stack-sm'>
              4. Download your results
            </h2>
            <div className='legal-card rounded-xl border p-6'>
              <p className='font-body-md text-body-md text-on-surface-variant leading-relaxed'>
                For each finished image you can:
              </p>
              <ul className='mt-3 flex flex-col gap-2 font-body-sm text-body-sm text-on-surface-variant'>
                <li><span className='material-symbols-outlined text-[16px] align-middle'>visibility</span> <span className='font-semibold text-on-surface'>View</span> - open a before/after comparison slider (drag to compare, zoom with the lens icon).</li>
                <li><span className='material-symbols-outlined text-[16px] align-middle'>download</span> <span className='font-semibold text-on-surface'>Download</span> - save a single image using your current export settings.</li>
                <li><span className='material-symbols-outlined text-[16px] align-middle'>delete</span> <span className='font-semibold text-on-surface'>Delete</span> - remove an image from the queue (or cancel one that is processing).</li>
              </ul>
              <p className='mt-3 font-body-md text-body-md text-on-surface-variant leading-relaxed'>
                Use <span className='font-semibold text-on-surface'>Download All as ZIP</span> at the top of the Dashboard to grab every completed image in one archive, respecting your chosen format, background, and quality.
              </p>
            </div>
          </section>

          <section>
            <h2 className='font-headline-sm text-headline-sm text-on-surface font-semibold mb-stack-sm'>
              5. History and data retention
            </h2>
            <div className='legal-card rounded-xl border p-6'>
              <p className='font-body-md text-body-md text-on-surface-variant leading-relaxed'>
                Completed images are stored locally in your browser (IndexedDB) and appear on the History page. They are automatically and permanently deleted after 24 hours. You can also clear individual images or everything at once from the Dashboard or History - and choose &quot;Always&quot; to skip the confirmation next time.
              </p>
            </div>
          </section>

          <section>
            <h2 className='font-headline-sm text-headline-sm text-on-surface font-semibold mb-stack-sm'>
              6. Tips and troubleshooting
            </h2>
            <div className='legal-card rounded-xl border p-6'>
              <ul className='flex flex-col gap-2 font-body-sm text-body-sm text-on-surface-variant'>
                <li>Works fully offline after the first model download.</li>
                <li>If an image fails, delete it and drop it in again - the model is already cached.</li>
                <li>Large batches are processed one at a time to keep your browser responsive.</li>
                <li>Clearing site data in your browser will erase your queue and History.</li>
              </ul>
            </div>
          </section>
        </div>

        <p className='mt-16 font-body-sm text-body-sm text-on-surface-variant opacity-80'>
          &copy; {year} EraseIn. All rights reserved.
        </p>
      </div>
    </main>
  );
}
