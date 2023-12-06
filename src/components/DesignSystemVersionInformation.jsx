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

  const ploneVersion = 'Plone 6';

  if (designSystemVersion && !ploneVersion) {
    return (
      <FormattedMessage
        id="NSW Built with - DDS only"
        defaultMessage="NSW DDS {ddsVersion}"
        values={{
          ddsVersion: designSystemVersion,
        }}
      />
    );
  } else if (!designSystemVersion && ploneVersion) {
    return (
      <FormattedMessage
        id="NSW Built with - plone only"
        defaultMessage="NSW DDS {ploneVersion}"
        values={{
          ploneVersion: ploneVersion,
        }}
      />
    );
  } else if (designSystemVersion && ploneVersion) {
    return (
      <FormattedMessage
        id="NSW Built with - DDS and Plone"
        defaultMessage="NSW DDS {ddsVersion} {ploneVersion}"
        values={{
          ddsVersion: designSystemVersion,
          ploneVersion: ploneVersion,
        }}
      />
    );
  }
  return (
    <FormattedMessage id="NSW Built with - Fallback" defaultMessage="NSW DDS" />
  );
}
