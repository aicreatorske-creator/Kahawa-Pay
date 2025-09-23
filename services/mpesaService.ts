import type { StkPushResponse } from '../types';

/**
 * =========================================================================================
 * M-Pesa API Service
 * =========================================================================================
 * 
 * This file simulates the M-Pesa STK Push functionality.
 * 
 * --- SANDBOX MODE (Current Implementation) ---
 * The `initiateStkPush` function currently runs in sandbox mode. It does not make a real
 * API call. Instead, it validates the phone number and simulates a network delay before 
 * returning a mock success or error response. This is useful for UI development and testing.
 * 
 * --- PRODUCTION MODE (How to Implement) ---
 * To switch to production, you would replace the simulated logic inside `initiateStkPush`
 * with a real API call to your backend endpoint (e.g., `/api/mpesa`).
 * 
 * Your backend endpoint would be responsible for:
 * 1.  Storing your Safaricom Daraja API Consumer Key and Secret securely as environment variables.
 *     - `MPESA_CONSUMER_KEY=your_key_here`
 *     - `MPESA_CONSUMER_SECRET=your_secret_here`
 * 2.  Generating an OAuth token from the Daraja API.
 * 3.  Making the M-Pesa Express (STK Push) request to Safaricom's API.
 * 4.  Handling the response from Safaricom and forwarding a simplified success/error message
 *     to the frontend.
 * 
 * Example `fetch` call to your backend:
 * 
 * ```javascript
 * try {
 *   const response = await fetch('/api/mpesa', {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify({
 *       amount: amount,
 *       phone: formattedPhone,
 *       creatorId: creatorId, 
 *     }),
 *   });
 * 
 *   if (!response.ok) {
 *     const errorData = await response.json();
 *     throw new Error(errorData.message || 'Payment initiation failed.');
 *   }
 * 
 *   const successData = await response.json();
 *   return { success: true, message: successData.message };
 * 
 * } catch (error) {
 *   return { success: false, message: error.message };
 * }
 * ```
 * 
 * --- SUPPORTING OTHER PAYMENT METHODS (PayPal, Stripe) ---
 * To add more payment methods, you could create a generic payment service.
 * 1. Create similar service files: `paypalService.ts`, `stripeService.ts`.
 * 2. In the `KahawaTippingWidget`, add UI elements (e.g., tabs, buttons) to select a payment method.
 * 3. Based on the selected method, call the corresponding service function.
 * 
 * =========================================================================================
 */


/**
 * Validates and formats a Kenyan phone number to the 254... format.
 * @param phone The phone number string to validate.
 * @returns The formatted phone number or null if invalid.
 */
const validateAndFormatPhoneNumber = (phone: string): string | null => {
  // Supports formats like 07... and 01...
  const phoneRegex = /^(?:254|\+254|0)?((7[0-9]{8})|(1[0-9]{8}))$/;
  const match = phone.trim().match(phoneRegex);
  
  if (match) {
    return `254${match[1]}`;
  }
  
  return null;
};

/**
 * Simulates initiating an M-Pesa STK Push request.
 * @param amount The amount to be paid.
 * @param phone The user's M-Pesa phone number.
 * @param creatorId The ID of the creator receiving the tip.
 * @returns A promise that resolves with a success or error message.
 */
export const initiateStkPush = (
  amount: number,
  phone: string,
  creatorId: string // Used to identify the recipient in a real backend
): Promise<StkPushResponse> => {
  return new Promise((resolve, reject) => {
    const formattedPhone = validateAndFormatPhoneNumber(phone);

    if (!formattedPhone) {
      reject({ success: false, message: 'Invalid phone number. Please provide a valid Safaricom number (e.g. 07... or 01...).' });
      return;
    }
    
    if(amount < 1) {
        reject({ success: false, message: 'Amount must be at least 1 KES.' });
        return;
    }

    console.log(`Simulating STK Push to ${formattedPhone} for ${amount} KES for creator ${creatorId}`);

    // Simulate network delay of 2-3 seconds
    setTimeout(() => {
      // Simulate a random success/failure for demonstration
      const isSuccess = Math.random() > 0.2; // 80% chance of success

      if (isSuccess) {
        resolve({
          success: true,
          message: 'STK push sent! Please check your phone and enter your M-Pesa PIN to complete the payment.',
        });
      } else {
        const errorMessages = [
          'Could not initiate payment. The phone number seems to be offline.',
          'The request timed out. Please check your network connection and try again.',
          'An unknown M-Pesa error occurred. Please try again later.',
          'The M-Pesa system is currently busy. Please wait a moment and try again.'
        ];
        const randomError = errorMessages[Math.floor(Math.random() * errorMessages.length)];
        reject({
          success: false,
          message: randomError,
        });
      }
    }, 2500);
  });
};
