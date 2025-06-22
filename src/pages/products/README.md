# Product Management System

## 📁 Cấu trúc thư mục

```
src/pages/products/
├── README.md                    # Tài liệu hướng dẫn
├── page.tsx                     # Trang danh sách products
├── components/
│   └── table.tsx               # Component bảng hiển thị products
├── create/
│   └── page.tsx                # Trang thêm mới product
├── edit/
│   └── [productId]/
│       └── page.tsx            # Trang chỉnh sửa product
└── detail/
    └── [productId]/
        └── page.tsx            # Trang xem chi tiết product

src/hooks/products/
└── useProduct.ts               # Custom hooks cho product operations

src/apis/
└── products.api.ts             # API endpoints cho products

src/types/
└── product.type.ts             # Type definitions cho Product

src/configs/
└── urls.ts                     # URL paths cho routing
```

## 🎯 Chức năng chính

### 1. **Xem danh sách Products** (`/products`)
- Hiển thị bảng danh sách tất cả products với hình ảnh
- Phân trang (pagination) với điều hướng
- Loading state và error handling
- Nút "Thêm sản phẩm" để tạo mới
- Hiển thị thông tin: Tên, Danh mục, Giá, Trọng lượng, Tồn kho, Chất liệu

### 2. **Thêm mới Product** (`/products/create`)
- Form tạo product mới với validation đầy đủ
- Các trường: Tên sản phẩm, Danh mục, Giá, Trọng lượng, Chất liệu, Tồn kho, Mô tả, Sản phẩm nổi bật
- Dropdown chọn danh mục từ API categories
- Auto-refresh danh sách sau khi tạo thành công

### 3. **Chỉnh sửa Product** (`/products/edit/:id`)
- Form chỉnh sửa product với dữ liệu được load sẵn
- Form validation và error handling
- Nút Cancel để hủy bỏ chỉnh sửa
- Grid layout responsive cho các input fields

### 4. **Xem chi tiết Product** (`/products/detail/:id`)
- Trang hiển thị đầy đủ thông tin sản phẩm
- Gallery hình ảnh với layout responsive
- Thông số kỹ thuật chi tiết
- Badges cho trạng thái và danh mục
- Actions: Edit và Delete ngay trên trang detail

### 5. **Xóa Product**
- Alert dialog xác nhận trước khi xóa
- Hiển thị tên product cần xóa
- Auto-refresh danh sách sau khi xóa thành công
- Có thể xóa từ table list hoặc detail page

## 📋 Chi tiết các file/folder

### **1. `page.tsx` - Trang danh sách Products**
**Tác dụng:** Trang chính hiển thị danh sách products với pagination
**Logic:**
- Sử dụng `useProduct` hook để fetch data với params
- Quản lý URL params cho pagination (page, limit)
- Handle navigation giữa các trang
- Hiển thị loading state và error state
- Button "Thêm sản phẩm" navigate đến create page

**Workflow:**
```
Page Load → useProduct Hook → API Call → Display Data
     ↓
Handle Pagination → Update URL → Re-fetch Data
```

### **2. `components/table.tsx` - Component bảng**
**Tác dụng:** Component hiển thị bảng products với action buttons
**Logic:**
- Render danh sách products trong table format với hình ảnh
- Handle View Detail, Edit và Delete actions
- Sử dụng `useDeleteProduct` hook cho chức năng xóa
- Alert dialog confirmation cho delete action
- Responsive design với overflow-x-auto

**Workflow Actions:**
```
View Detail → Navigate to Detail Page
Edit → Navigate to Edit Page
Delete → Alert Dialog → Confirm → API Call → Toast → Refresh List
```

### **3. `create/page.tsx` - Trang thêm mới**
**Tác dụng:** Form tạo product mới với full validation
**Logic:**
- Form validation với Zod schema cho tất cả trường
- Sử dụng `useCreateProduct` hook
- Load categories list cho dropdown selection
- Handle form submission và navigation
- Grid layout cho responsive design

**Workflow:**
```
Load Categories → Form Fill → Validation → Submit → API Call → Success Toast → Navigate to List
```

