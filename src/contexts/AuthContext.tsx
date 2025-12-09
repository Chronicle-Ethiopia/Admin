import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { toast } from 'sonner';

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
  permissions: Record<string, any> | null;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isModerator: boolean;
  isEditor: boolean;
  hasPermission: (permission: string) => boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      return data as UserProfile;
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return null;
    }
  };

  const refreshProfile = async () => {
    if (user) {
      const userProfile = await fetchUserProfile(user.id);
      setProfile(userProfile);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Error signing out');
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (!profile) return false;
    
    // Admin has all permissions
    if (profile.role === 'admin') return true;
    
    // Check permissions object if it exists
    if (profile.permissions) {
      return profile.permissions[permission] === true;
    }
    
    // Role-based permissions
    const rolePermissions: Record<string, string[]> = {
      moderator: ['moderate_content', 'manage_comments', 'view_analytics'],
      editor: ['create_content', 'edit_content', 'manage_posts'],
      user: ['view_content', 'create_comments']
    };
    
    return rolePermissions[profile.role]?.includes(permission) || false;
  };

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setIsLoading(false);
          return;
        }

        if (session?.user) {
          setUser(session.user);
          const userProfile = await fetchUserProfile(session.user.id);
          
          if (userProfile) {
            // Check if user is blocked or inactive
            if (userProfile.blocked || userProfile.is_active === false) {
              await supabase.auth.signOut();
              toast.error('Your account is not active or has been blocked');
              setIsLoading(false);
              return;
            }
            
            setProfile(userProfile);
          }
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (session?.user) {
          setUser(session.user);
          const userProfile = await fetchUserProfile(session.user.id);
          
          if (userProfile) {
            if (userProfile.blocked || userProfile.is_active === false) {
              await supabase.auth.signOut();
              toast.error('Your account is not active or has been blocked');
              return;
            }
            
            setProfile(userProfile);
          }
        } else {
          setUser(null);
          setProfile(null);
        }
        
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const value: AuthContextType = {
    user,
    profile,
    isLoading,
    isAuthenticated: !!user && !!profile,
    isAdmin: profile?.role === 'admin',
    isModerator: profile?.role === 'moderator',
    isEditor: profile?.role === 'editor',
    hasPermission,
    signOut,
    refreshProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
