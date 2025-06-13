export default function parsePostman(collection) {
  const items = collection.item;
  const endpoints = [];

  const extractEndpoints = (items) => {
    items.forEach((item) => {
      if (item.item) {
        extractEndpoints(item.item);
      } else {
        const method = item.request.method;
        const url = item.request.url?.raw || "N/A";
        const body = item.request.body?.raw || null;

        endpoints.push({
          name: item.name,
          method,
          url,
          body,
        });
      }
    });
  };

  extractEndpoints(items);
  return endpoints;
}