### **4. `edit/[productId]/page.tsx` - Trang chỉnh sửa**
**Tác dụng:** Form chỉnh sửa product existing
**Logic:**
- Load product data bằng `useProductDetail` hook
- Pre-populate form với dữ liệu hiện tại
- Load categories list cho dropdown
- Handle update submission với `useUpdateProduct`
- Nút Cancel để quay lại danh sách

**Workflow:**
```
Page Load → Load Product Data → Load Categories → Populate Form → Edit → Submit → API Call → Navigate Back
```

### **5. `detail/[productId]/page.tsx` - Trang xem chi tiết**
**Tác dụng:** Hiển thị thông tin chi tiết product với UI đẹp
**Logic:**
- Load product data với `useProductDetail` hook
- Gallery hình ảnh với main image và thumbnails
- Hiển thị thông số kỹ thuật trong grid layout
- Actions: Edit và Delete với alert confirmation
- Responsive design cho mobile và desktop

**Workflow:**
```
Page Load → Load Product Data → Display Gallery → Show Specifications → Action Buttons
```

## 🔧 Custom Hooks

### **`useProduct(params)`**
- **Tác dụng:** Fetch danh sách products với pagination
- **Params:** page, limit
- **Return:** products array, pagination info, loading states

### **`useProductDetail()`**
- **Tác dụng:** Fetch single product by ID (từ URL params)
- **Return:** product data, loading states
- **Features:** Auto-enabled khi có productId

### **`useCreateProduct()`**
- **Tác dụng:** Tạo product mới
- **Features:** Auto-refresh list, toast notifications, error handling

### **`useUpdateProduct()`**
- **Tác dụng:** Cập nhật product existing
- **Features:** Auto-refresh list và detail, toast notifications

### **`useDeleteProduct()`**
- **Tác dụng:** Xóa product
- **Features:** Auto-refresh list, toast notifications, error handling

## 🌐 API Endpoints

```typescript
// products.api.ts
getProducts(params)       // GET /products?page=1&limit=10
getProduct(id)           // GET /products/:id
createProduct(data)      // POST /products
updateProduct(id, data)  // PUT /products/:id
deleteProduct(id)        // DELETE /products/:id
```

## 🎯 Best Practices được áp dụng

1. **Separation of Concerns:** Logic tách biệt giữa hooks, API, và UI
2. **Reusability:** Hooks có thể tái sử dụng ở nhiều component
3. **Type Safety:** TypeScript với Zod validation cho form
4. **User Experience:** Loading states, confirmations, toast notifications
5. **Responsive Design:** Mobile-first approach với Tailwind CSS
6. **Performance:** Image optimization và lazy loading
7. **Accessibility:** Proper ARIA labels và keyboard navigation

## 🔗 Navigation Flow

```
Products List (/products)
    ├── Create New (/products/create) → Back to List
    ├── View Detail (/products/detail/:id)
    │   ├── Edit → (/products/edit/:id) → Back to List
    │   └── Delete (Alert Dialog) → Back to List
    ├── Edit (/products/edit/:id) → Back to List
    └── Delete (Alert Dialog) → Stay on List
```

## 📱 Responsive Design

- **Mobile-first approach** với breakpoint md, lg
- **Responsive table** với horizontal scroll
- **Grid layouts** cho form fields (1 col mobile, 2 cols desktop)
- **Image galleries** với aspect-ratio maintenance
- **Consistent spacing** và button sizes
- **Touch-friendly** action buttons

## 🔧 URL Configuration

```typescript
// urls.ts
products: {
  list: '/products',
  create: '/products/create',
  edit: (id: string) => `/products/edit/${id}`,
  detail: (id: string) => `/products/detail/${id}`,
}
```

## 📈 Features nâng cao

- **Image Gallery:** Main image + thumbnails với responsive design
- **Category Integration:** Dropdown selection từ categories API
- **Stock Management:** Color-coded stock levels (red/yellow/green)
- **Featured Products:** Toggle switch cho sản phẩm nổi bật
- **View Counter:** Hiển thị số lượt xem sản phẩm
- **Price Formatting:** Format giá tiền theo locale Việt Nam
- **Date Formatting:** Hiển thị ngày tháng theo định dạng Việt Nam