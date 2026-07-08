import React, { useState, useEffect } from 'react';
import { 
  Package, Plus, Edit, Trash2, ArrowUpRight, ArrowDownRight, 
  Search, AlertTriangle, FileSpreadsheet, History, X, Check, Loader2 
} from 'lucide-react';
import { inventory } from '../../lib/inventory';

export default function InventoryPanel({ user }) {
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, materials, transactions, history
  const [materials, setMaterials] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Material Form States
  const [isMaterialFormOpen, setIsMaterialFormOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [matSku, setMatSku] = useState('');
  const [matName, setMatName] = useState('');
  const [matDescription, setMatDescription] = useState('');
  const [matUnit, setMatUnit] = useState('Piece');
  const [matUnitPrice, setMatUnitPrice] = useState('');
  const [matMinQty, setMatMinQty] = useState('');
  const [matGstPercent, setMatGstPercent] = useState('18');
  const [matSupplier, setMatSupplier] = useState('');

  // Transaction Form States
  const [isTxFormOpen, setIsTxFormOpen] = useState(false);
  const [txType, setTxType] = useState('IN'); // IN or OUT
  const [txMaterialId, setTxMaterialId] = useState('');
  const [txQty, setTxQty] = useState('');
  const [txPrice, setTxPrice] = useState('');
  const [txGst, setTxGst] = useState('18');
  const [txDate, setTxDate] = useState(new Date().toISOString().split('T')[0]);
  const [txSupplier, setTxSupplier] = useState('');
  const [txRemarks, setTxRemarks] = useState('');

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [txSkuInput, setTxSkuInput] = useState('');

  useEffect(() => {
    fetchInventoryData();
  }, []);

  const fetchInventoryData = async () => {
    setLoading(true);
    try {
      const matData = await inventory.getMaterials();
      const txData = await inventory.getTransactions();
      setMaterials(matData);
      setTransactions(txData);

      // Auto-initialize first material details in transaction form
      if (matData && matData.length > 0) {
        setTxMaterialId(prev => prev || matData[0].id);
        setTxSkuInput(prev => prev || matData[0].sku);
        setTxPrice(prev => (prev !== '' && prev !== undefined) ? prev : matData[0].unit_price);
        setTxGst(prev => (prev !== '' && prev !== undefined) ? prev : matData[0].gst_percent);
        setTxSupplier(prev => (prev !== '' && prev !== undefined) ? prev : matData[0].supplier_name || '');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenMaterialForm = (material = null) => {
    if (material) {
      setEditingMaterial(material);
      setMatSku(material.sku);
      setMatName(material.name);
      setMatDescription(material.description || '');
      setMatUnit(material.unit);
      setMatUnitPrice(material.unit_price);
      setMatMinQty(material.min_quantity);
      setMatGstPercent(material.gst_percent);
      setMatSupplier(material.supplier_name || '');
    } else {
      setEditingMaterial(null);
      setMatSku('');
      setMatName('');
      setMatDescription('');
      setMatUnit('Piece');
      setMatUnitPrice('');
      setMatMinQty('');
      setMatGstPercent('18');
      setMatSupplier('');
    }
    setIsMaterialFormOpen(true);
  };

  const handleSkuInputChange = (val) => {
    setTxSkuInput(val);
    const clean = val.trim().toUpperCase();
    const found = materials.find(m => m.sku.toUpperCase() === clean);
    if (found) {
      setTxMaterialId(found.id);
      setTxPrice(found.unit_price);
      setTxGst(found.gst_percent);
      setTxSupplier(found.supplier_name || '');
    }
  };

  const handleSaveMaterial = async (e) => {
    e.preventDefault();
    if (!matSku.trim() || !matName.trim()) {
      alert('SKU and Item Name are required');
      return;
    }
    try {
      await inventory.saveMaterial({
        id: editingMaterial?.id,
        sku: matSku,
        name: matName,
        description: matDescription,
        unit: matUnit,
        unit_price: matUnitPrice,
        min_quantity: matMinQty,
        gst_percent: matGstPercent,
        supplier_name: matSupplier
      });
      setIsMaterialFormOpen(false);
      fetchInventoryData();
    } catch (err) {
      alert('Error saving material: ' + err.message);
    }
  };

  const handleDeleteMaterial = async (id) => {
    if (window.confirm('Are you sure you want to delete this raw material? All associated transaction logs will be permanently deleted.')) {
      try {
        await inventory.deleteMaterial(id);
        fetchInventoryData();
      } catch (err) {
        alert('Error deleting material: ' + err.message);
      }
    }
  };

  const handleOpenTxForm = (type = 'IN', defaultMaterialId = '') => {
    setTxType(type);
    const selectedId = defaultMaterialId || (materials[0]?.id || '');
    setTxMaterialId(selectedId);
    setTxQty('');
    
    // Auto-fill price & GST based on selected material
    const targetMat = materials.find(m => m.id === selectedId);
    setTxSkuInput(targetMat ? targetMat.sku : '');
    setTxPrice(targetMat ? targetMat.unit_price : '');
    setTxGst(targetMat ? targetMat.gst_percent : '18');
    setTxSupplier(targetMat ? targetMat.supplier_name || '' : '');
    
    setTxDate(new Date().toISOString().split('T')[0]);
    setTxRemarks('');
    setIsTxFormOpen(true);
  };

  const handleMaterialChangeInTx = (matId) => {
    setTxMaterialId(matId);
    const targetMat = materials.find(m => m.id === matId);
    if (targetMat) {
      setTxSkuInput(targetMat.sku);
      setTxPrice(targetMat.unit_price);
      setTxGst(targetMat.gst_percent);
      setTxSupplier(targetMat.supplier_name || '');
    }
  };

  const handleSaveTransaction = async (e) => {
    e.preventDefault();
    if (!txMaterialId || !txQty) {
      alert('Please fill all required transaction fields');
      return;
    }
    try {
      await inventory.addTransaction({
        material_id: txMaterialId,
        transaction_type: txType,
        quantity: txQty,
        unit_price: txPrice,
        gst_percent: txGst,
        purchase_date: txDate,
        supplier_name: txSupplier,
        remarks: txRemarks,
        performed_by: user?.email || 'System/Admin'
      });
      setIsTxFormOpen(false);
      fetchInventoryData();
    } catch (err) {
      alert('Error registering transaction: ' + err.message);
    }
  };

  const handleExportMaterials = () => {
    const formatted = materials.map(m => {
      const amtBeforeGst = Number(m.current_stock) * Number(m.unit_price);
      const gstAmt = amtBeforeGst * (Number(m.gst_percent) / 100);
      return {
        'SKU': m.sku,
        'Item Name': m.name,
        'Description': m.description || '',
        'Unit': m.unit,
        'Unit Price (INR)': m.unit_price,
        'Current Stock': m.current_stock,
        'Min Quantity': m.min_quantity,
        'GST (%)': m.gst_percent,
        'Amount Before GST (INR)': amtBeforeGst.toFixed(2),
        'GST Amount (INR)': gstAmt.toFixed(2),
        'Total Amount (INR)': (amtBeforeGst + gstAmt).toFixed(2),
        'Supplier Name': m.supplier_name || 'N/A'
      };
    });
    inventory.exportToCSV(formatted, 'raw_materials_inventory');
  };

  const handleExportTransactions = () => {
    const formatted = transactions.map(t => ({
      'Transaction ID': t.id,
      'Date & Time': t.created_at,
      'Date': t.purchase_date,
      'SKU': t.raw_materials?.sku || 'N/A',
      'Item Name': t.raw_materials?.name || 'N/A',
      'Type': t.transaction_type,
      'Quantity': t.quantity,
      'Unit': t.raw_materials?.unit || '',
      'Unit Price': t.unit_price,
      'GST (%)': t.gst_percent,
      'Subtotal': t.subtotal,
      'GST Amount': t.gst_amount,
      'Total Amount': t.total_amount,
      'Supplier/Customer': t.supplier_name || 'N/A',
      'Performed By': t.performed_by || 'System/Admin',
      'Remarks': t.remarks || ''
    }));
    inventory.exportToCSV(formatted, 'inventory_transactions_history');
  };

  // Computations
  const filteredMaterials = materials.filter(m => {
    const cleanSearch = searchTerm.toLowerCase().trim();
    return (
      m.sku.toLowerCase().includes(cleanSearch) ||
      m.name.toLowerCase().includes(cleanSearch) ||
      (m.supplier_name && m.supplier_name.toLowerCase().includes(cleanSearch))
    );
  });

  const lowStockMaterials = materials.filter(m => Number(m.current_stock) <= Number(m.min_quantity));
  const totalInventoryValue = materials.reduce((acc, curr) => {
    const amt = Number(curr.current_stock) * Number(curr.unit_price);
    const gst = amt * (Number(curr.gst_percent) / 100);
    return acc + amt + gst;
  }, 0);

  // Transaction live calculations
  const txSubtotal = Number(txQty || 0) * Number(txPrice || 0);
  const txGstAmount = txSubtotal * (Number(txGst || 0) / 100);
  const txTotalAmount = txSubtotal + txGstAmount;

  const selectedMaterial = materials.find(m => m.id === txMaterialId);
  const currentStock = selectedMaterial ? Number(selectedMaterial.current_stock) : 0;
  const qtyNum = Number(txQty || 0);
  const projectedStock = txType === 'IN' ? (currentStock + qtyNum) : (currentStock - qtyNum);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-brand-gold" />
      </div>
    );
  }

  return (
    <div className="space-y-6 text-stone-900 dark:text-stone-100">
      
      {/* Top Header stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border/60 pb-6">
        <div>
          <h2 className="text-xl font-serif font-light flex items-center gap-2">
            <Package className="w-5 h-5 text-brand-gold" /> Raw Material Inventory
          </h2>
          <p className="text-xs text-stone-500 font-light mt-1">Manage stock inward/outward and GST billing levels.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleOpenMaterialForm()}
            className="flex items-center gap-1.5 px-4 py-2 bg-brand-gold text-brand-charcoal text-xs font-bold tracking-widest uppercase hover:bg-brand-gold-hover transition-colors rounded-sm shadow-md"
          >
            <Plus className="w-4 h-4" /> Add Item
          </button>
          <button
            onClick={() => handleOpenTxForm('IN')}
            className="flex items-center gap-1.5 px-4 py-2 border border-emerald-500/50 hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold tracking-widest uppercase transition-colors rounded-sm"
          >
            <ArrowUpRight className="w-4 h-4" /> Stock In
          </button>
          <button
            onClick={() => handleOpenTxForm('OUT')}
            className="flex items-center gap-1.5 px-4 py-2 border border-rose-500/50 hover:bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-bold tracking-widest uppercase transition-colors rounded-sm"
          >
            <ArrowDownRight className="w-4 h-4" /> Stock Out
          </button>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="flex border-b border-brand-border/40 overflow-x-auto scrollbar-none">
        {['dashboard', 'materials', 'transactions', 'history'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-3 text-xs font-bold tracking-wider uppercase border-b-2 transition-all duration-300 whitespace-nowrap ${
              activeTab === tab 
                ? 'border-brand-gold text-brand-gold bg-brand-stone/10' 
                : 'border-transparent text-stone-400 hover:text-stone-250'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Low Stock Dashboard Notification Banner */}
      {lowStockMaterials.length > 0 && (
        <div className="flex items-center gap-3 p-4 bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 rounded-sm">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <div className="text-xs">
            <span className="font-bold">Attention: </span> 
            {lowStockMaterials.length} raw material(s) have reached or fallen below minimum warning stock levels.
          </div>
        </div>
      )}

      {/* TAB CONTENTS */}

      {/* 1. DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-brand-stone border border-brand-border p-6 rounded-sm">
              <span className="text-[10px] font-bold tracking-wider text-stone-400 uppercase">Total Unique SKUs</span>
              <div className="text-3xl font-serif text-stone-850 dark:text-white mt-2">{materials.length}</div>
            </div>
            <div className="bg-brand-stone border border-brand-border p-6 rounded-sm">
              <span className="text-[10px] font-bold tracking-wider text-stone-400 uppercase">Total Inventory Value (Incl. GST)</span>
              <div className="text-3xl font-serif text-brand-gold mt-2">
                {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(totalInventoryValue)}
              </div>
            </div>
            <div className="bg-brand-stone border border-brand-border p-6 rounded-sm">
              <span className="text-[10px] font-bold tracking-wider text-stone-400 uppercase">Deficient Stock Warnings</span>
              <div className="text-3xl font-serif text-amber-500 mt-2">{lowStockMaterials.length}</div>
            </div>
          </div>

          {/* Deficient stock materials list */}
          {lowStockMaterials.length > 0 && (
            <div className="border border-brand-border/60 bg-brand-stone/40 p-6 rounded-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1.5 mb-4">
                <AlertTriangle className="w-4 h-4" /> Low Stock Checklist
              </h3>
              <div className="space-y-2 max-h-[250px] overflow-y-auto">
                {lowStockMaterials.map(m => (
                  <div key={m.id} className="flex justify-between items-center p-3 bg-brand-stone border border-brand-border rounded-sm text-xs">
                    <div>
                      <span className="font-semibold text-stone-450 mr-2">{m.sku}</span>
                      <span className="font-medium text-stone-800 dark:text-white">{m.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-rose-500">{m.current_stock} {m.unit}</div>
                      <div className="text-[9px] text-stone-500">Min Threshold: {m.min_quantity} {m.unit}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. MATERIALS LIST */}
      {activeTab === 'materials' && (
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                placeholder="Search by SKU, item name, or supplier..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-brand-border/65 bg-brand-stone/30 focus:border-brand-gold focus:outline-none text-xs rounded-sm transition-all"
              />
            </div>
            <button
              onClick={handleExportMaterials}
              className="flex items-center gap-1.5 px-4 py-2 border border-brand-border hover:border-brand-gold hover:text-brand-gold text-xs font-bold tracking-wider uppercase transition-all rounded-sm"
            >
              <FileSpreadsheet className="w-4 h-4" /> Export CSV
            </button>
          </div>

          <div className="overflow-x-auto border border-brand-border/65 rounded-sm">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-brand-stone border-b border-brand-border/65 text-stone-400 font-bold uppercase tracking-wider">
                  <th className="p-3">SKU</th>
                  <th className="p-3">Item Name</th>
                  <th className="p-3">Unit Price</th>
                  <th className="p-3">GST %</th>
                  <th className="p-3 text-right">Current Stock</th>
                  <th className="p-3">Min Qty</th>
                  <th className="p-3">Supplier</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/40">
                {filteredMaterials.map(m => {
                  const isLow = Number(m.current_stock) <= Number(m.min_quantity);
                  const isOut = Number(m.current_stock) === 0;
                  return (
                    <tr key={m.id} className="hover:bg-brand-stone/10 transition-colors">
                      <td className="p-3 font-semibold text-brand-gold">{m.sku}</td>
                      <td className="p-3">
                        <div className="font-semibold text-stone-800 dark:text-white">{m.name}</div>
                        {m.description && <div className="text-[10px] text-stone-500 mt-0.5 line-clamp-1">{m.description}</div>}
                      </td>
                      <td className="p-3">₹{m.unit_price}</td>
                      <td className="p-3">{m.gst_percent}%</td>
                      <td className="p-3 text-right font-bold">
                        <span className={`px-2 py-0.5 rounded-sm ${
                          isOut ? 'bg-rose-500/10 text-rose-500' :
                          isLow ? 'bg-amber-500/10 text-amber-500' :
                          'bg-emerald-500/10 text-emerald-500'
                        }`}>
                          {m.current_stock} {m.unit}
                        </span>
                      </td>
                      <td className="p-3 text-stone-500">{m.min_quantity} {m.unit}</td>
                      <td className="p-3 text-stone-400">{m.supplier_name || 'N/A'}</td>
                      <td className="p-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleOpenTxForm('IN', m.id)}
                            className="p-1 border border-emerald-500/30 hover:bg-emerald-500/15 rounded text-emerald-500"
                            title="Restock In"
                          >
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenTxForm('OUT', m.id)}
                            className="p-1 border border-rose-500/30 hover:bg-rose-500/15 rounded text-rose-500"
                            title="Consume Out"
                          >
                            <ArrowDownRight className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenMaterialForm(m)}
                            className="p-1 border border-brand-border hover:bg-brand-stone rounded text-stone-400 hover:text-white"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteMaterial(m.id)}
                            className="p-1 border border-rose-500/30 hover:bg-rose-500/20 rounded text-rose-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. TRANSACTION REGISTER */}
      {activeTab === 'transactions' && (
        <div className="max-w-xl mx-auto border border-brand-border bg-brand-stone p-6 rounded-sm space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-brand-gold flex items-center gap-1.5 border-b border-brand-border/60 pb-3">
            <History className="w-4 h-4" /> Quick Stock Ledger Log
          </h3>
          <form onSubmit={handleSaveTransaction} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-semibold text-stone-400 uppercase mb-1">Transaction Type</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setTxType('IN')}
                    className={`flex-1 py-2 text-center rounded-sm font-bold uppercase transition-all ${
                      txType === 'IN' ? 'bg-emerald-500 text-brand-charcoal' : 'border border-brand-border text-stone-400'
                    }`}
                  >
                    Stock In
                  </button>
                  <button
                    type="button"
                    onClick={() => setTxType('OUT')}
                    className={`flex-1 py-2 text-center rounded-sm font-bold uppercase transition-all ${
                      txType === 'OUT' ? 'bg-rose-500 text-white' : 'border border-brand-border text-stone-400'
                    }`}
                  >
                    Stock Out
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-stone-400 uppercase mb-1">Log Date</label>
                <input
                  type="date"
                  value={txDate}
                  onChange={(e) => setTxDate(e.target.value)}
                  className="w-full px-3 py-2 border border-brand-border/65 bg-brand-stone/30 focus:border-brand-gold focus:outline-none rounded-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-semibold text-stone-400 uppercase mb-1">SKU Number (Type / Scan Barcode)</label>
                <input
                  type="text"
                  required
                  placeholder="Enter or scan SKU (e.g. RM-MET-01)..."
                  value={txSkuInput}
                  onChange={(e) => handleSkuInputChange(e.target.value)}
                  className="w-full px-3 py-2 border border-brand-border/65 bg-brand-stone/30 focus:border-brand-gold focus:outline-none text-xs rounded-sm uppercase font-mono font-bold tracking-wider"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-stone-400 uppercase mb-1">Or Select Material From List</label>
                <select
                  value={txMaterialId}
                  onChange={(e) => handleMaterialChangeInTx(e.target.value)}
                  className="w-full px-3 py-2 border border-brand-border/65 bg-brand-charcoal focus:border-brand-gold focus:outline-none text-xs rounded-sm"
                >
                  {materials.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.sku} - {m.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {selectedMaterial && (
              <div className="p-3 bg-brand-charcoal border border-brand-border/40 rounded-sm text-xs flex justify-between items-center text-stone-300">
                <div>
                  <span className="text-[9px] font-bold text-brand-gold uppercase tracking-widest block">Item Details</span>
                  <span className="font-semibold text-white">{selectedMaterial.name}</span>
                  <span className="text-stone-500 font-light ml-2">({selectedMaterial.unit})</span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest block">Current Stock</span>
                  <span className="font-mono font-bold text-white">{selectedMaterial.current_stock} {selectedMaterial.unit}</span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-semibold text-stone-400 uppercase mb-1">Quantity</label>
                <input
                  type="number"
                  step="0.001"
                  required
                  placeholder="0.0"
                  value={txQty}
                  onChange={(e) => setTxQty(e.target.value)}
                  className="w-full px-3 py-2 border border-brand-border/65 bg-brand-stone/30 focus:border-brand-gold focus:outline-none rounded-sm font-bold text-white bg-stone-900"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-stone-400 uppercase mb-1">Price Per Unit (INR)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="0.00"
                  value={txPrice}
                  onChange={(e) => setTxPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-brand-border/65 bg-brand-stone/30 focus:border-brand-gold focus:outline-none rounded-sm"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-stone-400 uppercase mb-1">GST (%)</label>
                <input
                  type="number"
                  value={txGst}
                  onChange={(e) => setTxGst(e.target.value)}
                  className="w-full px-3 py-2 border border-brand-border/65 bg-brand-stone/30 focus:border-brand-gold focus:outline-none rounded-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-semibold text-stone-400 uppercase mb-1">Supplier Name (Optional)</label>
                <input
                  type="text"
                  value={txSupplier}
                  onChange={(e) => setTxSupplier(e.target.value)}
                  className="w-full px-3 py-2 border border-brand-border/65 bg-brand-stone/30 focus:border-brand-gold focus:outline-none rounded-sm"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-stone-400 uppercase mb-1">Remarks/Notes</label>
                <input
                  type="text"
                  placeholder="Production, restock, sample etc..."
                  value={txRemarks}
                  onChange={(e) => setTxRemarks(e.target.value)}
                  className="w-full px-3 py-2 border border-brand-border/65 bg-brand-stone/30 focus:border-brand-gold focus:outline-none rounded-sm"
                />
              </div>
            </div>

            {/* Calculations Breakdown */}
            <div className="p-4 bg-brand-charcoal border border-brand-border rounded-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-stone-400">Subtotal:</span>
                <span className="font-mono">₹{txSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">GST Amount ({txGst}%):</span>
                <span className="font-mono">₹{txGstAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-brand-gold">
                <span>Total Amount:</span>
                <span className="font-mono">₹{txTotalAmount.toFixed(2)}</span>
              </div>
              {selectedMaterial && (
                <div className="flex justify-between border-t border-brand-border/50 pt-2 text-[10px]">
                  <span className="text-stone-400">Projected Inventory Stock:</span>
                  <span className={`font-mono font-bold ${
                    projectedStock < 0 ? 'text-rose-500' :
                    projectedStock <= Number(selectedMaterial.min_quantity) ? 'text-amber-500' :
                    'text-emerald-500'
                  }`}>
                    {selectedMaterial.current_stock} &rarr; {projectedStock.toFixed(3)} {selectedMaterial.unit}
                  </span>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-brand-gold text-brand-charcoal font-bold uppercase tracking-widest hover:bg-brand-gold-hover transition-colors rounded-sm"
            >
              Submit Transaction
            </button>
          </form>
        </div>
      )}

      {/* 4. TRANSACTION HISTORY */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={handleExportTransactions}
              className="flex items-center gap-1.5 px-4 py-2 border border-brand-border hover:border-brand-gold hover:text-brand-gold text-xs font-bold tracking-wider uppercase transition-all rounded-sm"
            >
              <FileSpreadsheet className="w-4 h-4" /> Export Transactions CSV
            </button>
          </div>

          <div className="overflow-x-auto border border-brand-border/65 rounded-sm">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-brand-stone border-b border-brand-border/65 text-stone-400 font-bold uppercase tracking-wider">
                  <th className="p-3">ID</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">SKU</th>
                  <th className="p-3">Item Name</th>
                  <th className="p-3">Type</th>
                  <th className="p-3 text-right">Quantity</th>
                  <th className="p-3 text-right">Total (INR)</th>
                  <th className="p-3">Supplier/Customer</th>
                  <th className="p-3">Performed By</th>
                  <th className="p-3">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/40">
                {transactions.map(t => (
                  <tr key={t.id} className="hover:bg-brand-stone/10 transition-colors">
                    <td className="p-3 font-mono text-[10px] text-stone-500" title={t.id}>
                      {t.id ? t.id.slice(0, 8) : 'N/A'}
                    </td>
                    <td className="p-3 font-mono text-stone-400">{t.purchase_date}</td>
                    <td className="p-3 font-semibold text-brand-gold">{t.raw_materials?.sku || 'N/A'}</td>
                    <td className="p-3 font-semibold text-stone-800 dark:text-white">{t.raw_materials?.name || 'N/A'}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-sm font-bold text-[10px] ${
                        t.transaction_type === 'IN' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                      }`}>
                        {t.transaction_type}
                      </span>
                    </td>
                    <td className="p-3 text-right font-bold">
                      {t.quantity} {t.raw_materials?.unit}
                    </td>
                    <td className="p-3 text-right font-mono font-bold">₹{Number(t.total_amount).toFixed(2)}</td>
                    <td className="p-3 text-stone-400">{t.supplier_name || 'N/A'}</td>
                    <td className="p-3 text-stone-400 font-mono text-[10px]">{t.performed_by || 'System/Admin'}</td>
                    <td className="p-3 italic text-stone-500">{t.remarks || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MATERIAL MODAL DIALOG FORM */}
      {isMaterialFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-brand-charcoal border border-brand-border rounded-sm max-w-lg w-full overflow-hidden shadow-2xl animate-scale-in">
            <div className="px-6 py-4 border-b border-brand-border bg-stone-950 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-widest text-brand-gold">
                {editingMaterial ? 'Edit Material Profile' : 'New Raw Material Profile'}
              </h3>
              <button 
                onClick={() => setIsMaterialFormOpen(false)} 
                className="text-stone-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveMaterial}>
              <div className="p-6 space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-semibold text-stone-400 uppercase mb-1">SKU Number</label>
                    <input
                      type="text"
                      required
                      placeholder="RM-MET-01"
                      value={matSku}
                      onChange={(e) => setMatSku(e.target.value)}
                      className="w-full px-3 py-2 border border-brand-border/65 bg-brand-stone/30 focus:border-brand-gold focus:outline-none rounded-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-stone-400 uppercase mb-1">Item Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Brass Metal Tube"
                      value={matName}
                      onChange={(e) => setMatName(e.target.value)}
                      className="w-full px-3 py-2 border border-brand-border/65 bg-brand-stone/30 focus:border-brand-gold focus:outline-none rounded-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-stone-400 uppercase mb-1">Description</label>
                  <textarea
                    rows="2"
                    placeholder="Provide details about the material type..."
                    value={matDescription}
                    onChange={(e) => setMatDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-brand-border/65 bg-brand-stone/30 focus:border-brand-gold focus:outline-none rounded-sm"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-semibold text-stone-400 uppercase mb-1">Unit of Measurement</label>
                    <select
                      value={matUnit}
                      onChange={(e) => setMatUnit(e.target.value)}
                      className="w-full px-3 py-2 border border-brand-border/65 bg-brand-charcoal focus:border-brand-gold focus:outline-none rounded-sm"
                    >
                      <option value="Piece">Piece</option>
                      <option value="Kg">Kg</option>
                      <option value="Meter">Meter</option>
                      <option value="Liter">Liter</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-stone-400 uppercase mb-1">Unit Price (INR)</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={matUnitPrice}
                      onChange={(e) => setMatUnitPrice(e.target.value)}
                      className="w-full px-3 py-2 border border-brand-border/65 bg-brand-stone/30 focus:border-brand-gold focus:outline-none rounded-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-stone-400 uppercase mb-1">GST (%)</label>
                    <input
                      type="number"
                      placeholder="18"
                      value={matGstPercent}
                      onChange={(e) => setMatGstPercent(e.target.value)}
                      className="w-full px-3 py-2 border border-brand-border/65 bg-brand-stone/30 focus:border-brand-gold focus:outline-none rounded-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-semibold text-stone-400 uppercase mb-1">Min Qty Threshold</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Alert level (e.g. 5.0)"
                      value={matMinQty}
                      onChange={(e) => setMatMinQty(e.target.value)}
                      className="w-full px-3 py-2 border border-brand-border/65 bg-brand-stone/30 focus:border-brand-gold focus:outline-none rounded-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-stone-400 uppercase mb-1">Default Supplier</label>
                    <input
                      type="text"
                      placeholder="Supplier company..."
                      value={matSupplier}
                      onChange={(e) => setMatSupplier(e.target.value)}
                      className="w-full px-3 py-2 border border-brand-border/65 bg-brand-stone/30 focus:border-brand-gold focus:outline-none rounded-sm"
                    />
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-brand-border bg-stone-950 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsMaterialFormOpen(false)}
                  className="px-4 py-2 border border-brand-border text-stone-400 hover:text-white text-xs font-bold uppercase rounded-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-gold text-brand-charcoal text-xs font-bold uppercase rounded-sm hover:bg-brand-gold-hover"
                >
                  {editingMaterial ? 'Save Profile' : 'Create Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TRANSACTION MODAL DIALOG FORM */}
      {isTxFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-brand-charcoal border border-brand-border rounded-sm max-w-lg w-full overflow-hidden shadow-2xl animate-scale-in">
            <div className="px-6 py-4 border-b border-brand-border bg-stone-950 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-widest text-brand-gold">
                Log Stock {txType === 'IN' ? 'Inward (Add)' : 'Outward (Consume)'}
              </h3>
              <button 
                onClick={() => setIsTxFormOpen(false)} 
                className="text-stone-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveTransaction}>
              <div className="p-6 space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-semibold text-stone-400 uppercase mb-1">SKU Number (Type / Scan Barcode)</label>
                    <input
                      type="text"
                      required
                      placeholder="Enter or scan SKU..."
                      value={txSkuInput}
                      onChange={(e) => handleSkuInputChange(e.target.value)}
                      className="w-full px-3 py-2 border border-brand-border/65 bg-brand-stone/30 focus:border-brand-gold focus:outline-none text-xs rounded-sm uppercase font-mono font-bold tracking-wider"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-stone-400 uppercase mb-1">Or Select Material From List</label>
                    <select
                      value={txMaterialId}
                      onChange={(e) => handleMaterialChangeInTx(e.target.value)}
                      className="w-full px-3 py-2 border border-brand-border/65 bg-brand-charcoal focus:border-brand-gold focus:outline-none text-xs rounded-sm"
                    >
                      {materials.map(m => (
                        <option key={m.id} value={m.id}>
                          {m.sku} - {m.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {selectedMaterial && (
                  <div className="p-3 bg-brand-charcoal border border-brand-border/40 rounded-sm text-xs flex justify-between items-center text-stone-300">
                    <div>
                      <span className="text-[9px] font-bold text-brand-gold uppercase tracking-widest block">Item Details</span>
                      <span className="font-semibold text-white">{selectedMaterial.name}</span>
                      <span className="text-stone-500 font-light ml-2">({selectedMaterial.unit})</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest block">Current Stock</span>
                      <span className="font-mono font-bold text-white">{selectedMaterial.current_stock} {selectedMaterial.unit}</span>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-semibold text-stone-400 uppercase mb-1">Quantity</label>
                    <input
                      type="number"
                      step="0.001"
                      required
                      placeholder="0.0"
                      value={txQty}
                      onChange={(e) => setTxQty(e.target.value)}
                      className="w-full px-3 py-2 border border-brand-border/65 bg-brand-stone/30 focus:border-brand-gold focus:outline-none rounded-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-stone-400 uppercase mb-1">Unit Price (INR)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      placeholder="0.00"
                      value={txPrice}
                      onChange={(e) => setTxPrice(e.target.value)}
                      className="w-full px-3 py-2 border border-brand-border/65 bg-brand-stone/30 focus:border-brand-gold focus:outline-none rounded-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-stone-400 uppercase mb-1">GST (%)</label>
                    <input
                      type="number"
                      value={txGst}
                      onChange={(e) => setTxGst(e.target.value)}
                      className="w-full px-3 py-2 border border-brand-border/65 bg-brand-stone/30 focus:border-brand-gold focus:outline-none rounded-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-semibold text-stone-400 uppercase mb-1">Transaction Date</label>
                    <input
                      type="date"
                      value={txDate}
                      onChange={(e) => setTxDate(e.target.value)}
                      className="w-full px-3 py-2 border border-brand-border/65 bg-brand-stone/30 focus:border-brand-gold focus:outline-none rounded-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-stone-400 uppercase mb-1">Supplier (Optional)</label>
                    <input
                      type="text"
                      value={txSupplier}
                      onChange={(e) => setTxSupplier(e.target.value)}
                      className="w-full px-3 py-2 border border-brand-border/65 bg-brand-stone/30 focus:border-brand-gold focus:outline-none rounded-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-stone-400 uppercase mb-1">Remarks</label>
                  <input
                    type="text"
                    placeholder="Note regarding production batch, consumption, etc..."
                    value={txRemarks}
                    onChange={(e) => setTxRemarks(e.target.value)}
                    className="w-full px-3 py-2 border border-brand-border/65 bg-brand-stone/30 focus:border-brand-gold focus:outline-none rounded-sm"
                  />
                </div>

                {/* Calculations Summary */}
                <div className="p-4 bg-brand-charcoal border border-brand-border rounded-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-stone-450">Amount Before GST:</span>
                    <span>₹{txSubtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-450">GST Amount:</span>
                    <span>₹{txGstAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-brand-gold pt-1">
                    <span>Total Amount (Inc. GST):</span>
                    <span>₹{txTotalAmount.toFixed(2)}</span>
                  </div>
                  {selectedMaterial && (
                    <div className="flex justify-between border-t border-brand-border/30 pt-1 text-[10px]">
                      <span className="text-stone-400">Projected Inventory Stock:</span>
                      <span className={`font-mono font-bold ${
                        projectedStock < 0 ? 'text-rose-500' :
                        projectedStock <= Number(selectedMaterial.min_quantity) ? 'text-amber-500' :
                        'text-emerald-500'
                      }`}>
                        {selectedMaterial.current_stock} &rarr; {projectedStock.toFixed(3)} {selectedMaterial.unit}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="px-6 py-4 border-t border-brand-border bg-stone-950 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsTxFormOpen(false)}
                  className="px-4 py-2 border border-brand-border text-stone-400 hover:text-white text-xs font-bold uppercase rounded-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 text-xs font-bold uppercase rounded-sm ${
                    txType === 'IN' ? 'bg-emerald-500 hover:bg-emerald-450 text-brand-charcoal' : 'bg-rose-500 hover:bg-rose-455 text-white'
                  }`}
                >
                  Confirm {txType === 'IN' ? 'Inward' : 'Outward'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
