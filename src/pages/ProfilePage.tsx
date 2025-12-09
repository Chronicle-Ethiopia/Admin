import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Briefcase, 
  Link as LinkIcon,
  Twitter,
  Facebook,
  Linkedin,
  Instagram,
  Github,
  Youtube,
  Globe,
  Camera,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
  LogOut
} from 'lucide-react';
import { toast } from 'sonner';

interface ProfileData {
  full_name: string;
  age: number | null;
  gender: string | null;
  phone: string | null;
  bio: string | null;
  profile_image_url: string | null;
  badge: string | null;
  twitter: string | null;
  facebook: string | null;
  linkedin: string | null;
  instagram: string | null;
  github: string | null;
  youtube: string | null;
  website: string | null;
  show_phone: boolean | null;
  background_image_url: string | null;
}

export default function ProfilePage() {
  const { user, profile, refreshProfile, signOut } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProfileData>({
    full_name: '',
    age: null,
    gender: null,
    phone: null,
    bio: null,
    profile_image_url: null,
    badge: null,
    twitter: null,
    facebook: null,
    linkedin: null,
    instagram: null,
    github: null,
    youtube: null,
    website: null,
    show_phone: false,
    background_image_url: null,
  });

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Error logging out');
    }
  };

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        age: profile.age || null,
        gender: profile.gender || null,
        phone: profile.phone || null,
        bio: profile.bio || null,
        profile_image_url: profile.profile_image_url || null,
        badge: profile.badge || null,
        twitter: profile.twitter || null,
        facebook: profile.facebook || null,
        linkedin: profile.linkedin || null,
        instagram: profile.instagram || null,
        github: profile.github || null,
        youtube: profile.youtube || null,
        website: profile.website || null,
        show_phone: profile.show_phone || false,
        background_image_url: profile.background_image_url || null,
      });
    }
  }, [profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
             type === 'number' ? (value === '' ? null : parseInt(value)) : value
    }));
    // Clear messages when user starts typing
    if (error) setError(null);
    if (success) setSuccess(null);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'background') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setIsLoading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}-${type}-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      setFormData(prev => ({
        ...prev,
        [type === 'profile' ? 'profile_image_url' : 'background_image_url']: publicUrl
      }));

      toast.success(`${type === 'profile' ? 'Profile' : 'Background'} image uploaded successfully`);
    } catch (error) {
      console.error('Image upload error:', error);
      setError('Failed to upload image');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user || !profile) return;

    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      // Optimized update with minimal data
      const profilesTable = (supabaseAdmin as any).from('profiles');
      
      const updateData = {
        full_name: formData.full_name,
        age: formData.age ? parseInt(formData.age.toString()) : null,
        gender: formData.gender,
        phone: formData.phone,
        bio: formData.bio,
        profile_image_url: formData.profile_image_url,
        badge: formData.badge,
        twitter: formData.twitter,
        facebook: formData.facebook,
        linkedin: formData.linkedin,
        instagram: formData.instagram,
        github: formData.github,
        youtube: formData.youtube,
        website: formData.website,
        show_phone: formData.show_phone,
        background_image_url: formData.background_image_url,
        updated_at: new Date().toISOString(),
      };
      
      // Direct update without unnecessary operations
      const { error } = await profilesTable.update(updateData).eq('id', user.id);

      if (error) throw error;

      // Quick refresh without full re-fetch
      setSuccess('Profile updated successfully');
      toast.success('Profile updated successfully');
      
      // Optional: Quick profile refresh
      setTimeout(() => {
        refreshProfile().catch(console.error);
      }, 500);
      
    } catch (error) {
      console.error('Profile update error:', error);
      setError('Failed to update profile');
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'twitter': return <Twitter className="w-4 h-4" />;
      case 'facebook': return <Facebook className="w-4 h-4" />;
      case 'linkedin': return <Linkedin className="w-4 h-4" />;
      case 'instagram': return <Instagram className="w-4 h-4" />;
      case 'github': return <Github className="w-4 h-4" />;
      case 'youtube': return <Youtube className="w-4 h-4" />;
      case 'website': return <Globe className="w-4 h-4" />;
      default: return <LinkIcon className="w-4 h-4" />;
    }
  };

  if (!user || !profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Profile</h1>
          <p className="text-muted-foreground">Manage your personal information and preferences</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
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

      {/* Profile Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={formData.profile_image_url || undefined} />
                <AvatarFallback className="text-2xl">
                  {formData.full_name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <label className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-1 cursor-pointer hover:bg-primary/80">
                <Camera className="w-4 h-4" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e, 'profile')}
                />
              </label>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{formData.full_name || 'No Name'}</h2>
              <p className="text-muted-foreground">{user?.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="capitalize">
                  {profile.role}
                </Badge>
                {formData.badge && (
                  <Badge variant="secondary">{formData.badge}</Badge>
                )}
              </div>
              {formData.bio && (
                <p className="mt-3 text-sm text-muted-foreground">{formData.bio}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                name="age"
                type="number"
                value={formData.age || ''}
                onChange={handleInputChange}
                placeholder="Enter your age"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <select
                id="gender"
                name="gender"
                value={formData.gender || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                className="w-full p-2 border border-border rounded-md bg-background"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone || ''}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="show_phone"
                name="show_phone"
                checked={formData.show_phone || false}
                onChange={handleInputChange}
                className="rounded border-border"
              />
              <Label htmlFor="show_phone">Show phone number publicly</Label>
            </div>
          </CardContent>
        </Card>

        {/* Bio */}
        <Card>
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio || ''}
                onChange={handleInputChange}
                placeholder="Tell us about yourself"
                rows={6}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="badge">Badge</Label>
              <Input
                id="badge"
                name="badge"
                value={formData.badge || ''}
                onChange={handleInputChange}
                placeholder="Enter your badge (e.g., Expert, Contributor)"
              />
            </div>
          </CardContent>
        </Card>

        {/* Social Links */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Social Links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: 'twitter', label: 'Twitter', placeholder: '@username' },
                { name: 'facebook', label: 'Facebook', placeholder: 'facebook.com/username' },
                { name: 'linkedin', label: 'LinkedIn', placeholder: 'linkedin.com/in/username' },
                { name: 'instagram', label: 'Instagram', placeholder: '@username' },
                { name: 'github', label: 'GitHub', placeholder: 'github.com/username' },
                { name: 'youtube', label: 'YouTube', placeholder: 'youtube.com/channel/ID' },
                { name: 'website', label: 'Website', placeholder: 'https://yourwebsite.com' },
              ].map((social) => (
                <div key={social.name} className="space-y-2">
                  <Label htmlFor={social.name} className="flex items-center gap-2">
                    {getSocialIcon(social.name)}
                    {social.label}
                  </Label>
                  <Input
                    id={social.name}
                    name={social.name}
                    value={(formData[social.name as keyof ProfileData] as string) || ''}
                    onChange={handleInputChange}
                    placeholder={social.placeholder}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Background Image */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Background Image</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {formData.background_image_url && (
                <div className="relative h-48 rounded-lg overflow-hidden">
                  <img
                    src={formData.background_image_url}
                    alt="Background"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div>
                <Label htmlFor="background_image">Upload Background Image</Label>
                <Input
                  id="background_image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'background')}
                  className="mt-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
