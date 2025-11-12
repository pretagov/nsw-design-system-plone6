// Backported from @plone/volto 19.0.0-alpha.12
import React, { useEffect, useRef } from 'react';
import { Button, Dimmer, Loader, Message } from 'semantic-ui-react';
import { useIntl, defineMessages } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import loadable from '@loadable/component';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { toast } from 'react-toastify';
// import useLinkEditor from '@plone/volto/components/manage/AnchorPlugin/useLinkEditor';  // Replaced with backport
import withObjectBrowser from '@plone/volto/components/manage/Sidebar/ObjectBrowser';
import config from '@plone/volto/registry';

import {
  flattenToAppURL,
  getBaseUrl,
  getParentUrl,
  isInternalURL,
  normalizeUrl,
  removeProtocol,
} from '@plone/volto/helpers/Url/Url';
// import { validateFileUploadSize } from '@plone/volto/helpers/FormValidation/FormValidation';
import { usePrevious } from '@plone/volto/helpers/Utils/usePrevious';
import { createContent } from '@plone/volto/actions/content/content';
import { readAsDataURL } from 'promise-file-reader';
import FormFieldWrapper from '@plone/volto/components/manage/Widgets/FormFieldWrapper';
import Icon from '@plone/volto/components/theme/Icon/Icon';
import Toast from '@plone/volto/components/manage/Toast/Toast';

import imageBlockSVG from '@plone/volto/components/manage/Blocks/Image/block-image.svg';
import clearSVG from '@plone/volto/icons/clear.svg';
import navTreeSVG from '@plone/volto/icons/nav.svg';
import linkSVG from '@plone/volto/icons/link.svg';
import uploadSVG from '@plone/volto/icons/upload.svg';
// import Image from '../../theme/Image/Image';
// import { urlValidator } from '@plone/volto/helpers/FormValidation/validators';
import { searchContent } from '@plone/volto/actions/search/search';

// START: Backport packages/volto/src/components/manage/AnchorPlugin/useLinkEditor.jsx from @plone/volto 19.0.0-alpha.12
import PositionedToolbar from '@plone/volto-slate/editor/ui/PositionedToolbar';
import AddLinkForm from '@plone/volto/components/manage/AnchorPlugin/components/LinkButton/AddLinkForm';

function getPositionStyle(position) {
  return (
    position || {
      style: {
        opacity: 1,
        top: -5,
        left: 55,
      },
    }
  );
}

const useLinkEditor = () => {
  const [showLinkEditor, setShowLinkEditor] = React.useState(false);
  const show = React.useCallback(() => setShowLinkEditor(true), []);
  const anchorNode = React.useRef();

  const LinkEditor = React.useCallback(
    (props) => {
      const {
        id,
        value,
        onChange,
        placeholder,
        objectBrowserPickerType,
        position,
      } = props;
      return showLinkEditor && anchorNode.current ? (
        <PositionedToolbar
          className="add-link"
          toggleButton={anchorNode.current}
          position={getPositionStyle(position)}
        >
          <AddLinkForm
            placeholder={placeholder}
            data={{ url: value || '' }}
            theme={{}}
            objectBrowserPickerType={objectBrowserPickerType}
            onChangeValue={(url) => {
              setShowLinkEditor(false);
              onChange(id, url);
            }}
            onClear={() => {}}
            onOverrideContent={(c) => {
              setShowLinkEditor(false);
            }}
          />
        </PositionedToolbar>
      ) : null;
    },
    [showLinkEditor],
  );

  return {
    anchorNode,
    show,
    LinkEditor,
  };
};
// END: Backport packages/volto/src/components/manage/AnchorPlugin/useLinkEditor.jsx from @plone/volto 19.0.0-alpha.12

// START: Backport packages/volto/src/helpers/Url/Url.js from @plone/volto 19.0.0-alpha.12
/**
 * Add subpath path if set in settings
 * @method addSubpathPrefix
 * @param {string} src pathname
 * @returns {string} prefixed subpath pathname
 */
