const libraryProperty = /^--(?:color|font|type|weight|shadow|radius|space)-/;

/** Copy resolved library tokens rather than a theme name, preserving local overrides. */
export function copyTooltipTheme(trigger: HTMLElement, target: HTMLElement): void {
  const computed = getComputedStyle(trigger);
  const properties = new Set<string>();
  // Computed declarations enumerate inherited custom properties in browsers. Include
  // ancestor declarations too for DOM implementations that omit inherited entries.
  for (let element: HTMLElement | null = trigger; element; element = element.parentElement) {
    const style = getComputedStyle(element);
    for (let index = 0; index < style.length; index++) {
      const property = style.item(index);
      if (libraryProperty.test(property)) properties.add(property);
    }
  }
  for (const property of Array.from(target.style)) {
    if (libraryProperty.test(property) && !properties.has(property))
      target.style.removeProperty(property);
  }
  for (const property of properties) {
    let value = computed.getPropertyValue(property);
    for (
      let element: HTMLElement | null = trigger;
      !value && element;
      element = element.parentElement
    ) {
      value = getComputedStyle(element).getPropertyValue(property);
    }
    target.style.setProperty(property, value);
  }
  let scheme = computed.colorScheme;
  for (
    let element: HTMLElement | null = trigger;
    !scheme && element;
    element = element.parentElement
  ) {
    scheme = getComputedStyle(element).colorScheme;
  }
  target.style.colorScheme = scheme;
  target.dir = computed.direction || trigger.closest('[dir]')?.getAttribute('dir') || 'ltr';
}
