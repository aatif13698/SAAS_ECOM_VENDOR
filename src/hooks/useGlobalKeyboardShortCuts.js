// src/hooks/useGlobalKeyboardShortcuts.js
import { useEffect, useCallback } from 'react';

export const useGlobalKeyboardShortcuts = (shortcuts) => {
  const handleKeyDown = useCallback((event) => {
    // ── 1. Skip when user is typing in input fields (very important for accounting apps)
    const target = event.target;
    if (
      target &&
      (target.tagName === 'INPUT' ||
       target.tagName === 'TEXTAREA' ||
       target.tagName === 'SELECT' ||
       target.isContentEditable === true ||
       target.getAttribute('role') === 'textbox')
    ) {
      return;
    }

    // ── 2. Build shortcut string (e.g., "alt+s", "ctrl+shift+p")
    let combo = '';
    if (event.ctrlKey) combo += 'ctrl+';
    if (event.altKey) combo += 'alt+';
    if (event.shiftKey) combo += 'shift+';
    combo += event.key.toLowerCase();

    // ── 3. Execute the matching action
    const action = shortcuts[combo];
    if (action) {
      event.preventDefault();
      event.stopImmediatePropagation();
      action();
    }
  }, [shortcuts]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown, { passive: false });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
};