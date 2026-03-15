document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const themeToggle = document.getElementById("themeToggle");
  const proTag = document.getElementById("proTag");
  const dailyLeftEl = document.getElementById("dailyLeft");
  const bonusLeftEl = document.getElementById("bonusLeft");
  const totalUsedEl = document.getElementById("totalUsed");
  const todayUsedEl = document.getElementById("todayUsed");
  const limitWarning = document.getElementById("limitWarning");
  const usageCard = document.getElementById("usageCard");
  const segButtons = Array.from(document.querySelectorAll(".seg-btn"));
  const soundToggle = document.getElementById("soundToggle");
  const licenseInput = document.getElementById("licenseInput");
  const verifyBtn = document.getElementById("verifyBtn");
  const buyBtn = document.getElementById("buyBtn");
  const statusBox = document.getElementById("statusBox");

  function unlock(key) {
    // For UI only: treat any non-empty key as PRO.
    // Server verification is handled by the Gumroad request.
    if (typeof key !== "string") return false;
    return key.trim().length > 0;
  }

  function applyTheme(theme) {
    body.className = theme;
    themeToggle.checked = theme === "light";
  }

  function formatTimeSaved(seconds) {
    if (!seconds) return "0s";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  }

  chrome.storage.local.get(["theme"], (data) => {
    let t = data ? data.theme : "system";
    if (!t || t === "system") {
      const sysDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      t = sysDark ? "dark" : "light";
    }
    applyTheme(t);
  });

  themeToggle.addEventListener("change", () => {
    const newTheme = themeToggle.checked ? "light" : "dark";
    applyTheme(newTheme);
    chrome.storage.local.set({ theme: newTheme });
  });

  function applySegmentButtonState(btn, setting, value) {
    const s = btn.getAttribute("data-setting");
    const v = btn.getAttribute("data-value");
    if (s === setting) {
      if (v === value) btn.classList.add("active");
      else btn.classList.remove("active");
    }
  }

  function applySegmentedState(setting, value) {
    for (let i = 0; i < segButtons.length; i += 1) {
      applySegmentButtonState(segButtons[i], setting, value);
    }
  }

  function handleSegmentClick(event) {
    const btn = event.currentTarget;
    const setting = btn.getAttribute("data-setting");
    const value = btn.getAttribute("data-value");
    if (!setting || !value) return;
    applySegmentedState(setting, value);
    chrome.storage.local.set({ [setting]: value });
  }

  function bindSegments() {
    for (let i = 0; i < segButtons.length; i += 1) {
      segButtons[i].addEventListener("click", handleSegmentClick);
    }
  }

  function loadSegmentedSettings() {
    chrome.storage.local.get(["tabPosition", "chatMode", "insertMode", "focusMode"], (data) => {
      const tabPosition = (data && data.tabPosition) || "next";
      let chatMode = (data && data.chatMode) || "new";
      // Backward compatibility: old value "home" is now "reuse"
      if (chatMode === "home") chatMode = "reuse";
      // Safety: normalize unexpected values
      if (chatMode !== "new" && chatMode !== "reuse") chatMode = "new";
      const insertMode = (data && data.insertMode) || "replace";
      const focusMode = (data && data.focusMode) || "focus";
      applySegmentedState("tabPosition", tabPosition);
      applySegmentedState("chatMode", chatMode);
      applySegmentedState("insertMode", insertMode);
      applySegmentedState("focusMode", focusMode);
    });
  }

  function loadSoundSetting() {
    chrome.storage.local.get(["soundEnabled"], (data) => {
      const enabled = data && typeof data.soundEnabled === "boolean" ? data.soundEnabled : true;
      soundToggle.checked = enabled;
    });
  }

  function handleSoundToggleChange() {
    chrome.storage.local.set({ soundEnabled: !!soundToggle.checked });
  }

  bindSegments();
  loadSegmentedSettings();
  loadSoundSetting();

  // FUTURE (Next version idea): Hotkeys to toggle modes without opening Settings.
  // - Alt+Shift+F: toggle Focus AI tab vs Stay on source page
  // - Alt+Shift+A: toggle Insert mode Replace vs Append
  // - Alt+Shift+N: toggle New tab vs Reuse last AI tab
  // Consider showing a small toast/badge indicating the current mode.

  // NOTE (Time Saved math):
  // - Simple send (selection only) is estimated to save ~25 seconds.
  // - Template send (prompt + selection) is estimated to save ~150 seconds.

  soundToggle.addEventListener("change", handleSoundToggleChange);


  let statusTimeout;
  function showStatus(message, type) {
    statusBox.textContent = message;
    statusBox.className = "status " + type;
    statusBox.style.display = "block";
    clearTimeout(statusTimeout);
    statusTimeout = setTimeout(() => (statusBox.style.display = "none"), 5000);
  }

  let verifyDebounce;

  function handleVerifyClick() {
    clearTimeout(verifyDebounce);
    verifyDebounce = setTimeout(async function doVerify() {
      if (!navigator.onLine) {
        showStatus("Offline. Check internet connection.", "error");
        return;
      }
      const key = licenseInput.value.trim();
      if (!key) {
        showStatus("Please enter a license key", "error");
        return;
      }
      showStatus("Verifying...", "success");
      const PERMALINK = "https://komahiz.gumroad.com/l/sendtoai";
      try {
        const response = await fetch("https://api.gumroad.com/v2/licenses/verify", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: "product_permalink=" + PERMALINK + "&license_key=" + encodeURIComponent(key)
        });
        const data = await response.json();
        if (data.success && !(data.purchase && (data.purchase.refunded || data.purchase.chargebacked))) {
          chrome.storage.local.get(["features"], function onGetFeatures(storage) {
            const features = (storage && storage.features) || {};
            // PRO unlock: enable Custom Prompts
            features.customTemplates = true;
            chrome.storage.local.set({ licenseKey: key, features: features });
          });
          showStatus("✅ PRO activated! Custom Prompts unlocked.", "success");
          updateStats();
        } else {
          showStatus("❌ Invalid key or subscription cancelled.", "error");
        }
      } catch (err) {
        console.error(err);
        showStatus("Network error. Try again later.", "error");
      }
    }, 400);
  }

  verifyBtn.addEventListener("click", handleVerifyClick);

  function handleBuyBtnClick() {
    chrome.runtime.sendMessage({ action: "open_pro_link" });
  }

  buyBtn.addEventListener("click", handleBuyBtnClick);

  function updateStats() {
    chrome.storage.local.get(["usageCount", "dailyUsage", "welcomeBonus", "licenseKey", "features", "stats_simple", "stats_template", "stats_simple_today", "stats_template_today", "daysUsed"], (data) => {
      if (chrome.runtime.lastError) return;
      // UI PRO status: either a valid licenseKey OR feature flag enabled.
      // This prevents showing FREE when PRO capabilities are already unlocked.
      const features = (data && data.features) || {};
      const unlocked = unlock((data && data.licenseKey) || "") || !!features.customTemplates;
      const dailyUsage = (data && data.dailyUsage) || 0;
      const daysUsed = (data && data.daysUsed) || 0;

      const simpleTotal = data.stats_simple || 0;
      const templateTotal = data.stats_template || 0;
      const simpleToday = data.stats_simple_today || 0;
      const templateToday = data.stats_template_today || 0;

      const totalSeconds = (simpleTotal * 25) + (templateTotal * 150);
      const todaySeconds = (simpleToday * 25) + (templateToday * 150);

      dailyLeftEl.textContent = formatTimeSaved(todaySeconds);
      bonusLeftEl.textContent = formatTimeSaved(totalSeconds);
      todayUsedEl.textContent = dailyUsage;
      // Show "days used" including the current day if there was at least one send today.
      const daysUsedDisplay = daysUsed + (dailyUsage > 0 ? 1 : 0);
      const safeDays = Math.min(daysUsedDisplay, 9999);
      totalUsedEl.textContent = `${((data && data.usageCount) || 0)} (${safeDays}d)`;

      proTag.textContent = unlocked ? "PRO" : "FREE";
      proTag.style.background = unlocked
        ? "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
        : "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)";
      limitWarning.style.display = "none";
      usageCard.style.opacity = "1";
    });
  }

  updateStats();
  let pollInterval = setInterval(updateStats, 3000);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      clearInterval(pollInterval);
      pollInterval = null;
    } else {
      updateStats();
      if (!pollInterval) pollInterval = setInterval(updateStats, 3000);
    }
  });

  const urlParams = new URLSearchParams(location.search);
  if (urlParams.get("msg") === "limit_reached") {
    limitWarning.style.display = "block";
    limitWarning.scrollIntoView({ behavior: "smooth" });
  }
});