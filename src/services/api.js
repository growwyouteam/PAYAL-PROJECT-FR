// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://inventory-management-xqt1.vercel.app';
const API_BASE_URL = 'http://localhost:4003/api';
class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  }

  // Transaction endpoints
  async getAllTransactions() {
    return this.request('/items/transactions');
  }

  async getTransactionsByType(type) {
    return this.request(`/items/transactions/${type}`);
  }

  async addTransaction(transactionData) {
    return this.request('/items/transactions', {
      method: 'POST',
      body: JSON.stringify(transactionData),
    });
  }

  async deleteTransaction(id) {
    return this.request(`/items/transactions/${id}`, {
      method: 'DELETE',
    });
  }

  // Inventory endpoints
  async getAvailableInventory() {
    return this.request('/items/inventory/available');
  }
  // Vendor endpoints
  async getAllVendors() {
    return this.request('/vendors');
  }

  async addVendor(name, phone, address, assignedWires = []) {
    return this.request('/vendors', {
      method: 'POST',
      body: JSON.stringify({ name, phone, address, assignedWires }),
    });
  }

  async updateVendor(vendorId, name, phone, address) {
    return this.request(`/vendors/${vendorId}`, {
      method: 'PUT',
      body: JSON.stringify({ name, phone, address }),
    });
  }

  async deleteVendor(vendorId) {
    return this.request(`/vendors/${vendorId}`, {
      method: 'DELETE',
    });
  }

  async assignWireToVendor(vendorId, wireName, payalType, pricePerKg) {
    return this.request(`/vendors/${vendorId}/wires`, {
      method: 'POST',
      body: JSON.stringify({ wireName, payalType, pricePerKg }),
    });
  }

  async removeWireFromVendor(vendorId, assignmentId) {
    return this.request(`/vendors/${vendorId}/wires/${assignmentId}`, {
      method: 'DELETE',
    });
  }

  async getAllItems() {
    return this.request('/vendors/items');
  }

  async addItem(name) {
    return this.request('/vendors/items', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  }

  async deleteItem(name) {
    return this.request(`/vendors/items/${encodeURIComponent(name)}`, {
      method: 'DELETE',
    });
  }

  async getVendorPrices() {
    return this.request('/vendors/prices');
  }

  async getItemPrice(vendor, item) {
    return this.request(`/vendors/${encodeURIComponent(vendor)}/items/${encodeURIComponent(item)}/price`);
  }

  async getVendorSummary(vendor) {
    return this.request(`/vendors/${encodeURIComponent(vendor)}/summary`);
  }

  async getVendorTransactions(vendor) {
    return this.request(`/vendors/${encodeURIComponent(vendor)}/transactions`);
  }

  // Payal Price Chart endpoints
  async getPayalPriceChart() {
    return this.request('/payal-price-chart');
  }

  async getPayalPrice(wireThickness, payalType) {
    return this.request(`/payal-price-chart/${encodeURIComponent(wireThickness)}/${encodeURIComponent(payalType)}`);
  }

  async updatePayalPrice(wireThickness, payalType, pricePerKg) {
    return this.request(`/payal-price-chart/${encodeURIComponent(wireThickness)}/${encodeURIComponent(payalType)}`, {
      method: 'PUT',
      body: JSON.stringify({ pricePerKg }),
    });
  }

  async addPayalPrice(wireThickness, payalType, pricePerKg) {
    return this.request('/payal-price-chart', {
      method: 'POST',
      body: JSON.stringify({ wireThickness, payalType, pricePerKg }),
    });
  }

  async seedPayalPriceChart() {
    return this.request('/payal-price-chart/seed', {
      method: 'POST',
    });
  }

  async deletePayalPrice(wireThickness, payalType) {
    return this.request(`/payal-price-chart/${encodeURIComponent(wireThickness)}/${encodeURIComponent(payalType)}`, {
      method: 'DELETE',
    });
  }

  async deleteWireFromPriceChart(wireThickness) {
    return this.request(`/payal-price-chart/wire/${encodeURIComponent(wireThickness)}`, {
      method: 'DELETE',
    });
  }

  // Payment endpoints
  async getAllPayments() {
    return this.request('/payments');
  }

  async getVendorPayments(vendorName) {
    return this.request(`/payments/vendor/${encodeURIComponent(vendorName)}`);
  }

  async getVendorWirePayments(vendorName, wireName) {
    return this.request(`/payments/vendor/${encodeURIComponent(vendorName)}/wire/${encodeURIComponent(wireName)}`);
  }

  async addPayment(paymentData) {
    return this.request('/payments', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }

  async updatePayment(paymentId, paymentData) {
    return this.request(`/payments/${paymentId}`, {
      method: 'PUT',
      body: JSON.stringify(paymentData),
    });
  }

  async deletePayment(paymentId) {
    return this.request(`/payments/${paymentId}`, {
      method: 'DELETE',
    });
  }

  async getPaymentStats() {
    return this.request('/payments/stats');
  }

  // Vendor Transaction Records endpoints
  async getAllVendorTransactionRecords() {
    return this.request('/vendor-transaction-records');
  }

  async getVendorTransactionRecordsByVendor(vendorName) {
    return this.request(`/vendor-transaction-records/vendor/${encodeURIComponent(vendorName)}`);
  }

  async createOrUpdateVendorTransactionRecord(recordData) {
    return this.request('/vendor-transaction-records', {
      method: 'POST',
      body: JSON.stringify(recordData),
    });
  }

  async uploadPdfToRecord(recordId, file) {
    const formData = new FormData();
    formData.append('pdf', file);

    return fetch(`${API_BASE_URL}/vendor-transaction-records/${recordId}/upload-pdf`, {
      method: 'POST',
      body: formData,
    }).then(res => {
      if (!res.ok) throw new Error('Failed to upload PDF');
      return res.json();
    });
  }

  async uploadImageToRecord(recordId, file) {
    const formData = new FormData();
    formData.append('image', file);

    return fetch(`${API_BASE_URL}/vendor-transaction-records/${recordId}/upload-image`, {
      method: 'POST',
      body: formData,
    }).then(res => {
      if (!res.ok) throw new Error('Failed to upload image');
      return res.json();
    });
  }

  async deleteVendorTransactionRecord(recordId) {
    return this.request(`/vendor-transaction-records/${recordId}`, {
      method: 'DELETE',
    });
  }

  // Print Status endpoints
  async getAllPrintStatuses() {
    return this.request('/print-status');
  }

  async getVendorPrintStatuses(vendorName) {
    return this.request(`/print-status/vendor/${encodeURIComponent(vendorName)}`);
  }

  async markPageAsPrinted(vendorName, pageNumber) {
    return this.request('/print-status/mark-printed', {
      method: 'POST',
      body: JSON.stringify({ vendorName, pageNumber }),
    });
  }

  async markPagesAsPrintedBatch(pages) {
    return this.request('/print-status/mark-printed-batch', {
      method: 'POST',
      body: JSON.stringify({ pages }),
    });
  }

  async unmarkPage(vendorName, pageNumber) {
    return this.request(`/print-status/${encodeURIComponent(vendorName)}/${pageNumber}`, {
      method: 'DELETE',
    });
  }

  async clearAllPrintStatuses() {
    return this.request('/print-status/clear/all', {
      method: 'DELETE',
    });
  }

  async clearVendorPrintStatuses(vendorName) {
    return this.request(`/print-status/clear/vendor/${encodeURIComponent(vendorName)}`, {
      method: 'DELETE',
    });
  }

  async clearPagePrintStatus(vendorName, pageNumber) {
    return this.request(`/print-status/${encodeURIComponent(vendorName)}/${pageNumber}`, {
      method: 'DELETE',
    });
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

export default new ApiService();
