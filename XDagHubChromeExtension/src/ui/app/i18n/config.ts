import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import cnTranslation from './cn/translation.json';
import enTranslation from './en/translation.json';
import frTranslation from './fr/translation.json';
import geTranslation from './ge/translation.json';
import inTranslation from './in/translation.json';
import itTranslation from './it/translation.json';
import rsTranslation from './rs/translation.json';
import araTranslation from './ara/translation.json';
import jpTranslation from './jp/translation.json';
import krTranslation from './kr/translation.json';
import brTranslation from './br/translation.json';
import Browser from "webextension-polyfill";

export const supportLanguages:Record<string, string> = {
	"follow": "followSystem",
	"en": "English",
	"cn": "简体中文",
	"fr": "Français",
	"rs": "Pусский",
	"in": "हिन्दी",
	"it": "Italiano",
	"ge": "Deutsch",
	"ara": "العربية",
	"jp": "日本語",
	"kr": "한국어",
	"br": "Português"
};


// 存储字符串值
export const setActiveLanguage = async ( language: string ) => {
	await Browser.storage.local.set( {
		activeLanguage: language
	} );
}

// 获取字符串值
export const getActiveLanguage = async ( language: string ) => {
	const { activeLanguage } = await Browser.storage.local.get( {
		activeLanguage: "en"
	} );
}


await i18next
	.use( initReactI18next )
	.init( {
		lng: "en", // if you're using a language detector, do not define the lng option
		debug: true,
		resources: {
			cn: { translation: cnTranslation },
			en: { translation: enTranslation },
			fr: { translation: frTranslation },
			ge: { translation: geTranslation },
			in: { translation: inTranslation },
			it: { translation: itTranslation },
			rs: { translation: rsTranslation },
			ara: { translation: araTranslation },
			jp: { translation: jpTranslation },
			kr: { translation: krTranslation },
			br: { translation: brTranslation },
		},
		// if you see an error like: "Argument of type 'DefaultTFuncReturn' is not assignable to parameter of type xyz"
		// set returnNull to false (and also in the i18next.d.ts options)
		// returnNull: false,
	} );
// i18next.changeLanguage('cn')
// i18next.language



