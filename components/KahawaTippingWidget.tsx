
import React, { useState, useCallback } from 'react';
import { PRESET_TIPS, CURRENCY } from '../constants';
import { PaymentStatus } from '../types';
import { initiateStkPush } from '../services/mpesaService';
import { CoffeeIcon } from './icons/CoffeeIcon';
import { MpesaIcon } from './icons/MpesaIcon';

interface KahawaTippingWidgetProps {
  creatorId: string;
}

export const KahawaTippingWidget: React.FC<KahawaTippingWidgetProps> = ({ creatorId }) => {
  const [amount, setAmount] = useState<number | string>(PRESET_TIPS[1]);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [status, setStatus] = useState<PaymentStatus>(PaymentStatus.IDLE);
  const [message, setMessage] = useState<string>('');
  const isCustomAmountSelected = amount === 'custom';

  const handleAmountSelect = useCallback((value: number | 'custom') => {
    setStatus(PaymentStatus.IDLE);
    setMessage('');
    setAmount(value);
    if (value !== 'custom') {
      setCustomAmount('');
    }
  }, []);

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setCustomAmount(value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus(PaymentStatus.LOADING);
    setMessage('');

    const finalAmount = isCustomAmountSelected ? Number(customAmount) : Number(amount);

    try {
      const response = await initiateStkPush(finalAmount, phone, creatorId);
      setStatus(PaymentStatus.SUCCESS);
      setMessage(response.message);
    } catch (error: any) {
      setStatus(PaymentStatus.ERROR);
      setMessage(error.message || 'An unknown error occurred.');
    }
  };

  const finalAmountValue = isCustomAmountSelected ? Number(customAmount) : Number(amount);
  const isButtonDisabled = status === PaymentStatus.LOADING || finalAmountValue < 1 || phone.length < 9;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-md mx-auto transform hover:scale-[1.01] transition-transform duration-300">
      <div className="flex items-center justify-center mb-6">
        <CoffeeIcon className="w-8 h-8 text-brand-brown" />
        <h2 className="text-2xl font-bold text-brand-dark ml-3">Buy me a Kahawa</h2>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-600 mb-2">Select or Enter Amount ({CURRENCY})</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {PRESET_TIPS.map((tip) => (
              <button
                type="button"
                key={tip}
                onClick={() => handleAmountSelect(tip)}
                className={`p-3 text-center rounded-lg font-semibold transition-all duration-200 ${
                  amount === tip
                    ? 'bg-brand-brown text-white ring-2 ring-brand-dark'
                    : 'bg-gray-100 text-brand-dark hover:bg-gray-200'
                }`}
              >
                {tip}
              </button>
            ))}
            <button
                type="button"
                onClick={() => handleAmountSelect('custom')}
                className={`p-3 text-center rounded-lg font-semibold transition-all duration-200 ${
                  isCustomAmountSelected
                    ? 'bg-brand-brown text-white ring-2 ring-brand-dark'
                    : 'bg-gray-100 text-brand-dark hover:bg-gray-200'
                }`}
              >
                Custom
              </button>
          </div>

          {isCustomAmountSelected && (
            <div className="mt-4">
              <input
                type="tel"
                value={customAmount}
                onChange={handleCustomAmountChange}
                placeholder="Enter amount"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-brown focus:border-brand-brown transition"
                required
              />
            </div>
          )}
        </div>
        
        <div className="mb-6">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-600 mb-2">M-Pesa Phone Number</label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                   <span className="text-gray-500 text-sm">+254</span>
                </div>
                <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="712 345 678"
                    className="w-full pl-14 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-brown focus:border-brand-brown transition"
                    required
                />
            </div>
        </div>

        <button 
          type="submit"
          disabled={isButtonDisabled}
          className="w-full flex items-center justify-center bg-green-600 text-white font-bold py-4 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300"
        >
          {status === PaymentStatus.LOADING ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            <>
            <MpesaIcon className="w-6 h-6 mr-3" />
            Pay {finalAmountValue > 0 ? `${CURRENCY} ${finalAmountValue}` : ''} with M-Pesa
            </>
          )}
        </button>

        {message && (
          <div className={`mt-4 text-center text-sm p-3 rounded-lg ${
              status === PaymentStatus.SUCCESS ? 'bg-green-100 text-green-800' : ''
            } ${
              status === PaymentStatus.ERROR ? 'bg-red-100 text-red-800' : ''
            }`
          }>
            {message}
          </div>
        )}
      </form>
    </div>
  );
};
