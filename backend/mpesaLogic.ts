import type { StkPushResponse } from '../types';

/**
 * Validates and formats a Kenyan phone number to the 254... format.
 */
const validateAndFormatPhoneNumber = (phone: string): string | null => {
  // Supports formats like 07..., 01..., 254..., +254...
  const phoneRegex = /^(?:254|\+254|0)?((7[0-9]{8})|(1[0-9]{8}))$/;
  const match = phone.trim().match(phoneRegex);
  if (match) {
    return `254${match[1]}`;
  }
  return null;
};

// Mock request/response types to simulate a serverless environment
interface MockApiRequest {
    method: 'POST';
    body: {
        amount: number;
        phone: string;
        creatorId: string;
    };
}

interface MockApiResponse {
    status: number;
    body: StkPushResponse & { message: string };
}


/**
 * =========================================================================================
 * M-Pesa API Backend Logic
 * =========================================================================================
 *
 * This function contains the logic that SHOULD be deployed as a secure, serverless
 * backend endpoint (e.g., on Vercel, Netlify, or AWS Lambda).
 *
 * It is separated from the frontend code to enforce security and proper architecture.
 *
 * --- RESPONSIBILITIES ---
 * 1.  **Authentication/Authorization:** (Not implemented) Verify the request is legitimate.
 * 2.  **Server-Side Validation:** Sanitize and validate all incoming data (`amount`, `phone`).
 * 3.  **Secure API Calls:** Use securely stored environment variables to communicate with the
 *     Safaricom Daraja API.
 * 4.  **Transaction Logging:** (Not implemented) Record transaction attempts in a database.
 *
 * The `mpesaService.ts` on the frontend simulates calling this logic as an API.
 * =========================================================================================
 */
export const mpesaApiLogic = async (req: MockApiRequest): Promise<MockApiResponse> => {
  try {
    const { amount, phone, creatorId } = req.body;

    // --- Server-Side Validation ---
    if (!amount || !phone || !creatorId) {
        return { status: 400, body: { success: false, message: 'Missing required fields: amount, phone, or creatorId.' } };
    }
    if (typeof amount !== 'number' || amount < 1) {
        return { status: 400, body: { success: false, message: 'Amount must be a number and at least 1 KES.' } };
    }
    const formattedPhone = validateAndFormatPhoneNumber(phone);
    if (!formattedPhone) {
        return { status: 400, body: { success: false, message: 'Invalid phone number. Please use a valid Safaricom number.' } };
    }
    
    console.log(`[BACKEND LOGIC] Initiating STK Push to ${formattedPhone} for ${amount} KES for creator ${creatorId}`);

    // --- Simulation of M-Pesa API Call ---
    await new Promise(resolve => setTimeout(resolve, 2500)); // Simulate network delay
    const isSuccess = Math.random() > 0.2; // 80% chance of success

    if (isSuccess) {
      const successResponse: StkPushResponse = {
        success: true,
        message: 'STK push sent! Check your phone and enter your M-Pesa PIN.',
      };
      return { status: 200, body: successResponse };
    } else {
      const errorMessages = [
        'Could not initiate payment. The phone number seems to be offline.',
        'The request timed out. Please check your network and try again.',
        'An unknown M-Pesa error occurred. Please try again later.',
      ];
      const randomError = errorMessages[Math.floor(Math.random() * errorMessages.length)];
      return { status: 500, body: { success: false, message: randomError } };
    }

  } catch (error) {
    console.error('[BACKEND LOGIC ERROR]', error);
    return { status: 500, body: { success: false, message: 'An internal server error occurred.' } };
  }
}
