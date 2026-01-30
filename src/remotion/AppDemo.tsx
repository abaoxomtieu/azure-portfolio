import {
	AbsoluteFill,
	Sequence,
	useCurrentFrame,
	useVideoConfig,
	interpolate,
	spring,
	Easing,
	Img,
} from "remotion";
import { Audio } from "@remotion/media";
import { staticFile } from "remotion";
import { MarkdownRenderer } from "./MarkdownRenderer";

const FPS = 30;

// Scene durations in seconds
const HERO_DURATION = 3;
const NAV_CLICK_DURATION = 1;
const CERTS_DURATION = 4;
const CERT_DETAIL_DURATION = 5; // New detail scene
const PRACTICE_DURATION = 4;
const TEAM_DURATION = 3;
const CONTACT_DURATION = 3;

// Calculate frame positions
const heroStart = 0;
const navClickStart = heroStart + HERO_DURATION * FPS;
const certsStart = navClickStart + NAV_CLICK_DURATION * FPS;
const certDetailStart = certsStart + CERTS_DURATION * FPS;
const practiceStart = certDetailStart + CERT_DETAIL_DURATION * FPS;
const teamStart = practiceStart + PRACTICE_DURATION * FPS;
const contactStart = teamStart + TEAM_DURATION * FPS;

export const AppDemo: React.FC = () => {
	const { fps } = useVideoConfig();

	// Calculate absolute click frames for audio
	const navClickAudioFrame = navClickStart;
	const certsClickFrames = [certsStart + fps * 2, certsStart + fps * 2 + 10, certsStart + fps * 2 + 20, certsStart + fps * 2 + 30, certsStart + fps * 2 + 40, certsStart + fps * 2 + 50];
	const certDetailClickFrame = certsStart + fps * 2 + 20; // Click on AI-102 card
	const practiceClickFrames = [practiceStart + fps * 1.5, practiceStart + fps * 1.5 + 15, practiceStart + fps * 1.5 + 30, practiceStart + fps * 1.5 + 45];
	const teamClickFrames = [teamStart + fps * 1.5, teamStart + fps * 1.8];
	const contactClickFrame = contactStart + fps * 1.5;

	return (
		<AbsoluteFill style={{ backgroundColor: "#FFFFFF", fontFamily: "Space Grotesk, sans-serif" }}>
			{/* Hero Section with Scroll */}
			<Sequence from={heroStart} durationInFrames={HERO_DURATION * FPS}>
				<HeroScene />
			</Sequence>

			{/* Navigation Click with Zoom */}
			<Sequence from={navClickStart} durationInFrames={NAV_CLICK_DURATION * FPS}>
				<NavigationClick />
			</Sequence>

			{/* Certifications Section */}
			<Sequence from={certsStart} durationInFrames={CERTS_DURATION * FPS}>
				<CertificationsScene sceneStartFrame={certsStart} />
			</Sequence>

			{/* Cert Detail Scene - Click on AI-102 with Fade Transition */}
			<Sequence from={certDetailStart} durationInFrames={CERT_DETAIL_DURATION * FPS}>
				<CertDetailScene />
			</Sequence>

			{/* Practice Architecture Section */}
			<Sequence from={practiceStart} durationInFrames={PRACTICE_DURATION * FPS}>
				<PracticeScene sceneStartFrame={practiceStart} />
			</Sequence>

			{/* Team Section */}
			<Sequence from={teamStart} durationInFrames={TEAM_DURATION * FPS}>
				<TeamScene sceneStartFrame={teamStart} />
			</Sequence>

			{/* Contact Section */}
			<Sequence from={contactStart} durationInFrames={CONTACT_DURATION * FPS}>
				<ContactScene sceneStartFrame={contactStart} />
			</Sequence>

			{/* Audio tracks for click sounds */}
			{/* Navigation click */}
			<Sequence from={navClickAudioFrame} durationInFrames={Math.ceil(fps * 0.2)}>
				<Audio src={staticFile("sounds/click.mp3")} volume={0.5} />
			</Sequence>

			{/* Certifications clicks */}
			{certsClickFrames.map((clickFrame, index) => (
				<Sequence key={`cert-${index}`} from={clickFrame} durationInFrames={Math.ceil(fps * 0.3)}>
					<Audio src={staticFile("sounds/click.mp3")} volume={0.5} />
				</Sequence>
			))}

			{/* Cert detail click - when clicking on AI-102 card */}
			<Sequence from={certDetailClickFrame} durationInFrames={Math.ceil(fps * 0.3)}>
				<Audio src={staticFile("sounds/click.mp3")} volume={0.5} />
			</Sequence>

			{/* Practice clicks */}
			{practiceClickFrames.map((clickFrame, index) => (
				<Sequence key={`practice-${index}`} from={clickFrame} durationInFrames={Math.ceil(fps * 0.3)}>
					<Audio src={staticFile("sounds/click.mp3")} volume={0.5} />
				</Sequence>
			))}

			{/* Team clicks */}
			{teamClickFrames.map((clickFrame, index) => (
				<Sequence key={`team-${index}`} from={clickFrame} durationInFrames={Math.ceil(fps * 0.3)}>
					<Audio src={staticFile("sounds/click.mp3")} volume={0.5} />
				</Sequence>
			))}

			{/* Contact click */}
			<Sequence from={contactClickFrame} durationInFrames={Math.ceil(fps * 0.3)}>
				<Audio src={staticFile("sounds/click.mp3")} volume={0.5} />
			</Sequence>
		</AbsoluteFill>
	);
};

