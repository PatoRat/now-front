import { useEffect, useState } from 'react';
import { getMyFollowingIds } from '../api/event.route';

export const useFollowing = (token: string | null) => {
  const [followingIds, setFollowingIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchFollowing = async () => {
      try {
        const ids = await getMyFollowingIds(token); // ← ahora TS sabe que es string
        setFollowingIds(ids);
      } catch (error) {
        console.error('Error loading following:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowing();
  }, [token]);

  return { followingIds, loading };
};