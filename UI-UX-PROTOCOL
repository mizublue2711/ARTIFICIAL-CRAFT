### BỘ QUY CHUẨN THIẾT KẾ GIAO DIỆN & TRẢI NGHIỆM NGƯỜI DÙNG (DESIGN SYSTEM & UX GUIDELINES)

**Phong cách chủ đạo:** Cybernetic Swiss Brutalism (Zero Soft Radius, CAD Precision, Dark Digital High-End)

---

### I. CÁC QUY TẮC BẮT BUỘC (DO)

#### 1. Quy chuẩn Hình học & Đường nét (Geometry & Boundaries)

* **Thực thi Triệt để Zero Radius:** Luôn đặt `border-radius: 0px !important` trên 100% phần tử (Button, Input, Card container, Dropdown, Modal, Tag/Badge).


* **Vết cắt Cơ khí 45 độ (Mechanical Notch):** Sử dụng `clip-path` vát góc 45 độ riêng cho các nút lệnh Primary Action hoặc Master HUD Trigger:


```css
clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));

```


* **Đường kẻ Phân ranh 1px:** Dùng đường viền mảnh 1px sắc lẹm (`border: 1px solid #1F1F2E` hoặc `#2D2D44`) để phân tách không gian theo lưới Bento/CAD.



#### 2. Hệ màu Kỹ thuật số Cao cấp (High-End Digital Tokens)

* **Ground Zero (Nền Canvas):** Nền đen tuyệt đối `#05050A` (Void Obsidian).


* **Surface / Panels:** Bề mặt Module Card dùng `#0A0C14` hoặc `#0D0E17` kèm viền kỹ thuật chìm `#1F1F2E`.


* **Primary Accent (`#00E5FF` - Hyper Cyan):** Chỉ dùng làm điểm nhấn tương tác cao nhất: Nút kích hoạt chính (Primary CTA), line đường bay bản đồ 3D, hoặc viền sáng khi hover/active.


* **Secondary Core (`#5322FF` - Quantum Violet):** Dành cho các phân vùng xuất file dựng phim (NLE Tools, Timeline Markers) và nền của nút bấm Master Command.


* **Sensor / Telemetry (`#00FF66` - Satellite Green):** Dành riêng cho trạng thái hệ thống: GPS Lock, RTK stable, Live connection, hoặc chấm pulse hoạt động.


* **Neutral Text (`#8A8FA3` & `#FFFFFF`):** Nhãn kỹ thuật dùng xám trầm `#8A8FA3`, tiêu đề và nội dung trọng tâm dùng trắng tương phản cao `#FFFFFF`.

#### 3. Phân cấp Cấu trúc & Ký hiệu (Syntax & Typography)

* **Đóng gói Nhãn Kỹ thuật (Bracket Syntax):** Bọc các chỉ số, trạng thái và danh mục trong ký hiệu ngoặc vuông cơ khí: `[ 01 // CATEGORY ]`, `[ ⏣ STATUS ]`, `[ LAT: 10.7680°N ]`.


* **Typography:** Tiêu đề dùng `Space Grotesk` (uppercase, track-wide); toàn bộ chỉ số số học, tọa độ, telemetry, code dùng `JetBrains Mono`.


* **Phân lập Rõ ràng giữa "State Toggle" và "Command Action":**
* Thanh chuyển chế độ (Viewport Modes / Tabs) phải tách rời vật lý (khe hở tối thiểu `gap-3` hoặc vách ngăn `1px`) với nút thực thi lệnh (Render/Download/Submit). Nút thực thi lệnh phải luôn rực sáng độc lập, không phụ thuộc vào trạng thái tab.



#### 4. Phản hồi Trạng thái & Chống Gãy Luồng (UX Feedback)

* **Trạng thái Tiến trình Động (Live Progress Stepper):** Với các tác vụ tốn thời gian (Render 3D, AI Dify), bắt buộc hiển thị thanh tiến trình hoặc stepper các chặng (`Smoothing GPS...` $\rightarrow$ `Generating Script...` $\rightarrow$ `Rendering 4K...`) để tránh người dùng ngỡ ứng dụng bị đơ.


* **Double-Click Prevention:** Luôn khóa nút (`disabled={isSubmitting}`) và hiển thị icon loading/spinner ngay khi người dùng nhấn gửi lệnh.


