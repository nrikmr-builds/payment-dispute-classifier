"use client";

import React, { useState, useRef, useEffect } from "react";
import type { DisputeRequest } from "@/lib/types";

const COUNTRIES = [
  // USD countries
  { code: "US", name: "United States", currency: "USD" },
  { code: "EC", name: "Ecuador", currency: "USD" },
  { code: "SV", name: "El Salvador", currency: "USD" },
  { code: "PA", name: "Panama", currency: "USD" },
  { code: "PR", name: "Puerto Rico", currency: "USD" },
  { code: "TL", name: "East Timor", currency: "USD" },
  { code: "ZW", name: "Zimbabwe", currency: "USD" },
  { code: "VG", name: "British Virgin Islands", currency: "USD" },
  { code: "TC", name: "Turks and Caicos Islands", currency: "USD" },
  // EUR countries
  { code: "AT", name: "Austria", currency: "EUR" },
  { code: "BE", name: "Belgium", currency: "EUR" },
  { code: "HR", name: "Croatia", currency: "EUR" },
  { code: "CY", name: "Cyprus", currency: "EUR" },
  { code: "EE", name: "Estonia", currency: "EUR" },
  { code: "FI", name: "Finland", currency: "EUR" },
  { code: "FR", name: "France", currency: "EUR" },
  { code: "DE", name: "Germany", currency: "EUR" },
  { code: "GR", name: "Greece", currency: "EUR" },
  { code: "IE", name: "Ireland", currency: "EUR" },
  { code: "IT", name: "Italy", currency: "EUR" },
  { code: "LV", name: "Latvia", currency: "EUR" },
  { code: "LT", name: "Lithuania", currency: "EUR" },
  { code: "LU", name: "Luxembourg", currency: "EUR" },
  { code: "MT", name: "Malta", currency: "EUR" },
  { code: "NL", name: "Netherlands", currency: "EUR" },
  { code: "PT", name: "Portugal", currency: "EUR" },
  { code: "SK", name: "Slovakia", currency: "EUR" },
  { code: "SI", name: "Slovenia", currency: "EUR" },
  { code: "ES", name: "Spain", currency: "EUR" },
  { code: "AD", name: "Andorra", currency: "EUR" },
  { code: "MC", name: "Monaco", currency: "EUR" },
  { code: "SM", name: "San Marino", currency: "EUR" },
  { code: "VA", name: "Vatican City", currency: "EUR" },
  // GBP countries
  { code: "GB", name: "United Kingdom", currency: "GBP" },
  { code: "JE", name: "Jersey", currency: "GBP" },
  { code: "GG", name: "Guernsey", currency: "GBP" },
  { code: "IM", name: "Isle of Man", currency: "GBP" },
].sort((a, b) => a.name.localeCompare(b.name));

interface DisputeFormProps {
  onClassificationComplete: (result: any) => void;
  onError: (error: string) => void;
}

export const DisputeForm = ({ onClassificationComplete, onError }: DisputeFormProps) => {
  const [loading, setLoading] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
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
      onClassificationComplete(data);
    } catch (err: any) {
      onError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowCountryDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "amount" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleCountrySearch = (value: string) => {
    setCountrySearch(value);
    setShowCountryDropdown(true);
  };

  const selectCountry = (countryName: string) => {
    setSelectedCountry(countryName);
    setCountrySearch(countryName);
    setForm((prev) => ({ ...prev, merchantCountry: countryName }));
    setShowCountryDropdown(false);
  };

  const filteredCountries = COUNTRIES.filter((country) =>
    country.name.toLowerCase().includes(countrySearch.toLowerCase())
  );

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Transaction Details</h3>
          <div>
            <label className="block text-sm font-medium mb-1">Transaction ID *</label>
            <input type="text" name="transactionId" value={form.transactionId} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Cardholder ID *</label>
            <input type="text" name="cardholderId" value={form.cardholderId} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Amount *</label>
              <input type="text" name="amount" value={form.amount} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Currency *</label>
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
          <div>
            <label className="block text-sm font-medium mb-1">Merchant Name *</label>
            <input type="text" name="merchantName" value={form.merchantName} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">MCC *</label>
            <input type="text" name="merchantCategoryCode" value={form.merchantCategoryCode} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md" />
          </div>
          <div className="relative" ref={dropdownRef}>
            <label className="block text-sm font-medium mb-1">Country</label>
            <input
              type="text"
              value={countrySearch}
              onChange={(e) => handleCountrySearch(e.target.value)}
              onFocus={() => setShowCountryDropdown(true)}
              placeholder="Search country..."
              className="w-full px-3 py-2 border rounded-md"
            />
            {showCountryDropdown && filteredCountries.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                {filteredCountries.map((country) => (
                  <div
                    key={country.code}
                    onClick={() => selectCountry(country.name)}
                    className="px-3 py-2 hover:bg-blue-50 cursor-pointer"
                  >
                    <span className="text-sm">{country.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold border-b pb-2">Dispute Information</h3>
        <div className="mt-4">
          <label className="block text-sm font-medium mb-1">Dispute Reason *</label>
          <textarea name="disputeReason" value={form.disputeReason} onChange={handleChange} required rows={4} className="w-full px-3 py-2 border rounded-md" />
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium mb-1">Additional Context</label>
          <textarea name="additionalContext" value={form.additionalContext} onChange={handleChange} rows={3} className="w-full px-3 py-2 border rounded-md" />
        </div>
      </div>
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => {
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
            });
            setCountrySearch("");
            setSelectedCountry("");
            setShowCountryDropdown(false);
          }}
          className="px-4 py-2 border rounded-md hover:bg-gray-50"
        >
          Clear
        </button>
        <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400">
          {loading ? "Classifying..." : "Classify Dispute"}
        </button>
      </div>
    </form>
  );
};