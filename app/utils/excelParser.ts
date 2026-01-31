import * as XLSX from 'xlsx';

export interface ParseInventoryResult {
  codLoja: number | null;
  error: string | null;
}

/**
 * Parses an inventory Excel file to extract the Cód. Loja value.
 *
 * Expected structure:
 * - Sheet: "Estoque Produtos com Valor"
 * - Row 1: Metadata (skipped)
 * - Row 2: Column headers
 * - Row 3+: Data
 *
 * @param file - The Excel file to parse
 * @returns Object with codLoja value or error message
 */
export async function parseInventoryForCodLoja(file: File): Promise<ParseInventoryResult> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });

    // Look for the specific sheet
    const sheetName = 'Estoque Produtos com Valor';
    const sheet = workbook.Sheets[sheetName];

    if (!sheet) {
      // Try to find the sheet by partial match or use first sheet
      const availableSheets = workbook.SheetNames;
      const matchingSheet = availableSheets.find(name =>
        name.toLowerCase().includes('estoque') ||
        name.toLowerCase().includes('produtos')
      );

      if (matchingSheet) {
        return parseSheetForCodLoja(workbook.Sheets[matchingSheet]);
      }

      // If no matching sheet, try first sheet
      if (availableSheets.length > 0) {
        return parseSheetForCodLoja(workbook.Sheets[availableSheets[0]]);
      }

      return { codLoja: null, error: 'Planilha não encontrada no arquivo' };
    }

    return parseSheetForCodLoja(sheet);
  } catch (error) {
    return {
      codLoja: null,
      error: error instanceof Error ? error.message : 'Erro ao ler arquivo Excel'
    };
  }
}

function parseSheetForCodLoja(sheet: XLSX.WorkSheet): ParseInventoryResult {
  // Convert sheet to JSON, starting from row 2 (index 1) for headers
  // Row 1 is metadata, Row 2 is headers, Row 3+ is data
  const data = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    defval: null
  }) as unknown[][];

  if (!data || data.length < 3) {
    return { codLoja: null, error: 'Arquivo não contém dados suficientes' };
  }

  // Row 2 (index 1) contains headers
  const headers = data[1] as (string | null)[];

  if (!headers) {
    return { codLoja: null, error: 'Cabeçalhos não encontrados' };
  }

  // Find the column index for "Cód. Loja"
  const codLojaColIndex = headers.findIndex(header => {
    if (!header) return false;
    const normalized = String(header).toLowerCase().trim();
    return normalized === 'cód. loja' ||
           normalized === 'cod. loja' ||
           normalized === 'código loja' ||
           normalized === 'codigo loja' ||
           normalized === 'cod loja';
  });

  if (codLojaColIndex === -1) {
    return { codLoja: null, error: 'Coluna "Cód. Loja" não encontrada' };
  }

  // Row 3 (index 2) is the first data row
  const firstDataRow = data[2];

  if (!firstDataRow) {
    return { codLoja: null, error: 'Nenhum dado encontrado na planilha' };
  }

  const codLojaValue = firstDataRow[codLojaColIndex];

  if (codLojaValue === null || codLojaValue === undefined || codLojaValue === '') {
    return { codLoja: null, error: null }; // No value, but not an error
  }

  const numericValue = Number(codLojaValue);

  if (isNaN(numericValue)) {
    return { codLoja: null, error: `Valor inválido para Cód. Loja: ${codLojaValue}` };
  }

  return { codLoja: numericValue, error: null };
}
