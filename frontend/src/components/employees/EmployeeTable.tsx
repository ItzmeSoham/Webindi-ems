import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Employee } from '../../types';
import Badge from '../ui/Badge';
import { Edit2, Trash2, User } from 'lucide-react';

interface EmployeeTableProps {
  employees: Employee[];
  onEdit?: (employee: Employee) => void;
  onDelete?: (id: string) => void;
  basePath?: string;
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({ employees, onEdit, onDelete, basePath = '/hr' }) => {
  const navigate = useNavigate();

  if (!employees.length) {
    return (
      <div className="rounded-xl bg-slate-800/50 border border-slate-700/50 p-12 text-center">
        <User className="mx-auto h-12 w-12 text-slate-600" />
        <p className="mt-4 text-slate-400">No employees found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl bg-slate-800/50 backdrop-blur-xl border border-slate-700/50">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-700/50">
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Employee</th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Department</th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Designation</th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Salary</th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Status</th>
            <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700/30">
          {employees.map((emp) => (
            <tr
              key={emp.id}
              onClick={() => navigate(`${basePath}/employees/${emp.id}`)}
              className="cursor-pointer transition-colors duration-200 hover:bg-slate-700/20"
            >
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-indigo-500 to-purple-500">
                    {emp.avatarUrl ? (
                      <img src={emp.avatarUrl} alt={emp.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-sm font-bold text-white">
                        {emp.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-slate-50">{emp.name}</p>
                    <p className="text-sm text-slate-400">{emp.email}</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-slate-300">{emp.department}</td>
              <td className="px-6 py-4 text-sm text-slate-300">{emp.designation}</td>
              <td className="px-6 py-4 text-sm font-medium text-slate-200">₹{emp.salary.toLocaleString()}</td>
              <td className="px-6 py-4">
                <Badge variant={emp.status === 'ACTIVE' ? 'success' : 'danger'}>
                  {emp.status}
                </Badge>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                  {onEdit && (
                    <button onClick={() => onEdit(emp)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-700 hover:text-indigo-400 transition-colors">
                      <Edit2 className="h-4 w-4" />
                    </button>
                  )}
                  {onDelete && (
                    <button onClick={() => onDelete(emp.id)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-700 hover:text-rose-400 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeTable;
