const getIpLookUp = async () => {
  const res = await fetch("https://get.geojs.io/v1/ip/country.json");

  const { country, ip } = await res.json();

  return { country, ip };
};
