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
  const [phoneError, setPhoneError] = useState<string>('');
  const [status, setStatus] = useState<PaymentStatus>(PaymentStatus.IDLE);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isConfirming, setIsConfirming] = useState<boolean>(false);
  const isCustomAmountSelected = amount === 'custom';

  const handleAmountSelect = useCallback((value: number | 'custom') => {
    setStatus(PaymentStatus.IDLE);
    setSuccessMessage('');
    setErrorMessage('');
    setAmount(value);
    if (value !== 'custom') {
      setCustomAmount('');
    }
  }, []);

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setCustomAmount(value);
    setStatus(PaymentStatus.IDLE);
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (phoneError) setPhoneError('');
    setPhone(e.target.value.replace(/[^0-9]/g, ''));
    setStatus(PaymentStatus.IDLE);
    setSuccessMessage('');
    setErrorMessage('');
  }

  const validatePhone = (number: string): boolean => {
    // Validates the 9 digits entered by the user (e.g., 712345678 or 112345678)
    const kenyanPhoneRegex = /^((7[0-9]{8})|(1[0-9]{8}))$/;
    return kenyanPhoneRegex.test(number);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isButtonDisabled) return;

    setSuccessMessage('');
    setErrorMessage('');

    if (!validatePhone(phone)) {
        setPhoneError('Please enter a valid Safaricom number (e.g. 712345678).');
        return;
    }
    setPhoneError('');
    setIsConfirming(true);
  };

  const handleConfirmPayment = async () => {
    setIsConfirming(false);
    setStatus(PaymentStatus.LOADING);
    setErrorMessage('');
    setSuccessMessage('');

    const finalAmount = isCustomAmountSelected ? Number(customAmount) : Number(amount);

    try {
      const response = await initiateStkPush(finalAmount, phone, creatorId);
      setStatus(PaymentStatus.SUCCESS);
      setSuccessMessage(response.message);
      // Reset form on success for a better user experience
      setPhone('');
      setCustomAmount('');
      setAmount(PRESET_TIPS[1]);
    } catch (error: any) {
      setStatus(PaymentStatus.ERROR);
      const friendlyMessage = error.message || 'An unknown error occurred.';
      setErrorMessage(friendlyMessage);
      
      // If the error message from the backend is about the phone, highlight the field
      if(friendlyMessage.toLowerCase().includes('phone')){
        setPhoneError(friendlyMessage);
      }
    }
  };

  const handleCancel = () => {
    setIsConfirming(false);
  };

  const finalAmountValue = isCustomAmountSelected ? Number(customAmount) : Number(amount);
  const isButtonDisabled = status === PaymentStatus.LOADING || finalAmountValue < 1 || phone.length < 9;

  return (
    <>
      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-md mx-auto transform hover:scale-[1.01] transition-transform duration-300">
        <div className="flex items-center justify-center mb-6">
          <CoffeeIcon className="w-8 h-8 text-brand-brown" />
          <h2 className="text-2xl font-bold text-brand-dark ml-3">Buy me a Kahawa</h2>
        </div>
        
        <form onSubmit={handleSubmit} noValidate>
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
                  aria-label="Custom amount"
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
                      onChange={handlePhoneChange}
                      placeholder="712 345 678"
                      className={`w-full pl-14 pr-4 py-3 rounded-lg border transition ${
                        phoneError 
                        ? 'border-red-500 ring-1 ring-red-500 focus:border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-2 focus:ring-brand-brown focus:border-brand-brown'
                      }`}
                      required
                      maxLength={9}
                      aria-invalid={!!phoneError}
                      aria-describedby="phone-helper-text phone-error-text"
                  />
              </div>
              <p id="phone-helper-text" className="mt-2 text-xs text-gray-500">
                Enter your Safaricom number without the leading zero.
              </p>
              {phoneError && (
                <p id="phone-error-text" className="mt-2 text-xs text-red-600" role="alert">
                    {phoneError}
                </p>
              )}
          </div>

          <button 
            type="submit"
            disabled={isButtonDisabled}
            className="w-full flex items-center justify-center bg-green-600 text-white font-bold py-4 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300"
            aria-live="polite"
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
          
          {successMessage && (
            <div className="mt-4 text-center text-sm p-3 rounded-lg bg-green-100 text-green-800" role="status">
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="mt-4 text-center text-sm p-3 rounded-lg bg-red-100 text-red-800" role="alert">
              {errorMessage}
            </div>
          )}
        </form>
      </div>

      {isConfirming && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 transition-opacity duration-300"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirmation-dialog-title"
        >
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-sm transform transition-all duration-300 scale-100">
            <h3 id="confirmation-dialog-title" className="text-xl font-bold text-brand-dark mb-4 text-center">Confirm Details</h3>
            <div className="space-y-4 text-center">
                <div>
                    <p className="text-sm text-gray-500">You are about to send</p>
                    <p className="text-3xl font-bold text-brand-dark tracking-tight">{CURRENCY} {finalAmountValue}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">to the M-Pesa number</p>
                    <p className="text-lg font-semibold text-brand-dark">+254 {phone}</p>
                </div>
            </div>
            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={handleCancel}
                className="px-6 py-3 rounded-lg bg-gray-200 text-gray-800 font-bold hover:bg-gray-300 transition-colors w-1/2"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPayment}
                className="px-6 py-3 rounded-lg bg-green-600 text-white font-bold hover:bg-green-700 transition-colors w-1/2"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};