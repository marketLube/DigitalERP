import React, { useState, useRef } from 'react';
import { 
  Plus, Edit2, X, Calendar, Upload, ChevronDown, Trash2, Copy, 
  FileText, Paperclip, PenTool, Save, Eye, Settings, Image as ImageIcon,
  Building, MapPin, Phone, Mail, Hash, Percent, Package, Download, Send,
  Printer, Share2, Clock, CheckCircle
} from 'lucide-react';

interface InvoiceItem {
  id: string;
  name: string;
  description?: string;
  gstRate: number;
  quantity: number;
  rate: number;
  amount: number;
  cgst: number;
  sgst: number;
  total: number;
  unit: 'Product' | 'Service';
  thumbnail?: string;
  salesLedger?: string;
}

interface Client {
  id: string;
  businessName: string;
  industry: string;
  country: string;
  city: string;
  address?: string;
  phone?: string;
  email?: string;
  taxInfo?: string;
  logo?: string;
  bankDetails?: {
    accountName: string;
    accountNumber: string;
    ifsc: string;
    accountType: string;
    bankName: string;
  };
}

interface Company {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  logo?: string;
  bankDetails?: {
    accountName: string;
    accountNumber: string;
    ifsc: string;
    accountType: string;
    bankName: string;
  };
}

interface InlineInvoiceMakerProps {
  onClose: () => void;
  onSave: (invoice: any) => void;
}

