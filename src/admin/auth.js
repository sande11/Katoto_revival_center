import { createContext, useContext } from 'react';

/**
 * { status, user, signOut } where status is
 * 'loading' | 'signed-out' | 'admin' | 'not-admin' (signed in but not listed in public.admins).
 */
export const AdminAuthContext = createContext(null);

export const useAdminAuth = () => useContext(AdminAuthContext);
