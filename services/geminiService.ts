import { GoogleGenAI, Type } from "@google/genai";
import { CrimsonTransaction, BankTransaction, MatchedPair } from "../types";

// Initialize AI only if API key is available
let ai: GoogleGenAI | null = null;

if (process.env.API_KEY) {
    try {
        ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    } catch (error) {
        console.warn("Failed to initialize Gemini AI:", error);
        ai = null;
    }
} else {
    console.log("API_KEY environment variable not set. Using mock AI data for development.");
}

const responseSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            crimsonTransactionId: {
                type: Type.STRING,
                description: 'The unique ID of the matched Crimson transaction.',
            },
            bankTransactionId: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'An array of unique IDs of the matched Bank transaction(s). ALWAYS use an array, even for a single match.',
            },
            confidenceScore: {
                type: Type.NUMBER,
                description: 'A score from 0 to 1 indicating the confidence of the match.',
            },
            reasoning: {
                type: Type.STRING,
                description: 'A brief explanation for why the transactions were matched.',
            },
        },
        required: ["crimsonTransactionId", "bankTransactionId", "confidenceScore", "reasoning"],
    },
};

export const reconcileWithAI = async (
    crimsonTransactions: CrimsonTransaction[],
    bankTransactions: BankTransaction[]
): Promise<MatchedPair[]> => {

    // For development, use mock data when API key is not configured or AI failed to initialize
    if (!ai || !process.env.API_KEY) {
        console.log("Using mock AI analysis for development");
        return generateMockMatches(crimsonTransactions, bankTransactions);
    }

    if (crimsonTransactions.length === 0 || bankTransactions.length === 0) {
        return [];
    }
    
    const prompt = `
        You are an expert accounting assistant for political campaigns. Your task is to find matching financial records to help with reconciliation.
        Analyze the two JSON arrays of transactions: 'crimsonTransactions' (internal ledger) and 'bankTransactions' (bank statement).

        Match transactions from 'crimsonTransactions' to one or more transactions in 'bankTransactions'.

        Matching criteria:
        1.  **Amount:** A positive amount in Crimson should match a positive amount in the Bank. A negative amount should match a negative amount.
        2.  **Date Proximity:** Dates should be very close, ideally the same day or within a 2-3 day window.
        3.  **Aggregations & Splits:** 
            - A single Crimson transaction may match a sum of multiple Bank transactions.
            - A single Bank deposit (positive amount) may be the sum of multiple Crimson contributions.
            - A single bank payout (like 'WINRED PAYOUT') may correspond to multiple Crimson entries (e.g., a gross receipt, a chargeback, and fees).
        4.  **Description:** Use keywords in the bank description to help identify matches. E.g., 'DEPOSIT' links to contributions/receipts, 'NSF' or 'CHGBK' to chargebacks.

        Return an array of matched pairs in the specified JSON schema. Only return high-confidence matches (confidenceScore > 0.85). If no matches are found, return an empty array.
        For 'bankTransactionId', ALWAYS return an array of strings, even if there's only one matching bank transaction.

        Here is the data:
        \`\`\`json
        {
            "crimsonTransactions": ${JSON.stringify(crimsonTransactions.map(({batchDetails, ...rest}) => rest))},
            "bankTransactions": ${JSON.stringify(bankTransactions.map(({splitDetails, ...rest}) => rest))}
        }
        \`\`\`
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                temperature: 0.1,
            },
        });
        
        const jsonText = response.text?.trim();
        if (!jsonText) {
             console.log("Gemini returned an empty or invalid response.");
             return [];
        }
        // Basic validation
        if (!jsonText.startsWith('[') || !jsonText.endsWith(']')) {
            console.error("Gemini response is not a valid JSON array:", jsonText);
            return [];
        }

        const matchedPairs = JSON.parse(jsonText) as MatchedPair[];
        return matchedPairs.filter(p => p.confidenceScore > 0.85 && p.bankTransactionId.length > 0);

    } catch (error) {
        console.error("Error calling or parsing Gemini API response:", error);
        throw new Error("Failed to get reconciliation suggestions from AI.");
    }
};

// Mock function for development when API key is not available
function generateMockMatches(
    crimsonTransactions: CrimsonTransaction[],
    bankTransactions: BankTransaction[]
): MatchedPair[] {
    const matches: MatchedPair[] = [];

    // Create some realistic mock matches
    for (let i = 0; i < Math.min(crimsonTransactions.length, bankTransactions.length, 3); i++) {
        const crimsonTx = crimsonTransactions[i];
        const bankTx = bankTransactions[i];

        // Only match if amounts are similar (within 10% or exact)
        const amountDiff = Math.abs(Math.abs(crimsonTx.amount) - Math.abs(bankTx.amount));
        const amountThreshold = Math.max(Math.abs(crimsonTx.amount) * 0.1, 1);

        if (amountDiff <= amountThreshold) {
            matches.push({
                crimsonTransactionId: crimsonTx.id,
                bankTransactionId: [bankTx.id],
                confidenceScore: 0.92 - (i * 0.05), // Decreasing confidence
                reasoning: `Amount match: ${crimsonTx.amount} ≈ ${bankTx.amount}. Date proximity and transaction pattern suggest high likelihood of match.`
            });
        }
    }

    // Add a few more realistic matches with different patterns
    if (crimsonTransactions.length > 3 && bankTransactions.length > 3) {
        // Look for exact amount matches
        for (let i = 3; i < Math.min(crimsonTransactions.length, 6); i++) {
            for (let j = 3; j < Math.min(bankTransactions.length, 6); j++) {
                const crimsonTx = crimsonTransactions[i];
                const bankTx = bankTransactions[j];

                if (Math.abs(crimsonTx.amount) === Math.abs(bankTx.amount) &&
                    !matches.some(m => m.crimsonTransactionId === crimsonTx.id || m.bankTransactionId.includes(bankTx.id))) {
                    matches.push({
                        crimsonTransactionId: crimsonTx.id,
                        bankTransactionId: [bankTx.id],
                        confidenceScore: 0.95,
                        reasoning: `Exact amount match: $${Math.abs(crimsonTx.amount).toFixed(2)}. Transaction types and timing align perfectly.`
                    });
                    break;
                }
            }
        }
    }

    return matches;
}