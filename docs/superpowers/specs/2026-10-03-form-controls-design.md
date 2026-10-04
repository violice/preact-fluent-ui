# Дизайн первой фазы: формы

Дата: 2026-10-03. Статус: пользователь разрешил реализацию 2026-10-03 после уточнения API классов.
Связанное направление: [роадмап](../../roadmap.md).

## Цель и границы

Добавить Field, Input, Textarea, Checkbox и Switch для форм настройки правил, адресов и параметров в приложениях-потребителях. Форма должна работать с theme.css + styles.css, без reset.css и native-controls.css. Значения, валидация, submit и бизнес-логика принадлежат приложению.

В фазу входят публичные типы, CSS, поведенческие тесты, примеры в существующей галерее и проверка npm-архива. Не входят RadioGroup, индикаторы операций, локальные темы, миграции приложений, новая тестовая платформа и публикация.

## Общие ограничения

- Preact peer остаётся `^10.27.0`; новые runtime dependencies не добавляются.
- Существующие exports и четыре CSS entry points сохраняются. Select.wrapperClassName удаляется полностью и заменяется classes.wrapper; прочие существующие props сохраняются. JavaScript не импортирует CSS в опубликованном пакете и не обращается к DOM при импорте.
- Каждый DOM-компонент принимает native props; `class` основной, `className` fallback. У составных компонентов `classes.root` добавляется к выбранному значению и внутренним классам. SignalLike сохраняется. Ref указывает на документированный нативный элемент.
- Управляемый и неуправляемый режимы используют нативные `value/defaultValue` и `checked/defaultChecked`, события Preact передаются без отдельного onValueChange.
- Все пользовательские тексты передаются вызывающим кодом. Нет встроенных английских/русских сообщений.
- Используются существующие theme tokens; размеры первого этапа фиксированы ниже. Новые size/appearance variants не вводятся.
- Работать в текущем checkout без worktree. Реализация разрешена пользователем 2026-10-03. Изменения оставлять без коммитов; push и публикация не входят в задачу.

## Имена props для классов

Пользователь выбрал `class` как основной prop, `className` как fallback и типизированный объект `classes` для основного элемента и внутренних частей. В документации и примерах использовать `class`.

Сначала читать значения SignalLike, затем выбирать `class ?? className`. Fallback применяется только при null/undefined; пустая строка class является явным значением и не включает className. Основной элемент получает внутренние классы и выбранное значение class. У составных компонентов затем добавляется classes.root. Classes не заменяет внутренние классы. ClassName и classes не должны попадать в DOM как лишние атрибуты.

`classes` есть только у составных компонентов с внутренними частями. У Input и Textarea он отсутствует; для единственного элемента достаточно `class` и fallback `className`. Не вводить `classes` с единственным поддерживаемым полем `root`. В Props составных компонентов объявляется свой набор optional ключей с типом `JSX.Signalish<string | undefined>`:

| Компонент | Поля classes | Основной элемент root |
| --- | --- | --- |
| Field | root, label, hint, validation | div |
| Input | отсутствует | input |
| Textarea | отсутствует | textarea |
| Checkbox | root, wrapper, label, indicator | input |
| Switch | root, wrapper, label, track, thumb | input |
| Select | root, wrapper, icon | select |

Не создавать произвольный Record<string, string>: неизвестные поля отклоняются типами. Для classes.label у Checkbox/Switch видимый текст помещается в span, classes.wrapper относится к внешнему label. Slots indicator/track/thumb оформляются отдельными декоративными spans с aria-hidden. Layout остаётся нативным и доступным.

Новые wrapperClass/wrapperClassName/labelClassName props не добавляются. Существующий Select.wrapperClassName удаляется полностью из типов, реализации, тестовых позитивных контрактов и актуальных примеров. Единственный способ передать класс обёртки Select: classes.wrapper. Совместимый fallback и период deprecation не вводятся. Исторические документы сохраняются как записи предыдущего API.

Это целевое соглашение библиотеки. Первая фаза применяет его к пяти новым controls и существующему Select; перевод остальных существующих компонентов требует отдельного согласованного объёма. Их текущее объединение class/className до такого перевода сохраняется.

## Выбор композиции Field

Рассмотрены три подхода:

1. Явные id и отдельные Label/Message. Минимально, но каждый потребитель повторяет связывание ARIA.
2. Context и автоматическое связывание библиотечных controls. Краткая разметка, но сложнее интеграция с обычным HTML и приоритет явно переданных атрибутов.
3. Render prop с готовыми control props. Явная связь, совместимость с Select и HTML, без cloneElement и скрытого изменения дочернего элемента.

Предлагается третий вариант. Field обслуживает ровно один подписываемый control. Группы controls остаются за пределами этого API.

## Публичный API

