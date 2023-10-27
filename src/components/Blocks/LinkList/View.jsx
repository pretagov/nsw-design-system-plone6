import { UniversalLink } from '@plone/volto/components';
import { flattenToAppURL, isInternalURL } from '@plone/volto/helpers';

function LinkListItemBody({ title }) {
  return (
    <>
      <span>{title}</span>
      <span
        className="material-icons nsw-material-icons"
        focusable="false"
        aria-hidden="true"
      >
        east
      </span>
    </>
  );
}

export function LinkListView({ data, isEditMode }) {
  if (!data.links || data.links.length === 0) {
    return null;
  }

  return (
    <div className="nsw-link-list">
      <ul>
        {data.links?.map((linkObject) => {
          if (!linkObject.url || !linkObject?.url[0]) {
            return null;
          }

          const link = linkObject.url[0];
          let href = link['@id'];
          const title = link.title;

          if (isEditMode) {
            return (
              <li key={href}>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a href="" inert="">
                  <LinkListItemBody title={title} />
                </a>
              </li>
            );
          }

          const isInternal = isInternalURL(href);
          if (isInternal) {
            return (
              <li key={href}>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <UniversalLink item={link}>
                  <LinkListItemBody title={title} />
                </UniversalLink>
              </li>
            );
          }

          // External links not implemented as of 1.8.0 so we probably won't hit this code. Could be addded in the future
          return (
            <li key={href}>
              <UniversalLink href={href}>
                <LinkListItemBody title={title} />
              </UniversalLink>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
