import { useFinanceStore } from '../store/financeStore';
import { getTheme, defaultTheme, type Theme, type ThemeModeOption } from './theme';

export type ThemeMode = ThemeModeOption;

export const useTheme = (): Theme => {
  const mode = useFinanceStore((state) => state.themeMode) as ThemeModeOption | undefined;
  return getTheme(mode ?? defaultTheme.mode);
};
