import { useState } from 'react';
import { DataTable, Column } from '@/components/admin/DataTable';
import { mockTags } from '@/data/mockData';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

type Tag = typeof mockTags[0];

export default function TagsPage() {
  const [tags, setTags] = useState(mockTags);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [formData, setFormData] = useState({ name: '', slug: '', color: '#3B82F6' });

  const columns: Column<Tag>[] = [
    {
      key: 'name',
      header: 'Name',
      render: (tag) => (
        <div className="flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: tag.color }}
          />
          {tag.name}
        </div>
      ),
    },
    { key: 'slug', header: 'Slug' },
    {
      key: 'color',
      header: 'Color',
      render: (tag) => (
        <code className="text-xs bg-muted px-2 py-1 rounded">{tag.color}</code>
      ),
    },
    { key: 'created_at', header: 'Created At' },
  ];

  const handleAdd = () => {
    setEditingTag(null);
    setFormData({ name: '', slug: '', color: '#3B82F6' });
    setIsDialogOpen(true);
  };

  const handleEdit = (tag: Tag) => {
    setEditingTag(tag);
    setFormData({ name: tag.name, slug: tag.slug, color: tag.color });
    setIsDialogOpen(true);
  };

  const handleDelete = (tag: Tag) => {
    setTags(tags.filter((t) => t.id !== tag.id));
    toast.success('Tag deleted successfully');
  };

  const handleSubmit = () => {
    if (editingTag) {
      setTags(tags.map((t) => (t.id === editingTag.id ? { ...t, ...formData } : t)));
      toast.success('Tag updated successfully');
    } else {
      const newTag: Tag = {
        id: String(Date.now()),
        ...formData,
        created_at: new Date().toISOString().split('T')[0],
      };
      setTags([...tags, newTag]);
      toast.success('Tag created successfully');
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Tags</h2>
        <p className="text-muted-foreground">Manage post tags.</p>
      </div>

      <DataTable
        data={tags}
        columns={columns}
        searchKey="name"
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        addLabel="Add Tag"
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingTag ? 'Edit Tag' : 'Add Tag'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({
                  ...formData,
                  name: e.target.value,
                  slug: e.target.value.toLowerCase().replace(/\s+/g, '-'),
                })}
                placeholder="Tag name"
              />
            </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-12 h-10 p-1"
                />
                <Input
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  placeholder="#3B82F6"
                  className="flex-1"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>{editingTag ? 'Update' : 'Create'}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
