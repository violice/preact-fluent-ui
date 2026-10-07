import type { JSX } from 'preact';
import type { StyleObject } from '../shared/types';
import type { StyleProps } from './style-props';
export interface DynamicStyleObject {
  [property: string]: JSX.Signalish<string | number | null | undefined> | DynamicStyleObject;
}
export interface CssFunction {
  (...styles: StyleObject[]): string;
  dynamic(style: DynamicStyleObject): StyleProps;
}
export const css: CssFunction = Object.assign(
  (..._styles: StyleObject[]): string => {
    throw new Error('css() requires the Fluent styling compiler; configure fluentStyles() in Vite');
  },
  {
    dynamic(_style: DynamicStyleObject): StyleProps {
      throw new Error(
        'css.dynamic() requires the Fluent styling compiler; configure fluentStyles() in Vite',
      );
    },
  },
);
