'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isTokenValid, startTokenExpiryMonitor, setTokenExpiryHandler, adminLogout } from '@/app/lib/admin-auth';
import SessionExpiredModal from './SessionExpiredModal';

/**
 * Component to monitor admin token expiration and handle automatic logout
 * This should be included in admin layout or on each admin page
 */
export default function AdminTokenMonitor() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Check if token is already expired on mount
    if (!isTokenValid()) {
      // Token is already expired, show modal
      setShowModal(true);
      return;
    }

    // Set up token expiry handler
    setTokenExpiryHandler(() => {
      // Show the session expired modal
      setShowModal(true);
    });

    // Start monitoring token expiry
    startTokenExpiryMonitor();

    // Clean up on unmount
    return () => {
      // No need to explicitly stop the monitor as it's handled globally
    };
  }, [router]);

  const handleLogout = () => {
    // Close modal and logout
    setShowModal(false);
    adminLogout(router);
  };

  const handleStayOnPage = () => {
    // Just close the modal, but the token is still expired
    // Next API call will likely fail and redirect to login
    setShowModal(false);
  };

  return (
    <SessionExpiredModal
      isOpen={showModal}
      onClose={handleStayOnPage}
      onConfirm={handleLogout}
      countdownSeconds={10}
    />
  );
} 