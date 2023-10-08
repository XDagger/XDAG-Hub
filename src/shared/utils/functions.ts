import { useEffect } from "react";
import Browser from "webextension-polyfill";
import { useAppSelector } from "_hooks";
import { fromB64, toB64 } from "_src/xdag/bcs";

export const MAIN_UI_URL = Browser.runtime.getURL( "ui.html" );
export function openInNewTab() {
	return Browser.tabs.create( { url: MAIN_UI_URL } );
}


export function isValidUrl( url: string | null ) {
	if ( !url ) {
		return false;
	}
	try {
		new URL( url );
		return true;
	} catch ( e ) {
		return false;
	}
}

export function getDAppUrl( appUrl: string ) {
	const url = new URL( appUrl );
	return url;
}

export function getValidDAppUrl( appUrl: string ) {
	try {
		return getDAppUrl( appUrl );
	} catch ( error ) {
		/* empty */
	}
	return null;
}

export function prepareLinkToCompare( link: string ) {
	let adjLink = link.toLowerCase();
	if ( !adjLink.endsWith( "/" ) ) {
		adjLink += "/";
	}
	return adjLink;
}

export function toSearchQueryString( searchParams: URLSearchParams ) {
	const searchQuery = searchParams.toString();
	if ( searchQuery ) {
		return `?${ searchQuery }`;
	}
	return "";
}

export function toUtf8OrB64( message: string | Uint8Array ) {
	const messageBytes = typeof message === "string" ? fromB64( message ) : message;
	let messageToReturn: string =
		typeof message === "string" ? message : toB64( message );
	let type: "utf8" | "base64" = "base64";
	try {
		messageToReturn = new TextDecoder( "utf8", { fatal: true } ).decode(
			messageBytes,
		);
		type = "utf8";
	} catch ( e ) {
		// do nothing
	}
	return {
		message: messageToReturn,
		type,
	};
}

