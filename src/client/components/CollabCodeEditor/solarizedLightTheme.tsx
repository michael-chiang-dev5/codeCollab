import { EditorView } from '@codemirror/view';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags } from '@lezer/highlight';

const base00 = '#657b83',
  base01 = '#586e75',
  base02 = '#073642',
  base03 = '#002b36',
  base1 = '#93a1a1',
  base3 = '#fdf6e3',
  base_red = '#dc322f',
  base_orange = '#cb4b16',
  base_yellow = '#b58900',
  base_green = '#859900',
  base_cyan = '#2aa198',
  base_blue = '#268bd2',
  base_violet = '#6c71c4',
  base_magenta = '#d33682';
const invalid = '#d30102',
  darkBackground = '#dfd9c8',
  highlightBackground = darkBackground,
  background = base3,
  tooltipBackground = base01,
  selection = darkBackground,
  cursor = base01;

/**
The highlighting style for code in the Solarized Light theme.
*/
const solarizedLightHighlightStyle = /*@__PURE__*/ HighlightStyle.define([
  { tag: tags.keyword, color: base_green },
  {
    tag: [
      tags.name,
      tags.deleted,
      tags.character,
      tags.propertyName,
      tags.macroName,
    ],
    color: base_cyan,
  },
  { tag: [tags.variableName], color: base_blue },
  { tag: [/*@__PURE__*/ tags.function(tags.variableName)], color: base_blue },
  { tag: [tags.labelName], color: base_magenta },
  {
    tag: [
      tags.color,
      /*@__PURE__*/ tags.constant(tags.name),
      /*@__PURE__*/ tags.standard(tags.name),
    ],
    color: base_yellow,
  },
  {
    tag: [/*@__PURE__*/ tags.definition(tags.name), tags.separator],
    color: base_cyan,
  },
  { tag: [tags.brace], color: base_magenta },
  {
    tag: [tags.annotation],
    color: invalid,
  },
  {
    tag: [
      tags.number,
      tags.changed,
      tags.annotation,
      tags.modifier,
      tags.self,
      tags.namespace,
    ],
    color: base_magenta,
  },
  {
    tag: [tags.typeName, tags.className],
    color: base_orange,
  },
  {
    tag: [tags.operator, tags.operatorKeyword],
    color: base_violet,
  },
  {
    tag: [tags.tagName],
    color: base_blue,
  },
  {
    tag: [tags.squareBracket],
    color: base_red,
  },
  {
    tag: [tags.angleBracket],
    color: base02,
  },
  {
    tag: [tags.attributeName],
    color: base1,
  },
  {
    tag: [tags.regexp],
    color: invalid,
  },
  {
    tag: [tags.quote],
    color: base_green,
  },
  { tag: [tags.string], color: base_yellow },
  {
    tag: tags.link,
    color: base_cyan,
    textDecoration: 'underline',
    textUnderlinePosition: 'under',
  },
  {
    tag: [tags.url, tags.escape, /*@__PURE__*/ tags.special(tags.string)],
    color: base_yellow,
  },
  { tag: [tags.meta], color: base_red },
  { tag: [tags.comment], color: base02, fontStyle: 'italic' },
  { tag: tags.strong, fontWeight: 'bold', color: base01 },
  { tag: tags.emphasis, fontStyle: 'italic', color: base_green },
  { tag: tags.strikethrough, textDecoration: 'line-through' },
  { tag: tags.heading, fontWeight: 'bold', color: base_yellow },
  { tag: tags.heading1, fontWeight: 'bold', color: base03 },
  {
    tag: [tags.heading2, tags.heading3, tags.heading4],
    fontWeight: 'bold',
    color: base03,
  },
  {
    tag: [tags.heading5, tags.heading6],
    color: base03,
  },
  {
    tag: [tags.atom, tags.bool, /*@__PURE__*/ tags.special(tags.variableName)],
    color: base_magenta,
  },
  {
    tag: [tags.processingInstruction, tags.inserted, tags.contentSeparator],
    color: base_red,
  },
  {
    tag: [tags.contentSeparator],
    color: base_yellow,
  },
  { tag: tags.invalid, color: base02, borderBottom: `1px dotted ${base_red}` },
]);

/**
The editor theme styles for Solarized Light.
*/
const createThemeLight = (minHeight: number) => {
  const theme = EditorView.theme(
    {
      '.cm-gutter, .cm-content': {
        minHeight: `${minHeight}vh`,
        overflow: 'auto',
      },
      '&': {
        color: base00,
        backgroundColor: background,
      },
      '.cm-content': {
        caretColor: cursor,
      },
      '.cm-cursor, .cm-dropCursor': { borderLeftColor: cursor },
      '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection':
        { backgroundColor: selection },
      '.cm-panels': { backgroundColor: darkBackground, color: base03 },
      '.cm-panels.cm-panels-top': { borderBottom: '2px solid black' },
      '.cm-panels.cm-panels-bottom': { borderTop: '2px solid black' },
      '.cm-searchMatch': {
        backgroundColor: '#72a1ff59',
        outline: '1px solid #457dff',
      },
      '.cm-searchMatch.cm-searchMatch-selected': {
        backgroundColor: '#6199ff2f',
      },
      '.cm-activeLine': { backgroundColor: highlightBackground },
      '.cm-selectionMatch': { backgroundColor: '#aafe661a' },
      '&.cm-focused .cm-matchingBracket, &.cm-focused .cm-nonmatchingBracket': {
        outline: `1px solid ${base1}`,
      },
      '.cm-gutters': {
        backgroundColor: '#00000010',
        color: base00,
        border: 'none',
      },
      '.cm-activeLineGutter': {
        backgroundColor: highlightBackground,
      },
      '.cm-foldPlaceholder': {
        backgroundColor: 'transparent',
        border: 'none',
        color: '#ddd',
      },
      '.cm-tooltip': {
        border: 'none',
        backgroundColor: tooltipBackground,
      },
      '.cm-tooltip .cm-tooltip-arrow:before': {
        borderTopColor: 'transparent',
        borderBottomColor: 'transparent',
      },
      '.cm-tooltip .cm-tooltip-arrow:after': {
        borderTopColor: tooltipBackground,
        borderBottomColor: tooltipBackground,
      },
      '.cm-tooltip-autocomplete': {
        '& > ul > li[aria-selected]': {
          backgroundColor: highlightBackground,
          color: base03,
        },
      },
    },
    { dark: false }
  );

  return [theme, syntaxHighlighting(solarizedLightHighlightStyle)];
};

/**
Extension to enable the Solarized Light theme (both the editor theme and
the highlight style).
*/
// const solarizedLight = [
//   solarizedLightTheme,
//   /*@__PURE__*/ syntaxHighlighting(solarizedLightHighlightStyle),
// ];
export { createThemeLight };

// export { solarizedLight, solarizedLightHighlightStyle, solarizedLightTheme };
