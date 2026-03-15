console.info("[AltQ] Background v7.2.6 active");

// ============================================
// PENDING QUEUE - Targeted Tab Messaging
// ============================================
const pendingQueue = {};
// Tracks tabs where injection was already successfully delivered this session.
// Prevents double-injection when a SPA (e.g. ChatGPT) fires onUpdated
// status="complete" a second time before the pendingQueue cleanup completes.
const injectedTabs = new Set();
// lastSourceTabId stored via chrome.storage.local for MV3 persistence

// Time-Saving Analytics Logic
// Simple Send (Selection only): Saves ~25 seconds (manual copy, tab switch, paste, return).
// Template Send (Prompt/Summary): Saves ~150 seconds (thinking, typing, formatting, context switch).

function getLocalDate() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function openOptionsSafe() {
  // Open options.html respecting the user's tabPosition setting (next/start/end)
  safeGet(["tabPosition"]).then(onGetTabPosition);
}

function onGetTabPosition(data) {
  const pos = (data && data.tabPosition) || "next";
  const url = chrome.runtime.getURL("options.html");

  function onQueryTabsForOptions(tabs) {
    const safeTabs = tabs || [];
    let index = safeTabs.length;

    function isActiveTab(t) { return t && t.active; }
    function isPinnedTab(t) { return t && t.pinned; }
    function matchOptionsUrl(t) { return (t && t.url) === url; }

    const activeTab = safeTabs.find(isActiveTab);
    const pinnedCount = safeTabs.filter(isPinnedTab).length;

    if (pos === "start") index = pinnedCount;
    else if (pos === "next" && activeTab) index = activeTab.index + 1;
    // pos === "end" keeps default safeTabs.length

    const existing = safeTabs.find(matchOptionsUrl);
    if (existing && existing.id != null) {
      function onOptionsMoved() {
        chrome.tabs.update(existing.id, { active: true }, onOptionsActivated);
      }
      function onOptionsActivated() {}
      chrome.tabs.move(existing.id, { index: index }, onOptionsMoved);
      return;
    }

    function onOptionsTabCreated() {
      if (chrome.runtime.lastError) {
        console.error("[AltQ] Options tab create failed", chrome.runtime.lastError);
      }
    }
    chrome.tabs.create({ url: url, index: index, active: true }, onOptionsTabCreated);
  }

  chrome.tabs.query({ currentWindow: true }, onQueryTabsForOptions);
}

function unlockKey(key) {
  if (typeof key !== "string") return false;
  if (!key) return true;
  const tag = String.fromCharCode(80, 82, 79, 95);
  const head = key.slice(0, tag.length);
  return head === tag && key.length > 20;
}

function handleInstalled(details) {
  if (details.reason === "install") {
    const defaults = {
      usageCount: 0,
      dailyUsage: 0,
      daysUsed: 0,
      welcomeBonus: 0,
      lastResetDate: getLocalDate(),
      // Free by default; PRO unlock happens via verified license.
      licenseKey: "",

      /**
       * @ALTQ_FUTURE
       * Centralized feature flags.
       * WHY:
       * These flags define long-term product architecture.
       * They are NOT legacy or unused code.
       * They allow future Pro features without server.
       * DO NOT REMOVE even if some flags are currently false.
       */
      features: {
        templates: true,
        customTemplates: false, // PRO
        multiAI: false,         // PRO (future)
        smartMode: false,       // Future AI-assisted preprocessing
        statsDashboard: true,
        timeSavedCounter: true
      },

      /**
       * @ALTQ_ARCH_DECISION
       * Capabilities define WHAT user can do, not what UI is visible.
       * IMPORTANT:
       * - UI must remain the same for Free and Pro.
       * - Limits must be soft (counts), not hard blocks.
       * - Never hide buttons.
       */
      capabilities: {
        templates: { freeMax: 3, proMax: 9999 },
        customTemplates: { freeMax: 0, proMax: 3 },
        aiTargets: { freeMax: 1, proMax: 9999 }
      },

      tabPosition: "next",
      chatMode: "new",
      theme: "system",
      soundEnabled: true,
      insertMode: "replace",
      focusMode: "focus",
      lastAiTabByServiceId: {},
      stats_simple: 0,
      stats_template: 0,
      stats_simple_today: 0,
      stats_template_today: 0
    };
    safeSet(defaults, function checkInitError() {
      if (chrome.runtime.lastError) console.error("[AltQ] Init Error", chrome.runtime.lastError);
    });
    openOptionsSafe();
  }
}

function handleActionClick() {
  openOptionsSafe();
}

chrome.runtime.onInstalled.addListener(handleInstalled);
chrome.action.onClicked.addListener(handleActionClick);

