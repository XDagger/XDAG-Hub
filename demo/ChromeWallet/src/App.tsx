import { useState } from "react";
import Privacy from "./privacy/Privacy";
import WalletApi from "./walletApi";


const App = ()=>{

	const [pageName, setPageName] = useState<string>('privacy');
	return (
		<>
			<div className="w-full flex flex-col sm:flex-row flex-grow overflow-hidden">
				<div className="sm:w-1/3 md:1/4 w-full flex-shrink flex-grow-0 p-4">
					<div className="sticky top-0 p-4 bg-gray-100 rounded-xl w-full">
						<ul className="flex sm:flex-col overflow-hidden content-center justify-between">
							<li className="py-2 hover:bg-indigo-300 rounded">
								<a className="truncate" href="#" onClick={()=>{setPageName('privacy')}}>
									<img src="//cdn.jsdelivr.net/npm/heroicons@1.0.1/outline/home.svg" className="w-7 sm:mx-2 mx-4 inline"/>
									<span className="hidden sm:inline">Privacy Policy</span>
								</a>
							</li>
							<li className="py-2 hover:bg-indigo-300 rounded">
								<a className="truncate" href="#" onClick={()=>{setPageName('walletApi')}}>
									<img src="//cdn.jsdelivr.net/npm/heroicons@1.0.1/outline/cog.svg" className="w-7 sm:mx-2 mx-4 inline"/>
									<span className="hidden sm:inline">Wallet Api</span>
								</a>
							</li>
						</ul>
					</div>
				</div>
				<main role="main" className="w-full h-full flex-grow p-3 overflow-auto">
					{
						pageName==='privacy'&&(
								<Privacy></Privacy>
						)
					}
					{
						pageName==='walletApi'&&(
							<WalletApi></WalletApi>
						)
					}
				</main>
			</div>
			<footer className="bg-indigo-800 mt-auto"></footer>
		</>
	)
}


export default App