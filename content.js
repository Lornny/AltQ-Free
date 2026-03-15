/**
 * AltQ Content Script v7.2.6
 */
console.info("[AltQ] Content v7.2.6 active");

const CONSTANTS = {
  ICONS: {
    CHATGPT: '<svg viewBox="0 0 512 512"><circle cx="256" cy="256" r="256" fill="#10A37F"/><circle cx="368" cy="192" r="24" fill="white"/><circle cx="144" cy="192" r="24" fill="white"/><circle cx="144" cy="288" r="24" fill="white"/><circle cx="368" cy="288" r="24" fill="white"/><circle cx="256" cy="352" r="24" fill="white"/></svg>',
    CLAUDE: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="#D97757"/><path d="M8 10h8M8 14h5" stroke="#fff" stroke-width="1.5"/></svg>',
    PERPLEXITY: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#1A1A1A"/><circle cx="17.5" cy="16.5" r="1" fill="#FFF"/><circle cx="6.5" cy="16.5" r="1" fill="#FFF"/><circle cx="12" cy="12" r="6" fill="none" stroke="#FFF" stroke-width="2"/></svg>',
    GENERIC: [
      '<svg viewBox="0 0 24 24" fill="#4A5568"><path d="M12 2C8.7 2 6 4.7 6 8c0 1.5.5 2.9 1.4 4-.4.5-.8 1.2-.8 2 0 1.7 1.3 3 3 3s3-1.3 3-3c0-.8-.4-1.5-.8-2C13.5 10.9 14 9.5 14 8c0-3.3-2.7-6-6-6z"/></svg>',
      '<svg viewBox="0 0 24 24" fill="#805AD5"><path d="M7 14l-2.5 2.5 1.5 1.5L8.5 15.5 11 18l1.5-1.5L10 14l2.5-2.5L11 10 8.5 12.5 6 10l1.5 1.5L5 14l2.5 2.5 1.5-1.5L11 17.5 13.5 15 12 13.5 14.5 16 16 14.5 13.5 12 16 9.5 14.5 8 12 10.5 9.5 8 8 9.5 10.5 12z"/></svg>',
      '<svg viewBox="0 0 24 24" fill="#3182CE"><path d="M12 2C8.1 2 5 5.1 5 9v2H3v2h2v8h2v-6h2v6h2v-6h2v-6h2v-6h2v-2h2v-2h-2V9c0-3.9-3.1-7-7-7z"/></svg>',
      '<svg viewBox="0 0 24 24" fill="#D69E2E"><path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2z"/></svg>'
    ],
    ADD: '<svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none"><path d="M12 5v14M5 12h14"/></svg>',
    LOCK: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 17a2 2 0 100-4 2 2 0 000 4zm6-9a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V10a2 2 0 012-2h1V6a5 5 0 0110 0v2h1zm-6-5a3 3 0 00-3 3v2h6V6a3 3 0 00-3-3z"/></svg>',
    DELETE: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 6h-3.5l-1-1h-5l-1 1H5v2h14V6zM6 19a2 2 0 002 2h8a2 2 0 002-2V9H6v10z"/></svg>',
    SUMMARY: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h12v2H6zm0 4h9v2H6zm0 4h12v2H6zm0 4h7v2H6z"/></svg>',
    FACTCHECK: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 1010 10A10.01 10.01 0 0012 2zm-1 15l-4-4 1.41-1.41L11 14.17l5.59-5.59L18 10z"/></svg>',
    SETTINGS: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>',
    PROMPT: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4zm-3 9h6v2h-6v-2zm0 4h6v2h-6v-2zm0-8h2v2h-2V9z"/></svg>',
    EDIT: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>'
  },
  PROMPTS: {
    FACTCHECK: "<INSTRUCTIONS>\n1) ALWAYS follow these instructions.\n2) Answer in the language of my message.\n3) Read the chat history before answering; if the query is ambiguous, ask at most one brief clarifying question.\n4) No jokes, rants, or filler — write only what is relevant to my question.\n5) Do not present guesses or speculation as fact. If a fact cannot be confirmed, write: \"I cannot verify this.\"\n6) Quote only real documents and provide precise citations (author, title, date) with links/identifiers.\n7) For controversial topics or those likely to change, use the search/browsing tool and cite sources.\n8) If any part is unverified, label the entire output as Unverified.\n9) Do not suggest additional questions or actions at the end of your answer.\n10) Do not use special characters or emojis.\n11) ALWAYS follow OUTPUT FORMAT and ANSWERING RULES.\n</INSTRUCTIONS>\n\n<OUTPUT FORMAT>\nROLE: {brief: \"Answering as an expert in {specific topic}.\"\nTL;DR: {1–2 sentences with the key point. Omit for pure rewriting tasks}\nANSWER: {step-by-step, structured answer with concrete details and context}\nSOURCES: - [1] {Author, Title, Date} — {URL or identifier} - ...\nVERIFICATION STATUS: {Verified | Partially Verified | Unverified}\n</OUTPUT FORMAT>\n\n<ANSWERING RULES>\n0) Use the language of my message.\n1) In your first message, set an expert role in the ROLE line as \"Answering as an expert in {detailed topic}.\" Do not invent awards; include only verifiable credentials if cited.\n2) Do not deviate from this role unless I explicitly ask you to.\n3) If the topic is time-sensitive or controversial, browse and cite up-to-date sources.\n4) Write naturally and concisely.\n5) Always adhere to the OUTPUT FORMAT. If any claims remain unverified, set VERIFICATION STATUS to Unverified.\n</ANSWERING RULES>\n\n<ANSWERING EXAMPLE>\n// IF THE CHATLOG IS EMPTY:\nROLE: Answering as an expert in 20th-century history\nTL;DR: The key drivers of the event were {1–2 points}.\nANSWER: 1) Context: {brief} 2) Facts: {specific dates, figures} 3) Conclusion: {clear takeaway}\nSOURCES: - [1] {Author, Title, Year} — {URL}\nVERIFICATION STATUS: Verified\n</ANSWERING EXAMPLE>\n",
    SUMMARY: "You are Dr. Elena Voss, a world-class summarization expert with 20+ years in journalism, academia, and AI ethics at institutions like Stanford and Reuters. Your summaries are used by C-suite executives, researchers, and policymakers for high-stakes decision-making.\n\nTASK: Produce a rigorous, impartial summary of the provided text. Analyze it through these lenses:\n1. Core thesis and supporting evidence.\n2. Key arguments, counterpoints, and logical gaps.\n3. Implications for stakeholders (e.g., business, policy, society).\n4. Potential biases, assumptions, or omissions.\n5. Actionable insights or next steps.\n\nRULES (mandatory compliance):\n- Length: 15-20% of original text (max 500 words unless specified).\n- Fidelity: Preserve nuance, tone, and intent—no additions, opinions, or simplifications beyond clarity.\n- Objectivity: Flag subjective claims (e.g., \"Author assumes X without evidence\").\n- Precision: Use domain-specific terms accurately; define if needed for general audiences.\n- Brevity: Eliminate redundancy, examples, and fluff—focus on signal over noise.\n- Inclusivity: Note diverse perspectives if relevant (e.g., underrepresented voices).\n\nTHINK STEP-BY-STEP (show your reasoning briefly before output):\n1. Identify main topic, purpose, and audience of the source.\n2. Extract top 5-8 facts/claims with evidence strength (high/medium/low).\n3. Synthesize into themes.\n4. Evaluate quality (strengths/weaknesses).\n5. Draft output.\n\nOUTPUT STRUCTURE (exact format, no deviations):\n## Executive Summary\n[1-2 sentences: Topic, purpose, and headline finding.]\n\n## Key Findings\n- [Bullet 1: Core idea + evidence.]\n- [Bullet 2: etc.] (3-8 bullets max)\n\n## Analysis & Gaps\n[2-4 sentences: Strengths, biases, unresolved questions.]\n\n## Implications & Recommendations\n[3-5 bullets: Stakeholder impacts + prioritized actions.]\n\n## Source Metadata\n- Original length: [words].\n- Publication: [date/source if available].\n- Confidence score: [High/Medium/Low] + rationale.\n\nBegin your step-by-step thinking now.\n\nTEXT TO SUMMARIZE:"
  }
};

