import { flattenToAppURL, isInternalURL } from '@plone/volto/helpers';

export function LinkListView({ data, isEditMode }) {
  if (!data.links || data.links.length === 0) {
    return null;
  }

  return (
    <div className="nsw-link-list">
      <ul>
        {data.links.map((linkObject) => {
          if (!linkObject.link || !linkObject.link[0]) {
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
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a href={isEditMode ? null : href}>
                <span>{title}</span>
                <span
                  className="material-icons nsw-material-icons"
                  focusable="false"
                  aria-hidden="true"
                >
                  east
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
