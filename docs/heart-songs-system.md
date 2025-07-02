# Heart Songs System Documentation

## Tổng quan

Hệ thống Heart Songs cho phép người dùng đánh dấu các bài hát yêu thích với tính năng debouncing để tối ưu hiệu suất và trải nghiệm người dùng.

## Các thành phần chính

### 1. API Routes (`/src/app/api/heartSongs/route.ts`)

#### POST `/api/heartSongs`
- **Mục đích**: Thêm hoặc xóa bài hát khỏi danh sách yêu thích
- **Request body**:
  ```json
  {
    "songId": "string",
    "isHearted": boolean
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "isHearted": boolean,
    "message": "string"
  }
  ```

#### GET `/api/heartSongs?songId={songId}`
- **Mục đích**: Lấy trạng thái heart của một bài hát cụ thể
- **Response**:
  ```json
  {
    "isHearted": boolean,
    "songId": "string"
  }
  ```

### 2. Custom Hook (`/src/hooks/useHeartSong.ts`)

Hook này cung cấp logic debouncing và quản lý state cho heart functionality:

```tsx
const { isHearted, isLoading, toggleHeart } = useHeartSong({
  songId: "song-id",
  initialHeartState: false,
  debounceDelay: 500 // optional, default 500ms
});
```

**Props:**
- `songId`: ID của bài hát
- `initialHeartState`: Trạng thái heart ban đầu
- `debounceDelay`: Thời gian delay cho debouncing (mặc định 500ms)

**Returns:**
- `isHearted`: Trạng thái heart hiện tại
- `isLoading`: Trạng thái loading khi gọi API
- `toggleHeart`: Function để toggle trạng thái heart

### 3. HeartButton Component (`/src/components/custom/heart-button.tsx`)

Component button có thể tái sử dụng cho heart functionality:

```tsx
<HeartButton
  songId="song-id"
  initialHeartState={false}
  size={24}
  debounceDelay={500}
  variant="ghost"
  className="custom-class"
/>
```

### 4. Utility Functions (`/src/lib/heartSongs.ts`)

Các function utility để gọi API:

- `updateHeartSong(songId, isHearted)`: Cập nhật trạng thái heart
- `getHeartStatus(songId)`: Lấy trạng thái heart của bài hát
- `getAllHeartedSongs()`: Lấy tất cả bài hát đã heart (chưa implement)

## Debouncing Strategy

Hệ thống sử dụng debouncing với chiến lược sau:

1. **Immediate UI Update**: UI được cập nhật ngay lập tức khi người dùng click
2. **Debounced API Call**: API call được delay 500ms sau lần click cuối cùng
3. **Error Handling**: Nếu API call thất bại, UI được revert về trạng thái trước đó
4. **Loading State**: Hiển thị loading state trong khi gọi API

## Database Schema

```prisma
model HeartedSongs {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  userId    String   @db.ObjectId
  songId    String   @db.ObjectId
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  Users Users @relation(fields: [userId], references: [id])
  Songs Songs @relation(fields: [songId], references: [id])
}
```

## Cách sử dụng

### 1. Sử dụng HeartButton (Khuyến nghị)

```tsx
import { HeartButton } from "@/components/custom/heart-button";

<HeartButton
  songId={song.id}
  initialHeartState={song.isHearted}
  size={20}
/>
```

### 2. Sử dụng Hook trực tiếp

```tsx
import { useHeartSong } from "@/hooks/useHeartSong";

const { isHearted, isLoading, toggleHeart } = useHeartSong({
  songId: song.id,
  initialHeartState: song.isHearted
});

// Trong JSX
<button onClick={toggleHeart} disabled={isLoading}>
  {isHearted ? "❤️" : "🤍"}
</button>
```

### 3. Gọi API trực tiếp

```tsx
import { updateHeartSong } from "@/lib/heartSongs";

const handleHeart = async () => {
  try {
    const result = await updateHeartSong(songId, true);
    console.log(result.message);
  } catch (error) {
    console.error("Error:", error);
  }
};
```

## Best Practices

1. **Sử dụng HeartButton component** cho consistency
2. **Debounce delay nên từ 300-800ms** để balance giữa responsiveness và performance
3. **Luôn handle error cases** và revert UI state khi cần
4. **Sử dụng loading states** để inform người dùng
5. **Implement optimistic updates** để UX tốt hơn

## Performance Considerations

- Debouncing giảm số lượng API calls khi người dùng click liên tục
- Optimistic updates giúp UI responsive
- Error handling đảm bảo data consistency
- Component memoization có thể được áp dụng cho performance tốt hơn
