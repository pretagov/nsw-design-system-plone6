/**
 * Shadowed from "@kitconcept/volto-blocks-grid@5.2.0"
 * Added "data" prop (passed in from customised "Edit" component)
 * Changed "maxNumberOfColumns" to check current variation before falling back to __grid
 */
import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { Button, Grid, Message, Image } from 'semantic-ui-react';
import config from '@plone/volto/registry';

const TemplateChooser = ({ templates, onSelectTemplate, data }) => {
  const intl = useIntl();
  var maxNumberOfColumns =
    config.blocks.blocksConfig[data?.['@type']]?.maxNumberOfColumns ||
    config.blocks.blocksConfig.__grid.maxNumberOfColumns;
  var selectableTemplates = templates(intl).filter(
    (template) => template.columns.length < maxNumberOfColumns + 1,
  );

  return (
    <div className="template-chooser">
      <Message>
        <Grid
          columns={
            selectableTemplates.length < 9 ? selectableTemplates.length : 8
          }
        >
          {selectableTemplates.map((template, index) => (
            <Grid.Column key={template.id}>
              <Button
                className="template-chooser-item"
                onClick={() => onSelectTemplate(index)}
              >
                <Image src={template.image} alt="" />
                <div className="template-chooser-title">
                  {intl.formatMessage({
                    id: template.id,
                    defaultMessage: template.title,
                  })}
                </div>
              </Button>
            </Grid.Column>
          ))}
        </Grid>
      </Message>
    </div>
  );
};

TemplateChooser.propTypes = {
  templates: PropTypes.func.isRequired,
  onSelectTemplate: PropTypes.func.isRequired,
};

export default TemplateChooser;
