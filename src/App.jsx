import { useEffect, useState } from "react";
import avatar from "../src/assets/crown2.jpg";
import tg from "../src/assets/icons/tg.svg";
import wa from "../src/assets/icons/whatsApp.svg";
import sessionId from "./utils/sessionId";
import getUtmParams from "./utils/getUtmParams";
import getIpLookUp from "./fetch/getIpLookUp";
import saveHash from "./fetch/saveHash";

function App() {
  const [country, setCountry] = useState({
    country: "",
    ip: "",
  });
  const [utm, setUtm] = useState({
    ad: "",
    bot: "",
    sheet: "",
    tableId: "",
    split: false,
    chatId: "",
  });
  const [session, setSession] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const session = sessionId(6);
      const utm = getUtmParams();
      const geo = await getIpLookUp();

      setCountry(geo);
      setUtm(utm);
      setSession(session);
    };
    fetchData();
  }, []);
  const tgHendller = (e) => {
    e.preventDefault();
    fbq('track', 'Lead');
    if (Boolean(utm.split) === true) {
      const splitedAccs = utm.bot.split("-");
      const randomAcc =
        splitedAccs[Math.floor(Math.random() * splitedAccs.length)];
      return (window.location.href = `tg://resolve?domain=${randomAcc}&start=${utm.ad}-${country.country}`);
    }
    window.location.href = `tg://resolve?domain=${utm.bot}&start=${utm.ad}-${country.country}`;
  };
  const waHendller = async (e) => {
    e.preventDefault();

    await saveHash(
      utm.ad,
      country.country,
      session,
      utm.sheet,
      utm.tableId,
      utm.chatId
    );

    await saveHash(utm.ad, country.country, session, utm.sheet, utm.tableId,utm.chatId);
    fbq("track", "Lead");
    window.location.href =
      "https://api.whatsapp.com/send/?phone=6283115600982&text=" +
      `Hi! Send this personal code and we will contact you soon - start_${session}`;
  };

  return (
    <>
      <div className="container">
        <div className="header">
          <img src={avatar} alt="" className="avatar" />
          <h1>FX Dealers</h1>
          <h3 className="center">Contact us in one of the messengers:</h3>
        </div>
        <form id="form" className="form">
          <div className="form-control">
            <button
              className="hendlebutton tg"
              onClick={tgHendller}
              data-platform="telegram"
            >
              <span className="btn-icon">
                <img src={tg} alt="Telegram icon" />
              </span>
              <span className="main-content-btn">Telegram</span>
            </button>
          </div>
          <div className="form-control">
            <button
              className="hendlebutton wa"
              onClick={waHendller}
              data-platform="whatsapp"
            >
              <span className="btn-icon">
                <img src={wa} alt="WhatsApp icon" />
              </span>
              <span className="main-content-btn"> WhatsApp</span>
            </button>
          </div>
          {/* <div className="error-message"></div>
          <button className="thx-message" type="submit">
            Submit
          </button> */}
        </form>
        <div className="privacy">
          <a href="https://trafficg-privacy.netlify.app/" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
        </div>
      </div>
    </>
  );
}

export default App;