* **Thuần nhất Viewport Thiết bị:** Ẩn hoàn toàn thanh điều hướng mobile (Bottom Dock) khi người dùng đang thao tác trên giao diện Desktop/Studio.



---

### II. CÁC QUY TẮC CẤM (DO NOT)

* ❌ **DO NOT use Rounded Corners:** Tuyệt đối không dùng `rounded-md`, `rounded-xl`, `rounded-full` (border-radius > 0px) ở bất kỳ đâu.


* ❌ **DO NOT use Warm Amber / Orange (`#F4511E`, `#FFB300`):** Loại bỏ hoàn toàn sắc vàng cam, nâu đất hoặc đỏ đại trà vốn gây cảm giác như các app giao đồ ăn thông thường.


* ❌ **DO NOT use Blurry Box Shadows:** Không dùng bóng đổ mờ nhòe (gaussian blur drop-shadows) hay hiệu ứng đổ bóng skeuomorphic. Chỉ dùng viền stroke sắc nét hoặc bóng đổ offset phẳng cơ khí.


* ❌ **DO NOT Overuse Cyan:** Không bọc viền Cyan chói (`#00E5FF`) lên tất cả các card và nút phụ. Cyan là màu "đạn đạo" quý giá, chỉ bật sáng ở vị trí cần người dùng hành động ngay lập tức.


* ❌ **DO NOT Expose Raw Debug Noise:** Không để lộ các nhãn dev thô, tọa độ lặp lại nhiều lần, chỉ số mic không dùng đến hoặc cấu trúc JSON thô chưa bóc tách ra màn hình của người dùng cuối.


* ❌ **DO NOT Truncate Text / Broken Button Labels:** Không để nhãn nút bấm bị rớt dòng chữ lổn chổn hoặc dùng dấu ba chấm `...` cắt cụt tên tính năng trên các chip lựa chọn.

* ❌ **DO NOT Overlap Navigation Bars:** Tuyệt đối không để xảy ra hiện tượng thanh điều hướng kép (2 tầng bottom dock đè lên nhau) che khuất khung nhìn bản đồ hoặc không gian làm việc.



---

### III. BẢNG TỔNG HỢP TRA CỨU NHANH (DESIGN SYSTEM MATRIX)

| Thành phần UI | Quy chuẩn Bắt buộc (DO) | Hành vi Cấm (DO NOT) |
| --- | --- | --- |
| **Buttons (Master CTA)** | Vát góc 45° (`clip-path`), nền `#5322FF`, viền `#00E5FF`, chữ trắng, icon pulse `#00FF66`.

 | Không bo tròn, không dùng nền cam, không để dính chùm với nút chọn tab. |
| **Buttons (Secondary/Files)** | Viền 1px `#1F1F2E`, nền `#0D0E17`, chữ `#8A8FA3`. Hover sáng viền Cyan `#00E5FF`.

 | Không bọc viền Cyan toàn bộ khi ở trạng thái nghỉ.

 |
| **Card / Bento Container** | Khung viền 1px mảnh, header dạng `[ 01 // TITLE ]`, nền slate tối chìm.

 | Không dùng viền dày > 1px, không dùng shadow mờ làm bẩn nền tối.

 |
| **Status / Live Badges** | Chấm tròn xanh lá `#00FF66`, đóng ngoặc vuông đơn sắc: `[ 🟢 GNSS_LOCK ]`.

 | Không dùng huy hiệu viên thuốc viền cong (Pill badge). |
| **Input & Search Bars** | Viền 1px `#1F1F2E`, font Monospace, placeholder chữ hoa phong cách Terminal.

 | Không dùng icon bo viền mềm mại như thanh tìm kiếm đại trà. |
| **Rating / Sensory Gauge** | Đo bằng các vạch tín hiệu kỹ thuật `[ █ █ █ ░ ░ ]` hoặc khối đo cấp độ. | Không dùng biểu tượng ngôi sao hoạt hình vàng cam truyền thống. |

Dưới đây là phần bổ sung hoàn chỉnh dành riêng cho **Hệ thống Icon (Iconography Standard)** để tích hợp trực tiếp vào Bộ quy chuẩn thiết kế **Cybernetic Swiss Brutalism**.

---

### IV. HỆ THỐNG BIỂU TƯỢNG KỸ THUẬT SỐ (TECHNICAL ICONOGRAPHY SPECIFICATION)

