export default () => {
  var params = new URLSearchParams(window.location.search);

  var utmParams = {
    ad: params.get("ad"),
    pixel: params.get("pixel"),
    bot: params.get("bot"),
    sheet: params.get("sheet"),
    tableId: params.get("tableId"),
    split: params.get("split"),
  };

  Object.keys(utmParams).forEach((key) => {
    if (!utmParams[key]) {
      delete utmParams[key];
    }
  });

  return utmParams;
};
