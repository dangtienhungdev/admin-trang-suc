import Header from './header';
import { Outlet } from 'react-router-dom';
import { PrivateRoute } from '@/components/PrivateRoute';
import Sidebar from './sidebar';

const RootLayout = () => {
	return (
		<PrivateRoute>
			<div className="flex h-screen bg-gray-100">
				<Sidebar />
				<div className="flex-1 flex flex-col overflow-hidden">
					<Header />
					<main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
						<Outlet />
					</main>
				</div>
			</div>
		</PrivateRoute>
	);
};

export default RootLayout;