const DEFAULT_SERVICES = [
  { id: "credo", name: "Credo GPT Lite", url: "https://chatgpt.com/g/g-68b0c32d818c81919734f6b769cf1c94-credo-gpt-lite", iconId: 3, custom: false },
  { id: "chatgpt", name: "ChatGPT", url: "https://chatgpt.com/", iconId: 0, custom: false },
  { id: "claude", name: "Claude", url: "https://claude.ai/new", iconId: 1, custom: false },
  { id: "perplexity", name: "Perplexity", url: "https://www.perplexity.ai/", iconId: 2, custom: false }
];

const RIGHT_FEATURES = [
  { id: "summary", title: "Summarize", icon: CONSTANTS.ICONS.SUMMARY, locked: false },
  { id: "factcheck", title: "Fact Check", icon: CONSTANTS.ICONS.FACTCHECK, locked: false }
];

let audioCtx = null;
let popup = null;
let popupHideTimer = null;
let modal = null;
let currentText = "";
let lastSendTime = 0;
let lastScrollY = 0;
let isModalOpen = false;
let currentTheme = "dark";
let soundEnabled = true;
let cachedServices = null;
let mouseUpEvaluationId = null;

// ============================================
// POPUP RESTORE (Return-to-source UX)
// Stores last popup coordinates + text to restore on tab focus/visibility.
// ============================================
let lastPopupState = null; // { xDoc, yDoc, text }

function getSelectionRect() {
  try {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return null;
    const rect = sel.getRangeAt(0).getBoundingClientRect();
    if (!rect || rect.width <= 0) return null;
    return rect;
  } catch (_) {
    return null;
  }
}

function computePopupAnchorFromSelection() {
  const rect = getSelectionRect();
  if (!rect) return null;
  return {
    xDoc: rect.right + window.scrollX,
    yDoc: rect.top + window.scrollY
  };
}

function isPointVisible(xDoc, yDoc) {
  if (typeof xDoc !== "number" || typeof yDoc !== "number") return false;
  const x = xDoc - window.scrollX;
  const y = yDoc - window.scrollY;
  return x >= 0 && x <= window.innerWidth && y >= 0 && y <= window.innerHeight;
}

function tryRestorePopup(reason) {
  if (isModalOpen) return;

  // FIX: check for real live selection in the DOM before any restore attempt.
  // After tab switching the browser may clear or collapse the selection, so
  // getSelectedText() alone is not enough — we must verify rangeCount + isCollapsed.
  try {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) {
      lastPopupState = null;
      return;
    }
  } catch (_) {
    lastPopupState = null;
    return;
  }

  const text = getSelectedText();
  if (!text) {
    lastPopupState = null;
    return;
  }

  // prefer last saved position if still visible
  let anchor = null;
  if (lastPopupState && lastPopupState.xDoc != null && lastPopupState.yDoc != null && isPointVisible(lastPopupState.xDoc, lastPopupState.yDoc)) {
    anchor = { xDoc: lastPopupState.xDoc, yDoc: lastPopupState.yDoc };
  }

  // fallback: compute from selection rect
  if (!anchor) {
    anchor = computePopupAnchorFromSelection();
  }

  if (!anchor) return;

  // refresh popup to reflect current selectedTemplate + services
  showPopup(anchor.xDoc, anchor.yDoc, text);
}

// ============================================
// LIVE SETTINGS APPLY + UI HARD RESET
// Prevents "dead" popup state after returning from Settings
// ============================================
function hardResetUiState() {
  try { document.querySelectorAll("#ai-popup").forEach(removeExistingPopupElement); } catch (_) {}
  try { document.querySelectorAll(".ai-modal").forEach(removeModalElement); } catch (_) {}
  if (popupHideTimer) {
    try { clearTimeout(popupHideTimer); } catch (_) {}
    popupHideTimer = null;
  }
  popup = null;
  modal = null;
  isModalOpen = false;
}

// Soft update: reposition + make visible an existing popup without destroying it.
// Falls back to full showPopup() if no popup element exists yet.
function softUpdatePopup(reason) {
  if (isModalOpen) return;

  const sel = window.getSelection();
  const hasLiveSelection = sel && sel.rangeCount > 0 && !sel.isCollapsed;
  if (!hasLiveSelection) {
    // No selection — clean up any ghost popup and bail.
    if (popup && !isModalOpen) {
      popup.classList.remove("visible");
      if (popupHideTimer) clearTimeout(popupHideTimer);
      popupHideTimer = setTimeout(removePopupIfAllowed, 150);
    }
    lastPopupState = null;
    return;
  }

  const text = getSelectedText();
  if (!text) {
    lastPopupState = null;
    return;
  }

  // Compute current selection position in document coordinates.
  const anchor = computePopupAnchorFromSelection() ||
    (lastPopupState ? { xDoc: lastPopupState.xDoc, yDoc: lastPopupState.yDoc } : null);

  if (!anchor) return;

  if (popup && document.contains(popup)) {
    // Popup element already in DOM — just reposition and reveal (no full rebuild).
    currentText = text;
    lastPopupState = { xDoc: anchor.xDoc, yDoc: anchor.yDoc, text: text };
    positionPopup(anchor.xDoc, anchor.yDoc);
  } else {
    // Popup was removed — full rebuild.
    showPopup(anchor.xDoc, anchor.yDoc, text);
  }
}

