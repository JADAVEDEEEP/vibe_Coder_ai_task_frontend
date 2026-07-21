import { apiClient } from './client'

export async function exportPDF(): Promise<Blob> {
  const response = await apiClient.get('/api/export/pdf', {
    responseType: 'blob',
  })

  return response.data
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
