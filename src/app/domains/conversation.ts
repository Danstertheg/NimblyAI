// Conversation interface (should mirror DB implementation)
export interface Conversation {
    _id: string;
    userIds: string[];
}