import { useState } from 'react';
import { DataTable, Column } from '@/components/admin/DataTable';
import { mockPostImages, mockPosts } from '@/data/mockData';
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
import { toast } from 'sonner';

type PostImage = typeof mockPostImages[0];

export default function PostImagesPage() {
  const [images, setImages] = useState(mockPostImages);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<PostImage | null>(null);
  const [formData, setFormData] = useState({
    post_id: '',
    url: '',
    alt_text: '',
    order_index: 0,
  });

  const getPostTitle = (id: string) => mockPosts.find((p) => p.id === id)?.title || 'Unknown';

  const columns: Column<PostImage>[] = [
    {
      key: 'url',
      header: 'Image',
      render: (img) => (
        <img
          src={img.url}
          alt={img.alt_text || 'Post image'}
          className="w-16 h-12 object-cover rounded"
        />
      ),
    },
    {
      key: 'post_id',
      header: 'Post',
      render: (img) => <span className="truncate max-w-[200px] block">{getPostTitle(img.post_id)}</span>,
    },
    { key: 'alt_text', header: 'Alt Text' },
    { key: 'order_index', header: 'Order' },
  ];

  const handleAdd = () => {
    setEditingImage(null);
    setFormData({ post_id: '', url: '', alt_text: '', order_index: 0 });
    setIsDialogOpen(true);
  };

  const handleEdit = (image: PostImage) => {
    setEditingImage(image);
    setFormData({
      post_id: image.post_id,
      url: image.url,
      alt_text: image.alt_text || '',
      order_index: image.order_index,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (image: PostImage) => {
    setImages(images.filter((i) => i.id !== image.id));
    toast.success('Image deleted');
  };

  const handleSubmit = () => {
    if (editingImage) {
      setImages(images.map((i) => (i.id === editingImage.id ? { ...i, ...formData } : i)));
      toast.success('Image updated');
    } else {
      const newImage: PostImage = {
        id: String(Date.now()),
        ...formData,
      };
      setImages([...images, newImage]);
      toast.success('Image added');
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Post Images</h2>
        <p className="text-muted-foreground">Manage images attached to posts.</p>
      </div>

      <DataTable
        data={images}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        addLabel="Add Image"
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingImage ? 'Edit Image' : 'Add Image'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Post</Label>
              <Select
                value={formData.post_id}
                onValueChange={(value) => setFormData({ ...formData, post_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select post" />
                </SelectTrigger>
                <SelectContent>
                  {mockPosts.map((post) => (
                    <SelectItem key={post.id} value={post.id}>
                      {post.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Image URL</Label>
              <Input
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <Label>Alt Text</Label>
              <Input
                value={formData.alt_text}
                onChange={(e) => setFormData({ ...formData, alt_text: e.target.value })}
                placeholder="Image description"
              />
            </div>
            <div className="space-y-2">
              <Label>Order Index</Label>
              <Input
                type="number"
                value={formData.order_index}
                onChange={(e) => setFormData({ ...formData, order_index: Number(e.target.value) })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>{editingImage ? 'Update' : 'Add'}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
