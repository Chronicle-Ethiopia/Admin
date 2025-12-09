import { useState } from 'react';
import { DataTable, Column } from '@/components/admin/DataTable';
import { mockNotifications, mockProfiles } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Send } from 'lucide-react';

type Notification = typeof mockNotifications[0];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    user_id: '',
    type: 'info',
    title: '',
    message: '',
  });

  const getUserName = (id: string) => mockProfiles.find((p) => p.id === id)?.full_name || 'Unknown';

  const columns: Column<Notification>[] = [
    { key: 'title', header: 'Title' },
    {
      key: 'user_id',
      header: 'Recipient',
      render: (n) => getUserName(n.user_id),
    },
    {
      key: 'type',
      header: 'Type',
      render: (n) => <Badge variant="secondary">{n.type}</Badge>,
    },
    {
      key: 'read',
      header: 'Status',
      render: (n) => (
        <Badge variant={n.read ? 'outline' : 'default'}>
          {n.read ? 'Read' : 'Unread'}
        </Badge>
      ),
    },
    { key: 'created_at', header: 'Date' },
  ];

  const handleAdd = () => {
    setFormData({ user_id: '', type: 'info', title: '', message: '' });
    setIsDialogOpen(true);
  };

  const handleDelete = (notification: Notification) => {
    setNotifications(notifications.filter((n) => n.id !== notification.id));
    toast.success('Notification deleted');
  };

  const handleSubmit = () => {
    const newNotification: Notification = {
      id: String(Date.now()),
      ...formData,
      read: false,
      created_at: new Date().toISOString().split('T')[0],
    };
    setNotifications([newNotification, ...notifications]);
    toast.success('Notification sent successfully');
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Notifications</h2>
        <p className="text-muted-foreground">Send and manage user notifications.</p>
      </div>

      <DataTable
        data={notifications}
        columns={columns}
        searchKey="title"
        onAdd={handleAdd}
        onDelete={handleDelete}
        addLabel="Send Notification"
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Send Notification</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Recipient</Label>
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
              <Label>Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="alert">Alert</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Notification title"
              />
            </div>
            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Notification message..."
                rows={4}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>
              <Send className="w-4 h-4 mr-2" />
              Send
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
