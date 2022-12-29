import { InPageAlert } from 'nsw-design-system-plone6/components/Components/InPageAlert';

export function AnnouncementBarView({ data, isEditMode }) {
  return (
    <InPageAlert
      alertType="chevron_right"
      content={data.body?.data}
      includeMargin={true}
      includeContainer={true}
      isCompact={data.isCompact}
      colour={data.colour}
    />
  );
}
