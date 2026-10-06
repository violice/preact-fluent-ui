import type { JSX } from 'preact';
export type StyleValue = string | number | null | undefined;
export type StyleObject = {
  [Property: string]: StyleValue | StyleObject;
};
export type ClassValue = string | false | null | undefined | readonly ClassValue[];
export interface Declaration {
  property: string;
  value: string;
  selector: string;
  conditions: string[];
}
export interface StyleContext {
  conditions?: Record<string, string>;
  tokens?: Record<string, string>;
}
export type NativeStyles = JSX.CSSProperties;
