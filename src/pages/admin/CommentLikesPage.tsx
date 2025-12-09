import { useState } from 'react';
import { DataTable, Column } from '@/components/admin/DataTable';
import { mockCommentLikes, mockProfiles, mockComments } from '@/data/mockData';
import { toast } from 'sonner';

type CommentLike = typeof mockCommentLikes[0];

export default function CommentLikesPage() {
  const [commentLikes, setCommentLikes] = useState(mockCommentLikes);

  const getUserName = (id: string) => mockProfiles.find((p) => p.id === id)?.full_name || 'Unknown';
  const getCommentPreview = (id: string) => {
    const comment = mockComments.find((c) => c.id === id);
    return comment?.content_markdown?.slice(0, 50) + '...' || 'Unknown';
  };

  const columns: Column<CommentLike>[] = [
    {
      key: 'user_id',
      header: 'User',
      render: (cl) => getUserName(cl.user_id),
    },
    {
      key: 'comment_id',
      header: 'Comment',
      render: (cl) => <span className="text-sm truncate max-w-[200px] block">{getCommentPreview(cl.comment_id)}</span>,
    },
    { key: 'created_at', header: 'Date' },
  ];

  const handleDelete = (commentLike: CommentLike) => {
    setCommentLikes(commentLikes.filter((cl) => cl.id !== commentLike.id));
    toast.success('Comment like removed');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Comment Likes</h2>
        <p className="text-muted-foreground">View and manage comment likes.</p>
      </div>

      <DataTable
        data={commentLikes}
        columns={columns}
        onDelete={handleDelete}
      />
    </div>
  );
}
