import React from "react";

interface VirtualKeyboardProps {
  language: "en" | "ar";
  nextChar: string | null;
}

const enLayout = [
  [
    "`",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "0",
    "-",
    "=",
    "Backspace",
  ],
  ["Tab", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "\\"],
  ["Caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "Enter"],
  ["Shift", "z", "x", "c", "v", "b", "n", "m", ",", ".", "/", "Shift"],
  ["Space"],
];

const arLayout = [
  [
    "ذ",
    "١",
    "٢",
    "٣",
    "٤",
    "٥",
    "٦",
    "٧",
    "٨",
    "٩",
    "٠",
    "-",
    "=",
    "Backspace",
  ],
  ["Tab", "ض", "ص", "ث", "ق", "ف", "غ", "ع", "ه", "خ", "ح", "ج", "د", "\\"],
  ["Caps", "ش", "س", "ي", "ب", "ل", "ا", "ت", "ن", "م", "ك", "ط", "Enter"],
  ["Shift", "ئ", "ء", "ؤ", "ر", "لا", "ى", "ة", "و", "ز", "ظ", "Shift"],
  ["Space"],
];

export function VirtualKeyboard({ language, nextChar }: VirtualKeyboardProps) {
  const layout = language === "en" ? enLayout : arLayout;

  const getKeyWidth = (key: string) => {
    switch (key) {
      case "Backspace":
        return "w-20";
      case "Tab":
        return "w-16";
      case "Caps":
        return "w-20";
      case "Enter":
        return "w-20";
      case "Shift":
        return "w-24";
      case "Space":
        return "w-96";
      default:
        return "w-12";
    }
  };

  const isNextKey = (key: string) => {
    if (!nextChar) return false;
    if (key === "Space" && nextChar === " ") return true;
    return key.toLowerCase() === nextChar.toLowerCase();
  };

  return (
    <div className="bg-slate-800 p-3 sm:p-4 rounded-xl shadow-2xl select-none max-w-4xl mx-auto">
      <div className="flex flex-col gap-1.5 sm:gap-2">
        {layout.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-1.5 sm:gap-2">
            {row.map((key, keyIndex) => {
              const active = isNextKey(key);
              return (
                <div
                  key={keyIndex}
                  className={`
                    flex items-center justify-center h-10 sm:h-12 rounded-lg text-xs sm:text-sm font-medium transition-colors
                    ${getKeyWidth(key)}
                    ${
                      active
                        ? "bg-emerald-500 text-white shadow-[0_4px_0_rgb(4,120,87)] translate-y-0"
                        : "bg-slate-700 text-slate-300 shadow-[0_4px_0_rgb(51,65,85)] pb-1"
                    }
                  `}
                >
                  {key}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
