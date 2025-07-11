/**
 * Added `useSelector and `useLocation` imports.
 * Added the `pageTitle` logic which is rendered as the `<title>` attribute
 */

import React from 'react';
import { toPublicURL, Helmet } from '@plone/volto/helpers';
import config from '@plone/volto/registry';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';

const ContentMetadataTags = (props) => {
  const siteTitle = useSelector((state) => state.siteInfo?.title);
  const siteLanguage = useSelector((state) => state.siteInfo?.default_language);

  const { pathname } = useLocation();
  const {
    opengraph_title,
    opengraph_description,
    seo_title,
    seo_description,
    seo_canonical_url,
    seo_noindex,
    title,
    description,
  } = props.content;

  const getContentImageInfo = () => {
    const { contentMetadataTagsImageField } = config.settings;
    const image = props.content[contentMetadataTagsImageField];
    const { opengraph_image } = props.content;

    const contentImageInfo = {
      contentHasImage: false,
      url: null,
      height: null,
      width: null,
    };
    contentImageInfo.contentHasImage =
      opengraph_image?.scales?.large?.download ||
      image?.scales?.large?.download ||
      false;

    if (contentImageInfo.contentHasImage && opengraph_image?.scales?.large) {
      contentImageInfo.url = opengraph_image.scales.large.download;
      contentImageInfo.height = opengraph_image.scales.large.height;
      contentImageInfo.width = opengraph_image.scales.large.width;
    } else if (contentImageInfo.contentHasImage) {
      contentImageInfo.url = image.scales.large.download;
      contentImageInfo.height = image.scales.large.height;
      contentImageInfo.width = image.scales.large.width;
    }

    return contentImageInfo;
  };

  const contentImageInfo = getContentImageInfo();

  const contentTitle = (seo_title || title)?.replace(/\u00AD/g, '');
  const pageTitle = siteTitle
    ? pathname === '/'
      ? contentTitle
      : `${contentTitle} | ${siteTitle}`
    : contentTitle;

  const contentLanguage = props.content.language?.token;

  return (
    <>
      <Helmet>
        {contentLanguage !== siteLanguage ? (
          <title lang={contentLanguage}>{pageTitle}</title>
        ) : (
          <title>{pageTitle}</title>
        )}
        <meta name="description" content={seo_description || description} />
        <meta
          property="og:title"
          content={opengraph_title || seo_title || title}
        />
        <meta
          property="og:url"
          content={seo_canonical_url || toPublicURL(props.content['@id'])}
        />
        {seo_noindex && <meta name="robots" content="noindex" />}
        {contentImageInfo.contentHasImage && (
          <meta
            property="og:image"
            content={toPublicURL(contentImageInfo.url)}
          />
        )}
        {contentImageInfo.contentHasImage && (
          <meta property="og:image:width" content={contentImageInfo.width} />
        )}
        {contentImageInfo.contentHasImage && (
          <meta property="og:image:height" content={contentImageInfo.height} />
        )}
        {(opengraph_description || seo_description || description) && (
          <meta
            property="og:description"
            content={opengraph_description || seo_description || description}
          />
        )}
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
    </>
  );
};

export default ContentMetadataTags;
