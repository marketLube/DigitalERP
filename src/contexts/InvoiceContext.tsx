import React, { createContext, useContext, useState, ReactNode } from 'react';

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  items: InvoiceItem[];
  notes: string;
  paymentTerms: string;
  currency: string;
  department?: string;
  shippingAddress?: {
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  bankDetails?: {
    accountName: string;
    accountNumber: string;
    bankName: string;
    ifscCode: string;
    accountType: string;
  };
  template?: string;
  companyLogo?: string;
  clientLogo?: string;
}

interface InvoiceContextType {
  invoices: Invoice[];
  addInvoice: (invoice: any) => void;
  updateInvoice: (id: string, invoice: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  getInvoiceById: (id: string) => Invoice | undefined;
}

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

// Initial sample invoices
const initialInvoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-2024-001',
    clientName: 'TechCorp Industries',
    clientEmail: 'billing@techcorp.com',
    issueDate: '2024-02-01',
    dueDate: '2024-02-15',
    amount: 15000,
    status: 'paid',
    currency: 'USD',
    paymentTerms: 'Net 15',
    notes: 'Thank you for your business!',
    items: [
      { id: '1', description: 'Web Development - Phase 1', quantity: 1, rate: 15000, amount: 15000 }
    ]
  },
  {
    id: '2',
    invoiceNumber: 'INV-2024-002',
    clientName: 'StartupXYZ',
    clientEmail: 'finance@startupxyz.com',
    issueDate: '2024-02-05',
    dueDate: '2024-02-20',
    amount: 8500,
    status: 'sent',
    currency: 'USD',
    paymentTerms: 'Net 15',
    notes: 'Mobile app development services',
    items: [
      { id: '1', description: 'Mobile App UI/UX Design', quantity: 1, rate: 5000, amount: 5000 },
      { id: '2', description: 'Mobile App Development', quantity: 1, rate: 3500, amount: 3500 }
    ]
  },
  {
    id: '3',
    invoiceNumber: 'INV-2024-003',
    clientName: 'E-commerce Solutions',
    clientEmail: 'accounts@ecommerce.com',
    issueDate: '2024-01-20',
    dueDate: '2024-02-05',
    amount: 12000,
    status: 'overdue',
    currency: 'USD',
    paymentTerms: 'Net 15',
    notes: 'E-commerce platform development',
    items: [
      { id: '1', description: 'E-commerce Platform Setup', quantity: 1, rate: 8000, amount: 8000 },
      { id: '2', description: 'Payment Gateway Integration', quantity: 1, rate: 4000, amount: 4000 }
    ]
  },
  {
    id: '4',
    invoiceNumber: 'INV-2024-004',
    clientName: 'Marketing Agency Pro',
    clientEmail: 'billing@marketingpro.com',
    issueDate: '2024-02-10',
    dueDate: '2024-02-25',
    amount: 6500,
    status: 'draft',
    currency: 'USD',
    paymentTerms: 'Net 15',
    notes: 'Digital marketing consultation',
    items: [
      { id: '1', description: 'Marketing Strategy Consultation', quantity: 10, rate: 650, amount: 6500 }
    ]
  },
  {
    id: '5',
    invoiceNumber: 'INV-2024-005',
    clientName: 'FinTech Innovations',
    clientEmail: 'finance@fintech.com',
    issueDate: '2024-02-12',
    dueDate: '2024-02-27',
    amount: 22000,
    status: 'sent',
    currency: 'USD',
    paymentTerms: 'Net 15',
    notes: 'Financial software development',
    items: [
      { id: '1', description: 'Backend API Development', quantity: 1, rate: 12000, amount: 12000 },
      { id: '2', description: 'Frontend Dashboard', quantity: 1, rate: 10000, amount: 10000 }
    ]
  }
];

export const InvoiceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);

  const addInvoice = (newInvoice: any) => {
    // Convert the new invoice format to the expected format
    const invoice: Invoice = {
      id: newInvoice.id,
      invoiceNumber: newInvoice.invoiceNumber,
      clientName: newInvoice.client.name,
      clientEmail: newInvoice.client.email,
      issueDate: newInvoice.date.toISOString().split('T')[0],
      dueDate: newInvoice.dueDate.toISOString().split('T')[0],
      amount: newInvoice.total,
      status: newInvoice.status.toLowerCase() as 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled',
      currency: newInvoice.currency || 'USD',
      paymentTerms: newInvoice.paymentTerms || 'Net 30',
      notes: newInvoice.notes || '',
      items: newInvoice.items.map((item: any) => ({
        id: item.id,
        description: item.description,
        quantity: item.quantity,
        rate: item.unitPrice,
        amount: item.amount
      })),
      department: newInvoice.department,
      shippingAddress: newInvoice.shippingAddress,
      bankDetails: newInvoice.bankDetails,
      template: newInvoice.template,
      companyLogo: newInvoice.companyLogo,
      clientLogo: newInvoice.client.logo
    };

    setInvoices(prev => [invoice, ...prev]);
  };

  const updateInvoice = (id: string, updatedInvoice: Partial<Invoice>) => {
    setInvoices(prev => prev.map(invoice => 
      invoice.id === id ? { ...invoice, ...updatedInvoice } : invoice
    ));
  };

  const deleteInvoice = (id: string) => {
    setInvoices(prev => prev.filter(invoice => invoice.id !== id));
  };

  const getInvoiceById = (id: string) => {
    return invoices.find(invoice => invoice.id === id);
  };

  return (
    <InvoiceContext.Provider value={{
      invoices,
      addInvoice,
      updateInvoice,
      deleteInvoice,
      getInvoiceById
    }}>
      {children}
    </InvoiceContext.Provider>
  );
};

export const useInvoices = () => {
  const context = useContext(InvoiceContext);
  if (context === undefined) {
    throw new Error('useInvoices must be used within an InvoiceProvider');
  }
  return context;
}; 