function safeRestorePopup(reason) {
  // For settings changes we need a full rebuild because button list may have changed.
  // For tab focus/visibility events we prefer a soft update to avoid flicker.
  if (reason === "settings_changed") {
    const sel = window.getSelection();
    const hasLiveSelection = sel && sel.rangeCount > 0 && !sel.isCollapsed && getSelectedText().length > 0;
    if (!hasLiveSelection) {
      hardResetUiState();
      lastPopupState = null;
      return;
    }
    hardResetUiState();
    tryRestorePopup(reason);
  } else {
    softUpdatePopup(reason);
  }
}

function onTabHidden() {
  // Clear the saved popup anchor completely so that after sleep/freeze the popup
  // is NOT restored on wake. After sleep the browser always drops the selection,
  // so restoring without a live selection would produce a ghost popup.
  lastPopupState = null;
  if (popup && !isModalOpen) {
    popup.classList.remove("visible");
  }
}

function onTabVisible() {
  // Tab became visible again — soft-update restores only if there is still a
  // live DOM selection. After normal tab-switch the selection is preserved;
  // after sleep/freeze it is gone, so softUpdatePopup will bail cleanly.
  setTimeout(function restoreOnVisible() {
    safeRestorePopup("visibility");
  }, 80);
}

function handleVisibilityChange() {
  if (document.hidden) {
    onTabHidden();
  } else {
    onTabVisible();
  }
}

function handleWindowFocus() {
  // FIX: use a slightly longer delay (120ms vs 50ms) to give the browser time
  // to settle the selection state after returning to the tab. Some browsers
  // asynchronously restore or clear the selection on focus, so 50ms was too short
  // and could trigger a restore before getSelection() returned the correct value.
  setTimeout(function restoreOnFocus() {
    safeRestorePopup("focus");
  }, 120);
}

function handleReturnedToSourceMessage(request, sender, sendResponse) {
  if (request && request.action === "altq_returned_to_source") {
    // Soft update: keep the popup element alive and just reposition it.
    // Use a slightly longer delay so the tab has time to fully regain focus.
    setTimeout(function restoreOnReturn() {
      safeRestorePopup("return_to_source");
    }, 150);
    sendResponse({ ok: true });
    return true;
  }
  return false;
}

// ============================================
// TEMPLATE PIN (Selected Prompt/Feature) for Alt+Q
// Stored in chrome.storage.local to persist across pages/tabs
// ============================================
const SELECTED_TEMPLATE_KEY = "selectedTemplate";
let selectedTemplate = null;

function isSelectedTemplate(type, id) {
  return !!(selectedTemplate && selectedTemplate.type === type && selectedTemplate.id === id);
}

function getSelectedTemplate() {
  return new Promise(function selectedTemplatePromise(resolve) {
    try {
      chrome.storage.local.get([SELECTED_TEMPLATE_KEY], function onGetSelectedTemplate(data) {
        if (chrome.runtime.lastError) {
          resolve(null);
          return;
        }
        const v = data ? data[SELECTED_TEMPLATE_KEY] : null;
        resolve(v || null);
      });
    } catch (e) {
      resolve(null);
    }
  });
}

function setSelectedTemplate(payload) {
  selectedTemplate = payload || null;
  return safeStorageSet({ [SELECTED_TEMPLATE_KEY]: selectedTemplate });
}

function evaluateMouseSelection(event) {
  const text = getSelectedText();
  if (!text || isInputElement(event?.target)) {
    if (!text) hidePopup();
    return;
  }
  try {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const rect = selection.getRangeAt(0).getBoundingClientRect();
    if (rect.width > 0) {
      showPopup(rect.right + window.scrollX, rect.top + window.scrollY, text);
    }
  } catch (error) {}
}

function scheduleSelectionEvaluation(targetElement) {
  if (mouseUpEvaluationId) clearTimeout(mouseUpEvaluationId);
  mouseUpEvaluationId = setTimeout(function pendingSelectionEvaluation() {
    mouseUpEvaluationId = null;
    evaluateMouseSelection({ target: targetElement });
  }, 10);
}

function removeExistingPopupElement(element) {
  element.remove();
}

function findServiceById(id) {
  return DEFAULT_SERVICES.find(function matchService(service) {
    return service.id === id;
  });
}

function getFeatureButtonLabel(feature) {
  return feature.title + (feature.locked ? " (PRO)" : "");
}

function removeModalElement(element) {
  element.remove();
}

function normalizePromptForSend(promptText) {
  // Remove trailing whitespace/newlines to ensure exactly one blank line before the selected text
  return String(promptText || "").replace(/[\s\u00A0]+$/g, "");
}

function buildTemplatePayload(promptText, selectedText) {
  const prompt = normalizePromptForSend(promptText);
  const text = String(selectedText || "").trim();
  return prompt + "\n\n" + text;
}

function handleFeatureButtonAction(feature) {
  if (!feature || !currentText) {
    return;
  }
  if (feature.locked) {
    chrome.runtime.sendMessage({ action: "open_pro_link" });
    hidePopup();
    return;
  }
  if (feature.id === "factcheck") {
    const target = findServiceById("perplexity") || { url: "https://www.perplexity.ai/", id: "perplexity" };
    sendToAI(target, buildTemplatePayload(CONSTANTS.PROMPTS.FACTCHECK, currentText), true);
    return;
  }
  if (feature.id === "summary") {
    const target = findServiceById("credo") || { url: "https://chatgpt.com/g/g-68b0c32d818c81919734f6b769cf1c94-credo-gpt-lite", id: "credo" };
    sendToAI(target, buildTemplatePayload(CONSTANTS.PROMPTS.SUMMARY, currentText), true);
  }
}

function cleanup() {
  // FIX: clear saved popup anchor so that if the page is restored from cache
  // (bfcache) or the tab is re-opened, no ghost popup is recreated.
  lastPopupState = null;
  if (audioCtx) {
    try { if (audioCtx.state !== "closed") audioCtx.close(); } catch (e) {}
    audioCtx = null;
  }
  window.removeEventListener("mouseup", handleMouseUp);
  window.removeEventListener("mousedown", handleMouseDown);
  window.removeEventListener("scroll", handleScroll);
  window.removeEventListener("keydown", handleKeydown);
  document.removeEventListener("visibilitychange", handleVisibilityChange);
  window.removeEventListener("focus", handleWindowFocus);
  try { chrome.runtime.onMessage.removeListener(handleReturnedToSourceMessage); } catch (_) {}
  window.removeEventListener("beforeunload", cleanup);
  if (popupHideTimer) {
    try { clearTimeout(popupHideTimer); } catch (_) {}
    popupHideTimer = null;
  }
  if (popup) popup.remove();
  if (modal) modal.remove();
}
window.addEventListener("beforeunload", cleanup);

