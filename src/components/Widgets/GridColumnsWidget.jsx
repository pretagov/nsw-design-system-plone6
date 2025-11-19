// Ripped from the ObjectListWidget and the actual accordion code replaced with the styling
import { DragDropList, FormFieldWrapper, Icon } from '@plone/volto/components';
import React from 'react';
import { defineMessages, useIntl } from 'react-intl';

import deleteSVG from '@plone/volto/icons/delete.svg';
import dragSVG from '@plone/volto/icons/drag.svg';

const messages = defineMessages({
  labelRemoveItem: {
    id: 'Remove item',
    defaultMessage: 'Remove item',
  },
  labelCollapseItem: {
    id: 'Collapse item',
    defaultMessage: 'Collapse item',
  },
  labelShowItem: {
    id: 'Show item',
    defaultMessage: 'Show item',
  },
  emptyObjectList: {
    id: 'Empty object list',
    defaultMessage: 'Empty object list',
  },
  add: {
    id: 'Add (object list)',
    defaultMessage: 'Add',
  },
});

export function GridColumnsWidget(props) {
  const { fieldSet, id, value = [], onChange } = props;

  const intl = useIntl();

  const topLayerShadow = '0 1px 1px rgba(0,0,0,0.15)';
  const secondLayer = ', 0 10px 0 -5px #eee, 0 10px 1px -4px rgba(0,0,0,0.15)';
  const thirdLayer = ', 0 20px 0 -10px #eee, 0 20px 1px -9px rgba(0,0,0,0.15)';

  return (
    <div className="objectlist-widget">
      <FormFieldWrapper {...props} noForInFieldLabel className="objectlist">
        {value.length === 0 && (
          <input
            aria-labelledby={`fieldset-${
              fieldSet || 'default'
            }-field-label-${id}`}
            type="hidden"
            value={intl.formatMessage(messages.emptyObjectList)}
          />
        )}
      </FormFieldWrapper>
      <DragDropList
        style={{
          boxShadow: `${topLayerShadow}${value.length > 1 ? secondLayer : ''}${
            value.length > 2 ? thirdLayer : ''
          }`,
        }}
        forwardedAriaLabelledBy={`fieldset-${
          fieldSet || 'default'
        }-field-label-${id}`}
        childList={value.map((o) => [o['id'], o])}
        onMoveItem={(result) => {
          const { source, destination } = result;
          if (!destination) {
            return;
          }

          const first = value[source.index];
          const second = value[destination.index];
          value[destination.index] = first;
          value[source.index] = second;

          onChange(id, value);
          return true;
        }}
      >
        {({ child, childId, index, draginfo }) => {
          const itemTitle = child.title ? child.title : `Column #${index + 1}`;
          return (
            <div
              ref={draginfo.innerRef}
              {...draginfo.draggableProps}
              key={childId}
            >
              <div className="accordion ui fluid styled">
                <div className="title">
                  <button
                    style={{
                      visibility: 'visible',
                      display: 'inline-block',
                    }}
                    {...draginfo.dragHandleProps}
                    className="drag handle"
                  >
                    <Icon name={dragSVG} size="18px" />
                  </button>
                  <div className="accordion-title-wrapper">{itemTitle}</div>
                  <div className="accordion-tools">
                    <button
                      aria-label={`${intl.formatMessage(
                        messages.labelRemoveItem,
                      )} ${itemTitle}`}
                      onClick={() => {
                        onChange(
                          id,
                          value.filter((v, i) => i !== index),
                        );
                      }}
                    >
                      <Icon name={deleteSVG} size="20px" color="#e40166" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        }}
      </DragDropList>
    </div>
  );
}
