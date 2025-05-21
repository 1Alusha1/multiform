export default async (ad, country, session, sheet, tableId) => {
  try {
    await fetch(
      `${
        import.meta.env.VITE_API_URL
      }/save-hash?advertisment=${ad}&geo=${country}&sessionId=${session}&sheet=${sheet}&tableId=${tableId}`,
      {
        mode: "no-cors",
      }
    );
  } catch (err) {
    if (err) console.log(err);
  }
};