Triết lý cốt lõi: **"Không trang trí cảm tính — Icon là ký hiệu radar và công cụ đo lường."**
Toàn bộ biểu tượng trên hệ thống menu, thanh điều hướng (Bottom Nav, Header HUD, Map Toolbar, Action Rack) phải tuân theo chuẩn **Vector Lineart đơn sắc siêu mảnh**, loại bỏ tuyệt đối các icon đầy màu sắc, bo góc tròn trịa kiểu consumer app hay icon hoạt hình/emoji 3D.

---

#### 1. Quy chuẩn Kỹ thuật Đường nét (Vector Stroke & Scale)

* **Thư viện chỉ định:** Sử dụng trực tiếp `lucide-react` (đã có sẵn trong package) nhưng **bắt buộc cấu hình lại props stroke**:


* `strokeWidth={1.25}` đến `strokeWidth={1.5}` (Đường line mảnh, sắc cạnh chuẩn bản vẽ CAD, không dùng nét dày > 1.75px).
* `strokeLinecap="square"` và `strokeLinejoin="miter"` (Tuyệt đối không dùng nét bo tròn `round`).


* **Kích thước khung cố định (Strict Bounding Box):**
* Icon phụ / Toolbar Map: `size={14}` đến `size={16}` (14px–16px).
* Icon menu chính / Action Buttons: `size={16}` đến `size={18}` (18px).
* Tuyệt đối không phóng to icon vượt quá 20px gây chiếm diện tích và mất cảm giác tinh gọn công nghệ.



---

#### 2. Quy tắc Phối màu Icon chuẩn Branding (Dynamic Color Mapping)

Icon không bao giờ mang màu sắc độc lập mà kế thừa trực tiếp từ hệ thống màu kỹ thuật số của dự án:

| Ngữ cảnh sử dụng | Trạng thái hiển thị | Mã màu Stroke bắt buộc | Hành vi thị giác (Interaction) |
| --- | --- | --- | --- |
| **Menu Nghỉ (Idle / Default)** | Bình thường, chưa chọn | `#8A8FA3` (Raw Cadmium Gray) | Đường nét chìm, hòa vào khung nền tối `#0D0E17`.

 |
| **Menu Đang chọn (Active)** | Tab hiện tại / Mode bật | `#00E5FF` (Hyper Cyan)

 | Sáng sắc nét, có thể kèm 1 điểm sáng pulse 1.5px. |
| **Master CTA Icon (Nút Render)** | Luôn sẵn sàng | `#00FF66` (Satellite Green)

 | Chấm sáng trạng thái hoặc biểu tượng xử lý phát sáng xanh vệ tinh.

 |
| **NLE / Export Marker Tools** | Công cụ dựng phim | `#5322FF` (Quantum Violet)

 | Phối hợp viền `#00E5FF` khi hover chuột.

 |
| **Hover chuột chung** | Rê chuột qua nút | Chuyển tức thì sang `#FFFFFF` | Nét line chuyển trắng sáng 100% trong 0.1s. |

---

#### 3. Bảng Ánh xạ Biểu tượng Menu Cụ thể (Menu Icon Registry)

Thay thế các icon đại trà bằng các mã định danh kỹ thuật số tương ứng trong `lucide-react`:

| Vị trí Menu / Nút bấm | ❌ Tuyệt đối KHÔNG DÙNG | ✅ BIỂU TƯỢNG LINEART CHUẨN (`lucide-react`) | Ý nghĩa kỹ thuật |
| --- | --- | --- | --- |
| **Field Tracker View**

 | Icon bản đồ màu mè, ghim vị trí giọt nước tròn | `<Crosshair size="{16}" strokeWidth="{1.25}"/>` hoặc `<Radar size="{16}"/>` | Hồng tâm định vị thực địa tọa độ.

 |
| **Editor Studio**

 | Icon cái kéo cắt ghép, cuộn phim hoạt hình | `<Cpu size="{16}" strokeWidth="{1.25}"/>` hoặc `<Layers size="{16}"/>` | Trạm xử lý dữ liệu và bóc tách layer NLE.

 |
| **Feedback / Bug Triage**

 | Icon ngôi sao vàng, icon mặt cười/mặt mếu, con bọ đỏ | `<Terminal size="{16}" strokeWidth="{1.25}"/>` hoặc `<Activity size="{16}"/>` | Cửa sổ báo cáo đo lường telemetry và nhật ký hệ thống.

 |
