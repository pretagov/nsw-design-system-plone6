export const getViewMore = (data) =>
  (data?.viewMore && data.viewMore[0] && data.viewMore[0].getURL) || null;

export const getLinks = (data) =>
  data.links
    ?.filter((item) => {
      return item.link && item.link[0] && item.title;
    })
    .map((item) => {
      const url = item.link[0].getURL;
      return { title: item.title, url: url };
    });
