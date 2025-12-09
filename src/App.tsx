import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute, AdminRoute, ModeratorRoute, EditorRoute } from "@/components/auth/ProtectedRoute";
import { AdminLayout } from "@/components/admin/AdminLayout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import Dashboard from "./pages/admin/Dashboard";
import UsersPage from "./pages/admin/UsersPage";
import PostsPage from "./pages/admin/PostsPage";
import CategoriesPage from "./pages/admin/CategoriesPage";
import TagsPage from "./pages/admin/TagsPage";
import CommentsPage from "./pages/admin/CommentsPage";
import LikesPage from "./pages/admin/LikesPage";
import BookmarksPage from "./pages/admin/BookmarksPage";
import FollowersPage from "./pages/admin/FollowersPage";
import NotificationsPage from "./pages/admin/NotificationsPage";
import RolesPage from "./pages/admin/RolesPage";
import UserRolesPage from "./pages/admin/UserRolesPage";
import RoleAuditPage from "./pages/admin/RoleAuditPage";
import PostImagesPage from "./pages/admin/PostImagesPage";
import CommentLikesPage from "./pages/admin/CommentLikesPage";
import AnalyticsPage from "./pages/admin/AnalyticsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/" element={<Index />} />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route index element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="users" element={
                  <AdminRoute>
                    <UsersPage />
                  </AdminRoute>
                } />
                <Route path="posts" element={
                  <EditorRoute>
                    <PostsPage />
                  </EditorRoute>
                } />
                <Route path="categories" element={
                  <ModeratorRoute>
                    <CategoriesPage />
                  </ModeratorRoute>
                } />
                <Route path="tags" element={
                  <ModeratorRoute>
                    <TagsPage />
                  </ModeratorRoute>
                } />
                <Route path="comments" element={
                  <ModeratorRoute>
                    <CommentsPage />
                  </ModeratorRoute>
                } />
                <Route path="likes" element={
                  <ProtectedRoute>
                    <LikesPage />
                  </ProtectedRoute>
                } />
                <Route path="comment-likes" element={
                  <ModeratorRoute>
                    <CommentLikesPage />
                  </ModeratorRoute>
                } />
                <Route path="bookmarks" element={
                  <ProtectedRoute>
                    <BookmarksPage />
                  </ProtectedRoute>
                } />
                <Route path="followers" element={
                  <ProtectedRoute>
                    <FollowersPage />
                  </ProtectedRoute>
                } />
                <Route path="notifications" element={
                  <ProtectedRoute>
                    <NotificationsPage />
                  </ProtectedRoute>
                } />
                <Route path="roles" element={
                  <AdminRoute>
                    <RolesPage />
                  </AdminRoute>
                } />
                <Route path="user-roles" element={
                  <AdminRoute>
                    <UserRolesPage />
                  </AdminRoute>
                } />
                <Route path="role-audit" element={
                  <AdminRoute>
                    <RoleAuditPage />
                  </AdminRoute>
                } />
                <Route path="post-images" element={
                  <EditorRoute>
                    <PostImagesPage />
                  </EditorRoute>
                } />
                <Route path="analytics" element={
                  <ModeratorRoute>
                    <AnalyticsPage />
                  </ModeratorRoute>
                } />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
