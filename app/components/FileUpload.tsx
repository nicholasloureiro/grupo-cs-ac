'use client';

import { useCallback, ReactNode } from 'react';
import { useDropzone } from 'react-dropzone';
import { X } from './Icons';

interface FileUploadProps {
  label: string;
  icon: ReactNode;
  helperText: string;
  accept: Record<string, string[]>;
  multiple?: boolean;
  files: File[];
  onFilesChange: (files: File[]) => void;
  required?: boolean;
}

export default function FileUpload({
  label,
  icon,
  helperText,
  accept,
  multiple = false,
  files,
  onFilesChange,
  required = false,
}: FileUploadProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (multiple) {
        onFilesChange([...files, ...acceptedFiles]);
      } else {
        onFilesChange(acceptedFiles.slice(0, 1));
      }
    },
    [files, multiple, onFilesChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple,
  });

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    onFilesChange(newFiles);
  };

  const hasFiles = files.length > 0;

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-chocolate-dark">{icon}</span>
        <h3 className="font-semibold text-chocolate-dark">{label}</h3>
        {required ? (
          <span className="text-xs bg-gradient-to-r from-gold to-gold/80 text-chocolate-dark px-2.5 py-0.5 rounded-full font-medium shadow-sm">
            Obrigatorio
          </span>
        ) : (
          <span className="text-xs bg-gray-100 text-gray-500 px-2.5 py-0.5 rounded-full border border-gray-200">
            Opcional
          </span>
        )}
      </div>

      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
          transition-all duration-300 ease-out
          ${
            isDragActive
              ? 'border-gold bg-gradient-to-b from-gold/15 to-gold/5 scale-[1.02]'
              : hasFiles
              ? 'border-success bg-gradient-to-b from-success/10 to-success/5'
              : 'border-chocolate/20 hover:border-gold hover:bg-gradient-to-b hover:from-gold/10 hover:to-transparent'
          }
        `}
      >
        <input {...getInputProps()} />

        {!hasFiles ? (
          <div className="text-chocolate/70">
            <p className="text-sm font-medium">{helperText}</p>
            <p className="text-xs mt-2 text-chocolate/40">
              {Object.values(accept).flat().join(', ')}
            </p>
          </div>
        ) : (
          <div className="text-success">
            <p className="font-semibold">
              {files.length === 1
                ? 'Arquivo selecionado'
                : `${files.length} arquivos selecionados`}
            </p>
          </div>
        )}
      </div>

      {hasFiles && (
        <div className="mt-3 space-y-2">
          {files.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center justify-between bg-white rounded-lg px-4 py-2.5 text-sm border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <span className="text-chocolate truncate max-w-[80%] font-medium">
                {file.name}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(index);
                }}
                className="text-error/70 hover:text-error hover:bg-error/10 p-1 rounded-full transition-all duration-200"
                title="Remover arquivo"
              >
                <X size={16} strokeWidth={2} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
