"use client";

/**
 * Sun/moon theme toggle. Theme is applied via html[data-theme="dark"];
 * initial state is set pre-paint by an inline script in the root layout
 * reading localStorage["said-theme"], so this component only toggles.
 */
export default function ThemeToggle() {
  function toggleTheme() {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    localStorage.setItem("said-theme", next);
    if (next === "dark") document.documentElement.dataset.theme = "dark";
    else delete document.documentElement.dataset.theme;
  }

  return (
    <button className="themebtn" title="Toggle dark mode" onClick={toggleTheme}>
      <svg className="sun" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        <circle cx="8" cy="8" r="3.2" />
        <line x1="8" y1="0.8" x2="8" y2="2.6" /><line x1="8" y1="13.4" x2="8" y2="15.2" />
        <line x1="0.8" y1="8" x2="2.6" y2="8" /><line x1="13.4" y1="8" x2="15.2" y2="8" />
        <line x1="2.9" y1="2.9" x2="4.2" y2="4.2" /><line x1="11.8" y1="11.8" x2="13.1" y2="13.1" />
        <line x1="2.9" y1="13.1" x2="4.2" y2="11.8" /><line x1="11.8" y1="4.2" x2="13.1" y2="2.9" />
      </svg>
      <svg className="moon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M13.5 9.8A6 6 0 0 1 6.2 2.5a6 6 0 1 0 7.3 7.3Z" />
      </svg>
    </button>
  );
}
