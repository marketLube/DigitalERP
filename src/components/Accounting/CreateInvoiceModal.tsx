import React, { useState } from 'react';
import { X, ArrowLeft, ArrowRight, Plus, Trash2 } from 'lucide-react';

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
}

interface CreateInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (invoice: Omit<Invoice, 'id' | 'invoiceNumber' | 'amount'>) => void;
  invoiceCount: number;
}

const CreateInvoiceModal: React.FC<CreateInvoiceModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  invoiceCount 
}) => {
  const [createStep, setCreateStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [newInvoice, setNewInvoice] = useState<Partial<Invoice>>({
    currency: 'USD',
    paymentTerms: 'Net 30',
    status: 'draft',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0],
    items: [{ id: '1', description: '', quantity: 1, rate: 0, amount: 0 }]
  });

  const invoiceTemplates = [
    {
      id: 'modern',
      name: 'Modern',
      description: 'Clean and professional design',
      preview: 'bg-gradient-to-br from-blue-50 to-blue-100',
      color: 'blue'
    },
    {
      id: 'classic',
      name: 'Classic',
      description: 'Traditional business style',
      preview: 'bg-gradient-to-br from-gray-50 to-gray-100',
      color: 'gray'
    },
    {
      id: 'creative',
      name: 'Creative',
      description: 'Colorful and engaging',
      preview: 'bg-gradient-to-br from-purple-50 to-purple-100',
      color: 'purple'
    },
    {
      id: 'minimal',
      name: 'Minimal',
      description: 'Simple and elegant',
      preview: 'bg-gradient-to-br from-green-50 to-green-100',
      color: 'green'
    }
  ];

  const handleAddItem = () => {
    const newItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      rate: 0,
      amount: 0
    };
    setNewInvoice(prev => ({
      ...prev,
      items: [...(prev.items || []), newItem]
    }));
  };

  const handleRemoveItem = (itemId: string) => {
    setNewInvoice(prev => ({
      ...prev,
      items: (prev.items || []).filter(item => item.id !== itemId)
    }));
  };

  const handleItemChange = (itemId: string, field: keyof InvoiceItem, value: any) => {
    setNewInvoice(prev => ({
      ...prev,
      items: (prev.items || []).map(item => {
        if (item.id === itemId) {
          const updatedItem = { ...item, [field]: value };
          if (field === 'quantity' || field === 'rate') {
            updatedItem.amount = updatedItem.quantity * updatedItem.rate;
          }
          return updatedItem;
        }
        return item;
      })
    }));
  };

  const calculateTotal = () => {
    return (newInvoice.items || []).reduce((sum, item) => sum + (item.amount || 0), 0);
  };

  const handleSaveInvoice = () => {
    const total = calculateTotal();
    
    const invoice = {
      clientName: newInvoice.clientName || '',
      clientEmail: newInvoice.clientEmail || '',
      issueDate: newInvoice.issueDate || new Date().toISOString().split('T')[0],
      dueDate: newInvoice.dueDate || new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0],
      status: newInvoice.status as any || 'draft',
      currency: newInvoice.currency || 'USD',
      paymentTerms: newInvoice.paymentTerms || 'Net 30',
      notes: newInvoice.notes || '',
      items: newInvoice.items || []
    };
    
    onSave(invoice);
    handleClose();
  };

  const handleClose = () => {
    setCreateStep(1);
    setSelectedTemplate('modern');
    setNewInvoice({
      currency: 'USD',
      paymentTerms: 'Net 30',
      status: 'draft',
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0],
      items: [{ id: '1', description: '', quantity: 1, rate: 0, amount: 0 }]
    });
    onClose();
  };

  const canProceedToStep2 = selectedTemplate !== '';
  const canProceedToStep3 = newInvoice.clientName && newInvoice.clientEmail;
  const canSave = newInvoice.clientName && newInvoice.clientEmail && (newInvoice.items || []).some(item => item.description && item.quantity > 0 && item.rate > 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-slideUp">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-poppins font-semibold">Create New Invoice</h2>
              <p className="text-blue-100 font-poppins text-sm">
                Step {createStep} of 3 - {createStep === 1 ? 'Choose Template' : createStep === 2 ? 'Client & Details' : 'Items & Review'}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors duration-200"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Step Progress */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-poppins font-medium text-sm ${
                  step <= createStep ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`h-1 w-16 mx-2 ${
                    step < createStep ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto max-h-96">
          {/* Step 1: Template Selection */}
          {createStep === 1 && (
            <div>
              <h3 className="text-lg font-poppins font-semibold text-gray-900 mb-4">Choose Invoice Template</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {invoiceTemplates.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                      selectedTemplate === template.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-full h-24 rounded-lg mb-3 ${template.preview} flex items-center justify-center`}>
                      <div className="text-center">
                        <div className="w-8 h-1 bg-gray-400 mb-2 mx-auto"></div>
                        <div className="w-12 h-1 bg-gray-300 mb-1 mx-auto"></div>
                        <div className="w-6 h-1 bg-gray-300 mx-auto"></div>
                      </div>
                    </div>
                    <h4 className="font-poppins font-medium text-gray-900">{template.name}</h4>
                    <p className="text-sm text-gray-600 font-poppins">{template.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Client & Details */}
          {createStep === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-poppins font-semibold text-gray-900">Client & Invoice Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-poppins font-medium text-gray-700 mb-2">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    value={newInvoice.clientName || ''}
                    onChange={(e) => setNewInvoice(prev => ({ ...prev, clientName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins"
                    placeholder="Enter client name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-poppins font-medium text-gray-700 mb-2">
                    Client Email *
                  </label>
                  <input
                    type="email"
                    value={newInvoice.clientEmail || ''}
                    onChange={(e) => setNewInvoice(prev => ({ ...prev, clientEmail: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins"
                    placeholder="client@example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-poppins font-medium text-gray-700 mb-2">
                    Issue Date
                  </label>
                  <input
                    type="date"
                    value={newInvoice.issueDate || new Date().toISOString().split('T')[0]}
                    onChange={(e) => setNewInvoice(prev => ({ ...prev, issueDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-poppins font-medium text-gray-700 mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={newInvoice.dueDate || new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0]}
                    onChange={(e) => setNewInvoice(prev => ({ ...prev, dueDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-poppins font-medium text-gray-700 mb-2">
                    Payment Terms
                  </label>
                  <select
                    value={newInvoice.paymentTerms || 'Net 30'}
                    onChange={(e) => setNewInvoice(prev => ({ ...prev, paymentTerms: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins"
                  >
                    <option value="Net 15">Net 15</option>
                    <option value="Net 30">Net 30</option>
                    <option value="Net 45">Net 45</option>
                    <option value="Net 60">Net 60</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-poppins font-medium text-gray-700 mb-2">
                    Currency
                  </label>
                  <select
                    value={newInvoice.currency || 'USD'}
                    onChange={(e) => setNewInvoice(prev => ({ ...prev, currency: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="CAD">CAD</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-poppins font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  rows={3}
                  value={newInvoice.notes || ''}
                  onChange={(e) => setNewInvoice(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins"
                  placeholder="Additional notes or payment instructions..."
                />
              </div>
            </div>
          )}

          {/* Step 3: Items & Review */}
          {createStep === 3 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-poppins font-semibold text-gray-900">Invoice Items</h3>
                <button
                  onClick={handleAddItem}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg font-poppins font-medium transition-colors duration-200 flex items-center gap-2"
                >
                  <Plus size={16} />
                  Add Item
                </button>
              </div>
              
              <div className="space-y-4">
                {(newInvoice.items || []).map((item, index) => (
                  <div key={item.id} className="grid grid-cols-12 gap-4 items-center p-4 bg-gray-50 rounded-lg">
                    <div className="col-span-5">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-sm"
                        placeholder="Item description"
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(item.id, 'quantity', Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-sm"
                        placeholder="Qty"
                        min="1"
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="number"
                        value={item.rate}
                        onChange={(e) => handleItemChange(item.id, 'rate', Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-sm"
                        placeholder="Rate"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div className="col-span-2">
                      <div className="px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg font-poppins text-sm text-gray-900">
                        ${item.amount.toFixed(2)}
                      </div>
                    </div>
                    <div className="col-span-1">
                      {(newInvoice.items || []).length > 1 && (
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-end">
                  <div className="w-64">
                    <div className="flex justify-between py-2">
                      <span className="font-poppins font-semibold text-gray-900">Total:</span>
                      <span className="font-poppins font-semibold text-gray-900 text-lg">
                        ${calculateTotal().toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {createStep > 1 && (
              <button
                onClick={() => setCreateStep(createStep - 1)}
                className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 font-poppins font-medium hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2"
              >
                <ArrowLeft size={16} />
                Back
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleClose}
              className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 font-poppins font-medium hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            
            {createStep < 3 ? (
              <button
                onClick={() => setCreateStep(createStep + 1)}
                disabled={createStep === 1 ? !canProceedToStep2 : !canProceedToStep3}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-poppins font-medium transition-colors duration-200 flex items-center gap-2"
              >
                Next
                <ArrowRight size={16} />
              </button>
            ) : (
              <button
                onClick={handleSaveInvoice}
                disabled={!canSave}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-poppins font-medium transition-colors duration-200"
              >
                Create Invoice
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateInvoiceModal; 