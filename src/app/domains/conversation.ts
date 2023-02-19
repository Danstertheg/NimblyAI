// Conversation interface (should mirror DB implementation)
export interface Conversation {
    conversationId: string;
    userIds: string[];
}