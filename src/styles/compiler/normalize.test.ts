import { expect, it } from 'vitest';
import { compileStyles } from './atomic';
import { cx } from '../runtime/cx';

it('merges expanded padding sides without losing unaffected declarations', () => {
  const base = compileStyles({ padding: '16px' });
  const override = compileStyles({ paddingLeft: '4px' });
  const classes = cx(base.className, override.className).split(' ');
  expect(classes).toHaveLength(4);
  expect(classes).toContain(override.className);
  expect(base.css).toContain('padding-top:16px');
});
it('normalizes lengths and leaves unitless numbers untouched', () => {
  const output = compileStyles({ gap: 12, flexGrow: 1, order: 2 });
  expect(output.css).toContain('gap:12px');
  expect(output.css).toContain('flex-grow:1');
  expect(output.css).toContain('order:2');
});
it('keeps different selectors and conditions while replacing equivalent declarations', () => {
  const base = compileStyles({ color: 'red', '&:hover': { color: 'green' } });
  const overrides = compileStyles({
    color: 'blue',
    '@media (min-width: 800px)': { color: 'black' },
  });
  expect(cx(base.className, overrides.className).split(' ')).toHaveLength(3);
  expect(cx('foreign', false, [base.className, null], 'foreign')).toContain('foreign');
});
it('deduplicates deterministic declarations and rejects ambiguous shorthand mixing', () => {
  const a = compileStyles({ paddingInline: '4px 8px' });
  expect(a).toEqual(compileStyles({ paddingInline: '4px 8px' }));
  expect(cx(a.className, a.className).split(' ')).toHaveLength(2);
  expect(() => compileStyles({ paddingLeft: 4, paddingInlineStart: 8 })).toThrow(
    /logical|physical/i,
  );
});
it('rejects logical/physical coordinate mixing across separately compiled classes', () => {
  const physical = compileStyles({ paddingLeft: 4 });
  const logical = compileStyles({ paddingInlineStart: 8 });
  expect(() => cx(physical.className, logical.className)).toThrow(/logical|physical/i);
});

it('permits independent coordinate groups and selectors', () => {
  expect(() => compileStyles({ padding: 8, marginInline: 4 })).not.toThrow();
  expect(() => compileStyles({ padding: 8, _hover: { paddingInline: 4 } })).not.toThrow();
});

it('rejects unsupported overlapping shorthand composition', () => {
  const base = compileStyles({ flex: '1 0 auto' });
  expect(() => cx(base.className, compileStyles({ flexGrow: 2 }).className)).toThrow(
    /flex.*longhand/,
  );
});
