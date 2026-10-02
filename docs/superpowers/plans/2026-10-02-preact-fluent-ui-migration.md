# preact-fluent-ui Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans for inline execution, or superpowers:subagent-driven-development if the user selects delegation. Implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Перевести port-proxy, hosts-editor, route-vpn и xbox-dns на `@violice/preact-fluent-ui@0.1.0`, сохранив их оформление и поведение.

**Architecture:** Каждое приложение получает обычную npm dependency и временный `shared/ui` barrel с re-exports. Глобальный CSS приложения сохраняет тему оболочки и собственные переопределения. Локальные общие компоненты удаляются после проверки заменённых экранов.

**Tech Stack:** Существующие Preact/Vite/TypeScript приложения, npm lockfiles, FSD import checker, Vitest, Tauri без изменения Rust.

**Spec:** [Дизайн](../specs/2026-10-02-preact-fluent-ui-design.md), [контракт и план библиотеки](2026-10-02-preact-fluent-ui.md).

## Global Constraints

- Порядок: port-proxy → hosts-editor → route-vpn → xbox-dns.
- Использовать `@violice/preact-fluent-ui@0.1.0`, фиксировать package-lock.json. Временный tarball нужен только для локальной пробы до выпуска; не оставлять абсолютный file-путь в финальном lockfile.
- Библиотека прошла isolated package checks. Финальное подключение требует успешного выпуска в registry.
- Сохранять цвета, страницы, навигацию, Signals-модели и независимые релизы приложений.
- Библиотечные CSS импортируются перед локальным global.css. Приложение явно переопределяет отличающиеся токены и вынесенные shell-токены.
- Не добавлять wrappers ради сохранения default props. В shared/ui допустимы только прямые re-exports; различия задаются явно в местах использования.
- Один активный Modal; передавать fallbackFocusRef из приложения там, где инициатор удаляется. Не переносить роутер в библиотеку.
- Сохранять FSD-границы, локальный TextComparison и все бизнес-компоненты.
- Каждое приложение проверяется и коммитится в своём Git, без включения файлов соседа в коммит. Git/release операции не выполняются при написании плана.

## Review Focus

- ConfirmDialog требует три текста кнопок. Во всех callsites сохраняются существующие русские формулировки; проверки задач 1–2.
- Select class/className теперь относится к select. Класс контейнера port-proxy переносится в wrapperClassName; проверка задачи 1.
- Удалённая строка/инициатор не лишает пользователя клавиатурного фокуса. Fallback задаётся приложением; проверки задач 1–3.
- Xbox DNS использовал default EmptyState icon `network`, библиотека использует `routes`. Явный icon="network" сохраняется в задаче 4.
- Notices приложения включают встроенные материалы библиотеки, а shell-токены и forced-colors overrides не теряются. Проверки каждой задачи и тема Xbox DNS в задаче 4.

## Общий цикл для каждого приложения

1. Проверить AGENTS.md, ICM, текущее дерево и Git diff; не перезаписывать несвязанные изменения. Зафиксировать результаты исходных tests/typecheck/build и снимки основных экранов до миграции.
2. Установить опубликованный пакет с точной версией, обновить shared/ui/index.ts прямыми re-exports и экспортами типов. Прямые локальные imports в тестах и компонентах заменить публичными imports/barrel. Проверить, что peer Preact не создаёт отдельную копию.
3. В `src/app/entrypoint/main.tsx` перед global.css импортировать theme.css, styles.css, reset.css, native-controls.css. Разделить global.css: оставить оболочку/страницы/локальные tokens, удалить совпадающие перенесённые правила. Отличающиеся типографика/размеры/темы остаются локально.
4. Согласовать labels, Select wrapper classes и fallback refs; запустить тесты до удаления копий. Добавлять регрессионный тест только для нового собственного поведения приложения, не дублировать unit-тесты библиотеки.
5. Выполнить `rtk npm run typecheck`, `rtk npm run check:fsd`, `rtk npm run test:fsd`, `rtk npm run lint`, `rtk npm run format:check`, `rtk npm test`, `rtk npm run build`, `rtk npm run licenses:check`. Все команды должны закончиться exit 0. Если Rust не менялся, не вводить новую Rust-задачу; существующий обязательный CI сохраняется.
6. В браузерном demo проверить те же экраны light/dark/forced colors, keyboard, busy/errors, узкое окно. Проверить native Windows WebView2 приёмку диалогов/фокуса. Записать фактические результаты в `docs/ui-library-migration.md` приложения.
7. После приёмки удалить заменённые .tsx/.module.css/glyphs, убрать CVA/clsx только если других imports не осталось. Обновить notices и повторить затронутые проверки после удаления. Коммитить приложение отдельно.

