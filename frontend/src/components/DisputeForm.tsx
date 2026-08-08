import React, { useState } from 'react';
import { DisputeRequest } from '../types';
import { disputeApi } from '../services/api';

interface DisputeFormProps {
  onClassificationComplete: (result: any) => void;
  onError: (error: string) => void;
}

export const DisputeForm: React.FC<DisputeFormProps> = ({ onClassificationComplete, onError }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<DisputeRequest>({
    transactionId: '',
    cardholderId: '',
    amount: 0,
    currency: 'USD',
    transactionDate: new Date().toISOString().slice(0, 16),
    disputeDate: new Date().toISOString().slice(0, 16),
    disputeReason: '',
    additionalContext: '',
    merchantCategoryCode: '',
    merchantName: '',
    merchantCountry: '',
    merchantAmount: undefined,
    settlementCurrency: 'USD',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await disputeApi.classifyDispute(formData);
      onClassificationComplete(result);
    } catch (error: any) {
      onError(error.response?.data?.message || 'Failed to classify dispute. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount *
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                required
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Currency *
              </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Transaction Date *
              </label>
              <input
                type="datetime-local"
                name="transactionDate"
                value={formData.transactionDate}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dispute Date *
              </label>
        {/* Merchant Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Merchant Details</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Merchant Name *
            </label>
            <input
              type="text"
              name="merchantName"
              value={formData.merchantName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Merchant Category Code (MCC) *
            </label>
            <input
      {/* Dispute Reason */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Dispute Information</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Dispute Reason *
          </label>
          <textarea
            name="disputeReason"
            value={formData.disputeReason}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Describe the reason for the dispute"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Additional Context
          </label>
          <textarea
            name="additionalContext"
            value={formData.additionalContext}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Any additional information"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-end space-x-4">
        <button
          type="button"
          onClick={() => setFormData({
            transactionId: '',
            cardholderId: '',
            amount: 0,
            currency: 'USD',
            transactionDate: new Date().toISOString().slice(0, 16),
            disputeDate: new Date().toISOString().slice(0, 16),
            disputeReason: '',
            additionalContext: '',
            merchantCategoryCode: '',
            merchantName: '',
            merchantCountry: '',
            merchantAmount: undefined,
            settlementCurrency: 'USD',
          })}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Clear
        </button>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Classifying...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              <span>Classify Dispute</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
              type="text"
              name="merchantCategoryCode"
              value={formData.merchantCategoryCode}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Merchant Country
            </label>
            <input
              type="text"
              name="merchantCountry"
              value={formData.merchantCountry}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>
              <input
                type="datetime-local"
                name="disputeDate"
                value={formData.disputeDate}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="CAD">CAD</option>
              </select>
            </div>
          </div>
      ...prev,
      [name]: name === 'amount' || name === 'merchantAmount' ? parseFloat(value) || 0 : value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Transaction Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Transaction Details</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Transaction ID *
            </label>
            <input
              type="text"
              name="transactionId"
              value={formData.transactionId}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cardholder ID *
            </label>
            <input
              type="text"
              name="cardholderId"
              value={formData.cardholderId}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>