// Hero Scene Component with Scroll
const HeroScene: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	// Scroll effect - scroll down to show certs section
	const scrollY = interpolate(
		frame,
		[fps * 1.5, fps * 3],
		[0, -600],
		{
			easing: Easing.inOut(Easing.cubic),
			extrapolateRight: "clamp",
		}
	);

	const titleOpacity = spring({
		frame,
		fps,
		config: { damping: 200 },
	});

	const subtitleOpacity = spring({
		frame: frame - 10,
		fps,
		config: { damping: 200 },
	});

	const buttonOpacity = spring({
		frame: frame - 20,
		fps,
		config: { damping: 200 },
	});

	return (
		<AbsoluteFill
			style={{
				backgroundImage: `linear-gradient(to right, #e2e8f0 1px, transparent 1px),
				linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)`,
				backgroundSize: "40px 40px",
				display: "flex",
				flexDirection: "column",
				overflow: "hidden",
				transform: `translateY(${scrollY}px)`,
			}}
		>
			{/* Hero Content Container */}
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center",
					padding: "80px 40px",
					minHeight: "100vh",
				}}
			>
			{/* Navigation Bar */}
			<div
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					height: "80px",
					backgroundColor: "#FFFFFF",
					borderBottom: "3px solid #000000",
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					padding: "0 40px",
				}}
			>
				<div
					style={{
						fontSize: "24px",
						fontWeight: 900,
						color: "#000000",
						textTransform: "uppercase",
					}}
				>
					AZURE<span style={{ color: "#EC4899", fontStyle: "italic" }}>.PORTFOLIO</span>
				</div>
				<div style={{ display: "flex", gap: "32px" }}>
					{["Certifications", "Architecture", "Team", "Contact"].map((item) => (
						<div
							key={item}
							style={{
								fontSize: "12px",
								fontWeight: 700,
								color: "#000000",
								textTransform: "uppercase",
								letterSpacing: "0.1em",
							}}
						>
							{item}
						</div>
					))}
				</div>
			</div>

			{/* Hero Content */}
			<div style={{ textAlign: "center", maxWidth: "1200px", zIndex: 10 }}>
				<div
					style={{
						opacity: titleOpacity,
						marginBottom: "32px",
					}}
				>
					<span
						style={{
							display: "inline-block",
							backgroundColor: "#000000",
							color: "#FFFFFF",
							padding: "8px 16px",
							fontSize: "14px",
							fontWeight: 700,
							textTransform: "uppercase",
							letterSpacing: "0.1em",
							border: "2px solid #000000",
							transform: "rotate(-2deg)",
							boxShadow: "5px 5px 0px #000000",
						}}
					>
						ABAOXOMTIEU's Study Notes
					</span>
				</div>

				<h1
					style={{
						fontSize: "120px",
						fontWeight: 900,
						color: "#000000",
						lineHeight: 0.9,
						marginBottom: "32px",
						opacity: titleOpacity,
					}}
				>
					HỌC AZURE
					<br />
					<span style={{ color: "#EC4899" }}>KHÔNG BỊ LẠC</span>
				</h1>

				<p
					style={{
						fontSize: "24px",
						color: "#000000",
						maxWidth: "800px",
						margin: "0 auto 48px",
						textAlign: "left",
						borderLeft: "4px solid #000000",
						paddingLeft: "24px",
						opacity: subtitleOpacity,
					}}
				>
					Đây là nơi ABAOXOMTIEU note lại những gì học được khi tự ôn Azure cert.
					Từ những lần "Ủa cái này là gì?" đến "À hiểu rồi!", tất cả đều được ghi lại ở đây
					để sau này không phải Google lại lần nữa 😅
				</p>

				<div
					style={{
						display: "flex",
						gap: "16px",
						justifyContent: "center",
						opacity: buttonOpacity,
					}}
				>
					<Button
						text="Xem Notes Ngay"
						backgroundColor="#EC4899"
						frame={frame}
						fps={fps}
						clickFrame={-1}
						sceneStartFrame={heroStart}
					/>
					<Button
						text="Chat Cùng Tôi"
						backgroundColor="#FFFFFF"
						frame={frame}
						fps={fps}
						clickFrame={-1}
						sceneStartFrame={heroStart}
					/>
				</div>
			</div>

			{/* Marquee */}
			<div
				style={{
					position: "absolute",
					bottom: "40px",
					left: 0,
					right: 0,
					height: "60px",
					backgroundColor: "#06B6D4",
					borderTop: "3px solid #000000",
					borderBottom: "3px solid #000000",
					display: "flex",
					alignItems: "center",
					overflow: "hidden",
				}}
			>
				<div
					style={{
						whiteSpace: "nowrap",
						fontSize: "24px",
						fontWeight: 700,
						color: "#000000",
						textTransform: "uppercase",
						letterSpacing: "0.1em",
						animation: "marquee 25s linear infinite",
					}}
				>
					Học Azure • Ghi Note • Quên Lại Đọc • Hiểu Rồi • Lại Quên • Đọc Lại • Azure • Cloud • AI • Backend • Web •
				</div>
			</div>

			{/* Preview Certs Section for Scroll Effect */}
			<div
				style={{
					backgroundColor: "#FFFFFF",
					padding: "120px 40px 40px",
					minHeight: "600px",
					borderTop: "3px solid #000000",
				}}
			>
				<div style={{ display: "flex", alignItems: "baseline", gap: "16px", marginBottom: "32px" }}>
					<span
						style={{
							backgroundColor: "#000000",
							color: "#FFFFFF",
							padding: "4px 12px",
							fontSize: "14px",
							fontWeight: 700,
							fontFamily: "monospace",
						}}
					>
						01.
					</span>
					<h2
						style={{
							fontSize: "72px",
							fontWeight: 900,
							color: "#000000",
							textTransform: "uppercase",
						}}
					>
						CERTIFICATION GUIDES
					</h2>
				</div>
			</div>
			</div>
		</AbsoluteFill>
	);
};