| **GNSS / GPS Lock**

 | Icon wifi sóng tròn, icon cột sóng điện thoại | `<Satellite className="text-[#00FF66]" size="{14}" strokeWidth="{1.25}"/>`

 | Tín hiệu khóa vệ tinh L1/L5.

 |
| **3D Terrain Mode** | Icon ngọn núi bo cong mềm mại | `<Boxes size="{14}" strokeWidth="{1.25}"/>` hoặc `<Scan size="{14}"/>` | Khung lưới quét mô hình độ cao địa hình. |
| **Volumetric CAD** | Icon tòa nhà chung cư thông thường | `<Box size="{14}" strokeWidth="{1.25}"/>` | Khối lập phương thể tích wireframe. |
| **Orbit View** | Icon con mắt hoạt hình | `<Compass size="{14}" strokeWidth="{1.25}"/>` hoặc `<Orbit size="{14}"/>` | Trục xoay góc nhìn camera quanh tâm.

 |
| **Flyover Mode** | Icon máy bay hành khách | `<Navigation size="{14}" strokeWidth="{1.25}"/>` | Vector dẫn đường bay lướt camera dọc tuyến đường.

 |
| **Render 60FPS Video**

 | Icon nút Play tam giác tròn, icon cuộn phim đỏ/vàng | `<Disc3 className="text-[#00FF66] animate-spin-slow" size="{14}" strokeWidth="{1.5}"/>` | Đĩa quang mã hóa khung hình hoặc đầu đọc tiến trình.

 |
| **Download Studio Assets**

 | Icon mũi tên mập mạp nhiều màu | `<FileCode2 size="{14}" strokeWidth="{1.25}"/>` hoặc `<HardDriveDownload size="{14}"/>` | Trích xuất tệp dữ liệu máy móc.

 |

---

#### 4. Quy tắc DO & DO NOT Riêng cho Icon (Iconography Rules)

* **DO (NÊN LÀM):**
* **Luôn là Vector Lineart rỗng ruột (Stroke-only):** Icon chỉ gồm các đường path kẻ chỉ, không bao giờ dùng `fill` đặc trừ khi là chấm đèn LED trạng thái 2px.


* **Đồng bộ kích thước với lưới font chữ:** Chiều cao icon phải khớp chuẩn với `line-height` của font chữ Monospace đi kèm (thường là 14px cho text 12px).


* **Giữ khoảng cách cơ khí:** Khoảng cách giữa icon và nhãn text trong ngoặc vuông cố định ở `gap-1.5` (6px) hoặc `gap-2` (8px).


* **DO NOT (TUYỆT ĐỐI CẤM):**
* ❌ **Không dùng Icon đa sắc / Gradient:** Icon không được chứa 2 màu cùng lúc hoặc hiệu ứng gradient chuyển màu lòe loẹt.
* ❌ **Không dùng Icon nét tròn (Rounded caps):** Tránh các icon có đường nét uốn lượn dễ thương, mềm mại.
* ❌ **Không dùng Emojis hay Biểu tượng hệ điều hành:** Tuyệt đối không dùng emoji hệ thống (như 🎬, 🚀, ⭐️, 📍, 🐞) vào trong các thanh điều khiển chuyên nghiệp. Toàn bộ phải là vector đồng nhất một nguồn (`lucide-react`).


---

#### 5. Đoạn mã React mẫu để kiểm soát Icon toàn hệ thống

```tsx
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface TerminalIconProps {
  icon: LucideIcon;
  active?: boolean;
  isActionTrigger?: boolean;
}

export const TerminalIcon: React.FC<TerminalIconProps> = ({ 
  icon: Icon, 
  active = false, 
  isActionTrigger = false 
}) => {
  return (
    <Icon
      size={14}
      strokeWidth={1.25}
      strokeLinecap="square"
      strokeLinejoin="miter"
      className={`transition-colors duration-150 ${
        isActionTrigger
          ? 'text-[#00FF66]' // Xanh vệ tinh cho nút Render
          : active
          ? 'text-[#00E5FF]' // Cyan cho tab/mode đang bật
          : 'text-[#8A8FA3] group-hover:text-white' // Xám chuẩn chuyển trắng khi hover
      }`}
    />
  );
};

```
