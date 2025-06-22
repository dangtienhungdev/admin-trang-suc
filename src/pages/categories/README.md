# Category Management System

## 📁 Cấu trúc thư mục

```
src/pages/categories/
├── README.md                    # Tài liệu hướng dẫn
├── page.tsx                     # Trang danh sách categories
├── components/
│   └── table.tsx               # Component bảng hiển thị categories
├── create/
│   └── page.tsx                # Trang thêm mới category
└── edit/
    └── [categoryId]/
        └── page.tsx            # Trang chỉnh sửa category

src/hooks/categories/
└── useCategory.ts              # Custom hooks cho category operations

src/apis/
└── categories.api.ts           # API endpoints cho categories

src/types/
└── category.type.ts            # Type definitions cho Category
```

## 🎯 Chức năng chính

### 1. **Xem danh sách Categories** (`/categories`)
- Hiển thị bảng danh sách tất cả categories
- Phân trang (pagination)
- Loading state và error handling
- Nút "Thêm mới danh mục"

### 2. **Thêm mới Category** (`/categories/create`)
- Form tạo category mới với validation
- Các trường: Tên danh mục, Mô tả, Trạng thái
- Auto-refresh danh sách sau khi tạo thành công

### 3. **Chỉnh sửa Category** (`/categories/edit/:id`)
- Form chỉnh sửa category với dữ liệu được load sẵn
- Validation và error handling
- Nút Cancel để hủy bỏ chỉnh sửa

### 4. **Xóa Category**
- Alert dialog xác nhận trước khi xóa
- Hiển thị tên category cần xóa
- Auto-refresh danh sách sau khi xóa thành công

## 📋 Chi tiết các file/folder

### **1. `page.tsx` - Trang danh sách Categories**
**Tác dụng:** Trang chính hiển thị danh sách categories với pagination
**Logic:**
- Sử dụng `useCategories` hook để fetch data
- Quản lý URL params cho pagination (page, limit)
- Handle navigation giữa các trang
- Hiển thị loading state và error state

**Workflow:**
```
Page Load → useCategories Hook → API Call → Display Data
     ↓
Handle Pagination → Update URL → Re-fetch Data
```

### **2. `components/table.tsx` - Component bảng**
**Tác dụng:** Component hiển thị bảng categories với các action buttons
**Logic:**
- Render danh sách categories trong table format
- Handle Edit và Delete actions
- Sử dụng `useDeleteCategory` hook cho chức năng xóa
- Alert dialog confirmation cho delete action

**Workflow Delete:**
```
Click Delete → Alert Dialog → Confirm → API Call → Toast Notification → Refresh List
```

### **3. `create/page.tsx` - Trang thêm mới**
**Tác dụng:** Form tạo category mới
**Logic:**
- Form validation với Zod schema
- Sử dụng `useCreateCategory` hook
- Handle form submission và navigation
- Default values: isActive = true

**Workflow:**
```
Form Fill → Validation → Submit → API Call → Success Toast → Navigate to List
```

### **4. `edit/[categoryId]/page.tsx` - Trang chỉnh sửa**
**Tác dụng:** Form chỉnh sửa category existing
**Logic:**
- Load data bằng `useCategory` hook (từ URL params)
- Pre-populate form với dữ liệu hiện tại
- Handle update submission
- Nút Cancel để quay lại danh sách

**Workflow:**
```
Page Load → Load Category Data → Populate Form → Edit → Submit → API Call → Navigate Back
```

## 🔧 Custom Hooks

### **`useCategories(params)`**
- **Tác dụng:** Fetch danh sách categories với pagination
- **Return:** categories, pagination info, loading states

### **`useCategory()`**
- **Tác dụng:** Fetch single category by ID (từ URL params)
- **Return:** category data, loading states

### **`useCreateCategory()`**
- **Tác dụng:** Tạo category mới
- **Features:** Auto-refresh list, toast notifications

### **`useDeleteCategory()`**
- **Tác dụng:** Xóa category
- **Features:** Auto-refresh list, toast notifications, error handling

## 🌐 API Endpoints

```typescript
// categories.api.ts
getCategories(params)     // GET /categories
getCategory(id)          // GET /categories/:id
createCategory(data)     // POST /categories
updateCategory(id, data) // PATCH /categories/:id
deleteCategory(id)       // DELETE /categories/:id
```

## 🎨 UI Components sử dụng

- **Form Components:** Form, FormField, FormItem, FormLabel, FormControl, FormMessage
- **Input Components:** Input, Textarea, Switch
- **Layout Components:** Button, Table, AlertDialog
- **Feedback:** Toast notifications (sonner)
- **Icons:** PencilIcon (edit), TrashIcon (delete), Loader (loading)

## 📊 Data Flow

```
User Action → Hook → API Call → Response → State Update → UI Re-render → Toast Notification
```

## 🔄 State Management

- **React Query:** Caching, loading states, auto-refetch
- **React Hook Form:** Form state management và validation
- **URL State:** Pagination params trong URL
- **Local State:** UI states (loading, dialogs)

## 🚨 Error Handling

- **API Errors:** Hiển thị toast error với message từ server
- **Form Validation:** Real-time validation với Zod
- **Loading States:** Disable buttons và hiển thị spinner
- **Network Errors:** Fallback UI và retry mechanisms

## 🎯 Best Practices được áp dụng

1. **Separation of Concerns:** Logic tách biệt giữa hooks, API, và UI
2. **Reusability:** Hooks có thể tái sử dụng ở nhiều nơi
3. **Type Safety:** TypeScript với Zod validation
4. **User Experience:** Loading states, confirmations, toast notifications
5. **Consistent Styling:** Tailwind CSS với design system
6. **Error Boundaries:** Graceful error handling

## 🔗 Navigation Flow

```
Categories List (/categories)
    ├── Create New (/categories/create) → Back to List
    ├── Edit (/categories/edit/:id) → Back to List
    └── Delete (Alert Dialog) → Stay on List
```

## 📱 Responsive Design

- Mobile-first approach
- Responsive table với horizontal scroll
- Consistent button sizes và spacing
- Accessible form controls
