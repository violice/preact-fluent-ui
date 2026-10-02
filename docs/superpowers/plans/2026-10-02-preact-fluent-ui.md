# preact-fluent-ui Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans for inline execution, or superpowers:subagent-driven-development if the user selects delegation. Implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Подготовить `@violice/preact-fluent-ui@0.1.0`, который предоставляет общий UI четырёх Preact-приложений и работает после установки из npm-архива.

**Architecture:** Один отдельный ESM-пакет. Vite собирает компоненты и CSS Modules, TypeScript выпускает декларации, глобальные стили подключаются явно. Поведение переносится из существующих компонентов с согласованием публичных props; бизнес-логика остаётся в приложениях.

**Tech Stack:** Node 24, npm, Preact 10, TypeScript, Vite library mode, CVA, clsx, Vitest, Testing Library, jsdom, Oxlint/Oxfmt, GitHub Actions.

**Spec:** [2026-10-02-preact-fluent-ui-design.md](../specs/2026-10-02-preact-fluent-ui-design.md).

## Global Constraints

- Имя проекта `preact-fluent-ui`, npm-пакета `@violice/preact-fluent-ui`, первая версия `0.1.0`.
- Preact peer dependency `^10.27.0`; `preact` и все `preact/*` external. CVA и clsx включаются в JS-сборку.
- Только ESM, sourcemaps и `.d.ts`. Компоненты и публичные типы экспортируются из корня, внутренних subpaths нет.
- Четыре CSS exports: `theme.css`, `styles.css`, `reset.css`, `native-controls.css`. Импорт JS не подключает CSS. CSS перечислен в `sideEffects`.
- Обязательное оформление компонентов работает с `theme.css` и `styles.css`. Reset и native-controls необязательны.
- Сохраняются имена токенов `--color-*`, `--space-*`, `--radius-*`, `--font-*`, `--type-*`, `--shadow-*`, а также существующий `--weight-semibold`.
- Primary и accent независимы. По умолчанию primary ссылается на accent. Системная тема, forced colors и reduced motion входят в v1.
- Один активный Modal; тема портала наследуется от `:root`. ThemeProvider и тема вложенного контейнера вне v1.
- Tauri, Rust, Signals-модели, роутер, оболочка, предметные таблицы и TextComparison остаются в приложениях.
- MIT для собственного кода; оригинальная лицензия Fluent SVG и notices включаются в пакет. Файлы шрифтов не распространяются.
- Push/PR проверяют код, сборку и архив. Публикация по GitHub Release после повторных проверок и сверки тега с версией.

## Review Focus

- Компоненты без reset/native-controls сохраняют размеры, границы, шрифт и видимый клавиатурный фокус. Проверка галереи в задаче 4.
- Modal со скрытыми, disabled, inert controls или без controls не отдаёт Tab фону. Тесты задачи 3 и браузерная проверка задачи 4.
- После удаления инициатора Modal восстанавливает фокус через переданный fallback, сохраняет уже установленный inert и прежний overflow. Тесты задачи 3.
- Декларации и CSS доступны вне исходного репозитория; Preact не встраивается в библиотеку, CVA/clsx не нужны потребителю. Проверки задачи 5.
- Зелёный accent и отдельный тёмный primary сохраняются одновременно, в forced colors оба используют системные цвета. Проверки задачи 4 и план миграции Xbox DNS.

## Границы и последовательность

Этот план создаёт библиотеку и готовит выпуск. [Отдельный план миграции](2026-10-02-preact-fluent-ui-migration.md) подключает её к приложениям после проверки пакета. Два результата можно принимать отдельно.

Исходное состояние на 2026-10-02: здесь только дизайн-документ, Git и package.json отсутствуют. В соседних приложениях нет `.codegraph/`. Создавать код, Git, устанавливать зависимости или публиковать пакет при подготовке этого плана не требуется.

Порядок: 1 → 2 → 3 → 4 → 5 → 6. После задачи 5 возможна локальная пробная миграция port-proxy через архив. Финальная миграция использует опубликованную версию и lockfile.

