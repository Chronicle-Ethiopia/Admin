import { useState } from 'react';
import { DataTable, Column } from '@/components/admin/DataTable';
import { mockFollowers, mockProfiles } from '@/data/mockData';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';

type Follower = typeof mockFollowers[0];

export default function FollowersPage() {
  const [followers, setFollowers] = useState(mockFollowers);

  const getUser = (id: string) => mockProfiles.find((p) => p.id === id);

  const columns: Column<Follower>[] = [
    {
      key: 'follower_id',
      header: 'Follower',
      render: (f) => {
        const user = getUser(f.follower_id);
        return (
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.profile_image_url} />
              <AvatarFallback>{user?.full_name?.[0]}</AvatarFallback>
            </Avatar>
            <span>{user?.full_name || 'Unknown'}</span>
          </div>
        );
      },
    },
    {
      key: 'following_id',
      header: 'Following',
      render: (f) => {
        const user = getUser(f.following_id);
        return (
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.profile_image_url} />
              <AvatarFallback>{user?.full_name?.[0]}</AvatarFallback>
            </Avatar>
            <span>{user?.full_name || 'Unknown'}</span>
          </div>
        );
      },
    },
    { key: 'created_at', header: 'Since' },
  ];

  const handleDelete = (follower: Follower) => {
    setFollowers(followers.filter((f) => f.id !== follower.id));
    toast.success('Follower relationship removed');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Followers</h2>
        <p className="text-muted-foreground">View and manage follower relationships.</p>
      </div>

      <DataTable
        data={followers}
        columns={columns}
        onDelete={handleDelete}
      />
    </div>
  );
}
