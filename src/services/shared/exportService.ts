import { toast } from 'sonner';

export interface ExportColumn {
  key: string;
  title: string;
  render?: (value: any, record: any) => string;
}

export interface ExportOptions {
  filename: string;
  data: any[];
  columns?: ExportColumn[];
  format: 'csv' | 'json' | 'excel' | 'pdf';
  title?: string;
  description?: string;
}

class ExportService {
  private downloadFile(content: string | Blob, filename: string, mimeType: string) {
    const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  async exportToCSV(options: ExportOptions): Promise<void> {
    const { filename, data, columns } = options;

    try {
      if (data.length === 0) {
        toast.error('Tidak ada data untuk diekspor');
        return;
      }

      let csvContent = '';
      
      // Use provided columns or infer from first data item
      const headers = columns 
        ? columns.map(col => col.title)
        : Object.keys(data[0]);
      
      const keys = columns 
        ? columns.map(col => col.key)
        : Object.keys(data[0]);

      // Add BOM for proper UTF-8 encoding in Excel
      csvContent = '\uFEFF';

      // Add headers
      csvContent += headers.join(',') + '\n';

      // Add data rows
      data.forEach(item => {
        const row = keys.map(key => {
          const column = columns?.find(col => col.key === key);
          let value = item[key];
          
          if (column?.render) {
            value = column.render(value, item);
          }
          
          // Handle null/undefined values
          if (value === null || value === undefined) {
            return '';
          }
          
          // Convert to string and escape
          value = String(value);
          
          // Escape quotes and wrap in quotes if necessary
          if (value.includes('"')) {
            value = value.replace(/"/g, '""');
          }
          
          if (value.includes(',') || value.includes('"') || value.includes('\n') || value.includes('\r')) {
            value = `"${value}"`;
          }
          
          return value;
        });
        csvContent += row.join(',') + '\n';
      });

      this.downloadFile(csvContent, `${filename}.csv`, 'text/csv;charset=utf-8;');
      toast.success(`Data berhasil diekspor ke ${filename}.csv`);
    } catch (error) {
      console.error('Export CSV error:', error);
      toast.error('Gagal mengekspor data ke CSV');
      throw error;
    }
  }

  async exportToJSON(options: ExportOptions): Promise<void> {
    const { filename, data, columns } = options;

    try {
      if (data.length === 0) {
        toast.error('Tidak ada data untuk diekspor');
        return;
      }

      let exportData = data;

      // Filter and transform data if columns are specified
      if (columns) {
        exportData = data.map(item => {
          const filteredItem: any = {};
          columns.forEach(column => {
            let value = item[column.key];
            if (column.render) {
              value = column.render(value, item);
            }
            filteredItem[column.key] = value;
          });
          return filteredItem;
        });
      }

      const jsonContent = JSON.stringify({
        exportedAt: new Date().toISOString(),
        totalRecords: exportData.length,
        data: exportData,
      }, null, 2);

      this.downloadFile(jsonContent, `${filename}.json`, 'application/json');
      toast.success(`Data berhasil diekspor ke ${filename}.json`);
    } catch (error) {
      console.error('Export JSON error:', error);
      toast.error('Gagal mengekspor data ke JSON');
      throw error;
    }
  }

  async exportData(options: ExportOptions): Promise<void> {
    const { format } = options;

    switch (format) {
      case 'csv':
        return this.exportToCSV(options);
      case 'json':
        return this.exportToJSON(options);
      case 'excel':
        toast.info('Export Excel akan segera tersedia');
        break;
      case 'pdf':
        toast.info('Export PDF akan segera tersedia');
        break;
      default:
        toast.error('Format export tidak didukung');
        throw new Error(`Unsupported export format: ${format}`);
    }
  }

  // Helper method to prepare data for export
  prepareDataForExport<T extends Record<string, any>>(
    data: T[],
    columns: ExportColumn[]
  ): any[] {
    return data.map(item => {
      const exportItem: any = {};
      columns.forEach(column => {
        let value = item[column.key];
        if (column.render) {
          value = column.render(value, item);
        }
        exportItem[column.title] = value;
      });
      return exportItem;
    });
  }
}

export const exportService = new ExportService();