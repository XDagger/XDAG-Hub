import { Link } from "react-router-dom";
import { Heading } from "_app/shared/heading";
import { Text } from "_app/shared/text";
import { Add16, Download16 } from "_assets/icons/tsIcons";
import { useTranslation } from "react-i18next";

const SelectPage = () => {

	const { t } = useTranslation();

	const selections = [
		{
			title: t( "SelectPage.title1" ),
			desc: t( "SelectPage.desc1" ),
			url: "../create",
			action: t( "SelectPage.action1" ),
			icon: <Add16 className="font-semibold"/>,
		},
		{
			title: t( "SelectPage.title2" ),
			desc: t( "SelectPage.desc2" ),
			url: "../import",
			action: t( "SelectPage.action2" ),
			icon: <Download16 className="font-semibold"/>,
		},
	];

	return (
		<>
			<Heading variant="heading1" color="gray-90" as="h2" weight="bold">
				{ t( "SelectPage.heading" ) }
			</Heading>
			<div className="flex flex-col flex-nowrap gap-7.5 mt-7">
				{ selections.map( ( aSelection ) => (
					<div className={ "bg-xdag-lightest flex flex-col flex-nowrap items-center gap-3 text-center rounded-15 py-10 px-7.5 max-w-popup-width shadow-wallet-content" }
							 key={ aSelection.url }>
						<Heading
							variant="heading3"
							color="gray-90"
							as="h3"
							weight="semibold"
						>
							{ aSelection.title }
						</Heading>
						<Text variant="pBody" color="gray-85" weight="medium">
							{ aSelection.desc }
						</Text>

						<Link
							to={ aSelection.url }
							className={
								"mt-3.5 flex flex-nowrap items-center justify-center bg-hero-dark text-white !rounded-xl py-3.75 px-5 w-full gap-2.5 no-underline font-semibold text-body hover:bg-hero"
							}
						>
							{ aSelection.icon }
							{ aSelection.action }
						</Link>
					</div>
				) ) }
			</div>
		</>
	);
};

export default SelectPage;