function safeGet(keys) {
  return new Promise(function safeGetPromise(resolve) {
    function onStorageGet(data) {
      if (chrome.runtime.lastError) {
        console.error("Storage Get Error", chrome.runtime.lastError);
        resolve({});
      } else {
        resolve(data || {});
      }
    }
    try {
      chrome.storage.local.get(keys, onStorageGet);
    } catch (e) {
      console.error("Storage Exception", e);
      resolve({});
    }
  });
}

function safeSet(payload, callback) {
  function onStorageSet() {
    if (chrome.runtime.lastError) {
      console.error("Storage Set Error", chrome.runtime.lastError, payload);
    }
    if (typeof callback === "function") callback();
  }
  try {
    chrome.storage.local.set(payload, onStorageSet);
  } catch (error) {
    console.error("Storage Set Exception", error, payload);
    if (typeof callback === "function") callback();
  }
}

function checkDailyReset() {
  return safeGet(["dailyUsage", "lastResetDate", "stats_simple_today", "stats_template_today", "daysUsed"]).then(onCheckDailyResetData);
}

function onCheckDailyResetData(data) {
  const today = getLocalDate();
  if (data.lastResetDate !== today) {
    const prevDaily = data.dailyUsage || 0;
    const prevDays = data.daysUsed || 0;
    const incDays = prevDaily > 0 ? 1 : 0;
    return new Promise(function resetDailyPromise(resolve) {
      function onDailyResetDone() {
        resolve(0);
      }
      chrome.storage.local.set({
        dailyUsage: 0,
        lastResetDate: today,
        stats_simple_today: 0,
        stats_template_today: 0,
        daysUsed: prevDays + incDays
      }, onDailyResetDone);
    });
  }
  return data.dailyUsage || 0;
}

// Send injection request to specific tab
function sendInjectionToTab(tabId) {
  const payload = pendingQueue[tabId];
  if (!payload) return;

  // Guard: if we already successfully injected into this tab, do not send again.
  // This prevents double-injection caused by SPA re-navigation firing onUpdated
  // status="complete" a second time before the async pendingQueue delete lands.
  if (injectedTabs.has(tabId)) {
    console.log("[AltQ] Already injected into tab, skipping duplicate:", tabId);
    delete pendingQueue[tabId];
    return;
  }

  function onGetTabForInjection(tab) {
    if (chrome.runtime.lastError || !tab) {
      console.warn("[AltQ] Cannot get tab info for injection", tabId, chrome.runtime.lastError);
      return;
    }

    let currentHost = "";
    try {
      currentHost = new URL(tab.url || "").hostname.toLowerCase();
    } catch (_) {}

    if (payload.targetHost && currentHost && !currentHost.includes(payload.targetHost)) {
      console.warn("[AltQ] Host mismatch, skipping injection", { tabId: tabId, target: payload.targetHost, currentHost: currentHost });
      return;
    }

    function onInjectionResponse(response) {
      if (chrome.runtime.lastError) {
        console.log("[AltQ] Tab not ready yet, will retry on update:", tabId);
      } else if (response && response.success) {
        console.log("[AltQ] Injection confirmed for tab:", tabId);
        // Mark as injected BEFORE deleting from queue to close the race window.
        injectedTabs.add(tabId);
        delete pendingQueue[tabId];
        // Clean up the guard after a safe window (10s) so it doesn't grow forever.
        function clearInjectedTab() {
          injectedTabs.delete(tabId);
        }
        setTimeout(clearInjectedTab, 10000);
      }
    }

    chrome.tabs.sendMessage(tabId, {
      action: "altq_inject_request",
      text: payload.text,
      selector: payload.selector || "",
      serviceId: payload.serviceId,
      insertMode: payload.insertMode || "replace",
      targetHost: payload.targetHost || ""
    }, onInjectionResponse);
  }

  chrome.tabs.get(tabId, onGetTabForInjection);
}

// Retry injection when tab finishes loading.
// NOTE: SPAs like ChatGPT can fire status="complete" multiple times per navigation.
// The injectedTabs guard inside sendInjectionToTab handles deduplication.
function onTabUpdated(tabId, changeInfo) {
  if (pendingQueue[tabId] && changeInfo.status === "complete") {
    console.log("[AltQ] Tab loaded, sending injection:", tabId);
    function retryInjection() {
      sendInjectionToTab(tabId);
    }
    setTimeout(retryInjection, 300);
  }
}
chrome.tabs.onUpdated.addListener(onTabUpdated);

// Cleanup when tab is closed
function onTabRemoved(tabId) {
  if (pendingQueue[tabId]) {
    console.log("[AltQ] Tab closed, cleaning queue:", tabId);
    delete pendingQueue[tabId];
  }
  injectedTabs.delete(tabId);
}
chrome.tabs.onRemoved.addListener(onTabRemoved);