## Notices при миграции

В каждом приложении изменить `scripts/generate-third-party-notices.mjs`: читать `node_modules/@violice/preact-fluent-ui/THIRD_PARTY_NOTICES.txt` и включать этот текст в bundled notices, помимо LICENSE самой dependency. Удалять локальную Fluent-атрибуцию только если больше нет локальных Fluent SVG. Сохранять все остальные production dependency notices.

`licenses:generate` обновляет `public/third-party-notices.txt`, `licenses:check` подтверждает совпадение. Не добавлять ссылки на лицензии в пользовательские About-страницы как побочный результат миграции.

### Task 1: port-proxy как первый потребитель

**Files:** Modify `../port-proxy/package{,-lock}.json`, `src/shared/ui/index.ts`, `src/app/entrypoint/main.tsx`, `src/app/styles/global.css`, `src/features/edit-portproxy-rule/ui/rule-dialog.tsx`, `src/pages/rules/ui/remove-rule-dialog.tsx`, `scripts/generate-third-party-notices.mjs`, `public/third-party-notices.txt`; create `docs/ui-library-migration.md`. Remove migrated shared/ui sources after checks.

**Interfaces:** Consumes библиотеку 0.1.0. Produces приложение с общим UI и подтверждённую первую реальную интеграцию.

- [ ] Выполнить общий цикл. Сначала получить исходные результаты `rule-dialog.test.tsx`, `rules-page.test.tsx`, `app.test.tsx` и Modal tests.
- [ ] Сохранить строки ConfirmDialog через cancelLabel="Отмена", pendingLabel="Выполняется…", confirmLabel с прежним значением, при отсутствии "Подтвердить". Найти все callsites, не ограничиваться remove-rule-dialog.
- [ ] В Select проверить class/className: layout/class контейнера перенести в wrapperClassName; aria/name/value/handler оставить на select.
- [ ] Проверить удаление выбранного правила: фокус после закрытия на переданном fallback, когда строка удалена. Сохранить порядок копирования в новую форму, ошибки и busy без изменений бизнес-логики.
- [ ] Проверить header notices ниже заголовка и 8px между actions. Просмотреть create/edit/copy/remove, search/empty/error, About и обе темы.
- [ ] Удалить только перенесённые shared/ui файлы и тесты общей реализации, которые теперь находятся в библиотеке. Оставить интеграционные тесты приложения. Выполнить финальные проверки общего цикла. Коммит `refactor: use preact fluent ui in port proxy`.

### Task 2: hosts-editor

**Files:** Modify `../hosts-editor/package{,-lock}.json`, `src/shared/ui/index.ts`, `src/app/entrypoint/main.tsx`, `src/app/styles/global.css`, `src/features/restore-hosts/ui/restore-dialog.tsx`, остальные ConfirmDialog/Modal callsites, `scripts/generate-third-party-notices.mjs`, `public/third-party-notices.txt`; create `docs/ui-library-migration.md`. Preserve `src/shared/ui/text-comparison.tsx`.

**Interfaces:** Consumes тот же package contract. Produces hosts-editor с библиотечными controls/dialogs и локальным TextComparison.

