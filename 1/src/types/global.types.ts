import type { CSSProperties } from 'react'

export type Styles = Record<string, CSSProperties> | ((value?: any) => Record<string, CSSProperties>)

export interface OnlineStatusResponse {
    userId: number
    data: {
        isOnline: boolean | null
        lastSeen: string
    }
}

export interface TypingMessageResponse {
    senderId: number
    senderName: string
    chatId: number
}
