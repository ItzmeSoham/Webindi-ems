import { useState, useEffect, useCallback } from 'react';
import type { Attendance } from '@/types';
import attendanceService, { AttendanceFilters } from '@/services/attendanceService';
import { useSocket } from '@/context/SocketContext';

interface UseAttendanceReturn {
  attendance: Attendance[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useAttendance = (filters?: AttendanceFilters): UseAttendanceReturn => {
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const socket = useSocket();

  const fetchAttendance = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await attendanceService.getAll(filters);
      setAttendance(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch attendance');
    } finally {
      setLoading(false);
    }
  }, [filters?.date, filters?.department, filters?.employeeId]);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  useEffect(() => {
    if (!socket) return;

    const handleRefresh = () => {
      fetchAttendance();
    };

    socket.on('attendance:marked', handleRefresh);

    return () => {
      socket.off('attendance:marked', handleRefresh);
    };
  }, [socket, fetchAttendance]);

  return { attendance, loading, error, refetch: fetchAttendance };
};
