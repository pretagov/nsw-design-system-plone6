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
  // imageDescription: {
  //   id: 'Schema_Image_Description',
  //   defaultMessage: 'Image',
  // },
  boxTitle: {
    id: 'Schema_Box_Title',
    defaultMessage: 'Display as box?',
  },
  boxDescription: {
    id: 'Schema_Box_Description',
    defaultMessage:
      'A box section will have rounded corners and a thin grey outline',
  },
  colourTitle: {
    id: 'Schema_Colour_Title',
    defaultMessage: 'Colour',
  },
  // colourDescription: {
  //   id: 'Schema_Colour_Description',
  //   defaultMessage: 'Colour',
  // },
  invertTitle: {
    id: 'Schema_Invert_Title',
    defaultMessage: 'Invert support?',
  },
  invertDescription: {
    id: 'Schema_Invert_Description',
    defaultMessage:
      'Enable if you want to use components and links inside the sections with dark background',
  },
  showSeparatorTitle: {
    id: 'Schema_ShowSeparator_Title',
    defaultMessage: 'Show separator?',
  },
  showSeparatorTitleDescription: {
    id: 'Schema_ShowSeparator_Description',
    defaultMessage: 'Enabling shows a horizontal separator after the section.',
  },
});

const sectionTypeFieldsMapping = {
  sameAsPrevious: [],
  colour: [
    'sectioninvert',
    'sectionspacing',
    // 'sectionbox',
    'sectionshowSeparator',
  ],
  image: [
    'sectionimage',
    'sectioninvert',
    'sectionspacing',
    // 'sectionbox',
    'sectionshowSeparator',
  ],
  box: [
    'sectioninvert',
    'sectionspacing',
    // 'sectionbox',
    'sectionshowSeparator',
  ],
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
        type: 'file',
        widget: 'file',
      },
      // sectionbox: {
      //   title: intl.formatMessage(messages.boxTitle),
      //   description: intl.formatMessage(messages.boxDescription),
      //   type: 'boolean',
      //   // default: false,
      // },
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
        // default: 'brand-light',
      },
      sectioninvert: {
        title: intl.formatMessage(messages.invertTitle),
        description: intl.formatMessage(messages.invertDescription),
        type: 'boolean',
        // default: false,
      },
      sectionshowSeparator: {
        title: intl.formatMessage(messages.showSeparatorTitle),
        description: intl.formatMessage(messages.showSeparatorTitleDescription),
        type: 'boolean',
        // default: false,
      },
    },
  };
};

export default sectionSchema;
