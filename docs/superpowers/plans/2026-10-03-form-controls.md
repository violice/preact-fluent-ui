# Form controls Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Добавить доступные Field, Input, Textarea, Checkbox и Switch без зависимости от необязательных глобальных стилей.

**Architecture:** Field предоставляет render prop с явными id/ARIA связями. Controls сохраняют нативные элементы, props, refs и form behavior; CSS Modules используют существующие theme tokens. Приложение владеет значениями и валидацией.

**Tech Stack:** Preact, TypeScript, CSS Modules, Vite, Vitest, Testing Library, существующие npm archive checks.

**Spec:** [2026-10-03-form-controls-design.md](../specs/2026-10-03-form-controls-design.md)

Статус: выполняется по явному поручению пользователя от 2026-10-03 после согласования API классов.

## Global Constraints

- Preact peer остаётся `^10.27.0`; новые runtime dependencies не добавляются.
- Существующие exports и четыре CSS entry points сохраняются. Select.wrapperClassName удаляется полностью и заменяется classes.wrapper; прочие существующие props сохраняются. JavaScript не импортирует CSS в опубликованном пакете и не обращается к DOM при импорте.
- Каждый DOM-компонент принимает native props; `class` основной, `className` fallback, `classes.root` добавляется к выбранному значению и внутренним классам. SignalLike сохраняется. Ref указывает на документированный нативный элемент.
- Управляемый и неуправляемый режимы используют нативные `value/defaultValue` и `checked/defaultChecked`, события Preact передаются без отдельного onValueChange.
- Все пользовательские тексты передаются вызывающим кодом. Нет встроенных английских/русских сообщений.
- Используются существующие theme tokens; размеры первого этапа фиксированы ниже. Новые size/appearance variants не вводятся.
- Работать в текущем checkout без worktree. Реализация разрешена пользователем 2026-10-03. Изменения оставлять без коммитов; push и публикация не входят в задачу.

В документации, галерее и пользовательских примерах использовать `class` и `classes`. Для новых controls и Select fallback определяется после чтения SignalLike как `class ?? className`; classes.root добавляется, не заменяет внутренние классы. Пустая строка class не включает fallback. Select.wrapperClassName удаляется полностью; использовать только classes.wrapper, без fallback. Остальные существующие компоненты не переводятся скрытно в этой фазе.

Коммиты во время будущего выполнения делать только в рамках актуального разрешения пользователя; каждый завершённый task является удобной границей. Не менять версию, не публиковать, не мигрировать соседние приложения.

## Review Focus

- Dynamic validation: удаление hint/message/state не оставляет aria-describedby на отсутствующем элементе. Покрывает task 2.
- Несколько Field и ручные controlId: label и description не связываются с соседним control. Покрывает task 2.
- Checkbox mixed + checked + callback ref: эффекты не подменяют checked и не теряют ref, пользователь может переключить mixed. Покрывает task 3.
- Native reset/submit и disabled: wrappers не меняют содержимое FormData и начальные значения. Покрывают tasks 1, 3, 4.
- Minimal, hidden и RTL: controls сохраняют оформление без globals, hidden wrapper не оставляет подпись, Switch не смещает thumb в неверную сторону. Покрывают tasks 3, 4, 5.

## Карта файлов

| Файлы | Ответственность |
| --- | --- |
| src/components/input.tsx, textarea.tsx и соответствующие .module.css/.test.tsx | Нативные текстовые controls |
| src/components/field.tsx, field.module.css, field.test.tsx | Label, сообщения и render prop |
| src/components/checkbox.tsx, checkbox.module.css, checkbox.test.tsx | Checkbox и mixed DOM state |
| src/components/switch.tsx, switch.module.css, switch.test.tsx | Нативный checkbox с role=switch и track/thumb |
| src/index.ts | Публичные компоненты и типы |
| scripts/check-dist.mjs | Пять новых exports в DOM-free probe |
| tests/package-consumer/src/api-contract.tsx, main.tsx, minimal.tsx | Типовой контракт и npm consumer |
| examples/gallery/src/gallery.tsx, code-samples.ts, gallery.test.tsx | Сценарии и копируемые примеры |
| README.md, docs/api.md, docs/visual-acceptance.md | Документация и результаты проверки |

