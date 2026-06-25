import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Loader from '../../components/ui/Loader';
import userService from '../../services/userService';
import { User } from '../../types';
import { Plus, Edit2, Trash2, UserPlus } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'HR' as 'HR' | 'DIRECTOR' });

  const fetchUsers = async () => {
    try { const data = await userService.getAll(); setUsers(data); }
    catch { toast.error('Failed to load users'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await userService.create(form);
      toast.success('User created');
      setShowModal(false);
      setForm({ name: '', email: '', password: '', role: 'HR' });
      fetchUsers();
    } catch (err: any) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setFormLoading(false); }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUser) return;
    setFormLoading(true);
    try {
      await userService.update(editUser.id, { name: form.name, email: form.email, role: form.role as any });
      toast.success('User updated');
      setShowModal(false);
      setEditUser(null);
      fetchUsers();
    } catch (err: any) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setFormLoading(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this user?')) return;
    try { await userService.remove(id); toast.success('Deleted'); fetchUsers(); }
    catch (err: any) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const openEdit = (u: User) => {
    setEditUser(u);
    setForm({ name: u.name, email: u.email, password: '', role: u.role });
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setEditUser(null); setForm({ name: '', email: '', password: '', role: 'HR' }); };

  const roleOptions = [{ value: 'HR', label: 'HR' }, { value: 'DIRECTOR', label: 'Director' }];

  if (loading) return <DashboardLayout title="Users"><Loader /></DashboardLayout>;

  return (
    <DashboardLayout title="User Management">
      <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-50">User Accounts</h2>
          <Button onClick={() => setShowModal(true)}><UserPlus className="h-4 w-4 mr-2" /> Add User</Button>
        </div>

        <div className="overflow-x-auto rounded-xl bg-slate-800/50 backdrop-blur-xl border border-slate-700/50">
          <table className="w-full">
            <thead><tr className="border-b border-slate-700/50">
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Name</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Email</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Role</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Status</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Created</th>
              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">Actions</th>
            </tr></thead>
            <tbody className="divide-y divide-slate-700/30">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-700/20 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-slate-200">{u.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-300">{u.email}</td>
                  <td className="px-6 py-4"><Badge variant={u.role === 'SUPERADMIN' ? 'info' : u.role === 'DIRECTOR' ? 'warning' : 'default'}>{u.role}</Badge></td>
                  <td className="px-6 py-4"><Badge variant={u.isActive ? 'success' : 'danger'}>{u.isActive ? 'Active' : 'Inactive'}</Badge></td>
                  <td className="px-6 py-4 text-sm text-slate-400">{format(new Date(u.createdAt), 'MMM dd, yyyy')}</td>
                  <td className="px-6 py-4 text-right">
                    {u.role !== 'SUPERADMIN' && (
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(u)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-700 hover:text-indigo-400 transition-colors"><Edit2 className="h-4 w-4" /></button>
                        <button onClick={() => handleDelete(u.id)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-700 hover:text-rose-400 transition-colors"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Modal isOpen={showModal} onClose={closeModal} title={editUser ? 'Edit User' : 'Create User'}>
          <form onSubmit={editUser ? handleUpdate : handleCreate} className="space-y-4">
            <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            {!editUser && <Input label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />}
            <Select label="Role" options={roleOptions} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as 'HR' | 'DIRECTOR' })} />
            <div className="flex justify-end pt-2"><Button type="submit" loading={formLoading}>{editUser ? 'Update' : 'Create'} User</Button></div>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Users;
