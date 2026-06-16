import React, { useState } from 'react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { Employee } from '../../types';

interface AttendanceFormProps {
  employees: Employee[];
  onSubmit: (data: { employeeId: string; date: string; status: string }) => Promise<void>;
  loading?: boolean;
}

const statusOptions = [
  { value: 'PRESENT', label: 'Present' },
  { value: 'ABSENT', label: 'Absent' },
  { value: 'LATE', label: 'Late' },
];

const AttendanceForm: React.FC<AttendanceFormProps> = ({ employees, onSubmit, loading }) => {
  const [form, setForm] = useState({
    employeeId: '', date: new Date().toISOString().split('T')[0], status: 'PRESENT',
  });

  const employeeOptions = employees.map((e) => ({ value: e.id, label: e.name }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.employeeId) return;
    await onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select label="Employee" options={[{ value: '', label: 'Select Employee' }, ...employeeOptions]} value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })} required />
      <Input label="Date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
      <Select label="Status" options={statusOptions} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} />
      <div className="flex justify-end pt-2">
        <Button type="submit" loading={loading} disabled={!form.employeeId}>Mark Attendance</Button>
      </div>
    </form>
  );
};

export default AttendanceForm;