// Navigation Click Scene with Zoom Effect
const NavigationClick: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const zoomScale = interpolate(
		frame,
		[0, fps * 0.2, fps * 0.8, fps],
		[1, 1.2, 1.2, 1],
		{
			easing: Easing.bezier(0.34, 1.56, 0.64, 1),
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
		}
	);

	const buttonScale = interpolate(
		frame,
		[0, fps * 0.1, fps * 0.3, fps * 0.5],
		[1, 1.1, 0.95, 1],
		{
			easing: Easing.bezier(0.34, 1.56, 0.64, 1),
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
		}
	);

	return (
		<AbsoluteFill
			style={{
				backgroundColor: "#FFFFFF",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				transform: `scale(${zoomScale})`,
				transformOrigin: "center center",
			}}
		>
			{/* Navigation Bar */}
			<div
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					height: "80px",
					backgroundColor: "#FFFFFF",
					borderBottom: "3px solid #000000",
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					padding: "0 40px",
				}}
			>
				<div
					style={{
						fontSize: "24px",
						fontWeight: 900,
						color: "#000000",
						textTransform: "uppercase",
					}}
				>
					AZURE<span style={{ color: "#EC4899", fontStyle: "italic" }}>.PORTFOLIO</span>
				</div>
				<div style={{ display: "flex", gap: "32px" }}>
					{["Certifications", "Architecture", "Team", "Contact"].map((item, index) => (
						<div
							key={item}
							style={{
								fontSize: "12px",
								fontWeight: 700,
								color: index === 0 ? "#FFFFFF" : "#000000",
								backgroundColor: index === 0 ? "#000000" : "transparent",
								padding: index === 0 ? "4px 12px" : "0",
								textTransform: "uppercase",
								letterSpacing: "0.1em",
								transform: index === 0 ? `scale(${buttonScale})` : "scale(1)",
								transition: "all 0.2s",
							}}
						>
							{item}
						</div>
					))}
				</div>
			</div>

		</AbsoluteFill>
	);
};