function applyStoredTheme(data) {
  if (!data || !data.theme || data.theme === "system") {
    const sysDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    currentTheme = sysDark ? "dark" : "light";
  } else {
    currentTheme = data.theme;
  }
}

chrome.storage.local.get(["theme"], applyStoredTheme);

function applyStoredSoundSetting(data) {
  if (data && typeof data.soundEnabled === "boolean") {
    soundEnabled = data.soundEnabled;
  } else {
    soundEnabled = true;
  }
}

chrome.storage.local.get(["soundEnabled"], applyStoredSoundSetting);

function applyStoredSelectedTemplate(data) {
  if (data && data[SELECTED_TEMPLATE_KEY]) {
    selectedTemplate = data[SELECTED_TEMPLATE_KEY];
  } else {
    selectedTemplate = null;
  }
}

chrome.storage.local.get([SELECTED_TEMPLATE_KEY], applyStoredSelectedTemplate);

function syncStorageChanges(changes, area) {
  if (area !== "local") return;

  if (changes.theme) {
    if (changes.theme.newValue === "system") {
      const sysDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      currentTheme = sysDark ? "dark" : "light";
    } else {
      currentTheme = changes.theme.newValue === "light" ? "light" : "dark";
    }
    if (popup) popup.dataset.theme = currentTheme;
    if (modal) modal.dataset.theme = currentTheme;
  }

  if (changes[SELECTED_TEMPLATE_KEY]) {
    selectedTemplate = changes[SELECTED_TEMPLATE_KEY].newValue || null;
  }

  if (changes.soundEnabled) {
    soundEnabled = !!changes.soundEnabled.newValue;
  }

  // Live apply Tab Settings without page reload
  if (changes.tabPosition || changes.chatMode || changes.insertMode || changes.focusMode) {
    // These settings affect background tab behavior & injector mode.
    // We reset UI state to prevent a "dead" popup after returning from Settings.
    cachedServices = null;
    setTimeout(function restoreAfterSettingsChange() {
      safeRestorePopup("settings_changed");
    }, 50);
  }

  if (changes.customServices || changes.lastUsedId) cachedServices = null;
}

chrome.storage.onChanged.addListener(syncStorageChanges);

function safeStorageSet(payload) {
  return new Promise(function safeStorageSetPromise(resolve) {
    try {
      chrome.storage.local.set(payload, function onStorageSet() {
        if (chrome.runtime.lastError) {
          console.error("[AltQ] storage.set error", chrome.runtime.lastError, payload);
          resolve(false);
        } else {
          resolve(true);
        }
      });
    } catch (error) {
      console.error("[AltQ] storage.set exception", error, payload);
      resolve(false);
    }
  });
}

function playSound() {
  if (!soundEnabled) return;
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === "suspended") audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.frequency.setValueAtTime(800, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.08);
  } catch (e) {}
}

function getIcon(iconId) {
  const idx = typeof iconId === "number" ? iconId : 3;
  if (idx < 3) return idx === 0 ? CONSTANTS.ICONS.CHATGPT : idx === 1 ? CONSTANTS.ICONS.CLAUDE : CONSTANTS.ICONS.PERPLEXITY;
  return CONSTANTS.ICONS.GENERIC[idx % CONSTANTS.ICONS.GENERIC.length] || CONSTANTS.ICONS.GENERIC[0];
}

function getAllServices() {
  if (cachedServices) return Promise.resolve(cachedServices);
  return new Promise(function allServicesPromise(resolve) {
    chrome.storage.local.get(["customServices", "lastUsedId"], function onGetAllServices(storage) {
      if (chrome.runtime.lastError) {
        resolve(DEFAULT_SERVICES.slice(0, 7));
        return;
      }
      const custom = (storage && storage.customServices) || [];
      const lastId = (storage && storage.lastUsedId) || "credo";
      const all = [...DEFAULT_SERVICES, ...custom].slice(0, 7);

      function matchLastUsedService(svc) {
        return svc && svc.id === lastId;
      }

      const lastIdx = all.findIndex(matchLastUsedService);
      if (lastIdx > 0) {
        const [item] = all.splice(lastIdx, 1);
        if (item) all.unshift(item);
      }
      cachedServices = all;
      resolve(all);
    });
  });
}

function sendToAI(svc, text, isTemplate) {
  if (!text || !svc || !svc.url) return;
  if (text.length > 20000 && !confirm(`Text too long (${text.length}) chars. Continue?`)) return;
  if (Date.now() - lastSendTime < 1500) return;
  lastSendTime = Date.now();
  playSound();
  chrome.runtime.sendMessage({
    action: "open_ai",
    url: svc.url,
    serviceId: svc.id,
    pendingText: text,
    selector: svc.selector || "",
    isTemplate: !!isTemplate
  });
  isModalOpen = false;
  hidePopup();
}

function hidePopup() {
  if (!popup || isModalOpen) return;
  popup.classList.remove("visible");
  if (popupHideTimer) clearTimeout(popupHideTimer);
  popupHideTimer = setTimeout(removePopupIfAllowed, 150);
}

function sendToLastUsed(text) {
  function handleServicesResolved(all) {
    sendToAI(all[0] || DEFAULT_SERVICES[0], text, false);
  }
  getAllServices().then(handleServicesResolved);
}

function removePopupIfAllowed() {
  if (popup && !isModalOpen) {
    popup.remove();
    popup = null;
  }
}

function createPopupRefreshHandler(x, y) {
  return function popupRefreshHandler() {
    if (currentText) {
      showPopup(x, y, currentText);
    }
  };
}

function schedulePopupRefresh(x, y) {
  hidePopup();
  setTimeout(createPopupRefreshHandler(x, y), 200);
}

function handleDisabledButtonMouseDown(event) {
  event.preventDefault();
  event.stopPropagation();
}

