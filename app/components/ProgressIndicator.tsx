'use client';

export default function ProgressIndicator() {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="w-12 h-12 border-4 border-chocolate/20 border-t-gold rounded-full animate-spin mb-4" />
      <p className="text-chocolate font-medium">Processando seu relatório...</p>
      <p className="text-chocolate/60 text-sm mt-1">
        Por favor, aguarde alguns instantes
      </p>
    </div>
  );
}
