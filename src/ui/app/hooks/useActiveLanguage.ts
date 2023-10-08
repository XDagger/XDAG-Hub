import { useEffect, useState } from 'react';
import Browser from "webextension-polyfill";
import i18next from 'i18next';



const getLanguageFromChrome = (): string => {
	const chromeLanguage = Browser.i18n.getUILanguage()
	console.log(' language from chrome Setting:', chromeLanguage );
	let lan = "en";
	if ( chromeLanguage === "zh-CN" ) lan = "cn"
	return lan;
}


export const useActiveLanguage = (): string => {
	const key = "activeLanguage";
	const defaultValue = "en";
	const [ value, setValue ] = useState<string>( defaultValue );

	const updateValue = (newValue:string) =>{
		if ( newValue === "follow" ) {
			let lan = getLanguageFromChrome();
			i18next.changeLanguage(lan)
		}else{
			i18next.changeLanguage(newValue );
		}
		setValue(newValue);
	}

	useEffect( () => {
		Browser.storage.local.get( { activeLanguage: "follow" } ).then( ( result ) => {
			console.log( '...............:\n', result )
			updateValue(result[key])
		} )

		const listener = function ( changes: any, areaName: string ) {
			if ( areaName === 'local' && Object.prototype.hasOwnProperty.call( changes, key ) ) {
				const newValue = changes[ key ].newValue || defaultValue;
				updateValue(newValue);
			}
		};
		Browser.storage.onChanged.addListener( listener );

		return () => {
			Browser.storage.onChanged.removeListener( listener );
		};
	}, [] );

	return value;
}

