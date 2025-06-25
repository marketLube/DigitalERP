import React, { useState, useEffect } from 'react';
import { ArrowLeft, Download, Save, RotateCcw, Plus, Trash2, Calendar, User, Building2, Mail, Phone, MapPin, Hash, Percent, CreditCard, FileText, Eye, Send, Printer, Share2, CheckCircle, AlertCircle, Building, ChevronDown } from 'lucide-react';
import { useInvoices } from '../../contexts/InvoiceContext';

// Types
interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address: string;
  gstin?: string;
  logo?: string;
}

interface ShippingAddress {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface BankDetails {
  accountName: string;
  accountNumber: string;
  bankName: string;
  ifscCode: string;
  accountType: string;
}

interface InvoiceTemplate {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  layout: 'modern' | 'classic' | 'minimal' | 'professional';
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  date: Date;
  dueDate: Date;
  client: Client;
  items: LineItem[];
  status: 'Draft' | 'Sent' | 'Paid' | 'Overdue';
  subtotal: number;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  discountAmount: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  notes?: string;
  paymentTerms?: string;
  department?: string;
  shippingAddress?: ShippingAddress;
  bankDetails?: BankDetails;
  template: string;
  companyLogo?: string;
  companyName?: string;
  companyEmail?: string;
  companyPhone?: string;
  companyAddress?: string;
  companyWebsite?: string;
}

interface NewInvoicePageProps {
  onClose: () => void;
  onSave: (invoice: Invoice) => void;
}

const NewInvoicePage: React.FC<NewInvoicePageProps> = ({ onClose, onSave }) => {
  const { addInvoice } = useInvoices();
  const [currentStep, setCurrentStep] = useState(1);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showAddClient, setShowAddClient] = useState(false);
  const [showAddBusiness, setShowAddBusiness] = useState(false);
  const [currency, setCurrency] = useState('INR');
  const [currencySymbol, setCurrencySymbol] = useState('₹');
  const [showShippingAddress, setShowShippingAddress] = useState(false);
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('business');
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);

  // Invoice templates
  const invoiceTemplates: InvoiceTemplate[] = [
    {
      id: 'business',
      name: 'Business Blue',
      primaryColor: '#2563EB',
      secondaryColor: '#DBEAFE',
      fontFamily: 'Arial',
      layout: 'modern'
    },
    {
      id: 'corporate',
      name: 'Corporate Gray',
      primaryColor: '#374151',
      secondaryColor: '#F3F4F6',
      fontFamily: 'Helvetica',
      layout: 'professional'
    },
    {
      id: 'elegant',
      name: 'Elegant Purple',
      primaryColor: '#7C3AED',
      secondaryColor: '#EDE9FE',
      fontFamily: 'Georgia',
      layout: 'classic'
    },
    {
      id: 'fresh',
      name: 'Fresh Green',
      primaryColor: '#059669',
      secondaryColor: '#D1FAE5',
      fontFamily: 'Inter',
      layout: 'minimal'
    },
    {
      id: 'bold',
      name: 'Bold Orange',
      primaryColor: '#EA580C',
      secondaryColor: '#FED7AA',
      fontFamily: 'Roboto',
      layout: 'modern'
    },
    {
      id: 'simple',
      name: 'Simple Black',
      primaryColor: '#000000',
      secondaryColor: '#F9FAFB',
      fontFamily: 'Arial',
      layout: 'minimal'
    }
  ];

  // Departments list
  const departments = [
    'Video Production',
    'Digital Marketing', 
    'UI/UX Team',
    'Development Team',
    'Performance Marketing',
    'Sales Team',
    'Operations Team',
    'Finance Team',
    'HR Team',
    'Customer Support'
  ];

  // Sample clients for dropdown
  const sampleClients: Client[] = [
    {
      id: '1',
      name: 'Tech Solutions Inc.',
      email: 'contact@techsolutions.com',
      phone: '+1-555-0123',
      address: '123 Tech Street, Suite 100, San Francisco, CA',
      gstin: '22AAAAA0000A1Z5',
      logo: ''
    },
    {
      id: '2',
      name: 'Green Energy Corp',
      email: 'info@greenenergy.ca',
      phone: '+1-416-555-0456',
      address: '456 Green Avenue, Toronto, ON',
      gstin: '27BBBBB1111B2Z6',
      logo: ''
    },
    {
      id: '3',
      name: 'Digital Marketing Pro',
      email: 'hello@digitalmarketingpro.co.uk',
      phone: '+44-20-7123-4567',
      address: '789 Marketing Lane, London, UK',
      gstin: '29CCCCC2222C3Z7',
      logo: ''
    },
    {
      id: '4',
      name: 'Creative Design Studio',
      email: 'studio@creativedesign.com',
      phone: '+91-98765-43210',
      address: '321 Design Plaza, Mumbai, MH',
      gstin: '27DDDDD3333D4Z8',
      logo: ''
    }
  ];

  // New client form state
  const [newClient, setNewClient] = useState<Partial<Client>>({
    name: '',
    email: '',
    phone: '',
    address: '',
    gstin: '',
    logo: ''
  });

  // New business form state
  const [newBusiness, setNewBusiness] = useState({
    companyName: '',
    companyEmail: '',
    companyPhone: '',
    companyAddress: '',
    companyWebsite: '',
    companyLogo: ''
  });

  // Invoice State
  const [invoice, setInvoice] = useState<Invoice>({
    id: Date.now().toString(),
    invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
    date: new Date(),
    dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    client: {
      id: '',
      name: '',
      email: '',
      phone: '',
      address: '',
      gstin: '',
      logo: ''
    },
    items: [{
      id: '1',
      description: '',
      quantity: 1,
      unitPrice: 0,
      amount: 0
    }],
    status: 'Draft',
    subtotal: 0,
    discountType: 'percentage',
    discountValue: 0,
    discountAmount: 0,
    taxRate: 18,
    taxAmount: 0,
    total: 0,
    notes: '',
    paymentTerms: 'Net 30',
    department: '',
    template: selectedTemplate,
    shippingAddress: {
      name: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'India'
    },
    bankDetails: {
      accountName: '',
      accountNumber: '',
      bankName: '',
      ifscCode: '',
      accountType: 'Current'
    },
    companyName: '',
    companyEmail: '',
    companyPhone: '',
    companyAddress: '',
    companyWebsite: ''
  });

  // Validation variables
  const canProceedToStep2 = invoice.client.name && invoice.client.email;
  const canProceedToStep3 = canProceedToStep2 && invoice.items.some(item => item.description && item.quantity > 0 && item.unitPrice > 0);

  // Calculate amounts whenever items or discounts change
  useEffect(() => {
    const subtotal = invoice.items.reduce((sum, item) => sum + item.amount, 0);
    const discountAmount = invoice.discountType === 'percentage' 
      ? (subtotal * invoice.discountValue) / 100
      : invoice.discountValue;
    // GST is calculated after discount
    const taxableAmount = subtotal - discountAmount;
    const taxAmount = (taxableAmount * invoice.taxRate) / 100;
    const total = taxableAmount + taxAmount;

    setInvoice(prev => ({
      ...prev,
      subtotal,
      discountAmount,
      taxAmount,
      total
    }));
  }, [invoice.items, invoice.discountType, invoice.discountValue, invoice.taxRate]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + S to save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (canProceedToStep3) {
          handleSave();
        }
      }
      // Ctrl/Cmd + P to export PDF
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        if (canProceedToStep3) {
          handleDownloadPDF();
        }
      }
      // Ctrl/Cmd + N to add new item
      if ((e.ctrlKey || e.metaKey) && e.key === 'n' && currentStep === 2) {
        e.preventDefault();
        addNewItem();
      }
      // Escape to close modals
      if (e.key === 'Escape') {
        if (showAddClient) {
          setShowAddClient(false);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [canProceedToStep3, currentStep, showAddClient]);

  // Update item amounts when quantity or price changes
  useEffect(() => {
    setInvoice(prev => ({
      ...prev,
      items: prev.items.map(item => ({
        ...item,
        amount: item.quantity * item.unitPrice
      }))
    }));
  }, []);

  const handleClientChange = (field: keyof Client, value: string) => {
    setInvoice(prev => ({
      ...prev,
      client: { ...prev.client, [field]: value }
    }));
  };

  const handleSelectClient = (clientId: string) => {
    const selectedClient = sampleClients.find(c => c.id === clientId);
    if (selectedClient) {
      setInvoice(prev => ({
        ...prev,
        client: {
          ...selectedClient,
          logo: selectedClient.logo || ''
        }
      }));
    }
  };

  const handleSaveNewClient = () => {
    if (newClient.name && newClient.email) {
      const client: Client = {
        id: Date.now().toString(),
        name: newClient.name,
        email: newClient.email,
        phone: newClient.phone || '',
        address: newClient.address || '',
        gstin: newClient.gstin || '',
        logo: newClient.logo || ''
      };
      setInvoice(prev => ({
        ...prev,
        client: client
      }));
      setShowAddClient(false);
      setNewClient({
        name: '',
        email: '',
        phone: '',
        address: '',
        gstin: '',
        logo: ''
      });
    }
  };

  const handleSaveNewBusiness = () => {
    if (newBusiness.companyName && newBusiness.companyEmail) {
      setInvoice(prev => ({
        ...prev,
        companyName: newBusiness.companyName,
        companyEmail: newBusiness.companyEmail,
        companyPhone: newBusiness.companyPhone,
        companyAddress: newBusiness.companyAddress,
        companyWebsite: newBusiness.companyWebsite,
        companyLogo: newBusiness.companyLogo
      }));
      
      setNewBusiness({
        companyName: '',
        companyEmail: '',
        companyPhone: '',
        companyAddress: '',
        companyWebsite: '',
        companyLogo: ''
      });
      setShowAddBusiness(false);
    }
  };

  const formatCurrency = (amount: number): string => {
    return `${currencySymbol}${amount.toFixed(2)}`;
  };

  const getCurrentTemplate = (): InvoiceTemplate => {
    return invoiceTemplates.find(t => t.id === selectedTemplate) || invoiceTemplates[0];
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setInvoice(prev => ({
          ...prev,
          companyLogo: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBusinessLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewBusiness(prev => ({
          ...prev,
          companyLogo: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClientLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewClient(prev => ({
          ...prev,
          logo: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleShippingChange = (field: keyof ShippingAddress, value: string) => {
    setInvoice(prev => ({
      ...prev,
      shippingAddress: {
        name: prev.shippingAddress?.name || '',
        address: prev.shippingAddress?.address || '',
        city: prev.shippingAddress?.city || '',
        state: prev.shippingAddress?.state || '',
        zipCode: prev.shippingAddress?.zipCode || '',
        country: prev.shippingAddress?.country || '',
        ...prev.shippingAddress,
        [field]: value
      }
    }));
  };

  const handleBankDetailsChange = (field: keyof BankDetails, value: string) => {
    setInvoice(prev => ({
      ...prev,
      bankDetails: {
        ...prev.bankDetails!,
        [field]: value
      }
    }));
  };

  const handleInvoiceChange = (field: string, value: any) => {
    setInvoice(prev => ({ ...prev, [field]: value }));
  };

  const handleItemChange = (itemId: string, field: keyof LineItem, value: any) => {
    setInvoice(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id === itemId) {
          let processedValue = value;
          // Handle number inputs - remove default 0 when user starts typing
          if ((field === 'quantity' || field === 'unitPrice') && typeof value === 'string') {
            processedValue = value === '' ? 0 : parseFloat(value) || 0;
          }
          
          const updatedItem = { ...item, [field]: processedValue };
          if (field === 'quantity' || field === 'unitPrice') {
            updatedItem.amount = updatedItem.quantity * updatedItem.unitPrice;
          }
          return updatedItem;
        }
        return item;
      })
    }));
  };

  const addNewItem = () => {
    const newItem: LineItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      amount: 0
    };
    setInvoice(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  const removeItem = (itemId: string) => {
    if (invoice.items.length > 1) {
      setInvoice(prev => ({
        ...prev,
        items: prev.items.filter(item => item.id !== itemId)
      }));
    }
  };

  const duplicateItem = (itemId: string) => {
    const itemToDuplicate = invoice.items.find(item => item.id === itemId);
    if (itemToDuplicate) {
      const duplicatedItem: LineItem = {
        ...itemToDuplicate,
        id: Date.now().toString(),
        description: `${itemToDuplicate.description} (Copy)`
      };
      setInvoice(prev => ({
        ...prev,
        items: [...prev.items, duplicatedItem]
      }));
    }
  };

  const handleSave = () => {
    if (!invoice.client.name || !invoice.client.email || invoice.items.some(item => !item.description)) {
      alert('Please fill in all required fields');
      return;
    }
    
    console.log('💾 Saving invoice from NewInvoicePage:', invoice);
    console.log('💾 Invoice status:', invoice.status);
    console.log('💾 Invoice total:', invoice.total);
    console.log('💾 Invoice client:', invoice.client);
    console.log('💾 Invoice items:', invoice.items);
    
    // Call the onSave prop to handle saving (this will add to InvoicesPage state)
    onSave(invoice);
    
    // Show success message - don't close modal here, parent will handle it
    alert('Invoice created successfully!');
    
    console.log('💾 Invoice save completed, parent will handle modal closing');
  };

  const handleSampleFill = () => {
    // Fill with sample data for testing
    setInvoice(prev => ({
      ...prev,
      // Company information
      companyName: 'TechCorp Solutions',
      companyEmail: 'contact@techcorp.com',
      companyPhone: '+1 (555) 123-4567',
      companyAddress: '123 Tech Street, Silicon Valley, CA 94105',
      companyWebsite: 'https://www.techcorp.com',
      // Client information
      client: {
        id: 'sample-client',
        name: 'Sample Client Inc.',
        email: 'client@sampleclient.com',
        phone: '+1 (555) 987-6543',
        address: '456 Business Ave, New York, NY 10001',
        gstin: '22SAMPLE0000A1Z5',
        logo: ''
      },
      // Invoice details
      invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
      date: new Date(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      department: 'Development Team',
      paymentTerms: 'Net 30',
      notes: 'Thank you for your business! Payment is due within 30 days.',
      // Sample items
      items: [
        {
          id: '1',
          description: 'Website Development',
          quantity: 1,
          unitPrice: 5000,
          amount: 5000
        },
        {
          id: '2',
          description: 'Mobile App Development',
          quantity: 1,
          unitPrice: 8000,
          amount: 8000
        },
        {
          id: '3',
          description: 'UI/UX Design Services',
          quantity: 20,
          unitPrice: 150,
          amount: 3000
        }
      ],
      // Calculated values
      subtotal: 16000,
      discountType: 'percentage',
      discountValue: 10,
      discountAmount: 1600,
      taxRate: 18,
      taxAmount: 2592,
      total: 16992
    }));

    // Also set shipping to same as billing
    setShowShippingAddress(false);
    
    alert('Sample data filled! You can now review and create the invoice.');
  };

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    
    try {
      // Create a new window for PDF generation
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        alert('Please allow popups to generate PDF');
        setIsGeneratingPDF(false);
        return;
      }

      const currentTemplate = getCurrentTemplate();
      
      const invoiceHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Invoice ${invoice.invoiceNumber}</title>
          <style>
            @page { size: A4; margin: 20mm; }
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: ${currentTemplate.fontFamily}, sans-serif; 
              color: #333; 
              line-height: 1.6; 
            }
            .header { 
              display: flex; 
              justify-content: space-between; 
              align-items: flex-start; 
              margin-bottom: 30px; 
              padding-bottom: 20px; 
              border-bottom: 2px solid ${currentTemplate.primaryColor}; 
            }
            .logo { max-width: 150px; max-height: 80px; }
            .company-info { text-align: right; }
            .invoice-title { 
              font-size: 28px; 
              font-weight: bold; 
              color: ${currentTemplate.primaryColor}; 
              margin-bottom: 10px; 
            }
            .invoice-details { 
              display: flex; 
              justify-content: space-between; 
              margin-bottom: 30px; 
            }
            .bill-to, .ship-to { 
              background: ${currentTemplate.secondaryColor}; 
              padding: 15px; 
              border-radius: 5px; 
              width: 48%; 
            }
            .items-table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-bottom: 30px; 
            }
            .items-table th, .items-table td { 
              padding: 12px; 
              text-align: left; 
              border-bottom: 1px solid #ddd; 
            }
            .items-table th { 
              background: ${currentTemplate.primaryColor}; 
              color: white; 
              font-weight: bold; 
            }
            .totals { 
              width: 300px; 
              margin-left: auto; 
              background: ${currentTemplate.secondaryColor}; 
              padding: 20px; 
              border-radius: 5px; 
            }
            .total-row { 
              display: flex; 
              justify-content: space-between; 
              margin-bottom: 10px; 
            }
            .total-final { 
              font-weight: bold; 
              font-size: 18px; 
              color: ${currentTemplate.primaryColor}; 
              border-top: 2px solid ${currentTemplate.primaryColor}; 
              padding-top: 10px; 
            }
            .bank-details { 
              margin-top: 30px; 
              padding: 15px; 
              background: #f9f9f9; 
              border-radius: 5px; 
            }
            .notes { 
              margin-top: 20px; 
              padding: 15px; 
              background: #f9f9f9; 
              border-radius: 5px; 
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              ${invoice.companyLogo ? `<img src="${invoice.companyLogo}" alt="Company Logo" class="logo">` : ''}
              <div style="margin-top: 10px;">
                <div style="font-size: 20px; font-weight: bold; color: ${currentTemplate.primaryColor};">
                  ${invoice.companyName || 'Your Company'}
                </div>
                ${invoice.companyEmail ? `<div style="font-size: 12px; color: #666;">${invoice.companyEmail}</div>` : ''}
                ${invoice.companyPhone ? `<div style="font-size: 12px; color: #666;">${invoice.companyPhone}</div>` : ''}
                ${invoice.companyWebsite ? `<div style="font-size: 12px; color: #666;">${invoice.companyWebsite}</div>` : ''}
                ${invoice.companyAddress ? `<div style="font-size: 12px; color: #666; margin-top: 5px;">${invoice.companyAddress}</div>` : ''}
              </div>
            </div>
            <div class="company-info">
              <div class="invoice-title">INVOICE</div>
              <div><strong>Invoice #:</strong> ${invoice.invoiceNumber}</div>
              <div><strong>Date:</strong> ${invoice.date.toLocaleDateString()}</div>
              <div><strong>Due Date:</strong> ${invoice.dueDate.toLocaleDateString()}</div>
            </div>
          </div>

          <div class="invoice-details">
            <div class="bill-to">
              <h3 style="color: ${currentTemplate.primaryColor}; margin-bottom: 10px;">Bill To:</h3>
              <div><strong>${invoice.client.name}</strong></div>
              <div>${invoice.client.email}</div>
              ${invoice.client.phone ? `<div>${invoice.client.phone}</div>` : ''}
              <div>${invoice.client.address}</div>
              ${invoice.client.gstin ? `<div><strong>GSTIN:</strong> ${invoice.client.gstin}</div>` : ''}
            </div>
            
            ${showShippingAddress && invoice.shippingAddress?.name ? `
            <div class="ship-to">
              <h3 style="color: ${currentTemplate.primaryColor}; margin-bottom: 10px;">Ship To:</h3>
              <div><strong>${invoice.shippingAddress.name}</strong></div>
              <div>${invoice.shippingAddress.address}</div>
              <div>${invoice.shippingAddress.city}, ${invoice.shippingAddress.state} ${invoice.shippingAddress.zipCode}</div>
              <div>${invoice.shippingAddress.country}</div>
            </div>
            ` : ''}
          </div>

          <table class="items-table">
            <thead>
              <tr>
                <th>Description</th>
                <th style="text-align: center;">Quantity</th>
                <th style="text-align: right;">Unit Price</th>
                <th style="text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${invoice.items.map(item => `
                <tr>
                  <td>${item.description}</td>
                  <td style="text-align: center;">${item.quantity}</td>
                  <td style="text-align: right;">${formatCurrency(item.unitPrice)}</td>
                  <td style="text-align: right;">${formatCurrency(item.amount)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="totals">
            <div class="total-row">
              <span>Subtotal:</span>
              <span>${formatCurrency(invoice.subtotal)}</span>
            </div>
            ${invoice.discountAmount > 0 ? `
            <div class="total-row">
              <span>Discount:</span>
              <span>-${formatCurrency(invoice.discountAmount)}</span>
            </div>
            ` : ''}
            <div class="total-row">
              <span>Tax (${invoice.taxRate}%):</span>
              <span>${formatCurrency(invoice.taxAmount)}</span>
            </div>
            <div class="total-row total-final">
              <span>Total:</span>
              <span>${formatCurrency(invoice.total)}</span>
            </div>
          </div>

          ${showBankDetails && invoice.bankDetails?.accountNumber ? `
          <div class="bank-details">
            <h3 style="color: ${currentTemplate.primaryColor}; margin-bottom: 10px;">Bank Details:</h3>
            <div><strong>Account Name:</strong> ${invoice.bankDetails.accountName}</div>
            <div><strong>Account Number:</strong> ${invoice.bankDetails.accountNumber}</div>
            <div><strong>Bank Name:</strong> ${invoice.bankDetails.bankName}</div>
            <div><strong>IFSC Code:</strong> ${invoice.bankDetails.ifscCode}</div>
            <div><strong>Account Type:</strong> ${invoice.bankDetails.accountType}</div>
          </div>
          ` : ''}

          ${invoice.notes ? `
          <div class="notes">
            <h3 style="color: ${currentTemplate.primaryColor}; margin-bottom: 10px;">Notes:</h3>
            <p>${invoice.notes}</p>
          </div>
          ` : ''}

          <div style="margin-top: 30px; text-align: center; color: #666; font-size: 12px;">
            <p>Payment Terms: ${invoice.paymentTerms}</p>
            <p>Thank you for your business!</p>
          </div>
        </body>
        </html>
      `;

      printWindow.document.write(invoiceHTML);
      printWindow.document.close();
      
      // Wait for content to load, then print
      setTimeout(() => {
        printWindow.print();
        setIsGeneratingPDF(false);
      }, 1000);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
      setIsGeneratingPDF(false);
    }
  };

  // Validation messages
  const getStep1ValidationMessage = () => {
    if (!invoice.client.name) return 'Client name is required';
    if (!invoice.client.email) return 'Client email is required';
    return '';
  };

  const getStep2ValidationMessage = () => {
    if (!canProceedToStep2) return getStep1ValidationMessage();
    const emptyItems = invoice.items.filter(item => !item.description || item.quantity <= 0 || item.unitPrice <= 0);
    if (emptyItems.length > 0) return 'Please fill in all item details';
    return '';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Close Invoice Creator"
              >
                <ArrowLeft size={20} />
              </button>
              {currentStep > 1 && (
                <button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                  title="Go to previous step"
                >
                  <ArrowLeft size={16} />
                  Back to Step {currentStep - 1}
                </button>
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Create Invoice</h1>
                <p className="text-sm text-gray-600">
                  Step {currentStep} of 3 - {currentStep === 1 ? 'Client Information' : currentStep === 2 ? 'Invoice Details' : 'Review & Send'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  const draftInvoice = { ...invoice, status: 'Draft' as const };
                  onSave(draftInvoice);
                  alert('Draft saved successfully!');
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <Save size={16} />
                Save Draft
              </button>
              <button
                onClick={handleSampleFill}
                className="px-4 py-2 border border-orange-300 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors flex items-center gap-2"
                title="Fill with sample data for testing"
              >
                <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 12l2 2 4-4"/>
                  <path d="M21 12c.552 0 1-.448 1-1V5c0-.552-.448-1-1-1H3c-.552 0-1 .448-1 1v6c0 .552.448 1 1 1h9"/>
                  <path d="M3 10h18"/>
                </svg>
                Sample Fill
              </button>
              <button
                onClick={() => setShowPreview(true)}
                className="px-4 py-2 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2"
              >
                <Eye size={16} />
                Preview
              </button>
              <button
                onClick={handleDownloadPDF}
                disabled={isGeneratingPDF || !canProceedToStep3}
                className="px-4 py-2 border border-green-300 text-green-600 rounded-lg hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <Download size={16} />
                {isGeneratingPDF ? 'Generating...' : 'Download PDF'}
              </button>
              <button
                onClick={handleSave}
                disabled={!canProceedToStep3}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <CheckCircle size={16} />
                Create Invoice
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                step <= currentStep 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {step}
              </div>
              <div className="ml-3">
                <p className={`font-medium ${step <= currentStep ? 'text-blue-600' : 'text-gray-500'}`}>
                  {step === 1 ? 'Client Info' : step === 2 ? 'Invoice Details' : 'Review'}
                </p>
                <p className="text-sm text-gray-500">
                  {step === 1 ? 'Client details' : step === 2 ? 'Items & pricing' : 'Final review'}
                </p>
              </div>
              {step < 3 && (
                <div className={`w-16 h-0.5 ml-6 ${
                  step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {/* Step 1: Client Information */}
          {currentStep === 1 && (
            <div className="p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Invoice Information</h2>
              
              {/* Bill From and Bill To - Horizontal Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Bill From Section */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                      <Building size={20} className="text-green-600" />
                      Billed By
                      <span className="text-sm text-gray-500 font-normal">Your Details</span>
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Select Business
                        </label>
                        <select
                          value={invoice.companyName || ''}
                          onChange={(e) => {
                            if (e.target.value) {
                              // Set predefined company data based on selection
                              const businessData = {
                                'TechCorp Solutions': {
                                  email: 'contact@techcorp.com',
                                  phone: '+1 (555) 123-4567',
                                  address: '123 Tech Street, Silicon Valley, CA 94105',
                                  website: 'https://www.techcorp.com'
                                },
                                'Digital Marketing Pro': {
                                  email: 'hello@digitalmarketingpro.com',
                                  phone: '+1 (555) 987-6543',
                                  address: '456 Marketing Ave, New York, NY 10001',
                                  website: 'https://www.digitalmarketingpro.com'
                                },
                                'Creative Design Studio': {
                                  email: 'studio@creativedesign.com',
                                  phone: '+91 98765 43210',
                                  address: '789 Design Plaza, Mumbai, MH 400001',
                                  website: 'https://www.creativedesign.com'
                                },
                                'mohammed zaamin t': {
                                  email: 'zaamin@company.com',
                                  phone: '+91 9876543210',
                                  address: 'India',
                                  website: 'https://www.zaamin.com'
                                }
                              };

                              const selectedBusiness = businessData[e.target.value as keyof typeof businessData];
                              setInvoice(prev => ({
                                ...prev,
                                companyName: e.target.value,
                                companyEmail: selectedBusiness?.email || '',
                                companyPhone: selectedBusiness?.phone || '',
                                companyAddress: selectedBusiness?.address || '',
                                companyWebsite: selectedBusiness?.website || ''
                              }));
                            } else {
                              setInvoice(prev => ({
                                ...prev,
                                companyName: '',
                                companyEmail: '',
                                companyPhone: '',
                                companyAddress: '',
                                companyWebsite: ''
                              }));
                            }
                          }}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                          <option value="">Select a business from list</option>
                          <option value="TechCorp Solutions">TechCorp Solutions</option>
                          <option value="Digital Marketing Pro">Digital Marketing Pro</option>
                          <option value="Creative Design Studio">Creative Design Studio</option>
                          <option value="mohammed zaamin t">mohammed zaamin t</option>
                        </select>
                      </div>
                      
                      <div className="text-center">
                        <span className="text-gray-400 text-sm">OR</span>
                      </div>
                      
                      <button
                        onClick={() => setShowAddBusiness(true)}
                        className="w-full px-4 py-3 border-2 border-dashed border-green-300 text-green-600 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors flex items-center justify-center gap-2"
                      >
                        <Plus size={16} />
                        Add New Business
                      </button>
                    </div>

                    {/* Business Details Form */}
                    {invoice.companyName && (
                      <div className="border-t border-gray-200 pt-6 mt-6">
                        <h4 className="text-md font-medium text-gray-800 mb-4">Business Details</h4>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Company Name *
                            </label>
                            <input
                              type="text"
                              value={invoice.companyName || ''}
                              onChange={(e) => setInvoice(prev => ({ ...prev, companyName: e.target.value }))}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="Enter your company name"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Company Email *
                            </label>
                            <input
                              type="email"
                              value={invoice.companyEmail || ''}
                              onChange={(e) => setInvoice(prev => ({ ...prev, companyEmail: e.target.value }))}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="company@example.com"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Company Phone
                            </label>
                            <input
                              type="tel"
                              value={invoice.companyPhone || ''}
                              onChange={(e) => setInvoice(prev => ({ ...prev, companyPhone: e.target.value }))}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="+1 (555) 123-4567"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Website
                            </label>
                            <input
                              type="url"
                              value={invoice.companyWebsite || ''}
                              onChange={(e) => setInvoice(prev => ({ ...prev, companyWebsite: e.target.value }))}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="https://www.yourcompany.com"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Company Address *
                            </label>
                            <textarea
                              value={invoice.companyAddress || ''}
                              onChange={(e) => setInvoice(prev => ({ ...prev, companyAddress: e.target.value }))}
                              rows={3}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="Enter your company address"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Company Logo
                            </label>
                            <div className="flex items-center gap-4">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleLogoUpload}
                                className="flex-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                              />
                              {invoice.companyLogo && (
                                <div className="flex items-center gap-2">
                                  <img 
                                    src={invoice.companyLogo} 
                                    alt="Company Logo" 
                                    className="h-12 w-12 object-contain border border-gray-200 rounded-lg"
                                  />
                                  <button
                                    onClick={() => setInvoice(prev => ({
                                      ...prev,
                                      companyLogo: ''
                                    }))}
                                    className="text-red-500 hover:text-red-700 p-1"
                                    title="Remove logo"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              Upload your company logo. Recommended size: 150x80px.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bill To Section */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                      <User size={20} className="text-blue-600" />
                      Billed To
                      <span className="text-sm text-gray-500 font-normal">Client's Details</span>
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Select Client
                        </label>
                        <select
                          value={invoice.client.id || ''}
                          onChange={(e) => {
                            if (e.target.value) {
                              handleSelectClient(e.target.value);
                            } else {
                              setInvoice(prev => ({
                                ...prev,
                                client: { id: '', name: '', email: '', phone: '', address: '', gstin: '' }
                              }));
                            }
                          }}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select a client from list</option>
                          {sampleClients.map(client => (
                            <option key={client.id} value={client.id}>{client.name}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="text-center">
                        <span className="text-gray-400 text-sm">OR</span>
                      </div>
                      
                      <button
                        onClick={() => setShowAddClient(true)}
                        className="w-full px-4 py-3 border-2 border-dashed border-blue-300 text-blue-600 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                      >
                        <Plus size={16} />
                        Add New Client
                      </button>
                    </div>

                    {/* Client Details Form */}
                    {(invoice.client.id || invoice.client.name) && (
                      <div className="border-t border-gray-200 pt-6 mt-6">
                        <h4 className="text-md font-medium text-gray-800 mb-4">Client Details</h4>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Client Name *
                            </label>
                            <input
                              type="text"
                              value={invoice.client.name}
                              onChange={(e) => handleClientChange('name', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Enter client name"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Email Address *
                            </label>
                            <input
                              type="email"
                              value={invoice.client.email}
                              onChange={(e) => handleClientChange('email', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="client@example.com"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Phone Number
                            </label>
                            <input
                              type="tel"
                              value={invoice.client.phone || ''}
                              onChange={(e) => handleClientChange('phone', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="+1 (555) 123-4567"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              GSTIN (Optional)
                            </label>
                            <input
                              type="text"
                              value={invoice.client.gstin || ''}
                              onChange={(e) => handleClientChange('gstin', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="22AAAAA0000A1Z5"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Address
                            </label>
                            <textarea
                              value={invoice.client.address}
                              onChange={(e) => handleClientChange('address', e.target.value)}
                              rows={3}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Enter client address"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Shipping Address Section */}
              <div className="mb-8">
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                      <MapPin size={20} className="text-blue-600" />
                      Shipping Options
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <input
                          id="same-as-billing"
                          name="shipping-option"
                          type="radio"
                          checked={!showShippingAddress}
                          onChange={() => setShowShippingAddress(false)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <label htmlFor="same-as-billing" className="text-sm font-medium text-gray-700">
                          Same as billing address
                        </label>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <input
                          id="different-shipping"
                          name="shipping-option"
                          type="radio"
                          checked={showShippingAddress}
                          onChange={() => setShowShippingAddress(true)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <label htmlFor="different-shipping" className="text-sm font-medium text-gray-700">
                          Use different shipping address
                        </label>
                      </div>

                      {/* Shipping Address Form */}
                      {showShippingAddress && (
                        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center gap-2">
                            <MapPin size={16} className="text-blue-600" />
                            Shipping Address Details
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Recipient Name
                              </label>
                              <input
                                type="text"
                                value={invoice.shippingAddress?.name || ''}
                                onChange={(e) => handleShippingChange('name', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter recipient name"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Country
                              </label>
                              <input
                                type="text"
                                value={invoice.shippingAddress?.country || ''}
                                onChange={(e) => handleShippingChange('country', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter country"
                              />
                            </div>

                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Street Address
                              </label>
                              <input
                                type="text"
                                value={invoice.shippingAddress?.address || ''}
                                onChange={(e) => handleShippingChange('address', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter street address"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                City
                              </label>
                              <input
                                type="text"
                                value={invoice.shippingAddress?.city || ''}
                                onChange={(e) => handleShippingChange('city', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter city"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                State/Province
                              </label>
                              <input
                                type="text"
                                value={invoice.shippingAddress?.state || ''}
                                onChange={(e) => handleShippingChange('state', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter state/province"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                ZIP/Postal Code
                              </label>
                              <input
                                type="text"
                                value={invoice.shippingAddress?.zipCode || ''}
                                onChange={(e) => handleShippingChange('zipCode', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter ZIP/postal code"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Invoice Details */}
          {currentStep === 2 && (
            <div className="p-8">
              {/* Currency and Controls */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Currency</label>
                      <select 
                        value={currency}
                        onChange={(e) => {
                          setCurrency(e.target.value);
                          setCurrencySymbol(e.target.value === 'INR' ? '₹' : e.target.value === 'USD' ? '$' : '€');
                        }}
                        className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      >
                        <option value="INR">Indian Rupee (INR, ₹)</option>
                        <option value="USD">US Dollar (USD, $)</option>
                        <option value="EUR">Euro (EUR, €)</option>
                      </select>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Template</label>
                      <button
                        onClick={() => setShowTemplateSelector(true)}
                        className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white hover:bg-gray-50 flex items-center gap-2"
                      >
                        <div 
                          className="w-4 h-4 rounded" 
                          style={{ backgroundColor: getCurrentTemplate().primaryColor }}
                        ></div>
                        {getCurrentTemplate().name}
                        <ChevronDown size={14} />
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => {
                        alert('GST configuration feature coming soon!');
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-gray-600"
                    >
                      <Percent size={14} />
                      Configure GST
                    </button>
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    Press <kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-xs">Ctrl+N</kbd> to add new item
                  </div>
                </div>

                {/* Additional Options */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700">Department</label>
                    <select 
                      value={invoice.department || ''}
                      onChange={(e) => setInvoice(prev => ({ ...prev, department: e.target.value }))}
                      className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    >
                      <option value="">Select Department</option>
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>





                  <button 
                    onClick={() => setShowBankDetails(!showBankDetails)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-sm border rounded-md transition-colors ${
                      showBankDetails ? 'bg-blue-50 text-blue-600 border-blue-300' : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <CreditCard size={14} />
                    Bank Details
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Invoice Number
                  </label>
                  <input
                    type="text"
                    value={invoice.invoiceNumber}
                    onChange={(e) => handleInvoiceChange('invoiceNumber', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Invoice Date
                  </label>
                  <input
                    type="date"
                    value={invoice.date.toISOString().split('T')[0]}
                    onChange={(e) => handleInvoiceChange('date', new Date(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={invoice.dueDate.toISOString().split('T')[0]}
                    onChange={(e) => handleInvoiceChange('dueDate', new Date(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-4">Line Items</h3>
              <div className="space-y-4 mb-6">
                {invoice.items.map((item, index) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                    <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Item description"
                      />
                    </div>
                    <div className="w-24">
                      <label className="block text-xs text-gray-500 mb-1">Qty</label>
                      <input
                        type="number"
                        value={item.quantity === 0 ? '' : item.quantity}
                        onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value === '' ? 0 : parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="1"
                        min="1"
                      />
                    </div>
                    <div className="w-32">
                      <label className="block text-xs text-gray-500 mb-1">Price</label>
                      <input
                        type="number"
                        value={item.unitPrice === 0 ? '' : item.unitPrice}
                        onChange={(e) => handleItemChange(item.id, 'unitPrice', e.target.value === '' ? 0 : parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0.00"
                        step="0.01"
                      />
                    </div>
                    <div className="w-32">
                      <label className="block text-xs text-gray-500 mb-1">Amount</label>
                      <div className="text-right font-medium text-gray-900 py-2">
                        {formatCurrency(item.amount)}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => duplicateItem(item.id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Duplicate item"
                      >
                        <Plus size={16} />
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        disabled={invoice.items.length === 1}
                        title="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={addNewItem}
                  className="flex items-center gap-2 px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                  <Plus size={16} />
                  Add Item
                </button>
                <div className="text-sm text-gray-500">
                  {invoice.items.length} item{invoice.items.length !== 1 ? 's' : ''} • Subtotal: {formatCurrency(invoice.subtotal)}
                </div>
              </div>

              {/* Discount and Tax */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Discount
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={invoice.discountType}
                        onChange={(e) => handleInvoiceChange('discountType', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="percentage">%</option>
                        <option value="fixed">{currencySymbol}</option>
                      </select>
                      <input
                        type="number"
                        value={invoice.discountValue}
                        onChange={(e) => handleInvoiceChange('discountValue', parseFloat(e.target.value) || 0)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0"
                        step="0.01"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tax Rate (%)
                    </label>
                    <input
                      type="number"
                      value={invoice.taxRate}
                      onChange={(e) => handleInvoiceChange('taxRate', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="18"
                      step="0.01"
                    />
                  </div>
                </div>

                {/* Shipping Address Form */}
                {showShippingAddress && (
                  <div className="mt-6 p-6 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
                        <input
                          type="text"
                          value={invoice.shippingAddress?.name || ''}
                          onChange={(e) => handleShippingChange('name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Contact person name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                        <select
                          value={invoice.shippingAddress?.country || 'India'}
                          onChange={(e) => handleShippingChange('country', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="India">India</option>
                          <option value="USA">USA</option>
                          <option value="UK">UK</option>
                          <option value="Canada">Canada</option>
                          <option value="Australia">Australia</option>
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <input
                          type="text"
                          value={invoice.shippingAddress?.address || ''}
                          onChange={(e) => handleShippingChange('address', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Street address"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                        <input
                          type="text"
                          value={invoice.shippingAddress?.city || ''}
                          onChange={(e) => handleShippingChange('city', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="City"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                        <input
                          type="text"
                          value={invoice.shippingAddress?.state || ''}
                          onChange={(e) => handleShippingChange('state', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="State"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                        <input
                          type="text"
                          value={invoice.shippingAddress?.zipCode || ''}
                          onChange={(e) => handleShippingChange('zipCode', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="ZIP Code"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Bank Details Form */}
                {showBankDetails && (
                  <div className="mt-6 p-6 bg-green-50 rounded-lg border border-green-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Bank Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Account Name</label>
                        <input
                          type="text"
                          value={invoice.bankDetails?.accountName || ''}
                          onChange={(e) => handleBankDetailsChange('accountName', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Account holder name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                        <input
                          type="text"
                          value={invoice.bankDetails?.accountNumber || ''}
                          onChange={(e) => handleBankDetailsChange('accountNumber', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Account number"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                        <input
                          type="text"
                          value={invoice.bankDetails?.bankName || ''}
                          onChange={(e) => handleBankDetailsChange('bankName', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Bank name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label>
                        <input
                          type="text"
                          value={invoice.bankDetails?.ifscCode || ''}
                          onChange={(e) => handleBankDetailsChange('ifscCode', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="IFSC code"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
                        <select
                          value={invoice.bankDetails?.accountType || 'Current'}
                          onChange={(e) => handleBankDetailsChange('accountType', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="Current">Current</option>
                          <option value="Savings">Savings</option>
                          <option value="Business">Business</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {currentStep === 3 && (
            <div className="p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Review Invoice</h2>
              
              {/* Invoice Summary */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Bill To:</h3>
                    <p className="text-gray-700">{invoice.client.name}</p>
                    <p className="text-gray-600">{invoice.client.email}</p>
                    {invoice.client.phone && <p className="text-gray-600">{invoice.client.phone}</p>}
                    {invoice.client.address && <p className="text-gray-600">{invoice.client.address}</p>}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Invoice Details:</h3>
                    <p className="text-gray-700">Invoice #: {invoice.invoiceNumber}</p>
                    <p className="text-gray-600">Date: {invoice.date.toLocaleDateString()}</p>
                    <p className="text-gray-600">Due: {invoice.dueDate.toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Items Summary */}
              <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Description</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-gray-900">Qty</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">Price</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {invoice.items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-4 py-3 text-gray-900">{item.description}</td>
                        <td className="px-4 py-3 text-center text-gray-600">{item.quantity}</td>
                        <td className="px-4 py-3 text-right text-gray-600">{formatCurrency(item.unitPrice)}</td>
                        <td className="px-4 py-3 text-right font-medium">{formatCurrency(item.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Total Summary */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">{formatCurrency(invoice.subtotal)}</span>
                  </div>
                  {invoice.discountAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount:</span>
                      <span>-{formatCurrency(invoice.discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax ({invoice.taxRate}%):</span>
                    <span className="font-medium">{formatCurrency(invoice.taxAmount)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total:</span>
                      <span>{formatCurrency(invoice.total)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Options */}
              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={invoice.notes || ''}
                    onChange={(e) => handleInvoiceChange('notes', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Additional notes or payment instructions..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Terms
                  </label>
                  <select
                    value={invoice.paymentTerms || 'Net 30'}
                    onChange={(e) => handleInvoiceChange('paymentTerms', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Due on receipt">Due on receipt</option>
                    <option value="Net 15">Net 15</option>
                    <option value="Net 30">Net 30</option>
                    <option value="Net 60">Net 60</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Footer */}
          <div className="px-8 py-6 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <div>
              {currentStep > 1 ? (
                <button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="px-6 py-3 border-2 border-gray-400 rounded-lg text-gray-700 hover:bg-white hover:border-gray-500 transition-all flex items-center gap-2 font-medium shadow-sm"
                >
                  <ArrowLeft size={18} />
                  Back to Step {currentStep - 1}
                </button>
              ) : (
                <div className="text-sm text-gray-500">
                  Step 1 of 3 - Fill in client information to continue
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              {currentStep === 3 && (
                <>
                  <button
                    onClick={handleDownloadPDF}
                    disabled={isGeneratingPDF}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    <Download size={16} />
                    {isGeneratingPDF ? 'Generating...' : 'Download PDF'}
                  </button>
                  <button
                    onClick={() => setShowPreview(true)}
                    className="px-4 py-2 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2"
                  >
                    <Eye size={16} />
                    Preview
                  </button>
                </>
              )}

              {currentStep < 3 ? (
                <div className="flex flex-col items-end">
                  <button
                    onClick={() => setCurrentStep(currentStep + 1)}
                    disabled={currentStep === 1 ? !canProceedToStep2 : !canProceedToStep3}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    Next
                    <ArrowLeft size={16} className="rotate-180" />
                  </button>
                  {(currentStep === 1 && !canProceedToStep2) && (
                    <p className="text-sm text-red-600 mt-1">{getStep1ValidationMessage()}</p>
                  )}
                  {(currentStep === 2 && !canProceedToStep3) && (
                    <p className="text-sm text-red-600 mt-1">{getStep2ValidationMessage()}</p>
                  )}
                </div>
              ) : (
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <CheckCircle size={16} />
                  Create Invoice
                </button>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* Add New Client Modal */}
      {showAddClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add New Client</h3>
              <button
                onClick={() => setShowAddClient(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client Name *
                </label>
                <input
                  type="text"
                  value={newClient.name || ''}
                  onChange={(e) => setNewClient(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter client name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={newClient.email || ''}
                  onChange={(e) => setNewClient(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="client@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={newClient.phone || ''}
                  onChange={(e) => setNewClient(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  GSTIN
                </label>
                <input
                  type="text"
                  value={newClient.gstin || ''}
                  onChange={(e) => setNewClient(prev => ({ ...prev, gstin: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="22AAAAA0000A1Z5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  value={newClient.address || ''}
                  onChange={(e) => setNewClient(prev => ({ ...prev, address: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter client address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client Logo (Optional)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleClientLogoUpload}
                    className="flex-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {newClient.logo && (
                    <div className="flex items-center gap-2">
                      <img 
                        src={newClient.logo} 
                        alt="Client Logo" 
                        className="h-12 w-12 object-contain border border-gray-200 rounded-lg"
                      />
                      <button
                        onClick={() => setNewClient(prev => ({
                          ...prev,
                          logo: ''
                        }))}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Remove logo"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Upload client logo. Recommended size: 150x80px.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAddClient(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNewClient}
                disabled={!newClient.name || !newClient.email}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <CheckCircle size={16} />
                Add Client
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Business Modal */}
      {showAddBusiness && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add New Business</h3>
              <button
                onClick={() => setShowAddBusiness(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name *
                </label>
                <input
                  type="text"
                  value={newBusiness.companyName}
                  onChange={(e) => setNewBusiness(prev => ({ ...prev, companyName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter company name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Email *
                </label>
                <input
                  type="email"
                  value={newBusiness.companyEmail}
                  onChange={(e) => setNewBusiness(prev => ({ ...prev, companyEmail: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="company@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Phone
                </label>
                <input
                  type="tel"
                  value={newBusiness.companyPhone}
                  onChange={(e) => setNewBusiness(prev => ({ ...prev, companyPhone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website
                </label>
                <input
                  type="url"
                  value={newBusiness.companyWebsite}
                  onChange={(e) => setNewBusiness(prev => ({ ...prev, companyWebsite: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="https://www.yourcompany.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Address *
                </label>
                <textarea
                  value={newBusiness.companyAddress}
                  onChange={(e) => setNewBusiness(prev => ({ ...prev, companyAddress: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter company address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Logo (Optional)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleBusinessLogoUpload}
                    className="flex-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                  />
                  {newBusiness.companyLogo && (
                    <div className="flex items-center gap-2">
                      <img 
                        src={newBusiness.companyLogo} 
                        alt="Company Logo" 
                        className="h-12 w-12 object-contain border border-gray-200 rounded-lg"
                      />
                      <button
                        onClick={() => setNewBusiness(prev => ({
                          ...prev,
                          companyLogo: ''
                        }))}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Remove logo"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Upload your company logo. Recommended size: 150x80px.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAddBusiness(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNewBusiness}
                disabled={!newBusiness.companyName || !newBusiness.companyEmail}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <CheckCircle size={16} />
                Add Business
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Template Selector Modal */}
      {showTemplateSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] mx-4 flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Choose Invoice Template</h3>
              <button
                onClick={() => setShowTemplateSelector(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-auto p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {invoiceTemplates.map((template) => (
                  <div
                    key={template.id}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-lg ${
                      selectedTemplate === template.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => {
                      setSelectedTemplate(template.id);
                      setInvoice(prev => ({ ...prev, template: template.id }));
                      setShowTemplateSelector(false);
                    }}
                  >
                    {/* Template Preview */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4" style={{ fontFamily: template.fontFamily }}>
                      {/* Mini Invoice Header */}
                      <div className="flex justify-between items-start mb-3 pb-2" style={{ borderBottom: `2px solid ${template.primaryColor}` }}>
                        <div>
                          <div className="text-sm font-bold" style={{ color: template.primaryColor }}>
                            Your Company
                          </div>
                          <div className="text-xs text-gray-600">company@email.com</div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold" style={{ color: template.primaryColor }}>
                            INVOICE
                          </div>
                          <div className="text-xs">#INV-001</div>
                        </div>
                      </div>

                      {/* Mini Bill To Section */}
                      <div className="mb-3">
                        <div className="p-2 rounded text-xs" style={{ backgroundColor: template.secondaryColor }}>
                          <div className="font-semibold" style={{ color: template.primaryColor }}>Bill To:</div>
                          <div>Client Name</div>
                          <div>client@email.com</div>
                        </div>
                      </div>

                      {/* Mini Items Table */}
                      <div className="text-xs">
                        <div className="flex p-1 text-white font-semibold" style={{ backgroundColor: template.primaryColor }}>
                          <div className="flex-1">Item</div>
                          <div className="w-12 text-center">Qty</div>
                          <div className="w-16 text-right">Amount</div>
                        </div>
                        <div className="flex p-1 bg-gray-50">
                          <div className="flex-1">Sample Item</div>
                          <div className="w-12 text-center">1</div>
                          <div className="w-16 text-right">$100.00</div>
                        </div>
                        <div className="flex justify-end p-1 border-t">
                          <div className="font-semibold">Total: $100.00</div>
                        </div>
                      </div>
                    </div>

                    {/* Template Info */}
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <div 
                          className="w-4 h-4 rounded" 
                          style={{ backgroundColor: template.primaryColor }}
                        ></div>
                        <h4 className="font-semibold text-gray-900">{template.name}</h4>
                      </div>
                      <p className="text-sm text-gray-600">{template.fontFamily} • {template.layout}</p>
                      {selectedTemplate === template.id && (
                        <div className="mt-2 text-sm font-medium text-blue-600">✓ Selected</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowTemplateSelector(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowTemplateSelector(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Apply Template
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] mx-4 flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Invoice Preview</h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleDownloadPDF}
                  disabled={isGeneratingPDF}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
                >
                  <Download size={16} />
                  {isGeneratingPDF ? 'Generating...' : 'Download PDF'}
                </button>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-6">
              <div className="bg-white border border-gray-200 rounded-lg p-8" style={{ fontFamily: getCurrentTemplate().fontFamily }}>
                {/* Preview Header */}
                <div className="flex justify-between items-start mb-8 pb-6" style={{ borderBottom: `2px solid ${getCurrentTemplate().primaryColor}` }}>
                  <div>
                    {invoice.companyLogo && (
                      <img src={invoice.companyLogo} alt="Company Logo" className="max-w-32 max-h-16 object-contain mb-3" />
                    )}
                    <div>
                      <div className="text-xl font-bold mb-1" style={{ color: getCurrentTemplate().primaryColor }}>
                        {invoice.companyName || 'Your Company'}
                      </div>
                      {invoice.companyEmail && <div className="text-sm text-gray-600">{invoice.companyEmail}</div>}
                      {invoice.companyPhone && <div className="text-sm text-gray-600">{invoice.companyPhone}</div>}
                      {invoice.companyWebsite && <div className="text-sm text-gray-600">{invoice.companyWebsite}</div>}
                      {invoice.companyAddress && <div className="text-sm text-gray-600 mt-2">{invoice.companyAddress}</div>}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold mb-2" style={{ color: getCurrentTemplate().primaryColor }}>
                      INVOICE
                    </div>
                    <div className="space-y-1 text-sm">
                      <div><strong>Invoice #:</strong> {invoice.invoiceNumber}</div>
                      <div><strong>Date:</strong> {invoice.date.toLocaleDateString()}</div>
                      <div><strong>Due Date:</strong> {invoice.dueDate.toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>

                {/* Bill To / Ship To */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="p-4 rounded-lg" style={{ backgroundColor: getCurrentTemplate().secondaryColor }}>
                    <h3 className="font-semibold mb-2" style={{ color: getCurrentTemplate().primaryColor }}>Bill To:</h3>
                    <div className="space-y-1 text-sm">
                      <div className="font-semibold">{invoice.client.name}</div>
                      <div>{invoice.client.email}</div>
                      {invoice.client.phone && <div>{invoice.client.phone}</div>}
                      <div>{invoice.client.address}</div>
                      {invoice.client.gstin && <div><strong>GSTIN:</strong> {invoice.client.gstin}</div>}
                    </div>
                  </div>

                  {showShippingAddress && invoice.shippingAddress?.name && (
                    <div className="p-4 rounded-lg" style={{ backgroundColor: getCurrentTemplate().secondaryColor }}>
                      <h3 className="font-semibold mb-2" style={{ color: getCurrentTemplate().primaryColor }}>Ship To:</h3>
                      <div className="space-y-1 text-sm">
                        <div className="font-semibold">{invoice.shippingAddress.name}</div>
                        <div>{invoice.shippingAddress.address}</div>
                        <div>{invoice.shippingAddress.city}, {invoice.shippingAddress.state} {invoice.shippingAddress.zipCode}</div>
                        <div>{invoice.shippingAddress.country}</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Items Table */}
                <div className="mb-8">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr style={{ backgroundColor: getCurrentTemplate().primaryColor }}>
                        <th className="text-left p-3 text-white font-semibold">Description</th>
                        <th className="text-center p-3 text-white font-semibold">Qty</th>
                        <th className="text-right p-3 text-white font-semibold">Price</th>
                        <th className="text-right p-3 text-white font-semibold">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoice.items.map((item, index) => (
                        <tr key={item.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                          <td className="p-3 border-b border-gray-200">{item.description}</td>
                          <td className="p-3 border-b border-gray-200 text-center">{item.quantity}</td>
                          <td className="p-3 border-b border-gray-200 text-right">{formatCurrency(item.unitPrice)}</td>
                          <td className="p-3 border-b border-gray-200 text-right font-semibold">{formatCurrency(item.amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totals */}
                <div className="flex justify-end mb-8">
                  <div className="w-80 p-4 rounded-lg" style={{ backgroundColor: getCurrentTemplate().secondaryColor }}>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span className="font-semibold">{formatCurrency(invoice.subtotal)}</span>
                      </div>
                      {invoice.discountAmount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Discount:</span>
                          <span className="font-semibold">-{formatCurrency(invoice.discountAmount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Tax ({invoice.taxRate}%):</span>
                        <span className="font-semibold">{formatCurrency(invoice.taxAmount)}</span>
                      </div>
                      <div className="border-t-2 pt-2" style={{ borderColor: getCurrentTemplate().primaryColor }}>
                        <div className="flex justify-between text-lg font-bold" style={{ color: getCurrentTemplate().primaryColor }}>
                          <span>Total:</span>
                          <span>{formatCurrency(invoice.total)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bank Details */}
                {showBankDetails && invoice.bankDetails?.accountNumber && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold mb-2" style={{ color: getCurrentTemplate().primaryColor }}>Bank Details:</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div><strong>Account Name:</strong> {invoice.bankDetails.accountName}</div>
                      <div><strong>Account Number:</strong> {invoice.bankDetails.accountNumber}</div>
                      <div><strong>Bank Name:</strong> {invoice.bankDetails.bankName}</div>
                      <div><strong>IFSC Code:</strong> {invoice.bankDetails.ifscCode}</div>
                      <div><strong>Account Type:</strong> {invoice.bankDetails.accountType}</div>
                    </div>
                  </div>
                )}

                {/* Notes */}
                {invoice.notes && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold mb-2" style={{ color: getCurrentTemplate().primaryColor }}>Notes:</h3>
                    <p className="text-sm">{invoice.notes}</p>
                  </div>
                )}

                {/* Footer */}
                <div className="text-center text-gray-600 text-sm">
                  <p>Payment Terms: {invoice.paymentTerms}</p>
                  <p>Thank you for your business!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewInvoicePage; 
