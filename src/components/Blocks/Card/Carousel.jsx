import { CardCarousel } from 'nsw-design-system-plone6/components/Components/CardCarousel';

export function CardCarouselGridLayout({ data }) {
  return (
    <CardCarousel
      title={data.headline}
      cards={data.columns?.map((column) => {
        return {
          ...column,
          data: column,
        };
      })}
      mode={data.mode}
    />
  );
}
