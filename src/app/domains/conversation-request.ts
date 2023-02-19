// Interface for a conversation request:
export interface ConversationRequest {
    conversationId: string;
    invitedId: string;

    invitingId: string; // the host/user that send the invitation
}