Если одинаковый CSS Input/Textarea вынесен в text-control.module.css, он остаётся в src/components и подключается только из соответствующих компонентов; публичный CSS entry point не добавляется.

---

### Task 1: Input и Textarea

**Files:** Modify `src/classes.ts`, `src/components/select.tsx`, `src/components/controls.test.tsx`; create `src/components/input.tsx`, `input.module.css`, `input.test.tsx`, `textarea.tsx`, `textarea.module.css`, `textarea.test.tsx`; modify `src/index.ts`, `scripts/check-dist.mjs`.

**Interfaces:** Produces `Input: forwardRef<HTMLInputElement, InputProps>`, `Textarea: forwardRef<HTMLTextAreaElement, TextareaProps>` и Props согласно spec. Input type union точно из spec, default text. Все последующие tasks используют эти exports и внутренний `resolveClass(classProp: JSX.Signalish<string | undefined>, className: JSX.Signalish<string | undefined>): string | undefined` из src/classes.ts. Он читает SignalLike значения и возвращает первое non-nullish значение. Существующий mergeClasses остаётся для объединения выбранного значения со styles и classes.root.

- [x] Написать failing tests с cleanup после каждого теста. Для Input: ref на input, default type=text, приоритет class над className, fallback и classes.root включая обновляемый SignalLike, onInput/currentTarget, readOnly, disabled, required, name/form, aria-invalid и data props. Для Textarea: ref на textarea, rows/maxLength, переносы строк, class fallback и classes slots. Для обоих проверить controlled rerender и uncontrolled reset. Базовый тест:

```tsx
const ref = createRef<HTMLInputElement>();
render(<form aria-label="form"><Input ref={ref} name="port" defaultValue="80"
  class="first" className="ignored" classes={{ root: 'second' }} aria-label="Port" /></form>);
const input = screen.getByRole('textbox', { name: 'Port' }) as HTMLInputElement;
expect(ref.current).toBe(input);
expect(input.type).toBe('text');
expect(input.classList.contains('first')).toBe(true);
expect(input.classList.contains('second')).toBe(true);
expect(input.classList.contains('ignored')).toBe(false);
await userEvent.setup().clear(input);
await userEvent.setup().type(input, '443');
expect(new FormData(input.form!).get('port')).toBe('443');
input.form!.reset();
expect(input.value).toBe('80');
```

- [x] Запустить `npx vitest run src/components/input.test.tsx src/components/textarea.test.tsx`. Зафиксировать FAIL из-за отсутствующих exports, не из-за неверной настройки среды.
- [x] Реализовать resolveClass и wrappers без local value state. У Select добавить classes с root/wrapper/icon и полностью удалить wrapperClassName из props и реализации. Заменить его на classes.wrapper в README.md, docs/api.md, актуальной галерее и consumer-примерах; исторические документы не переписывать. Обновить относящиеся к Select assertions существующего controls.test.tsx; остальные компоненты сохранить. Проверить class отсутствует, пуст, задан одновременно с className; SignalLike меняется с undefined на значение и обратно; classes.root добавляется. Проверить classes.wrapper применяется к обёртке, classes.root к select, classes.icon к SVG; classes не попадает в DOM. CSS по spec: min-height 36px, padding 7px 12px, font 14px/20px, Textarea vertical resize; hover, disabled, invalid, placeholder, focus 2px/2px, forced-colors, reduced-motion и hidden. Добавить runtime/type exports в index и имена в exportProbe check-dist.
- [x] Повторить targeted tests, затем `npm run build` и `npm run typecheck`. Ожидается exit 0 и существующий DOM-free import probe проходит с новыми exports.
- [x] Проверить diff и завершить task без несвязанных изменений; зафиксировать результат targeted tests.

### Task 2: Field и доступные связи

**Files:** Create `src/components/field.tsx`, `field.module.css`, `field.test.tsx`; modify `src/index.ts`, `scripts/check-dist.mjs`.

