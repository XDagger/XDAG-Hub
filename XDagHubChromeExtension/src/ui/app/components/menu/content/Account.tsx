import { Disclosure, Transition } from "@headlessui/react";
import { cx } from "class-variance-authority";
import { AccountActions } from "./AccountActions";
import { AccountBadge } from "../../AccountBadge";
import { ChevronDown16, Copy16 } from "_assets/icons/tsIcons";
import { type SerializedAccount } from "_src/background/keyring/Account";
import { useCopyToClipboard } from "_src/ui/app/hooks/useCopyToClipboard";
import { Text } from "_src/ui/app/shared/text";
import { formatAddress } from "_src/xdag/typescript/utils";
import { useTranslation } from "react-i18next";

export type AccountProps = {
	account: SerializedAccount;
};

export function Account( { account }: AccountProps ) {
	const { address, type } = account;
	const { t } = useTranslation()
	const copyCallback = useCopyToClipboard( address, {
		copySuccessMessage: t( "Account.AddressCopied" ),
	} );

	return (
		<Disclosure>
			{ ( { open } ) => (
				<div
					className={ cx(
						"transition flex flex-col flex-nowrap border border-solid rounded-2xl hover:bg-gray-40",
						open
							? "bg-gray-40 border-transparent"
							: "hover:border-steel border-gray-60",
					) }
				>
					<Disclosure.Button
						as="div"
						className="flex flex-nowrap items-center px-5 py-3 self-stretch cursor-pointer gap-3 group"
					>
						<div className="transition flex flex-1 gap-3 justify-start items-center text-steel-dark group-hover:text-steel-darker ui-open:text-steel-darker min-w-0">
							<div className="overflow-hidden flex flex-col gap-1">
								<Text
									mono
									variant="body"
									weight="semibold"
								>
									{ formatAddress( address ) }
								</Text>
							</div>
							<AccountBadge accountType={ type }/>
						</div>
						<Copy16
							onClick={ copyCallback }
							className="transition text-base leading-none text-gray-60 active:text-gray-60 group-hover:text-hero-darkest cursor-pointer"
						/>
						<ChevronDown16 className="transition text-base leading-none text-gray-60 ui-open:rotate-180 ui-open:text-hero-darkest group-hover:text-hero-darkest"/>
					</Disclosure.Button>
					<Transition
						enter="transition duration-100 ease-out"
						enterFrom="transform opacity-0"
						enterTo="transform opacity-100"
						leave="transition duration-75 ease-out"
						leaveFrom="transform opacity-100"
						leaveTo="transform opacity-0"
					>
						<Disclosure.Panel className="px-5 pb-4">
							<AccountActions account={ account }/>
						</Disclosure.Panel>
					</Transition>
				</div>
			) }
		</Disclosure>
	);
}
