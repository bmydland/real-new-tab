export function classNames(
  ...classes: (string | undefined | false | null)[]
): string {
  return classes.filter(Boolean).join(" ");
}

export function scrollToTopOfElement(targetId: string) {
  const targetElement = document.getElementById(targetId);

  if (targetElement) {
    targetElement.scrollIntoView({ behavior: "smooth" });
  }
}

export function convertPxToRem(unit: number) {
  const rootFontSize = 16;
  return unit / rootFontSize;
}