**Interfaces:** Consumes Input/Textarea task 1 и существующий Select. Produces `Field: forwardRef<HTMLDivElement, FieldProps>`, `FieldProps`, `FieldControlProps`, `ValidationState` точно по spec. Children только render function.

- [x] Написать failing tests для label click, required, заданного controlId, root id/ref/classes, двух Field в одном root, стабильных generated ids, обычного input и Select. Проверить error/warning/success/none с сообщением и без; hint+message order; значения null/false/empty/0; удаление описаний при rerender. Основной контракт:

```tsx
const { rerender } = render(<Field label="Port" controlId="port" hint="Hint"
  validationState="error" validationMessage="Invalid" required>
  {(props) => <Input {...props} />}
</Field>);
const input = screen.getByRole('textbox', { name: 'Port' }) as HTMLInputElement;
expect(input.id).toBe('port');
expect(input.required).toBe(true);
expect(input.getAttribute('aria-invalid')).toBe('true');
expect(input.getAttribute('aria-describedby')).toBe('port-hint port-validation');
expect(document.getElementById('port-validation')?.textContent).toBe('Invalid');
rerender(<Field label="Port" controlId="port">{(props) => <Input {...props} />}</Field>);
expect(input.hasAttribute('aria-describedby')).toBe(false);
expect(input.hasAttribute('aria-invalid')).toBe(false);
expect(input.required).toBe(false);
```

- [x] Запустить `npx vitest run src/components/field.test.tsx`, подтвердить FAIL на отсутствующем Field.
- [x] Реализовать useId + controlId, label htmlFor, conditionally rendered hint/message и render prop. Не cloneElement, не context, не live region. CSS: gap 4px, label 14px/20px semibold, helper 12px/16px, wrapping, logical properties и hidden. Добавить exports и check-dist probe.
- [x] Повторить targeted tests, затем `npm run build` и `npm run typecheck`, ожидается exit 0.
- [x] Проверить diff и записать результат task. В docs примере показать добавление собственного aria-describedby через объединение с props, если потребителю нужен внешний description.

### Task 3: Checkbox с mixed state

**Files:** Create `src/components/checkbox.tsx`, `checkbox.module.css`, `checkbox.test.tsx`; modify `src/index.ts`, `scripts/check-dist.mjs`.

**Interfaces:** Produces `Checkbox: forwardRef<HTMLInputElement, CheckboxProps>` точно по spec, с required label, optional indeterminate и classes с root/wrapper/label/indicator. Не вводит public ref helper.

- [x] Написать failing tests: label click и Space вызывают native change; disabled не меняется; controlled checked и uncontrolled defaultChecked/reset; FormData с value и без value; callback/object refs; class fallback и все classes slots; hidden скрывает wrapper. Mixed test:

```tsx
const ref = createRef<HTMLInputElement>();
const { rerender } = render(<Checkbox ref={ref} label="Enabled" checked={false} indeterminate />);
const input = screen.getByRole('checkbox', { name: 'Enabled' }) as HTMLInputElement;
expect(ref.current).toBe(input);
expect(input.indeterminate).toBe(true);
expect(input.checked).toBe(false);
expect(input.hasAttribute('indeterminate')).toBe(false);
rerender(<Checkbox ref={ref} label="Enabled" checked indeterminate={false} />);
expect(input.checked).toBe(true);
expect(input.indeterminate).toBe(false);
```

Отдельно проверить uncontrolled mixed click: input.indeterminate становится false, следующий checked/indeterminate prop update снова применяет mixed. Callback ref получает input на mount и null на unmount; unrelated rerender не должен искусственно возвращать mixed.

- [x] Запустить `npx vitest run src/components/checkbox.test.tsx`, подтвердить FAIL.
- [x] Реализовать label/input, native props, hidden на wrapper/input, ref composition и layout effect с зависимостями checked/indeterminate. CSS: 18px mark, 32px row, gap 8px, native focus, mixed/checked визуальные состояния, disabled, forced-colors. Изменение mixed не выполняется в render и не создаёт attribute.
- [x] Повторить targeted tests, `npm run build`, `npm run typecheck`, ожидается exit 0.
- [x] Проверить diff и записать результат task.

