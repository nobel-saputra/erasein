// Drag and drop area that accepts image files and forwards them for processing.
'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
  
interface DropzoneProps {
  onFilesAdded: (files: File[]) => void;
  onReject?: (message: string) => void;
  disabled?: boolean;
}

export function ImageDropzone({ onFilesAdded, onReject, disabled = false }: DropzoneProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFilesAdded(acceptedFiles);
    }
  }, [onFilesAdded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected: (fileRejections) => {
      if (onReject) {
        onReject('Only image files (JPG, PNG, WEBP, GIF, AVIF, BMP) are supported.');
      }
      console.warn('Rejected files:', fileRejections.map((f) => f.file.name));
    },
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/webp': [],
      'image/gif': [],
      'image/avif': [],
      'image/bmp': [],
    },
    disabled
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed transition-colors rounded-2xl bg-surface-container-lowest p-6 sm:p-12 flex flex-col items-center justify-center min-h-50 sm:min-h-75 shadow-sm relative overflow-hidden group ${
        isDragActive ? 'border-primary' : 'border-outline-variant hover:border-primary'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <input {...getInputProps()} />
      <div className={`absolute inset-0 bg-primary/5 transition-opacity pointer-events-none ${isDragActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}></div>
      <span
        className={`material-symbols-outlined text-[48px] sm:text-[64px] mb-4 transition-colors ${isDragActive ? 'text-primary' : 'text-secondary group-hover:text-primary'}`}
        style={{ fontVariationSettings: '"FILL" 0' }}
      >
        cloud_upload
      </span>
      <h3 className="font-headline-sm text-headline-sm font-semibold text-on-surface mb-2">
        {isDragActive ? 'Drop your images here...' : 'Drag & Drop Images Here'}
      </h3>
      <p className="font-body-sm text-body-sm text-secondary">
        or click to select files (Supports JPG, PNG, WEBP, GIF, AVIF, BMP)
      </p>
    </div>
  );
}