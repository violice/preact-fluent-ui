import { parseMarkdown } from '@tanstack/markdown/parser';
import type { BlockNode, InlineNode } from '@tanstack/markdown';
import { Fragment, h, type ComponentChildren } from 'preact';
import { CodeBlock as PlainCodeBlock, Text } from '../../../../../dist/components.js';
import { CodeBlock } from '../code-block';
import changelog from '../../../../../CHANGELOG.md?raw';

export const document = parseMarkdown(changelog);

export const repository = 'https://github.com/violice/preact-fluent-ui/blob/main/';

export function linkHref(href: string): string | undefined {
  // Strip URL scheme whitespace/control characters before checking executable protocols.
  // oxlint-disable-next-line no-control-regex
  const clean = href.replace(/[\u0000-\u0020\u007f]/g, '');
  if (/^[a-z][a-z\d+.-]*:/i.test(clean))
    return /^(https?:|mailto:)/i.test(clean) ? href : undefined;
  if (href.startsWith('#') || href.startsWith('//')) return href;
  return new URL(href, repository).href;
}

export function inline(nodes: InlineNode[]): ComponentChildren[] {
  return nodes.map((node, index) => <Fragment key={index}>{renderInline(node)}</Fragment>);
}

export function renderInline(node: InlineNode): ComponentChildren {
  if (node.type === 'inlineCode') return <code>{node.value}</code>;
  if (node.type === 'text' || node.type === 'inlineHtml') return <>{node.value}</>;
  if (node.type === 'strong') return <strong>{inline(node.children)}</strong>;
  if (node.type === 'emphasis') return <em>{inline(node.children)}</em>;
  if (node.type === 'strike') return <del>{inline(node.children)}</del>;
  if (node.type === 'break') return <br />;
  if (node.type === 'link') {
    const href = linkHref(node.href);
    return href ? (
      <a href={href} title={node.title}>
        {inline(node.children)}
      </a>
    ) : (
      <>{inline(node.children)}</>
    );
  }
  return <></>;
}

export function block(node: BlockNode): ComponentChildren {
  switch (node.type) {
    case 'heading':
      return (
        <Text
          preset={node.depth <= 2 ? 'subtitle1' : 'subtitle2'}
          render={h(`h${node.depth}`, {})}
          id={node.id}
        >
          {inline(node.children)}
        </Text>
      );
    case 'paragraph':
      return <p>{inline(node.children)}</p>;
    case 'list':
      return h(
        node.ordered ? 'ol' : 'ul',
        { start: node.ordered ? node.start : undefined },
        node.items.map((item, index) => <li key={index}>{item.children.map(block)}</li>),
      );
    case 'blockquote':
      return <blockquote>{node.children.map(block)}</blockquote>;
    case 'html':
      return <p>{node.value}</p>;
    case 'thematicBreak':
      return <hr />;
    case 'code': {
      const language = node.lang === 'sh' || node.lang === 'bash' ? 'shell' : node.lang;
      return language === 'tsx' || language === 'css' || language === 'shell' ? (
        <CodeBlock code={node.value} language={language} />
      ) : (
        <PlainCodeBlock code={node.value} language={node.lang} copy codeLabel="Code example" />
      );
    }
    default:
      return <></>;
  }
}
