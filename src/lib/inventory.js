import { supabase } from './supabase';

// ─── MATERIALS ───────────────────────────────────────────────────────────────

export const inventory = {

  async getMaterials() {
    try {
      const { data, error } = await supabase
        .from('raw_materials')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('getMaterials error:', err);
      return [];
    }
  },

  async saveMaterial(material) {
    try {
      const payload = {
        sku: material.sku.trim().toUpperCase(),
        name: material.name.trim(),
        description: material.description?.trim() || '',
        unit: material.unit,
        unit_price: Number(material.unit_price) || 0,
        min_quantity: Number(material.min_quantity) || 0,
        gst_percent: Number(material.gst_percent) || 0,
        supplier_name: material.supplier_name?.trim() || '',
        updated_at: new Date().toISOString(),
      };

      if (material.id) {
        // Update existing material
        const { error } = await supabase
          .from('raw_materials')
          .update(payload)
          .eq('id', material.id);
        if (error) throw error;
      } else {
        // Insert new material (initial stock comes from first transaction)
        const { error } = await supabase
          .from('raw_materials')
          .insert({ ...payload, current_stock: 0 });
        if (error) throw error;
      }
      return true;
    } catch (err) {
      console.error('saveMaterial error:', err);
      throw err;
    }
  },

  async deleteMaterial(id) {
    try {
      const { error } = await supabase
        .from('raw_materials')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return true;
    } catch (err) {
      console.error('deleteMaterial error:', err);
      throw err;
    }
  },

  // ─── TRANSACTIONS ───────────────────────────────────────────────────────────

  async getTransactions(materialId = null) {
    try {
      let query = supabase
        .from('inventory_transactions')
        .select(`
          *,
          raw_materials (sku, name, unit)
        `)
        .order('created_at', { ascending: false });

      if (materialId) {
        query = query.eq('material_id', materialId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('getTransactions error:', err);
      return [];
    }
  },

  async addTransaction(tx) {
    try {
      const qty = Number(tx.quantity);
      const price = Number(tx.unit_price);
      const gst = Number(tx.gst_percent) || 0;
      const subtotal = qty * price;
      const gstAmount = subtotal * (gst / 100);
      const totalAmount = subtotal + gstAmount;

      // 1. Fetch current stock
      const { data: mat, error: fetchErr } = await supabase
        .from('raw_materials')
        .select('current_stock, name')
        .eq('id', tx.material_id)
        .single();
      if (fetchErr) throw fetchErr;

      // 2. Validate stock for OUT transactions
      if (tx.transaction_type === 'OUT') {
        if (Number(mat.current_stock) < qty) {
          throw new Error(
            `Insufficient stock for "${mat.name}". Available: ${mat.current_stock}, Requested: ${qty}`
          );
        }
      }

      // 3. Insert transaction record
      const { error: txErr } = await supabase
        .from('inventory_transactions')
        .insert({
          material_id: tx.material_id,
          transaction_type: tx.transaction_type,
          quantity: qty,
          unit_price: price,
          gst_percent: gst,
          subtotal: subtotal,
          gst_amount: gstAmount,
          total_amount: totalAmount,
          purchase_date: tx.purchase_date || new Date().toISOString().split('T')[0],
          supplier_name: tx.supplier_name?.trim() || '',
          remarks: tx.remarks?.trim() || '',
          performed_by: tx.performed_by || 'System/Admin'
        });
      if (txErr) throw txErr;

      // 4. Update current_stock
      const delta = tx.transaction_type === 'IN' ? qty : -qty;
      const newStock = Number(mat.current_stock) + delta;
      const { error: updateErr } = await supabase
        .from('raw_materials')
        .update({
          current_stock: newStock,
          updated_at: new Date().toISOString(),
        })
        .eq('id', tx.material_id);
      if (updateErr) throw updateErr;

      return { success: true, newStock };
    } catch (err) {
      console.error('addTransaction error:', err);
      throw err;
    }
  },

  // ─── HELPERS ─────────────────────────────────────────────────────────────────

  exportToCSV(data, filename) {
    if (!data || data.length === 0) return;
    const headers = Object.keys(data[0]);
    const rows = data.map(row =>
      headers.map(h => {
        const val = row[h] ?? '';
        const str = String(val).replace(/"/g, '""');
        return str.includes(',') || str.includes('\n') ? `"${str}"` : str;
      }).join(',')
    );
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  },
};
