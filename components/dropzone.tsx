// components/dropzone.tsx
'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud } from 'lucide-react';
import { Card, CardContent } from './ui/card';

interface DropzoneProps {
  onFilesAdded: (files: File[]) => void;
  disabled?: boolean;
}

export function ImageDropzone({ onFilesAdded, disabled = false }: DropzoneProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFilesAdded(acceptedFiles);
    }
  }, [onFilesAdded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/webp': []
    },
    disabled
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed transition-colors rounded-2xl bg-surface-container-lowest p-6 sm:p-12 flex flex-col items-center justify-center min-h-[200px] sm:min-h-[300px] shadow-sm relative overflow-hidden group ${
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
        or click to select files (Supports JPG, PNG, WEBP)
      </p>
    </div>
  );
}