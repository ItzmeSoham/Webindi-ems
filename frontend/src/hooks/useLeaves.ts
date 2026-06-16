import { useState, useEffect, useCallback } from 'react';
import type { Leave } from '@/types';
import leaveService, { LeaveFilters } from '@/services/leaveService';
import { useSocket } from '@/context/SocketContext';

interface UseLeavesReturn {
  leaves: Leave[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useLeaves = (filters?: LeaveFilters): UseLeavesReturn => {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const socket = useSocket();

  const fetchLeaves = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await leaveService.getAll(filters);
      setLeaves(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch leaves');
    } finally {
      setLoading(false);
    }
  }, [filters?.status, filters?.employeeId]);

  useEffect(() => {
    fetchLeaves();
  }, [fetchLeaves]);

  useEffect(() => {
    if (!socket) return;

    const handleRefresh = () => {
      fetchLeaves();
    };

    socket.on('leave:created', handleRefresh);
    socket.on('leave:statusChanged', handleRefresh);

    return () => {
      socket.off('leave:created', handleRefresh);
      socket.off('leave:statusChanged', handleRefresh);
    };
  }, [socket, fetchLeaves]);

  return { leaves, loading, error, refetch: fetchLeaves };
};
