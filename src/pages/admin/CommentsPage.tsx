import { useState } from 'react';
import { DataTable, Column } from '@/components/admin/DataTable';
import { mockComments, mockProfiles, mockPosts } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

type Comment = typeof mockComments[0];

export default function CommentsPage() {
  const [comments, setComments] = useState(mockComments);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [formData, setFormData] = useState({ content_markdown: '', approved: false });

  const getAuthorName = (id: string) => mockProfiles.find((p) => p.id === id)?.full_name || 'Unknown';
  const getPostTitle = (id: string) => mockPosts.find((p) => p.id === id)?.title || 'Unknown Post';

  const columns: Column<Comment>[] = [
    {
      key: 'content_markdown',
      header: 'Content',
      render: (comment) => (
        <p className="max-w-xs truncate">{comment.content_markdown}</p>
      ),
    },
    {
      key: 'author_id',
      header: 'Author',
      render: (comment) => getAuthorName(comment.author_id),
    },
    {
      key: 'post_id',
      header: 'Post',
      render: (comment) => (
        <p className="max-w-[150px] truncate">{getPostTitle(comment.post_id)}</p>
      ),
    },
    {
      key: 'approved',
      header: 'Status',
      render: (comment) => (
        <Badge variant={comment.approved ? 'default' : 'secondary'}>
          {comment.approved ? 'Approved' : 'Pending'}
        </Badge>
      ),
    },
    { key: 'created_at', header: 'Date' },
  ];

  const handleEdit = (comment: Comment) => {
    setEditingComment(comment);
    setFormData({
      content_markdown: comment.content_markdown,
      approved: comment.approved,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (comment: Comment) => {
    setComments(comments.filter((c) => c.id !== comment.id));
    toast.success('Comment deleted successfully');
  };

  const handleSubmit = () => {
    if (editingComment) {
      setComments(
        comments.map((c) =>
          c.id === editingComment.id ? { ...c, ...formData } : c
        )
      );
      toast.success('Comment updated successfully');
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Comments</h2>
        <p className="text-muted-foreground">Moderate and manage comments.</p>
      </div>

      <DataTable
        data={comments}
        columns={columns}
        searchKey="content_markdown"
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Comment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Content</Label>
              <Textarea
                value={formData.content_markdown}
                onChange={(e) => setFormData({ ...formData, content_markdown: e.target.value })}
                rows={4}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Approved</Label>
              <Switch
                checked={formData.approved}
                onCheckedChange={(checked) => setFormData({ ...formData, approved: checked })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>Update</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
