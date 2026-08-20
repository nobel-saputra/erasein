// components/image-list.tsx
'use client';

import { useMemo, useState, useEffect } from 'react';
import Image from 'next/image';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, ImageRecord } from '../lib/db';
import { useQueueStore } from '../lib/store';

const Thumbnail = ({ file }: { file: Blob }) => {
  const url = useMemo(() => URL.createObjectURL(file), [file]);
  useEffect(() => () => URL.revokeObjectURL(url), [url]);
  return <Image src={url} alt="thumbnail" fill unoptimized sizes="48px" className="object-cover" />;
};

function ExportControls({ stacked = false }: { stacked?: boolean }) {
  const { exportBgColor, exportFormat, exportResolution, setExportBgColor, setExportFormat, setExportResolution } = useQueueStore();
  const wrapper = stacked ? 'flex flex-col gap-5 w-full' : 'flex flex-col lg:flex-row gap-6 items-start w-full';
  const divider = stacked ? 'w-full h-px bg-outline-variant/30' : 'w-px h-6 bg-outline-variant hidden lg:block self-center';

  return (
    <div className={wrapper}>
      {/* Format */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
        <span className="font-label-sm text-label-sm text-secondary sm:min-w-20 shrink-0">Format:</span>
        <div className="flex flex-wrap bg-surface-container-low dark:bg-surface-dim rounded-lg p-1 w-fit">
          {['png', 'webp', 'jpeg'].map((fmt) => (
            <button
              key={fmt}
              onClick={() => setExportFormat(fmt as 'png' | 'webp' | 'jpeg')}
              className={`px-3 py-1.5 rounded-md text-label-sm font-medium transition-colors ${
                exportFormat === fmt ? 'bg-surface shadow-sm text-on-surface dark:bg-surface-container dark:text-on-surface' : 'text-secondary hover:text-on-surface'
              }`}
            >
              {fmt === 'jpeg' ? 'JPG' : fmt.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
      <div className={divider}></div>

      {/* Background Color */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
        <span className="font-label-sm text-label-sm text-secondary sm:min-w-20 shrink-0">Background:</span>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setExportBgColor('transparent')}
            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center relative shrink-0 ${exportBgColor === 'transparent' ? 'border-primary ring-2 ring-primary/20' : 'border-outline-variant'}`}
            style={exportBgColor === 'transparent' ? { backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)', backgroundSize: '8px 8px' } : {}}
            title="Transparent"
          >
            <span className="material-symbols-outlined text-[16px] absolute text-secondary">grid_on</span>
          </button>
          <button onClick={() => setExportBgColor('#FFFFFF')} className={`w-8 h-8 rounded-full bg-white border shrink-0 ${exportBgColor === '#FFFFFF' ? 'border-primary ring-2 ring-primary/20' : 'border-outline-variant'}`} title="White" />
          <button onClick={() => setExportBgColor('#000000')} className={`w-8 h-8 rounded-full bg-black border shrink-0 ${exportBgColor === '#000000' ? 'border-primary ring-2 ring-primary/20' : 'border-outline-variant'}`} title="Black" />
          <button onClick={() => setExportBgColor('#FF0000')} className={`w-8 h-8 rounded-full bg-red-600 border shrink-0 ${exportBgColor === '#FF0000' ? 'border-primary ring-2 ring-primary/20' : 'border-outline-variant'}`} title="Red" />
          <div className={`relative flex items-center justify-center w-8 h-8 rounded-full overflow-hidden border border-dashed hover:bg-surface-container transition-colors shrink-0 ${!['transparent','#FFFFFF','#000000','#FF0000'].includes(exportBgColor) ? 'border-primary border-solid ring-2 ring-primary/20' : 'border-outline-variant'}`} title="Custom Color">
            <input type="color" value={!['transparent'].includes(exportBgColor) ? exportBgColor : '#ff0000'} onChange={(e) => setExportBgColor(e.target.value)} className="absolute -inset-2.5 w-14 h-14 cursor-pointer" />
            {!['transparent','#FFFFFF','#000000','#FF0000'].includes(exportBgColor) ? null : <span className="material-symbols-outlined text-[16px] text-secondary pointer-events-none">colorize</span>}
          </div>
          <button onClick={() => setExportBgColor('#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0'))} className="w-8 h-8 rounded-full border border-outline-variant border-dashed flex items-center justify-center hover:bg-surface-container transition-colors shrink-0" title="Random Color">
            <span className="material-symbols-outlined text-[16px] text-secondary">casino</span>
          </button>
        </div>
      </div>
      <div className={divider}></div>

      {/* Quality */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
        <span className="font-label-sm text-label-sm text-secondary sm:min-w-20 shrink-0">Quality:</span>
        <div className="flex flex-wrap bg-surface-container-low dark:bg-surface-dim rounded-lg p-1 w-fit">
          {['low', 'standard', 'hd'].map((res) => (
            <button
              key={res}
              onClick={() => setExportResolution(res as 'low' | 'standard' | 'hd')}
              className={`px-3 py-1.5 rounded-md text-label-sm font-medium transition-colors ${
                exportResolution === res ? 'bg-surface shadow-sm text-on-surface dark:bg-surface-container dark:text-on-surface' : 'text-secondary hover:text-on-surface'
              }`}
            >
              {res === 'low' ? 'LOW' : res === 'standard' ? 'STANDAR' : 'HD'}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ImageList() {
  const images = useLiveQuery(() => db.images.orderBy('createdAt').reverse().toArray());
  
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [skipConfirm, setSkipConfirm] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('skipDeleteConfirm') === 'true';
  });
  const [compareItem, setCompareItem] = useState<ImageRecord | null>(null);
  const [sliderPos, setSliderPos] = useState(50);
  const [isZoomed, setIsZoomed] = useState(false);
  const originalUrl = useMemo(
    () => (compareItem && compareItem.processedBlob ? URL.createObjectURL(compareItem.originalFile) : ''),
    [compareItem]
  );
  const processedUrl = useMemo(
    () => (compareItem && compareItem.processedBlob ? URL.createObjectURL(compareItem.processedBlob) : ''),
    [compareItem]
  );
  
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [settingsOpen, setSettingsOpen] = useState(false);

  const { exportBgColor, exportFormat, exportResolution } = useQueueStore();

  useEffect(() => {
    return () => {
      if (originalUrl) URL.revokeObjectURL(originalUrl);
      if (processedUrl) URL.revokeObjectURL(processedUrl);
    };
  }, [originalUrl, processedUrl]);

  if (!images || images.length === 0) return null;

  const handleDeleteClick = (id: string) => skipConfirm ? db.images.delete(id) : setItemToDelete(id);
  
  const confirmDelete = (alwaysSkip: boolean) => {
    if (itemToDelete) {
      db.images.delete(itemToDelete);
      if (alwaysSkip) { localStorage.setItem('skipDeleteConfirm', 'true'); setSkipConfirm(true); }
      setItemToDelete(null);
    }
  };

  const handleDownloadSingle = async (blob: Blob, originalName: string) => {
    let finalBlob = blob;
    const extension = exportFormat === 'jpeg' ? 'jpg' : exportFormat;
    const scale = exportResolution === 'low' ? 0.5 : exportResolution === 'hd' ? 2.0 : 1.0;

    // Jika background BUKAN transparan ATAU format BUKAN png ATAU ada scaling (scale !== 1)
    if (exportBgColor !== 'transparent' || exportFormat !== 'png' || scale !== 1.0) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new (globalThis as any).Image();
      const url = URL.createObjectURL(blob);

      await new Promise((resolve) => {
        img.onload = resolve;
        img.src = url;
      });

      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      if (ctx) {
        // Warnai background
        if (exportBgColor !== 'transparent') {
          ctx.fillStyle = exportBgColor; 
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else if (exportFormat === 'jpeg') {
          // Jika format JPEG dan user pilih transparan, paksa jadi putih
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height); 
      }

      // Konversi hasil canvas ke blob format yang diinginkan
      const mimeType = exportFormat === 'jpeg' ? 'image/jpeg' : exportFormat === 'webp' ? 'image/webp' : 'image/png';
      finalBlob = await new Promise<Blob>((resolve) => canvas.toBlob((b) => resolve(b!), mimeType, 0.9));
      URL.revokeObjectURL(url);
    }

    // Proses Download
    const downloadUrl = URL.createObjectURL(finalBlob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.')) || originalName;
    a.download = `${nameWithoutExt}-edited.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(downloadUrl);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'waiting': return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-variant text-secondary font-label-sm text-label-sm whitespace-nowrap"><span className="material-symbols-outlined text-[14px]">schedule</span>Waiting</span>;
      case 'processing': return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary-container/20 text-primary-container dark:text-primary-fixed-dim font-label-sm text-label-sm whitespace-nowrap"><span className="material-symbols-outlined text-[14px] animate-spin">sync</span>Processing</span>;
      case 'done': return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 font-label-sm text-label-sm whitespace-nowrap"><span className="material-symbols-outlined text-[14px]">check_circle</span>Done</span>;
      case 'error': return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 font-label-sm text-label-sm whitespace-nowrap"><span className="material-symbols-outlined text-[14px]">error</span>Failed</span>;
      default: return null;
    }
  };

  return (
    <div className="mt-2 relative w-full">
      
      {/* Processing Queue */}
      <div className="flex flex-col gap-4">
        {/* Queue Header */}
        <div className="flex flex-col gap-2 border-b border-outline-variant/30 pb-3">
          {/* Top row: title + settings button */}
          <div className="flex items-center justify-between">
            <h2 className="font-headline-sm text-headline-sm font-semibold text-on-surface">
              Processing Queue
            </h2>
            <button
              onClick={() => setSettingsOpen(true)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-label-sm text-label-sm transition-all border ${
                settingsOpen
                  ? 'bg-primary/10 border-primary text-primary'
                  : 'border-outline-variant text-secondary hover:bg-surface-container hover:text-primary hover:border-primary/50'
              }`}
              title="Image Settings"
            >
              <span className="material-symbols-outlined text-[16px]">tune</span>
              <span className="hidden sm:inline">Settings</span>
            </button>
          </div>
          {/* Bottom row: filter pills — horizontally scrollable on mobile */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-0.5 px-0.5">
            {['all', 'waiting', 'processing', 'done', 'error'].map((f) => (
              <button 
                key={f} 
                onClick={() => setFilterStatus(f)}
                className={`px-3 py-1 rounded-full font-label-sm text-label-sm transition-colors shrink-0 ${
                  filterStatus === f 
                    ? 'bg-on-surface text-surface' 
                    : 'border border-outline-variant text-secondary hover:bg-surface-container'
                }`}
              >
                {f === 'all' ? 'All' : f === 'done' ? 'Done' : f === 'error' ? 'Failed' : f === 'processing' ? 'Processing' : 'Waiting'}
              </button>
            ))}
          </div>
        </div>
        
        {/* Queue Items List */}
        {(() => {
          const filteredImages = images.filter(img => filterStatus === 'all' || img.status === filterStatus);
          return (
            <div className="flex flex-col gap-3 bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-3 sm:p-4 shadow-sm overflow-y-auto max-h-125">
              {filteredImages.length === 0 ? (
                <div className="py-6 text-center text-secondary font-body-sm text-body-sm">
                  No images in this filter queue.
                </div>
              ) : (
                filteredImages.map((img) => (
                  <div key={img.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg hover:bg-surface-container-low transition-colors group border border-transparent hover:border-outline-variant/30">
                    <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto min-w-0 overflow-hidden">
                      <div className="relative w-12 h-12 rounded bg-surface-container flex items-center justify-center shrink-0 overflow-hidden border border-outline-variant/30">
                        {img.status === 'done' && img.processedBlob ? <Thumbnail file={img.processedBlob} /> : img.status !== 'waiting' ? <Thumbnail file={img.originalFile} /> : <span className="material-symbols-outlined text-secondary">image</span>}
                      </div>
                      <div className="flex flex-col grow sm:grow-0 min-w-0 sm:min-w-50">
                        <span className="font-label-md text-label-md text-on-surface truncate max-w-35 sm:max-w-50 md:max-w-md" title={img.originalName}>{img.originalName}</span>
                        {img.status === 'processing' ? (
                          <div className="w-full bg-surface-container-high rounded-full h-1.5 mt-2 overflow-hidden">
                             <div className="bg-primary h-1.5 rounded-full animate-pulse w-1/2"></div>
                          </div>
                        ) : (
                          <span className="font-body-sm text-body-sm text-secondary truncate mt-1">
                            {(img.originalFile.size / (1024*1024)).toFixed(1)} MB • {img.originalFile.type.split('/')[1]?.toUpperCase() || 'IMG'}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-4 justify-between sm:justify-end sm:shrink-0">
                      {getStatusBadge(img.status)}
                      <div className="flex items-center gap-1.5">
                        {img.status === 'done' && img.processedBlob && (
                          <>
                            <button onClick={() => { setCompareItem(img); setSliderPos(50); setIsZoomed(false); }} className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center text-primary transition-colors" title="View">
                              <span className="material-symbols-outlined text-[18px]">visibility</span>
                            </button>
                            <button onClick={() => handleDownloadSingle(img.processedBlob!, img.originalName)} className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center text-primary transition-colors" title="Download">
                              <span className="material-symbols-outlined text-[18px]">download</span>
                            </button>
                          </>
                        )}
                        {/* Settings shortcut per item */}
                        <button
                          onClick={() => setSettingsOpen(true)}
                          className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center text-secondary hover:text-primary transition-colors"
                          title="Image Settings (Format, Background, Quality)"
                        >
                          <span className="material-symbols-outlined text-[18px]">tune</span>
                        </button>
                        <button onClick={() => handleDeleteClick(img.id)} className="w-8 h-8 rounded-full hover:bg-error-container/50 flex items-center justify-center text-error transition-colors" title={img.status === 'processing' ? 'Cancel' : 'Delete'}>
                          <span className="material-symbols-outlined text-[18px]">{img.status === 'processing' ? 'close' : 'delete'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          );
        })()}
      </div>

      {/* Pop-up Hapus Data & Slider (Kode Tetap Sama, disembunyikan untuk keringkasan) */}
      {/* Image Settings Modal */}
      {settingsOpen && (
        <div className="fixed inset-0 z-65 flex items-center justify-center bg-black/50 p-4" onClick={() => setSettingsOpen(false)}>
          <div className="p-6 max-w-md w-full shadow-lg bg-surface-container-lowest rounded-xl border border-outline-variant/30 animate-in fade-in zoom-in-95 duration-200 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-1">
              <h3 className="font-headline-sm text-headline-sm text-on-surface">Image Settings</h3>
              <button onClick={() => setSettingsOpen(false)} className="p-1 rounded-full hover:bg-surface-container transition-colors text-secondary" aria-label="Close">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <p className="font-body-sm text-body-sm text-secondary mb-5">
              These settings apply to the entire processing queue at once.
            </p>
            <ExportControls stacked />
          </div>
        </div>
      )}

      {/* Pop-up Hapus Data */}
      {itemToDelete && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4">
          <div className="p-6 max-w-sm w-full shadow-lg bg-surface-container-lowest rounded-xl border border-outline-variant/30 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">Delete Image?</h3>
            <p className="font-body-sm text-body-sm text-secondary mb-6">This action cannot be undone.</p>
            <div className="flex justify-end space-x-2">
              <button className="px-4 py-2 font-label-md text-label-md rounded-lg text-secondary hover:bg-surface-container transition-colors" onClick={() => setItemToDelete(null)}>Cancel</button>
              <button className="px-4 py-2 font-label-md text-label-md rounded-lg bg-error text-on-error hover:bg-error/90 transition-colors" onClick={() => confirmDelete(false)}>Delete</button>
              <button className="px-4 py-2 font-label-md text-label-md rounded-lg bg-surface-container-high text-on-surface hover:bg-surface-variant transition-colors" onClick={() => confirmDelete(true)}>Always</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL COMPARISON SLIDER */}
      {compareItem && originalUrl && processedUrl && (
        <div className="fixed inset-0 z-70 flex flex-col bg-[#131b2e]/95 backdrop-blur-md">
          {/* Top Bar */}
          <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-4 border-b border-slate-800/50">
            <h3 className="text-white font-headline-sm text-headline-sm truncate min-w-0 flex-1 max-w-2xl">{compareItem.originalName}</h3>
            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
              <button onClick={() => setIsZoomed(!isZoomed)} className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-all" title="Zoom">
                <span className="material-symbols-outlined">{isZoomed ? 'zoom_out' : 'zoom_in'}</span>
              </button>
              <button onClick={() => compareItem.processedBlob && handleDownloadSingle(compareItem.processedBlob, compareItem.originalName)} className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-all" title="Download">
                <span className="material-symbols-outlined">download</span>
              </button>
              <button onClick={() => setCompareItem(null)} className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-all" title="Close">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
          </div>
          {/* Comparison Area */}
          <div className={`grow flex items-center justify-center p-4 sm:p-6 relative ${isZoomed ? 'overflow-auto' : 'overflow-hidden'}`}>
            <div className={`relative rounded-xl overflow-hidden shadow-2xl border border-slate-700/50 group select-none transition-all duration-200 ${isZoomed ? 'w-[150%] max-w-none aspect-video' : 'w-full max-w-6xl aspect-video'}`}>
              {/* After (Background Removed / Transparent) Background */}
              <div className="absolute inset-0 z-0 checkerboard-bg"></div>
              {/* After Image */}
              <Image
                src={processedUrl}
                alt="EraseIn Result"
                fill
                unoptimized
                sizes="100vw"
                className="object-cover z-10 pointer-events-none"
                style={{ clipPath: `polygon(${sliderPos}% 0, 100% 0, 100% 100%, ${sliderPos}% 100%)` }}
              />
              {/* Original Image (Left Side) */}
              <Image
                src={originalUrl}
                alt="Original Image"
                fill
                unoptimized
                sizes="100vw"
                className="object-cover z-20 pointer-events-none"
                style={{ clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)` }}
              />
              {/* Slider Line & Handle */}
              <div className="absolute inset-y-0 w-0.5 bg-white z-30 cursor-ew-resize shadow-[0_0_8px_rgba(0,0,0,0.5)]" style={{ left: `calc(${sliderPos}% - 1px)` }}>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg border border-slate-200 hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-slate-800 text-[18px]" style={{ transform: 'rotate(90deg)' }}>unfold_more</span>
                </div>
              </div>
              {/* Floating Labels */}
              <div className="absolute top-6 left-6 z-40 bg-black/60 backdrop-blur-md text-white font-label-md text-label-md px-4 py-2 rounded-lg border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                Original
              </div>
              <div className="absolute top-6 right-6 z-40 bg-black/60 backdrop-blur-md text-white font-label-md text-label-md px-4 py-2 rounded-lg border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                EraseIn
              </div>
              <input type="range" min="0" max="100" value={sliderPos} onChange={(e) => setSliderPos(Number(e.target.value))} className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-50" />
            </div>
          </div>
          {/* Bottom Helper Text */}
          <div className="text-center pb-8 px-4">
            <span className="text-slate-400 font-body-sm text-body-sm">Drag left/right to compare</span>
          </div>
        </div>
      )}
    </div>
  );
}