### Task 4: Switch

**Files:** Create `src/components/switch.tsx`, `switch.module.css`, `switch.test.tsx`; modify `src/index.ts`, `scripts/check-dist.mjs`.

**Interfaces:** Produces `Switch: forwardRef<HTMLInputElement, SwitchProps>` из spec. Checkbox behavior использовать как reference, не как вложенный public component с чужой семантикой.

- [x] Написать failing tests для native type=checkbox, role=switch, доступной label, object/callback refs, checked/defaultChecked, click/Space/change, disabled/Tab skip, FormData и reset, classes root/wrapper/label/track/thumb separation и class fallback, hidden. Базовый тест:

```tsx
render(<form><Switch label="Auto apply" name="auto" value="yes" defaultChecked /></form>);
const input = screen.getByRole('switch', { name: 'Auto apply' }) as HTMLInputElement;
expect(input.type).toBe('checkbox');
expect(input.checked).toBe(true);
expect(new FormData(input.form!).get('auto')).toBe('yes');
await userEvent.setup().click(screen.getByText('Auto apply'));
expect(input.checked).toBe(false);
expect(new FormData(input.form!).has('auto')).toBe(false);
input.form!.reset();
expect(input.checked).toBe(true);
```

- [x] Запустить `npx vitest run src/components/switch.test.tsx`, подтвердить FAIL.
- [x] Реализовать label/input с role=switch, без state и ручного aria-checked, с classes root/wrapper/label/track/thumb; добавить exports/probe. Track 36x20px, thumb 14px/3px, row 32px, gap 8px; focus, selected, disabled, forced-colors и reduced-motion. RTL thumb position определяется направлением; не зеркалить доступный текст.
- [x] Повторить targeted tests, `npm run build` и `npm run typecheck`, ожидается exit 0. Геометрию RTL, движение и forced colors проверять браузером task 5, jsdom не считать доказательством CSS layout.
- [x] Проверить diff и записать результат task.

### Task 5: Галерея и документация

**Files:** Modify `examples/gallery/src/gallery.tsx`, `code-samples.ts`, `gallery.test.tsx`, при необходимости `gallery.module.css`; `docs/api.md`, `README.md`, `docs/visual-acceptance.md`.

**Interfaces:** Consumes все пять компонентов и FieldControlProps. Produces копируемые примеры и действующую форму, сохраняя существующие settings/Full/Minimal/theme/Highlight.

- [x] Дополнить gallery tests failing сценарием: найти Field input по label, отправить пустую required форму через предусмотренный demo submit/validation flow, увидеть inline error, исправить значение и получить успешный результат; выбрать Checkbox и Switch и проверить результат формы. Test asserts должны соответствовать выбранным demo labels, записанным в code-samples и галерее. Не дублировать unit tests нативных controls в gallery.
- [x] Запустить `npx vitest run examples/gallery/src/gallery.test.tsx`, подтвердить FAIL по отсутствующим новым сценариям.
- [x] Добавить секцию Forms: Input normal/disabled/readOnly/error, Textarea, Checkbox checked/mixed/disabled, Switch on/off/disabled, Field hint/validation и форму порт+адаптер. Demo form использует noValidate и собственную submit-валидацию порта 1..65535, чтобы пустой required Input доходил до обработчика и показывал inline error. Required-семантика control сохраняется. Форма показывает локализованный текст и не меняет API библиотеки. Code samples соответствуют поведению и imports. В docs/api.md описать все Props/ref targets, merge ARIA, generated id limits и mixed/reset behavior; README содержит краткий пример Field+Input.
- [x] Запустить targeted gallery tests, `npm run build` и `npm run build:gallery`, ожидается exit 0.
- [x] Запустить `npm run dev`, выполнить native T3 preview_status/open и проверить Full/Minimal × light/dark: внешний вид, no horizontal overflow при 320px, 200% zoom, long labels, RTL switch, hidden wrappers, label click, Space, Tab и disabled, field error correction. Записать окружение и результаты в docs/visual-acceptance.md; Windows forced colors/reduced motion/screen reader проверять доступными средствами, иначе явно pending. Не использовать standalone Playwright при доступном T3 preview.
- [x] Проверить diff и записать результат task; не объявлять pending ручные проверки пройденными.

