import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";

export interface DropdownOption {
  value: string;
  label: string;
  description?: string;
}

interface DropdownProps {
  label?: string;
  value: string;
  options: DropdownOption[];
  placeholder?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}

export function Dropdown({ label, value, options, placeholder, disabled = false, onChange }: DropdownProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const selectedOption = useMemo(() => options.find((option) => option.value === value), [options, value]);
  const activeOption = options[activeIndex] ?? options[0];

  useEffect(() => {
    if (!isOpen) return;

    const selectedIndex = options.findIndex((option) => option.value === value);
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [isOpen, options, value]);

  const selectOption = (option: DropdownOption) => {
    onChange(option.value);
    setIsOpen(false);
    buttonRef.current?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;

    if (event.key === "Escape") {
      setIsOpen(false);
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((current) => (current + 1) % Math.max(options.length, 1));
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((current) => (current - 1 + Math.max(options.length, 1)) % Math.max(options.length, 1));
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        return;
      }
      if (activeOption) selectOption(activeOption);
    }
  };

  return (
    <div ref={rootRef} className="relative">
      {label ? <span className="mb-1 block text-[11px] font-extrabold uppercase tracking-[0.14em] text-muted">{label}</span> : null}
      <button
        ref={buttonRef}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        onKeyDown={handleKeyDown}
        className={
          isOpen
            ? "flex min-h-11 w-full items-center justify-between gap-3 rounded-[11px] border-[1.5px] border-brand bg-card px-3.5 py-3 text-left text-sm font-semibold text-ink shadow-sm outline-none ring-4 ring-brand-soft transition disabled:cursor-not-allowed disabled:opacity-55"
            : "flex min-h-11 w-full items-center justify-between gap-3 rounded-[11px] border-[1.5px] border-line bg-card px-3.5 py-3 text-left text-sm font-semibold text-ink shadow-sm outline-none transition hover:-translate-y-px hover:border-brand hover:shadow-md disabled:cursor-not-allowed disabled:opacity-55"
        }
      >
        <span className={selectedOption ? "truncate" : "truncate text-muted"}>{selectedOption?.label ?? placeholder}</span>
        <span className={isOpen ? "text-brand transition duration-150 rotate-180" : "text-muted transition duration-150"} aria-hidden="true">
          ˄
        </span>
      </button>

      {isOpen ? (
        <div
          role="listbox"
          className="absolute left-0 right-0 top-[calc(100%+8px)] z-30 rounded-[12px] border border-line bg-card p-1.5 shadow-lg animate-[dropdownIn_160ms_ease-out]"
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            const isActive = index === activeIndex;
            return (
              <button
                key={option.value || option.label}
                type="button"
                role="option"
                aria-selected={isSelected}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => selectOption(option)}
                className={
                  isSelected || isActive
                    ? "flex w-full items-center justify-between gap-3 rounded-lg bg-brand-soft px-3 py-2.5 text-left text-sm text-brand-deep"
                    : "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-ink transition hover:bg-brand-soft"
                }
              >
                <span>
                  <span className={isSelected ? "block font-bold" : "block font-medium"}>{option.label}</span>
                  {option.description ? <span className="mt-0.5 block text-xs text-muted">{option.description}</span> : null}
                </span>
                {isSelected ? <span className="text-gold" aria-hidden="true">✓</span> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
