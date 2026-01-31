'use client';

import { Download } from './Icons';

interface DownloadButtonProps {
  blob: Blob;
  filename: string;
}

export default function DownloadButton({ blob, filename }: DownloadButtonProps) {
  const handleDownload = () => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleDownload}
      className="
        w-full bg-gradient-to-r from-success to-success/90
        hover:from-success/95 hover:to-success/85
        text-white font-semibold
        py-4 px-6 rounded-xl transition-all duration-300
        flex items-center justify-center gap-3 text-lg
        shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99]
        group
      "
    >
      <Download
        size={22}
        strokeWidth={2}
        className="transition-transform duration-300 group-hover:translate-y-0.5"
      />
      <span>Baixar Relatorio Processado</span>
    </button>
  );
}
