// Mock data for the admin dashboard
export const mockProfiles = [
  { id: '1', full_name: 'John Doe', age: 28, gender: 'Male', phone: '+1234567890', bio: 'Software developer', profile_image_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john', role: 'admin', is_active: true, login_count: 45, created_at: '2024-01-15' },
  { id: '2', full_name: 'Jane Smith', age: 32, gender: 'Female', phone: '+1234567891', bio: 'UX Designer', profile_image_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane', role: 'user', is_active: true, login_count: 23, created_at: '2024-02-20' },
  { id: '3', full_name: 'Mike Johnson', age: 25, gender: 'Male', phone: '+1234567892', bio: 'Content Writer', profile_image_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike', role: 'editor', is_active: false, login_count: 12, created_at: '2024-03-10' },
  { id: '4', full_name: 'Sarah Williams', age: 29, gender: 'Female', phone: '+1234567893', bio: 'Marketing Manager', profile_image_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah', role: 'moderator', is_active: true, login_count: 67, created_at: '2024-01-05' },
  { id: '5', full_name: 'Alex Brown', age: 35, gender: 'Non-binary', phone: '+1234567894', bio: 'Data Analyst', profile_image_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex', role: 'user', is_active: true, login_count: 34, created_at: '2024-04-01' },
];

export const mockPosts = [
  { id: '1', title: 'Getting Started with React', slug: 'getting-started-react', status: 'published', views: 1250, author_id: '1', created_at: '2024-11-01', category_id: '1' },
  { id: '2', title: 'Advanced TypeScript Tips', slug: 'advanced-typescript', status: 'published', views: 890, author_id: '2', created_at: '2024-11-05', category_id: '1' },
  { id: '3', title: 'Design System Best Practices', slug: 'design-system', status: 'draft', views: 0, author_id: '3', created_at: '2024-11-10', category_id: '2' },
  { id: '4', title: 'Building Scalable APIs', slug: 'scalable-apis', status: 'published', views: 2100, author_id: '1', created_at: '2024-10-25', category_id: '1' },
  { id: '5', title: 'Modern CSS Techniques', slug: 'modern-css', status: 'archived', views: 567, author_id: '4', created_at: '2024-09-15', category_id: '2' },
];

export const mockCategories = [
  { id: '1', name: 'Technology', slug: 'technology', created_at: '2024-01-01' },
  { id: '2', name: 'Design', slug: 'design', created_at: '2024-01-01' },
  { id: '3', name: 'Business', slug: 'business', created_at: '2024-01-01' },
  { id: '4', name: 'Lifestyle', slug: 'lifestyle', created_at: '2024-01-01' },
];

export const mockTags = [
  { id: '1', name: 'React', slug: 'react', color: '#61DAFB', created_at: '2024-01-01' },
  { id: '2', name: 'TypeScript', slug: 'typescript', color: '#3178C6', created_at: '2024-01-01' },
  { id: '3', name: 'CSS', slug: 'css', color: '#1572B6', created_at: '2024-01-01' },
  { id: '4', name: 'Node.js', slug: 'nodejs', color: '#339933', created_at: '2024-01-01' },
  { id: '5', name: 'Python', slug: 'python', color: '#3776AB', created_at: '2024-01-01' },
];

export const mockComments = [
  { id: '1', post_id: '1', author_id: '2', content_markdown: 'Great article!', approved: true, created_at: '2024-11-02' },
  { id: '2', post_id: '1', author_id: '3', content_markdown: 'Very helpful, thanks!', approved: true, created_at: '2024-11-03' },
  { id: '3', post_id: '2', author_id: '1', content_markdown: 'Could you explain more about generics?', approved: false, created_at: '2024-11-06' },
  { id: '4', post_id: '4', author_id: '4', content_markdown: 'This changed how I think about APIs', approved: true, created_at: '2024-10-26' },
];

export const mockLikes = [
  { id: '1', user_id: '1', post_id: '1', created_at: '2024-11-01' },
  { id: '2', user_id: '2', post_id: '1', created_at: '2024-11-02' },
  { id: '3', user_id: '3', post_id: '2', created_at: '2024-11-05' },
  { id: '4', user_id: '4', post_id: '4', created_at: '2024-10-26' },
];

export const mockBookmarks = [
  { id: '1', user_id: '1', post_id: '2', created_at: '2024-11-05' },
  { id: '2', user_id: '2', post_id: '4', created_at: '2024-10-27' },
  { id: '3', user_id: '3', post_id: '1', created_at: '2024-11-03' },
];

export const mockFollowers = [
  { id: '1', follower_id: '2', following_id: '1', created_at: '2024-02-01' },
  { id: '2', follower_id: '3', following_id: '1', created_at: '2024-03-15' },
  { id: '3', follower_id: '4', following_id: '2', created_at: '2024-04-10' },
  { id: '4', follower_id: '1', following_id: '4', created_at: '2024-05-20' },
];

export const mockNotifications = [
  { id: '1', user_id: '1', type: 'like', title: 'New Like', message: 'Someone liked your post', read: false, created_at: '2024-12-01' },
  { id: '2', user_id: '2', type: 'comment', title: 'New Comment', message: 'Someone commented on your post', read: true, created_at: '2024-11-30' },
  { id: '3', user_id: '1', type: 'follow', title: 'New Follower', message: 'Someone started following you', read: false, created_at: '2024-11-29' },
];

export const mockRoles = [
  { id: '1', name: 'admin', display_name: 'Administrator', description: 'Full system access', is_system_role: true, created_at: '2024-01-01' },
  { id: '2', name: 'moderator', display_name: 'Moderator', description: 'Content moderation access', is_system_role: true, created_at: '2024-01-01' },
  { id: '3', name: 'editor', display_name: 'Editor', description: 'Content editing access', is_system_role: false, created_at: '2024-01-01' },
  { id: '4', name: 'user', display_name: 'User', description: 'Basic user access', is_system_role: true, created_at: '2024-01-01' },
];

export const mockUserRoles = [
  { id: '1', user_id: '1', role_id: '1', assigned_at: '2024-01-15', is_active: true },
  { id: '2', user_id: '2', role_id: '4', assigned_at: '2024-02-20', is_active: true },
  { id: '3', user_id: '4', role_id: '2', assigned_at: '2024-01-05', is_active: true },
];

export const mockRoleAuditLog = [
  { id: '1', user_id: '1', old_role: 'user', new_role: 'admin', changed_at: '2024-01-15', reason: 'Promotion' },
  { id: '2', user_id: '4', old_role: 'user', new_role: 'moderator', changed_at: '2024-03-10', reason: 'Community contribution' },
];

export const mockPostImages = [
  { id: '1', post_id: '1', url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee', alt_text: 'React code', order_index: 0 },
  { id: '2', post_id: '2', url: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159', alt_text: 'TypeScript', order_index: 0 },
];

export const mockPostTags = [
  { id: '1', post_id: '1', tag_id: '1', created_at: '2024-11-01' },
  { id: '2', post_id: '1', tag_id: '2', created_at: '2024-11-01' },
  { id: '3', post_id: '2', tag_id: '2', created_at: '2024-11-05' },
];

export const mockCommentLikes = [
  { id: '1', user_id: '1', comment_id: '1', created_at: '2024-11-02' },
  { id: '2', user_id: '3', comment_id: '2', created_at: '2024-11-04' },
];

// Analytics data
export const analyticsData = {
  totalUsers: 1247,
  totalPosts: 342,
  totalComments: 1893,
  totalLikes: 5621,
  userGrowth: 12.5,
  postGrowth: 8.3,
  commentGrowth: -2.1,
  likeGrowth: 15.7,
  monthlyUsers: [
    { month: 'Jan', users: 120 },
    { month: 'Feb', users: 180 },
    { month: 'Mar', users: 250 },
    { month: 'Apr', users: 310 },
    { month: 'May', users: 420 },
    { month: 'Jun', users: 380 },
    { month: 'Jul', users: 450 },
    { month: 'Aug', users: 520 },
    { month: 'Sep', users: 610 },
    { month: 'Oct', users: 780 },
    { month: 'Nov', users: 920 },
    { month: 'Dec', users: 1247 },
  ],
  postsByCategory: [
    { name: 'Technology', value: 145 },
    { name: 'Design', value: 89 },
    { name: 'Business', value: 67 },
    { name: 'Lifestyle', value: 41 },
  ],
  engagementByDay: [
    { day: 'Mon', likes: 120, comments: 45 },
    { day: 'Tue', likes: 180, comments: 62 },
    { day: 'Wed', likes: 150, comments: 55 },
    { day: 'Thu', likes: 210, comments: 78 },
    { day: 'Fri', likes: 195, comments: 70 },
    { day: 'Sat', likes: 95, comments: 35 },
    { day: 'Sun', likes: 80, comments: 28 },
  ],
  recentActivities: [
    { user: 'John Doe', action: 'created a new post', time: '2 mins ago', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john' },
    { user: 'Jane Smith', action: 'commented on a post', time: '5 mins ago', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane' },
    { user: 'Mike Johnson', action: 'liked a post', time: '12 mins ago', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike' },
    { user: 'Sarah Williams', action: 'followed a user', time: '25 mins ago', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah' },
  ],
  usersByRole: [
    { role: 'Users', count: 1180 },
    { role: 'Editors', count: 42 },
    { role: 'Moderators', count: 18 },
    { role: 'Admins', count: 7 },
  ],
};