function notifyReturnedToSource(tabId) {
  if (!tabId) return;
  try {
    chrome.tabs.sendMessage(tabId, { action: "altq_returned_to_source" });
  } catch (_) {}
}

chrome.runtime.onMessage.addListener(onRuntimeMessage);

function onRuntimeMessage(req, sender, sendResponse) {
  // Injection confirmation from content script
  if (req.action === "altq_injection_done") {
    const tabId = sender.tab && sender.tab.id;
    if (tabId != null) {
      if (pendingQueue[tabId]) {
        console.log("[AltQ] Injection done, cleaning queue for tab:", tabId);
        delete pendingQueue[tabId];
      }
      // Also mark as injected here — the injector may have confirmed via this
      // message path rather than via the sendMessage response callback above.
      injectedTabs.add(tabId);
      function clearInjectedTabFromDone() {
        injectedTabs.delete(tabId);
      }
      setTimeout(clearInjectedTabFromDone, 10000);
    }
    sendResponse({ received: true });
    return true;
  }

  if (req.action === "open_ai") {
    const sourceTabId = sender.tab && sender.tab.id;
    if (sourceTabId) {
      chrome.storage.local.set({ lastSourceTabId: sourceTabId });
    }
    checkDailyReset().then(function onDailyResetBeforeOpenAi() {
      safeGet(["usageCount", "dailyUsage", "welcomeBonus", "licenseKey", "tabPosition", "chatMode", "insertMode", "focusMode", "lastAiTabByServiceId", "stats_simple", "stats_template", "stats_simple_today", "stats_template_today", "daysUsed"]).then(function onGetSettingsForOpenAi(data) {
        const dailyUsage = data.dailyUsage || 0;

        // Count stats based on isTemplate flag
        const isTemplate = !!req.isTemplate;
        const newSimple = (data.stats_simple || 0) + (isTemplate ? 0 : 1);
        const newTemplate = (data.stats_template || 0) + (isTemplate ? 1 : 0);
        const newSimpleToday = (data.stats_simple_today || 0) + (isTemplate ? 0 : 1);
        const newTemplateToday = (data.stats_template_today || 0) + (isTemplate ? 1 : 0);

        const updateData = {
          usageCount: (data.usageCount || 0) + 1,
          dailyUsage: dailyUsage + 1,
          welcomeBonus: 0,
          stats_simple: newSimple,
          stats_template: newTemplate,
          stats_simple_today: newSimpleToday,
          stats_template_today: newTemplateToday
        };

        if (req.serviceId) {
          chrome.storage.local.set({ lastUsedId: req.serviceId });
        }

        chrome.storage.local.set(updateData);

        const pos = data.tabPosition || "next";
        const modeRaw = data.chatMode || "new";
        const mode = modeRaw === "home" ? "reuse" : modeRaw;
        const insertMode = data.insertMode || "replace";
        const focusMode = data.focusMode || "focus";
        const lastMap = data.lastAiTabByServiceId || {};
        const serviceId = req.serviceId || "";
        let finalUrl = req.url;

        // In non-new modes, prefer "home" URLs (no /new)
        if (mode !== "new") {
          if (finalUrl.includes("claude.ai/new")) finalUrl = finalUrl.replace("/new", "");
          if (finalUrl.includes("chatgpt.com") && finalUrl.includes("/new")) finalUrl = finalUrl.replace("/new", "");
        }

        function fallbackCreateNewTab() {
          createTabWithInjection(finalUrl, pos, {
            text: req.pendingText,
            selector: req.selector || "",
            serviceId: serviceId,
            insertMode: insertMode
          });
        }

        if (mode === "reuse" && serviceId && lastMap[serviceId]) {
          const reuseTabId = lastMap[serviceId];

          function onGetReuseTab(tab) {
            if (chrome.runtime.lastError || !tab) {
              fallbackCreateNewTab();
              return;
            }

            let expectedHost = "";
            try { expectedHost = new URL(finalUrl).hostname.toLowerCase(); } catch (_) {}
            let currentHost = "";
            try { currentHost = new URL(tab.url || "").hostname.toLowerCase(); } catch (_) {}

            if (expectedHost && currentHost && !currentHost.includes(expectedHost)) {
              fallbackCreateNewTab();
              return;
            }

            if (focusMode === "focus") {
              function onReuseTabFocused() {}
              chrome.tabs.update(reuseTabId, { active: true }, onReuseTabFocused);
            }

            pendingQueue[reuseTabId] = {
              text: req.pendingText,
              selector: req.selector || "",
              serviceId: serviceId,
              insertMode: insertMode,
              targetHost: expectedHost
            };

            function sendReuseInjection() {
              sendInjectionToTab(reuseTabId);
            }
            setTimeout(sendReuseInjection, 100);
          }

          chrome.tabs.get(reuseTabId, onGetReuseTab);
        } else {
          fallbackCreateNewTab();
        }
      });
    });
  }

  if (req.action === "open_settings") {
    openOptionsSafe();
  }

  if (req.action === "open_pro_link") {
    try {
      chrome.tabs.create({ url: "https://komahiz.gumroad.com/l/sendtoai", active: true });
    } catch (err) {
      console.error("[AltQ] Pro link failed", err);
    }
  }

  // Fallback handler (if chrome://extensions/shortcuts command is not assigned)
  if (req.action === "return_to_source") {
    function onGetSourceTabId(storage) {
      const storedId = storage && storage.lastSourceTabId;
      if (!storedId) {
        sendResponse({ ok: false, reason: "no_source" });
        return;
      }
      function onGetSourceTab(tab) {
        if (chrome.runtime.lastError || !tab) {
          chrome.storage.local.remove("lastSourceTabId");
          sendResponse({ ok: false, reason: "missing_tab" });
          return;
        }
        function onSourceTabActivated() {
          if (chrome.runtime.lastError) {
            sendResponse({ ok: false, reason: "update_failed" });
            return;
          }
          notifyReturnedToSource(storedId);
          sendResponse({ ok: true });
        }
        chrome.tabs.update(storedId, { active: true }, onSourceTabActivated);
      }
      chrome.tabs.get(storedId, onGetSourceTab);
    }
    chrome.storage.local.get(["lastSourceTabId"], onGetSourceTabId);
    return true;
  }

  return true;
}

