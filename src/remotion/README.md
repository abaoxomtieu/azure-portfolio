# Remotion Demo Video

Video demo ứng dụng Azure Portfolio được tạo bằng Remotion.

## Cài đặt

1. Đảm bảo đã cài đặt các dependencies:
```bash
npm install
```

2. Thêm file âm thanh click vào `public/sounds/click.mp3`

Bạn có thể tải file click sound miễn phí từ:
- https://freesound.org/people/NenadSimic/sounds/157539/
- https://pixabay.com/sound-effects/search/button-click/
- https://www.freesoundslibrary.com/button-click-sound-effect/

## Sử dụng

### Xem preview trong Remotion Studio
```bash
npm run remotion:studio
```

### Render video
```bash
npm run remotion:render
```

Video sẽ được render vào thư mục `out/video.mp4`

## Tính năng

- ✅ Hero section với animation
- ✅ Navigation click với hiệu ứng zoom
- ✅ Certifications section với card animations
- ✅ Practice Architecture section
- ✅ Team section
- ✅ Contact section
- ✅ Click sound effects khi click buttons
- ✅ Zoom effects trên các interactions

## Cấu trúc

- `Root.tsx` - Định nghĩa composition
- `AppDemo.tsx` - Composition chính với tất cả các scenes
