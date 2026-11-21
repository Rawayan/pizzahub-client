"use client";

// From Uiverse.io by nihad-abbasov - https://uiverse.io/nihad-abbasov/smooth-fly-9
// MIT License, Copyright (c) Galahhad, Galahhad (Galahad), nihad-abbasov (Nihad Abbasov)

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    queueMicrotask(() => setMounted(true));
  }, []);

  const isDark = mounted && resolvedTheme === "dark";
  const label = isDark ? "Switch to light mode" : "Switch to dark mode";
  const accessibleLabel = mounted ? label : "Change color theme";

  return (
    <label
      className="pizza-theme-switch shrink-0"
      title={accessibleLabel}
    >
      <input
        id="pizza-theme-switch"
        className="pizza-theme-switch__input"
        type="checkbox"
        role="switch"
        checked={isDark}
        onChange={() => setTheme(isDark ? "light" : "dark")}
        aria-label={accessibleLabel}
      />

      <span className="pizza-theme-switch__slider" aria-hidden="true">
        <span className="pizza-theme-switch__circle" />
      </span>
    </label>
  );
}
