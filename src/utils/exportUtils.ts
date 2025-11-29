/**
 * Exports data to a CSV file
 * @param data Array of objects to export
 * @param filename Name of the file (without extension)
 */
export function exportToCsv<T extends Record<string, any>>(data: T[], filename: string) {
  try {
    console.log('Starting CSV export with data:', data);
    
    if (!data || !Array.isArray(data) || data.length === 0) {
      const error = 'No data to export or invalid data format';
      console.error(error);
      throw new Error(error);
    }

    // Get headers from all objects to ensure we catch all possible fields
    const headers = Array.from(
      new Set(
        data.reduce((acc: string[], item) => {
          if (item && typeof item === 'object') {
            return [...acc, ...Object.keys(item)];
          }
          return acc;
        }, [])
      )
    );
    
    if (headers.length === 0) {
      const error = 'No valid headers found in the data';
      console.error(error);
      throw new Error(error);
    }
    
    console.log('CSV Headers:', headers);
    
    // Create CSV content
    let csvContent = headers.join(',') + '\n';
    
    // Add rows
    data.forEach((item, index) => {
      try {
        const row = headers.map(header => {
          const value = item[header];
          // Handle different value types
          if (value === null || value === undefined || value === '') return '';
          
          // Convert value to string and escape quotes
          let stringValue = String(value);
          
          // Escape quotes and handle line breaks
          stringValue = stringValue
            .replace(/"/g, '""')  // Escape double quotes
            .replace(/\r\n/g, ' ')  // Replace Windows line breaks
            .replace(/\n/g, ' ')    // Replace Unix line breaks
            .replace(/\r/g, ' ');   // Replace old Mac line breaks
            
          // Wrap in quotes if value contains comma, newline, or quote
          if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
            return `"${stringValue}"`;
          }
          return stringValue;
        });
        
        csvContent += row.join(',') + '\n';
      } catch (rowError) {
        console.error(`Error processing row ${index}:`, rowError);
        throw new Error(`Failed to process row ${index + 1}`);
      }
    });
    
    console.log('Generated CSV content (first 500 chars):', csvContent.substring(0, 500));
    
    // Create a download link
    const blob = new Blob(['\uFEFF' + csvContent], { 
      type: 'text/csv;charset=utf-8;' 
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    console.log('Triggering download...');
    link.click();
    
    // Cleanup
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
    
    return true;
  } catch (error) {
    console.error('Error in exportToCsv:', error);
    throw error; // Re-throw to be handled by the caller
  }
}

/**
 * Formats property data for export with comprehensive details
 */
export function formatPropertyForExport(property: any) {
  // Format address
  const address = property.address || {};
  const location = property.location || {};
  const pricing = property.pricing || {};
  const features = property.features || {};
  const agent = property.agent || {};
  const status = property.status || 'Available';
  
  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return {
    'Property ID': property.id || '',
    'Title': property.title || '',
    'Description': property.description || '',
    'Property Type': property.house_type || '',
    'Property Status': status.charAt(0).toUpperCase() + status.slice(1),
    'Price': pricing.amount ? `$${pricing.amount.toLocaleString()}` : 'N/A',
    'Price Type': pricing.type || 'Fixed',
    'Bedrooms': property.bedrooms || 0,
    'Bathrooms': property.bathrooms || 0,
    'Area (sqft)': property.area || 0,
    'Year Built': property.year_built || 'N/A',
    'Address Line 1': address.line1 || '',
    'Address Line 2': address.line2 || '',
    'City': address.city || '',
    'State/Province': address.state || '',
    'Postal Code': address.postal_code || '',
    'Country': address.country || '',
    'Latitude': location.lat || '',
    'Longitude': location.lng || '',
    'Furnishing': features.furnishing || 'Not Furnished',
    'Parking Spaces': features.parking_spaces || 0,
    'Has Pool': features.has_pool ? 'Yes' : 'No',
    'Has Garden': features.has_garden ? 'Yes' : 'No',
    'Has AC': features.has_ac ? 'Yes' : 'No',
    'Agent Name': agent.name ? `${agent.first_name} ${agent.last_name}`.trim() : 'N/A',
    'Agent Email': agent.email || 'N/A',
    'Agent Phone': agent.phone || 'N/A',
    'Date Listed': formatDate(property.created_at),
    'Last Updated': formatDate(property.updated_at),
    'Area (sqm)': property.area_sqm || ''
  };
}

/**
 * Formats tenant data for export
 */
export function formatTenantForExport(tenant: any) {
  // Format dates
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return {
    'Tenant ID': tenant.id || '',
    'First Name': tenant.first_name || '',
    'Last Name': tenant.last_name || '',
    'Email': tenant.email || '',
    'Phone': tenant.phone || '',
    'Property ID': tenant.property_id || '',
    'Lease Start': formatDate(tenant.lease_start),
    'Lease End': formatDate(tenant.lease_end),
    'Rent Amount': tenant.rent_amount ? `$${tenant.rent_amount.toLocaleString()}` : 'N/A',
    'Status': tenant.status ? tenant.status.charAt(0).toUpperCase() + tenant.status.slice(1) : '',
    'Date Created': formatDate(tenant.created_at),
    'Last Updated': formatDate(tenant.updated_at)
  };
}

/**
 * Formats payment data for export
 */
export function formatPaymentForExport(payment: any) {
  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format payment type
  const formatPaymentType = (type: string) => {
    const types: Record<string, string> = {
      'rent': 'Rent',
      'deposit': 'Security Deposit',
      'late_fee': 'Late Fee',
      'other': 'Other'
    };
    return types[type] || type;
  };

  return {
    'Payment ID': payment.id || '',
    'Tenant ID': payment.tenant_id || '',
    'Property ID': payment.property_id || '',
    'Amount': payment.amount ? `$${payment.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '$0.00',
    'Payment Type': formatPaymentType(payment.payment_type || ''),
    'Status': payment.status ? payment.status.charAt(0).toUpperCase() + payment.status.slice(1) : '',
    'Payment Date': formatDate(payment.payment_date),
    'Date Created': formatDate(payment.created_at),
    'Last Updated': formatDate(payment.updated_at)
  };
}
