import { useState } from 'react';
import { DataTable, Column } from '@/components/admin/DataTable';
import { mockPosts, mockProfiles, mockCategories } from '@/data/mockData';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Eye } from 'lucide-react';

type Post = typeof mockPosts[0];

export default function PostsPage() {
  const [posts, setPosts] = useState(mockPosts);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    status: 'draft',
    author_id: '',
    category_id: '',
    content: '',
  });

  const getAuthorName = (authorId: string) => {
    const author = mockProfiles.find((p) => p.id === authorId);
    return author?.full_name || 'Unknown';
  };

  const getCategoryName = (categoryId: string) => {
    const category = mockCategories.find((c) => c.id === categoryId);
    return category?.name || 'Uncategorized';
  };

  const columns: Column<Post>[] = [
    {
      key: 'title',
      header: 'Title',
      render: (post) => (
        <div>
          <p className="font-medium text-foreground">{post.title}</p>
          <p className="text-xs text-muted-foreground">/{post.slug}</p>
        </div>
      ),
    },
    {
      key: 'author_id',
      header: 'Author',
      render: (post) => getAuthorName(post.author_id),
    },
    {
      key: 'category_id',
      header: 'Category',
      render: (post) => getCategoryName(post.category_id),
    },
    {
      key: 'status',
      header: 'Status',
      render: (post) => (
        <Badge
          variant={
            post.status === 'published'
              ? 'default'
              : post.status === 'draft'
              ? 'secondary'
              : 'outline'
          }
        >
          {post.status}
        </Badge>
      ),
    },
    {
      key: 'views',
      header: 'Views',
      render: (post) => (
        <div className="flex items-center gap-1">
          <Eye className="w-4 h-4 text-muted-foreground" />
          {post.views.toLocaleString()}
        </div>
      ),
    },
    { key: 'created_at', header: 'Created' },
  ];

  const handleAdd = () => {
    setEditingPost(null);
    setFormData({
      title: '',
      slug: '',
      status: 'draft',
      author_id: '',
      category_id: '',
      content: '',
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      status: post.status,
      author_id: post.author_id,
      category_id: post.category_id,
      content: '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (post: Post) => {
    setPosts(posts.filter((p) => p.id !== post.id));
    toast.success('Post deleted successfully');
  };

  const handleSubmit = () => {
    if (editingPost) {
      setPosts(
        posts.map((p) =>
          p.id === editingPost.id ? { ...p, ...formData } : p
        )
      );
      toast.success('Post updated successfully');
    } else {
      const newPost: Post = {
        id: String(Date.now()),
        ...formData,
        views: 0,
        created_at: new Date().toISOString().split('T')[0],
      };
      setPosts([...posts, newPost]);
      toast.success('Post created successfully');
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Posts Management</h2>
        <p className="text-muted-foreground">Manage all blog posts and articles.</p>
      </div>

      <DataTable
        data={posts}
        columns={columns}
        searchKey="title"
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        addLabel="Add Post"
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingPost ? 'Edit Post' : 'Add New Post'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Post title"
              />
            </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="post-slug"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Author</Label>
                <Select
                  value={formData.author_id}
                  onValueChange={(value) => setFormData({ ...formData, author_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select author" />
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
                <Label>Category</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Content</Label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Write your post content in markdown..."
                rows={6}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {editingPost ? 'Update' : 'Create'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