## Контракт первой версии

Все перечисленные props-типы экспортируются из `src/index.ts`. Компоненты возвращают Preact JSX. Для компонентов с корневым DOM-элементом `ref` указывает на этот элемент через `preact/compat` forwardRef, а не на экземпляр функции-компонента.

| Компонент и тип | Контракт | Элемент для нативных props/ref |
| --- | --- | --- |
| Button / ButtonProps | Native button attrs; variant `default \| primary \| subtle \| danger`, size `default \| compact \| icon`; default type `button` | button |
| Card / CardProps | Native HTML attrs, children | section |
| InfoBar / InfoBarProps | Native div attrs; tone `info \| success \| warning \| error`, title?: string; role по умолчанию alert для error, status иначе | div |
| StatusBadge / StatusBadgeProps | Native span attrs; tone `neutral \| success \| warning \| error` | span |
| Icon / IconProps / IconName | SVG attrs без children/width/height; name: IconName, size?: `16 \| 20 \| 24`, default 20; всегда декоративный | svg |
| Select / SelectProps | Native select attrs; wrapperClassName?: string. class/className относятся к select | select; wrapperClassName к span |
| PageHeader / PageHeaderProps | HTML header attrs без children/title; title: string, description: string, actions?, notices?: ComponentChildren | header; notices после header |
| EmptyState / EmptyStateProps | HTML section attrs без title; title: string, icon?: IconName, children?; default icon `routes`, default role status | section |
| DialogHeader / DialogHeaderProps | HTML header attrs без id/title/children; id: string, title: string, description?: ComponentChildren | ref и attrs на header; id на h2 для labelledBy |
| DialogBody / DialogBodyProps | Native div attrs, children | div |
| DialogFooter / DialogFooterProps | Native footer attrs, children | footer |
| Modal / ModalProps | Native div attrs без children/onClose/role/aria-modal/aria-labelledby; labelledBy: string, initialFocusRef: RefObject<HTMLElement>, fallbackFocusRef?: RefObject<HTMLElement>, onClose(): void, children: ComponentChildren | div role=dialog внутри портала |
| ConfirmDialog / ConfirmDialogProps | title: string, children: ComponentChildren, cancelLabel: string, confirmLabel: string, pendingLabel: string; busy?, confirmDisabled?, danger?: boolean; fallbackFocusRef?: RefObject<HTMLElement>; onClose(): void, onConfirm(): void | составной компонент, собственного ref нет |

`class` и `className` объединяются с внутренними классами. Контролируемые нативные props и события передаются без собственного состояния. Составные параметры не попадают в DOM. Modal сохраняет пользовательские обработчики клавиатуры; отменённое событие через preventDefault не обрабатывается повторно. Инварианты role/aria-modal/aria-labelledby и декоративность Icon нельзя переопределить.

Три label ConfirmDialog обязательны: библиотека не выбирает язык. `busy` по умолчанию false, блокирует обе кнопки, Escape и backdrop. `confirmDisabled` блокирует только подтверждение. Busy управляет вызывающее приложение; внутренней асинхронной операции нет.

Объединённый IconName содержит ровно 22 существующих имени: `about`, `adapter`, `add`, `chevron-down`, `connected`, `copy`, `delete`, `diagnostics`, `disconnected`, `edit`, `eye`, `info`, `network`, `open`, `profile`, `refresh`, `restore`, `routes`, `settings`, `shield`, `vpn`, `warning`. За основу брать port-proxy, недостающие glyphs из xbox-dns. При совпадении имени сравнить paths/viewBox до выбора. Сохранить местный copy glyph и исходный commit атрибуции Fluent.

## Карта файлов

