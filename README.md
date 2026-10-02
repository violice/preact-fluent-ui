# preact-fluent-ui

`@violice/preact-fluent-ui` provides Preact controls and layout components with Fluent-style CSS for desktop web applications. It is an ESM package with Preact `^10.27.0` as a peer dependency.

Import the theme and component styles explicitly. Importing JavaScript does not load CSS.

```tsx
import { Button, Card } from '@violice/preact-fluent-ui';
import '@violice/preact-fluent-ui/theme.css';
import '@violice/preact-fluent-ui/styles.css';

export function Profile() {
  return <Card><Button variant="primary">Save profile</Button></Card>;
}
```

The current components are `Button`, `Card`, `InfoBar`, `StatusBadge`, `Select`, `PageHeader`, `EmptyState`, and `Icon`. Components and their prop types are exported from the package root. `Icon` includes 22 decorative glyphs at 16, 20, and 24 pixels.

Native attributes, events, and DOM refs are supported. Both `class` and `className` merge with component classes. Select applies these classes to its native select; `wrapperClassName` styles its surrounding span.

Component styling requires `theme.css` and `styles.css`. Optional `reset.css` and `native-controls.css` entries are reserved for application-wide styles and will be completed in the theme/documentation task.

The library code is MIT licensed. See `THIRD_PARTY_NOTICES.txt` and `licenses/fluent-system-icons.txt` for the bundled helpers and icon licenses.
