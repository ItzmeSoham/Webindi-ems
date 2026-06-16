import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import LeaveTable from '../../components/leaves/LeaveTable';
import LeaveForm from '../../components/leaves/LeaveForm';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';
import { useLeaves } from '../../hooks/useLeaves';
import { useEmployees } from '../../hooks/useEmployees';
import leaveService from '../../services/leaveService';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';

const statusTabs = ['', 'PENDING', 'APPROVED', 'REJECTED'];
const tabLabels = ['All', 'Pending', 'Approved', 'Rejected'];

const Leaves: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const { leaves, loading, refetch } = useLeaves({ status: statusFilter });
  const { employees } = useEmployees({});

  const handleCreate = async (data: any) => {
    setFormLoading(true);
    try {
      await leaveService.create(data);
      toast.success('Leave request created');
      setShowModal(false);
      refetch();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create leave');
    } finally {
      setFormLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    setActionLoading(true);
    try {
      await leaveService.updateStatus(id, 'APPROVED');
      toast.success('Leave approved');
      refetch();
    } catch { toast.error('Failed to approve'); }
    finally { setActionLoading(false); }
  };

  const handleReject = async (id: string) => {
    setActionLoading(true);
    try {
      await leaveService.updateStatus(id, 'REJECTED');
      toast.success('Leave rejected');
      refetch();
    } catch { toast.error('Failed to reject'); }
    finally { setActionLoading(false); }
  };

  if (loading) return <DashboardLayout title="Leaves"><Loader /></DashboardLayout>;

  return (
    <DashboardLayout title="Leave Management">
      <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-50">Leave Requests</h2>
          <Button onClick={() => setShowModal(true)}>
            <Plus className="h-4 w-4 mr-2" /> New Request
          </Button>
        </div>

        <div className="flex gap-1 rounded-xl bg-slate-800/30 p-1 border border-slate-700/30">
          {statusTabs.map((s, i) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${statusFilter === s ? 'bg-indigo-500 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}>
              {tabLabels[i]}
            </button>
          ))}
        </div>

        <LeaveTable leaves={leaves} onApprove={handleApprove} onReject={handleReject} loading={actionLoading} />

        <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="New Leave Request" size="lg">
          <LeaveForm employees={employees} onSubmit={handleCreate} loading={formLoading} />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Leaves;