| Файлы | Ответственность |
| --- | --- |
| package.json, package-lock.json, .nvmrc, .gitignore | Версия, exports, команды, зависимости, Node 24 |
| tsconfig.json, tsconfig.build.json, vite.config.ts, vitest.config.ts | Проверки, декларации, ESM/CSS-сборка, DOM-тесты |
| .oxlintrc.json, .oxfmtrc.json | Знакомые настройки lint/format без правил FSD для библиотеки |
| src/index.ts | Только публичные компоненты и types |
| src/components/{button,card,info-bar,status-badge,select,page-header,empty-state,modal,dialog-content}.{tsx,module.css}, src/components/confirm-dialog.tsx | Компоненты и локальное оформление |
| src/icons/{icon.tsx,icon.module.css,fluent-icon-paths.ts} | Icon и ограниченный набор SVG |
| src/styles/{theme,reset,native-controls}.css | Явные глобальные CSS entry points |
| src/vite-env.d.ts | Типы CSS Modules для исходников, не dependency деклараций потребителя |
| src/components/{controls,layout,modal,confirm-dialog}.test.tsx, src/icons/icon.test.tsx | Значимые DOM-контракты |
| scripts/{build-css,check-dist,test-package,generate-third-party-notices,check-release}.mjs | Копирование CSS, проверка dist, архива, notices и release |
| scripts/check-release.test.mjs | Разбор тега и соответствие версии |
| tests/package-consumer/{package.json,tsconfig.json,vite.config.ts,index.html,src/main.tsx,src/api-contract.tsx} | Изолированный потребитель архива |
| examples/gallery/{index.html,vite.config.ts,src/main.tsx,src/gallery.tsx,src/gallery.module.css,src/green-theme.css} | Локальные примеры и проверка тем |
| docs/{api,tokens,visual-acceptance,release}.md, README.md, CHANGELOG.md | Контракт, подключение, ручная приёмка, выпуск |
| LICENSE, THIRD_PARTY_NOTICES.txt, licenses/fluent-system-icons.txt | Собственная лицензия и атрибуция встроенных материалов |
| .github/workflows/{ci,publish}.yml | Проверки и публикация проверенного архива |

### Task 1: Рабочая сборка с Button и явными CSS exports

**Files:** Create package/config files, `src/index.ts`, `src/vite-env.d.ts`, `src/components/button.tsx`, `src/components/button.module.css`, `src/components/controls.test.tsx`, `src/styles/{theme,reset,native-controls}.css`, `scripts/{build-css,check-dist}.mjs`, LICENSE. Create lockfile after installing dependencies.

**Interfaces:** Produces Button/ButtonProps, `dist/index.js`, `dist/index.d.ts`, sourcemaps, четыре CSS-файла и команды `typecheck`, `lint`, `format:check`, `test`, `build`, `check:dist`. `build-css.mjs` копирует только три глобальных CSS из src/styles в dist; `styles.css` создаёт Vite из CSS Modules.

- [ ] Инициализировать локальный Git с main и зафиксировать существующие документы. Для выполнения работать в изолированной ветке/рабочем дереве по using-git-worktrees. Не включать соседние репозитории в этот Git.
- [ ] Создать настройки и зависимости по соседним package.json: Preact, CVA, clsx, TypeScript, Vite, preset-vite, Vitest, Testing Library, jsdom, Oxlint/Oxfmt. Все инструменты и встроенные CVA/clsx находятся в devDependencies; runtime peer только Preact. Зафиксировать разрешённые версии в lockfile, не копировать Tauri/Signals/preact-iso.
- [ ] В .gitignore исключить node_modules, dist, .gallery-dist, .artifacts и *.tgz. README/LICENSE/notices и lockfile отслеживаются.
- [ ] Сначала добавить `controls.test.tsx`: ref instanceof HTMLButtonElement; `class="a" className="b"` оставляют оба класса и внутренний класс; default Button не submit, type=submit отправляет форму; disabled не вызывает onClick; aria-label/data-testid передаются. Запустить `rtk npm test -- src/components/controls.test.tsx`, получить FAIL из-за отсутствующего Button.

  Минимальный тест значимого контракта:

  ```tsx
  it('forwards the native button ref and merges both class props', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Button ref={ref} class="first" className="second">Save</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current?.classList.contains('first')).toBe(true);
    expect(ref.current?.classList.contains('second')).toBe(true);
    expect(ref.current?.classList.length).toBeGreaterThan(2);
  });
  ```