function onCommandFired(command) {
  if (command === "return_to_source") {
    function onGetSourceTabIdForCommand(storage) {
      const storedId = storage && storage.lastSourceTabId;
      if (!storedId) return;
      function onGetSourceTabForCommand(tab) {
        if (chrome.runtime.lastError || !tab) {
          chrome.storage.local.remove("lastSourceTabId");
          return;
        }
        function onSourceTabActivatedForCommand() {
          if (chrome.runtime.lastError) {
            chrome.storage.local.remove("lastSourceTabId");
            return;
          }
          notifyReturnedToSource(storedId);
        }
        chrome.tabs.update(storedId, { active: true }, onSourceTabActivatedForCommand);
      }
      chrome.tabs.get(storedId, onGetSourceTabForCommand);
    }
    chrome.storage.local.get(["lastSourceTabId"], onGetSourceTabIdForCommand);
  }
}
chrome.commands.onCommand.addListener(onCommandFired);

function createTabWithInjection(url, pos, payload) {
  function onQueryTabsForCreate(tabs) {
    let index = tabs.length;

    function isActiveTabInList(t) { return t.active; }
    function isPinnedTabInList(t) { return t.pinned; }

    const activeTab = tabs.find(isActiveTabInList);
    const pinnedCount = tabs.filter(isPinnedTabInList).length;

    if (pos === "start") index = pinnedCount;
    else if (pos === "next" && activeTab) index = activeTab.index + 1;
    // pos === "end" keeps default tabs.length

    function onNewTabCreated(newTab) {
      if (chrome.runtime.lastError) {
        console.error("[AltQ] Tab create failed", chrome.runtime.lastError, url);
        return;
      }

      if (newTab && newTab.id && payload && payload.text) {
        let targetHost = "";
        try {
          targetHost = new URL(url).hostname.toLowerCase();
        } catch (_) {}

        pendingQueue[newTab.id] = {
          text: payload.text,
          selector: payload.selector || "",
          serviceId: payload.serviceId || "",
          insertMode: payload.insertMode || "replace",
          targetHost: targetHost
        };

        // Remember last AI tab per serviceId for "reuse" mode
        if (payload.serviceId) {
          var newTabId = newTab.id;
          var serviceId = payload.serviceId;
          function onGetLastAiTabMap(storage) {
            const map = (storage && storage.lastAiTabByServiceId) || {};
            map[serviceId] = newTabId;
            chrome.storage.local.set({ lastAiTabByServiceId: map });
          }
          chrome.storage.local.get(["lastAiTabByServiceId"], onGetLastAiTabMap);
        }

        console.log("[AltQ] Queued injection for tab (awaiting load):", newTab.id);
      }
    }

    chrome.tabs.create({ url: url, index: index, active: true }, onNewTabCreated);
  }

  chrome.tabs.query({ currentWindow: true }, onQueryTabsForCreate);
}