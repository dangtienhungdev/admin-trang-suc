# Quản lý Vouchers - Hệ thống Admin

## Tổng quan

Hệ thống quản lý vouchers cung cấp khả năng tạo, chỉnh sửa, xóa và theo dõi các mã giảm giá/khuyến mãi cho cửa hàng trang sức.

## Cấu trúc thư mục

```
src/pages/vouchers/
├── page.tsx                     # Trang chính quản lý vouchers
├── components/
│   ├── VoucherStats.tsx         # Component hiển thị thống kê
│   ├── VoucherFilters.tsx       # Component bộ lọc (chuẩn bị)
│   ├── VoucherTable.tsx         # Component bảng (chuẩn bị)
│   └── VoucherModal.tsx         # Component modal CRUD (chuẩn bị)
└── README.md                    # Tài liệu này

src/apis/vouchers.api.ts         # API layer cho vouchers
src/hooks/vouchers/useVouchers.ts # React Query hooks
```

## Tính năng chính

### 1. Hiển thị thống kê vouchers
- **Tổng vouchers**: Tổng số vouchers trong hệ thống
- **Đang hoạt động**: Số vouchers có thể sử dụng
- **Đã hết hạn**: Số vouchers không còn hiệu lực
- **Tổng lượt sử dụng**: Tổng số lần vouchers được sử dụng
- **Phân loại theo type**: Phần trăm vs Số tiền cố định
- **Tỷ lệ sử dụng**: Theo dõi hiệu quả của vouchers

### 2. Bộ lọc và tìm kiếm
- **Tìm kiếm**: Theo mã voucher, tên voucher
- **Lọc theo trạng thái**: Đang hoạt động, Tạm dừng
- **Lọc theo loại**: Phần trăm, Số tiền cố định
- **Sắp xếp**: Theo ngày tạo, tên, mã, giá trị, lượt sử dụng
- **Bộ lọc nhanh**: Các bộ lọc thường dùng

### 3. Bảng danh sách vouchers
- **Mã voucher**: Hiển thị mã duy nhất
- **Tên & Loại**: Tên voucher và loại giảm giá
- **Giá trị**: Giá trị giảm và điều kiện tối thiểu
- **Thời gian**: Ngày bắt đầu và kết thúc
- **Sử dụng**: Số lần đã sử dụng / giới hạn
- **Trạng thái**: Badge hiển thị trạng thái hiện tại
- **Thao tác**: Xem, sửa, xóa

### 4. Phân trang và làm mới
- **Phân trang**: Hỗ trợ phân trang với pagination controls
- **Auto-refresh**: Tự động làm mới mỗi 30 giây
- **Manual refresh**: Nút làm mới thủ công

## Loại vouchers

### 1. Percentage (Phần trăm)
- Giảm theo phần trăm giá trị đơn hàng
- Có thể có giới hạn số tiền giảm tối đa
- VD: Giảm 10% tối đa 100,000đ

### 2. FixedAmount (Số tiền cố định)
- Giảm một số tiền cố định
- VD: Giảm 50,000đ

## Trạng thái vouchers

### 1. Đang hoạt động (Active)
- `isActive = true`
- Trong khoảng thời gian hiệu lực
- Có thể sử dụng

### 2. Tạm dừng (Inactive)
- `isActive = false`
- Bị admin tạm dừng

### 3. Hết hạn (Expired)
- Đã qua ngày kết thúc
- Không thể sử dụng

### 4. Sắp diễn ra (Upcoming)
- Chưa tới ngày bắt đầu
- Sẽ hoạt động trong tương lai

## API Endpoints

```typescript
// Lấy danh sách vouchers với filters
GET /api/v1/vouchers?page=1&limit=10&isActive=true&search=WELCOME

// Lấy chi tiết voucher
GET /api/v1/vouchers/:id

// Lấy voucher theo mã
GET /api/v1/vouchers/code/:code

// Tạo voucher mới
POST /api/v1/vouchers

// Cập nhật voucher
PATCH /api/v1/vouchers/:id

// Xóa voucher
DELETE /api/v1/vouchers/:id

// Lấy vouchers đang hoạt động
GET /api/v1/vouchers/active

// Validate voucher
POST /api/v1/vouchers/validate
```

## Validation Rules

