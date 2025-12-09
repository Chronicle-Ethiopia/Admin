import { useState } from 'react';
import { DataTable, Column } from '@/components/admin/DataTable';
import { mockBookmarks, mockProfiles, mockPosts } from '@/data/mockData';
import { toast } from 'sonner';

type Bookmark = typeof mockBookmarks[0];

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState(mockBookmarks);

  const getUserName = (id: string) => mockProfiles.find((p) => p.id === id)?.full_name || 'Unknown';
  const getPostTitle = (id: string) => mockPosts.find((p) => p.id === id)?.title || 'Unknown Post';

  const columns: Column<Bookmark>[] = [
    {
      key: 'user_id',
      header: 'User',
      render: (bookmark) => getUserName(bookmark.user_id),
    },
    {
      key: 'post_id',
      header: 'Post',
      render: (bookmark) => (
        <p className="max-w-xs truncate">{getPostTitle(bookmark.post_id)}</p>
      ),
    },
    { key: 'created_at', header: 'Date' },
  ];

  const handleDelete = (bookmark: Bookmark) => {
    setBookmarks(bookmarks.filter((b) => b.id !== bookmark.id));
    toast.success('Bookmark removed successfully');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Bookmarks</h2>
        <p className="text-muted-foreground">View and manage user bookmarks.</p>
      </div>

      <DataTable
        data={bookmarks}
        columns={columns}
        onDelete={handleDelete}
      />
    </div>
  );
}