- [ ] Выполнить общий цикл, baseline для app, entry-dialog, entries-page и close guard tests.
- [ ] В shared/ui/index.ts re-export общих компонентов из библиотеки и сохранить отдельный export TextComparison из локального файла.
- [ ] Добавить обязательные ConfirmDialog labels, проверить restore/delete/apply и предупреждение о несохранённых изменениях. Если инициатор может исчезнуть, передать fallbackFocusRef на остающийся control приложения.
- [ ] Проверить границы Card/InfoBar вокруг TextComparison и длинных списков. Не изменять алгоритм сравнения и сохранения документа.
- [ ] После финальных проверок удалить заменённые копии и локальный Modal unit-test. Коммит `refactor: use preact fluent ui in hosts editor`.

### Task 3: route-vpn

**Files:** Modify `../route-vpn/package{,-lock}.json`, `src/shared/ui/index.ts`, `src/app/entrypoint/main.tsx`, `src/app/styles/global.css`, `src/pages/routes/ui/{routes-page,remove-route-dialog}.tsx`, другие Modal callsites, `scripts/generate-third-party-notices.mjs`, `public/third-party-notices.txt`; create `docs/ui-library-migration.md`.

**Interfaces:** Consumes библиотеку. Produces Route VPN с прежними route/profile/diagnostics screens и native button refs.

- [ ] Выполнить общий цикл, baseline для app-workflow, route-form, routes-page и split-tunneling-control tests.
- [ ] Не переделывать составные бизнес-диалоги в ConfirmDialog, если они уже используют Modal. Заменить общий UI и обеспечить labelledBy/initialFocusRef/fallbackFocusRef без зависимости от библиотечного роутера.
- [ ] Сохранить исправление Button DOM ref, default type=button и семантику error/status InfoBar. Проверить переходы между routes/profile/diagnostics, add/remove route и смену split tunneling.
- [ ] Сохранить порядок добавления маршрута: проверка дубликата, успешное добавление, закрытие диалога, затем обновление списка. Миграция не меняет handlers/model.
- [ ] Перенести общие controls tests в библиотеку по смыслу, удалить локальные копии UI после приёмки. Название приложения остаётся Route VPN. Коммит `refactor: use preact fluent ui in route vpn`.

### Task 4: xbox-dns с сохранением отдельной темы

**Files:** Modify `../xbox-dns/package{,-lock}.json`, `src/shared/ui/index.ts`, `src/app/entrypoint/main.tsx`, `src/app/styles/global.css`, `src/pages/{adapter,connection}/ui/*-page.tsx`, другие EmptyState/Modal callsites, `scripts/generate-third-party-notices.mjs`, `public/third-party-notices.txt`; create `docs/ui-library-migration.md`.

**Interfaces:** Consumes библиотеку с primary/accent токенами. Produces Xbox DNS без изменений зелёных поверхностей/тёмных кнопок и набора иконок.

- [ ] Выполнить общий цикл, baseline для app, dns-change-dialog, diagnostics-page и dns-row tests.
- [ ] Сохранить весь отличающийся набор светлых/тёмных tokens в local global.css, включая зелёные canvas/hero/mica/content/navigation и surfaces. Сверить не только accent.
- [ ] Dark primary сохранить `#3d6b47`, hover `#497a54`, pressed `#345c3d`, on-primary `#ffffff`. Dark accent сохранить `#91d981`, hover `#ace79e`, pressed `#79c869`, on-accent `#142d10`. В forced colors переопределения приложения после dark используют системные цвета.
- [ ] Для EmptyState без явного icon добавить icon="network", чтобы не получить библиотечный default routes. Проверить adapter/network/info/shield glyphs из объединённого набора.
- [ ] Проверить demo ready/empty/denied/partial/drifted, DNS confirmation, error/busy и About. Сравнить light/dark screenshots до/после, особенно primary button, surface и select focus.
- [ ] После финальных проверок удалить заменённые UI/glyphs, обновить notices. Коммит `refactor: use preact fluent ui in xbox dns`.

## Завершение миграции

Для каждого приложения подтвердить package dependency и lockfile, отсутствие оставшихся копий общего UI, FSD/test/build и просмотр затронутых экранов. Если WebView2-проверка не выполнена, явно оставить её открытой в отчёте.

Общий результат достигнут, когда все четыре приложения используют опубликованную версию, а исправление общего компонента выполняется в библиотеке. Выпуски приложений, PR и merge выполняются только в рамках последующего поручения.
