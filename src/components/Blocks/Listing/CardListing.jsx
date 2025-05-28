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

        const labelField =
          typeof data.labelField === 'string'
            ? data.labelField
            : data.labelField?.value;
        const label = item[labelField] === 'None' ? null : item[labelField];

        const dateField =
          typeof data.dateField === 'string'
            ? data.dateField
            : data.dateField?.value;
        const date = item[dateField] === 'None' ? null : item[dateField];

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
              label={data.showLabel ? label : null}
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
