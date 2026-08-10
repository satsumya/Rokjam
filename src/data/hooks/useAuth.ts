import { useAppData } from '../AppDataProvider';
import type { AuthRepository } from '../../domain/ports';

export function useAuth(): AuthRepository {
  const { email, setEmail } = useAppData();
  return { email, setEmail };
}
