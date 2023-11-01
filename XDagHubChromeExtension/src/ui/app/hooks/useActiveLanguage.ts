import { useEffect, useState } from 'react';
import Browser from "webextension-polyfill";
import i18next from 'i18next';


const getLanguageFromChrome = (): string => {
	const chromeLanguage = Browser.i18n.getUILanguage();
	console.log( 'current language:', chromeLanguage );
	let lan = "en";
	if ( chromeLanguage.includes( 'en-' ) ) lan = "en";
	if ( chromeLanguage.includes( 'zh-' ) ) lan = "cn";
	if ( chromeLanguage.includes( 'ar' ) ) lan = "ara";
	if ( chromeLanguage.includes( 'fr' ) ) lan = "fr";
	if ( chromeLanguage.includes( 'ru' ) ) lan = "rs";
	if ( chromeLanguage.includes( 'hi' ) ) lan = "in";
	if ( chromeLanguage.includes( 'it' ) ) lan = "it";
	if ( chromeLanguage.includes( 'de' ) ) lan = "de";
	if ( chromeLanguage.includes( 'ja' ) ) lan = "jp";
	if ( chromeLanguage.includes( 'pt-' ) ) lan = "br";
	if ( chromeLanguage.includes( 'ko' ) ) lan = "kr";



	return lan;
}


export const useActiveLanguage = (): string => {
	const key = "activeLanguage";
	const defaultValue = "en";
	const [ value, setValue ] = useState<string>( defaultValue );

	const updateValue = ( newValue: string ) => {
		if ( newValue === "follow" ) {
			let lan = getLanguageFromChrome();
			i18next.changeLanguage( lan )
		} else {
			i18next.changeLanguage( newValue );
		}
		setValue( newValue );
	}

	useEffect( () => {
		Browser.storage.local.get( { activeLanguage: "follow" } ).then( ( result ) => {
			updateValue( result[ key ] )
		} )

		const listener = function ( changes: any, areaName: string ) {
			if ( areaName === 'local' && Object.prototype.hasOwnProperty.call( changes, key ) ) {
				const newValue = changes[ key ].newValue || defaultValue;
				updateValue( newValue );
			}
		};
		Browser.storage.onChanged.addListener( listener );

		return () => {
			Browser.storage.onChanged.removeListener( listener );
		};
	}, [] );

	return value;
}

