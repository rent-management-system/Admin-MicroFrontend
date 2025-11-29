/**
 * Exports data to a CSV file
 * @param data Array of objects to export
 * @param filename Name of the file (without extension)
 */
export function exportToCsv<T extends Record<string, any>>(data: T[], filename: string) {
  if (!data || data.length === 0) {
    console.error('No data to export');
    return;
  }

  // Get headers from the first object
  const headers = Object.keys(data[0]);
  
  // Create CSV content
  let csvContent = headers.join(',') + '\n';
  
  // Add rows
  data.forEach(item => {
    const row = headers.map(header => {
      const value = item[header];
      // Handle values that might contain commas or quotes
      if (value === null || value === undefined) return '';
      const escaped = String(value).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvContent += row.join(',') + '\n';
  });

  // Create a download link
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Formats property data for export
 */
export function formatPropertyForExport(property: any) {
  return {
    'ID': property.id || '',
    'Title': property.title || '',
    'Type': property.house_type || '',
    'Bedrooms': property.bedrooms || 0,
    'Bathrooms': property.bathrooms || 0,
    'Area (sqm)': property.area_sqm || '',
    'Price': property.price || '',
    'Status': property.status || '',
    'Created At': property.created_at ? new Date(property.created_at).toLocaleDateString() : '',
    'Updated At': property.updated_at ? new Date(property.updated_at).toLocaleDateString() : ''
  };
}
