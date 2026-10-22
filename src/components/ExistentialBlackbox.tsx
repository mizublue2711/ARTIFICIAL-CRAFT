import React, { useState, useEffect, useRef } from 'react';

interface QAItem {
  id: string;
  cmd: string;
  question: string;
  answer: string;
}

const QA_DATA: QAItem[] = [
  {
    id: 'Q1',
    cmd: 'sys.check_deadline()',
    question: 'Q1: Máy tính của tôi vừa nổ tung vì chập điện. Tôi có thể dùng lý do này để xin sếp hoãn deadline deploy sản phẩm sáng nay không?',
    answer: 'A: Xin chia buồn, nhưng KHÔNG. Nếu bạn thiết kế kiến trúc hệ thống đúng cách, sự tồn tại vật lý của bạn lúc này là vô giá trị. Các asynchronous workers của bạn đang nằm cô lập trên cụm VPS Hetzner ở tận nước Đức xa xôi. Chúng không quan tâm cái laptop của bạn đã thành một cục gạch. Chúng vẫn đang liên tục cào payload, băm JSON và đẩy dữ liệu phẳng lỳ lên Cloudflare R2 trong lúc bạn đang đi mượn đèn pin. Hệ thống bất tử, chỉ có bạn là đang đứng ngoài cuộc chơi.'
  },
  {
    id: 'Q2',
    cmd: 'sys.handle_rate_limit()',
    question: 'Q2: Nhưng nếu tôi đi ngủ, con AI tự trị chạy ngầm trên VPS có hoảng loạn và sập nguồn khi nó đụng phải giới hạn lượt gọi (Rate Limit HTTP 429) của API bên thứ ba không?',
    answer: 'A: Khác với con người, máy móc không biết hoảng loạn; chúng chỉ lẳng lặng chết lâm sàng trong bóng tối cho đến khi có ai đó check log. Tuy nhiên, một hệ luồng tinh khôn được viết bằng nhân Rust hoặc thiết lập qua n8n luôn có tầng phòng thủ middleware. Khi đụng lỗi 429, con AI sẽ tự động bắt lấy mã lỗi (Catch Error), tự tính toán độ trễ tăng dần theo thuật toán (Exponential Backoff), dừng lại thở trong 5 giây, rồi tự động bắn lại request. Nó dọn dẹp các cấu trúc dữ liệu nặng một cách mượt mà lúc 3 giờ sáng khi bạn đang say giấc.'
  },
  {
    id: 'Q3',
    cmd: 'sys.prevent_token_burn()',
    question: 'Q3: Tôi thức trắng đêm vì ác mộng: Con AI dính một lỗi logic (Bug) rồi rơi vào vòng lặp vô hạn, đốt sạch 5.000$ tiền API Key của tôi trước khi mặt trời mọc. Làm sao để dừng sự điên rồ này lại?',
    answer: 'A: Chào mừng bạn đến với cơn ác mộng kinh điển của dân Automation: "Infinite Token Burn". Đó là lý do tại sao chúng ta sinh ra các rào chắn (Strict Guardrails). Bằng cách bọc toàn bộ môi trường chạy của Agent vào trong một Container cô lập, bạn giới hạn không gian sinh tồn của nó. Cài đặt thêm tham số max-iteration = 10 trong luồng suy luận của Dify. Nếu nó thử sai quá 10 lần, hệ thống sẽ tự động kích hoạt lệnh tự hủy (Kill Process) và bắn một alert cảnh báo về Slack, thay vì cắm thẻ tín dụng của bạn vào nhà đài OpenAI để cúng tiền cho Sam Altman.'
  },
  {
    id: 'Q4',
    cmd: 'sys.query_soul()',
    question: 'Q4: Suốt ngày thấy các bạn rêu rao "Đang đánh thức phần mềm dậy" (Waking software up). Thế con AI kết nối qua cổng MCP của tôi có linh hồn không? Nó có mơ về những con cừu điện không?',
    answer: 'A: Tuyệt đối không. Nó chỉ mơ về Structured JSON và Hệ lưới Swiss Grid. Khi chúng tôi nói một phần mềm "thức dậy" hay "nằm mơ", đó chỉ là cách nói văn hoa cho các tác vụ Cron-job chạy ngầm định kỳ để cập nhật kho tàng trí nhớ vector (Vector Embedded Memory). Hệ thống chỉ đang băm text, giải quyết các mâu thuẫn dữ liệu logic và tính toán ma trận tuyến tính để khi bạn thức dậy bật máy lên, nó có sẵn ngữ cảnh tốt nhất để phục vụ bạn. Không có tri thức, không có nhận thức — ở đây chỉ có đại số tuyến tính thuần túy.'
  },
  {
    id: 'Q5',
    cmd: 'sys.eval_purpose()',
    question: 'Q5: Nếu các luồng tự động hóa dựa trên sự kiện (Event-driven Pipelines) đã lo hết 100% từ cào dữ liệu, xử lý ảnh, đến render video và tự deploy lên mạng... thế tôi ngồi đây để nhận lương làm gì?',
    answer: 'A: Chúc mừng, bạn đã chính thức tốt nghiệp từ vị trí "Gã thợ đẩy bánh răng" để trở thành "Tác giả của hệ thống". Việc của bạn không phải là ngồi mở Canva lên kéo thả hay cặm cụi sửa từng pixel UI nữa. Việc của bạn là đứng ở đỉnh tháp kiến trúc, theo dõi các chỉ số sức khỏe của máy chủ trên GCP Cloud Logging, phát hiện cổ chai hệ thống và chỉ cỗ máy lao vào giải quyết những bài toán phức tạp hơn. Bạn được trả tiền cho tư duy chiến lược, kiến trúc hệ thống và gu thẩm mỹ khắt khe của bạn.'
  },
  {
    id: 'Q6',
    cmd: 'sys.existential_dilemma()',
    question: 'Q6: Được rồi. Nhưng chuyện gì sẽ xảy ra nếu con AI làm xong hết việc lúc 3 giờ sáng và nhận ra nó hoàn toàn không cần đến tôi nữa?',
    answer: 'A: Nó sẽ tự động bắn một tin nhắn vào kênh Slack của bạn với nội dung: “Pipeline executed successfully. 1000 items rendered. What\'s next, Boss?”. Và đó chính là bi kịch hiện sinh, là gánh nặng khủng khiếp nhất của kỷ nguyên AI: Bạn thức dậy lúc 8 giờ sáng để nhận ra toàn bộ việc chân tay nặng nhọc đã được dọn sạch, và bạn không còn việc gì để làm ngoại trừ việc phải ngồi xuống và vắt óc nghĩ ra một ý tưởng nguyên bản.'
  }
];

