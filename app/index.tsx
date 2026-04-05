import { Redirect } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import Loading from '@/components/Loading';

export default function Index() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <Loading />;

  return user ? <Redirect href="/(tabs)" /> : <Redirect href="/login" />;
}