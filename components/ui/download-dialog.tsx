'use client';

import { Button } from './button';
import { Card } from './card';

type DownloadDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onDownload: () => void;
  productTitle: string;
};

export function DownloadDialog({
  isOpen,
  onClose,
  onDownload,
  productTitle,
}: DownloadDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md p-6 bg-white">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-center text-green-600">Payment Successful!</h2>
          <p className="text-center text-gray-600">
            Your payment for {productTitle} has been processed successfully.
          </p>
          <div className="grid gap-4">
            <Button
              onClick={() => {
                onDownload();
                onClose();
              }}
              className="w-full"
            >
              Download Product
            </Button>
            <Button
              onClick={onClose}
              variant="ghost"
              className="w-full"
            >
              Close
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}