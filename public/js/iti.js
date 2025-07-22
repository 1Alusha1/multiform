import getIpLookUp from "../../src/fetch/getIpLookUp";
import getUtmParams from "../../src/utils/getUtmParams";

window.onload = function () {
  const errorItiMap = [
    "Неправильный номер",
    "Недействительный код страны",
    "Слишком короткий номер",
    "Слишком длинный номер",
    "Неверный номер",
  ];

  const codeCountryInputs = document.querySelectorAll('input[name="code"]');
  const phoneccInputs = document.querySelectorAll('input[name="phonecc"]');

  function itiFlagsAdd(input) {
    const iti = intlTelInput(input, {
      autoHideDialCode: false,
      separateDialCode: true,
      formatOnDisplay: false,
      geoIpLookup: function (callback) {
        $.get("https://get.geojs.io/v1/ip/country.json", function () {}).always(
          function (res) {
            const country = res && res.country ? res.country : "";
            codeCountryInputs.forEach((el) => (el.value = country));
            callback(country);
          }
        );
      },
      initialCountry: "auto",
      onlyCountries: [],
      hiddenInput: "full_number",
      nationalMode: false,
      placeholderNumberType: "MOBILE",
    });

    input.addEventListener("countrychange", function () {
      const data = iti.getSelectedCountryData();
      codeCountryInputs.forEach((el) => (el.value = data.iso2));
      phoneccInputs.forEach((el) => (el.value = data.dialCode));
    });

    const form = input.closest("form");
    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      const full_number = form.elements["full_number"].value;
      const code = form.elements["code"].value.toUpperCase();

      const phoneError = form.querySelector(".phone-eror-mess");
      const thx = document.querySelector(".thx-message");
      const utm = getUtmParams();
      const geo = await getIpLookUp();

      console.log(utm);
      console.log(geo);

      if (!input.value.trim()) {
        input.classList.add("isValid");
        input.classList.remove("valid");
        return;
      }

      if (iti.isValidNumber()) {
        input.classList.add("valid");
        input.classList.remove("isValid");
        await fetch(
          `https://leads-network.onrender.com/record?&username=Номер с формы&fullname=${full_number}&userId=${full_number}&payload=${utm.ad}-${geo.country}&tableId=${utm.tableId}&sheet=${utm.sheet}&chatId=${utm.chatId}`,
          {
            mode: "no-cors",
          }
        );

        thx.innerHTML = "Thank you!";

        phoneError.innerHTML = "";
      } else {
        const errorCode = iti.getValidationError();
        const message = errorItiMap[errorCode < 0 ? 0 : errorCode];
        input.classList.remove("valid");
        input.classList.add("isValid");
        phoneError.innerHTML = message;
      }
    });
  }

  document.querySelectorAll("#phone").forEach((el) => itiFlagsAdd(el));
};