const InlineInvoiceMaker: React.FC<InlineInvoiceMakerProps> = ({ onClose, onSave }) => {
  // Core Invoice State
  const [invoiceTitle, setInvoiceTitle] = useState('GST Invoice');
  const [subtitle, setSubtitle] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('000547');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [showDueDate, setShowDueDate] = useState(false);
  const [currency, setCurrency] = useState('INR');
  const [currencySymbol, setCurrencySymbol] = useState('₹');

  // Shipping Details State
  const [showShippingDetails, setShowShippingDetails] = useState(false);
  const [shippingDetails, setShippingDetails] = useState({
    address: '',
    sameAsClient: false,
    businessName: '',
    country: 'India',
    city: '',
    postalCode: '',
    state: '',
    saveToClient: false
  });

  // Company & Client State
  const [selectedCompany, setSelectedCompany] = useState<Company>({
    id: '1',
    name: '',
    address: '',
    phone: '',
    email: '',
    bankDetails: {
      accountName: '',
      accountNumber: '',
      ifsc: '',
      accountType: 'Current',
      bankName: ''
    }
  });
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showAddClient, setShowAddClient] = useState(false);
  const [showClientDropdown, setShowClientDropdown] = useState(false);

  // Invoice Items State
  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: '1',
      name: '',
      gstRate: 0,
      quantity: 1,
      rate: 1,
      amount: 1,
      cgst: 0,
      sgst: 0,
      total: 1,
      unit: 'Product'
    }
  ]);

  // UI State
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const [showSignature, setShowSignature] = useState(false);
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);
  const [showContactDetails, setShowContactDetails] = useState(false);
  const [terms, setTerms] = useState('');
  const [notes, setNotes] = useState('');
  const [hideQuantitySummary, setHideQuantitySummary] = useState(false);
  const [hideTotals, setHideTotals] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [showColumnEditor, setShowColumnEditor] = useState(false);
  const [editingFormula, setEditingFormula] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [showBankDetailsEditor, setShowBankDetailsEditor] = useState(false);

  // New Client Modal State
  const [newClient, setNewClient] = useState<Partial<Client>>({
    businessName: '',
    industry: '',
    country: 'India',
    city: '',
    bankDetails: {
      accountName: '',
      accountNumber: '',
      ifsc: '',
      accountType: 'Current',
      bankName: ''
    }
  });

  // File upload refs
  const logoUploadRef = useRef<HTMLInputElement>(null);
  const clientLogoUploadRef = useRef<HTMLInputElement>(null);

  // Invoice Templates
  const invoiceTemplates = [
    {
      id: 'modern',
      name: 'Modern',
      description: 'Clean and professional design with blue accents',
      preview: 'bg-gradient-to-br from-blue-50 to-blue-100',
      primaryColor: '#3B82F6',
      headerStyle: 'modern'
    },
    {
      id: 'classic',
      name: 'Classic',
      description: 'Traditional business style with gray tones',
      preview: 'bg-gradient-to-br from-gray-50 to-gray-100',
      primaryColor: '#6B7280',
      headerStyle: 'classic'
    },
    {
      id: 'creative',
      name: 'Creative',
      description: 'Colorful and engaging with purple theme',
      preview: 'bg-gradient-to-br from-purple-50 to-purple-100',
      primaryColor: '#8B5CF6',
      headerStyle: 'creative'
    },
    {
      id: 'minimal',
      name: 'Minimal',
      description: 'Simple and elegant with green accents',
      preview: 'bg-gradient-to-br from-green-50 to-green-100',
      primaryColor: '#10B981',
      headerStyle: 'minimal'
    },
    {
      id: 'corporate',
      name: 'Corporate',
      description: 'Professional corporate style with navy theme',
      preview: 'bg-gradient-to-br from-slate-50 to-slate-100',
      primaryColor: '#1E293B',
      headerStyle: 'corporate'
    },
    {
      id: 'elegant',
      name: 'Elegant',
      description: 'Sophisticated design with gold accents',
      preview: 'bg-gradient-to-br from-amber-50 to-amber-100',
      primaryColor: '#F59E0B',
      headerStyle: 'elegant'
    },
    {
      id: 'tech',
      name: 'Tech',
      description: 'Modern tech style with cyan theme',
      preview: 'bg-gradient-to-br from-cyan-50 to-cyan-100',
      primaryColor: '#06B6D4',
      headerStyle: 'tech'
    },
    {
      id: 'bold',
      name: 'Bold',
      description: 'Eye-catching design with red accents',
      preview: 'bg-gradient-to-br from-red-50 to-red-100',
      primaryColor: '#EF4444',
      headerStyle: 'bold'
    }
  ];

  // Sample clients for dropdown
  const sampleClients: Client[] = [
    {
      id: '1',
      businessName: 'Tech Solutions Inc.',
      industry: 'Technology',
      country: 'USA',
      city: 'San Francisco',
      address: '123 Tech Street, Suite 100',
      phone: '+1-555-0123',
      email: 'contact@techsolutions.com'
    },
    {
      id: '2',
      businessName: 'Green Energy Corp',
      industry: 'Energy',
      country: 'Canada',
      city: 'Toronto',
      address: '456 Green Avenue',
      phone: '+1-416-555-0456',
      email: 'info@greenenergy.ca'
    },
    {
      id: '3',
      businessName: 'Digital Marketing Pro',
      industry: 'Marketing',
      country: 'UK',
      city: 'London',
      address: '789 Marketing Lane',
      phone: '+44-20-7123-4567',
      email: 'hello@digitalmarketingpro.co.uk'
    }
  ];

  // Column Configuration
  const [columnConfig, setColumnConfig] = useState([
    { id: 'item', name: 'Item', type: 'TEXT', visible: true, required: true },
    { id: 'hsn', name: 'HSN/SAC', type: 'NUMBER', visible: false, required: false },
    { id: 'gstRate', name: 'GST Rate', type: 'NUMBER', visible: true, required: false },
    { id: 'quantity', name: 'Quantity', type: 'NUMBER', visible: true, required: true },
    { id: 'rate', name: 'Rate', type: 'CURRENCY', visible: true, required: true },
    { id: 'amount', name: 'Amount', type: 'FORMULA', visible: true, required: true, formula: '(Quantity * Rate)' },
    { id: 'cgst', name: 'CGST', type: 'FORMULA', visible: true, required: false, formula: 'Auto calculated' },
    { id: 'sgst', name: 'SGST', type: 'FORMULA', visible: true, required: false, formula: 'Auto calculated' },
    { id: 'total', name: 'Total', type: 'FORMULA', visible: true, required: true, formula: 'Auto calculated' }
  ]);

  // Calculations
  const calculateItemTotals = (item: InvoiceItem) => {
    const amount = item.quantity * item.rate;
    const gstAmount = (amount * item.gstRate) / 100;
    const cgst = gstAmount / 2;
    const sgst = gstAmount / 2;
    const total = amount + gstAmount;
    
    return { amount, cgst, sgst, total };
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        const totals = calculateItemTotals(updatedItem);
        return { ...updatedItem, ...totals };
      }
      return item;
    }));
  };

  const addNewItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      name: '',
      gstRate: 0,
      quantity: 1,
      rate: 0,
      amount: 0,
      cgst: 0,
      sgst: 0,
      total: 0,
      unit: 'Product'
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const duplicateItem = (id: string) => {
    const itemToDuplicate = items.find(item => item.id === id);
    if (itemToDuplicate) {
      const duplicatedItem = {
        ...itemToDuplicate,
        id: Date.now().toString()
      };
      setItems([...items, duplicatedItem]);
    }
  };

  // Totals calculations
  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const totalCGST = items.reduce((sum, item) => sum + item.cgst, 0);
  const totalSGST = items.reduce((sum, item) => sum + item.sgst, 0);
  const grandTotal = subtotal + totalCGST + totalSGST;
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  // Convert number to words (simplified)
  const numberToWords = (num: number): string => {
    if (num === 0) return 'Zero';
    if (num === 1) return 'One Rupee Only';
    // Simplified - in real app you'd use a proper number-to-words library
    return `${num.toFixed(2)} Rupees Only`;
  };

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null) return;

    const newColumnConfig = [...columnConfig];
    const draggedItem = newColumnConfig[draggedIndex];
    
    // Remove dragged item
    newColumnConfig.splice(draggedIndex, 1);
    
    // Insert at new position
    newColumnConfig.splice(dropIndex, 0, draggedItem);
    
    setColumnConfig(newColumnConfig);
    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  // Formula suggestions
  const formulaSuggestions = [
    { label: 'Quantity × Rate', value: 'Quantity * Rate', description: 'Basic multiplication' },
    { label: 'Amount + Tax', value: 'Amount + (Amount * TaxRate / 100)', description: 'Add tax to amount' },
    { label: 'Discount Amount', value: 'Amount * DiscountPercent / 100', description: 'Calculate discount' },
    { label: 'Total with GST', value: 'Amount + CGST + SGST', description: 'Sum with GST components' },
    { label: 'Custom Formula', value: '', description: 'Write your own formula' }
  ];

  const insertFormulaText = (columnId: string, text: string) => {
    const updated = [...columnConfig];
    const index = updated.findIndex(col => col.id === columnId);
    if (index !== -1) {
      const currentFormula = updated[index].formula || '';
      updated[index] = { 
        ...updated[index], 
        formula: currentFormula + text 
      };
      setColumnConfig(updated);
    }
  };

  const handleSaveClient = () => {
    if (newClient.businessName) {
      const client: Client = {
        id: Date.now().toString(),
        businessName: newClient.businessName,
        industry: newClient.industry || '',
        country: newClient.country || 'India',
        city: newClient.city || '',
        address: newClient.address,
        phone: newClient.phone,
        email: newClient.email,
        taxInfo: newClient.taxInfo
      };
      setSelectedClient(client);
      setShowAddClient(false);
      setNewClient({
        businessName: '',
        industry: '',
        country: 'India',
        city: ''
      });
    }
  };

  const handleSaveInvoice = (isDraft = false) => {
    const invoice = {
      title: invoiceTitle,
      subtitle,
      invoiceNumber,
      invoiceDate,
      dueDate,
      currency,
      company: selectedCompany,
      client: selectedClient,
      items,
      subtotal,
      totalCGST,
      totalSGST,
      grandTotal,
      terms,
      notes,
      template: selectedTemplate,
      isDraft
    };
    onSave(invoice);
  };

  // Get template colors and styling
  const getCurrentTemplate = () => {
    return invoiceTemplates.find(t => t.id === selectedTemplate) || invoiceTemplates[0];
  };

  const currentTemplate = getCurrentTemplate();

  // Template-based styling
  const getTemplateStyles = () => {
    return {
      primaryColor: currentTemplate.primaryColor,
      accentColor: `${currentTemplate.primaryColor}20`, // 20% opacity
      borderColor: `${currentTemplate.primaryColor}40`, // 40% opacity
    };
  };

  const templateStyles = getTemplateStyles();

  // PDF Export functionality
  const handleExportPDF = () => {
    // Create a new window for PDF generation
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    // Get template-specific colors
    const templateColor = currentTemplate.primaryColor;
    const lightTemplateColor = `${templateColor}15`; // Light background
    const veryLightTemplateColor = `${templateColor}08`; // Very light background

    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Invoice ${invoiceNumber}</title>
        <style>
          @page {
            size: A4;
            margin: 20mm;
          }
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-size: 11px;
            line-height: 1.4;
            color: #333;
            background: white;
          }
          
          .invoice-container {
            width: 100%;
            background: white;
          }
          
          .invoice-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 25px;
            padding-bottom: 15px;
          }
          
          .invoice-title-section {
            flex: 1;
          }
          
          .invoice-title {
            color: ${templateColor};
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 15px;
          }
          
          .invoice-details {
            font-size: 11px;
            color: #666;
          }
          
          .invoice-details div {
            margin-bottom: 3px;
          }
          
          .company-logo {
            text-align: right;
            flex-shrink: 0;
          }
          
          .logo-placeholder {
            width: 120px;
            height: 60px;
            background: ${lightTemplateColor};
            border: 2px solid #e5e7eb;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #9ca3af;
            font-size: 10px;
            margin-left: auto;
          }
          
          .billing-section {
            display: flex;
            justify-content: space-between;
            margin-bottom: 25px;
            gap: 40px;
          }
          
          .billing-info {
            flex: 1;
          }
          
          .billing-title {
            font-weight: bold;
            color: ${templateColor};
            font-size: 12px;
            margin-bottom: 8px;
            text-transform: uppercase;
          }
          
          .billing-content {
            font-size: 11px;
            line-height: 1.4;
          }
          
          .company-name {
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 3px;
          }
          
          .invoice-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            font-size: 11px;
          }
          
          .invoice-table th {
            background: ${templateColor};
            color: white;
            padding: 12px 8px;
            text-align: center;
            font-weight: bold;
            font-size: 11px;
          }
          
          .invoice-table th:first-child {
            text-align: left;
            padding-left: 12px;
          }
          
          .invoice-table td {
            padding: 10px 8px;
            border-bottom: 1px solid #e5e7eb;
            text-align: center;
          }
          
          .invoice-table td:first-child {
            text-align: left;
            padding-left: 12px;
          }
          
          .invoice-table tbody tr:nth-child(even) {
            background: ${veryLightTemplateColor};
          }
          
          .total-section {
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
            gap: 40px;
          }
          
          .bank-details {
            flex: 1;
            background: #f3f4f6;
            padding: 15px;
            border-radius: 6px;
          }
          
          .bank-title {
            font-weight: bold;
            color: ${templateColor};
            margin-bottom: 10px;
            font-size: 11px;
          }
          
          .bank-info {
            font-size: 10px;
            line-height: 1.5;
          }
          
          .bank-info div {
            margin-bottom: 3px;
          }
          
          .totals {
            min-width: 250px;
          }
          
          .total-row {
            display: flex;
            justify-content: space-between;
            padding: 5px 0;
            border-bottom: 1px solid #e5e7eb;
          }
          
          .total-row:last-child {
            border-bottom: 2px solid ${templateColor};
            font-weight: bold;
            font-size: 12px;
            color: ${templateColor};
            padding: 8px 0;
          }
          
          .total-words {
            margin-top: 15px;
            font-size: 11px;
            font-weight: bold;
            color: #374151;
            text-transform: uppercase;
          }
          
          @media print {
            body { print-color-adjust: exact; }
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <!-- Header Section -->
          <div class="invoice-header">
            <div class="invoice-title-section">
              <div class="invoice-title">${invoiceTitle}</div>
              <div class="invoice-details">
                <div><strong>Invoice No #</strong> ${invoiceNumber}</div>
                <div><strong>Invoice Date</strong> ${new Date(invoiceDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
              </div>
            </div>
            <div class="company-logo">
              ${selectedCompany.logo 
                ? `<img src="${selectedCompany.logo}" alt="Company Logo" style="max-width: 120px; max-height: 60px;">` 
                : `<div class="logo-placeholder">Company Logo</div>`
              }
            </div>
          </div>

          <!-- Billing Information -->
          <div class="billing-section">
            <div class="billing-info">
              <div class="billing-title">Billed By</div>
              <div class="billing-content">
                <div class="company-name">${selectedCompany.name || 'YOUR COMPANY NAME'}</div>
                <div>${selectedCompany.address || 'Company Address'}</div>
                <div>${selectedCompany.phone || 'Phone Number'}</div>
                <div>${selectedCompany.email || 'Email Address'}</div>
              </div>
            </div>
            <div class="billing-info">
              <div class="billing-title">Billed To</div>
              <div class="billing-content">
                <div class="company-name">${selectedClient?.businessName || 'CLIENT NAME'}</div>
                <div>${selectedClient?.address || 'Client Address'}</div>
                <div>${selectedClient?.city || 'City'}, ${selectedClient?.country || 'Country'}</div>
                <div>${selectedClient?.phone || 'Phone'}</div>
                <div>${selectedClient?.email || 'Email'}</div>
              </div>
            </div>
          </div>

          <!-- Invoice Table -->
          <table class="invoice-table">
            <thead>
              <tr>
                ${columnConfig.filter(col => col.visible).map(column => 
                  `<th>${column.name}</th>`
                ).join('')}
              </tr>
            </thead>
            <tbody>
              ${items.map((item, index) => `
                <tr>
                  ${columnConfig.filter(col => col.visible).map(column => {
                    switch(column.id) {
                      case 'item':
                        return `<td>
                          <div>${index + 1}. ${item.name || 'Item Name'}</div>
                          ${item.description ? `<div style="font-size: 10px; color: #666; margin-top: 2px;">${item.description}</div>` : ''}
                        </td>`;
                      case 'hsn':
                        return `<td>${item.salesLedger || 'N/A'}</td>`;
                      case 'gstRate':
                        return `<td>${item.gstRate}%</td>`;
                      case 'quantity':
                        return `<td>${item.quantity}</td>`;
                      case 'rate':
                        return `<td>${currencySymbol}${item.rate.toFixed(2)}</td>`;
                      case 'amount':
                        return `<td>${currencySymbol}${item.amount.toFixed(2)}</td>`;
                      case 'cgst':
                        return `<td>${currencySymbol}${item.cgst.toFixed(2)}</td>`;
                      case 'sgst':
                        return `<td>${currencySymbol}${item.sgst.toFixed(2)}</td>`;
                      case 'total':
                        return `<td>${currencySymbol}${item.total.toFixed(2)}</td>`;
                      default:
                        return `<td>-</td>`;
                    }
                  }).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>

          <!-- Total Section -->
          <div class="total-section">
            ${showBankDetails ? `
            <div class="bank-details">
              <div class="bank-title">Bank Details</div>
              <div class="bank-info">
                ${selectedCompany.bankDetails?.accountName ? `
                <div><strong>Account Name:</strong> ${selectedCompany.bankDetails.accountName}</div>
                <div><strong>Account Number:</strong> ${selectedCompany.bankDetails.accountNumber}</div>
                <div><strong>IFSC:</strong> ${selectedCompany.bankDetails.ifsc}</div>
                <div><strong>Account Type:</strong> ${selectedCompany.bankDetails.accountType}</div>
                <div><strong>Bank:</strong> ${selectedCompany.bankDetails.bankName}</div>
                ` : `
                <div class="text-gray-500 text-sm">No bank details provided</div>
                `}
              </div>
            </div>
            ` : ''}
            
            <div class="totals">
              <div class="total-words">
                Total (in words): ${numberToWords(grandTotal).toUpperCase()}
              </div>
              <div style="margin-top: 15px;">
                <div class="total-row">
                  <span>Amount</span>
                  <span>${currencySymbol}${subtotal.toFixed(2)}</span>
                </div>
                <div class="total-row">
                  <span>CGST</span>
                  <span>${currencySymbol}${totalCGST.toFixed(2)}</span>
                </div>
                <div class="total-row">
                  <span>SGST</span>
                  <span>${currencySymbol}${totalSGST.toFixed(2)}</span>
                </div>
                <div class="total-row">
                  <span>Total (INR)</span>
                  <span>${currencySymbol}${grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Write HTML to new window and trigger print
    printWindow.document.write(invoiceHTML);
    printWindow.document.close();
    
    // Wait for content to load, then print
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowTemplateSelector(true)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <Settings size={16} />
                Template
              </button>
              <button 
                onClick={() => setShowPreview(true)}
                className="px-4 py-2 text-white rounded-lg transition-colors flex items-center gap-2"
                style={{ 
                  backgroundColor: currentTemplate.primaryColor,
                  ':hover': { opacity: 0.8 }
                }}
              >
                <Eye size={16} />
                Preview
              </button>
              <button 
                onClick={handleExportPDF}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <Download size={16} />
                Export PDF
              </button>
              <button 
                onClick={() => {
                  // Send invoice functionality
                  if (selectedClient?.email) {
                    alert(`Sending invoice to ${selectedClient.email}`);
                  } else {
                    alert('Please select a client with email address');
                  }
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <Send size={16} />
                Send
              </button>
            </div>
          </div>

          {/* Invoice Title */}
          <div className="text-center mb-6">
            <input
              type="text"
              value={invoiceTitle}
              onChange={(e) => setInvoiceTitle(e.target.value)}
              className="text-3xl font-bold bg-transparent border-none outline-none text-center w-full hover:bg-gray-50 rounded px-2 py-1 transition-colors"
              style={{ color: currentTemplate.primaryColor }}
              placeholder="Invoice Title"
            />
            {showSubtitle ? (
              <div className="flex items-center justify-center mt-2">
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="text-sm text-gray-600 bg-transparent border-none outline-none text-center hover:bg-gray-50 rounded px-2 py-1 transition-colors"
                  placeholder="Add subtitle with emoji support 🎉"
                />
                <button
                  onClick={() => setShowSubtitle(false)}
                  className="ml-2 p-1 hover:bg-gray-100 rounded"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowSubtitle(true)}
                className="text-sm mt-2 flex items-center mx-auto hover:opacity-80 transition-opacity"
                style={{ color: currentTemplate.primaryColor }}
              >
                <Plus size={14} className="mr-1" />
                Add Subtitle 🏷️
              </button>
            )}
          </div>

          {/* Invoice Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Invoice No*
                </label>
                <input
                  type="text"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Last No: 000546 (Mar 31, 2025)</p>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Invoice Date*
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={invoiceDate}
                    onChange={(e) => setInvoiceDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <Calendar size={16} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {showDueDate ? (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <button
                      onClick={() => setShowDueDate(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                              <button
                onClick={() => setShowDueDate(true)}
                className="text-sm flex items-center mb-4 hover:opacity-80 transition-opacity"
                style={{ color: currentTemplate.primaryColor }}
              >
                <Plus size={14} className="mr-1" />
                Add due date
              </button>
              )}

              <button 
                className="text-sm flex items-center hover:opacity-80 transition-opacity"
                style={{ color: currentTemplate.primaryColor }}
                onClick={() => {
                  // Add more fields functionality
                  console.log('Adding more fields...');
                }}
              >
                <Plus size={14} className="mr-1" />
                Add More Fields
              </button>
            </div>

            <div className="flex justify-end">
              {selectedCompany.logo ? (
                <div className="relative">
                  <img 
                    src={selectedCompany.logo} 
                    alt="Company Logo" 
                    className="h-24 w-auto object-contain"
                  />
                  <div className="absolute -top-2 -right-2 flex gap-1">
                    <button
                      onClick={() => logoUploadRef.current?.click()}
                      className="p-1 bg-white rounded-full shadow-md hover:bg-gray-50"
                      title="Change"
                    >
                      <Edit2 size={12} />
                    </button>
                    <button
                      onClick={() => setSelectedCompany({...selectedCompany, logo: undefined})}
                      className="p-1 bg-white rounded-full shadow-md hover:bg-gray-50"
                      title="Remove"
                    >
                      <X size={12} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="w-32 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                  <button
                    onClick={() => logoUploadRef.current?.click()}
                    className="text-gray-500 hover:text-gray-700 flex flex-col items-center"
                  >
                    <ImageIcon size={20} className="mb-1" />
                    <span className="text-xs">Add Logo</span>
                  </button>
                </div>
              )}
              <input
                ref={logoUploadRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                      setSelectedCompany({...selectedCompany, logo: e.target?.result as string});
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Party Information */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Billed By */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold" style={{ color: currentTemplate.primaryColor }}>
                    Billed By
                  </h3>
                  <p className="text-sm text-gray-500">Your Details</p>
                </div>
                <Building size={24} className="text-gray-400" />
              </div>
              
              <div className="space-y-4">
                <div>
                  <select 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent text-gray-700 bg-white"
                    style={{ focusRingColor: currentTemplate.primaryColor }}
                  >
                    <option>{selectedCompany.name || 'Select Company'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                  <input
                    type="text"
                    value={selectedCompany.name}
                    onChange={(e) => setSelectedCompany({...selectedCompany, name: e.target.value})}
                    placeholder="Enter your business name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                    style={{ focusRingColor: currentTemplate.primaryColor }}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <textarea
                    value={selectedCompany.address}
                    onChange={(e) => setSelectedCompany({...selectedCompany, address: e.target.value})}
                    placeholder="Enter your business address"
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent resize-none"
                    style={{ focusRingColor: currentTemplate.primaryColor }}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="text"
                    value={selectedCompany.phone}
                    onChange={(e) => setSelectedCompany({...selectedCompany, phone: e.target.value})}
                    placeholder="Enter phone number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                    style={{ focusRingColor: currentTemplate.primaryColor }}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button 
                  className="text-sm flex items-center hover:opacity-80 transition-opacity"
                  style={{ color: currentTemplate.primaryColor }}
                  onClick={() => {
                    // Add shipping details functionality
                    console.log('Adding shipping details...');
                  }}
                >
                  <Plus size={14} className="mr-2" />
                  Add Shipping Details
                </button>
                
                <button 
                  className="text-sm flex items-center hover:opacity-80 transition-opacity"
                  style={{ color: currentTemplate.primaryColor }}
                  onClick={() => setShowBankDetailsEditor(true)}
                >
                  <Plus size={14} className="mr-2" />
                  Bank Details
                </button>
              </div>
            </div>

            {/* Billed To */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold" style={{ color: currentTemplate.primaryColor }}>
                    Billed To
                  </h3>
                  <p className="text-sm text-gray-500">Client's Details</p>
                </div>
                <Building size={24} className="text-gray-400" />
              </div>

              {selectedClient ? (
                <div className="space-y-4">
                  <select 
                    value={selectedClient.id}
                    onChange={(e) => {
                      const client = sampleClients.find(c => c.id === e.target.value);
                      if (client) setSelectedClient(client);
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent text-gray-700 bg-white"
                    style={{ focusRingColor: currentTemplate.primaryColor }}
                  >
                    {sampleClients.map(client => (
                      <option key={client.id} value={client.id}>{client.businessName}</option>
                    ))}
                  </select>
                  
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <p className="font-semibold text-gray-900">{selectedClient.businessName}</p>
                    {selectedClient.industry && (
                      <p className="text-sm text-gray-600 flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        {selectedClient.industry}
                      </p>
                    )}
                    {selectedClient.address && <p className="text-sm text-gray-600">{selectedClient.address}</p>}
                    {selectedClient.city && <p className="text-sm text-gray-600">{selectedClient.city}, {selectedClient.country}</p>}
                    {selectedClient.phone && (
                      <p className="text-sm text-gray-600 flex items-center">
                        <Phone size={14} className="mr-2" />
                        {selectedClient.phone}
                      </p>
                    )}
                    {selectedClient.email && (
                      <p className="text-sm text-gray-600 flex items-center">
                        <Mail size={14} className="mr-2" />
                        {selectedClient.email}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Building size={24} className="text-gray-400" />
                    </div>
                    <p className="text-gray-600 mb-4 font-medium">Select Client/Business from the list</p>
                    
                    <select 
                      onChange={(e) => {
                        if (e.target.value) {
                          const client = sampleClients.find(c => c.id === e.target.value);
                          if (client) setSelectedClient(client);
                        }
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent text-gray-700 bg-white mb-4"
                      style={{ focusRingColor: currentTemplate.primaryColor }}
                    >
                      <option value="">Select Client/Business from the list</option>
                      {sampleClients.map(client => (
                        <option key={client.id} value={client.id}>{client.businessName}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-gray-400 text-sm mb-4">OR</p>
                    <button
                      onClick={() => setShowAddClient(true)}
                      className="text-white px-6 py-3 rounded-lg flex items-center mx-auto transition-colors font-medium shadow-sm"
                      style={{ backgroundColor: currentTemplate.primaryColor }}
                    >
                      <Plus size={16} className="mr-2" />
                      Add New Client
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Currency and Controls - Compact Single Line Layout */}
        <div className="px-6 py-4 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => {
                  // Configure GST functionality
                  console.log('Configuring GST...');
                }}
                className="flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-gray-600"
              >
                <Percent size={14} />
                Configure GST
              </button>
              
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Currency*</label>
                <select 
                  value={currency}
                  onChange={(e) => {
                    setCurrency(e.target.value);
                    setCurrencySymbol(e.target.value === 'INR' ? '₹' : e.target.value === 'USD' ? '$' : '€');
                  }}
                  className="px-2.5 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:border-transparent bg-white min-w-[180px]"
                  style={{ focusRingColor: currentTemplate.primaryColor }}
                >
                  <option value="INR">Indian Rupee (INR, ₹)</option>
                  <option value="USD">US Dollar (USD, $)</option>
                  <option value="EUR">Euro (EUR, €)</option>
                </select>
              </div>

              <button 
                onClick={() => {
                  // Number and currency format functionality
                  console.log('Configuring number format...');
                }}
                className="flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-gray-600"
              >
                <Hash size={14} />
                <span className="flex items-center gap-1">
                  <span className="bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded text-xs font-medium">123</span>
                  Number and Currency Format
                </span>
              </button>

              <button
                onClick={() => setShowShippingDetails(!showShippingDetails)}
                className={`flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-300 rounded-md transition-colors ${
                  showShippingDetails ? 'bg-blue-50 text-blue-600 border-blue-300' : 'hover:bg-gray-50 text-gray-600'
                }`}
              >
                <Package size={14} />
                Add Shipping Details
              </button>
            </div>

            <button 
              onClick={() => setShowColumnEditor(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-sm border rounded-md hover:bg-gray-50 transition-colors"
              style={{ borderColor: currentTemplate.primaryColor, color: currentTemplate.primaryColor }}
            >
              <Settings size={14} />
              <span className="flex items-center gap-1">
                <span className="bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded text-xs font-medium">⚙️</span>
                Edit Columns/Formulas
              </span>
            </button>
          </div>

          {/* Shipping Details Form */}
          {showShippingDetails && (
            <div className="mt-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipped To</h3>
              
              <div className="space-y-4">
                {/* Shipping Address Selector */}
                <div>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent bg-white"
                    style={{ focusRingColor: currentTemplate.primaryColor }}
                    value={shippingDetails.address}
                    onChange={(e) => setShippingDetails({...shippingDetails, address: e.target.value})}
                  >
                    <option value="">Select a Shipping Address</option>
                    <option value="client">Same as client's address</option>
                    <option value="custom">Custom address</option>
                  </select>
                </div>

                {/* Same as client's address option */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="sameAsClient"
                    checked={shippingDetails.sameAsClient}
                    onChange={(e) => setShippingDetails({...shippingDetails, sameAsClient: e.target.checked})}
                    className="w-4 h-4 rounded border-gray-300"
                    style={{ accentColor: currentTemplate.primaryColor }}
                  />
                  <label htmlFor="sameAsClient" className="text-sm text-gray-700">
                    Same as client's address
                  </label>
                </div>

                {/* Business Name */}
                <div>
                  <input
                    type="text"
                    placeholder="Client's business name"
                    value={shippingDetails.businessName}
                    onChange={(e) => setShippingDetails({...shippingDetails, businessName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent bg-white"
                    style={{ focusRingColor: currentTemplate.primaryColor }}
                  />
                </div>

                {/* Country */}
                <div>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent bg-white"
                    style={{ focusRingColor: currentTemplate.primaryColor }}
                    value={shippingDetails.country}
                    onChange={(e) => setShippingDetails({...shippingDetails, country: e.target.value})}
                  >
                    <option value="">Select Country</option>
                    <option value="India">India</option>
                    <option value="USA">United States</option>
                    <option value="UK">United Kingdom</option>
                    <option value="Canada">Canada</option>
                  </select>
                </div>

                {/* Address */}
                <div>
                  <textarea
                    placeholder="Address (optional)"
                    value={shippingDetails.address}
                    onChange={(e) => setShippingDetails({...shippingDetails, address: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent bg-white"
                    style={{ focusRingColor: currentTemplate.primaryColor }}
                  />
                </div>

                {/* City and Postal Code */}
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="City (optional)"
                    value={shippingDetails.city}
                    onChange={(e) => setShippingDetails({...shippingDetails, city: e.target.value})}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent bg-white"
                    style={{ focusRingColor: currentTemplate.primaryColor }}
                  />
                  <input
                    type="text"
                    placeholder="Postal Code / ZIP Code"
                    value={shippingDetails.postalCode}
                    onChange={(e) => setShippingDetails({...shippingDetails, postalCode: e.target.value})}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent bg-white"
                    style={{ focusRingColor: currentTemplate.primaryColor }}
                  />
                </div>

                {/* State */}
                <div>
                  <input
                    type="text"
                    placeholder="State (optional)"
                    value={shippingDetails.state}
                    onChange={(e) => setShippingDetails({...shippingDetails, state: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent bg-white"
                    style={{ focusRingColor: currentTemplate.primaryColor }}
                  />
                </div>

                {/* Save to client details */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="saveToClient"
                    checked={shippingDetails.saveToClient}
                    onChange={(e) => setShippingDetails({...shippingDetails, saveToClient: e.target.checked})}
                    className="w-4 h-4 rounded border-gray-300"
                    style={{ accentColor: currentTemplate.primaryColor }}
                  />
                  <label htmlFor="saveToClient" className="text-sm text-gray-700">
                    Save to client details
                  </label>
                </div>

                {/* Add More Fields */}
                <div className="pt-2">
                  <button
                    onClick={() => {
                      console.log('Adding more fields...');
                    }}
                    className="flex items-center gap-2 text-sm hover:opacity-80 transition-opacity"
                    style={{ color: currentTemplate.primaryColor }}
                  >
                    <Plus size={16} />
                    Add More Fields
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Items Table */}
        <div className="p-6 bg-white">
          <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="text-white text-sm" style={{ backgroundColor: currentTemplate.primaryColor }}>
                  {columnConfig.filter(col => col.visible).map(column => {
                    const getColumnAlignment = () => {
                      if (column.type === 'CURRENCY' || column.type === 'NUMBER' || column.type === 'FORMULA') {
                        return column.id === 'quantity' ? 'text-center' : 'text-right';
                      }
                      return 'text-left';
                    };
                    
                    const getColumnWidth = () => {
                      switch (column.id) {
                        case 'item': return 'min-w-[200px]';
                        case 'gstRate': case 'quantity': case 'cgst': case 'sgst': return 'w-20';
                        case 'rate': case 'amount': case 'total': return 'w-24';
                        default: return 'w-20';
                      }
                    };

                    return (
                      <th key={column.id} className={`px-3 py-4 font-semibold ${getColumnAlignment()} ${getColumnWidth()}`}>
                        {column.id === 'gstRate' ? (
                          <>GST<br/>Rate</>
                        ) : (
                          column.name
                        )}
                      </th>
                    );
                  })}
                  <th className="px-3 py-4 text-center font-semibold w-20">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {items.map((item, index) => (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    {columnConfig.filter(col => col.visible).map(column => {
                      const renderCell = () => {
                        switch (column.id) {
                          case 'item':
                            return (
                              <div className="space-y-3">
                                {/* Main Item Input */}
                                <input
                                  type="text"
                                  value={item.name}
                                  onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                                  placeholder="Item name"
                                  className="w-full px-3 py-2 text-sm font-medium bg-blue-50 border border-blue-200 rounded-md focus:ring-2 focus:border-transparent transition-colors"
                                  style={{ 
                                    focusRingColor: currentTemplate.primaryColor,
                                    backgroundColor: `${currentTemplate.primaryColor}10`,
                                    borderColor: `${currentTemplate.primaryColor}40`
                                  }}
                                />
                                
                                {/* Action Buttons Row */}
                                <div className="flex items-center gap-3 text-xs">
                                  <button 
                                    className="flex items-center gap-1 hover:opacity-80 transition-opacity"
                                    style={{ color: currentTemplate.primaryColor }}
                                    onClick={() => {
                                      console.log('Adding description...');
                                    }}
                                  >
                                    <Plus size={12} />
                                    Add Description
                                  </button>
                                  <button 
                                    className="flex items-center gap-1 hover:opacity-80 transition-opacity"
                                    style={{ color: currentTemplate.primaryColor }}
                                    onClick={() => {
                                      console.log('Adding thumbnail...');
                                    }}
                                  >
                                    <ImageIcon size={12} />
                                    Add Thumbnail
                                  </button>
                                </div>
                                
                                {/* Product/Service Selector */}
                                <div className="flex items-center gap-2">
                                  <Package size={14} className="text-gray-400" />
                                  <select 
                                    value={item.unit}
                                    onChange={(e) => updateItem(item.id, 'unit', e.target.value)}
                                    className="text-xs border border-gray-300 rounded px-2 py-1 bg-white focus:ring-1 focus:border-transparent"
                                    style={{ focusRingColor: currentTemplate.primaryColor }}
                                  >
                                    <option value="Product">Product</option>
                                    <option value="Service">Service</option>
                                  </select>
                                </div>
                                
                                {/* Sales Ledger */}
                                <div className="text-xs text-gray-500 flex items-center gap-1">
                                  <span>Select Sales Ledger</span>
                                  <span>📊</span>
                                </div>
                              </div>
                            );
                          
                          case 'hsn':
                            return (
                              <input
                                type="text"
                                placeholder="HSN/SAC"
                                className="w-16 px-2 py-1 border border-gray-300 rounded text-center text-sm focus:ring-1 focus:border-transparent"
                                style={{ focusRingColor: currentTemplate.primaryColor }}
                              />
                            );
                          
                          case 'gstRate':
                            return (
                              <div className="flex flex-col items-center gap-1">
                                <input
                                  type="number"
                                  value={item.gstRate}
                                  onChange={(e) => updateItem(item.id, 'gstRate', Number(e.target.value))}
                                  className="w-12 px-2 py-1 border border-gray-300 rounded text-center text-sm focus:ring-1 focus:border-transparent"
                                  style={{ focusRingColor: currentTemplate.primaryColor }}
                                  min="0"
                                  max="100"
                                />
                                <span className="text-xs text-gray-500">%</span>
                              </div>
                            );
                          
                          case 'quantity':
                            return (
                              <input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))}
                                className="w-12 px-2 py-1 border border-gray-300 rounded text-center text-sm focus:ring-1 focus:border-transparent"
                                style={{ focusRingColor: currentTemplate.primaryColor }}
                                min="1"
                              />
                            );
                          
                          case 'rate':
                            return (
                              <div className="flex items-center justify-end gap-1">
                                <span className="text-xs text-gray-500">{currencySymbol}</span>
                                <input
                                  type="number"
                                  value={item.rate}
                                  onChange={(e) => updateItem(item.id, 'rate', Number(e.target.value))}
                                  className="w-16 px-2 py-1 border border-gray-300 rounded text-right text-sm focus:ring-1 focus:border-transparent"
                                  style={{ focusRingColor: currentTemplate.primaryColor }}
                                  min="0"
                                  step="0.01"
                                />
                              </div>
                            );
                          
                          case 'amount':
                            return (
                              <span className="text-sm font-semibold" style={{ color: currentTemplate.primaryColor }}>
                                {currencySymbol}{item.amount.toFixed(2)}
                              </span>
                            );
                          
                          case 'cgst':
                            return (
                              <span className="text-sm text-gray-700">{currencySymbol}{item.cgst.toFixed(2)}</span>
                            );
                          
                          case 'sgst':
                            return (
                              <span className="text-sm text-gray-700">{currencySymbol}{item.sgst.toFixed(2)}</span>
                            );
                          
                          case 'total':
                            return (
                              <span className="text-sm font-bold" style={{ color: currentTemplate.primaryColor }}>
                                {currencySymbol}{item.total.toFixed(2)}
                              </span>
                            );
                          
                          default:
                            return (
                              <input
                                type="text"
                                placeholder={column.name}
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:border-transparent"
                                style={{ focusRingColor: currentTemplate.primaryColor }}
                              />
                            );
                        }
                      };

                      const getAlignment = () => {
                        if (column.type === 'CURRENCY' || column.type === 'NUMBER' || column.type === 'FORMULA') {
                          return column.id === 'quantity' ? 'text-center' : 'text-right';
                        }
                        return 'text-left';
                      };

                      return (
                        <td key={column.id} className={`px-3 py-4 ${getAlignment()}`}>
                          {renderCell()}
                        </td>
                      );
                    })}
                    
                    <td className="px-3 py-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => duplicateItem(item.id)}
                          className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
                          title="Duplicate"
                        >
                          <Copy size={14} className="text-gray-600" />
                        </button>
                        {items.length > 1 && (
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-1.5 hover:bg-red-50 text-red-600 rounded-md transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add New Line / Group */}
          <div className="flex items-center gap-4 mt-6 pb-4">
            <button
              onClick={addNewItem}
              className="flex items-center gap-2 px-6 py-3 border-2 rounded-lg font-medium transition-all duration-200 hover:shadow-md"
              style={{ 
                borderColor: currentTemplate.primaryColor,
                color: currentTemplate.primaryColor,
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `${currentTemplate.primaryColor}15`;
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.transform = 'translateY(0px)';
              }}
            >
              <Plus size={18} />
              Add New Line
            </button>
            
            <button 
              onClick={() => {
                // Add group functionality
                console.log('Adding new group...');
              }}
              className="flex items-center gap-2 px-6 py-3 border-2 border-orange-300 text-orange-600 rounded-lg hover:bg-orange-50 transition-all duration-200 hover:shadow-md font-medium"
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0px)';
              }}
            >
              <Plus size={18} />
              Add New Group 🏷️
            </button>
          </div>
        </div>

        {/* Totals Section */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex justify-end">
            <div className="w-80 space-y-3">
              <div className="flex justify-between text-sm">
                <span>Amount</span>
                <span className="font-medium">{currencySymbol}{subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span>SGST</span>
                <span className="font-medium">{currencySymbol}{totalSGST.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span>CGST</span>
                <span className="font-medium">{currencySymbol}{totalCGST.toFixed(2)}</span>
              </div>

              <div className="flex flex-col gap-2 text-xs">
                <button 
                  className="text-left hover:opacity-80 transition-opacity"
                  style={{ color: currentTemplate.primaryColor }}
                  onClick={() => {
                    // Add discounts functionality
                    console.log('Adding discounts...');
                  }}
                >
                  + Add Discounts/Additional Charges
                </button>
                <button 
                  onClick={() => setHideTotals(!hideTotals)}
                  className="text-left hover:opacity-80 transition-opacity"
                  style={{ color: currentTemplate.primaryColor }}
                >
                  {hideTotals ? 'Show' : 'Hide'} Totals
                </button>
                <button 
                  onClick={() => setHideQuantitySummary(!hideQuantitySummary)}
                  className="text-left hover:opacity-80 transition-opacity"
                  style={{ color: currentTemplate.primaryColor }}
                >
                  {hideQuantitySummary ? 'Show' : 'Summarise'} Total Quantity
                </button>
              </div>

              <div className="border-t pt-3" style={{ borderColor: currentTemplate.primaryColor }}>
                <div className="flex justify-between text-lg font-bold" style={{ color: currentTemplate.primaryColor }}>
                  <span>Total ({currency})</span>
                  <span>{currencySymbol}{grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                <div className="flex justify-between items-center">
                  <span>Total (in words)</span>
                  <button className="text-gray-400 hover:text-gray-600">
                    <X size={12} />
                  </button>
                </div>
                <div className="font-medium mt-1">{numberToWords(grandTotal)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Sections */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={() => setShowTerms(!showTerms)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Plus size={16} />
              Add Terms & Conditions
            </button>
            
            <button
              onClick={() => setShowNotes(!showNotes)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FileText size={16} />
              Add Notes
            </button>
            
            <button
              onClick={() => setShowAttachments(!showAttachments)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Paperclip size={16} />
              Add Attachments
            </button>
            
            <button
              onClick={() => setShowSignature(!showSignature)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <PenTool size={16} />
              Add Signature
            </button>
            
            <button
              onClick={() => setShowAdditionalInfo(!showAdditionalInfo)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Plus size={16} />
              Add Additional Info
            </button>
            
            <button
              onClick={() => setShowContactDetails(!showContactDetails)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Phone size={16} />
              Add Contact Details
            </button>
            
            <button
              onClick={() => setShowBankDetails(!showBankDetails)}
              className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
                showBankDetails 
                  ? 'border-green-500 bg-green-50 text-green-700' 
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Building size={16} />
              {showBankDetails ? 'Hide Bank Details' : 'Show Bank Details'}
            </button>
          </div>

          {/* Conditional Sections */}
          {showTerms && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Terms & Conditions
              </label>
              <textarea
                value={terms}
                onChange={(e) => setTerms(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter your terms and conditions..."
              />
            </div>
          )}

          {showNotes && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Add any additional notes..."
              />
            </div>
          )}
        </div>

        {/* Sticky Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Auto-save enabled
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleSaveInvoice(true)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Save As Draft
              </button>
              
              <button
                onClick={() => handleSaveInvoice(false)}
                className="px-6 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition-colors flex items-center gap-2"
                style={{ backgroundColor: '#ec008c' }}
              >
                <Save size={16} />
                Save & Continue
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add New Client Modal */}
      {showAddClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Add New Client</h2>
                <button
                  onClick={() => setShowAddClient(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-96">
              <div className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Basic Information</h3>
                  
                  {/* Logo Upload */}
                  <div className="mb-6">
                    <div className="w-32 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mb-2">
                      <button
                        onClick={() => clientLogoUploadRef.current?.click()}
                        className="text-gray-500 hover:text-gray-700 flex flex-col items-center"
                      >
                        <Plus size={24} className="mb-1" />
                        <span className="text-xs">Upload Logo</span>
                      </button>
                    </div>
                    <p className="text-xs text-gray-500">JPG or PNG, Dimensions 1080×1080px and file size up to 20MB</p>
                    <input
                      ref={clientLogoUploadRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Business Name*
                      </label>
                      <input
                        type="text"
                        value={newClient.businessName}
                        onChange={(e) => setNewClient({...newClient, businessName: e.target.value})}
                        placeholder="Business Name (Required)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Client Industry
                      </label>
                      <select
                        value={newClient.industry}
                        onChange={(e) => setNewClient({...newClient, industry: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="">-Select an Industry-</option>
                        <option value="Technology">Technology</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Finance">Finance</option>
                        <option value="Retail">Retail</option>
                        <option value="Manufacturing">Manufacturing</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Country*
                      </label>
                      <select
                        value={newClient.country}
                        onChange={(e) => setNewClient({...newClient, country: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="India">India</option>
                        <option value="USA">USA</option>
                        <option value="UK">UK</option>
                        <option value="Canada">Canada</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City/Town
                      </label>
                      <input
                        type="text"
                        value={newClient.city}
                        onChange={(e) => setNewClient({...newClient, city: e.target.value})}
                        placeholder="City/Town Name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Optional Sections - Collapsed by default */}
                <div className="space-y-4">
                  <details className="border border-gray-200 rounded-lg">
                    <summary className="p-4 cursor-pointer font-medium text-gray-700 hover:bg-gray-50">
                      Tax Information (optional)
                    </summary>
                    <div className="p-4 border-t border-gray-200">
                      <input
                        type="text"
                        placeholder="Tax ID / GST Number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </details>

                  <details className="border border-gray-200 rounded-lg">
                    <summary className="p-4 cursor-pointer font-medium text-gray-700 hover:bg-gray-50">
                      Address (optional)
                    </summary>
                    <div className="p-4 border-t border-gray-200">
                      <textarea
                        placeholder="Full Address"
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </details>

                  <details className="border border-gray-200 rounded-lg">
                    <summary className="p-4 cursor-pointer font-medium text-gray-700 hover:bg-gray-50">
                      Additional Details (optional)
                    </summary>
                    <div className="p-4 border-t border-gray-200 space-y-4">
                      <input
                        type="email"
                        placeholder="Email Address"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </details>

                  <details className="border border-gray-200 rounded-lg">
                    <summary className="p-4 cursor-pointer font-medium text-gray-700 hover:bg-gray-50">
                      Bank Details (optional)
                    </summary>
                    <div className="p-4 border-t border-gray-200 space-y-4">
                      <input
                        type="text"
                        value={newClient.bankDetails?.accountName || ''}
                        onChange={(e) => setNewClient({
                          ...newClient,
                          bankDetails: {
                            ...newClient.bankDetails!,
                            accountName: e.target.value
                          }
                        })}
                        placeholder="Account Holder Name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <input
                        type="text"
                        value={newClient.bankDetails?.accountNumber || ''}
                        onChange={(e) => setNewClient({
                          ...newClient,
                          bankDetails: {
                            ...newClient.bankDetails!,
                            accountNumber: e.target.value
                          }
                        })}
                        placeholder="Account Number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <input
                        type="text"
                        value={newClient.bankDetails?.ifsc || ''}
                        onChange={(e) => setNewClient({
                          ...newClient,
                          bankDetails: {
                            ...newClient.bankDetails!,
                            ifsc: e.target.value.toUpperCase()
                          }
                        })}
                        placeholder="IFSC Code"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <select
                        value={newClient.bankDetails?.accountType || 'Current'}
                        onChange={(e) => setNewClient({
                          ...newClient,
                          bankDetails: {
                            ...newClient.bankDetails!,
                            accountType: e.target.value
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="Current">Current Account</option>
                        <option value="Savings">Savings Account</option>
                        <option value="Business">Business Account</option>
                      </select>
                      <input
                        type="text"
                        value={newClient.bankDetails?.bankName || ''}
                        onChange={(e) => setNewClient({
                          ...newClient,
                          bankDetails: {
                            ...newClient.bankDetails!,
                            bankName: e.target.value
                          }
                        })}
                        placeholder="Bank Name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </details>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={handleSaveClient}
                disabled={!newClient.businessName}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white rounded-lg transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Template Selector Modal */}
      {showTemplateSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Choose Invoice Template</h2>
                <button
                  onClick={() => setShowTemplateSelector(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-96">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {invoiceTemplates.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => {
                      setSelectedTemplate(template.id);
                      setShowTemplateSelector(false);
                    }}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                      selectedTemplate === template.id
                        ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-200'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                    }`}
                  >
                    <div className={`w-full h-32 rounded-lg mb-3 ${template.preview} flex items-center justify-center relative overflow-hidden`}>
                      <div className="text-center">
                        <div 
                          className="w-12 h-2 mb-2 mx-auto rounded-sm"
                          style={{ backgroundColor: template.primaryColor }}
                        ></div>
                        <div className="w-16 h-1 bg-gray-300 mb-1 mx-auto rounded"></div>
                        <div className="w-10 h-1 bg-gray-300 mx-auto rounded"></div>
                        <div className="mt-3 space-y-1">
                          <div className="w-20 h-1 bg-gray-200 mx-auto rounded"></div>
                          <div className="w-16 h-1 bg-gray-200 mx-auto rounded"></div>
                          <div className="w-18 h-1 bg-gray-200 mx-auto rounded"></div>
                        </div>
                      </div>
                      {selectedTemplate === template.id && (
                        <div className="absolute top-2 right-2">
                          <CheckCircle size={20} className="text-purple-600 bg-white rounded-full" />
                        </div>
                      )}
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1">{template.name}</h4>
                    <p className="text-xs text-gray-600">{template.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowTemplateSelector(false)}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                Apply Template
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Invoice Preview</h2>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => {
                      handleExportPDF();
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Download size={16} />
                    Download PDF
                  </button>
                  <button 
                    onClick={() => {
                      // Send invoice functionality
                      if (selectedClient?.email) {
                        alert(`Invoice sent to ${selectedClient.email}`);
                        setShowPreview(false);
                      } else {
                        alert('Please select a client with email address');
                      }
                    }}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Send size={16} />
                    Send Invoice
                  </button>
                  <button 
                    onClick={() => {
                      // Print the preview content
                      const printContent = document.getElementById('invoice-preview-content');
                      if (printContent) {
                        const printWindow = window.open('', '_blank');
                        if (printWindow) {
                          printWindow.document.write(`
                            <!DOCTYPE html>
                            <html>
                            <head>
                              <title>Invoice ${invoiceNumber}</title>
                              <style>
                                @page { size: A4; margin: 20mm; }
                                * { margin: 0; padding: 0; box-sizing: border-box; }
                                body { font-family: Arial, sans-serif; font-size: 11px; line-height: 1.4; color: #333; }
                                .invoice-container { width: 100%; background: white; }
                                .invoice-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 25px; padding-bottom: 15px; }
                                .invoice-title { color: ${currentTemplate.primaryColor}; font-size: 24px; font-weight: bold; margin-bottom: 15px; }
                                .invoice-details { font-size: 11px; color: #666; }
                                .invoice-details div { margin-bottom: 3px; }
                                .company-logo { text-align: right; flex-shrink: 0; }
                                .logo-placeholder { width: 120px; height: 60px; background: ${currentTemplate.primaryColor}15; border: 2px solid #e5e7eb; display: flex; align-items: center; justify-content: center; color: #9ca3af; font-size: 10px; margin-left: auto; }
                                .billing-section { display: flex; justify-content: space-between; margin-bottom: 25px; gap: 40px; }
                                .billing-info { flex: 1; }
                                .billing-title { font-weight: bold; color: ${currentTemplate.primaryColor}; font-size: 12px; margin-bottom: 8px; text-transform: uppercase; }
                                .billing-content { font-size: 11px; line-height: 1.4; }
                                .company-name { font-weight: bold; color: #1f2937; margin-bottom: 3px; }
                                .invoice-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 11px; }
                                .invoice-table th { background: ${currentTemplate.primaryColor}; color: white; padding: 12px 8px; text-align: center; font-weight: bold; font-size: 11px; }
                                .invoice-table th:first-child { text-align: left; padding-left: 12px; }
                                .invoice-table td { padding: 10px 8px; border-bottom: 1px solid #e5e7eb; text-align: center; }
                                .invoice-table td:first-child { text-align: left; padding-left: 12px; }
                                .invoice-table tbody tr:nth-child(even) { background: ${currentTemplate.primaryColor}08; }
                                                                .total-section { display: ${showBankDetails ? 'flex' : 'block'}; justify-content: space-between; margin-top: 20px; gap: 40px; }
                                .bank-details { flex: 1; background: #f3f4f6; padding: 15px; border-radius: 6px; }
                                .bank-title { font-weight: bold; color: ${currentTemplate.primaryColor}; margin-bottom: 10px; font-size: 11px; }
                                .bank-info { font-size: 10px; line-height: 1.5; color: #9ca3af; }
                                .totals { min-width: 250px; }
                                .total-row { display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px solid #e5e7eb; }
                                .total-row:last-child { border-bottom: 2px solid ${currentTemplate.primaryColor}; font-weight: bold; font-size: 12px; color: ${currentTemplate.primaryColor}; padding: 8px 0; }
                                .total-words { margin-top: 15px; font-size: 11px; font-weight: bold; color: #374151; text-transform: uppercase; }
                                @media print { body { print-color-adjust: exact; } }
                              </style>
                            </head>
                            <body>
                              ${printContent.innerHTML}
                            </body>
                            </html>
                          `);
                          printWindow.document.close();
                          setTimeout(() => {
                            printWindow.print();
                          }, 500);
                        }
                      }
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                  >
                    <Printer size={16} />
                    Print
                  </button>
                  <button
                    onClick={() => setShowPreview(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[80vh] bg-gray-100">
              <div id="invoice-preview-content" className="bg-white rounded-lg shadow-lg p-8 max-w-5xl mx-auto">
                {/* Header Section */}
                <div className="flex justify-between items-start mb-6 pb-4">
                  <div className="flex-1">
                    <div className="text-2xl font-bold mb-3" style={{ color: currentTemplate.primaryColor }}>
                      {invoiceTitle}
                    </div>
                    <div className="text-sm text-gray-600">
                      <div className="mb-1"><strong>Invoice No #</strong> {invoiceNumber}</div>
                      <div><strong>Invoice Date</strong> {new Date(invoiceDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    {selectedCompany.logo ? (
                      <img src={selectedCompany.logo} alt="Company Logo" className="max-w-32 max-h-16 object-contain" />
                    ) : (
                      <div className="w-32 h-16 border-2 border-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
                        Company Logo
                      </div>
                    )}
                  </div>
                </div>

                {/* Billing Information */}
                <div className="grid grid-cols-2 gap-10 mb-6">
                  <div>
                    <div className="font-bold text-sm mb-2 uppercase" style={{ color: currentTemplate.primaryColor }}>
                      Billed By
                    </div>
                    <div className="text-sm">
                      <div className="font-bold text-gray-900 mb-1">{selectedCompany.name || 'YOUR COMPANY NAME'}</div>
                      <div className="text-gray-700">{selectedCompany.address || 'Company Address'}</div>
                      <div className="text-gray-700">{selectedCompany.phone || 'Phone Number'}</div>
                      <div className="text-gray-700">{selectedCompany.email || 'Email Address'}</div>
                    </div>
                  </div>
                  <div>
                    <div className="font-bold text-sm mb-2 uppercase" style={{ color: currentTemplate.primaryColor }}>
                      Billed To
                    </div>
                    <div className="text-sm">
                      {selectedClient ? (
                        <>
                          <div className="font-bold text-gray-900 mb-1">{selectedClient.businessName}</div>
                          <div className="text-gray-700">{selectedClient.address || 'Client Address'}</div>
                          <div className="text-gray-700">{selectedClient.city || 'City'}, {selectedClient.country || 'Country'}</div>
                          <div className="text-gray-700">{selectedClient.phone || 'Phone'}</div>
                          <div className="text-gray-700">{selectedClient.email || 'Email'}</div>
                        </>
                      ) : (
                        <div className="text-gray-400">CLIENT NAME</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Invoice Table */}
                <div className="mb-6">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="text-white" style={{ backgroundColor: currentTemplate.primaryColor }}>
                        {columnConfig.filter(col => col.visible).map(column => (
                          <th key={column.id} className="p-3 text-left border border-opacity-50" style={{ borderColor: currentTemplate.primaryColor }}>
                            {column.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, index) => (
                        <tr key={item.id} className={index % 2 === 1 ? 'bg-opacity-5' : ''} style={{ backgroundColor: index % 2 === 1 ? `${currentTemplate.primaryColor}08` : 'transparent' }}>
                          {columnConfig.filter(col => col.visible).map(column => (
                            <td key={column.id} className="p-3 border-b border-gray-200">
                              {(() => {
                                switch(column.id) {
                                  case 'item':
                                    return (
                                      <div>
                                        <div>{index + 1}. {item.name || 'Item Name'}</div>
                                        {item.description && <div className="text-xs text-gray-500 mt-1">{item.description}</div>}
                                      </div>
                                    );
                                  case 'hsn':
                                    return item.salesLedger || 'N/A';
                                  case 'gstRate':
                                    return `${item.gstRate}%`;
                                  case 'quantity':
                                    return item.quantity;
                                  case 'rate':
                                    return `${currencySymbol}${item.rate.toFixed(2)}`;
                                  case 'amount':
                                    return `${currencySymbol}${item.amount.toFixed(2)}`;
                                  case 'cgst':
                                    return `${currencySymbol}${item.cgst.toFixed(2)}`;
                                  case 'sgst':
                                    return `${currencySymbol}${item.sgst.toFixed(2)}`;
                                  case 'total':
                                    return `${currencySymbol}${item.total.toFixed(2)}`;
                                  default:
                                    return '-';
                                }
                              })()}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Total Section */}
                <div className="flex justify-between gap-10 mt-5">
                  {showBankDetails && (
                    <div className="flex-1 bg-gray-50 p-4 rounded-lg">
                      <div className="font-bold text-sm mb-3" style={{ color: currentTemplate.primaryColor }}>
                        Bank Details
                      </div>
                      <div className="text-xs space-y-1">
                        {selectedCompany.bankDetails?.accountName ? (
                          <>
                            <div><strong>Account Name:</strong> {selectedCompany.bankDetails.accountName}</div>
                            <div><strong>Account Number:</strong> {selectedCompany.bankDetails.accountNumber}</div>
                            <div><strong>IFSC:</strong> {selectedCompany.bankDetails.ifsc}</div>
                            <div><strong>Account Type:</strong> {selectedCompany.bankDetails.accountType}</div>
                            <div><strong>Bank:</strong> {selectedCompany.bankDetails.bankName}</div>
                          </>
                        ) : (
                          <div className="text-gray-500">No bank details provided</div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="min-w-60">
                    <div className="mb-4 text-sm font-bold text-gray-700 uppercase">
                      Total (in words): {numberToWords(grandTotal).toUpperCase()}
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between py-1 border-b border-gray-200">
                        <span>Amount</span>
                        <span>{currencySymbol}{subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-gray-200">
                        <span>CGST</span>
                        <span>{currencySymbol}{totalCGST.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-gray-200">
                        <span>SGST</span>
                        <span>{currencySymbol}{totalSGST.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b-2 font-bold text-lg" style={{ borderColor: currentTemplate.primaryColor, color: currentTemplate.primaryColor }}>
                        <span>Total (INR)</span>
                        <span>{currencySymbol}{grandTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Terms and Notes */}
                {(terms || notes) && (
                  <div className="border-t border-gray-200 pt-6 mt-6">
                    {terms && (
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">Terms & Conditions:</h4>
                        <p className="text-gray-700 text-sm whitespace-pre-line">{terms}</p>
                      </div>
                    )}
                    {notes && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Notes:</h4>
                        <p className="text-gray-700 text-sm whitespace-pre-line">{notes}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Column Editor Modal */}
      {showColumnEditor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-200" style={{ backgroundColor: currentTemplate.primaryColor }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-semibold text-white">Customize Columns & Formulas</h2>
                  <span className="text-2xl">💡</span>
                </div>
                <button
                  onClick={() => setShowColumnEditor(false)}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg text-white"
                >
                  <X size={20} />
                </button>
              </div>
              <p className="text-white text-opacity-90 mt-2 text-sm">
                Create/edit columns, customize formulas, make private columns visible to you, but not to clients, make hidden columns (hidden to both you & your clients)
              </p>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {/* Add New Column Button */}
              <div className="flex justify-end mb-6">
                <button 
                  onClick={() => {
                    const newColumn = {
                      id: `custom_${Date.now()}`,
                      name: 'New Column',
                      type: 'TEXT',
                      visible: true,
                      required: false
                    };
                    setColumnConfig([...columnConfig, newColumn]);
                  }}
                  className="flex items-center gap-2 px-4 py-2 border-2 rounded-lg font-medium transition-colors"
                  style={{ 
                    borderColor: currentTemplate.primaryColor,
                    color: currentTemplate.primaryColor
                  }}
                >
                  <Plus size={16} />
                  Add New Column
                </button>
              </div>

              {/* Columns Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-4 px-3 font-medium text-gray-700 w-12"></th>
                      <th className="text-left py-4 px-3 font-medium text-gray-700">Column Name</th>
                      <th className="text-left py-4 px-3 font-medium text-gray-700">Column Type</th>
                      <th className="text-center py-4 px-3 font-medium text-gray-700 w-32">Visibility</th>
                    </tr>
                  </thead>
                  <tbody>
                    {columnConfig.map((column, index) => (
                      <React.Fragment key={column.id}>
                        <tr 
                          className={`border-b border-gray-100 ${draggedIndex === index ? 'opacity-50' : ''}`}
                          draggable={!column.required}
                          onDragStart={(e) => handleDragStart(e, index)}
                          onDragOver={(e) => handleDragOver(e, index)}
                          onDrop={(e) => handleDrop(e, index)}
                          onDragEnd={handleDragEnd}
                        >
                          <td className="py-4 px-3">
                            <div className="flex items-center justify-center gap-0.5">
                              <div className={`w-1 h-6 rounded-sm cursor-move transition-colors ${
                                column.required ? 'bg-gray-300' : 'bg-gray-400 hover:bg-gray-600'
                              }`}></div>
                              <div className={`w-1 h-6 rounded-sm cursor-move transition-colors ${
                                column.required ? 'bg-gray-300' : 'bg-gray-400 hover:bg-gray-600'
                              }`}></div>
                          </div>
                        </td>
                          <td className="py-4 px-3">
                          <input
                            type="text"
                            value={column.name}
                            onChange={(e) => {
                              const updated = [...columnConfig];
                              updated[index] = { ...updated[index], name: e.target.value };
                              setColumnConfig(updated);
                            }}
                              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            />
                            {column.formula && column.type === 'FORMULA' && (
                              <div className="text-xs text-gray-500 mt-1 bg-gray-50 p-2 rounded border">
                                <span className="font-medium">Formula:</span> {column.formula}
                            </div>
                          )}
                        </td>
                          <td className="py-4 px-3">
                          <select
                            value={column.type}
                            onChange={(e) => {
                              const updated = [...columnConfig];
                              updated[index] = { ...updated[index], type: e.target.value };
                                if (e.target.value === 'FORMULA') {
                                  setEditingFormula(column.id);
                                }
                              setColumnConfig(updated);
                            }}
                              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          >
                            <option value="TEXT">TEXT</option>
                            <option value="NUMBER">NUMBER</option>
                            <option value="CURRENCY">CURRENCY</option>
                            <option value="FORMULA">FORMULA</option>
                            <option value="DATE">DATE</option>
                          </select>
                        </td>
                          <td className="py-4 px-3 text-center">
                            <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                                  if (!column.required) {
                              const updated = [...columnConfig];
                                    updated[index] = { ...updated[index], visible: !column.visible };
                              setColumnConfig(updated);
                                  }
                                }}
                                className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                                  column.visible 
                                    ? 'bg-blue-500' 
                                    : 'bg-gray-300'
                                } ${
                                  column.required 
                                    ? 'cursor-not-allowed opacity-50' 
                                    : 'cursor-pointer'
                                }`}
                                disabled={column.required}
                              >
                                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${
                                  column.visible ? 'translate-x-6' : 'translate-x-0.5'
                                }`}></div>
                          </button>
                              <span className={`text-sm font-medium ${
                                column.visible ? 'text-blue-600' : 'text-gray-500'
                              }`}>
                                {column.visible ? 'Visible' : 'Hidden'}
                              </span>
                            </div>
                        </td>
                        </tr>
                        
                        {/* Formula Builder Row */}
                        {column.type === 'FORMULA' && editingFormula === column.id && (
                          <tr className="bg-blue-50 border-b border-blue-200">
                            <td colSpan={4} className="p-4">
                              <div className="bg-white rounded-lg p-4 border border-blue-200">
                                <div className="flex items-center gap-2 mb-3">
                                  <PenTool size={16} className="text-blue-600" />
                                  <h4 className="font-medium text-blue-900">Formula Builder</h4>
                          <button
                                    onClick={() => setEditingFormula(null)}
                                    className="ml-auto p-1 hover:bg-blue-100 rounded"
                                  >
                                    <X size={16} className="text-blue-600" />
                                  </button>
                                </div>
                                
                                {/* Quick Formulas */}
                                <div className="mb-4">
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Quick Formulas
                                  </label>
                                  <div className="grid grid-cols-2 gap-2">
                                    {formulaSuggestions.map((suggestion, idx) => (
                                      <button
                                        key={idx}
                            onClick={() => {
                                          if (suggestion.value) {
                              const updated = [...columnConfig];
                                            const colIndex = updated.findIndex(col => col.id === column.id);
                                            if (colIndex !== -1) {
                                              updated[colIndex] = { 
                                                ...updated[colIndex], 
                                                formula: suggestion.value 
                                              };
                              setColumnConfig(updated);
                                            }
                                          }
                                        }}
                                        className="p-2 text-left border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                      >
                                        <div className="font-medium text-sm">{suggestion.label}</div>
                                        <div className="text-xs text-gray-500">{suggestion.description}</div>
                          </button>
                                    ))}
                                  </div>
                                </div>

                                {/* Custom Formula Input */}
                                <div className="mb-4">
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Custom Formula
                                  </label>
                                  <div className="flex gap-2">
                                    <input
                                      type="text"
                                      value={column.formula || ''}
                                      onChange={(e) => {
                                        const updated = [...columnConfig];
                                        const colIndex = updated.findIndex(col => col.id === column.id);
                                        if (colIndex !== -1) {
                                          updated[colIndex] = { 
                                            ...updated[colIndex], 
                                            formula: e.target.value 
                                          };
                                          setColumnConfig(updated);
                                        }
                                      }}
                                      placeholder="e.g., Quantity * Rate"
                                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                  </div>
                                </div>

                                {/* Available Fields */}
                                <div className="mb-4">
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Available Fields (Click to insert)
                                  </label>
                                  <div className="flex flex-wrap gap-2">
                                    {columnConfig.filter(col => col.id !== column.id && col.visible).map(field => (
                                      <button
                                        key={field.id}
                                        onClick={() => insertFormulaText(column.id, field.name)}
                                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors"
                                      >
                                        {field.name}
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                {/* Operators */}
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Operators
                                  </label>
                                  <div className="flex gap-2">
                                    {['+', '-', '*', '/', '(', ')', '%'].map(op => (
                                      <button
                                        key={op}
                                        onClick={() => insertFormulaText(column.id, ` ${op} `)}
                                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded border hover:bg-gray-200 transition-colors font-mono"
                                      >
                                        {op}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              </div>
                        </td>
                      </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 flex justify-between">
              <div className="flex gap-3">
                <button
                  onClick={() => setShowColumnEditor(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Reset to default configuration
                    setColumnConfig([
                      { id: 'item', name: 'Item', type: 'TEXT', visible: true, required: true },
                      { id: 'hsn', name: 'HSN/SAC', type: 'NUMBER', visible: false, required: false },
                      { id: 'gstRate', name: 'GST Rate', type: 'NUMBER', visible: true, required: false },
                      { id: 'quantity', name: 'Quantity', type: 'NUMBER', visible: true, required: true },
                      { id: 'rate', name: 'Rate', type: 'CURRENCY', visible: true, required: true },
                      { id: 'amount', name: 'Amount', type: 'FORMULA', visible: true, required: true, formula: '(Quantity * Rate)' },
                      { id: 'cgst', name: 'CGST', type: 'FORMULA', visible: true, required: false, formula: 'Auto calculated' },
                      { id: 'sgst', name: 'SGST', type: 'FORMULA', visible: true, required: false, formula: 'Auto calculated' },
                      { id: 'total', name: 'Total', type: 'FORMULA', visible: true, required: true, formula: 'Auto calculated' }
                    ]);
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Reset to Default
                </button>
              </div>
              <button
                onClick={() => {
                  // Apply column configuration
                  setShowColumnEditor(false);
                }}
                className="px-6 py-2 text-white rounded-lg transition-colors font-medium"
                style={{ backgroundColor: '#E91E63' }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bank Details Editor Modal */}
      {showBankDetailsEditor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200" style={{ backgroundColor: currentTemplate.primaryColor }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-semibold text-white">Bank Details</h2>
                  <span className="text-2xl">🏦</span>
                </div>
                <button
                  onClick={() => setShowBankDetailsEditor(false)}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg text-white"
                >
                  <X size={20} />
                </button>
              </div>
              <p className="text-white text-opacity-90 mt-2 text-sm">
                Add your company's bank details for payment information
              </p>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Name *
                  </label>
                  <input
                    type="text"
                    value={selectedCompany.bankDetails?.accountName || ''}
                    onChange={(e) => setSelectedCompany({
                      ...selectedCompany,
                      bankDetails: {
                        ...selectedCompany.bankDetails!,
                        accountName: e.target.value
                      }
                    })}
                    placeholder="Enter account holder name"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Number *
                  </label>
                  <input
                    type="text"
                    value={selectedCompany.bankDetails?.accountNumber || ''}
                    onChange={(e) => setSelectedCompany({
                      ...selectedCompany,
                      bankDetails: {
                        ...selectedCompany.bankDetails!,
                        accountNumber: e.target.value
                      }
                    })}
                    placeholder="Enter account number"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    IFSC Code *
                  </label>
                  <input
                    type="text"
                    value={selectedCompany.bankDetails?.ifsc || ''}
                    onChange={(e) => setSelectedCompany({
                      ...selectedCompany,
                      bankDetails: {
                        ...selectedCompany.bankDetails!,
                        ifsc: e.target.value.toUpperCase()
                      }
                    })}
                    placeholder="Enter IFSC code"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Type *
                  </label>
                  <select
                    value={selectedCompany.bankDetails?.accountType || 'Current'}
                    onChange={(e) => setSelectedCompany({
                      ...selectedCompany,
                      bankDetails: {
                        ...selectedCompany.bankDetails!,
                        accountType: e.target.value
                      }
                    })}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="Current">Current Account</option>
                    <option value="Savings">Savings Account</option>
                    <option value="Business">Business Account</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bank Name *
                  </label>
                  <input
                    type="text"
                    value={selectedCompany.bankDetails?.bankName || ''}
                    onChange={(e) => setSelectedCompany({
                      ...selectedCompany,
                      bankDetails: {
                        ...selectedCompany.bankDetails!,
                        bankName: e.target.value
                      }
                    })}
                    placeholder="Enter bank name"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-between">
              <button
                onClick={() => setShowBankDetailsEditor(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowBankDetailsEditor(false);
                  setShowBankDetails(true);
                }}
                className="px-6 py-2 text-white rounded-lg transition-colors font-medium"
                style={{ backgroundColor: currentTemplate.primaryColor }}
              >
                Save Bank Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InlineInvoiceMaker; 