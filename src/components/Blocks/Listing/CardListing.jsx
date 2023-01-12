import { flattenToAppURL, isInternalURL } from '@plone/volto/helpers';
import { Card } from 'nsw-design-system-plone6/components/Components/Card';

const numberOfColumnsClassMapping = {
  1: 'nsw-col',
  2: 'nsw-col nsw-col-md-6',
  3: 'nsw-col nsw-col-md-6 nsw-col-lg-4',
  4: 'nsw-col nsw-col-md-6 nsw-col-lg-3',
};

export function CardListing({ items, isEditMode, ...data }) {
  return (
    <div className="nsw-grid">
      {items.map((item) => {
        let href = item.link?.[0]?.['@id'] || item['@id'] || '';
        if (isInternalURL(href)) {
          href = flattenToAppURL(href);
        }

        const image =
          data.imagePosition !== 'hidden' && item.image_field
            ? `${flattenToAppURL(item['@id'])}/@@images/${
                item.image_field
              }/teaser`
            : null;

        return (
          <div
            key={item['@id']}
            className={numberOfColumnsClassMapping[data.numberOfColumns]}
          >
            <Card
              {...data}
              {...item}
              description={!data.showDescription ? null : item.description}
              image={image}
              href={href}
              urlDisplay={data.showUrl ? href : null}
              date={data.showDate ? item[data.dateField] : null}
              isEditMode={isEditMode}
            />
          </div>
        );
      })}
    </div>
  );
}
