import { useAppData } from '../AppDataProvider';
import type { AuthRepository } from '../../domain/ports';

export function useAuth(): AuthRepository {
  const data = useAppData();
  return {
    email: data.email,
    setEmail: data.setEmail,
    isAuthenticated: data.isAuthenticated,
    signInWithPassword: data.signInWithPassword,
    signUpWithPassword: data.signUpWithPassword,
    signOut: data.signOut,
    resetPasswordForEmail: data.resetPasswordForEmail,
  };
}
