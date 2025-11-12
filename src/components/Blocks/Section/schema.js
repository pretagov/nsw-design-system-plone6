import config from '@plone/volto/registry';
import { defineMessages } from 'react-intl';

const messages = defineMessages({
  sectionTitleTitle: {
    id: 'Schema_Title_Title',
    defaultMessage: 'Title',
  },
  sectionDescriptionTitle: {
    id: 'Schema_Description_Title',
    defaultMessage: 'Description',
  },
  sectionTypeTitle: {
    id: 'Schema_SectionType_Title',
    defaultMessage: 'Section type',
  },
  sectionTypeDescription: {
    id: 'Schema_SectionType_Description',
    defaultMessage: '',
  },
  spacingTitle: {
    id: 'Schema_Spacing_Title',
    defaultMessage: 'Spacing',
  },
  spacingDescription: {
    id: 'Schema_Spacing_Description',
    defaultMessage: 'How much spacing should be around this section?',
  },
  imageTitle: {
    id: 'Schema_Image_Title',
    defaultMessage: 'Image',
  },
  colourTitle: {
    id: 'Schema_Colour_Title',
    defaultMessage: 'Colour',
  },
  invertTitle: {
    id: 'Schema_Invert_Title',
    defaultMessage: 'Display with inverted text?',
  },
});

const sectionTypeFieldsMapping = {
  sameAsPrevious: [],
  colour: ['sectioninvert', 'sectionspacing'],
  image: ['sectionimage', 'sectioninvert', 'sectionspacing'],
  box: ['sectioninvert', 'sectionspacing'],
};

export const sectionSchema = ({ intl, formData }) => {
  let sectionType = formData && formData.sectionType;

  if (sectionType && sectionType.startsWith('colour-')) {
    sectionType = 'colour';
  }

  return {
    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: [
          'title',
          'description',
          'sectionType',
          ...(sectionTypeFieldsMapping[sectionType] ?? []),
        ],
        required: ['sectionType'],
      },
    ],
    required: ['sectionType'],
    properties: {
      sectionType: {
        title: intl.formatMessage(messages.sectionTypeTitle),
        type: 'string',
        factory: 'Choice',
        choices: [
          ['', 'No section'],
          ['sameAsPrevious', 'Same as previous'],
          ['colour-brand-light', 'Light'],
          ['colour-brand-dark', 'Dark'],
          ['colour-brand-supplementary', 'Supplementary'],
          ['colour-black', 'Black'],
          ['colour-white', 'White'],
          ['colour-off-white', 'Off White'],
          ['colour-grey-01', 'Grey 01'],
          ['colour-grey-02', 'Grey 02'],
          ['colour-grey-03', 'Grey 03'],
          ['colour-grey-04', 'Grey 04'],
          ['image', 'Image'],
          ['box', 'Box'],
        ],
        default: '',
      },
      title: {
        title: intl.formatMessage(messages.sectionTitleTitle),
        type: 'string',
      },
      description: {
        title: intl.formatMessage(messages.sectionDescriptionTitle),
        type: 'string',
      },
      sectionspacing: {
        title: intl.formatMessage(messages.spacingTitle),
        description: intl.formatMessage(messages.spacingDescription),
        type: 'string',
        factory: 'Choice',
        choices: [
          ['full', 'Full spacing'],
          ['half', 'Half spacing'],
          ['no', 'No spacing'],
        ],
        placeholder: 'Full spacing',
      },
      sectionimage: {
        title: intl.formatMessage(messages.imageTitle),
        widget: config.widgets.widget.image ? 'image' : 'file',
      },
      sectioncolour: {
        title: intl.formatMessage(messages.colourTitle),
        type: 'string',
        factory: 'Choice',
        choices: [
          ['brand-light', 'Light'],
          ['brand-dark', 'Dark'],
          ['brand-supplementary', 'Supplementary'],
          ['brand-black', 'Black'],
          ['white', 'White'],
          ['off-white', 'Off White'],
          ['grey-01', 'Grey 01'],
          ['grey-02', 'Grey 02'],
          ['grey-03', 'Grey 03'],
          ['grey-04', 'Grey 04'],
        ],
      },
      sectioninvert: {
        title: intl.formatMessage(messages.invertTitle),
        type: 'boolean',
      },
    },
  };
};

export default sectionSchema;
