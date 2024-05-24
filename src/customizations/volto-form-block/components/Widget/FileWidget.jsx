/**
 * FileWidget component.
 * @module components/manage/Widgets/FileWidget
 * added aria- attributes
 */

import '../../custom/file-input.css';

import loadable from '@loadable/component';
import { FormFieldWrapper, Icon } from '@plone/volto/components';
import { flattenToAppURL } from '@plone/volto/helpers';
import deleteSVG from '@plone/volto/icons/delete.svg';
import cx from 'classnames';
import { readAsDataURL } from 'promise-file-reader';
import PropTypes from 'prop-types';
import React from 'react';
import { defineMessages, injectIntl, useIntl } from 'react-intl';
import { Button, Dimmer, Image } from 'semantic-ui-react';

import { ErrorMessage } from 'nsw-design-system-plone6/components/Components/Form/ErrorMessage';

const imageMimetypes = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/jpg',
  'image/gif',
  'image/svg+xml',
];

const Dropzone = loadable(() => import('react-dropzone'));

const messages = defineMessages({
  releaseDrag: {
    id: 'Drop files here ...',
    defaultMessage: 'Drop files here ...',
  },
  editFile: {
    id: 'Drop file here to replace the existing file',
    defaultMessage: 'Drop file here to replace the existing file',
  },
  fileDrag: {
    id: 'Drop file here to upload a new file',
    defaultMessage: 'Drop file here to upload a new file',
  },
  replaceFile: {
    id: 'Replace existing file',
    defaultMessage: 'Replace existing file',
  },
  addNewFile: {
    id: 'Choose a file',
    defaultMessage: 'Choose a file',
  },
});

/**
 * FileWidget component class.
 * @function FileWidget
 * @returns {string} Markup of the component.
 *
 * To use it, in schema properties, declare a field like:
 *
 * ```jsx
 * {
 *  title: "File",
 *  widget: 'file',
 * }
 * ```
 * or:
 *
 * ```jsx
 * {
 *  title: "File",
 *  type: 'object',
 * }
 * ```
 *
 */
const FileWidget = (props) => {
  const {
    id,
    value,
    title,
    description,
    node,
    onChange,
    required,
    invalid,
    error = [],
  } = props;
  const [fileType, setFileType] = React.useState(false);
  const intl = useIntl();

  React.useEffect(() => {
    if (value && imageMimetypes.includes(value['content-type'])) {
      setFileType(true);
    }
  }, [value]);

  const imgsrc = value?.download
    ? `${flattenToAppURL(value?.download)}?id=${Date.now()}`
    : null || value?.data
    ? `data:${value['content-type']};${value.encoding},${value.data}`
    : null;

  /**
   * Drop handler
   * @method onDrop
   * @param {array} files File objects
   * @returns {undefined}
   */
  const onDrop = (files) => {
    const file = files[0];
    readAsDataURL(file).then((data) => {
      const fields = data.match(/^data:(.*);(.*),(.*)$/);
      onChange(id, {
        data: fields[3],
        encoding: fields[2],
        'content-type': fields[1],
        filename: file.name,
      });
    });

    let reader = new FileReader();
    reader.onload = function () {
      const fields = reader.result.match(/^data:(.*);(.*),(.*)$/);
      if (imageMimetypes.includes(fields[1])) {
        setFileType(true);
        let imagePreview = document.getElementById(`field-${id}-image`);
        imagePreview.src = reader.result;
      } else {
        setFileType(false);
      }
    };
    reader.readAsDataURL(files[0]);
  };

  let attributes = {};

  const isInvalid = invalid === true || invalid === 'true' || error.length > 0;

  const inputId = `field-${id}`;

  return (
    <FormFieldWrapper id={inputId} title={title} wrapped={false}>
      <Dropzone onDrop={onDrop}>
        {({ getRootProps, getInputProps, isDragActive }) => (
          <div
            className="file-widget-dropzone nsw-form__group"
            {...getRootProps()}
          >
            <label
              className={cx('nsw-form__label', {
                'nsw-form__required': required,
              })}
              htmlFor={inputId}
            >
              {title}
              {required ? <span className="sr-only"> (required)</span> : null}
            </label>
            {description ? (
              <span className="nsw-form__helper" id={`${id}-helper-text`}>
                {description}
              </span>
            ) : null}
            {isDragActive && <Dimmer active></Dimmer>}
            {fileType ? (
              <Image
                className="image-preview"
                id={`field-${id}-image`}
                size="small"
                src={imgsrc}
              />
            ) : (
              <div
                className="dropzone-placeholder"
                style={{
                  borderColor: 'var(--nsw-brand-primary)',
                  marginTop: '0',
                }}
              >
                {isDragActive ? (
                  <p className="dropzone-text">
                    {intl.formatMessage(messages.releaseDrag)}
                  </p>
                ) : value ? (
                  <p className="dropzone-text">
                    {intl.formatMessage(messages.editFile)}
                  </p>
                ) : (
                  <p className="dropzone-text">
                    {intl.formatMessage(messages.fileDrag)}
                  </p>
                )}
              </div>
            )}

            <div className="">{value && value.filename}</div>
            {isInvalid ? (
              <ErrorMessage inputId={inputId} message={error[0]} />
            ) : null}
            <button type="button" className="nsw-button nsw-button--dark">
              {value
                ? intl.formatMessage(messages.replaceFile)
                : intl.formatMessage(messages.addNewFile)}
            </button>
            <input
              {...getInputProps({
                type: 'file',
                style: { display: 'none' },
              })}
              id={`field-${id}`}
              name={id}
              type="file"
              {...attributes}
            />
          </div>
        )}
      </Dropzone>
    </FormFieldWrapper>
  );
};

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
FileWidget.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  required: PropTypes.bool,
  error: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func.isRequired,
  wrapped: PropTypes.bool,
};

/**
 * Default properties.
 * @property {Object} defaultProps Default properties.
 * @static
 */
FileWidget.defaultProps = {
  description: null,
  required: false,
  error: [],
  value: null,
};

export default injectIntl(FileWidget);
