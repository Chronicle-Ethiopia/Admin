import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'user' | 'admin' | 'moderator' | 'editor';
  requireAuth?: boolean;
  fallback?: ReactNode;
}

export function ProtectedRoute({ 
  children, 
  requiredRole, 
  requireAuth = true,
  fallback 
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, profile } = useAuth();
  const location = useLocation();

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If authentication is required and user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If a specific role is required
  if (requiredRole && profile?.role !== requiredRole) {
    // Check if user has higher privileges (admin can access everything)
    if (profile?.role === 'admin') {
      return <>{children}</>;
    }
    
    // Show fallback or unauthorized message
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="mb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            You don't have permission to access this page. This area requires {requiredRole} privileges.
          </p>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">
              Your current role: <span className="font-medium">{profile?.role || 'Unknown'}</span>
            </p>
            <p className="text-sm text-gray-500">
              Required role: <span className="font-medium">{requiredRole}</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // If all checks pass, render children
  return <>{children}</>;
}

// Higher-order component for role-based protection
export function withRoleProtection(
  Component: React.ComponentType<any>,
  requiredRole?: 'user' | 'admin' | 'moderator' | 'editor'
) {
  return function ProtectedComponent(props: any) {
    return (
      <ProtectedRoute requiredRole={requiredRole}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}

// Admin-only protection
export function AdminRoute({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute requiredRole="admin">
      {children}
    </ProtectedRoute>
  );
}

// Moderator or higher protection
export function ModeratorRoute({ children }: { children: ReactNode }) {
  const { profile } = useAuth();
  
  // Allow admin and moderator
  const hasAccess = profile?.role === 'admin' || profile?.role === 'moderator';
  
  if (!hasAccess) {
    return (
      <ProtectedRoute 
        requiredRole="moderator"
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
              <p className="text-gray-600">This page requires moderator or admin privileges.</p>
            </div>
          </div>
        }
      >
        {children}
      </ProtectedRoute>
    );
  }
  
  return <>{children}</>;
}

// Editor or higher protection
export function EditorRoute({ children }: { children: ReactNode }) {
  const { profile } = useAuth();
  
  // Allow admin, moderator, and editor
  const hasAccess = ['admin', 'moderator', 'editor'].includes(profile?.role || '');
  
  if (!hasAccess) {
    return (
      <ProtectedRoute 
        requiredRole="editor"
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
              <p className="text-gray-600">This page requires editor, moderator, or admin privileges.</p>
            </div>
          </div>
        }
      >
        {children}
      </ProtectedRoute>
    );
  }
  
  return <>{children}</>;
}