```tsx
import type { ComponentChildren, JSX } from 'preact';

type ValidationState = 'none' | 'error' | 'warning' | 'success';

interface FieldControlProps {
  id: string;
  'aria-describedby'?: string;
  'aria-invalid'?: true;
  required?: true;
}

type FieldProps = Omit<JSX.HTMLAttributes<HTMLDivElement>, 'children'> & {
  classes?: Partial<Record<'root' | 'label' | 'hint' | 'validation', JSX.Signalish<string | undefined>>>;
  label: ComponentChildren;
  controlId?: string;
  hint?: ComponentChildren;
  validationMessage?: ComponentChildren;
  validationState?: ValidationState;
  required?: boolean;
  children: (props: FieldControlProps) => ComponentChildren;
};

type InputProps = Omit<JSX.InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  type?: 'text' | 'search' | 'email' | 'url' | 'tel' | 'password' | 'number';
};

type TextareaProps = JSX.TextareaHTMLAttributes<HTMLTextAreaElement> & {
};

type CheckboxProps = Omit<JSX.InputHTMLAttributes<HTMLInputElement>, 'type' | 'children'> & {
  label: ComponentChildren;
  indeterminate?: boolean;
  classes?: Partial<Record<'root' | 'wrapper' | 'label' | 'indicator', JSX.Signalish<string | undefined>>>;
};

type SwitchProps = Omit<JSX.InputHTMLAttributes<HTMLInputElement>, 'type' | 'children' | 'role'> & {
  label: ComponentChildren;
  classes?: Partial<Record<'root' | 'wrapper' | 'label' | 'track' | 'thumb', JSX.Signalish<string | undefined>>>;
};
```

Экспортировать пять компонентов, пять Props-типов, FieldControlProps и ValidationState из src/index.ts. Использовать принятый `forwardRef` из preact/compat и pure annotation.

### Field

Root: div, ref: HTMLDivElement. Нативные root props и root id относятся к div, `controlId` относится к дочернему control. `validationState` по умолчанию none. Обязательная label связывается через `htmlFor` с controlId. Для генерации отсутствующего controlId использовать useId; для независимых Preact roots рекомендуются явные уникальные controlId, как у существующих диалогов.

Для base id B создаются идентификаторы B-hint и B-validation. Hint и validationMessage считаются присутствующими, если значение не null/undefined/false/пустая строка; числовой 0 считается содержимым. `aria-describedby` содержит только реально отрисованные блоки в порядке hint, validation. Без блоков атрибут отсутствует. Изменения props пересчитывают связи без устаревших id.

Только error задаёт `aria-invalid=true`; warning/success/none не задают его. Сообщение может существовать с любым состоянием. Ошибка без сообщения также задаёт aria-invalid. Сообщения не получают автоматический role=alert или aria-live: момент объявления ошибок выбирает приложение, чтобы не создавать прерывания при каждом вводе.

required добавляет визуальную звёздочку с aria-hidden и передаёт required=true дочернему control. Подпись, hint и сообщение остаются читаемыми при disabled control. Field не передаёт disabled, не вычисляет validity и не отключает submit.

Render prop вызывается при рендере, полученный объект нужно распространить на один control. Собственные aria-describedby потребителя добавляются к переданным id, а не заменяют их. Это явная операция приложения, отдельный merge helper в фазе не вводится.

```tsx
<Field label="Порт" hint="Число от 1 до 65535" required
  validationState={error ? 'error' : 'none'} validationMessage={error}>
  {(control) => <Input {...control} type="number" min={1} max={65535}
    name="port" value={port} onInput={(event) => setPort(event.currentTarget.value)} />}
</Field>

<Field label="Адаптер">
  {(control) => <Select {...control} name="adapter"><option value="auto">Авто</option></Select>}
</Field>

<Field label="Порт" hint="Число от 1 до 65535">
  {(control) => <Input {...control}
    aria-describedby={[control['aria-describedby'], 'external-help'].filter(Boolean).join(' ')} />}
</Field>
<p id="external-help">Внешнее описание приложения.</p>
```

### Input и Textarea

Ref и native props относятся непосредственно к input/textarea, wrapper отсутствует. Input type по умолчанию text, runtime не подменяет переданный допустимый type. Checkbox/radio/file/date/range/button и прочие types исключены из InputProps; для них пока использовать HTML или отдельный компонент.

Input принимает name, form, required, readOnly, disabled, min/max/step, autocomplete, aria-* и data-* через native props. Textarea сохраняет rows/cols/maxLength и нативное поведение. Не создавать локальные state, эффекты синхронизации значения, форматирование числа или встроенную очистку search.

Минимальная высота обоих controls 36px, padding 7px 12px, font 14px/20px через --type-body/--font-body; Textarea resize: vertical. Использовать текущие цвета control и нижнюю границу, radius-sm, hover, disabled, placeholder, aria-invalid=true и :focus-visible. CSS каждого компонента самодостаточен.

### Checkbox и Switch

