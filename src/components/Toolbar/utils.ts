export function isInteractiveTarget(target: EventTarget | null): boolean {
  return (
    target instanceof Element &&
    target.closest(
      'a, button, input, select, textarea, [contenteditable]:not([contenteditable="false"])',
    ) !== null
  );
}
