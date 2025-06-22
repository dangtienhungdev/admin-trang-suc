# Admin Management System

Hệ thống quản lý quản trị viên cho ứng dụng admin jewelry shop.

## Cấu trúc Files

```
src/pages/manager/admins/
├── components/
│   └── table.tsx              # Component bảng hiển thị danh sách admins
├── create/
│   └── page.tsx              # Trang tạo admin mới
├── detail/
│   └── [adminId]/
│       └── page.tsx          # Trang chi tiết admin
├── edit/
│   └── [adminId]/
│       └── page.tsx          # Trang chỉnh sửa thông tin admin
├── change-password/
│   └── [adminId]/
│       └── page.tsx          # Trang đổi mật khẩu admin
├── page.tsx                  # Trang danh sách admins
└── README.md                 # Tài liệu hướng dẫn
```

## API Endpoints

### 1. Lấy danh sách quản trị viên
- **GET** `/api/v1/admins`
- **Params**: `limit`, `page`
- **Response**: Danh sách admins với pagination

### 2. Lấy chi tiết quản trị viên
- **GET** `/api/v1/admins/{id}`
- **Response**: Thông tin chi tiết một admin

### 3. Tạo quản trị viên mới
- **POST** `/api/v1/admins/register`
- **Body**: `username`, `email`, `password`, `role`
- **Response**: Thông tin admin vừa tạo

### 4. Cập nhật thông tin quản trị viên
- **PATCH** `/api/v1/admins/{id}`
- **Body**: `username` (chỉ có thể thay đổi username)
- **Response**: Thông tin admin đã cập nhật

### 5. Xóa quản trị viên
- **DELETE** `/api/v1/admins/{id}`
- **Response**: Xác nhận xóa thành công

### 6. Đổi mật khẩu
- **PATCH** `/api/v1/admins/{id}/change-password`
- **Body**: `currentPassword`, `newPassword`, `confirmPassword`
- **Response**: Xác nhận đổi mật khẩu thành công

## Types

### Admin Interface
```typescript
interface Admin {
  _id: string;
  username: string;
  email: string;
  role: 'SuperAdmin' | 'Staff';
  lastLogin: string | null;
  createdAt: string;
  updatedAt: string;
}
```

### Request Types
```typescript
interface CreateAdminRequest {
  username: string;
  email: string;
  password: string;
  role: 'SuperAdmin' | 'Staff';
}

interface UpdateAdminRequest {
  username?: string;
}

interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
```

## Custom Hooks

### useAdmins(params)
Lấy danh sách admins với pagination
```typescript
const { admins, pagination, isLoading, error } = useAdmins({
  page: 1,
  limit: 10
});
```

### useAdminDetail()
Lấy chi tiết admin từ URL params
```typescript
const { admin, isLoading, error } = useAdminDetail();
```

### useCreateAdmin()
Tạo admin mới
```typescript
const { mutate: createAdmin, isPending } = useCreateAdmin();
```

### useUpdateAdmin()
Cập nhật thông tin admin
```typescript
const { mutate: updateAdmin, isPending } = useUpdateAdmin();
```

### useDeleteAdmin()
Xóa admin
```typescript
const { mutate: deleteAdmin, isPending } = useDeleteAdmin();
```

### useChangePassword()
Đổi mật khẩu admin
```typescript
const { mutate: changePassword, isPending } = useChangePassword();
```

## Components

### TableAdmin
Component bảng hiển thị danh sách admins với các action buttons:
- **View**: Xem chi tiết admin
- **Edit**: Chỉnh sửa thông tin admin
- **Change Password**: Đổi mật khẩu admin
- **Delete**: Xóa admin (chỉ hiển thị với Staff, không thể xóa SuperAdmin)

**Props:**
```typescript
interface TableAdminProps {
  admins: Admin[];
}
```

## Pages

### 1. Danh sách Admins (`/admins`)
- Hiển thị bảng danh sách admins
- Pagination
- Button "Thêm quản trị viên"
- Loading states và error handling

### 2. Tạo Admin (`/admins/create`)
- Form tạo admin mới
- Validation với Zod
- Các trường: username, email, password, role
- Auto-navigate về danh sách sau khi tạo thành công

### 3. Chỉnh sửa Admin (`/admins/edit/:adminId`)
- Form chỉnh sửa thông tin admin
- Chỉ cho phép thay đổi username
- Email và role hiển thị read-only
- Pre-populate data từ API

### 4. Chi tiết Admin (`/admins/detail/:adminId`)
- Hiển thị thông tin chi tiết admin
- Sidebar với các action buttons
- Thông tin hệ thống (ID, ngày tạo, cập nhật)
- Badge role với màu sắc khác nhau

### 5. Đổi mật khẩu (`/admins/change-password/:adminId`)
- Form đổi mật khẩu
- Validation mật khẩu hiện tại và mật khẩu mới
- Xác nhận mật khẩu mới phải khớp

## Validation Schemas

### Create Admin Schema
```typescript
const createAdminSchema = z.object({
  username: z.string().min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  role: z.enum(['SuperAdmin', 'Staff']),
});
```

### Update Admin Schema
```typescript
const updateAdminSchema = z.object({
  username: z.string().min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự'),
});
```

### Change Password Schema
```typescript
const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Vui lòng nhập mật khẩu hiện tại'),
  newPassword: z.string().min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự'),
  confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu mới'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Mật khẩu xác nhận không khớp',
  path: ['confirmPassword'],
});
```

## Navigation Flow

```
/admins (Danh sách)
├── /admins/create (Tạo mới)
├── /admins/detail/:id (Chi tiết)
│   ├── /admins/edit/:id (Chỉnh sửa)
│   └── /admins/change-password/:id (Đổi mật khẩu)
└── Pagination
```

## Features

### Bảo mật
- SuperAdmin không thể bị xóa
- Validation mật khẩu khi đổi mật khẩu
- Xác nhận trước khi xóa admin

### UX/UI
- Loading states cho tất cả actions
- Toast notifications cho success/error
- Confirmation dialogs cho actions nguy hiểm
- Responsive design
- Badge màu khác nhau cho role

### State Management
- React Query cho data fetching và caching
- Auto-refresh sau CRUD operations
- Optimistic updates
- Error handling với retry

## Error Handling

### API Errors
- Toast error messages từ API response
- Fallback error messages
- Loading states và disabled buttons

### Form Validation
- Real-time validation với Zod
- Vietnamese error messages
- Field-level validation

### Network Errors
- Retry mechanisms
- Loading states
- Error boundaries

## Best Practices Applied

1. **Type Safety**: Đầy đủ TypeScript types cho tất cả data structures
2. **Component Reusability**: Tách component TableAdmin có thể tái sử dụng
3. **Custom Hooks**: Logic tách riêng trong custom hooks
4. **Form Validation**: Zod schema validation với error messages tiếng Việt
5. **State Management**: React Query cho caching và synchronization
6. **Error Handling**: Comprehensive error handling ở mọi level
7. **Loading States**: Loading indicators cho tất cả async operations
8. **Responsive Design**: Mobile-friendly UI
9. **Security**: Role-based access control và validation