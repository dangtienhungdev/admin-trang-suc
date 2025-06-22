import './index.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { StrictMode } from 'react';
import { Toaster } from './components/ui/sonner';
import { createRoot } from 'react-dom/client';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: 1,
			refetchOnWindowFocus: false,
		},
	},
});

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				<App />
				<Toaster />
			</AuthProvider>
		</QueryClientProvider>
	</StrictMode>
);