### Task 6: Контракт npm-потребителя и итоговая проверка

**Files:** Modify `tests/package-consumer/src/api-contract.tsx`, `main.tsx`, `minimal.tsx`; `scripts/test-package.mjs` только если надо расширить существующий export/tree-shaking сценарий.

**Interfaces:** Consumes публичные компоненты/типы и сохранённые четыре CSS exports. Produces архив, проходящий существующие consumer checks с locked peer и Preact 10.27.0.

- [x] Добавить type contracts для пяти компонентов: native currentTarget и callback/object refs, Field render props, существующий Select внутри Field. Проверить unknown keys в classes отклоняются для каждого компонента, SignalLike принимается, Select/Checkbox/Switch wrapperClassName отклоняется через @ts-expect-error; совместимый алиас отсутствует. Negative contracts: Input type=checkbox/date, неизвестный validationState, children не функция, Switch indeterminate/type/role, Checkbox type, отсутствие label у Field/Checkbox/Switch. Перед реализацией отдельного контрактного изменения проверить, что negative assertion действительно ловит ошибку, а не маскирует неверный import.
- [x] Расширить consumer main примерами всех пяти controls. Сохранить minimal.tsx как Button-only для существующей проверки tree shaking; оформление всех controls в Minimal CSS проверяет галерея. Добавить новые имена в необходимые списки probes, не менять закрытые internal imports и DOM-free проверки. Сохранить Button-only tree-shaking сценарий и убедиться, что он исключает новые controls; обновить проверки лишь там, где текущая структура требует новых имён.
- [x] Запустить по порядку `npm run build`, `npm run check`, `npm run build:gallery`, `npm run test:package:all`. Все exit 0; test:package:all проверяет тот же архив с locked peer и 10.27.0. Не запускать параллельно команды, изменяющие dist/archive.
- [x] Сопоставить итоговый diff со spec, проверить docs links/code samples и записать ограничения ручной проверки. Провести review по доступному разрешённому процессу; не создавать worktree и не публиковать. Если разрешены коммиты, разделить их по завершённым deliverables; иначе оставить изменения uncommitted.

## Порядок и завершение

Выполнять tasks последовательно 1 → 2 → 3 → 4 → 5 → 6. Unit tests проверяют собственное поведение компонентов и публичный контракт; CSS/keyboard интеграцию дополнительно проверяет native preview. Не добавлять отдельные тесты, повторяющие тривиальные CSS declarations.

При передаче на выполнение сначала прочитать spec и план целиком, сверить актуальные пользовательские ограничения и получить ревью документов. Способ исполнения сохраняется из актуального контекста пользователя; подготовка этих документов сама по себе не разрешает реализацию или делегирование.

## Итог, 2026-10-04

Реализация и итоговое ревью завершены. Build, check, build:gallery и test:package:all прошли; 157 поведенческих и 2 release-теста. Один архив проверен с Preact 10.29.8 и 10.27.0, Button-only consumer исключает все новые controls. Браузерные результаты и оставшиеся ручные проверки записаны в [visual-acceptance](../../visual-acceptance.md#form-controls-phase-1-2026-10-04). Настоящий browser zoom 200%, Windows forced colors/reduced motion и screen reader остаются pending. Изменения оставлены без коммитов в feat/form-controls, публикация не выполнялась.

## Уточнение API, 2026-10-04

По решению пользователя `classes` доступен только составным компонентам с внутренними частями. Набор только из `root` запрещён. Input и Textarea используют `class`/fallback `className` без `classes`; соответствующие первоначальные шаги выше заменены этим уточнением. Контракт npm-потребителя отклоняет даже `classes={{ root: ... }}` у этих двух компонентов.