- [ ] Перенести Button из port-proxy, экспортировать ButtonProps и объединять class/className. Использовать primary-токены как в xbox-dns. Сразу добавить локальные font, box-sizing, focus-visible и reduced-motion правила, чтобы Button не зависел от reset.
- [ ] Сформировать theme.css из общих токенов port-proxy без nav/hero/mica/content/toolbar/shell-divider. Добавить primary aliases. Reset и native-controls на этом этапе имеют отдельные файлы; их полное наполнение входит в задачу 4.
- [ ] Настроить Vite: `build.lib.entry = src/index.ts`, formats `["es"]`, fileName `index`, cssFileName `styles`, sourcemap true; `build.rolldownOptions.external` проверяет `id === "preact" || id.startsWith("preact/")`. Отключить devtools/HMR-инъекции preset в библиотечной сборке.
- [ ] В том же vite.config.ts добавить build-only plugin, который в generateBundle сохраняет ids включённых модулей и внешние imports в `.artifacts/library-modules.json`. Это артефакт проверки, вне dist и npm files. check-dist/test-package используют его для проверки external Preact и встроенных CVA/clsx; анализировать package manifest недостаточно.
- [ ] TypeScript build включает только src без tests, declaration/emitDeclarationOnly, rootDir src, outDir dist. `build` последовательно запускает Vite, генерацию `.d.ts`, build-css и check-dist. Публичные декларации не ссылаются на CSS Modules, Vitest, Vite или src/vite-env.d.ts. Типы variants задаются явными union, без утечки CVA в API.
- [ ] package.json: type module; корневой exports types/import на dist/index.d.ts и dist/index.js; четыре явных CSS subpaths; sideEffects `["**/*.css"]`; files `["dist", "licenses", "THIRD_PARTY_NOTICES.txt"]`, README/LICENSE npm включает автоматически. Не требовать Node 24 у конечного браузерного потребителя через engines библиотеки.
- [ ] `check-dist.mjs` проверяет существование export targets, CSS, карты и отсутствие CSS imports в собранном JS. Через Node import загрузить корневой dist без DOM; импорт не создаёт стили и не обращается к document на верхнем уровне. До задачи 5 проверка notices запускается только после появления notices.
- [ ] Запустить typecheck, тест Button, lint, format:check, build и check:dist. Ожидается exit 0; импорт dist возвращает Button; все пять export targets существуют. Коммит `build: bootstrap preact fluent ui library`.

### Task 2: Общие controls, layout и ограниченный набор иконок

**Files:** Create оставшиеся control/layout компоненты и их CSS из карты файлов, `src/icons/*`, `src/components/layout.test.tsx`, `src/icons/icon.test.tsx`, `licenses/fluent-system-icons.txt`, `scripts/generate-third-party-notices.mjs`, `THIRD_PARTY_NOTICES.txt`; modify `src/index.ts`, `controls.test.tsx`, package.json.

**Interfaces:** Consumes Button, CSS-сборку и тему задачи 1. Produces Select, Card, InfoBar, StatusBadge, PageHeader, EmptyState, Icon с типами из таблицы; `licenses:generate`, `licenses:check`.

- [ ] До переноса добавить failing assertions в controls/layout tests: ref на каждый корневой DOM-элемент, оба класса и aria/data props; InfoBar error=alert/info=status и явный role сохраняется; Select ref указывает на select, name/required/disabled/value/onChange работают, wrapperClassName попадает только на span; notices стоят после header. Для Icon проверить 22 имени во всех трёх размерах, существующий path и aria-hidden/focusable. Запустить соответствующие файлы, получить FAIL из-за отсутствующих exports.
- [ ] Перенести компоненты по таблице контракта. Card/InfoBar/StatusBadge/Icon брать с публичными types из route-vpn; PageHeader с notices из port-proxy; EmptyState из port-proxy. Ref передавать через forwardRef, собственные props не отправлять в DOM.
- [ ] Перенести Select из port-proxy. Добавить в select.module.css недостающие фон, border, radius, цвет, font, hover/disabled/focus правила из глобального CSS. class/className на native select, wrapperClassName на span. Сохранить native appearance в forced colors.
- [ ] Объединить glyphs по списку IconName, проверить совпадающие SVG, перенести оригинальную MIT-лицензию Fluent. Составить notices для Fluent, встроенных CVA и clsx с полными лицензионными текстами; брать их из установленных пакетов по lockfile, без dev-инструментов. `--check` сверяет результат без записи.
- [ ] `check-dist` теперь требует README/LICENSE/notices при pack-проверке. JavaScript не требует установленных CVA/clsx у потребителя; декларации содержат только Preact и собственные типы.
- [ ] Запустить controls/layout/icon tests, typecheck, lint, format:check, build, licenses:check. Ожидается exit 0 и полный публичный набор этой задачи. Коммит `feat: add shared controls layout and icons`.

