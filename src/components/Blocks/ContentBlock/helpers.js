export const getViewMore = (data) =>
  typeof data.url === 'string' ? data.url : data?.url?.[0]?.getURL;

export const getLinks = (data) =>
  data.links
    ?.filter((item) => {
      return item.url && item.url[0] && item.title;
    })
    .map((item) => {
      const url = item.url[0].getURL;
      return { title: item.title, url: url };
    });
