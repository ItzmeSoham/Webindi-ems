import React, { useState } from 'react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { Employee } from '../../types';

interface LeaveFormProps {
  employees: Employee[];
  onSubmit: (data: { employeeId: string; reason: string; fromDate: string; toDate: string }) => Promise<void>;
  loading?: boolean;
}

const LeaveForm: React.FC<LeaveFormProps> = ({ employees, onSubmit, loading }) => {
  const [form, setForm] = useState({
    employeeId: '', reason: '', fromDate: '', toDate: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const employeeOptions = employees.map((e) => ({ value: e.id, label: e.name }));

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.employeeId) errs.employeeId = 'Employee is required';
    if (!form.reason.trim()) errs.reason = 'Reason is required';
    if (!form.fromDate) errs.fromDate = 'Start date is required';
    if (!form.toDate) errs.toDate = 'End date is required';
    if (form.fromDate && form.toDate && form.toDate < form.fromDate) errs.toDate = 'End date must be after start date';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select label="Employee" options={[{ value: '', label: 'Select Employee' }, ...employeeOptions]} value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })} error={errors.employeeId} />
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">Reason</label>
        <textarea
          value={form.reason}
          onChange={(e) => setForm({ ...form, reason: e.target.value })}
          rows={3}
          className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-slate-50 placeholder-slate-500 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="Enter reason for leave..."
        />
        {errors.reason && <p className="mt-1 text-xs text-rose-400">{errors.reason}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input label="From Date" type="date" value={form.fromDate} onChange={(e) => setForm({ ...form, fromDate: e.target.value })} error={errors.fromDate} required />
        <Input label="To Date" type="date" value={form.toDate} onChange={(e) => setForm({ ...form, toDate: e.target.value })} error={errors.toDate} required />
      </div>
      <div className="flex justify-end pt-2">
        <Button type="submit" loading={loading}>Submit Leave Request</Button>
      </div>
    </form>
  );
};

export default LeaveForm;
