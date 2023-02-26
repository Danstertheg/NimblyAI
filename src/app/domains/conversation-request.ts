// Interface for a conversation request:
export interface ConversationRequest {
    _id: string;
    conversationId: string;
    invitedId: string;
    token: string;
    invitingId: string; // the host/user that send the invitation
}