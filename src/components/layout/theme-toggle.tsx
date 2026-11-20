
"use client";

import { useEffect, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const nextTheme =
    theme === "system"
      ? "dark"
      : theme === "dark"
        ? "light"
        : "system";

  const label =
    nextTheme === "dark"
      ? "Switch to dark mode"
      : nextTheme === "light"
        ? "Switch to light mode"
        : "Use system theme";

  const Icon =
    !mounted || theme === "system"
      ? Monitor
      : theme === "dark"
        ? Moon
        : Sun;

  return (
    <button
      type="button"
      onClick={() => setTheme(nextTheme)}
      className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-foreground transition hover:border-primary hover:bg-muted"
      aria-label={mounted ? label : "Change color theme"}
      title={mounted ? label : "Change color theme"}
    >
      <Icon className="size-5" />
      <span className="sr-only">
        {mounted ? label : "Change color theme"}
      </span>
    </button>
  );
}
