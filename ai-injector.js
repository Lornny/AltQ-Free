/**
 * AltQ AI Injector v7.2.6
 */
console.info("[AltQ] Injector v7.2.6 active");

const SITE_CONFIG = [
  { name: "Gemini", domain: "gemini.google.com", selector: "div[contenteditable='true']", isRichText: true },
  { name: "ChatGPT", domain: "chatgpt.com", selector: "#prompt-textarea", isRichText: true },
  { name: "OpenAI", domain: "openai.com", selector: "#prompt-textarea", isRichText: true },
  { name: "Claude", domain: "claude.ai", selector: "fieldset div[contenteditable='true']", isRichText: true },
  { name: "Perplexity", domain: "perplexity.ai", selector: "textarea", isRichText: false },
  { name: "DeepSeek", domain: "chat.deepseek.com", selector: "textarea", isRichText: false },
  { name: "Llama", domain: "meta.ai", selector: "textarea, div[role='textbox']", isRichText: true },
  { name: "Qwen", domain: "chat.qwen.ai", selector: "textarea", isRichText: false },
  { name: "Tongyi", domain: "tongyi.aliyun.com", selector: "textarea", isRichText: false },
  { name: "Copilot", domain: "copilot.microsoft.com", selector: "#searchbox", isRichText: false },
  { name: "Mistral", domain: "chat.mistral.ai", selector: "textarea", isRichText: false },
  { name: "HuggingChat", domain: "huggingface.co", selector: "textarea", isRichText: false }
];

let lastInsertMode = "replace";

function getCurrentConfig() {
  const host = location.hostname.toLowerCase();
  return SITE_CONFIG.find((cfg) => host.includes(cfg.domain)) || null;
}

function setNativeValue(element, value) {
  const valueSetter = Object.getOwnPropertyDescriptor(element, "value")?.set;
  const prototypeValueSetter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(element), "value")?.set;
  if (prototypeValueSetter && valueSetter !== prototypeValueSetter) prototypeValueSetter.call(element, value);
  else if (valueSetter) valueSetter.call(element, value);
  element.dispatchEvent(new Event("input", { bubbles: true }));
  element.dispatchEvent(new Event("change", { bubbles: true }));
}

function insertText(el, text, isRichText) {
  const mode = lastInsertMode === "append" ? "append" : "replace";
  el.focus();

  if (isRichText) {
    const existing = (el.innerText || "").trim();
    const finalText = mode === "append" && existing ? (existing + "\n\n" + text) : text;
    if ((el.innerText || "") === finalText) return true;
    el.innerHTML = "";
    try {
      document.execCommand("insertText", false, finalText);
    } catch (e) {
      el.textContent = finalText;
    }
  } else {
    if (el.tagName === "TEXTAREA" || el.tagName === "INPUT") {
      const existing = (el.value || "").trim();
      const finalText = mode === "append" && existing ? (existing + "\n\n" + text) : text;
      try { setNativeValue(el, finalText); }
      catch (e) {
        el.value = finalText;
        el.dispatchEvent(new Event("input", { bubbles: true }));
      }
    } else {
      const existing = (el.textContent || "").trim();
      const finalText = mode === "append" && existing ? (existing + "\n\n" + text) : text;
      el.textContent = finalText;
      el.dispatchEvent(new Event("input", { bubbles: true }));
    }
  }

  setTimeout(() => {
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
  }, 50);

  return true;
}

function findInputField(customSelector) {
  const cfg = getCurrentConfig();
  let field = null;
  let isRichText = false;

  if (customSelector) {
    field = document.querySelector(customSelector);
    if (field) {
      isRichText = field.isContentEditable || field.getAttribute("contenteditable") === "true";
      return { field, isRichText };
    }
  }

  if (cfg) {
    field = document.querySelector(cfg.selector);
    if (field) {
      return { field, isRichText: cfg.isRichText };
    }
  }

  field = document.querySelector("textarea") ||
          document.querySelector("div[contenteditable='true']") ||
          document.querySelector("div[role='textbox']");

  if (field) {
    isRichText = field.isContentEditable || field.getAttribute("contenteditable") === "true";
    return { field, isRichText };
  }

  return { field: null, isRichText: false };
}

function tryInjectText(text, customSelector, retries = 0) {
  const maxRetries = 20;
  const { field, isRichText } = findInputField(customSelector);

  if (field && document.contains(field)) {
    console.log("[AltQ] Found input field, injecting text");
    const success = insertText(field, text, isRichText);
    if (success) {
      chrome.runtime.sendMessage({ action: "altq_injection_done" });
      return true;
    }
  }

  if (retries < maxRetries) {
    setTimeout(() => tryInjectText(text, customSelector, retries + 1), 500);
  } else {
    console.warn("[AltQ] Could not find input field after", maxRetries, "retries");
  }

  return false;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "altq_inject_request") {
    const currentHost = location.hostname.toLowerCase();
    if (request.targetHost && !currentHost.includes(request.targetHost)) {
      console.warn("[AltQ] Injection host mismatch", { requestHost: request.targetHost, currentHost });
      sendResponse({ success: false, error: "host_mismatch" });
      return true;
    }

    if (!request.text) {
      console.warn("[AltQ] No text in injection request");
      sendResponse({ success: false, error: "no_text" });
      return true;
    }

    lastInsertMode = request.insertMode === "append" ? "append" : "replace";
    const immediate = tryInjectText(request.text, request.selector);
    sendResponse({ success: immediate, pending: !immediate });
    return true;
  }
  return false;
});

console.log("[AltQ] Injector ready, waiting for targeted messages");