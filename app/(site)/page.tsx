// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { db } from '@/lib/db';
import { imageQueue, processImageTask } from '@/lib/queue';
import { useQueueStore } from '@/lib/store';
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
  const [skipClearData, setSkipClearData] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('skipClearDataConfirm') === 'true') setSkipClearData(true);
  }, []);

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

    const zip = new JSZip();
    let extension = exportFormat === 'jpeg' ? 'jpg' : exportFormat;
    const scale = exportResolution === 'low' ? 0.5 : exportResolution === 'hd' ? 2.0 : 1.0;

    // If background is NOT transparent OR format is NOT png OR scaling is active
    if (exportBgColor !== 'transparent' || exportFormat !== 'png' || scale !== 1.0) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      for (const img of completedImages) {
        if (!img.processedBlob) continue;
        
        const url = URL.createObjectURL(img.processedBlob);
        const image = new Image();
        
        await new Promise((resolve) => {
          image.onload = resolve;
          image.src = url;
        });
        
        canvas.width = image.width * scale;
        canvas.height = image.height * scale;
        if (ctx) {
          if (exportBgColor !== 'transparent') {
            ctx.fillStyle = exportBgColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          } else if (exportFormat === 'jpeg') {
            // If JPEG format and user chose transparent, force white
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }
          ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        }
        
        const mimeType = exportFormat === 'jpeg' ? 'image/jpeg' : exportFormat === 'webp' ? 'image/webp' : 'image/png';
        const finalBlob = await new Promise<Blob>((resolve) => canvas.toBlob((b) => resolve(b!), mimeType, 0.9));
        URL.revokeObjectURL(url);
        
        const nameWithoutExt = img.originalName.substring(0, img.originalName.lastIndexOf('.')) || img.originalName;
        zip.file(`${nameWithoutExt}-edited.${extension}`, finalBlob);
      }
    } else {
      // If transparent, use the original file directly (PNG)
      completedImages.forEach((img) => {
        if (img.processedBlob) {
          const nameWithoutExt = img.originalName.substring(0, img.originalName.lastIndexOf('.')) || img.originalName;
          zip.file(`${nameWithoutExt}-transparent.${extension}`, img.processedBlob);
        }
      });
    }

    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "background-removed-images.zip");
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
      <main className="flex-grow max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop py-stack-lg flex flex-col gap-stack-lg">
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

        <ImageDropzone onFilesAdded={handleFilesAdded} disabled={isProcessing && imageQueue.size > 50} />

        <p className="text-center font-body-sm text-body-sm text-secondary -mt-2">
          Scroll down to download your images.
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