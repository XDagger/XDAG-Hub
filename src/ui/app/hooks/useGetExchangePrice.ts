import { useQuery } from "@tanstack/react-query";
import axios from 'axios';
import { useEffect, useState } from "react";

export function useGetExchagePrice( apiString: string ) {

	const [ apiData, setApiData ] = useState()

	const { data, isLoading, isError, isRefetching } = useQuery( {
		queryKey: [ "transactions-by-apiString", apiString ],
		queryFn: async () => {
			const response = await axios.get( apiString );
			return response.data
		},
		enabled: true,
		retry: 2,
		refetchInterval: 10 * 1000,
	} );

	useEffect( () => {
		setApiData( data );
	}, [ data ] )


	return apiData
}
