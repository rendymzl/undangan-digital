import { useCallback } from 'react';
import { toast } from 'sonner';

export type ExportFormat = 'csv' | 'excel' | 'pdf' | 'json';

export interface ExportOptions {
  filename?: string;
  format: ExportFormat;
  data: any[];
  columns?: Array<{
    key: string;
    title: string;
    render?: (value: any) => string;
  }>;
  title?: string;
  description?: string;
}

export default function useExport() {
  const downloadFile = useCallback((content: string | Blob, filename: string, mimeType: string) => {
    const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, []);

  const exportToCSV = useCallback((data: any[], filename: string, columns?: ExportOptions['columns']) => {
    try {
      let csvContent = '';
      
      if (data.length === 0) {
        toast.error('Tidak ada data untuk diekspor');
        return;
      }

      // Use provided columns or infer from first data item
      const headers = columns 
        ? columns.map(col => col.title)
        : Object.keys(data[0]);
      
      const keys = columns 
        ? columns.map(col => col.key)
        : Object.keys(data[0]);

      // Add headers
      csvContent += headers.join(',') + '\n';

      // Add data rows
      data.forEach(item => {
        const row = keys.map(key => {
          const column = columns?.find(col => col.key === key);
          let value = item[key];
          
          if (column?.render) {
            value = column.render(value);
          }
          
          // Escape commas and quotes
          if (typeof value === 'string') {
            value = value.replace(/"/g, '""');
            if (value.includes(',') || value.includes('"') || value.includes('\n')) {
              value = `"${value}"`;
            }
          }
          
          return value || '';
        });
        csvContent += row.join(',') + '\n';
      });

      downloadFile(csvContent, `${filename}.csv`, 'text/csv;charset=utf-8;');
      toast.success('Data berhasil diekspor ke CSV');
    } catch (error) {
      console.error('Export CSV error:', error);
      toast.error('Gagal mengekspor data ke CSV');
    }
  }, [downloadFile]);

  const exportToJSON = useCallback((data: any[], filename: string) => {
    try {
      if (data.length === 0) {
        toast.error('Tidak ada data untuk diekspor');
        return;
      }

      const jsonContent = JSON.stringify(data, null, 2);
      downloadFile(jsonContent, `${filename}.json`, 'application/json');
      toast.success('Data berhasil diekspor ke JSON');
    } catch (error) {
      console.error('Export JSON error:', error);
      toast.error('Gagal mengekspor data ke JSON');
    }
  }, [downloadFile]);

  const exportData = useCallback(async (options: ExportOptions) => {
    const {
      filename = 'export',
      format,
      data,
      columns,
    } = options;

    try {
      switch (format) {
        case 'csv':
          exportToCSV(data, filename, columns);
          break;
        case 'json':
          exportToJSON(data, filename);
          break;
        case 'excel':
          // TODO: Implement Excel export using a library like xlsx
          toast.info('Export Excel akan segera tersedia');
          break;
        case 'pdf':
          // TODO: Implement PDF export using a library like jsPDF
          toast.info('Export PDF akan segera tersedia');
          break;
        default:
          toast.error('Format export tidak didukung');
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Gagal mengekspor data');
    }
  }, [exportToCSV, exportToJSON]);

  return {
    exportData,
    exportToCSV,
    exportToJSON,
    downloadFile,
  };
}