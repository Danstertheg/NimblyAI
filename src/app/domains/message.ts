// Message interface to use in chatlogs (SHOULD MIRROR DB IMPLEMENTATION):
export interface Message {
    senderEmail: string; // Email is ID
    timestamp: string;
    text: string;

    aiAnswer?: string; // OPTIONAL, only set if it was a question for AI
}