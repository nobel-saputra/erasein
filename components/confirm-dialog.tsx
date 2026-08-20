// components/confirm-dialog.tsx
'use client';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  alwaysLabel?: string;
  onCancel: () => void;
  onConfirm: () => void;
  onConfirmAlways?: () => void;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'YES',
  alwaysLabel = 'YES, ALWAYS',
  onCancel,
  onConfirm,
  onConfirmAlways,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4" onClick={onCancel}>
      <div className="p-6 max-w-sm w-full shadow-lg bg-surface-container-lowest rounded-xl border border-outline-variant/30 animate-in fade-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">{title}</h3>
        <p className="font-body-sm text-body-sm text-secondary mb-6">{message}</p>
        <div className="flex justify-end space-x-2">
          <button className="px-4 py-2 font-label-md text-label-md rounded-lg text-secondary hover:bg-surface-container transition-colors" onClick={onCancel}>
            NO
          </button>
          {onConfirmAlways && (
            <button className="px-4 py-2 font-label-md text-label-md rounded-lg bg-surface-container-high text-on-surface hover:bg-surface-variant transition-colors" onClick={onConfirmAlways}>
              {alwaysLabel}
            </button>
          )}
          <button className="px-4 py-2 font-label-md text-label-md rounded-lg bg-error text-on-error hover:bg-error/90 transition-colors" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
