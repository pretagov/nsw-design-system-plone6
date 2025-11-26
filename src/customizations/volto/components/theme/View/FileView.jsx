import RenderBlocks from '@plone/volto/components/theme/View/RenderBlocks';
import config from '@plone/volto/registry';
import filesize from 'filesize';
import { useIntl } from 'react-intl';

import {
  flattenToAppURL,
  getBlocksFieldname,
  getBlocksLayoutFieldname,
  hasBlocksData,
} from '@plone/volto/helpers';

import PropTypes from 'prop-types';

function PDFDisplay({ content }) {
  if (!config.blocks.blocksConfig['nsw_pdf']) {
    return null;
  }
  const blocksFieldname = getBlocksFieldname(content) || 'blocks';
  const blocksLayoutFieldname =
    getBlocksLayoutFieldname(content) || 'blocks_layout';

  // Re-create a reduced version of the existing content to reproduce a PDF block
  const fakeContent = { file: content.file };
  fakeContent[blocksFieldname] = {
    '00000000-0000-0000-0000-000000000000': {
      '@type': 'nsw_pdf',
      showDownloadLink: false, // Already handled by the view code below
      linkedObject: [
        {
          '@id': content['@id'],
          getObjSize: content.file?.size
            ? filesize(content.file.size)
            : undefined,
          title: content.title,
          ...content.file,
        },
      ],
    },
  };
  fakeContent[blocksLayoutFieldname] = {
    items: ['00000000-0000-0000-0000-000000000000'],
  };

  return (
    <>
      <RenderBlocks content={fakeContent} path="/" />
    </>
  );
}

const MimeToComponentMapping = {
  'application/pdf': PDFDisplay,
};
const MimeToFriendlyNameMapping = {
  'application/pdf': 'PDF',
  'video/mp4': 'MPEG-4',
};

const ClassicFileView = ({ content }) => {
  const intl = useIntl();

  const formattedDate = content?.effective
    ? intl.formatDate(
        ['Invalid Date', NaN].includes(new Date(content?.effective))
          ? null
          : content?.effective,
        {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        },
      )
    : null;

  return (
    <>
      <h1>
        {content.title}
        {content.subtitle && ` - ${content.subtitle}`}
      </h1>
      {formattedDate ? <p>Published: {formattedDate}</p> : null}
      {content.description && (
        <p className="nsw-intro">{content.description}</p>
      )}
      {content.file?.download && (
        <>
          <p className="nsw-m-y-sm">
            <span className="nsw-h4">Download document:</span>
            <br />
            <a href={flattenToAppURL(content.file.download)}>
              {content.title}
            </a>{' '}
            <span id="download-descriptor">
              (
              {`${
                MimeToFriendlyNameMapping[content.file['content-type']]
              }, ${filesize(content.file.size)}`}
              )
            </span>
          </p>
        </>
      )}
    </>
  );
};

function FileWithBlocksView({ content }) {
  return <RenderBlocks content={content} />;
}

function FileView(props) {
  const { content } = props;
  const MimeMappedComponent =
    MimeToComponentMapping[content.file['content-type']];

  return (
    <div id="file-view" className="nsw-container">
      <div className="nsw-layout">
        <div className="nsw-layout__main">
          {hasBlocksData(content) ? (
            <FileWithBlocksView content={content} />
          ) : (
            <ClassicFileView content={content} />
          )}
          {MimeMappedComponent ? <MimeMappedComponent {...props} /> : null}
        </div>
        {/* <div className="nsw-layout__sidebar"></div> */}
      </div>
    </div>
  );
}

FileView.propTypes = {
  content: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    file: PropTypes.shape({
      download: PropTypes.string,
      filename: PropTypes.string,
    }),
  }).isRequired,
};

export default FileView;