// Certifications Scene
const CertificationsScene: React.FC<{ sceneStartFrame: number }> = ({ sceneStartFrame }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const scrollY = interpolate(
		frame,
		[0, fps * 2],
		[0, -200],
		{
			extrapolateRight: "clamp",
		}
	);

	const cards = [
		{ title: "AI-102", description: "Azure AI Engineer" },
		{ title: "AI-900", description: "Azure AI Fundamentals" },
		{ title: "AZ-104", description: "Azure Administrator" },
		{ title: "AZ-204", description: "Azure Developer" },
		{ title: "AZ-400", description: "Azure DevOps Engineer" },
		{ title: "AZ-900", description: "Azure Fundamentals" },
	];

	return (
		<AbsoluteFill
			style={{
				backgroundColor: "#FFFFFF",
				overflow: "hidden",
				transform: `translateY(${scrollY}px)`,
			}}
		>
			<div style={{ padding: "120px 40px 40px", maxWidth: "1400px", margin: "0 auto" }}>
				<div style={{ display: "flex", alignItems: "baseline", gap: "16px", marginBottom: "32px" }}>
					<span
						style={{
							backgroundColor: "#000000",
							color: "#FFFFFF",
							padding: "4px 12px",
							fontSize: "14px",
							fontWeight: 700,
							fontFamily: "monospace",
						}}
					>
						01.
					</span>
					<h2
						style={{
							fontSize: "72px",
							fontWeight: 900,
							color: "#000000",
							textTransform: "uppercase",
						}}
					>
						CERTIFICATION GUIDES
					</h2>
				</div>
				<p
					style={{
						color: "#374151",
						fontSize: "18px",
						marginBottom: "48px",
						maxWidth: "800px",
						marginLeft: "48px",
					}}
				>
					Những ghi chép "xương máu" khi học Azure cert. Từ AI-102 đến AZ-900,
					mỗi cert đều có những concept khiến mình phải note lại kỹ để không quên.
				</p>

				<div
					style={{
						display: "grid",
						gridTemplateColumns: "repeat(3, 1fr)",
						gap: "32px",
					}}
				>
					{cards.map((card, index) => {
						const cardFrame = frame - index * 5;
						const cardOpacity = spring({
							frame: cardFrame,
							fps,
							config: { damping: 200 },
						});

						const cardY = interpolate(
							cardFrame,
							[0, 15],
							[20, 0],
							{
								extrapolateRight: "clamp",
							}
						);

						return (
							<Card
								key={card.title}
								title={card.title}
								description={card.description}
								type="cert"
								opacity={cardOpacity}
								translateY={cardY}
								frame={frame}
								fps={fps}
								clickFrame={fps * 2 + index * 10}
								sceneStartFrame={sceneStartFrame}
							/>
						);
					})}
				</div>
			</div>
		</AbsoluteFill>
	);
};

