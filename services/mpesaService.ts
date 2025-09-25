import type { StkPushResponse } from '../types';
import { mpesaApiLogic } from '../backend/mpesaLogic';

/**
 * =========================================================================================
 * M-Pesa API Service (Frontend)
 * =========================================================================================
 *
 * This file is responsible for communicating with our secure serverless backend endpoint
 * to initiate M-Pesa payments.
 *
 * --- SECURITY REFACTOR & SIMULATION ---
 * The core payment logic has been moved to `backend/mpesaLogic.ts`. In a real-world
 * deployment, that file's logic would be hosted on a secure, serverless endpoint (e.g.,
 * at `/api/mpesa`).
 *
 * To keep this MVP runnable without a live backend, this service *simulates* the `fetch`
 * call to that endpoint. It directly calls the exported `mpesaApiLogic` function, which
 * mimics the behavior of the serverless function.
 *
 * This architecture correctly separates frontend and backend concerns and demonstrates
 * the secure, production-ready approach.
 *
 * =========================================================================================
 */


/**
 * Initiates an M-Pesa STK Push request by calling our backend endpoint.
 * @param amount The amount to be paid.
 * @param phone The user's M-Pesa phone number (digits only, e.g., '712345678').
 * @param creatorId The ID of the creator receiving the tip.
 * @returns A promise that resolves with a success or error message from the backend.
 */
export const initiateStkPush = async (
  amount: number,
  phone: string,
  creatorId: string
): Promise<StkPushResponse> => {

  // --- PRODUCTION CODE ---
  // In a real application, you would uncomment this block and remove the simulation block.
  /*
  try {
    const response = await fetch('/api/mpesa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, phone, creatorId }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || 'An unexpected error occurred.');
    }
    return responseData;

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'A network error occurred.';
    throw { success: false, message: errorMessage };
  }
  */

  // --- SIMULATION BLOCK ---
  // This block simulates the API call to the backend for demonstration purposes.
  // It calls the logic from `backend/mpesaLogic.ts` directly.
  console.log("Simulating fetch to /api/mpesa with body:", { amount, phone, creatorId });
  try {
    const mockRequest = {
        method: 'POST' as const, // Use "as const" for stricter typing
        body: { amount, phone, creatorId },
    };
    // Directly call the backend logic to get a simulated response
    const mockResponse = await mpesaApiLogic(mockRequest);

    if(mockResponse.status >= 400) {
        // Use the message from the simulated backend response body
        throw new Error(mockResponse.body.message);
    }
    return mockResponse.body;

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown simulation error occurred.';
    // Propagate the error in the format expected by the UI component
    throw { success: false, message: errorMessage };
  }
};