Root: label с нативным input type=checkbox внутри. Ref, class/className, id, name, value, form, checked/defaultChecked, required, disabled, aria-* и data-* относятся к input. classes.wrapper относится только к label-обёртке; classes.label к span с видимым текстом. Видимые label children располагаются рядом с input; обёртка обеспечивает клик по тексту. Label обязателен в типах; caller отвечает за непустой доступный текст. Внутренние декоративные части aria-hidden.

Switch задаёт role=switch, не предоставляет indeterminate. Нативный checked служит источником доступного состояния, дополнительный вручную поддерживаемый aria-checked не нужен. Checkbox сохраняет нативную checkbox-семантику.

Checkbox indeterminate по умолчанию false. Устанавливать DOM-свойство через layout effect после commit на mount и обновлениях, совмещая внутренний ref с callback/object ref потребителя. При изменении checked или indeterminate заново применять указанное indeterminate. Браузер снимает mixed после пользовательского переключения; компонент не восстанавливает его до следующего изменения checked/indeterminate. Checked и indeterminate независимы, FormData определяется checked. Cleanup обнуляет внешний ref; HTML-атрибут indeterminate не создаётся.

Для обоих controls Space переключает состояние через нативный input, disabled исключает взаимодействие и Tab-фокус, checked controls отправляют нативные name/value через форму. Enter специально не перехватывается. Form reset работает нативно; сброс indeterminate через form reset специально не управляется, поскольку это не нативное default-свойство.

## Оформление и доступность

- Field: label 14px/20px semibold, вертикальная колонка, gap 4px; hint/message 12px/16px. Текст переносится, min-width: 0.
- Checkbox: mark 18px, row min-height 32px, gap 8px. Switch: track 36x20px, thumb 14px с отступом 3px, row min-height 32px, gap 8px. Длинная label переносится.
- Нативные inputs остаются фокусируемыми и в accessibility tree; не использовать display:none/visibility:hidden. Допустимо appearance:none с CSS оформлением непосредственно input; mark/thumb могут быть соседними декоративными spans.
- Focus-visible: outline 2px solid --color-focus, offset 2px. Disabled: --color-disabled, подпись остаётся читаемой. Selected/mixed: --color-accent и --color-on-accent.
- Ошибка имеет текстовое сообщение; aria-invalid border использует --color-danger. В forced colors ошибка получает dashed border, selected/mixed/focus используют системные цвета, различимость сохраняется без shadow.
- Switch transition не более 120ms ease; prefers-reduced-motion отключает transition. Перемещение thumb поддерживает dir=rtl; layout использует logical properties.
- Component classes должны перекрывать low-specificity :where правила native-controls.css. Full и Minimal дают одинаковое оформление новых компонентов. У существующих обычных HTML полей поведение не меняется.
- `[hidden]` на Field/Input/Textarea скрывает root; на Checkbox/Switch скрывает input и всю его label-обёртку. Для двух последних потребительский hidden обрабатывается также на root, остальные input props остаются на input.

## Структура

Создать пары component/module.css: field, input, textarea, checkbox, switch в src/components. Создать отдельный test.tsx для каждого. При необходимости общие стили Input/Textarea вынести в src/components/text-control.module.css, сохранив компонентные exports; не менять native-controls.css ради нового API. Отдельный публичный context не вводится.

Обновить src/classes.ts, src/components/select.tsx и его контрактные тесты, src/index.ts, scripts/check-dist.mjs, packed consumer api-contract/main/minimal, docs/api.md, README.md, галерею и code-samples.ts. Расширять текущие тесты и сценарии, не добавлять Storybook и новый browser runner.

## Приёмка

1. Field корректно связывает label, required, hint и ошибки с Input, Textarea, Select и обычным HTML input; id стабильны при rerender и уникальны в одном root.
2. Все controls сохраняют refs, события, native form submission/reset, управляемый/неуправляемый режимы и приоритет class/className и добавление classes.root у составных компонентов. Mixed Checkbox не нарушает checked и forwarded refs.
3. Проверены label click, Space, disabled, readOnly для text controls, обновление validation и hidden wrappers.
4. Галерея содержит обычные/disabled/invalid/mixed/checked состояния и работающую форму. Full/Minimal, light/dark, 320px и 200% zoom сохраняют читаемость и фокус.
5. Native T3 preview подтверждает keyboard и layout. Windows forced colors, reduced motion и screen reader либо проверены с записанным результатом, либо явно отмечены pending; без необоснованной отметки passed.
6. Build, check, build:gallery и test:package:all проходят. Один архив проверен на locked peer и Preact 10.27.0; DOM-free import, declarations и tree shaking сохраняются.

## Источники и статус решений

[Fluent Field](https://fluent2.microsoft.design/components/web/react/core/field/usage) описывает подписи, helper text, validation и required; [Fluent Switch](https://fluent2.microsoft.design/components/web/react/core/switch/usage) описывает переключатели. Точные props, render prop, размеры и границы типов выше являются предложениями для этой библиотеки, а не заявлениями о полном соответствии Fluent React API.