// Practice Scene
const PracticeScene: React.FC<{ sceneStartFrame: number }> = ({ sceneStartFrame }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const cards = [
		{ title: "Simple Web App", description: "Basic Azure web application architecture" },
		{ title: "Microservices E-commerce", description: "Scalable e-commerce platform" },
		{ title: "AI Customer Service", description: "AI-powered customer support system" },
		{ title: "Global SaaS Platform", description: "Worldwide SaaS architecture" },
	];

	return (
		<AbsoluteFill
			style={{
				backgroundColor: "#F9FAFB",
				padding: "120px 40px 40px",
			}}
		>
			<div style={{ maxWidth: "1400px", margin: "0 auto" }}>
				<div style={{ display: "flex", alignItems: "baseline", gap: "16px", marginBottom: "32px" }}>
					<span
						style={{
							backgroundColor: "#EC4899",
							color: "#FFFFFF",
							padding: "4px 12px",
							fontSize: "14px",
							fontWeight: 700,
							fontFamily: "monospace",
							border: "2px solid #000000",
						}}
					>
						02.
					</span>
					<h2
						style={{
							fontSize: "72px",
							fontWeight: 900,
							color: "#000000",
							textTransform: "uppercase",
						}}
					>
						PRACTICE ARCHITECTURE
					</h2>
				</div>
				<p
					style={{
						color: "#374151",
						fontSize: "18px",
						marginBottom: "48px",
						maxWidth: "800px",
						marginLeft: "48px",
					}}
				>
					Học lý thuyết xong thì phải làm thực tế chứ! Đây là những kiến trúc mình
					thiết kế và implement để áp dụng kiến thức Azure vào thực tế.
				</p>

				<div
					style={{
						display: "grid",
						gridTemplateColumns: "repeat(2, 1fr)",
						gap: "32px",
					}}
				>
					{cards.map((card, index) => {
						const cardFrame = frame - index * 8;
						const cardOpacity = spring({
							frame: cardFrame,
							fps,
							config: { damping: 200 },
						});

						const cardY = interpolate(
							cardFrame,
							[0, 15],
							[20, 0],
							{
								extrapolateRight: "clamp",
							}
						);

						return (
							<Card
								key={card.title}
								title={card.title}
								description={card.description}
								type="practice"
								opacity={cardOpacity}
								translateY={cardY}
								frame={frame}
								fps={fps}
								clickFrame={fps * 1.5 + index * 15}
								sceneStartFrame={sceneStartFrame}
							/>
						);
					})}
				</div>
			</div>
		</AbsoluteFill>
	);
};

