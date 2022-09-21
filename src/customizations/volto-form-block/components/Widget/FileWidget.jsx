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
import { readAsDataURL } from 'promise-file-reader';
import PropTypes from 'prop-types';
import React from 'react';
import { defineMessages, injectIntl, useIntl } from 'react-intl';
import { Button, Dimmer, Image } from 'semantic-ui-react';

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
      debugger;
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
  if (required) {
    attributes.required = true;
    attributes['aria-required'] = true;
  }

  const isInvalid = invalid === true || invalid === 'true';
  if (isInvalid) {
    attributes['aria-invalid'] = true;
  }

  const inputId = `field-${id}`;

  return (
    <FormFieldWrapper {...props} wrapped={false}>
      {/* <div className="nsw-form__group">
        <label className="nsw-form__label" htmlFor={inputId}>
          {title}
        </label>
        {description ? (
          <span className="nsw-form__helper" id={`${id}-helper-text`}>
            {description}
          </span>
        ) : null}
        <input
          className="nsw-form__file-input"
          type="file"
          id={inputId}
          name={id}
          required={required ? true : null}
          aria-required={required ? true : null}
          aria-invalid={isInvalid ? true : null}
          ref={node}
          onChange={({ target }) => {
            const upload = target.value;
            let file = {
              data: null,
              encoding: null,
              'content-type': null,
              filename: null,
            };
            for (let i = 0; i < upload.length; i++) {
              new FileUpload(imgs[i], imgs[i].file);
            }
            onChange(id, {
              data: fields[3],
              encoding: fields[2],
              'content-type': fields[1],
              filename: file.name,
            });
          }}
        />
      </div> */}
      <Dropzone onDrop={onDrop}>
        {({ getRootProps, getInputProps, isDragActive }) => (
          <div className="file-widget-dropzone" {...getRootProps()}>
            {isDragActive && <Dimmer active></Dimmer>}
            {fileType ? (
              <Image
                className="image-preview"
                id={`field-${id}-image`}
                size="small"
                src={imgsrc}
              />
            ) : (
              <div className="dropzone-placeholder">
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

            <label className="label-file-widget-input">
              {value
                ? intl.formatMessage(messages.replaceFile)
                : intl.formatMessage(messages.addNewFile)}
            </label>
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
      <div className="field-file-name">
        {value && value.filename}
        {value && (
          <Button
            icon
            basic
            className="delete-button"
            aria-label="delete file"
            onClick={() => {
              onChange(id, null);
              setFileType(false);
            }}
          >
            <Icon name={deleteSVG} size="20px" />
          </Button>
        )}
      </div>
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
