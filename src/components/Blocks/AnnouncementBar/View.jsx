import { InPageAlert } from 'nsw-design-system-plone6/components/Components/InPageAlert';

const backgroundColourMapping = {
  dark: 'var(--nsw-brand-dark)',
  light: 'var(--nsw-brand-light)',
  supplementary: 'var(--nsw-brand-supplementary)',
  accent: 'var(--nsw-brand-accent)',
};
const textColourMapping = {
  dark: 'var(--nsw-text-light)',
  light: 'var(--nsw-text-dark)',
  supplementary: 'var(--nsw-text-light)',
  accent: 'var(--nsw-text-light)',
};
const iconColourMapping = {
  dark: 'var(--nsw-brand-accent)',
  light: 'var(--nsw-brand-accent)',
  supplementary: 'var(--nsw-palette-white)',
  accent: 'var(--nsw-palette-white)',
};

export function AnnouncementBarView({ data, isEditMode }) {
  return (
    <>
      <div
        className={`nsw-in-page-alert nsw-in-page-alert--${data.alertType}`}
        style={{
          marginTop: '0',
          borderLeft: '0',
          backgroundColor: backgroundColourMapping[data.colour],
          color: textColourMapping[data.colour],
        }}
      >
        <div
          style={{
            display: 'flex',
            marginInline: 'auto',
            width: '100%',
            maxWidth: 'var(--nsw-container-width)',
          }}
        >
          <span
            className="material-icons nsw-material-icons nsw-in-page-alert__icon"
            style={{ color: iconColourMapping[data.colour] }}
            focusable="false"
            aria-hidden="true"
          >
            chevron_right
          </span>
          <div
            className="nsw-in-page-alert__content"
            dangerouslySetInnerHTML={{ __html: data.body?.data }}
          ></div>
        </div>
      </div>

      <InPageAlert
        alertType="chevron_right"
        content={data.body?.data}
        includeMargin={true}
        includeContainer={true}
        isCompact={data.isCompact}
        colour={data.colour}
      />
    </>
  );
}