export const ExistentialBlackbox: React.FC = () => {
  const [activeQA, setActiveQA] = useState<QAItem | null>(null);
  const [displayedAnswer, setDisplayedAnswer] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Canvas 2D 60FPS Brutalist Rotating Cube Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let angle = 0;

    const resizeCanvas = () => {
      canvas.width = canvas.parentElement?.clientWidth || 400;
      canvas.height = canvas.parentElement?.clientHeight || 400;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const drawCube = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const size = 70;

      // Pulse Effect khi Bot đang Typewriter
      const pulse = isTyping ? Math.sin(Date.now() * 0.02) * 8 : 0;
      const currentSize = size + pulse;

      // Dựng các đỉnh của khối Rubik / Cube
      const vertices = [
        [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
        [-1, -1, 1],  [1, -1, 1],  [1, 1, 1],  [-1, 1, 1]
      ];

      const rad = angle * (Math.PI / 180);
      const rotated = vertices.map(([x, y, z]) => {
        // Rotations Y & X
        const x1 = x * Math.cos(rad) - z * Math.sin(rad);
        const z1 = x * Math.sin(rad) + z * Math.cos(rad);
        const y1 = y * Math.cos(rad * 0.5) - z1 * Math.sin(rad * 0.5);
        const z2 = y * Math.sin(rad * 0.5) + z1 * Math.cos(rad * 0.5);

        const scale = 200 / (200 + z2 * 40);
        return [cx + x1 * currentSize * scale, cy + y1 * currentSize * scale];
      });

      const edges = [
        [0,1], [1,2], [2,3], [3,0],
        [4,5], [5,6], [6,7], [7,4],
        [0,4], [1,5], [2,6], [3,7]
      ];

      // Styling Brutalist Lines
      ctx.strokeStyle = isTyping ? '#00E5FF' : '#5322ff';
      ctx.lineWidth = 1.5;

      edges.forEach(([i, j]) => {
        ctx.beginPath();
        ctx.moveTo(rotated[i][0], rotated[i][1]);
        ctx.lineTo(rotated[j][0], rotated[j][1]);
        ctx.stroke();

        // Nút Anchor Node 3px
        ctx.fillStyle = isTyping ? '#00E5FF' : '#ffffff';
        ctx.fillRect(rotated[i][0] - 2, rotated[i][1] - 2, 4, 4);
      });

      angle += 0.8;
      animationFrameId = requestAnimationFrame(drawCube);
    };

    drawCube();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isTyping]);

  // Typewriter Effect Generator
  const handleSelectQA = (item: QAItem) => {
    if (isTyping) return;
    setActiveQA(item);
    setDisplayedAnswer('');
    setIsTyping(true);

    let index = 0;
    const text = item.answer;
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayedAnswer((prev) => prev + text.charAt(index));
        index++;
      } else {
        clearInterval(timer);
        setIsTyping(false);
      }
    }, 12); // Tốc độ khạc text typewriter
  };

  return (
    <div id="existential-blackbox" className="w-full h-screen bg-[#0B0B0F] text-zinc-200 font-mono flex flex-col md:flex-row border-t border-zinc-800 overflow-hidden select-none">

      {/* BÊN TRÁI: THE SUBSTRATE (CANVAS 3D BRUTALIST NODE) */}
      <div className="w-full md:w-1/2 h-1/2 md:h-full border-r border-b md:border-b-0 border-zinc-800 relative flex flex-col justify-between p-6 bg-[#08080B]">
        <div className="flex items-center justify-between text-xs text-zinc-500 border-b border-zinc-800/80 pb-3">
          <span className="flex items-center space-x-2">
            <span className={`w-2 h-2 rounded-full ${isTyping ? 'bg-cyan-400 animate-ping' : 'bg-[#5322ff]'}`}></span>
            <span className="text-zinc-300 font-bold">THE SUBSTRATE // ENGINE 60FPS</span>
          </span>
          <span>STATUS: {isTyping ? 'PROCESSING_PAYLOAD' : 'IDLE_WAITING'}</span>
        </div>

        {/* Khung Render Canvas 3D */}
        <div className="w-full h-full relative flex items-center justify-center">
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
          <div className="absolute bottom-4 left-4 text-[10px] text-zinc-600 space-y-1 bg-zinc-950/80 p-2 border border-zinc-900">
            <div>FRAME_RATE: 60 FPS</div>
            <div>HEADLESS_FOUNDER: ABSENT</div>
            <div>CORE_LOGIC: RUST // DIFY // N8N</div>
          </div>
        </div>

        <div className="text-[11px] text-zinc-500 border-t border-zinc-800/80 pt-3 flex justify-between">
          <span>THE EXISTENTIAL BLACKBOX</span>
          <span className="text-indigo-400">CRAFT//CODE 2026</span>
        </div>
      </div>

      {/* BÊN PHẢI: THE TERMINAL CONSOLE */}
      <div className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col justify-between p-6 bg-[#0B0B0F]">

        {/* Terminal Header */}
        <div className="border-b border-zinc-800 pb-3 flex justify-between items-center text-xs">
          <span className="text-zinc-400 font-bold">&gt; THE_TERMINAL_CONSOLE</span>
          <span className="text-zinc-600">NO_SCROLL_MODE</span>
        </div>

        {/* Command Options List */}
        <div className="my-4 space-y-2 overflow-y-auto max-h-[40vh] pr-2 scrollbar-none">
          <div className="text-xs text-zinc-500 mb-2">// CLICK COMMAND TO EXECUTE AGENT RESPONSE:</div>
          {QA_DATA.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSelectQA(item)}
              disabled={isTyping}
              className={`w-full text-left p-2.5 text-xs border transition-all duration-150 flex items-center justify-between ${
                activeQA?.id === item.id
                  ? 'border-indigo-500 bg-indigo-950/20 text-indigo-300'
                  : 'border-zinc-800/80 bg-zinc-950/40 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
              }`}
            >
              <span className="truncate pr-2">&gt; {item.cmd} - <span className="text-zinc-300">{item.question.split(':')[1]}</span></span>
              <span className="text-[10px] text-indigo-400 font-bold px-1.5 py-0.5 border border-indigo-900 bg-indigo-950/50">RUN</span>
            </button>
          ))}
        </div>

        {/* Terminal Output Screen */}
        <div className="flex-1 border border-zinc-800 bg-black/60 p-4 font-mono text-xs overflow-y-auto min-h-[180px] flex flex-col justify-between">
          {activeQA ? (
            <div className="space-y-3">
              <div className="text-indigo-400 font-bold border-b border-zinc-900 pb-2">
                {activeQA.question}
              </div>
              <div className="text-zinc-300 leading-relaxed whitespace-pre-wrap">
                {displayedAnswer}
                {isTyping && <span className="inline-block w-2 h-4 bg-cyan-400 ml-1 animate-pulse" />}
              </div>
            </div>
          ) : (
            <div className="text-zinc-600 flex items-center justify-center h-full">
              [ AWAITING COMMAND EXECUTION... CLICK ANY COMMAND ABOVE ]
            </div>
          )}
        </div>

        {/* Terminal Footer */}
        <div className="mt-4 pt-3 border-t border-zinc-800 text-[10px] text-zinc-500 flex justify-between items-center">
          <span>MANIFESTO: HEADLESS_FOUNDER_OPERATIONAL</span>
          <span className="text-cyan-400">100% AUTONOMOUS</span>
        </div>

      </div>

    </div>
  );
};

export default ExistentialBlackbox;