export function addSubpathPrefix(src) {
  let url = src;
  const { subpathPrefix } = config.settings;
  if (isInternalURL(src) && subpathPrefix && !src.startsWith(subpathPrefix)) {
    url = subpathPrefix + src; //add subpathPrefix to src if it's an internal url and not a static resource.
  }
  return url;
}
// END: Backport packages/volto/src/components/manage/AnchorPlugin/useLinkEditor.jsx from @plone/volto 19.0.0-alpha.12

// START: Backport packages/volto/src/components/theme/Image/Image.jsx from @plone/volto 19.0.0-alpha.12
// Replace "addSubpathPrefix" import with backport
import PropTypes from 'prop-types';
import cx from 'classnames';
import {
  flattenScales,
  // addSubpathPrefix,
} from '@plone/volto/helpers/Url/Url';

/**
 * Image component
 * @param {object} item - Context item that has the image field (can also be a catalog brain or summary)
 * @param {string} imageField - Key of the image field inside the item, or inside the image_scales object of the item if it is a catalog brain or summary
 * @param {string} src - URL of the image to be used if the item field is not available
 * @param {string} alt - Alternative text for the image
 * @param {boolean} loading - (default: eager) set to `lazy` to lazy load the image
 * @param {boolean} responsive - (default: false) set to `true` to add the `responsive` class to the image
 * @param {string} className - Additional classes to add to the image
 */
function Image({
  item,
  imageField,
  src,
  alt = '',
  loading = 'eager',
  responsive = false,
  className = '',
  ...imageProps
}) {
  if (!item && !src) return null;

  // TypeScript hints for editor autocomplete :)
  /** @type {React.ImgHTMLAttributes<HTMLImageElement>} */
  const attrs = {};
  attrs.className = cx(className, { responsive }) || undefined;

  if (!item && src) {
    attrs.src = addSubpathPrefix(src);
  } else {
    const isFromRealObject = !item.image_scales;
    const imageFieldWithDefault = imageField || item.image_field || 'image';

    const image = isFromRealObject
      ? flattenScales(item['@id'], item[imageFieldWithDefault])
      : flattenScales(
          item['@id'],
          item.image_scales[imageFieldWithDefault]?.[0],
        );

    if (!image) return null;

    const isSvg = image['content-type'] === 'image/svg+xml';
    // In case `base_path` is present (`preview_image_link`) use it as base path
    const basePath = addSubpathPrefix(
      flattenToAppURL(image.base_path || item['@id']),
    );
    attrs.src = `${basePath}/${image.download}`;

    attrs.width = image.width;
    attrs.height = image.height;

    if (!isSvg && image.scales && Object.keys(image.scales).length > 0) {
      const sortedScales = Object.values({
        ...image.scales,
        original: {
          download: `${image.download}`,
          width: image.width,
          height: image.height,
        },
      }).sort((a, b) => {
        if (a.width > b.width) return 1;
        else if (a.width < b.width) return -1;
        else return 0;
      });

      attrs.srcSet = sortedScales
        .map((scale) => `${basePath}/${scale.download} ${scale.width}w`)
        .join(', ');
    }
  }

  if (loading === 'lazy') {
    attrs.loading = 'lazy';
    attrs.decoding = 'async';
  } else {
    attrs.fetchpriority = 'high';
  }

  return <img {...attrs} alt={alt} {...imageProps} />;
}

Image.propTypes = {
  item: PropTypes.shape({
    '@id': PropTypes.string,
    image_field: PropTypes.string,
    image_scales: PropTypes.object,
    image: PropTypes.object,
  }),
  imageField: PropTypes.string,
  src: PropTypes.string,
  alt: PropTypes.string.isRequired,
  loading: PropTypes.string,
  responsive: PropTypes.bool,
  className: PropTypes.string,
};
// END: Backport packages/volto/src/components/theme/Image/Image.jsx from @plone/volto 19.0.0-alpha.12