### Task 3: Modal, части диалога и локализуемый ConfirmDialog

**Files:** Create `src/components/{modal,dialog-content}.{tsx,module.css}`, `src/components/confirm-dialog.tsx`, `modal.test.tsx`, `confirm-dialog.test.tsx`; modify `src/index.ts`. ConfirmDialog использует стили составляющих компонентов, отдельный CSS-модуль не нужен.

**Interfaces:** Consumes Button и тему. Produces ModalProps, ConfirmDialogProps, DialogHeaderProps, DialogBodyProps, DialogFooterProps и компоненты из таблицы. Внутренние helpers фокуса, если понадобятся, остаются в modal.tsx и не экспортируются.

- [ ] Перенести существующие поведенческие тесты Modal из port-proxy. Добавить failing tests до реализации: initialFocus; Tab/Shift+Tab по видимым enabled controls; исключение hidden, aria-hidden ancestors, inert, disabled fieldset и tabindex=-1; пустой диалог получает фокус сам; Escape/backdrop вызывают onClose, click внутри не вызывает; native props/class/ref достигают dialog.
- [ ] Добавить cleanup cases: прежний inert остаётся, добавленный inert удаляется, старый overflow восстанавливается; connected opener получает фокус, удалённый/disabled opener использует connected enabled fallback; при отсутствии обоих библиотека не ищет ссылку роутера. Пригодность initialFocusRef также проверяется; иначе первый доступный control, иначе dialog tabindex=-1.
- [ ] Тест ConfirmDialog задаёт English labels и проверяет отображение без русского fallback; уникальный aria-labelledby после повторного создания экземпляра; busy выключает cancel/confirm и блокирует Escape/backdrop; повторное взаимодействие в busy не вызывает callbacks; confirmDisabled не блокирует cancel. Для busy на уже открытом диалоге проверять безопасное сохранение фокуса внутри.

  Добавить отдельный тест пустого диалога и проверки busy:

  ```tsx
  it('focuses an empty dialog and keeps Tab inside it', () => {
    render(
      <Modal labelledBy="empty-title" initialFocusRef={createRef<HTMLElement>()} onClose={vi.fn()}>
        <h2 id="empty-title">Empty</h2>
      </Modal>,
    );
    const dialog = screen.getByRole('dialog');
    expect(document.activeElement).toBe(dialog);
    const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
    dialog.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(dialog);
  });
  ```

  В `blocks all close and confirm actions while busy` после userEvent click обеих кнопок, Escape и click backdrop проверить `expect(onClose).not.toHaveBeenCalled()` и `expect(onConfirm).not.toHaveBeenCalled()`. Повторить после rerender с busy=true, чтобы покрыть изменение состояния уже открытого экземпляра.

