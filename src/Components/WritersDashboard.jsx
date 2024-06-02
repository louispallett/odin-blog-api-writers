import { BackgroundContainer, HeaderContainer, HeaderContainerInner } from './tailwind-containers';
import { Link, Outlet } from 'react-router-dom';

export default function WriterDashboard() {

    const handleLogOut = () => {
        localStorage.clear();
        window.location.assign("/dashboard/articles")
    }

    return (
        <BackgroundContainer>
            <HeaderContainer>
                <HeaderContainerInner>
                    <div className='flex flex-col'>
                        <Link to="/dashboard/articles" >
                            <h1 id="subtitle" className="relative font-jaro inset-y-3 inset-x-16 text-2xl sm:inset-x-20 sm:text-4xl font-black text-white">Singapore</h1>
                            <h1 id="main-title" className="text-2xl font-jaro sm:text-4xl font-black text-white">on-Thames</h1>
                        </Link>
                        <h1 id="subtitle" className="self-end font-jaro font-black text-white">Writers</h1>
                    </div>
                    <ul className="list flex items-center gap-2.5 sm:gap-5 font-bold sm:text-xl text-slate-100">
                        <Link to="/dashboard/articles">Home</Link>
                        <button onClick={handleLogOut} className="py-5 font-bold hover:text-yellow-400">Log Out</button>
                    </ul>
                </HeaderContainerInner>
            </HeaderContainer>  
            <Outlet />
            <footer className="flex px-3 py-3 justify-between items-center rounded-lg shadow m-4 bg-blue-950 text-white sm:px-5">
                <div>
                    <a href="https://github.com/louispallett/odin-blog-api">
                    <h2 className="py-5 text-xs sm:text-sm">© 2024 LowPal, The Odin Project</h2>
                    </a>
                </div>
            </footer>
        </BackgroundContainer>
    )
}