// Start: Backport packages/volto/src/helpers/FormValidation/FormValidation.jsx from @plone/volto 19.0.0-alpha.12
/**
 * Will return the intl message if invalid
 * @param {boolean} isValid
 * @param {string} criterion
 * @param {string | number} valueToCompare can compare '47' < 50
 * @param {Function} intlFunc
 */
export const validationMessage = (
  isValid,
  criterion,
  valueToCompare,
  intlFunc,
) =>
  !isValid
    ? intlFunc(messages[criterion], {
        len: valueToCompare,
      })
    : null;

/**
 * Check if a file upload is within the maximum size limit.
 * @param {File} file
 * @param {Function} intlFunc
 * @returns {Boolean}
 */
export const validateFileUploadSize = (file, intlFunc) => {
  const isValid =
    !config.settings.maxFileUploadSize ||
    file.size <= config.settings.maxFileUploadSize;
  if (!isValid) {
    toast.error(
      <Toast
        error
        title={intlFunc(messages.error)}
        content={intlFunc(messages.fileTooLarge, {
          limit: `${Math.floor(
            config.settings.maxFileUploadSize / 1024 / 1024,
          )}MB`,
        })}
      />,
    );
  }
  return isValid;
};
// End: Backport packages/volto/src/helpers/FormValidation/FormValidation.jsx from @plone/volto 19.0.0-alpha.12


// Start: Backport packages/volto/src/helpers/FormValidation/validators.ts from @plone/volto 19.0.0-alpha.12
// Removed typescript
// Renamed "message" import
// Replace "validationMessage" import with backport
// import { validationMessage } from '@plone/volto/helpers/FormValidation/FormValidation';
import { messages as builtinMessages } from '@plone/volto/helpers/MessageLabels/MessageLabels';


export const isMaxPropertyValid = ({
  value,
  fieldSpec,
  criterion,
  formatMessage,
}) => {
  const isValid = fieldSpec !== undefined ? value <= fieldSpec : true;
  return validationMessage(isValid, criterion, fieldSpec, formatMessage);
};

export const isMinPropertyValid = ({
  value,
  fieldSpec,
  criterion,
  formatMessage,
}) => {
  const isValid = fieldSpec !== undefined ? value >= fieldSpec : true;
  return validationMessage(isValid, criterion, fieldSpec, formatMessage);
};

export const minLengthValidator = ({
  value,
  field,
  formatMessage,
}) =>
  isMinPropertyValid({
    value: value.length,
    fieldSpec: field.minLength,
    criterion: 'minLength',
    formatMessage,
  });

export const maxLengthValidator = ({
  value,
  field,
  formatMessage,
}) =>
  isMaxPropertyValid({
    value: value.length,
    fieldSpec: field.maxLength,
    criterion: 'maxLength',
    formatMessage,
  });

export const urlValidator = ({ value, formatMessage }) => {
  const urlRegex = new RegExp(
    '^(https?:\\/\\/)?' + // validate protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // validate domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))|' + // validate OR ip (v4) address
      '(localhost)' + // validate OR localhost address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // validate port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // validate query string
      '(\\#[-a-z\\d_]*)?$', // validate fragment locator
    'i',
  );
  const isValid = urlRegex.test(value);
  return !isValid ? formatMessage(builtinMessages.isValidURL) : null;
};

export const emailValidator = ({
  value,
  formatMessage,
}) => {
  // Email Regex taken from from WHATWG living standard:
  // https://html.spec.whatwg.org/multipage/input.html#e-mail-state-(type=email)
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  const isValid = emailRegex.test(value);
  return !isValid ? formatMessage(builtinMessages.isValidEmail) : null;
};

