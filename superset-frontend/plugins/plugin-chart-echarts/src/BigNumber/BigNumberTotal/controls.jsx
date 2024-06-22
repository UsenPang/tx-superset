import { FeatureFlag, isFeatureEnabled, t } from '@superset-ui/core';

const sandboxUrl =
  'https://github.com/apache/superset/' +
  'blob/master/superset-frontend/plugins/legacy-preset-chart-deckgl/src/utils/sandbox.ts';
const jsFunctionInfo = (
  <div>
    {t(
      'For more information about objects are in context in the scope of this function, refer to the',
    )}
    <a href={sandboxUrl}>{t(" source code of Superset's sandboxed parser")}.</a>
    .
  </div>
);

function jsFunctionControl(
  label,
  description,
  extraDescr = null,
  height = 100,
  defaultText = '',
) {
  return {
    type: 'TextAreaControl',
    language: 'javascript',
    label,
    description,
    height,
    default: defaultText,
    aboveEditorSection: (
      <div>
        <p>{description}</p>
        <p>{jsFunctionInfo}</p>
        {extraDescr}
      </div>
    ),
    warning: !isFeatureEnabled(FeatureFlag.EnableJavascriptControls)
      ? t(
          'This functionality is disabled in your environment for security reasons.',
        )
      : null,
    readOnly: !isFeatureEnabled(FeatureFlag.EnableJavascriptControls),
  };
}

export const jsOnclickFn = {
  name: 'js_onclick_fn',
  config: jsFunctionControl(
    t('JavaScript onClick function'),
    t('Define a function to execute when user clicks'),
  ),
};
