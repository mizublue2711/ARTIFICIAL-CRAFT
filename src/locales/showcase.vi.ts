import { ShowcaseTranslations } from '@/types/showcase';

export const showcaseVi: ShowcaseTranslations = {
  sectionBadge: '[ HỒ SƠ NĂNG LỰC // CỖ MÁY 3D & MOTION ]',
  sectionTitle: 'HỒ SƠ DỰ ÁN // CÁC ỨNG DỤNG 3D & WEBAPP TƯƠNG TÁC',
  sectionSubtitle:
    'Phân tích kỹ thuật thực chiến trên các sản phẩm WebGL 3D không gian, mô phỏng vật lý, dựng video tự động và giao diện CAD điều khiển.',
  badgeOperational: '[ TRẠNG THÁI: HOẠT ĐỘNG ]',
  contextObstacle: 'Bối cảnh & Bài toán',
  technicalObstacle: 'Trở ngại kỹ thuật',
  coreSolution: 'Giải pháp cốt lõi',
  behindTheScenes: '3 Trụ cột hậu trường',
  strategy: 'Chiến lược',
  execution: 'Kỹ thuật thực thi',
  impact: 'Hiệu quả bàn giao',
  launchLiveApp: 'Mở WebApp 3D ↗',
  viewDemo: 'Xem Demo Trực Tiếp ➔',
  metricLabel: 'Chỉ số ấn tượng',
  debriefTag: 'HỒ SƠ BÀN GIAO DỰ ÁN',
  projects: {
    'puffy-3d-creative-engine': {
      title: 'Phòng Trưng Bày Đệm 3D & Cỗ Máy Sáng Tạo Nội Thất',
      about:
        'Showroom phòng ngủ 3D tương tác trên trình duyệt, cho phép khách hàng ấn thử độ đàn hồi của đệm, soi cấu trúc lò xo bên trong và xuất ảnh quảng cáo sắc nét trong 5 giây.',
      impressiveMetric:
        'Trải nghiệm 3D mượt mà 60 FPS, chụp ảnh sản phẩm không lỗi màn hình đen và đổi chất liệu đệm siêu tốc dưới 60ms.',
      contextObstacle:
        'Xóa bỏ rào cản e ngại của khách hàng khi mua đệm online (không được chạm thử) và giải quyết chi phí chụp ảnh studio tốn kém bằng cách đưa trải nghiệm thử độ đàn hồi đệm chân thực lên web.',
      technicalObstacle:
        'Trình duyệt điện thoại tự động xóa bộ nhớ đệm WebGL sau khi render khiến ảnh chụp màn hình bị đen xì, đồng thời giật lag khung hình khi đổi màu vật liệu đệm liên tục.<br><br>Đảm bảo tính chân thực của vải đệm trên nhiều kích thước màn hình mà không làm phình to dung lượng tải trang.',
      coreSolution:
        'Phát triển cơ chế Two-Pass chụp đệm đồng bộ trong 1 khung hình duy nhất và bộ hoán đổi vật liệu PBR cực nhanh dưới 60 mili-giây.',
      behindTheScenes: {
        strategicAngle:
          'Trải nghiệm khách hàng: Bấm thử độ lún đệm trực quan ngay trên điện thoại với phản hồi vật lý mềm mại chuẩn 60 FPS.',
        technicalAngle:
          'Bóc tách cấu trúc: Bấm 1 nút để xem từng lớp lò xo túi, gel làm mát và mút hoạt tính mở bung ra trong không gian 3D.',
        deliverableAngle:
          'Tự động hóa tiếp thị: 1-click xuất ảnh sản phẩm nền trong suốt $0 chi phí studio chỉ trong 5 giây, tiết kiệm hàng nghìn USD chi phí chụp ảnh thực tế.',
      },
    },
    'spatial-uiux-tactical-cad-systems': {
      title: 'Thành Phố Dữ Liệu 3D Metropolis & Hệ Thống CAD Không Gian',
      about:
        'Biến những bảng tính tài chính Excel khô khan thành một thành phố 3D tương tác chạy mượt mà 60 FPS, trực quan hóa lãi lỗ doanh nghiệp theo chiều sâu không gian.',
      impressiveMetric:
        'Hệ thống Cybernetic Brutalism chuẩn xác từng pixel, hỗ trợ quy trình đa tab và hiển thị dữ liệu 3D mượt mà 60 FPS.',
      contextObstacle:
        'Báo cáo tài chính doanh nghiệp dạng bảng tính và file PDF phẳng khiến người xem mệt mỏi, khó nhận diện rủi ro khi có hàng trăm danh mục lỗ tiềm ẩn nằm rải rác.',
      technicalObstacle:
        'Hiển thị hàng nghìn khối nhà dữ liệu 3D trên trình duyệt ngốn RAM và gây sụt khung hình trầm trọng nếu dùng phương pháp vẽ vật thể thông thường.<br><br>Giao diện người dùng tiêu chuẩn thường lạm dụng hiệu ứng đổ bóng mờ ảo, làm mờ nhạt các chỉ số đo lường trọng yếu của hệ thống.',
      coreSolution:
        'Sử dụng công nghệ Three.js InstancedMesh để gom toàn bộ thành phố vào 1 lệnh vẽ duy nhất, tạo hiệu ứng các mảng lỗ sụt lún xuống hang ngầm màu đỏ cảnh báo (Sink of Shame).',
      behindTheScenes: {
        strategicAngle:
          'Kỷ luật thiết kế CAD: Loại bỏ các chi tiết bo tròn thừa thãi, dùng viền 1px sắc nét và màu sắc điện tử tương phản cao để làm nổi bật số liệu quan trọng.',
        technicalAngle:
          'Tối ưu hóa hiệu năng: Công nghệ kết xuất 1 bước giúp hiển thị hơn 50 bảng tài chính đồng thời mà không tốn chi phí thuê server render.',
        deliverableAngle:
          'Trực quan hóa tài chính: Kết nối trực tiếp với Google Sheets, tự động cập nhật độ cao tòa nhà theo lợi nhuận và cung cấp chế độ đối đầu 3D so sánh số liệu.',
      },
    },
    'robotics-factory-3d': {
      title: 'Nhà Máy Robot 3D & Mô Phỏng Động Học Kỹ Thuật',
      about:
        'Mô phỏng cánh tay robot công nghiệp 11 bậc tự do trong không gian 3D, hỗ trợ bóc tách từng chi tiết máy và theo dõi thông số kỹ thuật thời gian thực.',
      impressiveMetric:
        'Mô hình bóc tách chi tiết chuyển động 60 FPS với 11 bậc tự do và giả lập quét 50.000 điểm cảm biến LiDAR.',
      contextObstacle:
        'Các bản vẽ CAD 2D và mô hình tĩnh không thể hiện được phạm vi xoay, va chạm góc và độ chịu lực cơ khí của robot khi hoạt động thực tế trên dây chuyền sản xuất.',
      technicalObstacle:
        'Kết xuất mô hình cơ khí phức tạp hàng triệu đa giác cùng hệ thống khớp nối liên động gây đơ lag trình duyệt trên máy tính văn phòng và điện thoại.',
      coreSolution:
        'Tối ưu hóa thuật toán động học nghịch đảo (IK) nhẹ nhàng trên WebGL và tạo thanh trượt giải phẫu 4 giai đoạn mở bung các khớp theo đường cong Bezier.',
      behindTheScenes: {
        strategicAngle:
          'Bản sao số (Digital Twin): Thay thế file xuất CAD tĩnh bằng mô hình tương tác trực quan giúp kỹ sư kiểm tra lắp ráp mọi lúc mọi nơi.',
        technicalAngle:
          'Mô phỏng cảm biến LiDAR: Tận dụng GPU shader để tái hiện chùm quét 50.000 điểm quang học kiểm tra vật thể trong nhà máy.',
        deliverableAngle:
          'Giao diện đo lường HUD: Hiển thị bảng điều khiển góc xoay chuẩn ROS2/Python ngay trên giao diện web để theo dõi tiến độ vận hành.',
      },
    },
    'project-98': {
      title: 'Project 98 — Nâng Tầm Nông Sản & Nhận Diện Bao Bì Xuất Khẩu',
      about:
        'Chuyển đổi sầu riêng thô Lâm Đồng thành sản phẩm tiêu dùng cao cấp, chuẩn hóa nhận diện bao bì đáp ứng nghiêm ngặt tiêu chuẩn xuất khẩu sang thị trường tỷ dân.',
      impressiveMetric:
        'Giảm 20% thời gian xử lý vận hành của đội ngũ và hạ tỷ lệ yêu cầu chỉnh sửa từ khách hàng xuống dưới 15%.',
      contextObstacle:
        'Nông sản xuất khẩu thường rơi vào cảnh "được mùa mất giá" do bán thô, thiếu thương hiệu chuẩn quốc tế và hay bị tắc nghẽn thông quan vì sai lệch quy cách bao bì.',
      technicalObstacle:
        'Quy chuẩn in ấn và nhãn mác xuất khẩu xuyên biên giới đòi hỏi độ chính xác tuyệt đối; sai sót nhỏ về thông tin dinh dưỡng hoặc khuôn dao bế có thể khiến cả lô hàng bị giữ lại.<br><br>Quản lý luồng giao tiếp giữa đội ngũ thiết kế trong nước và đối tác phân phối nước ngoài dễ phát sinh chậm trễ.',
      coreSolution:
        'Xây dựng hệ thống hình vẽ minh họa thủ công độc bản kết hợp bộ khuôn bế chuẩn kỹ thuật và quy trình kiểm duyệt tự động hóa bằng Python.',
      behindTheScenes: {
        strategicAngle:
          'Định vị thị trường: Nâng cấp giá trị nông sản bản địa thành hàng tiêu dùng cao cấp sẵn sàng cạnh tranh trên quầy kệ siêu thị quốc tế.',
        technicalAngle:
          'Chuẩn hóa bình bản in: Đảm bảo 100% tài liệu thiết kế và bao bì đạt chuẩn in ấn công nghiệp khắt khe trước khi chuyển giao xưởng sản xuất.',
        deliverableAngle:
          'Tự động hóa phối hợp: Quản lý đội ngũ thiết kế liên quốc gia qua kịch bản tự động hóa, giúp rút ngắn thời gian bàn giao dự án.',
      },
    },
    'vibepath-gps-3d-map-pipeline': {
      title: 'Nền Tảng VibePath — Tự Động Hóa Video Lộ Trình 3D',
      about:
        'Công cụ tự động biến dữ liệu GPS điện thoại thành video mô phỏng cung đường 3D điện ảnh 60 FPS kèm phụ đề song ngữ Anh-Việt chỉ trong 45 giây.',
      impressiveMetric:
        'Rút ngắn quy trình làm video lộ trình thủ công từ 4-8 tiếng xuống còn 45 giây tự động hoàn toàn.',
      contextObstacle:
        'Các nhà sáng tạo nội dung du lịch phải mất hàng giờ ngồi chấm thủ công từng điểm tọa độ trên bản đồ, sửa rung lắc GPS và gõ phụ đề video từng câu một.',
      technicalObstacle:
        'Tọa độ GPS từ điện thoại thường bị nhảy vị trí lung tung do mất sóng, làm camera 3D giật lắc dữ dội khi bay theo lộ trình.<br><br>Xử lý đồng thời cả bước dựng 3D lẫn gọi AI phân tích địa điểm dễ làm nghẽn kết nối máy chủ.',
      coreSolution:
        'Xây dựng dịch vụ FastAPI dùng thuật toán làm mịn Cubic B-Spline để tính toán góc quay camera mượt mà, kết hợp AI tạo phụ đề song ngữ thích ứng văn phong.',
      behindTheScenes: {
        strategicAngle:
          'Khử rung tọa độ: Thuật toán làm mượt giúp đường đi GPS uốn lượn tự nhiên như góc quay flycam chuyên nghiệp.',
        technicalAngle:
          'Tốc độ xử lý chớp nhoáng: Tự động tải tracklog, dựng hình và trả kết quả video kèm mốc thời gian YouTube chỉ sau 1 cú nhấp chuột.',
        deliverableAngle:
          'Trợ lý biên dịch AI: Sử dụng Gemini Flash để dịch phụ đề chuẩn ngữ cảnh du lịch địa phương mà không cần người chỉnh sửa lại.',
      },
    },
    'video-as-code-remotion-pipeline': {
      title: 'Cỗ Máy Sản Xuất Video Bằng Mã Nguồn (Remotion)',
      about:
        'Tự động hóa sản xuất hàng trăm video quảng cáo từ file bảng tính Excel/CSV bằng các thành phần React, không cần mở phần mềm After Effects.',
      impressiveMetric:
        'Độ chính xác render 99.99% không sai lệch thiết kế, xuất hàng loạt video trên điện toán đám mây trong vài phút.',
      contextObstacle:
        'Mỗi mùa khuyến mãi hoặc chiến dịch sản phẩm mới, chuyên viên dựng phim phải làm lặp đi lặp lại hàng trăm video cùng mẫu chỉ khác ảnh và giá, gây quá tải và chậm tiến độ.',
      technicalObstacle:
        'Các thư viện web thông thường dùng đồng hồ CPU để chạy hiệu ứng, khiến video render ra bị lệch nhịp âm thanh hoặc giật hình khi máy tính bận xử lý.<br><br>Dữ liệu sản phẩm bị thiếu trường dễ làm sập toàn bộ quy trình render hàng loạt giữa chừng.',
      coreSolution:
        'Kiến trúc Video-as-Code tính toán chuyển động chính xác theo từng số thứ tự khung hình (frame), kết hợp Zod kiểm tra dữ liệu đầu vào để chống lỗi render.',
      behindTheScenes: {
        strategicAngle:
          'Sản xuất hàng loạt: Thay thế thao tác kéo thả thủ công bằng mã nguồn React liên kết dữ liệu bảng tính.',
        technicalAngle:
          'Đồng bộ tuyệt đối: Khung hình nào có chuyển động gì đều được tính toán bằng toán học xác định, loại bỏ hoàn toàn hiện tượng lệch tiếng.',
        deliverableAngle:
          'Mở rộng đám mây: Triển khai render tự động trên Google Cloud Run giúp xuất cả lô video chất lượng cao sẵn sàng chạy quảng cáo.',
      },
    },
    'australia-experiences': {
      title: 'Australia Experiences — Tái Định Vị Thương Hiệu Du Lịch',
      about:
        'Chiến dịch tái nhận diện và xây dựng hệ thống video ngắn trên mạng xã hội cho các doanh nghiệp dịch vụ nhà hàng, khách sạn truyền thống tại Sydney.',
      impressiveMetric:
        'Xử lý hơn 100GB dữ liệu thô, hoàn thành trong thời hạn 400 giờ với 100% âm nhạc sản xuất riêng.',
      contextObstacle:
        'Nhiều thương hiệu lâu năm có chất lượng dịch vụ tốt nhưng chưa có hiện diện số, thiếu bộ nhận diện nhất quán trên Instagram, TikTok và YouTube.',
      technicalObstacle:
        'Nguồn tư liệu hình ảnh ban đầu rời rạc và không đồng bộ, trong khi thời gian sản xuất video quảng bá rất gấp gáp.<br><br>Khối lượng cảnh quay thô khổng lồ đòi hỏi tốc độ biên tập và dựng hình cực nhanh.',
      coreSolution:
        'Xây dựng hệ thống lưới nội dung mạng xã hội từ đầu và quy trình dựng video tinh gọn chỉ mất 4 giờ cho mỗi video hoàn chỉnh.',
      behindTheScenes: {
        strategicAngle:
          'Nhận diện thương hiệu nhanh: Tạo logo, bảng màu và phong cách thị giác đồng bộ phản ánh đúng tinh thần của từng điểm đến.',
        technicalAngle:
          'Quy trình hậu kỳ tối ưu: Kết hợp DaVinci Resolve để chỉnh màu điện ảnh và After Effects tạo chuyển động chữ bắt mắt.',
        deliverableAngle:
          'Tăng tương tác thực: Cung cấp thư viện nội dung ngắn chuẩn định dạng dọc giúp doanh nghiệp thu hút lượng khách hàng trẻ tuổi.',
      },
    },
    'the-growth-agency': {
      title: 'The Growth Agency — Trung Tâm Sản Xuất Tài Sản Tăng Trưởng',
      about:
        'Đảm nhiệm vai trò cỗ máy sản xuất sáng tạo chủ lực cho agency tiếp thị số tại Úc, điều phối đội ngũ tại TP.HCM thực hiện các chiến dịch đa kênh quy mô lớn.',
      impressiveMetric:
        'Hơn 30 bộ nhận diện logo đưa vào ứng dụng thực tế và hàng trăm chiến dịch tiếp thị số thành công.',
      contextObstacle:
        'Khối lượng yêu cầu thiết kế quảng cáo cho thị trường quốc tế đổ về dồn dập với nhiều múi giờ khác nhau, dễ gây tắc nghẽn và chậm tiến độ bàn giao.',
      technicalObstacle:
        'Việc kiểm soát chất lượng đồng đều và quản lý phiên bản tài nguyên thiết kế giữa các thành viên ở xa gặp nhiều khó khăn.<br><br>Sự khác biệt ngôn ngữ và văn hóa đòi hỏi kỷ luật kiểm tra gắt gao trước khi xuất bản.',
      coreSolution:
        'Chuẩn hóa quy trình bàn giao tài sản thiết kế và áp dụng các công cụ tự động hóa khâu đóng gói tệp tin cho in ấn và kỹ thuật số.',
      behindTheScenes: {
        strategicAngle:
          'Điều phối sản xuất từ xa: Lãnh đạo đội ngũ sáng tạo linh hoạt tại Việt Nam phục vụ khách hàng toàn cầu một cách trơn tru.',
        technicalAngle:
          'Dịch vụ trọn gói toàn diện: Phụ trách từ ý tưởng nhận diện thương hiệu, thiết kế đồ họa đến sản xuất video quảng cáo đa nền tảng.',
        deliverableAngle:
          'Quy chuẩn tài sản khắt khe: Thiết lập hệ thống lưu trữ và quản lý file khoa học giúp giảm tối đa lỗi sai khi phát hành ấn phẩm.',
      },
    },
  },
};
