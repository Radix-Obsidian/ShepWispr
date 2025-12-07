/**
 * ShepWhispr Desktop - Renderer Process
 * 
 * Handles the Recent Sessions UI
 */

// Session data structure
interface Session {
  id: string;
  timestamp: string | Date;
  rawSpeech: string;
  structuredPrompt: string;
  intent: string;
  confidence: number;
}

// DOM Elements
const sessionsContainer = document.getElementById('sessions');

/**
 * Render a single session card
 */
function renderSession(session: Session): HTMLElement {
  const card = document.createElement('div');
  card.className = 'session-card';
  
  const timestamp = typeof session.timestamp === 'string' 
    ? new Date(session.timestamp).toLocaleString()
    : session.timestamp.toLocaleString();
  
  card.innerHTML = `
    <div class="timestamp">${timestamp}</div>
    <span class="intent-badge">${session.intent}</span>
    <div class="raw-speech">"${session.rawSpeech}"</div>
    <div class="structured-prompt">${session.structuredPrompt}</div>
    <div class="actions">
      <button class="btn btn-primary" data-action="paste" data-id="${session.id}">Paste</button>
      <button class="btn btn-secondary" data-action="copy" data-id="${session.id}">Copy</button>
    </div>
  `;
  return card;
}

/**
 * Render all sessions or empty state
 */
function renderSessions(sessions: Session[]): void {
  if (!sessionsContainer) return;

  if (sessions.length === 0) {
    sessionsContainer.innerHTML = `
      <div class="empty-state">
        <div class="icon">🐑</div>
        <p>No sessions yet</p>
        <p class="hint">Tap the hotkey, speak your intent, tap again</p>
      </div>
    `;
    return;
  }

  sessionsContainer.innerHTML = '';
  sessions.forEach(session => {
    sessionsContainer.appendChild(renderSession(session));
  });
}

/**
 * Load sessions from main process
 */
async function loadSessions(): Promise<void> {
  try {
    const sessions = await window.shepwhispr.getSessions();
    renderSessions(sessions);
  } catch (error) {
    console.error('Failed to load sessions:', error);
  }
}

// Handle button clicks
document.addEventListener('click', async (e) => {
  const target = e.target as HTMLElement;
  const action = target.dataset.action;
  const id = target.dataset.id;

  if (action === 'paste' && id) {
    try {
      await window.shepwhispr.pasteSession(id);
      console.log('Session pasted:', id);
      
      // Show feedback
      const originalText = target.textContent;
      target.textContent = '✓ Copied to clipboard!';
      target.classList.add('success');
      setTimeout(() => {
        target.textContent = originalText;
        target.classList.remove('success');
      }, 2000);
    } catch (error) {
      console.error('Failed to paste session:', error);
      target.textContent = '✗ Failed';
      setTimeout(() => {
        target.textContent = 'Paste';
      }, 2000);
    }
  } else if (action === 'copy' && id) {
    try {
      await window.shepwhispr.copySession(id);
      console.log('Session copied:', id);
      
      // Show feedback
      const originalText = target.textContent;
      target.textContent = '✓ Copied!';
      target.classList.add('success');
      setTimeout(() => {
        target.textContent = originalText;
        target.classList.remove('success');
      }, 2000);
    } catch (error) {
      console.error('Failed to copy session:', error);
      target.textContent = '✗ Failed';
      setTimeout(() => {
        target.textContent = 'Copy';
      }, 2000);
    }
  }
});

// Listen for new sessions
window.shepwhispr.onNewSession((session: Session) => {
  console.log('New session received:', session);
  loadSessions();
});

// Initialize with sessions from main process
loadSessions();

console.log('ShepWhispr renderer ready');
