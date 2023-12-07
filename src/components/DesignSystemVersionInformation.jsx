import { FormattedMessage } from 'react-intl';

import nswPackageJson from 'nsw-design-system/package.json';

export function DesignSystemVersionInformation() {
  let designSystemVersion = nswPackageJson?.version;
  try {
    designSystemVersion = designSystemVersion.split('.').slice(0, 2).join('.');
  } catch {
    console.warn(
      'Failed to fetch valid design system version: ',
      designSystemVersion,
    );
  }

  if (!designSystemVersion) {
    return (
      <FormattedMessage
        id="NSW Built with - plone only"
        defaultMessage="NSW DDS Plone"
      />
    );
  }

  return (
    <FormattedMessage
      id="NSW Built with - DDS and Plone"
      defaultMessage="NSW DDS Plone {ddsVersion}"
      values={{
        ddsVersion: designSystemVersion,
      }}
    />
  );
}
