'use client';

import { useState, useCallback } from 'react';
import FileUpload from './FileUpload';
import ProgressIndicator from './ProgressIndicator';
import DownloadButton from './DownloadButton';
import {
  FileSpreadsheet,
  Package,
  FileText,
  Receipt,
  ClipboardList,
  CheckCircle,
  XCircle,
  Store,
  RefreshCw,
  Edit3,
} from './Icons';
import { parseInventoryForCodLoja } from '../utils/excelParser';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

type ProcessingState = 'idle' | 'processing' | 'success' | 'error';

export default function ProcessingForm() {
  const [weeklyReport, setWeeklyReport] = useState<File[]>([]);
  const [inventoryReport, setInventoryReport] = useState<File[]>([]);
  const [nfPdfs, setNfPdfs] = useState<File[]>([]);
  const [pedidoPdfs, setPedidoPdfs] = useState<File[]>([]);
  const [mazzaReport, setMazzaReport] = useState<File[]>([]);

  const [state, setState] = useState<ProcessingState>('idle');
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultFilename, setResultFilename] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // New state for conditional Mazza input
  const [showMazzaInput, setShowMazzaInput] = useState<boolean>(false);
  const [isParsingInventory, setIsParsingInventory] = useState<boolean>(false);

  // New state for file regeneration feature
  const [showFormInSuccess, setShowFormInSuccess] = useState<boolean>(false);
  const [filesModifiedSinceSuccess, setFilesModifiedSinceSuccess] = useState<boolean>(false);

  const canProcess = weeklyReport.length > 0 && inventoryReport.length > 0;

  // Track file modifications in success state
  const trackFileChange = useCallback(() => {
    if (state === 'success' && showFormInSuccess) {
      setFilesModifiedSinceSuccess(true);
    }
  }, [state, showFormInSuccess]);

  // Wrapped file setters that track changes
  const handleWeeklyReportChange = useCallback((files: File[]) => {
    setWeeklyReport(files);
    trackFileChange();
  }, [trackFileChange]);

  const handleNfPdfsChange = useCallback((files: File[]) => {
    setNfPdfs(files);
    trackFileChange();
  }, [trackFileChange]);

  const handlePedidoPdfsChange = useCallback((files: File[]) => {
    setPedidoPdfs(files);
    trackFileChange();
  }, [trackFileChange]);

  const handleMazzaReportChange = useCallback((files: File[]) => {
    setMazzaReport(files);
    trackFileChange();
  }, [trackFileChange]);

  // Handle inventory file change with Excel parsing
  const handleInventoryChange = useCallback(async (files: File[]) => {
    setInventoryReport(files);
    trackFileChange();

    if (files.length === 0) {
      setShowMazzaInput(false);
      setMazzaReport([]);
      return;
    }

    setIsParsingInventory(true);

    try {
      const result = await parseInventoryForCodLoja(files[0]);

      if (result.codLoja === 1225) {
        setShowMazzaInput(true);
      } else {
        setShowMazzaInput(false);
        setMazzaReport([]);
      }
    } catch {
      // If parsing fails, don't show Mazza input
      setShowMazzaInput(false);
      setMazzaReport([]);
    } finally {
      setIsParsingInventory(false);
    }
  }, [trackFileChange]);

  const handleProcess = async () => {
    if (!canProcess) {
      setErrorMessage('Por favor, adicione os arquivos obrigatorios.');
      setState('error');
      return;
    }

    setState('processing');
    setErrorMessage('');
    setResultBlob(null);
    setShowFormInSuccess(false);
    setFilesModifiedSinceSuccess(false);

    try {
      const formData = new FormData();
      formData.append('weekly_report', weeklyReport[0]);
      formData.append('inventory_report', inventoryReport[0]);
      nfPdfs.forEach((pdf) => formData.append('nf_pdfs', pdf));
      pedidoPdfs.forEach((pdf) => formData.append('pedido_pdfs', pdf));

      // Add Mazza report if present
      if (mazzaReport.length > 0) {
        formData.append('mazza_report', mazzaReport[0]);
      }

      const response = await fetch(`${API_URL}/api/reports/process`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.detail || 'Erro ao processar o relatorio. Tente novamente.'
        );
      }

      const blob = await response.blob();

      // Extract filename from Content-Disposition header
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = `relatorio_processado_${new Date().toISOString().split('T')[0]}.xlsx`;
      if (contentDisposition) {
        const match = contentDisposition.match(/filename=(.+)/);
        if (match && match[1]) {
          filename = match[1].replace(/"/g, '');
        }
      }

      setResultBlob(blob);
      setResultFilename(filename);
      setState('success');
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Erro ao processar o relatorio. Tente novamente.'
      );
      setState('error');
    }
  };

  const handleReset = () => {
    setWeeklyReport([]);
    setInventoryReport([]);
    setNfPdfs([]);
    setPedidoPdfs([]);
    setMazzaReport([]);
    setState('idle');
    setResultBlob(null);
    setResultFilename('');
    setErrorMessage('');
    setShowMazzaInput(false);
    setShowFormInSuccess(false);
    setFilesModifiedSinceSuccess(false);
  };

  const handleModifyFiles = () => {
    setShowFormInSuccess(true);
    setFilesModifiedSinceSuccess(false);
  };

  const handleRegenerate = () => {
    handleProcess();
  };

  // Determine if form should be visible
  const showForm = state === 'idle' || state === 'error' || (state === 'success' && showFormInSuccess);

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Success State */}
      {state === 'success' && resultBlob && (
        <section className="bg-gradient-to-b from-success/15 to-success/5 border-2 border-success rounded-2xl p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/20 mb-4">
              <CheckCircle size={36} className="text-success" strokeWidth={1.5} />
            </div>
            <p className="text-success font-semibold text-lg">
              Relatorio processado com sucesso!
            </p>
          </div>
          <DownloadButton
            blob={resultBlob}
            filename={resultFilename}
          />

          {/* Action buttons */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            {!showFormInSuccess ? (
              <button
                onClick={handleModifyFiles}
                className="flex-1 py-3 px-4 rounded-xl font-medium text-chocolate-dark bg-white border-2 border-chocolate/20 hover:border-chocolate/40 hover:bg-chocolate/5 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Edit3 size={18} strokeWidth={1.5} />
                Modificar arquivos
              </button>
            ) : filesModifiedSinceSuccess ? (
              <button
                onClick={handleRegenerate}
                className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-chocolate to-chocolate-dark hover:from-chocolate-dark hover:to-chocolate transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              >
                <RefreshCw size={18} strokeWidth={1.5} />
                Gerar Novamente
              </button>
            ) : null}
            <button
              onClick={handleReset}
              className="flex-1 py-3 px-4 rounded-xl font-medium text-chocolate hover:text-chocolate-dark bg-transparent hover:bg-chocolate/5 transition-all duration-200"
            >
              Processar novo relatório
            </button>
          </div>
        </section>
      )}

      {/* Form sections - visible based on state */}
      {showForm && (
        <>
          {/* Section 1: Weekly Report */}
          <section className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
            <FileUpload
              label="Relatorio Semanal"
              icon={<FileSpreadsheet size={22} className="text-chocolate-dark" strokeWidth={1.5} />}
              helperText="Arraste o arquivo Excel do relatorio semanal aqui ou clique para selecionar"
              accept={{
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
                'application/vnd.ms-excel': ['.xls'],
              }}
              files={weeklyReport}
              onFilesChange={handleWeeklyReportChange}
              required
            />
          </section>

          {/* Section 2: Inventory */}
          <section className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
            <FileUpload
              label="Inventario"
              icon={<Package size={22} className="text-chocolate-dark" strokeWidth={1.5} />}
              helperText="Arraste o arquivo Excel do inventario aqui ou clique para selecionar"
              accept={{
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
                'application/vnd.ms-excel': ['.xls'],
              }}
              files={inventoryReport}
              onFilesChange={handleInventoryChange}
              required
            />
            {isParsingInventory && (
              <p className="text-sm text-chocolate/60 mt-2 flex items-center gap-2">
                <span className="inline-block w-4 h-4 border-2 border-chocolate/30 border-t-chocolate rounded-full animate-spin"></span>
                Analisando arquivo...
              </p>
            )}
          </section>

          {/* Section 3: Mazza Report (Conditional) */}
          {showMazzaInput && (
            <section className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 border-2 border-dashed border-chocolate/20">
              <FileUpload
                label="Relatório Mazza"
                icon={<Store size={22} className="text-chocolate-dark" strokeWidth={1.5} />}
                helperText="Arraste o arquivo Excel do relatório Mazza aqui ou clique para selecionar (Loja 1225)"
                accept={{
                  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
                  'application/vnd.ms-excel': ['.xls'],
                }}
                files={mazzaReport}
                onFilesChange={handleMazzaReportChange}
              />
            </section>
          )}

          {/* Section 4: PDFs (Optional) */}
          <section className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-lg font-semibold text-chocolate-dark mb-4 flex items-center gap-2">
              <FileText size={22} className="text-chocolate-dark" strokeWidth={1.5} />
              <span>PDFs</span>
              <span className="text-xs bg-gray-100 text-gray-500 px-2.5 py-0.5 rounded-full font-normal border border-gray-200">
                Opcional
              </span>
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <FileUpload
                label="Notas Fiscais (NF)"
                icon={<Receipt size={20} className="text-chocolate-dark" strokeWidth={1.5} />}
                helperText="Arraste os PDFs das notas fiscais aqui"
                accept={{ 'application/pdf': ['.pdf'] }}
                files={nfPdfs}
                onFilesChange={handleNfPdfsChange}
                multiple
              />
              <FileUpload
                label="Pedidos"
                icon={<ClipboardList size={20} className="text-chocolate-dark" strokeWidth={1.5} />}
                helperText="Arraste os PDFs dos pedidos aqui"
                accept={{ 'application/pdf': ['.pdf'] }}
                files={pedidoPdfs}
                onFilesChange={handlePedidoPdfsChange}
                multiple
              />
            </div>
          </section>

          {/* Action Button */}
          {state !== 'success' && (
            <button
              onClick={handleProcess}
              disabled={!canProcess}
              className={`
                w-full py-4 px-6 rounded-xl font-bold text-lg
                transition-all duration-300 shadow-lg
                ${
                  canProcess
                    ? 'bg-gradient-to-r from-gold to-gold/90 hover:from-gold/95 hover:to-gold/85 text-chocolate-dark hover:shadow-xl hover:scale-[1.01] active:scale-[0.99]'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }
              `}
            >
              Processar Relatorio
            </button>
          )}

          {!canProcess && state === 'idle' && (
            <p className="text-center text-chocolate/50 text-sm">
              Adicione o relatorio semanal e o inventario para continuar
            </p>
          )}
        </>
      )}

      {/* Processing State */}
      {state === 'processing' && (
        <section className="bg-white rounded-2xl p-6 shadow-md">
          <ProgressIndicator />
        </section>
      )}

      {/* Error State */}
      {state === 'error' && (
        <section className="bg-gradient-to-b from-error/15 to-error/5 border-2 border-error rounded-2xl p-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-error/20 mb-4">
              <XCircle size={36} className="text-error" strokeWidth={1.5} />
            </div>
            <p className="text-error font-semibold">{errorMessage}</p>
            <button
              onClick={() => setState('idle')}
              className="mt-4 text-chocolate hover:text-chocolate-dark text-sm font-medium transition-colors duration-200"
            >
              Tentar novamente
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
