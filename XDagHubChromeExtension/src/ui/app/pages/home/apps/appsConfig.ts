import { apiImg, newsImg, walletImg, xDagImg } from '_assets/png'

export type XDagAppConfig = {
	name: string;
	description: string;
	link: string;
	icon: string;
	tags: string[];
};

export const xDagAppsConfigs: XDagAppConfig[] = [
	{
		"name": "nameXDagOffice",
		"description": "descriptionXDagOffice",
		"link": "https://xdag.io/",
		"icon": xDagImg,
		"tags": [ "Office" ]
	},
	{
		"name": "nameXDagCommunity",
		"description": "descriptionXDagCommunity",
		"link": "https://t.me/dagger_cryptocurrency",
		"icon": "https://communitiesdelegation.org/wp-content/uploads/2020/11/community-icon-768x768.png",
		"tags": [ "Office" ]
	},
	{
		"name": "nameXDagProWallet",
		"description": "descriptionXDagProWallet",
		"link": "https://github.com/XDagger/XDAG-Pro/releases",
		"icon": walletImg,
		"tags": [ "Office" ]
	},
	{
		"name": "nameXDagWalletApi",
		"description": "descriptionXDagWalletApi",
		"link": "https://mind-5.4everland.app",
		"icon": apiImg,
		"tags": [ "Wallet" ]
	},
	{
		"name": "nameXDagNews",
		"description": "descriptionXDagNews",
		"link": "https://medium.com/tag/xdag",
		"icon": newsImg,
		"tags": [ "Office" ]
	},
	{
		"name": "nameXDagFun",
		"description": "descriptionXDagFun",
		"link": "https://xdag.fun/",
		"icon": "https://help.libreoffice.org/latest/media/icon-themes/cmd/sc_outlineexpandall.svg",
		"tags": [ "Office" ]
	},
	{
		"name": "nameXDagMining",
		"description": "descriptionXDagMining",
		"link": "https://github.com/XDagger/xmrig2xdag",
		"icon": "https://img.freepik.com/premium-vector/mining-worker-cartoon_18591-38475.jpg?w=996",
		"tags": [ "Office" ]
	},
	{
		"name": "nameEasternFootballTeam",
		"description": "descriptionEasternFootballTeamByFoundation",
		"link": "http://easternsportsclub.com/",
		"icon": "https://cdn.footballkitarchive.com/2023/09/19/erKteYGfV6gziVB.jpg",
		"tags": [ "Foundation" ]
	}
]

export default xDagAppsConfigs;


