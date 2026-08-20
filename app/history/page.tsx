// app/history/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, deleteExpiredHistory } from '@/lib/db';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { toast } from '@/components/ui/toast';

const Thumbnail = ({ file }: { file: Blob }) => {
  const [url, setUrl] = useState<string>('');
  useEffect(() => {
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);
  if (!url) return <span className="material-symbols-outlined text-secondary">image</span>;
  return <img src={url} alt="thumbnail" className="w-full h-full object-cover" />;
};

export default function HistoryPage() {
  const images = useLiveQuery(
    () => db.images.where('status').equals('done').reverse().sortBy('createdAt')
  );

  const [confirmClearAll, setConfirmClearAll] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [skipDeleteConfirm, setSkipDeleteConfirm] = useState(false);

  // Automatically delete images older than 1 day
  useEffect(() => {
    deleteExpiredHistory();
  }, []);

  useEffect(() => {
    if (localStorage.getItem('skipDeleteConfirm') === 'true') setSkipDeleteConfirm(true);
  }, []);

  const doDelete = async (id: string) => {
    await db.images.delete(id);
    toast.add({ type: 'success', title: 'Image deleted', description: 'The image has been removed from History.', timeout: 4000 });
  };

  const handleDelete = (id: string) => {
    if (skipDeleteConfirm) {
      doDelete(id);
    } else {
      setConfirmDeleteId(id);
    }
  };

  const confirmDeleteImage = (alwaysSkip: boolean) => {
    if (!confirmDeleteId) return;
    setConfirmDeleteId(null);
    if (alwaysSkip) {
      localStorage.setItem('skipDeleteConfirm', 'true');
      setSkipDeleteConfirm(true);
    }
    doDelete(confirmDeleteId);
  };

  const handleClearAll = () => {
    if (images && images.length > 0) setConfirmClearAll(true);
  };

  const doClearAll = async () => {
    await db.images.where('status').equals('done').delete();
    toast.add({ type: 'success', title: 'History cleared', description: 'All images have been deleted from History.', timeout: 4000 });
  };

  const confirmClearAllImages = (alwaysSkip: boolean) => {
    setConfirmClearAll(false);
    if (alwaysSkip) {
      localStorage.setItem('skipDeleteConfirm', 'true');
      setSkipDeleteConfirm(true);
    }
    doClearAll();
  };

  const handleDownload = (blob: Blob, originalName: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.')) || originalName;
    a.download = `${nameWithoutExt}-transparent.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <main className="flex-grow max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop py-stack-lg flex flex-col gap-stack-lg">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-stack-md">
        <div>
          <h1 className="font-headline-xl text-headline-xl-mobile md:text-headline-xl font-bold text-on-surface">
            History
          </h1>
          <p className="font-body-md text-body-md text-secondary mt-2">
            All images that have had their backgrounds removed are automatically stored here.
          </p>
        </div>
        {images && images.length > 0 && (
          <button onClick={handleClearAll} className="inline-flex items-center gap-2 h-10 px-4 rounded-lg border border-error text-error font-label-md text-label-md hover:bg-error-container/20 transition-colors">
            <span className="material-symbols-outlined text-[18px]">delete</span>
            Delete All
          </button>
        )}
      </div>

      {/* Retention note */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-surface-container-low border border-outline-variant/30">
        <span className="material-symbols-outlined text-[20px] text-primary mt-0.5">schedule</span>
        <div>
          <p className="font-label-md text-label-md text-on-surface">Images are only stored for 1 day</p>
          <p className="font-body-sm text-body-sm text-secondary mt-1">
            Every processed image will be automatically and permanently deleted from this page after 1 day (24 hours). Make sure to download the images you need before the time runs out.
          </p>
        </div>
      </div>

      {!images ? null : images.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] gap-3 rounded-xl bg-surface-container-lowest border border-outline-variant/30 p-12 text-center">
          <span className="material-symbols-outlined text-[64px] text-secondary">photo_library</span>
          <h3 className="font-headline-sm text-headline-sm font-semibold text-on-surface">No images in History yet</h3>
          <p className="font-body-sm text-body-sm text-secondary">
            Images that have had their backgrounds removed on the Dashboard will automatically appear here.
          </p>
          <a href="/" className="mt-2 inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-on-surface text-surface font-label-md text-label-md hover:bg-inverse-surface transition-colors">
            <span className="material-symbols-outlined text-[18px]">upload</span>
            Start Removing Backgrounds
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((img) => (
            <div key={img.id} className="flex flex-col rounded-xl bg-surface-container-lowest border border-outline-variant/30 overflow-hidden shadow-sm">
              <div
                className="aspect-[4/3] w-full bg-surface-container flex items-center justify-center overflow-hidden"
                style={{
                  backgroundImage:
                    'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
                  backgroundSize: '20px 20px',
                  backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
                }}
              >
                {img.processedBlob ? <Thumbnail file={img.processedBlob} /> : <span className="material-symbols-outlined text-secondary">image</span>}
              </div>
              <div className="flex flex-col p-3 gap-2">
                <span className="font-label-md text-label-md text-on-surface truncate" title={img.originalName}>{img.originalName}</span>
                <span className="font-body-sm text-body-sm text-secondary">
                  {((img.processedBlob?.size ?? img.originalFile.size) / (1024 * 1024)).toFixed(1)} MB • {new Date(img.createdAt).toLocaleString('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <button
                    onClick={() => img.processedBlob && handleDownload(img.processedBlob, img.originalName)}
                    className="flex-1 inline-flex items-center justify-center gap-2 h-9 px-3 rounded-lg bg-on-surface text-surface font-label-md text-label-md hover:bg-inverse-surface transition-colors"
                    title="Download"
                  >
                    <span className="material-symbols-outlined text-[18px]">download</span>
                    Download
                  </button>
                  <button
                    onClick={() => handleDelete(img.id)}
                    className="w-9 h-9 rounded-lg border border-error text-error hover:bg-error-container/20 transition-colors flex items-center justify-center"
                    title="Delete"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirm delete all */}
      <ConfirmDialog
        open={confirmClearAll}
        title="Delete All Images?"
        message="This will permanently delete all images from History. This action cannot be undone."
        onCancel={() => setConfirmClearAll(false)}
        onConfirm={() => confirmClearAllImages(false)}
        onConfirmAlways={() => confirmClearAllImages(true)}
        alwaysLabel="YES, ALWAYS"
        confirmLabel="YES"
      />

      {/* Confirm delete one */}
      <ConfirmDialog
        open={confirmDeleteId !== null}
        title="Delete Image?"
        message="This image will be permanently removed from History. This action cannot be undone."
        onCancel={() => setConfirmDeleteId(null)}
        onConfirm={() => confirmDeleteImage(false)}
        onConfirmAlways={() => confirmDeleteImage(true)}
        alwaysLabel="YES, ALWAYS"
        confirmLabel="YES"
      />
    </main>
  );
}
