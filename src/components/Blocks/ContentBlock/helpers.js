export const getViewMore = (data) =>
  typeof data.link === 'string' ? data.link : data?.link?.[0]?.getURL;

export const getLinks = (data) =>
  data.links
    ?.filter((item) => {
      return item.link && item.link[0] && item.title;
    })
    .map((item) => {
      const url = item.link[0].getURL;
      return { title: item.title, url: url };
    });
