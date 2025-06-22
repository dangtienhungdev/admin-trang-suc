# Authentication System

Hệ thống xác thực cho ứng dụng admin jewelry shop sử dụng React Context và JWT tokens.

## Cấu trúc Files

```
src/
├── contexts/
│   ├── AuthContext.tsx          # Context và Provider cho authentication
│   └── README.md               # Tài liệu hướng dẫn
├── components/
│   └── PrivateRoute.tsx        # Component bảo vệ routes
├── pages/
│   └── login/
│       └── page.tsx           # Trang đăng nhập
├── apis/
│   └── auth.api.ts            # API functions cho authentication
└── types/
    └── auth.type.ts           # Type definitions cho auth
```

## API Endpoint

### Login
- **POST** `/api/v1/admins/login`
- **Body**:
  ```json
  {
    "usernameOrEmail": "admin01",
    "password": "adminpassword123"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Đăng nhập thành công",
    "data": {
      "admin": {
        "_id": "60d5f484e1a2f5001f647abc",
        "username": "admin01",
        "email": "admin@jewelry-shop.com",
        "role": "Staff",
        "lastLogin": "2024-01-01T00:00:00.000Z",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      },
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expiresIn": 86400
    }
  }
  ```

## Types

### Auth Types
```typescript
interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

interface LoginResponse {
  admin: {
    _id: string;
    username: string;
    email: string;
    role: 'SuperAdmin' | 'Staff';
    lastLogin: string | null;
    createdAt: string;
    updatedAt: string;
  };
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

interface AuthContextType {
  admin: LoginResponse['admin'] | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
}
```

## AuthContext

### Features
- **Persistent Login**: Lưu trữ token và thông tin admin trong localStorage
- **Auto Token Refresh**: Tự động refresh token khi hết hạn
- **Axios Interceptors**: Tự động thêm Bearer token vào requests
- **Error Handling**: Xử lý lỗi authentication và auto logout
- **Loading States**: Quản lý loading states cho UI

### Usage
```typescript
import { useAuth } from '@/contexts/AuthContext';

const MyComponent = () => {
  const { admin, isAuthenticated, login, logout, isLoading } = useAuth();

  // Component logic
};
```

### Methods

#### login(credentials)
Đăng nhập admin với username/email và password
```typescript
const { login } = useAuth();

try {
  await login({
    usernameOrEmail: 'admin01',
    password: 'password123'
  });
  // Redirect to dashboard
} catch (error) {
  // Handle login error
}
```

#### logout()
Đăng xuất và xóa tất cả thông tin authentication
```typescript
const { logout } = useAuth();

logout(); // Auto redirect to login page
```

## PrivateRoute Component

Bảo vệ các routes cần authentication.

### Features
- **Authentication Check**: Kiểm tra trạng thái đăng nhập
- **Auto Redirect**: Chuyển hướng đến login nếu chưa đăng nhập
- **Loading State**: Hiển thị loading trong khi kiểm tra auth
- **Return URL**: Lưu URL gốc để redirect sau khi login

### Usage
```typescript
import { PrivateRoute } from '@/components/PrivateRoute';

// Wrap protected content
<PrivateRoute>
  <ProtectedContent />
</PrivateRoute>
```

## Login Page

### Features
- **Form Validation**: Validation với Zod schema
- **Loading States**: Loading indicators trong quá trình login
- **Error Handling**: Hiển thị lỗi từ API
- **Password Toggle**: Hiện/ẩn mật khẩu
- **Auto Redirect**: Chuyển hướng sau khi login thành công
- **Responsive Design**: Mobile-friendly UI

### Validation Schema
```typescript
const loginSchema = z.object({
  usernameOrEmail: z.string().min(1, 'Vui lòng nhập tên đăng nhập hoặc email'),
  password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
});
```

## Token Management

### Storage
- **Access Token**: Lưu trong localStorage với key `admin_access_token`
- **Refresh Token**: Lưu trong localStorage với key `admin_refresh_token`
- **Admin Data**: Lưu trong localStorage với key `admin_data`

### Auto Refresh
- Tự động refresh token khi nhận response 401
- Retry original request với token mới
- Auto logout nếu refresh thất bại

### Axios Interceptors
```typescript
// Request interceptor - thêm Bearer token
config.headers.Authorization = `Bearer ${accessToken}`;

// Response interceptor - xử lý token expiration
if (error.response?.status === 401) {
  // Try to refresh token
  // Retry original request
  // Logout if refresh fails
}
```

## Security Features

### Token Security
- JWT tokens với expiration time
- Secure storage trong localStorage
- Auto cleanup khi logout

### Route Protection
- Tất cả admin routes được bảo vệ bởi PrivateRoute
- Auto redirect đến login nếu không authenticated
- Preserve intended destination URL

### Error Handling
- Graceful handling của network errors
- User-friendly error messages
- Auto retry mechanisms

## Navigation Flow

```
/login (Public)
├── Login Success → / (Dashboard)
├── Login Error → Stay on /login
└── Already Authenticated → Redirect to intended page

/ (Protected by PrivateRoute)
├── Authenticated → Show content
├── Not Authenticated → Redirect to /login
└── Token Expired → Auto refresh → Continue or Logout
```

## Integration với Existing Code

### RootLayout
```typescript
// Wrap với PrivateRoute
<PrivateRoute>
  <Layout>
    <Content />
  </Layout>
</PrivateRoute>
```

### Main App
```typescript
// Wrap với AuthProvider
<AuthProvider>
  <App />
</AuthProvider>
```

### Header Component
```typescript
// Hiển thị thông tin admin và logout button
const { admin, logout } = useAuth();
```

### Sidebar Component
```typescript
// Hiển thị avatar và role của admin
const { admin } = useAuth();
```

## Best Practices Applied

1. **Type Safety**: Đầy đủ TypeScript types
2. **Error Handling**: Comprehensive error handling
3. **User Experience**: Loading states và smooth transitions
4. **Security**: Secure token management
5. **Persistence**: Maintain login state across sessions
6. **Auto Recovery**: Auto token refresh
7. **Clean Architecture**: Separation of concerns
8. **Responsive Design**: Mobile-friendly UI