// Interface for a conversation request:
export interface ConversationRequest {
    _id: string;
    conversationId: string;
    invitedId: string;

    invitingId: string; // the host/user that send the invitation
}