// Cert Detail Scene - Shows detail when clicking on AI-102
const CertDetailScene: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	// Fade in transition effect
	const fadeIn = interpolate(
		frame,
		[0, fps * 0.5],
		[0, 1],
		{
			easing: Easing.out(Easing.cubic),
			extrapolateRight: "clamp",
		}
	);

	// Scroll effect for markdown content
	const scrollY = interpolate(
		frame,
		[fps * 0.5, fps * 4.5],
		[0, -1500],
		{
			extrapolateRight: "clamp",
		}
	);

	const contentOpacity = spring({
		frame: frame - fps * 0.3,
		fps,
		config: { damping: 200 },
	});

	// Markdown content for AI-102
	const markdownContent = `# AI-102: Designing and Implementing a Microsoft Azure AI Solution - Study Guide

Tài liệu tổng hợp kiến thức chuyên sâu cho kỳ thi AI-102 (Kỹ sư AI). Nội dung tập trung vào việc **triển khai** và **code** các giải pháp AI.

---

## 1. Azure AI Services (Triển khai & Cấu hình)

### Creation & Security
- **Multi-service resource**: Tạo 1 resource duy nhất dùng chung cho Vision, Language, Speech (Tiện lợi, chung key).
- **Single-service resource**: Tạo riêng lẻ từng cái (Quản lý chi phí/quota riêng biệt).
- **Security**:
    - Luôn dùng **Managed Identity** để app truy cập AI services (không hardcode key).
    - Dùng **Virtual Network (VNet)** để chặn truy cập API từ internet công cộng.

### Monitoring
- Cấu hình **Diagnostic Settings** để đẩy log vào Log Analytics để phân tích lỗi và số lượng request.

---

## 2. Content Moderation (Kiểm duyệt nội dung)

### Azure AI Content Safety
Dịch vụ phát hiện nội dung độc hại (Hate, Violence, Self-harm, Sexual).
- **Blocklists**: Danh sách từ cấm tùy chỉnh.
- **Severity Levels**: Cấu hình mức độ nhạy cảm (Low, Medium, High).

---

## 3. Natural Language Processing (NLP)

### CLU (Conversational Language Understanding)
Thay thế cho LUIS cũ.
- **Intent**: Ý định của người dùng (VD: "Đặt vé máy bay").
- **Entity**: Thông tin chi tiết (VD: "Đà Nẵng", "Ngày mai").
- **Utterance**: Câu nói cụ thể của user (VD: "Tôi muốn bay đi Đà Nẵng vào ngày mai").

### Question Answering (QA)
Thay thế cho QnA Maker cũ.
- Tạo Chatbot trả lời câu hỏi từ tài liệu (Word, PDF, URL) có sẵn.
- **Chit-chat**: Thêm khả năng tán gẫu xã giao cho bot.

---

## 4. Computer Vision (Thị giác máy tính)

### Azure AI Vision (Fit to Purpose)
- **Image Analysis**: Tự động sinh caption cho ảnh, gắn tag.
- **Custom Vision**:
    - **Classification**: Train model để nhận diện loại hoa cụ thể (Lan, Hồng, Cúc) mà model chung không biết.
    - **Object Detection**: Train model để phát hiện lỗi trên bo mạch điện tử (Phát hiện vết xước).

### Document Intelligence (Form Recognizer cũ)
Chuyên xử lý tài liệu, hóa đơn, form mẫu.
- **Prebuilt Models**: ID Card (CMND/CCCD), Invoice (Hóa đơn), Receipt map (Biên lai).
- **Custom Neural Model**: Train model để đọc loại form đặc thù của công ty bạn.

---

## 5. Knowledge Mining (Azure AI Search)

### Indexing Pipeline
Quy trình biến dữ liệu thô (Raw data) thành chỉ mục tìm kiếm được.
1. **Document Cracking**: Mở file (PDF, DOCX) để lấy text.
2. **Skillset (Enrichment)**: Áp dụng AI để làm giàu dữ liệu.
    - *OCR Skill*: Đọc chữ trong ảnh scan.
    - *Entity Recognition Skill*: Tìm tên người/địa điểm trong text.
    - *Translation Skill*: Dịch sang tiếng Anh.
3. **Index**: Lưu kết quả vào chỉ mục tìm kiếm.

### Semantic Search
Tìm kiếm theo ý nghĩa (ngữ nghĩa) thay vì khớp từ khóa chính xác.
- VD: Tìm "chỗ ở giá rẻ" sẽ ra kết quả "khách sạn bình dân" dù không khớp từ nào.

---

## 6. Generative AI (Azure OpenAI Service)

### Models
- **GPT-4 / GPT-3.5**: Dùng cho Chat, Tóm tắt, Viết code, Sáng tạo nội dung.
- **DALL-E**: Dùng để tạo ảnh từ mô tả (Text-to-Image).
- **Whisper**: Speech-to-text chất lượng cao.

### Prompt Engineering
Kỹ thuật viết câu lệnh input để AI trả về kết quả tốt nhất.
- **Zero-shot**: Không cung cấp ví dụ mẫu.
- **Few-shot**: Cung cấp vài ví dụ (Input -> Output) để AI học theo pattern.
- **System Message**: Chỉ thị vai trò cho AI (VD: "Bạn là trợ lý ảo hữu ích, luôn trả lời bằng Tiếng Việt").
- **Parameters**:
    - **Temperature**: Độ sáng tạo (0 = Chính xác/Lặp lại, 1 = Sáng tạo/Ngẫu nhiên).
    - **Top P**: Tương tự Temperature nhưng giới hạn tập từ vựng.

### RAG (Retrieval-Augmented Generation)
Kỹ thuật kết hợp OpenAI với dữ liệu riêng của bạn (Your Data).
- Quy trình: User hỏi -> Search tìm tài liệu liên quan trong Azure AI Search -> Gửi câu hỏi + tài liệu tìm được cho GPT -> GPT trả lời dựa trên tài liệu đó.`;

	return (
		<AbsoluteFill
			style={{
				backgroundColor: "#FFFFFF",
				opacity: fadeIn,
				overflow: "hidden",
			}}
		>
			<div
				style={{
					padding: "120px 40px 40px",
					maxWidth: "1200px",
					margin: "0 auto",
					opacity: contentOpacity,
					transform: `translateY(${scrollY}px)`,
					height: "2000px",
				}}
			>
				{/* Back button */}
				<div
					style={{
						display: "inline-flex",
						alignItems: "center",
						gap: "8px",
						marginBottom: "40px",
						padding: "8px 16px",
						border: "2px solid #000000",
						backgroundColor: "#FFFFFF",
						fontSize: "14px",
						fontWeight: 700,
						textTransform: "uppercase",
						letterSpacing: "0.05em",
					}}
				>
					← Quay Lại
				</div>

				{/* Markdown Content */}
				<div
					style={{
						backgroundColor: "#FFFFFF",
						border: "3px solid #000000",
						padding: "48px",
						boxShadow: "5px 5px 0px #000000",
					}}
				>
					<MarkdownRenderer content={markdownContent} />
				</div>
			</div>
		</AbsoluteFill>
	);
};

