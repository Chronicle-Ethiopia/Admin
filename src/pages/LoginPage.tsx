import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Eye, EyeOff, Shield, User, Lock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface LoginFormData {
  email: string;
  password: string;
}

interface UserProfile {
  id: string;
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
  role: 'user' | 'admin' | 'moderator' | 'editor';
  is_active: boolean;
  blocked: boolean;
  last_login_at: string | null;
  login_count: number | null;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const updateUserLoginInfo = async (userId: string) => {
    try {
      const now = new Date().toISOString();
      
      // Optimized single query with dynamic access
      const profilesTable = (supabaseAdmin as any).from('profiles');
      const query = profilesTable.select('login_count').eq('id', userId);
      const { data: currentProfile } = await query.single();
      
      if (currentProfile) {
        const currentCount = currentProfile.login_count || 0;
        
        // Direct update without extra operations
        await profilesTable.update({
          last_login_at: now,
          login_count: currentCount + 1
        }).eq('id', userId);
      }
    } catch (error) {
      console.error('Error updating login info:', error);
      // Don't throw error to avoid blocking login
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Validate input
      if (!formData.email || !formData.password) {
        setError('Please enter both email and password');
        return;
      }

      // Step 1: Authenticate with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      if (!authData.user) {
        setError('Authentication failed');
        return;
      }

      // Step 2: Get user profile from database
      const { data: profile, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileError) {
        setError('User profile not found');
        // Sign out the user if profile doesn't exist
        await supabase.auth.signOut();
        return;
      }

      const userProfile = profile as UserProfile;

      // Step 3: Check if user is blocked
      if (userProfile.blocked) {
        setError('Your account has been blocked. Please contact administrator.');
        await supabase.auth.signOut();
        return;
      }

      // Step 4: Check if user is active
      if (userProfile.is_active === false) {
        setError('Your account is not active. Please contact administrator.');
        await supabase.auth.signOut();
        return;
      }

      // Step 5: Check user role and redirect accordingly
      const userRole = userProfile.role;
      
      // Update login information
      await updateUserLoginInfo(userProfile.id);

      // Show success message
      toast.success(`Welcome back, ${userProfile.full_name}!`);

      // Redirect based on role
      switch (userRole) {
        case 'admin':
        case 'moderator':
        case 'editor':
          navigate('/admin');
          break;
        case 'user':
          navigate('/');
          break;
        default:
          setError('Invalid user role. Please contact administrator.');
          await supabase.auth.signOut();
      }

    } catch (error) {
      console.error('Login error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
            <Shield className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Admin Portal</h1>
          <p className="text-muted-foreground mt-2">Sign in to access your dashboard</p>
        </div>

        {/* Login Card */}
        <Card className="shadow-lg border-0">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-center text-lg">Welcome Back</CardTitle>
            <p className="text-center text-sm text-muted-foreground">
              Enter your credentials to continue
            </p>
          </CardHeader>
          <CardContent className="pt-0">
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10 pr-10"
                    required
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1 h-8 w-8 p-0"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Error Alert */}
              {error && (
                <Alert variant="destructive" className="py-3">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">{error}</AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            {/* Role Information */}
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <h4 className="text-sm font-medium mb-2">Access Levels:</h4>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Admin - Full system access</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Moderator - Content moderation</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Editor - Content management</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  <span>User - Basic access</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-muted-foreground">
          <p>Protected by enterprise-grade security</p>
          <p className="mt-1">© 2024 Admin Portal. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