- [ ] Запустить `rtk npm test -- src/components/modal.test.tsx src/components/confirm-dialog.test.tsx`, получить FAIL из-за отсутствующих компонентов.
- [ ] Перенести Modal с порталом в body и существующим механизмом inert/scroll lock. Фильтровать доступные элементы по ancestors и computed visibility; positive tabindex учитывать в порядке браузерной навигации. Не добавлять стек модалок. Не пересоздавать весь эффект блокировки фона при обновлении callback или busy.
- [ ] Сохранить fallbackFocusRef из port-proxy, убрать запрос `a[aria-current="page"][href]`. Если opener/fallback непригодны, вернуть фокус на body с временным tabindex=-1 и восстановить прежний атрибут. Cleanup не оставляет tabindex/overflow/inert изменений библиотеки.
- [ ] Для ConfirmDialog использовать Preact useId, обязательные labels и начальный фокус на cancel, когда он доступен. Все пути cancel/confirm проходят через guards busy/confirmDisabled. DialogHeader сохраняет id на h2, root ref на header.
- [ ] Проверить части диалога через DOM props/ref assertions в layout tests. Запустить все тесты, typecheck, lint, format:check и build. Ожидается exit 0. Реальную видимость CSS и Tab дополнительно проверить в браузере в задаче 4. Коммит `feat: add accessible modal and confirmation dialogs`.

### Task 4: Завершённые CSS entry points, галерея и документация

**Files:** Modify `src/styles/*.css`, component CSS, package.json; create `examples/gallery/*`, README.md, CHANGELOG.md, `docs/{api,tokens,visual-acceptance}.md`.

**Interfaces:** Consumes весь UI задач 1–3. Produces `dev` для галереи и `build:gallery` с output `.gallery-dist`, отдельно от npm dist; инструкция подключения и полная таблица токенов.

- [ ] Отделить необязательный reset с box-sizing, margin, типографикой, code/pre и selection от native-controls для обычных input/textarea/select. Не переносить min-width/min-height приложения, shell/nav/layout и глобальное отключение всех анимаций страницы.
- [ ] Проверить каждый используемый `var(--...)`: он определён в theme.css или явно документирован как локальный. Дополнить light/dark/forced-colors для общих токенов; primary aliases ссылаются на accent. Theme задаёт токены и color-scheme, но не оформляет body/поля/заголовки.
- [ ] Добавить локальные focus-visible и reduced-motion правила всем интерактивным компонентам; системные цвета в forced colors. Dialog/контролы остаются работоспособны с одними theme/styles. Оформление обычных form fields через native-controls не требуется для Select.
- [ ] Галерея показывает все variants/sizes/tones, 22 иконки, длинные тексты, PageHeader notices, EmptyState, формы Select, диалоги с busy/confirmDisabled, удалённым opener, скрытыми controls и отсутствием controls. Состояния выбираются обычными controls; операции демонстрационные.
- [ ] Сделать галерею с двумя HTML-входами `index.html` и `minimal.html`: полное подключение и только theme/styles соответственно. Minimal показывает весь набор компонентов. Для зелёной темы отдельная страница `green.html`, import green-theme.css после библиотечных стилей. Все входы перечислить в gallery Vite build, дополнить карту файлов этими HTML.
- [ ] Green theme использует Xbox DNS accent, surfaces и отдельный dark primary `#3d6b47`, hover `#497a54`, pressed `#345c3d`, on-primary `#ffffff`. Forced-colors overrides подключаются после light/dark и используют Highlight/HighlightText/Canvas/CanvasText.
- [ ] В README/api документировать все props, class/className/Select wrapperClassName, обязательные ConfirmDialog labels, уникальные ids, один активный Modal, root theme, отсутствие автоподключения CSS, порядок overrides и доступное имя иконковой кнопки. Указать, что это самостоятельная библиотека, не официальный Microsoft пакет.
- [ ] Запустить все проверки и `rtk npm run build:gallery`. В T3 сначала preview_status и при необходимости preview_open, затем открыть галерею. Если preview-инструменты отсутствуют, использовать доступный браузерный механизм. Проверить light/dark, ширины 1280/720/320, keyboard-only, forced colors, reduced motion, все три страницы. Для недоступной эмуляции проверить на Windows и записать ожидающее условие, не считать его пройденным.
- [ ] В `docs/visual-acceptance.md` записать реальные результаты, окружение и пути screenshots. Убедиться, что minimal не теряет focus/border/font/box-sizing. Unit-тесты статического CSS или снимки всей разметки не добавлять. Коммит `feat: add themes gallery and usage documentation`.

