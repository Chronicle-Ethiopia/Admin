import { useState } from 'react';
import { DataTable, Column } from '@/components/admin/DataTable';
import { mockProfiles } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Heart, MessageSquare, Users, Bell, Send } from 'lucide-react';

type Profile = typeof mockProfiles[0];

export default function UsersPage() {
  const [users, setUsers] = useState(mockProfiles);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isNotifyDialogOpen, setIsNotifyDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Profile | null>(null);
  const [viewingUser, setViewingUser] = useState<Profile | null>(null);
  const [formData, setFormData] = useState({
    full_name: '',
    age: '',
    gender: '',
    phone: '',
    bio: '',
    role: 'user',
    is_active: true,
  });
  const [notificationData, setNotificationData] = useState({
    title: '',
    message: '',
    type: 'info',
  });

  const columns: Column<Profile>[] = [
    {
      key: 'profile_image_url',
      header: 'User',
      render: (user) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.profile_image_url} />
            <AvatarFallback>{user.full_name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-foreground">{user.full_name}</p>
            <p className="text-xs text-muted-foreground">{user.bio}</p>
          </div>
        </div>
      ),
    },
    { key: 'age', header: 'Age' },
    { key: 'gender', header: 'Gender' },
    {
      key: 'role',
      header: 'Role',
      render: (user) => (
        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
          {user.role}
        </Badge>
      ),
    },
    {
      key: 'is_active',
      header: 'Status',
      render: (user) => (
        <Badge variant={user.is_active ? 'default' : 'destructive'}>
          {user.is_active ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    { key: 'login_count', header: 'Logins' },
  ];

  const handleAdd = () => {
    setEditingUser(null);
    setFormData({
      full_name: '',
      age: '',
      gender: '',
      phone: '',
      bio: '',
      role: 'user',
      is_active: true,
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (user: Profile) => {
    setEditingUser(user);
    setFormData({
      full_name: user.full_name,
      age: String(user.age),
      gender: user.gender,
      phone: user.phone || '',
      bio: user.bio || '',
      role: user.role,
      is_active: user.is_active,
    });
    setIsDialogOpen(true);
  };

  const handleView = (user: Profile) => {
    setViewingUser(user);
    setIsViewDialogOpen(true);
  };

  const handleNotify = (user: Profile) => {
    setViewingUser(user);
    setNotificationData({ title: '', message: '', type: 'info' });
    setIsNotifyDialogOpen(true);
  };

  const handleDelete = (user: Profile) => {
    setUsers(users.filter((u) => u.id !== user.id));
    toast.success('User deleted successfully');
  };

  const handleSubmit = () => {
    if (editingUser) {
      setUsers(
        users.map((u) =>
          u.id === editingUser.id
            ? { ...u, ...formData, age: Number(formData.age) }
            : u
        )
      );
      toast.success('User updated successfully');
    } else {
      const newUser: Profile = {
        id: String(Date.now()),
        ...formData,
        age: Number(formData.age),
        profile_image_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.full_name}`,
        login_count: 0,
        created_at: new Date().toISOString().split('T')[0],
      };
      setUsers([...users, newUser]);
      toast.success('User created successfully');
    }
    setIsDialogOpen(false);
  };

  const handleSendNotification = () => {
    toast.success(`Notification sent to ${viewingUser?.full_name}`);
    setIsNotifyDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Users Management</h2>
        <p className="text-muted-foreground">Manage all user accounts and profiles.</p>
      </div>

      <DataTable
        data={users}
        columns={columns}
        searchKey="full_name"
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        addLabel="Add User"
      />

      {/* Edit/Add Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingUser ? 'Edit User' : 'Add New User'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                placeholder="John Doe"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Age</Label>
                <Input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  placeholder="25"
                />
              </div>
              <div className="space-y-2">
                <Label>Gender</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => setFormData({ ...formData, gender: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Non-binary">Non-binary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1234567890"
              />
            </div>
            <div className="space-y-2">
              <Label>Bio</Label>
              <Textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Short bio..."
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="moderator">Moderator</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <Label>Active Status</Label>
              <Switch
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {editingUser ? 'Update' : 'Create'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View User Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {viewingUser && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={viewingUser.profile_image_url} />
                  <AvatarFallback className="text-2xl">{viewingUser.full_name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-bold">{viewingUser.full_name}</h3>
                  <p className="text-muted-foreground">{viewingUser.bio}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge>{viewingUser.role}</Badge>
                    <Badge variant={viewingUser.is_active ? 'default' : 'destructive'}>
                      {viewingUser.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-primary" />
                      <span className="text-sm text-muted-foreground">Posts</span>
                    </div>
                    <p className="text-2xl font-bold mt-1">12</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-destructive" />
                      <span className="text-sm text-muted-foreground">Likes</span>
                    </div>
                    <p className="text-2xl font-bold mt-1">234</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-warning" />
                      <span className="text-sm text-muted-foreground">Comments</span>
                    </div>
                    <p className="text-2xl font-bold mt-1">56</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-success" />
                      <span className="text-sm text-muted-foreground">Followers</span>
                    </div>
                    <p className="text-2xl font-bold mt-1">89</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Age:</span>
                  <span className="ml-2 font-medium">{viewingUser.age}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Gender:</span>
                  <span className="ml-2 font-medium">{viewingUser.gender}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Phone:</span>
                  <span className="ml-2 font-medium">{viewingUser.phone}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Login Count:</span>
                  <span className="ml-2 font-medium">{viewingUser.login_count}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Member Since:</span>
                  <span className="ml-2 font-medium">{viewingUser.created_at}</span>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => handleNotify(viewingUser)}>
                  <Bell className="w-4 h-4 mr-2" />
                  Send Notification
                </Button>
                <Button onClick={() => {
                  setIsViewDialogOpen(false);
                  handleEdit(viewingUser);
                }}>
                  Edit User
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Send Notification Dialog */}
      <Dialog open={isNotifyDialogOpen} onOpenChange={setIsNotifyDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Send Notification to {viewingUser?.full_name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Notification Type</Label>
              <Select
                value={notificationData.type}
                onValueChange={(value) => setNotificationData({ ...notificationData, type: value })}
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
                value={notificationData.title}
                onChange={(e) => setNotificationData({ ...notificationData, title: e.target.value })}
                placeholder="Notification title"
              />
            </div>
            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea
                value={notificationData.message}
                onChange={(e) => setNotificationData({ ...notificationData, message: e.target.value })}
                placeholder="Enter your message..."
                rows={4}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsNotifyDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendNotification}>
              <Send className="w-4 h-4 mr-2" />
              Send Notification
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