// Team Scene
const TeamScene: React.FC<{ sceneStartFrame: number }> = ({ sceneStartFrame }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const opacity = spring({
		frame,
		fps,
		config: { damping: 200 },
	});

	return (
		<AbsoluteFill
			style={{
				backgroundColor: "#FFFFFF",
				padding: "120px 40px 40px",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				opacity,
			}}
		>
			<div style={{ maxWidth: "800px", textAlign: "center" }}>
				<div style={{ display: "flex", alignItems: "baseline", gap: "16px", marginBottom: "32px", justifyContent: "center" }}>
					<span
						style={{
							backgroundColor: "#000000",
							color: "#FFFFFF",
							padding: "4px 12px",
							fontSize: "14px",
							fontWeight: 700,
							fontFamily: "monospace",
						}}
					>
						03.
					</span>
					<h2
						style={{
							fontSize: "72px",
							fontWeight: 900,
							color: "#000000",
							textTransform: "uppercase",
						}}
					>
						MEET THE CODẺR
					</h2>
				</div>

				<div
					style={{
						width: "300px",
						height: "300px",
						border: "3px solid #000000",
						backgroundColor: "#EC4899",
						margin: "0 auto 24px",
						boxShadow: "5px 5px 0px #000000",
						overflow: "hidden",
						position: "relative",
					}}
				>
					<Img
						src="https://api.dicebear.com/7.x/avataaars/svg?seed=ABAOXOMTIEU"
						style={{
							width: "100%",
							height: "100%",
							objectFit: "cover",
						}}
					/>
				</div>

				<h3 style={{ fontSize: "32px", fontWeight: 700, color: "#000000", marginBottom: "8px" }}>
					ABAOXOMTIEU
				</h3>
				<p style={{ fontSize: "14px", fontWeight: 700, color: "#6B7280", marginBottom: "16px", textTransform: "uppercase" }}>
					AI Engineer
				</p>
				<p style={{ fontSize: "14px", color: "#374151", marginBottom: "24px" }}>
					Thích học Cloud và Backend, Web, thích xây dựng các giải pháp AI
				</p>

				<div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
					<Button
						text="GitHub"
						backgroundColor="#FFFFFF"
						frame={frame}
						fps={fps}
						clickFrame={fps * 1.5}
						sceneStartFrame={sceneStartFrame}
					/>
					<Button
						text="Facebook"
						backgroundColor="#FFFFFF"
						frame={frame}
						fps={fps}
						clickFrame={fps * 1.8}
						sceneStartFrame={sceneStartFrame}
					/>
				</div>
			</div>
		</AbsoluteFill>
	);
};

// Contact Scene
const ContactScene: React.FC<{ sceneStartFrame: number }> = ({ sceneStartFrame }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const opacity = spring({
		frame,
		fps,
		config: { damping: 200 },
	});

	return (
		<AbsoluteFill
			style={{
				backgroundColor: "#E0F2FE",
				padding: "120px 40px 40px",
				display: "flex",
				justifyContent: "center",
				opacity,
			}}
		>
			<div
				style={{
					maxWidth: "900px",
					width: "100%",
					backgroundColor: "#FFFFFF",
					border: "3px solid #000000",
					padding: "48px",
					boxShadow: "5px 5px 0px #000000",
				}}
			>
				<h2
					style={{
						fontSize: "48px",
						fontWeight: 900,
						color: "#000000",
						textTransform: "uppercase",
						marginBottom: "32px",
					}}
				>
					Start a Project
				</h2>

				<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
					<input
						type="text"
						placeholder="Nhập tên của bạn"
						style={{
							height: "48px",
							padding: "0 16px",
							backgroundColor: "#F9FAFB",
							border: "2px solid #000000",
							fontSize: "16px",
							fontWeight: 700,
						}}
					/>
					<input
						type="email"
						placeholder="email@example.com"
						style={{
							height: "48px",
							padding: "0 16px",
							backgroundColor: "#F9FAFB",
							border: "2px solid #000000",
							fontSize: "16px",
							fontWeight: 700,
						}}
					/>
				</div>

				<textarea
					placeholder="Hãy cho tôi biết về nhu cầu Azure của bạn..."
					rows={4}
					style={{
						width: "100%",
						padding: "16px",
						backgroundColor: "#F9FAFB",
						border: "2px solid #000000",
						fontSize: "16px",
						fontWeight: 700,
						marginBottom: "24px",
						resize: "none",
					}}
				/>

				<Button
					text="Gửi Yêu Cầu"
					backgroundColor="#000000"
					textColor="#FFFFFF"
					frame={frame}
					fps={fps}
					clickFrame={fps * 1.5}
					sceneStartFrame={sceneStartFrame}
				/>
			</div>
		</AbsoluteFill>
	);
};

