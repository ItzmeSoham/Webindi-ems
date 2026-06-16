import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import EmployeeTable from '../../components/employees/EmployeeTable';
import EmployeeFilter from '../../components/employees/EmployeeFilter';
import EmployeeForm from '../../components/employees/EmployeeForm';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';
import { useEmployees } from '../../hooks/useEmployees';
import employeeService from '../../services/employeeService';
import { Employee } from '../../types';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';

const Employees: React.FC = () => {
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [status, setStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editEmployee, setEditEmployee] = useState<Employee | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const { employees, loading, refetch } = useEmployees({ search, department, status });

  const handleCreate = async (data: any) => {
    setFormLoading(true);
    try {
      await employeeService.create(data);
      toast.success('Employee created successfully');
      setShowModal(false);
      refetch();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create employee');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (emp: Employee) => {
    setEditEmployee(emp);
    setShowModal(true);
  };

  const handleUpdate = async (data: any) => {
    if (!editEmployee) return;
    setFormLoading(true);
    try {
      await employeeService.update(editEmployee.id, data);
      toast.success('Employee updated successfully');
      setShowModal(false);
      setEditEmployee(null);
      refetch();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update employee');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this employee?')) return;
    try {
      await employeeService.remove(id);
      toast.success('Employee deleted');
      refetch();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete employee');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditEmployee(null);
  };

  if (loading) return <DashboardLayout title="Employees"><Loader /></DashboardLayout>;

  return (
    <DashboardLayout title="Employees">
      <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-50">Employees</h2>
          <Button onClick={() => setShowModal(true)}>
            <Plus className="h-4 w-4 mr-2" /> Add Employee
          </Button>
        </div>

        <EmployeeFilter
          search={search} department={department} status={status}
          onSearchChange={setSearch} onDepartmentChange={setDepartment} onStatusChange={setStatus}
          onReset={() => { setSearch(''); setDepartment(''); setStatus(''); }}
        />

        <EmployeeTable employees={employees} onEdit={handleEdit} onDelete={handleDelete} />

        <Modal isOpen={showModal} onClose={closeModal} title={editEmployee ? 'Edit Employee' : 'Add New Employee'} size="lg">
          <EmployeeForm employee={editEmployee} onSubmit={editEmployee ? handleUpdate : handleCreate} loading={formLoading} />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Employees;
