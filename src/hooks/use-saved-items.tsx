
import { useMemo } from 'react';
import { useAuth, User } from '@/hooks/use-auth';

type ListType = keyof Pick<User, 'savedEvents' | 'joinedCommunities' | 'savedDeals' | 'savedMovies' | 'savedBusinesses'>;

export function useSavedItems<T extends { id: string | number }>(items: T[], listType: ListType): T[] {
  const { isItemSaved } = useAuth();
  return useMemo(() => {
    if (!items) return [];
    return items.filter(item => isItemSaved(listType, String(item.id)));
  }, [items, listType, isItemSaved]);
}