// Button Component with Zoom and Click Sound
const Button: React.FC<{
	text: string;
	backgroundColor: string;
	textColor?: string;
	frame: number;
	fps: number;
	clickFrame: number;
	sceneStartFrame: number;
}> = ({ text, backgroundColor, textColor = "#000000", frame, fps, clickFrame, sceneStartFrame }) => {
	const isClicking = clickFrame >= 0 && frame >= clickFrame && frame < clickFrame + fps * 0.3;

	const scale = clickFrame >= 0 ? interpolate(
		frame,
		[clickFrame, clickFrame + fps * 0.1, clickFrame + fps * 0.3],
		[1, 1.15, 1],
		{
			easing: Easing.bezier(0.34, 1.56, 0.64, 1),
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
		}
	) : 1;

	return (
		<>
			<div
				style={{
					display: "inline-flex",
					height: "56px",
					alignItems: "center",
					justifyContent: "center",
					backgroundColor,
					color: textColor,
					padding: "0 40px",
					fontSize: "16px",
					fontWeight: 700,
					textTransform: "uppercase",
					letterSpacing: "0.05em",
					border: "3px solid #000000",
					boxShadow: "5px 5px 0px #000000",
					transform: `scale(${scale})`,
					transition: "all 0.2s",
				}}
			>
				{text}
			</div>
		</>
	);
};

// Card Component with Zoom and Click Sound
const Card: React.FC<{
	title: string;
	description: string;
	type: "cert" | "practice";
	opacity: number;
	translateY: number;
	frame: number;
	fps: number;
	clickFrame: number;
	sceneStartFrame: number;
}> = ({ title, description, type, opacity, translateY, frame, fps, clickFrame, sceneStartFrame }) => {
	const isClicking = clickFrame >= 0 && frame >= clickFrame && frame < clickFrame + fps * 0.3;

	const scale = clickFrame >= 0 ? interpolate(
		frame,
		[clickFrame, clickFrame + fps * 0.1, clickFrame + fps * 0.3],
		[1, 1.1, 1],
		{
			easing: Easing.bezier(0.34, 1.56, 0.64, 1),
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
		}
	) : 1;

	return (
		<>
			<div
				style={{
					backgroundColor: "#FFFFFF",
					border: "3px solid #000000",
					padding: "32px",
					opacity,
					transform: `translateY(${translateY}px) scale(${scale})`,
					boxShadow: "5px 5px 0px #000000",
					transition: "all 0.2s",
				}}
			>
				<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
					<span
						style={{
							display: "inline-flex",
							alignItems: "center",
							gap: "8px",
							padding: "4px 12px",
							fontSize: "12px",
							fontWeight: 700,
							textTransform: "uppercase",
							letterSpacing: "0.05em",
							border: "2px solid #000000",
							backgroundColor: type === "cert" ? "#06B6D4" : "#EC4899",
							color: "#FFFFFF",
						}}
					>
						{type === "cert" ? "Certification" : "Architecture"}
					</span>
				</div>

				<h3
					style={{
						fontSize: "24px",
						fontWeight: 900,
						color: "#000000",
						marginBottom: "12px",
					}}
				>
					{title}
				</h3>

				<p
					style={{
						color: "#374151",
						fontSize: "14px",
						lineHeight: 1.6,
					}}
				>
					{description}
				</p>
			</div>
		</>
	);
};
