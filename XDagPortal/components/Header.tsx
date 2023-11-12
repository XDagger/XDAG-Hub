import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import Link from './Link'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import SearchButton from './SearchButton'
// import SvgXdag from '../public/static/TsIcons/Xdag'
import XDagPng from '../public/static/images/logoRmBg.png'
import Image from "@/components/Image";

const Header = () => {
    return (
        <header className="flex items-center justify-between py-10">
            <div>
                <Link href="/" aria-label={siteMetadata.headerTitle}>
                    <div className="flex items-center justify-between">
                        <div className="mr-3" style={{width: '60px', height: '60px'}}>
                            <Image alt="XDag" src={XDagPng} width={60} height={60}/>
                        </div>
                        {
                            typeof siteMetadata.headerTitle === 'string' ? (
                                <div className="hidden h-6 text-2xl font-semibold sm:block">
                                    {siteMetadata.headerTitle}
                                </div>
                            ) : (
                                siteMetadata.headerTitle
                            )
                        }
                    </div>
                </Link>
            </div>
            <div className="flex items-center leading-5 space-x-4 sm:space-x-6">
                {
                    headerNavLinks
                        .filter((link) => link.href !== '/')
                        .map((link) => (
                            <Link key={link.title} href={link.href} className="hidden sm:block font-medium text-gray-900 dark:text-gray-100">
                                {link.title}
                            </Link>
                        ))
                }
                <SearchButton/>
                <ThemeSwitch/>
                <MobileNav/>
            </div>
        </header>
    )
}

export default Header
