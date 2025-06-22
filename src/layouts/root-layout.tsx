import Header from './header';
import { Outlet } from 'react-router-dom';
import Sidebar from './sidebar';

const RootLayout = () => {
	return (
		<div className="flex bg-gray-100 h-screen ">
			{/* sidebar */}
			<Sidebar />

			<div className="flex-1 bg-white">
				{/* header */}
				<Header />

				<main className="p-6">
					<Outlet />
				</main>
			</div>
		</div>
	);
};

export default RootLayout;
