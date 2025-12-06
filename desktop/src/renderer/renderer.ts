/**
 * ShepWhispr Desktop - Renderer Process
 * 
 * Handles the Recent Sessions UI
 */

// Session data structure
interface Session {
  id: string;
  timestamp: Date;
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
  card.innerHTML = `
    <div class="timestamp">${session.timestamp.toLocaleString()}</div>
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

// Handle button clicks
document.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;
  const action = target.dataset.action;
  const id = target.dataset.id;

  if (action === 'paste' && id) {
    console.log('Paste session:', id);
    // TODO: Send to main process to paste
  } else if (action === 'copy' && id) {
    console.log('Copy session:', id);
    // TODO: Send to main process to copy
  }
});

// Initialize with empty state
renderSessions([]);

console.log('ShepWhispr renderer ready');
