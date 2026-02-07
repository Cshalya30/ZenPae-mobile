import React from 'react';
import { Text as RNText, TextProps, StyleSheet } from 'react-native';
import { fontFamily } from '../theme/theme';

function getFontFamilyForWeight(fontWeight?: string | number): string {
  const w = fontWeight === 'bold' ? '700' : String(fontWeight);
  if (w === '400') return fontFamily.regular;
  if (w === '500') return fontFamily.medium;
  if (w === '600') return fontFamily.semiBold;
  return fontFamily.medium;
}

export default function Text({ style, ...rest }: TextProps) {
  const flat = StyleSheet.flatten(style);
  const weight = flat?.fontWeight;
  const fontFamilyResolved = getFontFamilyForWeight(weight);
  const mergedStyle = flat?.fontFamily ? style : [style, { fontFamily: fontFamilyResolved }];
  return <RNText style={mergedStyle} {...rest} />;
}
