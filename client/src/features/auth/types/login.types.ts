export interface LoginPayload {
    email: string
    password: string
}

export interface LoginResponse {
    email: string
    id: string
    name: string
    role: 'teacher' | 'student' | 'admin'
    token: string
    groupId: string | null
}