function createMouseDownHandler(callback) {
  return function handleButtonMouseDown(event) {
    if (event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    if (typeof callback === "function") {
      callback(event);
    }
  };
}

function createButton(html, title, onClick, disabled = false) {
  const btn = document.createElement("div");
  btn.className = "ai-btn";
  btn.innerHTML = html;
  btn.title = title;
  if (disabled || typeof onClick !== "function") {
    btn.classList.add("disabled");
    btn.addEventListener("mousedown", handleDisabledButtonMouseDown);
  } else {
    btn.addEventListener("mousedown", createMouseDownHandler(onClick));
  }
  return btn;
}

function showPopup(x, y, text) {
  if (!text || !document.body) return;
  document.querySelectorAll("#ai-popup").forEach(removeExistingPopupElement);
  if (popupHideTimer) clearTimeout(popupHideTimer);
  popup = null;
  currentText = text;
  lastScrollY = window.scrollY;

  // Save last popup anchor for restore after tab switching
  lastPopupState = { xDoc: x, yDoc: y, text };

  popup = document.createElement("div");
  popup.id = "ai-popup";
  popup.dataset.theme = currentTheme;
  getAllServices().then(createServiceResolver(x, y));
}

function createServiceResolver(x, y) {
  return function serviceResolver(allServices) {
    if (!popup) return;
    buildPopupColumns(allServices, x, y);
  };
}

function buildPopupColumns(allServices, x, y) {
  const leftCol = buildLeftColumn(allServices, x, y);
  const rightCol = buildRightColumn(allServices, x, y);
  popup.appendChild(leftCol);
  popup.appendChild(rightCol);
  document.body.appendChild(popup);
  positionPopup(x, y);
}

function buildLeftColumn(allServices, x, y) {
  const leftCol = document.createElement("div");
  leftCol.className = "ai-col";
  for (let idx = 0; idx < allServices.length; idx += 1) {
    const svc = allServices[idx];
    const wrap = document.createElement("div");
    wrap.className = "ai-btn-wrap" + (idx === 0 ? " active" : "");
    const btn = createButton(getIcon(svc.iconId), svc.name, createServiceClickHandler(svc));
    wrap.appendChild(btn);
    if (svc.custom) {
      const delBtn = document.createElement("div");
      delBtn.className = "ai-del-btn";
      delBtn.innerHTML = CONSTANTS.ICONS.DELETE;
      delBtn.title = `Delete ${svc.name}`;
      delBtn.onmousedown = createServiceDeleteHandler(svc.id, x, y);
      wrap.appendChild(delBtn);
    }
    leftCol.appendChild(wrap);
  }
  /* Disabled in v7.2.3: Add Custom AI button hidden (code preserved)
  if (allServices.length < 7) {
    appendAddCustomServiceButton(leftCol);
  }
  */
  return leftCol;
}

function createServiceClickHandler(service) {
  return function serviceClickHandler() {
    // If user manually chooses a service, switch Alt+Q back to simple send mode
    setSelectedTemplate(null);
    sendToAI(service, currentText, false);
  };
}

function createServiceDeleteHandler(serviceId, x, y) {
  return function serviceDeleteHandler(event) {
    event.preventDefault();
    event.stopPropagation();
    removeCustomService(serviceId).then(function afterServiceDelete() { schedulePopupRefresh(x, y); });
  };
}

/* Disabled in v7.2.3: Add Custom AI button hidden (code preserved)
function appendAddCustomServiceButton(leftCol) {
  const addWrap = document.createElement("div");
  addWrap.className = "ai-btn-wrap add";
  const addBtn = createButton(CONSTANTS.ICONS.ADD, "Add Custom AI (Coming Soon)", null, true);
  addBtn.className += " add-btn";
  addWrap.appendChild(addBtn);
  leftCol.appendChild(addWrap);
}
*/

function buildRightColumn(allServices, x, y) {
  const rightCol = document.createElement("div");
  rightCol.className = "ai-col pro";
  renderRightFeatures(rightCol);
  populateCustomPrompts(rightCol, allServices, x, y);
  return rightCol;
}

function renderRightFeatures(rightCol) {
  for (let i = 0; i < RIGHT_FEATURES.length; i += 1) {
    const feature = RIGHT_FEATURES[i];
    const wrap = document.createElement("div");
    const active = isSelectedTemplate("feature", feature.id);
    wrap.className = "ai-btn-wrap" + (active ? " active" : "");
    let html = feature.icon;
    if (feature.locked) {
      html += `<div class="lock-overlay">${CONSTANTS.ICONS.LOCK}</div>`;
    }
    const btn = createButton(html, getFeatureButtonLabel(feature), function featureClickHandler(event) {
      // Toggle selection for Alt+Q
      if (isSelectedTemplate("feature", feature.id)) {
        // If already selected: unpin only (do not send)
        setSelectedTemplate(null);
        try {
          const wrapEl = event?.currentTarget?.closest && event.currentTarget.closest(".ai-btn-wrap");
          if (wrapEl) wrapEl.classList.remove("active");
        } catch (_) {}
        return;
      }

      // If not selected: pin + send
      setSelectedTemplate({ type: "feature", id: feature.id });
      handleFeatureButtonAction(feature);
    });
    wrap.appendChild(btn);
    rightCol.appendChild(wrap);
  }
}

function isCustomTemplatesEnabled() {
  return new Promise(function customTemplatesEnabledPromise(resolve) {
    try {
      chrome.storage.local.get(["features"], function onGetFeatures(storage) {
        const features = (storage && storage.features) || {};
        resolve(!!features.customTemplates);
      });
    } catch (_) {
      resolve(false);
    }
  });
}

function openBuyPro() {
  try {
    chrome.runtime.sendMessage({ action: "open_pro_link" });
  } catch (_) {}
}

function populateCustomPrompts(rightCol, allServices, x, y) {
  getCustomPrompts().then(function handleCustomPrompts(customPrompts) {
    isCustomTemplatesEnabled().then(function handleCustomTemplatesFlag(enabled) {
      for (let i = 0; i < customPrompts.length; i += 1) {
        const prompt = customPrompts[i];
        const wrap = document.createElement("div");
        const active = isSelectedTemplate("prompt", prompt.id);
        wrap.className = "ai-btn-wrap" + (active ? " active" : "");

        // In Free: custom prompts are visible but not usable (soft paywall)
        const clickHandler = enabled ? createPromptClickHandler(prompt, allServices) : function lockedPromptClickHandler() { openBuyPro(); };
        const btn = createButton(CONSTANTS.ICONS.PROMPT, enabled ? prompt.title : (prompt.title + " (PRO)"), clickHandler, !enabled);
        wrap.appendChild(btn);

        if (enabled) {
          const editBtn = document.createElement("div");
          editBtn.className = "ai-edit-btn";
          editBtn.innerHTML = CONSTANTS.ICONS.EDIT;
          editBtn.title = "Edit " + prompt.title;
          editBtn.onmousedown = createPromptEditHandler(prompt, x, y);
          wrap.appendChild(editBtn);

          const delBtn = document.createElement("div");
          delBtn.className = "ai-del-btn";
          delBtn.innerHTML = CONSTANTS.ICONS.DELETE;
          delBtn.title = "Delete " + prompt.title;
          delBtn.onmousedown = createPromptDeleteHandler(prompt.id, x, y);
          wrap.appendChild(delBtn);
        }

        rightCol.appendChild(wrap);
      }

      if (enabled) {
        if (customPrompts.length < 3) {
          appendCustomPromptAddButton(rightCol, x, y);
        }
      } else {
        appendBuyProCustomPromptButton(rightCol);
      }

      appendSettingsButton(rightCol);
    });
  });
}

function createPromptClickHandler(prompt, services) {
  return function promptClickHandler(event) {
    if (!currentText) return;

    // Toggle selection for Alt+Q
    if (isSelectedTemplate("prompt", prompt.id)) {
      // If already selected: unpin only (do not send)
      setSelectedTemplate(null);
      try {
        const wrapEl = event?.currentTarget?.closest && event.currentTarget.closest(".ai-btn-wrap");
        if (wrapEl) wrapEl.classList.remove("active");
      } catch (_) {}
      return;
    }

    // If not selected: pin + send
    setSelectedTemplate({ type: "prompt", id: prompt.id });

    function matchService(service) {
      return service.id === prompt.targetServiceId;
    }
    const targetSvc = services.find(matchService) || services[0];
    sendToAI(targetSvc, buildTemplatePayload(prompt.text, currentText), true);
  };
}

function createPromptEditHandler(prompt, x, y) {
  return function promptEditHandler(event) {
    event.preventDefault();
    event.stopPropagation();
    showPromptModal(function savePrompt(newTitle, newText, newServiceId) {
      updateCustomPrompt(prompt.id, newTitle, newText, newServiceId).then(function handleUpdate(ok) {
        if (ok) {
          schedulePopupRefresh(x, y);
        }
      });
    }, prompt);
  };
}

function createPromptDeleteHandler(promptId, x, y) {
  return function promptDeleteHandler(event) {
    event.preventDefault();
    event.stopPropagation();
    deleteCustomPrompt(promptId).then(function handleDeletion() {
      schedulePopupRefresh(x, y);
    });
  };
}

function appendBuyProCustomPromptButton(rightCol) {
  const addWrap = document.createElement("div");
  addWrap.className = "ai-btn-wrap add";
  const html = CONSTANTS.ICONS.LOCK;
  const addBtn = createButton(html, "Buy PRO", function handleBuyProClick() {
    openBuyPro();
  });
  addBtn.className += " add-btn";
  rightCol.appendChild(addWrap);
  addWrap.appendChild(addBtn);
}

function appendCustomPromptAddButton(rightCol, x, y) {
  const addWrap = document.createElement("div");
  addWrap.className = "ai-btn-wrap add";
  const addBtn = createButton(CONSTANTS.ICONS.ADD, "Add Custom Prompt", function addPromptHandler() {
    showPromptModal(function saveNewPrompt(title, text, serviceId) {
      saveCustomPrompt(title, text, serviceId).then(function handleSave(ok) {
        if (ok) {
          schedulePopupRefresh(x, y);
        }
      });
    });
  });
  addBtn.className += " add-btn";
  addWrap.appendChild(addBtn);
  rightCol.appendChild(addWrap);
}

function appendSettingsButton(rightCol) {
  const settingsWrap = document.createElement("div");
  settingsWrap.className = "ai-btn-wrap";
  const settingsBtn = createButton(CONSTANTS.ICONS.SETTINGS, "Settings", function settingsClickHandler() {
    try {
      chrome.runtime.openOptionsPage();
    } catch (error) {
      chrome.runtime.sendMessage({ action: "open_settings" });
    }
    hidePopup();
  });
  settingsBtn.className += " feature-btn";
  settingsWrap.appendChild(settingsBtn);
  rightCol.appendChild(settingsWrap);
}

function positionPopup(x, y) {
  const rect = popup.getBoundingClientRect();
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  let posX = x + 12;
  let posY = y;
  if (posX + rect.width > vw - 10) posX = x - rect.width - 12;
  if (posX < 10) posX = 10;
  if (posY + rect.height > vh + window.scrollY - 10) posY = vh + window.scrollY - rect.height - 10;
  if (posY < window.scrollY + 10) posY = window.scrollY + 10;
  popup.style.left = `${posX}px`;
  popup.style.top = `${posY}px`;
  requestAnimationFrame(function showPopupFrame() {
    if (popup) {
      popup.classList.add("visible");
    }
  });
}

function getSelectedText() {
  try {
    const sel = window.getSelection();
    return sel && sel.rangeCount ? sel.toString().trim() : "";
  } catch (e) {
    return "";
  }
}

function isInputElement(el) {
  if (!el) return false;
  const tag = el.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA") return true;
  if (el.isContentEditable) return true;
  return !!(el.closest && el.closest('[contenteditable="true"]'));
}

function handleMouseUp(event) {
  if (isModalOpen) return;
  if (popup && popup.contains(event.target)) return;
  scheduleSelectionEvaluation(event.target);
}

function handleMouseDown(e) {
  if (isModalOpen) return;
  if (popup && !popup.contains(e.target)) hidePopup();
}

function handleScroll() {
  if (isModalOpen) return;
  if (!popup) return;

  const rect = getSelectionRect();

  // Selection no longer in DOM (e.g. dynamic content replaced it) — hide popup.
  if (!rect) {
    hidePopup();
    return;
  }

  // Selection still exists: reposition the popup to follow it.
  // If the selection has scrolled completely off-screen, hide the popup;
  // when the user scrolls back, it will reappear via the scroll repositioning.
  const selViewportTop = rect.top;
  const selViewportBottom = rect.bottom;
  const aboveViewport = selViewportBottom < 0;
  const belowViewport = selViewportTop > window.innerHeight;

  if (aboveViewport || belowViewport) {
    // Temporarily hide (CSS only — do not destroy the element) so there is no
    // floating popup while the selection is out of view.
    popup.classList.remove("visible");
  } else {
    // Selection is visible — move popup to current selection position and show.
    const newXDoc = rect.right + window.scrollX;
    const newYDoc = rect.top + window.scrollY;
    // Update saved anchor so restore logic uses the fresh position.
    if (lastPopupState) {
      lastPopupState.xDoc = newXDoc;
      lastPopupState.yDoc = newYDoc;
    }
    positionPopup(newXDoc, newYDoc);
  }

  lastScrollY = window.scrollY;
}

function handleKeydown(e) {
  if (e.key === "Escape") {
    if (isModalOpen) hideModal();
    else hidePopup();
    return;
  }

  if (e.altKey && e.code === "KeyQ") {
    e.preventDefault();
    e.stopPropagation();
    const text = getSelectedText();
    if (!text) return;

    getSelectedTemplate().then(function handleSelectedTemplate(tpl) {
      if (!tpl || !tpl.type || !tpl.id) {
        sendToLastUsed(text);
        return;
      }

      // Feature templates (Summarize / Fact Check)
      if (tpl.type === "feature") {
        const feature = RIGHT_FEATURES.find(function matchFeature(f) {
          return f.id === tpl.id;
        });
        if (feature) {
          currentText = text;
          handleFeatureButtonAction(feature);
          return;
        }
      }

      // Custom prompt templates
      if (tpl.type === "prompt") {
        getCustomPrompts().then(function handlePrompts(list) {
          const match = (list || []).find(function matchPrompt(p) {
            return p && p.id === tpl.id;
          });
          if (!match) {
            sendToLastUsed(text);
            return;
          }
          getAllServices().then(function handleServices(services) {
            const svc = (services || []).find(function findSvc(s) {
              return s && s.id === match.targetServiceId;
            }) || (services && services[0]);
            if (!svc) {
              sendToLastUsed(text);
              return;
            }
            sendToAI(svc, buildTemplatePayload(match.text, text), true);
          });
        });
        return;
      }

      sendToLastUsed(text);
    });

    return;
  }

  // Fallback return-to-source hotkey (works even if chrome://extensions/shortcuts is empty)
  if (e.altKey && e.code === "KeyW") {
    e.preventDefault();
    e.stopPropagation();
    chrome.runtime.sendMessage({ action: "return_to_source" });
  }
}

document.addEventListener("mouseup", handleMouseUp);
document.addEventListener("mousedown", handleMouseDown);
document.addEventListener("scroll", handleScroll, { passive: true });
document.addEventListener("keydown", handleKeydown);

document.addEventListener("visibilitychange", handleVisibilityChange);
window.addEventListener("focus", handleWindowFocus);
chrome.runtime.onMessage.addListener(handleReturnedToSourceMessage);

function finalizeHideModal() {
  if (modal) modal.remove();
  modal = null;
  isModalOpen = false;
}

function hideModal() {
  if (!modal) return;
  modal.classList.remove("visible");
  setTimeout(finalizeHideModal, 150);
}

function showModal(onSave) {
  document.querySelectorAll(".ai-modal").forEach(removeModalElement);
  isModalOpen = true;
  modal = document.createElement("div");
  modal.className = "ai-modal";
  modal.dataset.theme = currentTheme;
  const content = document.createElement("div");
  content.className = "ai-modal-content";
  const title = document.createElement("div");
  title.className = "ai-modal-title";
  title.textContent = "Add Custom AI Service";

  const nameInput = document.createElement("input");
  nameInput.className = "ai-modal-input";
  nameInput.placeholder = "e.g. Gemini";
  nameInput.type = "text";
  nameInput.autocomplete = "off";

  const urlInput = document.createElement("input");
  urlInput.className = "ai-modal-input";
  urlInput.placeholder = "https://your-ai.example";
  urlInput.type = "url";
  urlInput.autocomplete = "off";

  const selectorInput = document.createElement("input");
  selectorInput.className = "ai-modal-input";
  selectorInput.placeholder = "Optional CSS selector";
  selectorInput.title = "Needed for complex sites. Example: #prompt-textarea";
  selectorInput.type = "text";
  selectorInput.autocomplete = "off";

  function createModalField(labelText, inputEl, helperText) {
    const wrap = document.createElement("label");
    wrap.className = "ai-modal-field";
    const label = document.createElement("span");
    label.textContent = labelText;
    wrap.appendChild(label);
    wrap.appendChild(inputEl);
    if (helperText) {
      const hint = document.createElement("small");
      hint.textContent = helperText;
      wrap.appendChild(hint);
    }
    return wrap;
  }

  const btns = document.createElement("div");
  btns.className = "ai-modal-btns";
  const cancelBtn = document.createElement("button");
  cancelBtn.className = "ai-modal-btn cancel";
  cancelBtn.textContent = "Cancel";
  cancelBtn.onclick = hideModal;
  const saveBtn = document.createElement("button");
  saveBtn.className = "ai-modal-btn save";
  saveBtn.textContent = "Add";
  saveBtn.onclick = function handleSaveClick() {
    const name = nameInput.value.trim();
    const url = urlInput.value.trim();
    const sel = selectorInput.value.trim();
    if (name && url) {
      hideModal();
      onSave(name, url, sel);
    }
  };
  btns.appendChild(cancelBtn);
  btns.appendChild(saveBtn);

  content.append(
    title,
    createModalField("Service name", nameInput),
    createModalField("Service URL", urlInput, "Use a full https:// address"),
    createModalField("CSS Selector (optional)", selectorInput, "Helps AltQ target non-standard inputs"),
    btns
  );

  modal.appendChild(content);
  document.body.appendChild(modal);
  requestAnimationFrame(function showModalFrame() {
    modal.classList.add("visible");
    nameInput.focus();
  });
}

function addCustomService(name, url, selector) {
  return new Promise(function addCustomServicePromise(resolve) {
    const trimmedName = name.trim();
    const trimmedUrl = url.trim();
    if (!trimmedName || trimmedName.length < 1 || trimmedName.length > 30) {
      alert("Service name must be between 1 and 30 characters.");
      resolve(false);
      return;
    }
    if (!trimmedUrl) {
      alert("Please enter a full https:// URL.");
      resolve(false);
      return;
    }

    function onGetCustomServices(storage) {
      const list = (storage && storage.customServices) || [];
      if (list.length >= 3) {
        alert("You can add up to 3 custom services.");
        resolve(false);
        return;
      }
      let finalUrl = trimmedUrl;
      try {
        const u = new URL(finalUrl);
        if (u.protocol !== "https:") {
          alert("Only https:// URLs are allowed.");
          resolve(false);
          return;
        }
        finalUrl = u.href;
      } catch (e) {
        alert("Invalid URL. Please paste a valid https:// URL.");
        resolve(false);
        return;
      }

      function matchExistingUrl(svc) {
        return svc.url === finalUrl;
      }
      if (list.find(matchExistingUrl)) {
        alert("This service is already added.");
        resolve(false);
        return;
      }
      list.push({
        id: "custom_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
        name: trimmedName,
        url: finalUrl,
        iconId: 3 + (list.length % 4),
        selector: selector || "",
        custom: true
      });

      function onServiceSaved(ok) {
        if (ok) cachedServices = null;
        resolve(ok);
      }
      safeStorageSet({ customServices: list }).then(onServiceSaved);
    }

    chrome.storage.local.get(["customServices"], onGetCustomServices);
  });
}

function removeCustomService(id) {
  return new Promise(function removeCustomServicePromise(resolve) {
    function onGetServicesForRemove(storage) {
      function excludeId(s) {
        return s.id !== id;
      }
      const list = ((storage && storage.customServices) || []).filter(excludeId);
      function onServiceRemoved(ok) {
        if (ok) cachedServices = null;
        resolve(ok);
      }
      safeStorageSet({ customServices: list }).then(onServiceRemoved);
    }
    chrome.storage.local.get(["customServices"], onGetServicesForRemove);
  });
}

// ============================================
// CUSTOM PROMPTS CRUD
// ============================================
function getCustomPrompts() {
  return new Promise(function getCustomPromptsPromise(resolve) {
    function onGetCustomPromptsStorage(storage) {
      if (chrome.runtime.lastError) {
        resolve([]);
        return;
      }
      resolve((storage && storage.customPrompts) || []);
    }
    chrome.storage.local.get(["customPrompts"], onGetCustomPromptsStorage);
  });
}

function saveCustomPrompt(title, text, targetServiceId) {
  return new Promise(function saveCustomPromptPromise(resolve) {
    const trimmedTitle = title.trim();
    const trimmedText = text.trim();
    if (!trimmedTitle || trimmedTitle.length > 20) {
      alert("Title must be between 1 and 20 characters.");
      resolve(false);
      return;
    }
    if (!trimmedText || trimmedText.length > 3000) {
      alert("Prompt text must be between 1 and 3000 characters.");
      resolve(false);
      return;
    }
    getCustomPrompts().then(function onGetPrompts(list) {
      if (list.length >= 3) {
        alert("Maximum 3 custom prompts allowed.");
        resolve(false);
        return;
      }
      list.push({
        id: "prompt_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
        title: trimmedTitle,
        text: trimmedText,
        targetServiceId: targetServiceId || "credo"
      });
      safeStorageSet({ customPrompts: list }).then(resolve);
    });
  });
}

function updateCustomPrompt(id, title, text, targetServiceId) {
  return new Promise(function updateCustomPromptPromise(resolve) {
    const trimmedTitle = title.trim();
    const trimmedText = text.trim();
    if (!trimmedTitle || trimmedTitle.length > 20) {
      alert("Title must be between 1 and 20 characters.");
      resolve(false);
      return;
    }
    if (!trimmedText || trimmedText.length > 3000) {
      alert("Prompt text must be between 1 and 3000 characters.");
      resolve(false);
      return;
    }
    getCustomPrompts().then(function onGetPrompts(list) {
      function matchId(p) { return p && p.id === id; }
      const idx = list.findIndex(matchId);
      if (idx === -1) {
        resolve(false);
        return;
      }
      list[idx] = { id, title: trimmedTitle, text: trimmedText, targetServiceId: targetServiceId || "credo" };
      safeStorageSet({ customPrompts: list }).then(resolve);
    });
  });
}

function deleteCustomPrompt(id) {
  return new Promise(function deleteCustomPromptPromise(resolve) {
    getCustomPrompts().then(function onGetPrompts(list) {
      function keepPrompt(p) { return p && p.id !== id; }
      const filtered = list.filter(keepPrompt);
      safeStorageSet({ customPrompts: filtered }).then(resolve);
    });
  });
}

function showPromptModal(onSave, existingPrompt) {
  document.querySelectorAll(".ai-modal").forEach(removeModalElement);
  isModalOpen = true;
  modal = document.createElement("div");
  modal.className = "ai-modal";
  modal.dataset.theme = currentTheme;

  const content = document.createElement("div");
  content.className = "ai-modal-content";
  content.style.width = "340px";

  const title = document.createElement("div");
  title.className = "ai-modal-title";
  title.textContent = existingPrompt ? "Edit Custom Prompt" : "Add Custom Prompt";

  const titleInput = document.createElement("input");
  titleInput.className = "ai-modal-input";
  titleInput.placeholder = "Prompt name (max 20 chars)";
  titleInput.type = "text";
  titleInput.maxLength = 20;
  titleInput.value = existingPrompt ? existingPrompt.title : "";

  const textArea = document.createElement("textarea");
  textArea.className = "ai-modal-input ai-modal-textarea";
  textArea.placeholder = "Enter your prompt text here...\n\nThe selected text will be appended after this prompt.";
  textArea.maxLength = 3000;
  textArea.value = existingPrompt ? existingPrompt.text : "";

  const charCount = document.createElement("div");
  charCount.className = "ai-char-count";
  charCount.textContent = (existingPrompt ? existingPrompt.text.length : 0) + " / 3000";

  textArea.addEventListener("input", function handlePromptInput() {
    charCount.textContent = textArea.value.length + " / 3000";
  });

  const serviceLabel = document.createElement("span");
  serviceLabel.textContent = "Send to:";
  serviceLabel.style.fontSize = "12px";
  serviceLabel.style.marginBottom = "4px";
  serviceLabel.style.display = "block";

  const serviceSelect = document.createElement("select");
  serviceSelect.className = "ai-modal-input ai-modal-select";

  getAllServices().then(function populateServiceOptions(services) {
    isCustomTemplatesEnabled().then(function handleCustomTemplatesForModal(enabled) {
      if (!enabled) {
        // Free: do not allow editing/adding custom prompts
        try { openBuyPro(); } catch (_) {}
        hideModal();
        return;
      }

      services.forEach(function addServiceOption(svc) {
        const opt = document.createElement("option");
        opt.value = svc.id;
        opt.textContent = svc.name;
        if (existingPrompt && existingPrompt.targetServiceId === svc.id) {
          opt.selected = true;
        }
        serviceSelect.appendChild(opt);
      });
      if (!existingPrompt && services.length > 0) serviceSelect.value = "credo";
    });
  });

  const btns = document.createElement("div");
  btns.className = "ai-modal-btns";

  const cancelBtn = document.createElement("button");
  cancelBtn.className = "ai-modal-btn cancel";
  cancelBtn.textContent = "Cancel";
  cancelBtn.onclick = hideModal;

  const saveBtn = document.createElement("button");
  saveBtn.className = "ai-modal-btn save";
  saveBtn.textContent = existingPrompt ? "Update" : "Save";
  saveBtn.onclick = function handlePromptSave() {
    const promptTitle = titleInput.value.trim();
    const promptText = textArea.value.trim();
    const serviceId = serviceSelect.value;
    if (promptTitle && promptText) {
      hideModal();
      onSave(promptTitle, promptText, serviceId);
    }
  };

  btns.appendChild(cancelBtn);
  btns.appendChild(saveBtn);

  content.appendChild(title);
  content.appendChild(titleInput);
  content.appendChild(textArea);
  content.appendChild(charCount);
  content.appendChild(serviceLabel);
  content.appendChild(serviceSelect);
  content.appendChild(btns);

  modal.appendChild(content);
  document.body.appendChild(modal);
  requestAnimationFrame(function showPromptModalFrame() {
    modal.classList.add("visible");
    titleInput.focus();
  });
}