import { useState, useEffect, useCallback } from 'react';
import type { DashboardStats } from '@/types';
import analyticsService from '@/services/analyticsService';
import { useSocket } from '@/context/SocketContext';

interface UseAnalyticsReturn {
  stats: DashboardStats | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useAnalytics = (): UseAnalyticsReturn => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const socket = useSocket();

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await analyticsService.getDashboard();
      setStats(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    if (!socket) return;

    const handleRefresh = () => {
      fetchStats();
    };

    socket.on('dashboard:refresh', handleRefresh);

    return () => {
      socket.off('dashboard:refresh', handleRefresh);
    };
  }, [socket, fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
};