### Tạo voucher
- **discountCode**: Bắt buộc, unique, tối thiểu 3 ký tự
- **discountName**: Bắt buộc, tối thiểu 5 ký tự
- **discountType**: Bắt buộc, `Percentage` hoặc `FixedAmount`
- **discountValue**: Bắt buộc, > 0
- **startDate**: Bắt buộc, định dạng ISO date
- **endDate**: Bắt buộc, phải sau startDate
- **minOrderValue**: Tùy chọn, >= 0
- **maxDiscountAmount**: Tùy chọn, >= 0 (chỉ cho type Percentage)
- **usageLimit**: Tùy chọn, >= 0

## Helper Functions

### Format functions
```typescript
voucherHelpers.formatCurrency(amount)     // Format tiền tệ VND
voucherHelpers.formatDate(dateString)     // Format ngày giờ
voucherHelpers.getDiscountTypeText(type)  // Text hiển thị loại giảm giá
voucherHelpers.formatDiscountValue(type, value) // Format giá trị giảm
```

### Status functions
```typescript
voucherHelpers.isVoucherExpired(endDate)  // Kiểm tra hết hạn
voucherHelpers.isVoucherActive(voucher)   // Kiểm tra đang hoạt động
voucherHelpers.getVoucherStatus(voucher)  // Lấy trạng thái + màu sắc
voucherHelpers.getUsagePercentage(voucher) // Tỷ lệ đã sử dụng
```

## React Query Keys

```typescript
voucherKeys = {
  all: ['vouchers'],
  lists: ['vouchers', 'list'],
  list: (filters) => ['vouchers', 'list', filters],
  details: ['vouchers', 'detail'],
  detail: (id) => ['vouchers', 'detail', id],
  stats: ['vouchers', 'stats'],
  active: ['vouchers', 'active'],
  byCode: (code) => ['vouchers', 'code', code],
}
```

## Performance Optimizations

### 1. React Query Caching
- **Stale time**: 5 phút cho danh sách, 10 phút cho thống kê
- **Cache invalidation**: Tự động invalidate khi có mutation
- **Background refetch**: Tự động làm mới khi focus window

### 2. Auto-refresh
- Tự động làm mới danh sách mỗi 30 giây
- Chỉ khi user ở trên trang

### 3. Pagination
- Server-side pagination để tối ưu hiệu suất
- Lazy loading cho large datasets

## Security Considerations

### 1. Validation
- Client-side validation trước khi gửi API
- Server-side validation đầy đủ
- Sanitize user input

### 2. Authorization
- Admin token required cho tất cả operations
- Role-based access control

### 3. Rate Limiting
- API rate limiting để tránh abuse
- Debounce cho search input

## Todo / Future Enhancements

### Components cần hoàn thiện
- [ ] **VoucherFilters**: Component bộ lọc riêng biệt
- [ ] **VoucherTable**: Component bảng riêng biệt
- [ ] **VoucherModal**: Modal tạo/sửa voucher
- [ ] **VoucherDetailModal**: Modal xem chi tiết
- [ ] **VoucherForm**: Form component cho tạo/sửa

### Tính năng mở rộng
- [ ] **Bulk operations**: Xóa nhiều vouchers cùng lúc
- [ ] **Export/Import**: Xuất/nhập vouchers từ Excel
- [ ] **Templates**: Mẫu vouchers thường dùng
- [ ] **Scheduling**: Lên lịch kích hoạt vouchers
- [ ] **Usage analytics**: Thống kê chi tiết sử dụng
- [ ] **A/B testing**: Test hiệu quả vouchers

### Performance
- [ ] **Virtual scrolling**: Cho large datasets
- [ ] **Infinite scroll**: Thay vì pagination
- [ ] **Real-time updates**: WebSocket cho live updates

## Troubleshooting

### Lỗi thường gặp

1. **Voucher không load**
   - Kiểm tra backend server đang chạy
   - Kiểm tra authentication token
   - Xem Network tab trong DevTools

2. **Validation errors**
   - Kiểm tra required fields
   - Đảm bảo endDate sau startDate
   - Kiểm tra discountCode unique

3. **Performance issues**
   - Giảm limit của pagination
   - Clear React Query cache
   - Kiểm tra network latency

### Debug Tips

```typescript
// Debug React Query cache
import { useQueryClient } from '@tanstack/react-query';
const queryClient = useQueryClient();
console.log(queryClient.getQueryCache());

// Debug API calls
console.log('Vouchers data:', vouchersData);
console.log('Is loading:', isLoading);
console.log('Error:', error);
```

## Liên hệ

Nếu có vấn đề hoặc câu hỏi, vui lòng liên hệ team phát triển.