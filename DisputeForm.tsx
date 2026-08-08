"use client";
import React, { useState } from "react";
import type { DisputeRequest } from "@/lib/types";

export const DisputeForm = ({ onComplete, onError }: any) => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<DisputeRequest>({
    transactionId: "",
    cardholderId: "",
    amount: 0,
    currency: "USD",
    transactionDate: new Date().toISOString().slice(0, 16),
    disputeDate: new Date().toISOString().slice(0, 16),
    disputeReason: "",
    additionalContext: "",
    merchantCategoryCode: "",
    merchantName: "",
    merchantCountry: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed");
      }
      const data = await res.json();
      onComplete(data);
    } catch (err: any) {
      onError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "amount" ? parseFloat(value) || 0 : value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Transaction Details</h3>
          {[
            { name: "transactionId", label: "Transaction ID", required: true },
            { name: "cardholderId", label: "Cardholder ID", required: true },
          ].map((f) => (
            <div key={f.name}>
              <label className="block text-sm font-medium mb-1">{f.label}</label>
              <input
                type="text"
                name={f.name}
                value={form[f.name as keyof DisputeRequest] as string}
                onChange={handleChange}
                required={f.required}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Amount</label>
              <input type="number" name="amount" value={form.amount} onChange={handleChange} required step="0.01" className="w-full px-3 py-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Currency</label>
              <select name="currency" value={form.currency} onChange={handleChange} className="w-full px-3 py-2 border rounded-md">
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Merchant Details</h3>
          {[
            { name: "merchantName", label: "Merchant Name", required: true },
            { name: "merchantCategoryCode", label: "MCC", required: true },
            { name: "merchantCountry", label: "Country", required: false },
          ].map((f) => (
            <div key={f.name}>
              <label className="block text-sm font-medium mb-1">{f.label}</label>
              <input
                type="text"
                name={f.name}
                value={form[f.name as keyof DisputeRequest] as string}
                onChange={handleChange}
                required={f.required}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold border-b pb-2">Dispute Information</h3>
        <div className="mt-4">
          <label className="block text-sm font-medium mb-1">Dispute Reason</label>
          <textarea
            name="disputeReason"
            value={form.disputeReason}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium mb-1">Additional Context</label>
          <textarea
            name="additionalContext"
            value={form.additionalContext}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
      </div>
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() =>
            setForm({
              transactionId: "",
              cardholderId: "",
              amount: 0,
              currency: "USD",
              transactionDate: new Date().toISOString().slice(0, 16),
              disputeDate: new Date().toISOString().slice(0, 16),
              disputeReason: "",
              additionalContext: "",
              merchantCategoryCode: "",
              merchantName: "",
              merchantCountry: "",
            })
          }
          className="px-4 py-2 border rounded-md hover:bg-gray-50"
        >
          Clear
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
        >
          {loading ? "Classifying..." : "Classify Dispute"}
        </button>
      </div>
    </form>
  );
};
