// app/page.tsx
'use client';

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { db } from '@/lib/db';
import { imageQueue, processImageTask } from '@/lib/queue';
import { useQueueStore } from '@/lib/store';
import { applyExportSettings, buildFileName, isPassthrough, EXT_MAP } from '@/lib/export';
import { ImageDropzone } from '@/components/dropzone';
import { ImageList } from '@/components/image-list';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { toast } from '@/components/ui/toast';

export default function Home() {
  const { 
    totalImages, isProcessing, isModelReady, 
    isModelDownloading, 
    exportBgColor, exportFormat, exportResolution,
    setTotalImages, setIsProcessing, resetQueue 
  } = useQueueStore();

  // State for clear-all-data confirmation
  const [showClearModal, setShowClearModal] = useState(false);
  const [skipClearData, setSkipClearData] = useState(() =>
    typeof window !== 'undefined' && localStorage.getItem('skipClearDataConfirm') === 'true'
  );

  const handleFilesAdded = async (files: File[]) => {
    if (!files || files.length === 0) return;
    setTotalImages(totalImages + files.length);
    setIsProcessing(true);

    for (const file of files) {
      const id = uuidv4();
      await db.images.add({ id, originalFile: file, originalName: file.name, status: 'waiting', createdAt: Date.now() });
      imageQueue.add(async () => {
        try { await processImageTask(id, file); } 
        catch (error) { console.error(`Failed: ${file.name}`, error); }
      });
    }
  };

  const handleDownloadAllZip = async () => {
    const completedImages = await db.images.where('status').equals('done').toArray();
    if (completedImages.length === 0) {
      toast.add({ type: 'warning', title: 'Nothing to download', description: 'There are no processed images yet.', timeout: 4000 });
      return;
    }

    const settings = { exportBgColor, exportFormat, exportResolution };
    const zip = new JSZip();
    let added = 0;

    for (const img of completedImages) {
      if (!img.processedBlob) continue;
      const finalBlob = isPassthrough(settings)
        ? img.processedBlob
        : await applyExportSettings(img.processedBlob, settings);
      zip.file(buildFileName(img.originalName, settings), finalBlob);
      added++;
    }

    if (added === 0) {
      toast.add({ type: 'warning', title: 'Nothing to download', description: 'No processed images could be prepared.', timeout: 4000 });
      return;
    }

    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, `background-removed-images.${EXT_MAP[exportFormat] === 'jpg' ? 'zip' : 'zip'}`);
  };

  const doClearAllData = async () => {
    imageQueue.clear();
    await db.images.clear();
    resetQueue();
    toast.add({ type: 'success', title: 'All data cleared', description: 'All images and processing data have been deleted.', timeout: 4000 });
  };
 
  const handleClearAllData = () => {
    if (skipClearData) {
      doClearAllData();
    } else {
      setShowClearModal(true);
    }
  };

  const confirmClearData = (alwaysSkip: boolean) => {
    setShowClearModal(false);
    if (alwaysSkip) {
      localStorage.setItem('skipClearDataConfirm', 'true');
      setSkipClearData(true);
    }
    doClearAllData();
  };

  return (
    <>
      <main className="grow max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop py-stack-lg flex flex-col gap-stack-lg">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-stack-md">
          <div>
            <h1 className="font-headline-xl text-headline-xl-mobile md:text-headline-xl font-bold text-on-surface">
              In-Browser Background Remover
            </h1>
            <p className="font-body-md text-body-md text-secondary mt-2">
              Remove backgrounds from thousands of images for <strong className="font-bold">FREE</strong> & <strong className="font-bold">UNLIMITED</strong>.
            </p>
          </div>
        </div>

        {/* Global Actions */}
        <div className="flex flex-col sm:flex-row justify-end gap-3">
          <button onClick={handleClearAllData} className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-lg border border-error text-error font-label-md text-label-md hover:bg-error-container/20 transition-colors w-full sm:w-auto">
            <span className="material-symbols-outlined text-[18px]">delete</span>
            Clear Data
          </button>
          <button onClick={handleDownloadAllZip} className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-lg bg-on-surface text-surface font-label-md text-label-md hover:bg-inverse-surface transition-colors w-full sm:w-auto">
            <span className="material-symbols-outlined text-[18px]">download</span>
            Download All as ZIP
          </button>
        </div>

        {isProcessing && !isModelReady && !isModelDownloading && (
          <div className="p-4 border rounded-lg bg-surface-container-highest border-outline-variant/50 flex items-start space-x-3">
            <span className="material-symbols-outlined text-primary animate-spin">sync</span>
            <div>
              <h4 className="font-label-md text-label-md text-on-surface">Setting Up Local Engine...</h4>
              <p className="font-body-sm text-body-sm text-secondary mt-1">Loading the model into WebGL memory. Please wait a moment.</p>
            </div>
          </div>
        )}

        <ImageDropzone
          onFilesAdded={handleFilesAdded}
          onReject={(message) => toast.add({ type: 'error', title: 'Unsupported file', description: message, timeout: 4000 })}
          disabled={isModelDownloading}
        />

        <p className="text-center font-body-sm text-body-sm text-secondary -mt-2">
          Scroll down to download your images.
          <br />
          You can also customize your images by clicking the <span className="material-symbols-outlined text-[16px] align-middle font-bold text-black dark:text-white">tune</span> button.
        </p>

        <ImageList />
      </main>

      <ConfirmDialog
        open={showClearModal}
        title="Clear All Data?"
        message="This will permanently delete all images and processing data. This action cannot be undone."
        onCancel={() => setShowClearModal(false)}
        onConfirm={() => confirmClearData(false)}
        onConfirmAlways={() => confirmClearData(true)}
        alwaysLabel="YES, ALWAYS"
        confirmLabel="YES"
      />
    </>
  );
}