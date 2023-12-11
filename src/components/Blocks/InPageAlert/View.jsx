import { InPageAlert } from 'nsw-design-system-plone6/components/Components/InPageAlert';

const InPageAlertView = ({ data }) => {
  return (
    <InPageAlert
      alertType={data.alertType}
      content={data.body?.data}
      isCompact={data.isCompact}
      includeMargin={true}
    />
  );
};

export default InPageAlertView;