### Task 5: Проверка установленного npm-архива и нижней версии Preact

**Files:** Create `scripts/test-package.mjs`, `tests/package-consumer/*`; modify `scripts/check-dist.mjs`, package.json.

**Interfaces:** Consumes готовый build. Produces `test:package`: без аргументов создаёт один архив и проверяет его; с `--tarball <absolute-path>` проверяет указанный архив без пересборки. `--preact 10.27.0` проверяет нижнюю peer-версию. Fixture содержит только package imports, без alias на исходники.

- [ ] Создать consumer fixture. api-contract.tsx импортирует все компоненты и props-типы из корня, принимает object/callback refs и обе формы class, задаёт native handlers/attrs. Добавить `@ts-expect-error` для неизвестного variant/IconName, size=18, отсутствующих labels ConfirmDialog и закрытого import `@violice/preact-fluent-ui/src/...`. Consumer typecheck с skipLibCheck=false.
- [ ] main.tsx импортирует четыре CSS subpaths и рендерит controls/dialog пример. Добавить отдельный минимальный consumer entry только Button и theme/styles для проверки tree shaking. Не использовать reset/native-controls как скрытую зависимость компонента.
- [ ] `test-package.mjs` создаёт каталог через os.tmpdir/mkdtemp вне репозитория, копирует fixture, устанавливает архив как dependency и Preact указанной версии, запускает tsc/Vite. Использовать spawn с массивами аргументов, а не shell interpolation; чистить временный каталог в finally.
- [ ] До исправлений получить meaningful FAIL на fixture: закрытый внутренний import действительно не разрешается, отсутствующий type/export/CSS обнаруживается. Если все exports уже готовы, сначала запустить fixture против намеренно повреждённой временной копии package manifest, затем вернуть оригинальный архив. Не изменять исходный dist ради теста.
- [ ] Проверить npm pack file list: dist/README/LICENSE/notices/licenses есть; src/gallery/tests/scripts и node_modules нет. Проверить опубликованные source maps не ссылаются на абсолютные локальные пути, sourcesContent соответствует только распространяемому коду.
- [ ] Проверить JS metadata библиотеки на отсутствие модулей Preact и runtime imports CVA/clsx. В consumer build через module ids проверить, что все Preact subpaths разрешаются из одной установленной копии; `npm ls preact` сам по себе недостаточен для обнаружения встроенного Preact. Не полагаться на минифицированную строку имени пакета.
- [ ] Consumer vite.config.ts в generateBundle выдаёт JSON с module ids каждого entry chunk и связанными source maps в temp artifacts. test-package читает этот результат и `.artifacts/library-modules.json` из задачи 1; для проверки чужого tarball без metadata использует опубликованные source maps самого архива, а не данные другой сборки. Проверки имеют явные assertions: `preactRoots.size === 1`, ни одного `preact/*` source в библиотеке, нет внешних `clsx`/`class-variance-authority` imports.
- [ ] В минимальном build подтвердить отсутствие неиспользуемого Modal/каталога SVG через bundler metadata или sourcemap. Общий CSS может содержать все компоненты. Измерить JS/CSS raw и gzip, записать baseline без произвольного лимита 2 KB.
- [ ] Запустить test:package с Preact 10.27.0 и с версией root lockfile, build:gallery и полный набор проверок. Ожидается exit 0 обоих consumer builds, успешный strict typecheck, одна копия Preact, четыре CSS exports. Сохранить проверенный архив и SHA-256 как артефакт выпуска. Коммит `test: verify packed package in isolated consumers`.

### Task 6: CI и подготовка выпуска 0.1.0

**Files:** Create `.github/workflows/{ci,publish}.yml`, `scripts/check-release.mjs`, `scripts/check-release.test.mjs`, `docs/release.md`; modify README.md, CHANGELOG.md, package.json при добавлении release scripts.

**Interfaces:** Consumes проверки и tarball задачи 5. Produces CI на push/PR и release workflow. `check-release.mjs <tag> <package-json-path>` допускает только `v<version>` и завершается ненулевым кодом при несовпадении.

