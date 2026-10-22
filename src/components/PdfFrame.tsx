import { useEffect, useState } from 'react';
import { FileText, ExternalLink, Download } from 'lucide-react';

/**
 * iOS Safari (and mobile Chrome) do not render PDFs inside an <iframe> —
 * the frame just stays blank. So on those devices we show an "open" card
 * instead, which hands the file to the OS PDF viewer in a new tab.
 */
const detectEmbeddable = (): boolean => {
  if (typeof window === 'undefined') return true;
  const ua = navigator.userAgent;
  const isIOS =
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  return !isIOS && !coarse;
};

interface PdfFrameProps {
  src: string;
  title: string;
  subtitle?: string;
  pages?: number;
  className?: string;
}

export const PdfFrame = ({ src, title, subtitle, pages, className }: PdfFrameProps) => {
  const [canEmbed, setCanEmbed] = useState(true);

  useEffect(() => {
    setCanEmbed(detectEmbeddable());
  }, []);

  if (canEmbed) {
    return (
      <iframe
        src={src}
        title={title}
        allow="fullscreen"
        className={`h-full w-full border-0 bg-white ${className ?? ''}`}
      />
    );
  }

  return (
    <div
      className={`flex h-full w-full flex-col items-center justify-center gap-3 bg-gray-50 p-6 text-center ${
        className ?? ''
      }`}
    >
      <FileText className="h-12 w-12 text-gray-300" />
      <div>
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        {pages !== undefined && <p className="text-xs text-gray-400">{pages} pages</p>}
      </div>
      <p className="max-w-sm text-xs text-gray-500">
        In-page PDF previews aren&apos;t supported on this device — open it in a new tab instead.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white"
        >
          <ExternalLink className="h-4 w-4" />
          Open PDF
        </a>
        <a
          href={src}
          download
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700"
        >
          <Download className="h-4 w-4" />
          Download
        </a>
      </div>
    </div>
  );
};

export default PdfFrame;
