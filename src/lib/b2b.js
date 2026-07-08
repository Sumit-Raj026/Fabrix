import { supabase } from './supabase';

export const b2bService = {
  /**
   * Submit a new B2B/Wholesale inquiry.
   * Open to any public visitor.
   */
  async submitInquiry(inquiry) {
    try {
      const { data, error } = await supabase
        .from('b2b_inquiries')
        .insert({
          company_name: inquiry.companyName.trim(),
          contact_person: inquiry.contactPerson.trim(),
          email: inquiry.email.trim(),
          phone: inquiry.phone.trim(),
          business_type: inquiry.businessType,
          gst_number: inquiry.gstNumber?.trim() || null,
          estimated_quantity: Number(inquiry.estimatedQuantity) || 0,
          message: inquiry.message.trim(),
          status: 'PENDING'
        });

      if (error) throw error;
      return { success: true, data };
    } catch (err) {
      console.error('Error submitting B2B inquiry:', err);
      throw err;
    }
  },

  /**
   * Fetch all B2B inquiries.
   * Requires admin authentication.
   */
  async getInquiries() {
    try {
      const { data, error } = await supabase
        .from('b2b_inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error fetching B2B inquiries:', err);
      return [];
    }
  },

  /**
   * Update the status of an inquiry (e.g. PENDING -> CONTACTED -> CLOSED).
   * Requires admin authentication.
   */
  async updateInquiryStatus(id, status) {
    try {
      const { data, error } = await supabase
        .from('b2b_inquiries')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      return { success: true, data };
    } catch (err) {
      console.error('Error updating inquiry status:', err);
      throw err;
    }
  },

  /**
   * Delete an inquiry log.
   * Requires admin authentication.
   */
  async deleteInquiry(id) {
    try {
      const { error } = await supabase
        .from('b2b_inquiries')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Error deleting B2B inquiry:', err);
      throw err;
    }
  }
};
