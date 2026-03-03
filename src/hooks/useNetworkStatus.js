// src/hooks/useNetworkStatus.js
import { useState, useEffect } from 'react';

export const useNetworkStatus = (pingInterval = 5000) => { // More frequent pings for quicker detection
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [confirmationCount, setConfirmationCount] = useState(0); // Track consecutive successes
  const requiredConfirmations = 2; // Need 2 successes to confirm online
  const debounceTimeout = 3000; // 3s debounce for status changes

  let debounceTimer;

  const updateStatus = (newStatus) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      setIsOnline(newStatus);
      if (newStatus) {
        localStorage.setItem('lastNetworkStatus', 'online'); // Persist for refresh
      } else {
        localStorage.setItem('lastNetworkStatus', 'offline');
      }
    }, debounceTimeout);
  };

  const ping = async () => {
    try {
      const start = performance.now();
      const response = await fetch('/api/ping', {
        method: 'HEAD',
        cache: 'no-store',
        signal: AbortSignal.timeout(3000), // Shorter timeout for unstable detection
      });
      const latency = performance.now() - start;
      const success = response.ok && latency < 2000; // High latency = unstable

      if (success) {
        setConfirmationCount((prev) => prev + 1);
        if (confirmationCount + 1 >= requiredConfirmations) {
          updateStatus(true);
          setConfirmationCount(0); // Reset
        }
      } else {
        setConfirmationCount(0);
        updateStatus(false);
      }
    } catch {
      setConfirmationCount(0);
      updateStatus(false);
    }
  };

  useEffect(() => {
    // Initial check with fallback from localStorage
    const lastStatus = localStorage.getItem('lastNetworkStatus');
    setIsOnline(lastStatus === 'online' ? true : navigator.onLine);

    window.addEventListener('online', () => ping()); // Trigger ping on event
    window.addEventListener('offline', () => updateStatus(false));

    ping(); // Immediate initial ping
    const interval = setInterval(ping, pingInterval);

    return () => {
      window.removeEventListener('online', () => ping());
      window.removeEventListener('offline', () => updateStatus(false));
      clearInterval(interval);
      clearTimeout(debounceTimer);
    };
  }, []);

  return isOnline;
};