import {
	Bookmark,
	CreditCard,
	GraduationCap,
	Home,
	Shield,
	Users,
} from 'lucide-react';
import { Link, useLocation, type To } from 'react-router-dom';

import { urls } from '@/configs/urls';
import { cn } from '@/lib/utils';

const Sidebar = () => {
	// useLocation
	const location = useLocation();
	const pathName = location.pathname;

	const menus = [
		{ id: 1, path: urls.home, icon: <Home />, title: 'Dashboard' },
		{ id: 2, path: urls.products.list, icon: <Bookmark />, title: 'Products' },
		{
			id: 3,
			path: urls.categories.list,
			icon: <GraduationCap />,
			title: 'Categories',
		},
		{
			id: 4,
			path: urls.customers.list,
			icon: <Users />,
			title: 'Customers',
		},
		{
			id: 5,
			path: urls.admins.list,
			icon: <Shield />,
			title: 'Admins',
		},
		{ id: 6, path: urls.orders, icon: <CreditCard />, title: 'Orders' },
	];

	return (
		<div className="w-64 bg-[#F2EAE1]">
			{/* title */}
			<div className="p-6 border-l-4 border-l-[#B87A1F]">
				<h1 className="font-bold text-xl uppercase">Logo Admin</h1>
			</div>

			{/* profile */}
			<div className="mt-8 flex flex-col items-center">
				<div className="w-32 mb-4 h-32 rounded-full overflow-hidden">
					<img
						src="https://picsum.photos/536/354"
						alt=""
						className="h-full w-full object-cover"
					/>
				</div>

				<h2 className="text-lg font-semibold">ABC</h2>
				<p className="text-[#FEAF00] text-sm">Admin</p>
			</div>

			{/* menu */}
			<div className="mt-10">
				{menus.map((menuItem) => {
					return (
						<Link
							to={menuItem.path as To}
							key={menuItem.id}
							className={cn(
								'flex items-center gap-3  py-3 px-6',
								{ 'text-white bg-[#B87A1F]': menuItem.path === pathName },
								{ 'hover:bg-gray-200': menuItem.path !== pathName }
							)}
						>
							{menuItem.icon}
							{menuItem.title}
						</Link>
					);
				})}
			</div>
		</div>
	);
};

export default Sidebar;