export const isNumberValidator = ({ value, formatMessage }) => {
  const isNumeric = (string) => Number.isFinite(+string);
  const floatRegex = /^[+-]?\d+(\.\d+)?$/;
  const isValid = isNumeric(value) && floatRegex.test(value);
  // const isValid =
  //   typeof value === 'string' && !isNaN(+value) && floatRegex.test(value);
  return !isValid ? formatMessage(builtinMessages.isNumber) : null;
};

export const minimumValidator = ({ value, field, formatMessage }) =>
  isMinPropertyValid({
    value,
    fieldSpec: field.minimum,
    criterion: 'minimum',
    formatMessage,
  });

export const maximumValidator = ({ value, field, formatMessage }) =>
  isMaxPropertyValid({
    value,
    fieldSpec: field.maximum,
    criterion: 'maximum',
    formatMessage,
  });

export const isIntegerValidator = ({ value, formatMessage }) => {
  const isNumeric = (string) => Number.isFinite(+string);
  const intRegex = /^-?[0-9]+$/;
  const isValid = isNumeric(value) && intRegex.test(value);
  return !isValid ? formatMessage(builtinMessages.isInteger) : null;
};

export const hasUniqueItemsValidator = ({
  value,
  field,
  formatMessage,
}) => {
  if (!field.uniqueItems) {
    return null;
  }
  const isValid =
    field.uniqueItems &&
    value &&
    // unique items
    [...new Set(value)].length === value.length;
  return !isValid ? formatMessage(builtinMessages.uniqueItems) : null;
};

export const startEventDateRangeValidator = ({
  value,
  field,
  formData,
  formatMessage,
}) => {
  const isValid =
    value && formData.end && new Date(value) < new Date(formData.end);
  return !isValid
    ? formatMessage(builtinMessages.startEventRange, {
        endDateValueOrEndFieldName: formData.end || 'end',
      })
    : null;
};

export const endEventDateRangeValidator = ({
  value,
  field,
  formData,
  formatMessage,
}) => {
  const isValid =
    value && formData.start && new Date(value) > new Date(formData.start);
  return !isValid
    ? formatMessage(builtinMessages.endEventRange, {
        startDateValueOrStartFieldName: formData.start || 'start',
      })
    : null;
};

export const patternValidator = ({
  value,
  field,
  formatMessage,
}) => {
  if (!field.pattern) {
    return null;
  }
  const regex = new RegExp(field.pattern);
  const isValid = regex.test(value);
  return !isValid
    ? formatMessage(builtinMessages.pattern, { pattern: field.pattern })
    : null;
};

export const maxItemsValidator = ({
  value,
  field,
  formatMessage,
}) => {
  if (!field.maxItems) {
    return null;
  }
  const isValid = Array.isArray(value) && value.length <= field.maxItems;
  return !isValid
    ? formatMessage(builtinMessages.maxItems, { maxItems: field.maxItems })
    : null;
};

export const minItemsValidator = ({
  value,
  field,
  formatMessage,
}) => {
  if (!field.minItems) {
    return null;
  }
  const isValid = Array.isArray(value) && value.length >= field.minItems;
  return !isValid
    ? formatMessage(builtinMessages.minItems, { minItems: field.minItems })
    : null;
};

export const defaultLanguageControlPanelValidator = ({
  value,
  formData,
  formatMessage,
}) => {
  const isValid =
    value &&
    (formData.available_languages.find(
      (lang) => lang.token === value,
    ) ||
      formData.available_languages.includes(value));
  return !isValid ? formatMessage(builtinMessages.defaultLanguage) : null;
};
// Start: Backport packages/volto/src/helpers/FormValidation/validators.ts from @plone/volto 19.0.0-alpha.12


const Dropzone = loadable(() => import('react-dropzone'));

export const ImageToolbar = ({ className, data, id, onChange, selected }) => (
  <div className="image-upload-widget-toolbar">
    <Button.Group>
      <Button icon basic onClick={() => onChange(id, null)}>
        <Icon className="circled" name={clearSVG} size="24px" color="#e40166" />
      </Button>
    </Button.Group>
  </div>
);

