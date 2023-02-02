export interface AuthUser {
    id: string;
    email: string;
    username: string;
    bio: string;
    role: 'ADMIN' | 'USER';
};

export interface UserResponse {
    jwt: string;
    user: AuthUser;
};
