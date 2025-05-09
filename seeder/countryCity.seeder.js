import path from "path";
import countryModel from "../models/country.model.js";
import cityModel from "../models/city.model.js";
import fs from "fs";
export async function seedCountryCityData() {
  try {
    let counterCountry = await countryModel.countDocuments();
    let counterCity = await cityModel.countDocuments();
    if (counterCountry == 0 || counterCity == 0) {
      const countryPath = path.join("./public/uploads/countries.json");
      const cityPath = path.join("./public/uploads/cities.json");

      if (counterCountry == 0) {
        const jsonCountry = fs.readFileSync(countryPath);
        const parseCountry = JSON.parse(jsonCountry);
        let countryArray = [];
        parseCountry.forEach((element) => {
          countryArray.push({
            countryId: element.id,
            countryCode: element.iso2,
            name: element.name,
            phoneCode: element.phone_code,
            currency: element.currency,
            symbol: element.currency_symbol,
          });
        });
        if (countryArray.length > 0) {
          await countryModel.insertMany(countryArray);
        }
      }

      if (counterCity == 0) {
        const jsonCity = fs.readFileSync(cityPath);
        const parseCity = JSON.parse(jsonCity);

        let cityArray = [];
        let currentCountry;

        let currentCountryId = 0;
        if (parseCity.length > 0) {
          for (const city of parseCity) {
            let cityCountry = city.country_id;
            if (currentCountryId != cityCountry) {
              let getCountry = await countryModel.findOne({
                countryId: cityCountry,
              });
              currentCountry = getCountry._id;
              currentCountryId = getCountry.countryId;
            }
            cityArray.push({
              cityId: city.id,
              name: city.name,
              countryId: currentCountry,
            });

            if (cityArray.length == parseCity.length) {
              console.log("Done.....");
              await cityModel.insertMany(cityArray);
            }
          }
        }

       
      }
    } else {
      return;
    }
  } catch (error) {
    console.log("Error seeding data:", error);
  }
}
