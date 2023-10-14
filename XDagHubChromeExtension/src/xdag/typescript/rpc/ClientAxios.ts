import axios, { AxiosResponse } from 'axios';

export class ClientAxios
{
	#url: string;

	constructor( url: string ) {
		this.#url = url
	}

	async request( postBody: object | any[] ): Promise<any> {
		const response = await axios.post<{ result: string }>( this.#url, postBody )
		return response?.data??{};
	}

}
