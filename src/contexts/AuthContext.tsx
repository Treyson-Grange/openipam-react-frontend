import React, {
    createContext,
    useState,
    useContext,
    ReactNode,
    useEffect,
} from 'react';

interface User {
    /**
     * Username of the user. Usually an A number
     */
    username: string;
    /**
     * Email of the user.
     */
    email: string;
    /**
     * ID of the user.
     */
    id: number;
    /**
     * Whether the user is an admin or not.
     */
    is_ipamadmin: boolean;
    /**
     * List of groups the user belongs to.
     */
    groups: string[];
    /**
     * first name of the user.
     */
    first_name: string;
}

interface AuthContextType {
    /**
     * User object once logged in.
     */
    user: User | null;
    /**
     * @returns true if the user is an admin, false otherwise.
     */
    isAdmin: () => boolean;
    /**
     * Sets the user object.
     * @param user User object to set.
     */
    setUser: (user: User | null) => void;
    /**
     * @returns List of groups the user belongs to.
     */
    getGroups: () => string[];
    /**
     * Logs the user out.
     */
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
/**
 * AuthProvider component to wrap the application in. Provides the user object and any auth related functions.
 */
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