const messages = defineMessages({
  addImage: {
    id: 'Browse the site, drop an image, or type a URL',
    defaultMessage: 'Browse the site, drop an image, or use a URL',
  },
  pickAnImage: {
    id: 'pickAnImage',
    defaultMessage: 'Pick an existing image',
  },
  uploadAnImage: {
    id: 'uploadAnImage',
    defaultMessage: 'Upload an image from your computer',
  },
  linkAnImage: {
    id: 'linkAnImage',
    defaultMessage: 'Enter a URL to an image',
  },
  uploadingImage: {
    id: 'Uploading image',
    defaultMessage: 'Uploading image',
  },
  Error: {
    id: 'Error',
    defaultMessage: 'Error',
  },
  imageUploadErrorMessage: {
    id: 'imageUploadErrorMessage',
    defaultMessage: 'Please upload an image instead.',
  },
  externalURLsNotAllowed: {
    id: 'externalURLsNotAllowed',
    defaultMessage: 'External URLs are not allowed in this field.',
  },
  internalImageNotFoundErrorMessage: {
    id: 'internalImageNotFoundErrorMessage',
    defaultMessage: 'No image was found in the internal path you provided.',
  },
});

const UnconnectedImageInput = (props) => {
  const {
    id,
    onChange,
    onFocus,
    openObjectBrowser,
    value,
    imageSize = 'teaser',
    selected = true,
    hideLinkPicker = false,
    hideObjectBrowserPicker = false,
    restrictFileUpload = false,
    objectBrowserPickerType = 'image',
    description,
    placeholderLinkInput = '',
    onSelectItem,
  } = props;
  const imageValue = value?.[0]?.['@id'] || value?.['@id'] || value;

  const intl = useIntl();
  const linkEditor = useLinkEditor();
  const location = useLocation();
  const dispatch = useDispatch();
  const isFolderish = useSelector(
    (state) => state?.content?.data?.is_folderish,
  );
  const contextUrl = location.pathname;

  const [uploading, setUploading] = React.useState(false);
  const [dragging, setDragging] = React.useState(false);

  const imageUploadInputRef = useRef(null);

  const requestId = `image-upload-${id}`;

  const loaded = props.request.loaded;
  const { content } = props;
  const imageId = content?.['@id'];
  const image = content?.image;
  let loading = false;
  const isRelationChoice = props.factory === 'Relation Choice';

  useEffect(() => {
    if (uploading && loading && loaded) {
      setUploading(false);
      if (isRelationChoice) {
        onChange(id, content, {
          image_field: 'image',
          image_scales: { image: [image] },
        });
      } else {
        onChange(id, imageId, {
          image_field: 'image',
          image_scales: { image: [image] },
        });
      }
    }
  }, [
    loading,
    loaded,
    uploading,
    imageId,
    image,
    id,
    content,
    isRelationChoice,
    onChange,
  ]);

  loading = usePrevious(props.request?.loading);

  const handleUpload = React.useCallback(
    (eventOrFile) => {
      let uploadUrl = getBaseUrl(contextUrl);
      if (!isFolderish) uploadUrl = getParentUrl(uploadUrl);
      if (restrictFileUpload === true) return;
      eventOrFile.target && eventOrFile.stopPropagation();

      setUploading(true);
      const file = eventOrFile.target
        ? eventOrFile.target.files[0]
        : eventOrFile[0];
      if (!validateFileUploadSize(file, intl.formatMessage)) {
        setUploading(false);
        return;
      }
      readAsDataURL(file).then((fileData) => {
        const fields = fileData.match(/^data:(.*);(.*),(.*)$/);
        dispatch(
          createContent(
            uploadUrl,
            {
              '@type': 'Image',
              title: file.name,
              image: {
                data: fields[3],
                encoding: fields[2],
                'content-type': fields[1],
                filename: file.name,
              },
            },
            props.block || requestId,
          ),
        );
      });
    },
    [
      contextUrl,
      isFolderish,
      restrictFileUpload,
      intl.formatMessage,
      dispatch,
      props.block,
      requestId,
    ],
  );

  const onDragEnter = React.useCallback(() => {
    if (restrictFileUpload === false) setDragging(true);
  }, [restrictFileUpload]);
  const onDragLeave = React.useCallback(() => setDragging(false), []);

  const validateManualLink = React.useCallback(
    (url) => {
      if (!url.startsWith('/')) {
        const error = urlValidator({
          value: url,
          formatMessage: intl.formatMessage,
        });
        // if (error && url !== '') {
        //   this.setState({ errors: [error] });
        // } else {
        //   this.setState({ errors: [] });
        // }
        return !Boolean(error);
      } else {
        return isInternalURL(url);
      }
    },
    [intl.formatMessage],
  );

  const onSubmitURL = React.useCallback(
    (url) => {
      if (validateManualLink(url)) {
        if (isInternalURL(url)) {
          // convert it into an internal on if possible
          props
            .searchContent(
              '/',
              {
                portal_type: config.settings.imageObjects,
                'path.query': flattenToAppURL(url),
                'path.depth': '0',
                sort_on: 'getObjPositionInParent',
                metadata_fields: '_all',
                b_size: 1000,
              },
              `${props.block}-${props.mode}`,
            )
            .then((resp) => {
              if (resp.items?.length > 0) {
                onChange(props.id, resp.items[0], {});
              } else {
                toast.error(
                  <Toast
                    error
                    title={intl.formatMessage(messages.Error)}
                    content={intl.formatMessage(
                      messages.internalImageNotFoundErrorMessage,
                    )}
                  />,
                );
              }
            });
        } else {
          if (isRelationChoice) {
            toast.error(
              <Toast
                error
                title={intl.formatMessage(messages.Error)}
                content={intl.formatMessage(messages.imageUploadErrorMessage)}
              />,
            );
          } else {
            // if it's an external link, we save it as is
            onChange(props.id, [
              {
                '@id': normalizeUrl(url),
                title: removeProtocol(url),
              },
            ]);
          }
        }
      }
    },
    [validateManualLink, props, intl, isRelationChoice, onChange],
  );

  return imageValue ? (
    <div
      className="image-upload-widget-image"
      onClick={onFocus}
      onKeyDown={onFocus}
      role="toolbar"
    >
      {selected && <ImageToolbar {...props} />}
      {/* If it's relation choice (preview_image_link) */}
      {isRelationChoice ? (
        <Image item={value} width="fit-content" height="auto" loading="lazy" />
      ) : (
        <Image
          className={props.className}
          src={
            isInternalURL(imageValue)
              ? `${flattenToAppURL(imageValue)}/@@images/image/${imageSize}`
              : imageValue
          }
          alt=""
        />
      )}
    </div>
  ) : (
    <div
      className="image-upload-widget"
      onClick={onFocus}
      onKeyDown={onFocus}
      role="toolbar"
    >
      <Dropzone
        noClick
        accept="image/*"
        onDrop={(acceptedFiles) => {
          setDragging(false);
          if (acceptedFiles.length > 0) {
            handleUpload(acceptedFiles);
          } else {
            toast.error(
              <Toast
                error
                title={intl.formatMessage(messages.Error)}
                content={intl.formatMessage(messages.imageUploadErrorMessage)}
              />,
            );
          }
        }}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        className="dropzone"
      >
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps()}>
            <Message>
              {dragging && <Dimmer active />}
              {uploading && (
                <Dimmer active>
                  <Loader indeterminate>
                    {intl.formatMessage(messages.uploadingImage)}
                  </Loader>
                </Dimmer>
              )}
              <Image src={imageBlockSVG} alt="" className="placeholder" />
              <p>{description || intl.formatMessage(messages.addImage)}</p>
              <div className="toolbar-wrapper">
                <div className="toolbar-inner" ref={linkEditor.anchorNode}>
                  {hideObjectBrowserPicker === false && (
                    <Button.Group>
                      <Button
                        aria-label={intl.formatMessage(messages.pickAnImage)}
                        icon
                        basic
                        onClick={(e) => {
                          onFocus && onFocus();
                          e.preventDefault();
                          openObjectBrowser({
                            mode: objectBrowserPickerType,
                            onSelectItem: isRelationChoice
                              ? (url, item) => {
                                  // we save the whole item if it's a relation choice
                                  onChange(props.id, item);
                                }
                              : onSelectItem
                                ? onSelectItem
                                : // else we save the url along with the image field and scales
                                  (
                                    url,
                                    { title, image_field, image_scales },
                                  ) => {
                                    onChange(props.id, flattenToAppURL(url), {
                                      title,
                                      image_field,
                                      image_scales,
                                    });
                                  },
                            currentPath: contextUrl,
                          });
                        }}
                        type="button"
                      >
                        <Icon name={navTreeSVG} size="24px" />
                      </Button>
                    </Button.Group>
                  )}
                  {restrictFileUpload === false && (
                    <Button.Group>
                      <Button
                        aria-label={intl.formatMessage(messages.uploadAnImage)}
                        icon
                        basic
                        compact
                        onClick={() => {
                          imageUploadInputRef.current.click();
                        }}
                        type="button"
                      >
                        <Icon name={uploadSVG} size="24px" />
                      </Button>
                      <input
                        {...getInputProps({
                          type: 'file',
                          ref: imageUploadInputRef,
                          onChange: handleUpload,
                          style: { display: 'none' },
                          accept: 'image/*',
                        })}
                      />
                    </Button.Group>
                  )}

                  {hideLinkPicker === false && (
                    <Button.Group>
                      <Button
                        icon
                        basic
                        aria-label={intl.formatMessage(messages.linkAnImage)}
                        onClick={(e) => {
                          !props.selected && onFocus && onFocus();
                          linkEditor.show();
                        }}
                        type="button"
                      >
                        <Icon name={linkSVG} circled size="24px" />
                      </Button>
                    </Button.Group>
                  )}
                </div>
                {linkEditor.anchorNode && (
                  <linkEditor.LinkEditor
                    value={imageValue}
                    placeholder={
                      placeholderLinkInput ||
                      intl.formatMessage(messages.linkAnImage)
                    }
                    objectBrowserPickerType={objectBrowserPickerType}
                    onChange={(_, e) => {
                      onSubmitURL(e);
                      // onChange(
                      //   props.id,
                      //   isInternalURL(e) ? flattenToAppURL(e) : e,
                      //   {},
                      // );
                    }}
                    id={id}
                  />
                )}
              </div>
            </Message>
          </div>
        )}
      </Dropzone>
    </div>
  );
};

export const ImageInput = compose(
  // This HOC goes first because it injects block in case that it's not present (not a block, but a DX field)
  withObjectBrowser,
  connect(
    (state, ownProps) => {
      const requestId = `image-upload-${ownProps.id}`;
      return {
        request: state.content.subrequests[ownProps.block || requestId] || {},
        content: state.content.subrequests[ownProps.block || requestId]?.data,
      };
    },
    { createContent, searchContent },
  ),
)(UnconnectedImageInput);

const ImageUploadWidget = (props) => {
  const { fieldSet, id, title } = props;
  return (
    <FormFieldWrapper
      {...props}
      columns={1}
      className="block image-upload-widget"
    >
      <div className="wrapper">
        <label
          id={`fieldset-${fieldSet}-field-label-${id}`}
          htmlFor={`field-${id}`}
        >
          {title}
        </label>
      </div>
      <ImageInput {...props} />
    </FormFieldWrapper>
  );
};

export default ImageUploadWidget;
