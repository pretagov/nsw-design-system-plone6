import { ConditionalLink } from '@plone/volto/components';
import React from 'react';
import { CardView } from '../Card';

const numberOfColumnsClassMapping = {
  1: 'nsw-col',
  2: 'nsw-col nsw-col-md-6',
  3: 'nsw-col nsw-col-md-6 nsw-col-lg-4',
  4: 'nsw-col nsw-col-md-6 nsw-col-lg-3',
};

const CardListing = ({ items, isEditMode, ...data }) => {
  return (
    <div className="nsw-grid">
      {items.map((item) => (
        <div
          key={item['@id']}
          className={numberOfColumnsClassMapping[data.numberOfColumns]}
        >
          <CardView data={{ ...data, ...item }} isEditMode={isEditMode} />
        </div>
      ))}
    </div>
  );
};

export default CardListing;
