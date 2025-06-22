import { Bell, LogOut, Search } from 'lucide-react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';

const Header = () => {
	const { admin, logout } = useAuth();

	const handleLogout = () => {
		logout();
	};

	const getRoleBadge = (role: string) => {
		if (role === 'SuperAdmin') {
			return (
				<Badge className="bg-red-100 text-red-800 text-xs">Super Admin</Badge>
			);
		}
		return (
			<Badge variant="secondary" className="text-xs">
				Staff
			</Badge>
		);
	};

	return (
		<header className="flex justify-between items-center border-b p-4 bg-white">
			<div className="flex items-center space-x-4">
				<h1 className="text-xl font-semibold text-gray-800">
					Jewelry Shop Admin
				</h1>
			</div>

			<div className="flex items-center gap-4">
				{/* search */}
				<div className="relative w-64">
					<Input type="text" placeholder="Search..." className="w-full pr-9" />
					<div className="absolute top-1/2 -translate-y-1/2 right-3">
						<Search className="text-gray-300 w-4 h-4" />
					</div>
				</div>

				{/* notification */}
				<Button variant="ghost" size="sm" className="relative">
					<Bell className="w-5 h-5" />
					<span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
						3
					</span>
				</Button>

				{/* admin dropdown */}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="ghost"
							className="flex items-center space-x-2 h-auto p-2"
						>
							<div className="text-right">
								<div className="text-sm font-medium text-gray-900">
									{admin?.username}
								</div>
								<div className="text-xs text-gray-500 flex items-center gap-1">
									{admin?.email}
									{admin?.role && getRoleBadge(admin.role)}
								</div>
							</div>
							<div className="w-8 h-8 rounded-full bg-[#B87A1F] flex items-center justify-center">
								<span className="text-white font-medium text-sm">
									{admin?.username?.charAt(0).toUpperCase()}
								</span>
							</div>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-56">
						<DropdownMenuLabel>
							<div className="flex flex-col space-y-1">
								<p className="text-sm font-medium leading-none">
									{admin?.username}
								</p>
								<p className="text-xs leading-none text-muted-foreground">
									{admin?.email}
								</p>
								<div className="pt-1">
									{admin?.role && getRoleBadge(admin.role)}
								</div>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							onClick={handleLogout}
							variant="destructive"
							className="cursor-pointer"
						>
							<LogOut className="mr-2 h-4 w-4" />
							Đăng xuất
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</header>
	);
};

export default Header;
