import { useState, useEffect, useCallback } from 'react';
import type { Employee } from '@/types';
import employeeService, { EmployeeFilters } from '@/services/employeeService';
import { useSocket } from '@/context/SocketContext';

interface UseEmployeesReturn {
  employees: Employee[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useEmployees = (filters?: EmployeeFilters): UseEmployeesReturn => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const socket = useSocket();

  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await employeeService.getAll(filters);
      setEmployees(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  }, [filters?.search, filters?.department, filters?.status]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  useEffect(() => {
    if (!socket) return;

    const handleRefresh = () => {
      fetchEmployees();
    };

    socket.on('employee:created', handleRefresh);
    socket.on('employee:updated', handleRefresh);
    socket.on('employee:deleted', handleRefresh);

    return () => {
      socket.off('employee:created', handleRefresh);
      socket.off('employee:updated', handleRefresh);
      socket.off('employee:deleted', handleRefresh);
    };
  }, [socket, fetchEmployees]);

  return { employees, loading, error, refetch: fetchEmployees };
};
