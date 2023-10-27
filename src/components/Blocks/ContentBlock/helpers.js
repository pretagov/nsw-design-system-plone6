export const getViewMore = (data) => {
  if (data.url) {
    return typeof data.url === 'string' ? data.url : data?.url?.[0]?.getURL;
  } else if (data.link) {
    return typeof data.link === 'string' ? data.link : data?.link?.[0]?.getURL;
  }
};

export const getLinks = (data) =>
  data.links
    ?.filter((item) => {
      return (
        (item.url && item.url[0] && item.title) ||
        (item.link && item.link[0] && item.title)
      );
    })
    .map((item) => {
      const url = item.url[0].getURL || item.link[0].getURL;
      return { title: item.title, url: url };
    });
