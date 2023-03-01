// Message interface to use in chatlogs (SHOULD MIRROR DB IMPLEMENTATION):
export interface Message {
    conversationId: string;
    senderId: string; // Email is ID
    timestamp: string;
    text: string;
    messageStatus:string;
    aiAnswer?: string; // OPTIONAL, only set if it was a question for AI
}