import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { 
  Settings, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Lock,
  Mail,
  Smartphone,
  Eye,
  EyeOff,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
  Trash2,
  Download,
  Key,
  UserX,
  Moon,
  Sun
} from 'lucide-react';
import { toast } from 'sonner';

interface SettingsData {
  email_notifications: boolean;
  push_notifications: boolean;
  email_alerts: boolean;
  marketing_emails: boolean;
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  privacy_show_email: boolean;
  privacy_show_phone: boolean;
  privacy_show_last_seen: boolean;
  security_two_factor: boolean;
  security_login_alerts: boolean;
  security_session_timeout: number;
  data_export_format: string;
  data_delete_after: number;
}

export default function SettingsPage() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [deleteAccountConfirm, setDeleteAccountConfirm] = useState(false);
  const [formData, setFormData] = useState<SettingsData>({
    email_notifications: true,
    push_notifications: true,
    email_alerts: true,
    marketing_emails: false,
    theme: 'system',
    language: 'en',
    timezone: 'UTC',
    privacy_show_email: false,
    privacy_show_phone: false,
    privacy_show_last_seen: true,
    security_two_factor: false,
    security_login_alerts: true,
    security_session_timeout: 24,
    data_export_format: 'json',
    data_delete_after: 365,
  });

  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  useEffect(() => {
    // Load settings from user metadata or defaults
    if (user?.user_metadata) {
      const metadata = user.user_metadata;
      setFormData(prev => ({
        ...prev,
        email_notifications: metadata.email_notifications ?? true,
        push_notifications: metadata.push_notifications ?? true,
        email_alerts: metadata.email_alerts ?? true,
        marketing_emails: metadata.marketing_emails ?? false,
        theme: metadata.theme ?? 'system',
        language: metadata.language ?? 'en',
        timezone: metadata.timezone ?? 'UTC',
        privacy_show_email: metadata.privacy_show_email ?? false,
        privacy_show_phone: metadata.privacy_show_phone ?? false,
        privacy_show_last_seen: metadata.privacy_show_last_seen ?? true,
        security_two_factor: metadata.security_two_factor ?? false,
        security_login_alerts: metadata.security_login_alerts ?? true,
        security_session_timeout: metadata.security_session_timeout ?? 24,
      }));
    }
  }, [user]);

  const handleInputChange = (name: string, value: boolean | string | number) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear messages when user starts typing
    if (error) setError(null);
    if (success) setSuccess(null);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveSettings = async () => {
    if (!user) return;

    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const { error } = await supabaseAdmin.auth.updateUser({
        data: {
          email_notifications: formData.email_notifications,
          push_notifications: formData.push_notifications,
          email_alerts: formData.email_alerts,
          marketing_emails: formData.marketing_emails,
          theme: formData.theme,
          language: formData.language,
          timezone: formData.timezone,
          privacy_show_email: formData.privacy_show_email,
          privacy_show_phone: formData.privacy_show_phone,
          privacy_show_last_seen: formData.privacy_show_last_seen,
          security_two_factor: formData.security_two_factor,
          security_login_alerts: formData.security_login_alerts,
          security_session_timeout: formData.security_session_timeout,
        }
      });

      if (error) throw error;

      setSuccess('Settings saved successfully');
      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Settings save error:', error);
      setError('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (!user) return;

    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setError('New passwords do not match');
      return;
    }

    if (passwordForm.new_password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const { error } = await supabaseAdmin.auth.updateUser({
        password: passwordForm.new_password
      });

      if (error) throw error;

      setPasswordForm({
        current_password: '',
        new_password: '',
        confirm_password: '',
      });
      setShowPasswordForm(false);
      setSuccess('Password updated successfully');
      toast.success('Password updated successfully');
    } catch (error) {
      console.error('Password update error:', error);
      setError('Failed to update password');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportData = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Fetch all user data with dynamic access to bypass TypeScript
      const profilesTable = (supabaseAdmin as any).from('profiles');
      const postsTable = (supabaseAdmin as any).from('posts');
      const commentsTable = (supabaseAdmin as any).from('comments');
      const likesTable = (supabaseAdmin as any).from('likes');
      const bookmarksTable = (supabaseAdmin as any).from('bookmarks');
      const followersTable = (supabaseAdmin as any).from('followers');
      
      const [profileResult, postsResult, commentsResult, likesResult, bookmarksResult, followersResult] = await Promise.all([
        profilesTable.select('*').eq('id', user.id).single(),
        postsTable.select('*').eq('author_id', user.id),
        commentsTable.select('*').eq('author_id', user.id),
        likesTable.select('*').eq('user_id', user.id),
        bookmarksTable.select('*').eq('user_id', user.id),
        followersTable.select('*').or(`follower_id.eq.${user.id},following_id.eq.${user.id}`),
      ]);

      const exportData = {
        user_info: {
          id: user.id,
          email: user.email,
          created_at: user.created_at,
          last_sign_in_at: user.last_sign_in_at,
        },
        profile: profileResult.data,
        content: {
          posts: postsResult.data || [],
          comments: commentsResult.data || [],
        },
        engagement: {
          likes: likesResult.data || [],
          bookmarks: bookmarksResult.data || [],
          followers: followersResult.data || [],
        },
        metadata: {
          exported_at: new Date().toISOString(),
          export_version: '1.0',
          total_posts: (postsResult.data || []).length,
          total_comments: (commentsResult.data || []).length,
          total_likes: (likesResult.data || []).length,
          total_bookmarks: (bookmarksResult.data || []).length,
          total_followers: (followersResult.data || []).length,
        }
      };

      // Create and download the file
      const jsonString = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `user-data-${user.id}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Data exported successfully');
    } catch (error) {
      console.error('Data export error:', error);
      setError('Failed to export data');
      toast.error('Failed to export data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user || !deleteAccountConfirm) return;

    setIsLoading(true);
    try {
      // Delete user data from all tables
      await Promise.all([
        supabaseAdmin.from('profiles').delete().eq('id', user.id),
        supabaseAdmin.from('posts').delete().eq('author_id', user.id),
        supabaseAdmin.from('comments').delete().eq('author_id', user.id),
        supabaseAdmin.from('likes').delete().eq('user_id', user.id),
        supabaseAdmin.from('bookmarks').delete().eq('user_id', user.id),
        supabaseAdmin.from('followers').delete().eq('follower_id', user.id),
        supabaseAdmin.from('followers').delete().eq('following_id', user.id),
      ]);

      // Delete auth user
      const { error } = await supabaseAdmin.auth.admin.deleteUser(user.id);
      if (error) throw error;

      toast.success('Account deleted successfully');
      navigate('/login');
    } catch (error) {
      console.error('Account deletion error:', error);
      setError('Failed to delete account');
    } finally {
      setIsLoading(false);
      setDeleteAccountConfirm(false);
    }
  };

  if (!user || !profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>
        <Button onClick={handleSaveSettings} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save All Settings
            </>
          )}
        </Button>
      </div>

      {/* Alerts */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert className="border-green-200 bg-green-50 text-green-800">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive email notifications about your activity</p>
            </div>
            <Switch
              checked={formData.email_notifications}
              onCheckedChange={(checked) => handleInputChange('email_notifications', checked)}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label>Push Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive push notifications in your browser</p>
            </div>
            <Switch
              checked={formData.push_notifications}
              onCheckedChange={(checked) => handleInputChange('push_notifications', checked)}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label>Email Alerts</Label>
              <p className="text-sm text-muted-foreground">Receive important email alerts</p>
            </div>
            <Switch
              checked={formData.email_alerts}
              onCheckedChange={(checked) => handleInputChange('email_alerts', checked)}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label>Marketing Emails</Label>
              <p className="text-sm text-muted-foreground">Receive marketing and promotional emails</p>
            </div>
            <Switch
              checked={formData.marketing_emails}
              onCheckedChange={(checked) => handleInputChange('marketing_emails', checked)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Theme</Label>
              <Select value={formData.theme} onValueChange={(value) => handleInputChange('theme', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">
                    <div className="flex items-center gap-2">
                      <Sun className="w-4 h-4" />
                      Light
                    </div>
                  </SelectItem>
                  <SelectItem value="dark">
                    <div className="flex items-center gap-2">
                      <Moon className="w-4 h-4" />
                      Dark
                    </div>
                  </SelectItem>
                  <SelectItem value="system">
                    <div className="flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      System
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Language</Label>
              <Select value={formData.language} onValueChange={(value) => handleInputChange('language', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="de">Deutsch</SelectItem>
                  <SelectItem value="it">Italiano</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Timezone</Label>
              <Select value={formData.timezone} onValueChange={(value) => handleInputChange('timezone', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTC">UTC</SelectItem>
                  <SelectItem value="America/New_York">Eastern Time</SelectItem>
                  <SelectItem value="America/Chicago">Central Time</SelectItem>
                  <SelectItem value="America/Denver">Mountain Time</SelectItem>
                  <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                  <SelectItem value="Europe/London">London</SelectItem>
                  <SelectItem value="Europe/Paris">Paris</SelectItem>
                  <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Privacy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Privacy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Show Email</Label>
                <p className="text-sm text-muted-foreground">Display your email address publicly</p>
              </div>
              <Switch
                checked={formData.privacy_show_email}
                onCheckedChange={(checked) => handleInputChange('privacy_show_email', checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Show Phone</Label>
                <p className="text-sm text-muted-foreground">Display your phone number publicly</p>
              </div>
              <Switch
                checked={formData.privacy_show_phone}
                onCheckedChange={(checked) => handleInputChange('privacy_show_phone', checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Show Last Seen</Label>
                <p className="text-sm text-muted-foreground">Display when you were last active</p>
              </div>
              <Switch
                checked={formData.privacy_show_last_seen}
                onCheckedChange={(checked) => handleInputChange('privacy_show_last_seen', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
              </div>
              <Switch
                checked={formData.security_two_factor}
                onCheckedChange={(checked) => handleInputChange('security_two_factor', checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Login Alerts</Label>
                <p className="text-sm text-muted-foreground">Get notified of new login attempts</p>
              </div>
              <Switch
                checked={formData.security_login_alerts}
                onCheckedChange={(checked) => handleInputChange('security_login_alerts', checked)}
              />
            </div>
            <Separator />
            <div className="space-y-2">
              <Label>Session Timeout (hours)</Label>
              <Input
                type="number"
                value={formData.security_session_timeout}
                onChange={(e) => handleInputChange('security_session_timeout', parseInt(e.target.value))}
                min={1}
                max={168}
              />
            </div>
            <Separator />
            <Button
              variant="outline"
              onClick={() => setShowPasswordForm(!showPasswordForm)}
              className="w-full"
            >
              <Key className="mr-2 h-4 w-4" />
              Change Password
            </Button>
            {showPasswordForm && (
              <div className="space-y-3 p-4 border border-border rounded-lg">
                <div className="space-y-2">
                  <Label>Current Password</Label>
                  <Input
                    type="password"
                    name="current_password"
                    value={passwordForm.current_password}
                    onChange={handlePasswordChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label>New Password</Label>
                  <Input
                    type="password"
                    name="new_password"
                    value={passwordForm.new_password}
                    onChange={handlePasswordChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Confirm New Password</Label>
                  <Input
                    type="password"
                    name="confirm_password"
                    value={passwordForm.confirm_password}
                    onChange={handlePasswordChange}
                  />
                </div>
                <Button onClick={handlePasswordUpdate} disabled={isSaving} className="w-full">
                  {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Update Password
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Data Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Export Format</Label>
              <Select value={formData.data_export_format} onValueChange={(value) => handleInputChange('data_export_format', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="xml">XML</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              variant="outline"
              onClick={handleExportData}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
              Export My Data
            </Button>
            <Separator />
            <div className="space-y-2">
              <Label>Delete Account</Label>
              <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
            </div>
            {!deleteAccountConfirm ? (
              <Button
                variant="destructive"
                onClick={() => setDeleteAccountConfirm(true)}
                className="w-full"
              >
                <UserX className="mr-2 h-4 w-4" />
                Delete Account
              </Button>
            ) : (
              <div className="space-y-3 p-4 border border-red-200 rounded-lg">
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    This action cannot be undone. All your data will be permanently deleted.
                  </AlertDescription>
                </Alert>
                <div className="flex gap-2">
                  <Button
                    variant="destructive"
                    onClick={handleDeleteAccount}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                    Confirm Delete
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setDeleteAccountConfirm(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
