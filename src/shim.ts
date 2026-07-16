/**
 * Safely shims browser APIs that are restricted or throw security exceptions 
 * when the application runs inside a sandboxed cross-origin iframe context.
 */

if (typeof window !== "undefined") {
  const createMockStorage = () => {
    const mockStorage: Record<string, string> = {};
    return {
      getItem: (key: string) => {
        return key in mockStorage ? mockStorage[key] : null;
      },
      setItem: (key: string, value: string) => {
        mockStorage[key] = String(value);
      },
      removeItem: (key: string) => {
        delete mockStorage[key];
      },
      clear: () => {
        for (const key in mockStorage) {
          delete mockStorage[key];
        }
      },
      key: (index: number) => {
        const keys = Object.keys(mockStorage);
        return keys[index] || null;
      },
      get length() {
        return Object.keys(mockStorage).length;
      }
    };
  };

  // 1. Storage, Cookie, & ServiceWorker Proxies / Shims
  const mockLocalStorage = createMockStorage();
  const mockSessionStorage = createMockStorage();

  // Capture native references before any modifications to avoid recursive property lookup loops
  let nativeLocalStorage: Storage | null = null;
  try {
    nativeLocalStorage = window.localStorage;
  } catch (e) {}

  let nativeSessionStorage: Storage | null = null;
  try {
    nativeSessionStorage = window.sessionStorage;
  } catch (e) {}

  let safeLocalStorageInstance: any = mockLocalStorage;
  try {
    if (nativeLocalStorage) {
      nativeLocalStorage.setItem("__test_safe__", "1");
      nativeLocalStorage.removeItem("__test_safe__");
      safeLocalStorageInstance = nativeLocalStorage;
    }
  } catch (e) {}

  let safeSessionStorageInstance: any = mockSessionStorage;
  try {
    if (nativeSessionStorage) {
      nativeSessionStorage.setItem("__test_safe__", "1");
      nativeSessionStorage.removeItem("__test_safe__");
      safeSessionStorageInstance = nativeSessionStorage;
    }
  } catch (e) {}

  (window as any).safeLocalStorage = safeLocalStorageInstance;
  (window as any).safeSessionStorage = safeSessionStorageInstance;

  let nativeIndexedDB: IDBFactory | undefined = undefined;
  try {
    if (window.indexedDB) {
      const testReq = window.indexedDB.open("__test_sandbox_indexeddb_capability__");
      nativeIndexedDB = window.indexedDB;
    }
  } catch (e) {
    nativeIndexedDB = undefined;
  }

  let nativeCaches: CacheStorage | undefined = undefined;
  try {
    if (window.caches) {
      const testPromise = window.caches.keys();
      nativeCaches = window.caches;
    }
  } catch (e) {
    nativeCaches = undefined;
  }

  if (typeof Window !== "undefined" && Window.prototype) {
    // LocalStorage Safe Proxy
    try {
      const originalDesc = Object.getOwnPropertyDescriptor(Window.prototype, "localStorage");
      Object.defineProperty(Window.prototype, "localStorage", {
        get() {
          try {
            if (originalDesc && originalDesc.get) {
              const storage = originalDesc.get.call(this);
              if (storage) {
                storage.setItem("__storage_test_key__", "1");
                storage.removeItem("__storage_test_key__");
                return storage;
              }
            }
            if (nativeLocalStorage) {
              nativeLocalStorage.setItem("__storage_test_key__", "1");
              nativeLocalStorage.removeItem("__storage_test_key__");
              return nativeLocalStorage;
            }
          } catch (e) {
            // Suppress SecurityError
          }
          return mockLocalStorage;
        },
        configurable: true,
        enumerable: true
      });
    } catch (err) {
      console.warn("Could not define safe localStorage proxy on Window.prototype:", err);
    }

    // SessionStorage Safe Proxy
    try {
      const originalDesc = Object.getOwnPropertyDescriptor(Window.prototype, "sessionStorage");
      Object.defineProperty(Window.prototype, "sessionStorage", {
        get() {
          try {
            if (originalDesc && originalDesc.get) {
              const storage = originalDesc.get.call(this);
              if (storage) {
                storage.setItem("__storage_test_key__", "1");
                storage.removeItem("__storage_test_key__");
                return storage;
              }
            }
            if (nativeSessionStorage) {
              nativeSessionStorage.setItem("__storage_test_key__", "1");
              nativeSessionStorage.removeItem("__storage_test_key__");
              return nativeSessionStorage;
            }
          } catch (e) {
            // Suppress SecurityError
          }
          return mockSessionStorage;
        },
        configurable: true,
        enumerable: true
      });
    } catch (err) {
      console.warn("Could not define safe sessionStorage proxy on Window.prototype:", err);
    }

    // IndexedDB Safe Proxy
    try {
      const originalDesc = Object.getOwnPropertyDescriptor(Window.prototype, "indexedDB");
      Object.defineProperty(Window.prototype, "indexedDB", {
        get() {
          try {
            if (originalDesc && originalDesc.get) {
              return originalDesc.get.call(this);
            }
            return nativeIndexedDB;
          } catch (e) {
            return undefined;
          }
        },
        configurable: true,
        enumerable: true
      });
    } catch (err) {
      console.warn("Could not define safe indexedDB proxy on Window.prototype:", err);
    }

    // Caches Safe Proxy
    try {
      const originalDesc = Object.getOwnPropertyDescriptor(Window.prototype, "caches");
      Object.defineProperty(Window.prototype, "caches", {
        get() {
          try {
            if (originalDesc && originalDesc.get) {
              return originalDesc.get.call(this);
            }
            return nativeCaches;
          } catch (e) {
            return undefined;
          }
        },
        configurable: true,
        enumerable: true
      });
    } catch (err) {
      console.warn("Could not define safe caches proxy on Window.prototype:", err);
    }
  }

  // Direct fallbacks on window object for legacy references
  try {
    Object.defineProperty(window, "localStorage", {
      get() {
        try {
          if (nativeLocalStorage) {
            nativeLocalStorage.setItem("__test__", "1");
            nativeLocalStorage.removeItem("__test__");
            return nativeLocalStorage;
          }
        } catch (e) {}
        return mockLocalStorage;
      },
      configurable: true,
      enumerable: true
    });
  } catch (err) {}

  try {
    Object.defineProperty(window, "sessionStorage", {
      get() {
        try {
          if (nativeSessionStorage) {
            nativeSessionStorage.setItem("__test__", "1");
            nativeSessionStorage.removeItem("__test__");
            return nativeSessionStorage;
          }
        } catch (e) {}
        return mockSessionStorage;
      },
      configurable: true,
      enumerable: true
    });
  } catch (err) {}

  try {
    Object.defineProperty(window, "indexedDB", {
      get() {
        return nativeIndexedDB;
      },
      configurable: true,
      enumerable: true
    });
  } catch (err) {}

  try {
    Object.defineProperty(window, "caches", {
      get() {
        return nativeCaches;
      },
      configurable: true,
      enumerable: true
    });
  } catch (err) {}

  // Safe Document Cookie Proxy
  if (typeof Document !== "undefined" && Document.prototype) {
    let mockCookie = "";
    try {
      const originalDesc = Object.getOwnPropertyDescriptor(Document.prototype, "cookie");
      Object.defineProperty(Document.prototype, "cookie", {
        get() {
          try {
            if (originalDesc && originalDesc.get) {
              return originalDesc.get.call(this);
            }
            return "";
          } catch (e) {
            return mockCookie;
          }
        },
        set(val) {
          try {
            if (originalDesc && originalDesc.set) {
              originalDesc.set.call(this, val);
              return;
            }
          } catch (e) {
            mockCookie = val;
          }
        },
        configurable: true,
        enumerable: true
      });
    } catch (err) {
      console.warn("Could not define safe cookie proxy on Document.prototype:", err);
    }
  }

  // ServiceWorker Safe Protection
  if (typeof Navigator !== "undefined" && Navigator.prototype) {
    try {
      const originalDesc = Object.getOwnPropertyDescriptor(Navigator.prototype, "serviceWorker");
      Object.defineProperty(Navigator.prototype, "serviceWorker", {
        get() {
          try {
            if (originalDesc && originalDesc.get) {
              return originalDesc.get.call(this);
            }
            return undefined;
          } catch (e) {
            return undefined;
          }
        },
        configurable: true,
        enumerable: true
      });
    } catch (err) {
      console.warn("Could not define safe serviceWorker proxy on Navigator.prototype:", err);
    }
  }

  // 2. Notification API Shim
  let isNotificationSafe = false;
  try {
    if ("Notification" in window && window.Notification !== null) {
      // Just accessing window.Notification or permission can throw in some sandboxes
      const perm = window.Notification.permission;
      isNotificationSafe = true;
    }
  } catch (e) {
    isNotificationSafe = false;
  }

  if (!isNotificationSafe) {
    const mockNotificationClass = function(title: string, options?: any) {
      console.info("Mock Notification dispatched in sandboxed environment:", title, options);
      return {
        close: () => {},
        onclick: null,
        onclose: null,
        onerror: null,
        onshow: null,
      };
    };
    (mockNotificationClass as any).permission = "denied";
    (mockNotificationClass as any).requestPermission = async () => "denied";

    if (typeof Window !== "undefined" && Window.prototype) {
      try {
        Object.defineProperty(Window.prototype, "Notification", {
          get() {
            return mockNotificationClass;
          },
          configurable: true,
          enumerable: true
        });
      } catch (err) {
        console.warn("Could not define mock Notification on Window.prototype:", err);
      }
    }

    try {
      Object.defineProperty(window, "Notification", {
        value: mockNotificationClass,
        writable: true,
        configurable: true,
        enumerable: true
      });
    } catch (err) {
      console.warn("Could not define mock Notification directly on window:", err);
    }
  }

  // 3. SpeechSynthesis API Shim
  let isSpeechSynthesisSafe = false;
  try {
    if ("speechSynthesis" in window && window.speechSynthesis !== null) {
      const synth = window.speechSynthesis;
      isSpeechSynthesisSafe = true;
    }
  } catch (e) {
    isSpeechSynthesisSafe = false;
  }

  if (!isSpeechSynthesisSafe) {
    const mockSpeechSynthesis = {
      speak: (utterance: any) => {
        console.info("Mock SpeechSynthesis speaking:", utterance.text);
        if (utterance.onend) {
          setTimeout(() => {
            try { utterance.onend(); } catch (e) {}
          }, 1000);
        }
      },
      cancel: () => {},
      pause: () => {},
      resume: () => {},
      getVoices: () => [],
      pending: false,
      speaking: false,
      paused: false
    };

    if (typeof Window !== "undefined" && Window.prototype) {
      try {
        Object.defineProperty(Window.prototype, "speechSynthesis", {
          get() {
            return mockSpeechSynthesis;
          },
          configurable: true,
          enumerable: true
        });
      } catch (err) {
        console.warn("Could not define mock speechSynthesis on Window.prototype:", err);
      }
    }

    try {
      Object.defineProperty(window, "speechSynthesis", {
        value: mockSpeechSynthesis,
        writable: true,
        configurable: true,
        enumerable: true
      });
    } catch (err) {
      console.warn("Could not define mock speechSynthesis directly on window:", err);
    }
  }

  // 4. Global Error Reporting
  const ignorePatterns = [
    "websocket",
    "websocket closed without opened",
    "vite",
    "failed to connect to websocket",
    "hmr",
    "script error",
    "script"
  ];

  function shouldIgnore(msg: string | null | undefined): boolean {
    if (!msg) return true; // Suppress empty/null messages as they represent hidden cross-origin script errors
    const m = String(msg).toLowerCase();
    return ignorePatterns.some(pattern => m.includes(pattern));
  }

  try {
    const originalOnError = window.onerror;
    window.onerror = function(message, source, lineno, colno, error) {
      const msgStr = String(message || "");
      if (shouldIgnore(msgStr)) {
        return true; // Suppress from browser/parent frame
      }
      if (originalOnError) {
        return originalOnError.apply(this, arguments as any);
      }
      return false;
    };
  } catch (err) {
    console.warn("Could not override window.onerror:", err);
  }

  window.addEventListener("error", (event) => {
    try {
      const message = event && event.message ? String(event.message) : "";
      if (shouldIgnore(message)) {
        if (event) {
          event.preventDefault();
          event.stopPropagation();
          event.stopImmediatePropagation();
        }
        return;
      }

      fetch("/api/log-error", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: event.message,
          source: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          error: event.error ? { message: event.error.message, name: event.error.name } : null,
          stack: event.error ? event.error.stack : ""
        })
      }).catch(() => {});
    } catch (e) {}
  }, true); // Use useCapture to intercept before other handlers

  window.addEventListener("unhandledrejection", (event) => {
    try {
      const reason = event ? event.reason : null;
      const reasonStr = reason ? String(reason.message || reason || "") : "";
      if (shouldIgnore(reasonStr)) {
        if (event) {
          event.preventDefault();
          event.stopPropagation();
          event.stopImmediatePropagation();
        }
        return;
      }

      fetch("/api/log-error", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: reason && reason.message ? reason.message : String(reason),
          source: "unhandledrejection",
          lineno: 0,
          colno: 0,
          error: reason ? { message: reason.message, name: reason.name } : null,
          stack: reason && reason.stack ? reason.stack : ""
        })
  }).catch(() => {});
    } catch (e) {}
  }, true); // Use useCapture to intercept before other handlers
}

