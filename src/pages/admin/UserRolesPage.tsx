import { useState } from 'react';
import { DataTable, Column } from '@/components/admin/DataTable';
import { mockUserRoles, mockProfiles, mockRoles } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

type UserRole = typeof mockUserRoles[0];

export default function UserRolesPage() {
  const [userRoles, setUserRoles] = useState(mockUserRoles);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUserRole, setEditingUserRole] = useState<UserRole | null>(null);
  const [formData, setFormData] = useState({
    user_id: '',
    role_id: '',
    is_active: true,
  });

  const getUserName = (id: string) => mockProfiles.find((p) => p.id === id)?.full_name || 'Unknown';
  const getRoleName = (id: string) => mockRoles.find((r) => r.id === id)?.display_name || 'Unknown';

  const columns: Column<UserRole>[] = [
    {
      key: 'user_id',
      header: 'User',
      render: (ur) => getUserName(ur.user_id),
    },
    {
      key: 'role_id',
      header: 'Role',
      render: (ur) => <Badge>{getRoleName(ur.role_id)}</Badge>,
    },
    { key: 'assigned_at', header: 'Assigned At' },
    {
      key: 'is_active',
      header: 'Status',
      render: (ur) => (
        <Badge variant={ur.is_active ? 'default' : 'secondary'}>
          {ur.is_active ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingUserRole(null);
    setFormData({ user_id: '', role_id: '', is_active: true });
    setIsDialogOpen(true);
  };

  const handleEdit = (userRole: UserRole) => {
    setEditingUserRole(userRole);
    setFormData({
      user_id: userRole.user_id,
      role_id: userRole.role_id,
      is_active: userRole.is_active,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (userRole: UserRole) => {
    setUserRoles(userRoles.filter((ur) => ur.id !== userRole.id));
    toast.success('User role assignment removed');
  };

  const handleSubmit = () => {
    if (editingUserRole) {
      setUserRoles(
        userRoles.map((ur) =>
          ur.id === editingUserRole.id ? { ...ur, ...formData } : ur
        )
      );
      toast.success('User role updated');
    } else {
      const newUserRole: UserRole = {
        id: String(Date.now()),
        ...formData,
        assigned_at: new Date().toISOString().split('T')[0],
      };
      setUserRoles([...userRoles, newUserRole]);
      toast.success('Role assigned successfully');
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">User Roles</h2>
        <p className="text-muted-foreground">Manage role assignments for users.</p>
      </div>

      <DataTable
        data={userRoles}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        addLabel="Assign Role"
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingUserRole ? 'Edit Assignment' : 'Assign Role'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>User</Label>
              <Select
                value={formData.user_id}
                onValueChange={(value) => setFormData({ ...formData, user_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select user" />
                </SelectTrigger>
                <SelectContent>
                  {mockProfiles.map((profile) => (
                    <SelectItem key={profile.id} value={profile.id}>
                      {profile.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select
                value={formData.role_id}
                onValueChange={(value) => setFormData({ ...formData, role_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {mockRoles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.display_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <Label>Active</Label>
              <Switch
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>{editingUserRole ? 'Update' : 'Assign'}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
