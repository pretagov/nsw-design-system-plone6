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
        let href =
          item.url?.[0]?.['@id'] || item.url?.[0]?.['@id'] || item['@id'] || '';
        if (isInternalURL(href)) {
          href = flattenToAppURL(href);
        }

        const label =
          item[data.labelField?.value] === 'None' ? null : item[data.labelField?.value];


        const date =
            item[data.dateField?.value] === 'None' ? null : item[data.dateField?.value];

        const image =
          data.imagePosition !== 'hidden' && item.image_field
            ? `${flattenToAppURL(item['@id'])}/@@images/${
                item.image_field
              }/teaser`
            : null;

        const description = { data: item.description };

        const numberOfColumns = data.numberOfColumns ? data.numberOfColumns : 1;
        return (
          <div
            key={item['@id']}
            className={numberOfColumnsClassMapping[numberOfColumns]}
          >
            <Card
              {...data}
              data={item}
              {...item}
              description={!data.showDescription ? null : description}
              image={image}
              label={label}
              href={href}
              urlDisplay={data.showUrl ? href : null}
              date={data.showDate ? date : null}
              isEditMode={isEditMode}
            />
          </div>
        );
      })}
    </div>
  );
}
