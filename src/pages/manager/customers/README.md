# Customer Management System Documentation

## Overview
Hệ thống quản lý khách hàng hoàn chỉnh với các chức năng CRUD (Create, Read, Update, Delete) cho phép quản trị viên quản lý thông tin khách hàng trong cửa hàng trang sức.

## File Structure

```
src/pages/manager/customers/
├── components/
│   └── table.tsx                      # Component bảng hiển thị danh sách khách hàng
├── create/
│   └── page.tsx                       # Trang tạo khách hàng mới
├── detail/
│   └── [customerId]/
│       └── page.tsx                   # Trang chi tiết khách hàng
├── edit/
│   └── [customerId]/
│       └── page.tsx                   # Trang chỉnh sửa thông tin khách hàng
├── page.tsx                           # Trang danh sách khách hàng chính
└── README.md                          # Tài liệu này
```

## API Endpoints

### 1. GET `/api/v1/customers`
**Mục đích**: Lấy danh sách khách hàng với phân trang
**Parameters**:
- `page` (optional): Số trang
- `limit` (optional): Số lượng items per page

**Response**:
```json
{
  "success": true,
  "message": "Lấy danh sách khách hàng thành công",
  "data": {
    "items": [
      {
        "_id": "60d5f484e1a2f5001f647abc",
        "fullName": "Nguyễn Văn An",
        "phone": "0987654321",
        "email": "nguyenvana@email.com",
        "address": "123 Nguyễn Trãi, Phường 2, Quận 5, TP.HCM",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### 2. GET `/api/v1/customers/{id}`
**Mục đích**: Lấy thông tin chi tiết một khách hàng
**Response**:
```json
{
  "success": true,
  "message": "Lấy thông tin khách hàng thành công",
  "data": {
    "_id": "60d5f484e1a2f5001f647abc",
    "fullName": "Nguyễn Văn An",
    "phone": "0987654321",
    "email": "nguyenvana@email.com",
    "address": "123 Nguyễn Trãi, Phường 2, Quận 5, TP.HCM",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 3. POST `/api/v1/customers/register`
**Mục đích**: Tạo tài khoản khách hàng mới
**Body**:
```json
{
  "fullName": "Nguyễn Văn An",
  "phone": "0987654321",
  "email": "nguyenvana@email.com",
  "password": "password123",
  "address": "123 Nguyễn Trãi, Phường 2, Quận 5, TP.HCM"
}
```

### 4. PATCH `/api/v1/customers/{id}`
**Mục đích**: Cập nhật thông tin khách hàng
**Body**:
```json
{
  "fullName": "Nguyễn Văn An (Đã cập nhật)",
  "phone": "0987654322",
  "address": "456 Lê Văn Sỹ, Phường 12, Quận 3, TP.HCM"
}
```

### 5. DELETE `/api/v1/customers/{id}`
**Mục đích**: Xóa khách hàng

## Custom Hooks

### useCustomers(params?)
- Lấy danh sách khách hàng với pagination
- Tự động cập nhật khi dữ liệu thay đổi
- Trả về: `{ customers, pagination, isLoading, error }`

### useCustomerDetail()
- Lấy thông tin chi tiết khách hàng dựa trên customerId từ URL params
- Tự động fetch khi customerId thay đổi
- Trả về: `{ customer, isLoading, error }`

### useCreateCustomer()
- Tạo khách hàng mới
- Tự động refresh danh sách sau khi tạo thành công
- Hiển thị toast notification
- Trả về: `{ mutate, isPending }`

### useUpdateCustomer()
- Cập nhật thông tin khách hàng
- Tự động refresh cache sau khi cập nhật
- Hiển thị toast notification
- Trả về: `{ mutate, isPending }`

### useDeleteCustomer()
- Xóa khách hàng
- Tự động refresh danh sách sau khi xóa
- Hiển thị toast notification
- Trả về: `{ mutate, isPending }`

## Component Details

### TableCustomer Component
**Location**: `components/table.tsx`
**Purpose**: Hiển thị danh sách khách hàng dạng bảng với các action buttons

**Features**:
- Hiển thị thông tin: STT, Họ tên, Email, SĐT, Địa chỉ, Ngày tạo
- Action buttons: View (👁️), Edit (✏️), Delete (🗑️)
- Confirmation dialog cho việc xóa
- Loading states cho delete action
- Responsive design

**Props**:
```typescript
interface TableCustomerProps {
  customers: Customer[];
}
```

## Page Workflows

### 1. List Page (`/customers`)
**File**: `page.tsx`
**Workflow**:
1. Load danh sách khách hàng với pagination
2. Hiển thị loading state khi đang fetch data
3. Render bảng với TableCustomer component
4. Pagination controls ở dưới bảng
5. Button "Thêm khách hàng" navigate đến create page

### 2. Create Page (`/customers/create`)
**File**: `create/page.tsx`
**Workflow**:
1. Form với validation (Zod schema)
2. Các field: Họ tên*, Email*, SĐT*, Password*, Địa chỉ*
3. Submit → API call → Success toast → Navigate back to list
4. Button "Hủy" để quay lại danh sách

### 3. Edit Page (`/customers/edit/:customerId`)
**File**: `edit/[customerId]/page.tsx`
**Workflow**:
1. Fetch thông tin khách hàng từ customerId
2. Pre-populate form với dữ liệu hiện tại
3. Các field có thể edit: Họ tên*, SĐT*, Địa chỉ*
4. Email không thể thay đổi (disabled)
5. Submit → API call → Success toast → Navigate back to list

### 4. Detail Page (`/customers/detail/:customerId`)
**File**: `detail/[customerId]/page.tsx`
**Workflow**:
1. Fetch và hiển thị thông tin chi tiết khách hàng
2. Layout 2 cột: Thông tin chính + Actions sidebar
3. Actions: Edit button, Delete button (với confirmation)
4. System info: ID, Ngày tạo, Ngày cập nhật
5. "Quay lại danh sách" button

## Form Validation

### Create Customer Schema
```typescript
const createCustomerSchema = z.object({
  fullName: z.string().min(1, 'Họ và tên là bắt buộc'),
  phone: z.string().min(10, 'Số điện thoại phải có ít nhất 10 số'),
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  address: z.string().min(1, 'Địa chỉ là bắt buộc'),
});
```

### Update Customer Schema
```typescript
const updateCustomerSchema = z.object({
  fullName: z.string().min(1, 'Họ và tên là bắt buộc'),
  phone: z.string().min(10, 'Số điện thoại phải có ít nhất 10 số'),
  address: z.string().min(1, 'Địa chỉ là bắt buộc'),
});
```

## UI Components Used

### From ShadCN/UI:
- `Table, TableBody, TableCell, TableHead, TableHeader, TableRow` - Bảng dữ liệu
- `AlertDialog` - Confirmation dialogs cho delete actions
- `Button` - Các nút bấm với variants và states
- `Form, FormControl, FormField, FormItem, FormLabel, FormMessage` - Form handling
- `Input` - Text inputs với validation
- `Textarea` - Multi-line text input cho địa chỉ
- `Badge` - Status badges

### From Lucide React:
- `EyeIcon` - View detail action
- `PencilIcon` - Edit action
- `TrashIcon` - Delete action
- `ArrowLeftIcon` - Back navigation
- `Users` - Sidebar menu icon

## Navigation Flow

```
/customers (List)
├── "Thêm khách hàng" → /customers/create
├── 👁️ View → /customers/detail/:id
├── ✏️ Edit → /customers/edit/:id
└── 🗑️ Delete → Confirmation dialog

/customers/create
├── "Hủy" → /customers
└── Submit success → /customers

/customers/edit/:id
├── "Hủy" → /customers
└── Submit success → /customers

/customers/detail/:id
├── "Quay lại danh sách" → /customers
├── "Chỉnh sửa thông tin" → /customers/edit/:id
└── "Xóa khách hàng" → Confirmation → /customers
```

## Error Handling

### API Errors:
- Network errors → Toast error message
- Validation errors → Form field errors
- Server errors → Toast with server message

### Loading States:
- Table loading → "Đang tải dữ liệu..."
- Form submission → Disabled buttons với loading text
- Delete action → "Đang xóa..." trong button

### Error States:
- Failed to load list → Error message với retry option
- Failed to load detail → Error message với back button
- Form validation → Field-level error messages

## Best Practices Applied

1. **Type Safety**: TypeScript interfaces cho tất cả data structures
2. **Form Validation**: Zod schemas với user-friendly error messages
3. **State Management**: React Query cho caching và synchronization
4. **User Feedback**: Toast notifications cho user actions
5. **Confirmation Dialogs**: Cho destructive actions (delete)
6. **Loading States**: Visual feedback cho async operations
7. **Responsive Design**: Mobile-friendly layouts
8. **Consistent Navigation**: Standardized routing patterns
9. **Error Boundaries**: Graceful error handling
10. **Accessibility**: Proper labels và semantic HTML

## Technical Stack

- **React** + **TypeScript** - Core framework
- **React Query** - Data fetching and caching
- **React Hook Form** + **Zod** - Form handling and validation
- **React Router** - Client-side routing
- **ShadCN/UI** - UI component library
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Sonner** - Toast notifications