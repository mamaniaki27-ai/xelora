export const HUMAN_CHECK_KEY = 'xelora-human-ok';

export function humanCheckPassed(): boolean {
  try {
    return sessionStorage.getItem(HUMAN_CHECK_KEY) === '1';
  } catch {
    return false;
  }
}

export function markHumanCheckPassed() {
  try {
    sessionStorage.setItem(HUMAN_CHECK_KEY, '1');
  } catch {
    /* Private browsing can block storage; the in-memory pass still reveals the site. */
  }
}
