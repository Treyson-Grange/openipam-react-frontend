import React, {
    createContext,
    useState,
    useContext,
    ReactNode,
    useEffect,
} from 'react';

interface User {
    username: string;
    email: string;
    id: number;
    is_ipamadmin: boolean;
    groups: string[];
    first_name: string;
}

interface AuthContextType {
    user: User | null;
    isAdmin: () => boolean;
    setUser: (user: User | null) => void;
    getGroups: () => string[];
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [user, setUser] = useState<User | null>(null);
    const isAdmin = () => user?.is_ipamadmin ?? false;
    const getGroups = () => user?.groups ?? [];
    const logout = () => setUser(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    return (
        <AuthContext.Provider
            value={{ user, isAdmin, setUser, getGroups, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
};
