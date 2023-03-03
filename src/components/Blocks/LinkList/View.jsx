import { UniversalLink } from '@plone/volto/components';
import { flattenToAppURL, isInternalURL } from '@plone/volto/helpers';

export function LinkListView({ data, isEditMode }) {
  if (!data.links || data.links.length === 0) {
    return null;
  }

  return (
    <div className="nsw-link-list">
      <ul>
        {data.links?.map((linkObject) => {
          if (!linkObject.link || !linkObject?.url[0]) {
            return null;
          }
          const link = linkObject.link[0];
          const title = link.title;
          let href = link['@id'];
          if (isInternalURL(href)) {
            href = flattenToAppURL(href);
          }

          return (
            <li key={href}>
              {isEditMode ? (
                // eslint-disable-next-line jsx-a11y/anchor-is-valid
                <a href="" inert="">
                  <span>{title}</span>
                  <span
                    className="material-icons nsw-material-icons"
                    focusable="false"
                    aria-hidden="true"
                  >
                    east
                  </span>
                </a>
              ) : (
                <UniversalLink href={href}>
                  <span>{title}</span>
                  <span
                    className="material-icons nsw-material-icons"
                    focusable="false"
                    aria-hidden="true"
                  >
                    east
                  </span>
                </UniversalLink>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
