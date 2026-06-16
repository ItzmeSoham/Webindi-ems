import React from 'react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { Search, RotateCcw } from 'lucide-react';

interface EmployeeFilterProps {
  search: string;
  department: string;
  status: string;
  onSearchChange: (val: string) => void;
  onDepartmentChange: (val: string) => void;
  onStatusChange: (val: string) => void;
  onReset: () => void;
}

const departments = [
  { value: '', label: 'All Departments' },
  { value: 'Engineering', label: 'Engineering' },
  { value: 'Design', label: 'Design' },
  { value: 'Marketing', label: 'Marketing' },
  { value: 'HR', label: 'HR' },
  { value: 'Finance', label: 'Finance' },
  { value: 'Operations', label: 'Operations' },
  { value: 'Sales', label: 'Sales' },
];

const statuses = [
  { value: '', label: 'All Statuses' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'INACTIVE', label: 'Inactive' },
];

const EmployeeFilter: React.FC<EmployeeFilterProps> = ({
  search, department, status, onSearchChange, onDepartmentChange, onStatusChange, onReset,
}) => {
  return (
    <div className="flex flex-wrap items-end gap-4 rounded-xl bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-4">
      <div className="flex-1 min-w-[200px]">
        <Input
          placeholder="Search employees..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          icon={<Search className="h-4 w-4" />}
        />
      </div>
      <div className="w-48">
        <Select options={departments} value={department} onChange={(e) => onDepartmentChange(e.target.value)} />
      </div>
      <div className="w-40">
        <Select options={statuses} value={status} onChange={(e) => onStatusChange(e.target.value)} />
      </div>
      <Button variant="ghost" onClick={onReset} size="md">
        <RotateCcw className="h-4 w-4 mr-1" /> Reset
      </Button>
    </div>
  );
};

export default EmployeeFilter;
