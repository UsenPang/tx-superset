import hhy_theme from './hhyTheme';

export const themes = {
  hhy_theme,
};

export const themeOptions = Object.keys(themes).map(x => [
  x,
  x
    .split('_')
    .map(e => e[0].toUpperCase() + e.slice(1))
    .join(' '),
]);

export default themes;
