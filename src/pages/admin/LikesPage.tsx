import { useState } from 'react';
import { DataTable, Column } from '@/components/admin/DataTable';
import { mockLikes, mockProfiles, mockPosts } from '@/data/mockData';
import { toast } from 'sonner';

type Like = typeof mockLikes[0];

export default function LikesPage() {
  const [likes, setLikes] = useState(mockLikes);

  const getUserName = (id: string) => mockProfiles.find((p) => p.id === id)?.full_name || 'Unknown';
  const getPostTitle = (id: string) => mockPosts.find((p) => p.id === id)?.title || 'Unknown Post';

  const columns: Column<Like>[] = [
    {
      key: 'user_id',
      header: 'User',
      render: (like) => getUserName(like.user_id),
    },
    {
      key: 'post_id',
      header: 'Post',
      render: (like) => (
        <p className="max-w-xs truncate">{getPostTitle(like.post_id)}</p>
      ),
    },
    { key: 'created_at', header: 'Date' },
  ];

  const handleDelete = (like: Like) => {
    setLikes(likes.filter((l) => l.id !== like.id));
    toast.success('Like removed successfully');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Likes</h2>
        <p className="text-muted-foreground">View and manage post likes.</p>
      </div>

      <DataTable
        data={likes}
        columns={columns}
        onDelete={handleDelete}
      />
    </div>
  );
}
