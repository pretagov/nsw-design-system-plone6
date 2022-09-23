import Body from '@plone/volto/components/manage/Blocks/Video/Body';
import { withBlockExtensions } from '@plone/volto/helpers';
import PropTypes from 'prop-types';
import React from 'react';

const View = ({ data }) => {
  return <Body data={data} />;
};

export default withBlockExtensions(View);
