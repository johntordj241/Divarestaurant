import React from 'react';
import { useAuthContext } from './AuthProvider';
import { AuthModal } from './AuthModal';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuthContext();
  const [showAuthModal, setShowAuthModal] = React.useState(false);

  React.useEffect(() => {
    if (!loading && !user) {
      setShowAuthModal(true);
    }
  }, [loading, user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      {children}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
}