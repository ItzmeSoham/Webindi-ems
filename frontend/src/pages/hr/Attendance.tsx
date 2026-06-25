import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import AttendanceTable from '../../components/attendance/AttendanceTable';
import AttendanceForm from '../../components/attendance/AttendanceForm';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Loader from '../../components/ui/Loader';
import { useAttendance } from '../../hooks/useAttendance';
import { useEmployees } from '../../hooks/useEmployees';
import attendanceService from '../../services/attendanceService';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';

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

const Attendance: React.FC = () => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [department, setDepartment] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const { attendance: records, loading, refetch } = useAttendance({ date, department });
  const { employees } = useEmployees({});

  const handleMark = async (data: { employeeId: string; date: string; status: 'PRESENT' | 'ABSENT' | 'LATE' }) => {
    setFormLoading(true);
    try {
      await attendanceService.mark(data);
      toast.success('Attendance marked');
      setShowModal(false);
      refetch();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to mark attendance');
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) return <DashboardLayout title="Attendance"><Loader /></DashboardLayout>;

  return (
    <DashboardLayout title="Attendance">
      <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-50">Attendance</h2>
          <Button onClick={() => setShowModal(true)}>
            <Plus className="h-4 w-4 mr-2" /> Mark Attendance
          </Button>
        </div>

        <div className="flex flex-wrap gap-4 rounded-xl bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-4">
          <div className="w-48">
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="w-48">
            <Select options={departments} value={department} onChange={(e) => setDepartment(e.target.value)} />
          </div>
        </div>

        <AttendanceTable records={records} />

        <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Mark Attendance">
          <AttendanceForm employees={employees} onSubmit={handleMark} loading={formLoading} />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Attendance;
