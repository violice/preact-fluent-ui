# Роадмап preact-fluent-ui

Дата: 2026-10-03. Основа: текущая версия 0.1.0 и исследование Fluent 2.
Пользователь поручил сохранить направления развития и подготовить дизайн и план первой фазы. Реализация первой фазы разрешена пользователем 2026-10-03. Сроки, следующие фазы и номера релизов пока не согласованы.

## Направление

Развивать небольшую Preact-библиотеку для desktop web-приложений и утилит. Сохранять нативную семантику HTML, явные CSS imports, CSS Modules, независимые primary/accent и существующую Fluent-style галерею. Полное повторение каталога Microsoft не является целью.

Основной prop класса: `class`; `className` используется как fallback. У компонентов из одного элемента, включая Input и Textarea, prop `classes` отсутствует. `classes` вводится только для составных компонентов и никогда не содержит только поле `root`. Для классов внутренних частей используется типизированный объект `classes` с `root` и необходимыми именованными полями. В первой фазе соглашение применяется к новым controls и Select. Дополнительно соглашение применено к PageHeader, EmptyState, InfoBar, DialogHeader, Modal и ConfirmDialog. Button, Card, StatusBadge, Icon, DialogBody и DialogFooter сохраняют прежнее объединение class/className и не получают classes: пользовательские children не считаются внутренними частями.

## Фазы

| Фаза | Состав | Результат |
| --- | --- | --- |
| 1. Формы | Field, Input, Textarea, Checkbox, Switch | Формы с едиными подписями, подсказками, ошибками и доступными переключателями без обязательного native-controls.css |
| 2. Состояния операций | Spinner, ProgressBar, Button pending, действия/закрытие InfoBar | Понятное выполнение операций, повторная попытка и постоянные сообщения об ошибках |
| 3. Контекстные подсказки | Tooltip, затем Popover при необходимости | Подсказки для мыши и клавиатуры, размещение у границ окна |
| 4. Темы и оформление | System/light/dark API, локальные темы с наследованием в порталах, typography и motion tokens | Управление темой библиотекой, согласованные текстовые и анимационные стили |
| 5. Организация экранов | RadioGroup, Tabs, Toolbar, Menu, Toast по подтверждённой потребности | Выбор вариантов, группы действий и уведомления для конкретных экранов |

RadioGroup перенесён в последующие фазы: согласованный первый набор состоит из Field, Input, Textarea, Checkbox и Switch. Toast предназначен для некритичных временных сообщений; важные ошибки остаются в Field или InfoBar.

## Сквозные улучшения

- Для каждого нового компонента добавлять API, примеры, состояния, клавиатурное управление и рекомендации применения в текущую галерею. Сохранять TanStack Highlight, Full/Minimal и настройку темы.
- Проверять светлую/тёмную тему, узкую ширину, масштабирование, длинные и локализованные подписи, RTL и видимый фокус.
- Закрыть ручные Windows-проверки forced colors и reduced motion; автоматические CSS-проверки не заменяют их.
- Сохранять проверку одного npm-архива с locked и минимальной поддерживаемой версией Preact. Измерять влияние новых компонентов на bundle и tree shaking.
- Combobox, Tree, DataGrid и другие сложные компоненты проектировать только под конкретный сценарий потребителя.

## Первая фаза

Реализована 2026-10-04. Компоненты, галерея, API и npm-контракт прошли итоговое ревью и проверки с Preact 10.29.8/10.27.0. [Результаты браузерных проверок](visual-acceptance.md#form-controls-phase-1-2026-10-04) содержат оставшиеся ручные проверки доступности и масштаба. Публикация пакета пока не выполнялась.

- [Дизайн](superpowers/specs/2026-10-03-form-controls-design.md)
- [План реализации](superpowers/plans/2026-10-03-form-controls.md)

Критерий выбора следующей фазы: реальная потребность приложений и результат проверки первой фазы, а не количество компонентов в каталоге.

## Галерея документации и Sidebar

Sidebar, SidebarHeader, SidebarNav, SidebarGroup, SidebarItem и SidebarFooter реализованы в текущем checkout. Они сохраняют нативные props/ref и не зависят от роутера. Английская галерея содержит 30 страниц, отдельные примеры всех 24 публичных компонентов и руководства Theming, Styling, Forms и Signals. preact-iso и @preact/signals используются только как devDependencies галереи.

Prerender создаёт все известные страницы и 404.html для корневого и repository base. Pages проверяет Sidebar exports опубликованного пакета и останавливается с явной ошибкой, если их нет. Новая версия пакета и галерея пока не опубликованы.

- [Дизайн](superpowers/specs/2026-10-04-gallery-navigation-design.md)
- [План и проверки](superpowers/plans/2026-10-04-gallery-navigation.md)
- [x] Итоговая готовность подтверждена после финального ревью и браузерной проверки. Windows forced colors, reduced motion, реальный screen reader и настоящий browser zoom 200% остаются отдельными ручными проверками.

## Компоненты данных

Согласованы Table, Pagination, DataToolbar, DataList и отдельный Separator.
DataList использует direction для расположения подписи и значения;
Separator использует orientation для направления линии. Фильтрация,
сортировка и разбиение данных остаются в приложении.

- [Дизайн](superpowers/specs/2026-10-05-data-components-design.md)
- [План](superpowers/plans/2026-10-05-data-components.md)
- [x] Реализованы пять семейств и их публичные экспорты.
- [x] Итоговая проверка пакета, галереи, браузера и независимое ревью. [Браузерные результаты](visual-acceptance.md#data-components-and-gallery-spacing-2026-10-05) отмечают оставшуюся ручную проверку forced colors.

## Источники

- [Каталог Fluent Web](https://fluent2.microsoft.design/components/web/react)
- [Field](https://fluent2.microsoft.design/components/web/react/core/field/usage)
- [Switch](https://fluent2.microsoft.design/components/web/react/core/switch/usage)
- [Tooltip](https://fluent2.microsoft.design/components/web/react/core/tooltip/usage)
- [Toast](https://fluent2.microsoft.design/components/web/react/core/toast/usage)
- [Design tokens](https://fluent2.microsoft.design/design-tokens)
- [Typography](https://fluent2.microsoft.design/typography)
- [Motion](https://fluent2.microsoft.design/motion)

## Disclosure, loading и Tooltip, 2026-10-05

Реализованы нативные Disclosure/DisclosureSummary/DisclosureContent, Spinner, LoadingState, Button loading и Tooltip. Галерея содержит примеры ошибок, файлов, загрузки, действий и подсказок в таблице и Modal. ProgressBar, Popover и действия InfoBar остаются отдельными будущими задачами. Миграция приложений и публикация пакета не входят в эту работу. Браузерная приёмка новых компонентов выполняется отдельно; ручные forced colors и screen reader остаются в критериях проверки.