- [ ] Сначала написать node:test cases для `v0.1.0`/package 0.1.0 success, `v0.1.1`, `tag0.1.0`, пустого тега и несовпадающей package version failure. Запустить `rtk proxy node --test scripts/check-release.test.mjs`, получить FAIL до реализации функции проверки.

  ```js
  test('accepts only the tag for this package version', () => {
    assert.doesNotThrow(() => assertReleaseVersion('v0.1.0', '0.1.0'));
    for (const tag of ['v0.1.1', 'tag0.1.0', '']) {
      assert.throws(() => assertReleaseVersion(tag, '0.1.0'));
    }
    assert.throws(() => assertReleaseVersion('v0.1.0', '0.1.1'));
  });
  ```

- [ ] Реализовать экспортируемую `assertReleaseVersion(tag: string, version: string): void` в .mjs с JSDoc types и CLI. Ошибка печатается кратко, publish при ней не выполняется.
- [ ] CI на Node 24: npm ci, typecheck, lint, format:check, все поведенческие тесты и release-script tests, licenses:check, build, build:gallery, test:package на минимальной и lockfile Preact. Для независимой проверяемости архива сохранить tarball, hash и размеры как artifacts.
- [ ] Publish запускается на `release: published`, checkout именно release tag, проверяет `v0.1.0` против package.version, повторяет проверки, создаёт один tarball и проверяет его через `test:package --tarball`. После проверки публикует именно этот файл с public access, не пересобирает перед publish.
- [ ] Основной вариант npm authentication: trusted publishing на GitHub-hosted runner, id-token:write и npm >=11.5.1. Repository metadata должна соответствовать фактическому GitHub URL. Если владелец выбирает NPM_TOKEN, использовать отдельную явно настроенную ветку workflow, без скрытого fallback между способами.
- [ ] В release.md описать настройку owner/repository/workflow в npm, начальную регистрацию нового пакета владельцем и выбранный способ первого выпуска. Фактический GitHub URL и доступ к scope `@violice` определяются при подключении репозитория. Это не блокирует локальные задачи 1–5; публикация не считается выполненной без проверки npm.
- [ ] Обновить CHANGELOG 0.1.0 и README с подтверждёнными размерами и ограничениями. Запустить весь pipeline локально, release-script tests GREEN и сверку exports/license/archive. Коммит `ci: add package checks and release publishing`.
- [ ] После отдельного поручения на выпуск создать/подключить GitHub repo, настроить npm и опубликовать Release. Проверить завершение workflow и установку `@violice/preact-fluent-ui@0.1.0` из registry в новый temp consumer. Начать финальный план миграции только после этой проверки.

## Самопроверка плана

- Набор компонентов, публичные props/ref/classes и локализация покрыты задачами 1–3.
- CSS/tokens, primary/accent, доступность, галерея и README покрыты задачей 4.
- ESM/types/externals, закрытые subpaths, архив, tree shaking и minimum Preact покрыты задачами 1 и 5.
- Notices/licenses покрыты задачей 2, CI и выпуск задачей 6.
- Миграция четырёх приложений и сохранение их оформления вынесены в связанный план.
- Все review focus имеют конкретную проверку. Ручная Windows-приёмка и registry publish не подменяются jsdom-тестами или подготовкой workflow.

## Проверенные справочники

При подготовке плана сверены [Vite library mode и CSS export](https://vite.dev/guide/build.html#library-mode), [генерация деклараций TypeScript](https://www.typescriptlang.org/tsconfig/declaration.html) и [npm trusted publishing](https://docs.npmjs.com/trusted-publishers/). Выбор Vite, external Preact, отдельного CSS и OIDC следует документу дизайна; детали конкретного API библиотеки предложены этим планом.

## Передача в реализацию

План готов для ревью. Рекомендуемый способ выполнения: inline по задачам, поскольку задачи последовательно расширяют один package contract. Делегирование включать только по выбору пользователя. До реализации требуется согласовать этот план; текущая задача закончена созданием документов.
