import { DataTable, Column } from '@/components/admin/DataTable';
import { mockRoleAuditLog, mockProfiles } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';

type AuditLog = typeof mockRoleAuditLog[0];

export default function RoleAuditPage() {
  const getUserName = (id: string) => mockProfiles.find((p) => p.id === id)?.full_name || 'Unknown';

  const columns: Column<AuditLog>[] = [
    {
      key: 'user_id',
      header: 'User',
      render: (log) => getUserName(log.user_id),
    },
    {
      key: 'old_role',
      header: 'Role Change',
      render: (log) => (
        <div className="flex items-center gap-2">
          <Badge variant="outline">{log.old_role || 'none'}</Badge>
          <ArrowRight className="w-4 h-4 text-muted-foreground" />
          <Badge>{log.new_role}</Badge>
        </div>
      ),
    },
    { key: 'reason', header: 'Reason' },
    { key: 'changed_at', header: 'Date' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Role Audit Log</h2>
        <p className="text-muted-foreground">Track all role changes for users.</p>
      </div>

      <DataTable
        data={mockRoleAuditLog}
        columns={columns}
        searchKey="reason"
      />
    </div>
  );
}
