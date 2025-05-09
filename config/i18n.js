import { I18n } from "i18n";
import path from "path";
import constants from "../utils/constants.js";

const lang = constants.CONST_RESP_LANG_COLLECTION;

const i18n = new I18n({
    locales: lang,
    defaultLocale: lang[0],
    directory: path.join('./', 'language')
});

export default i18n;