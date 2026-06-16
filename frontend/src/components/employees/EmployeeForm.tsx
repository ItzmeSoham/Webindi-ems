import React, { useState, useEffect } from 'react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { Employee } from '../../types';

interface EmployeeFormProps {
  employee?: Employee | null;
  onSubmit: (data: any) => Promise<void>;
  loading?: boolean;
}

const departments = [
  { value: 'Engineering', label: 'Engineering' },
  { value: 'Design', label: 'Design' },
  { value: 'Marketing', label: 'Marketing' },
  { value: 'HR', label: 'HR' },
  { value: 'Finance', label: 'Finance' },
  { value: 'Operations', label: 'Operations' },
  { value: 'Sales', label: 'Sales' },
];

const statusOptions = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'INACTIVE', label: 'Inactive' },
];

const EmployeeForm: React.FC<EmployeeFormProps> = ({ employee, onSubmit, loading }) => {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', department: 'Engineering', designation: '', salary: '', status: 'ACTIVE',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (employee) {
      setForm({
        name: employee.name, email: employee.email, phone: employee.phone || '',
        department: employee.department, designation: employee.designation,
        salary: String(employee.salary), status: employee.status,
      });
    }
  }, [employee]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    if (!form.designation.trim()) errs.designation = 'Designation is required';
    if (!form.salary || isNaN(Number(form.salary)) || Number(form.salary) <= 0) errs.salary = 'Valid salary required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit({ ...form, salary: Number(form.salary) });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={errors.name} required />
        <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} error={errors.email} required />
        <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <Select label="Department" options={departments} value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
        <Input label="Designation" value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} error={errors.designation} required />
        <Input label="Salary" type="number" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} error={errors.salary} required />
      </div>
      <Select label="Status" options={statusOptions} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} />
      <div className="flex justify-end pt-2">
        <Button type="submit" loading={loading}>{employee ? 'Update Employee' : 'Add Employee'}</Button>
      </div>
    </form>
  );
};

export default EmployeeForm;
