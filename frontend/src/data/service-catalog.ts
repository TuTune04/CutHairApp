import type {
  HairLength,
  ServiceCard,
  ServiceMeta,
} from "@/src/types/service-catalog"

export const hairLengths: HairLength[] = ["Ngắn", "Lỡ", "Dài"]

const availableImages = [
  "/images/tocnam1.jpg",
  "/images/tocnam2.jpg",
  "/images/tocnam3.jpg",
  "/images/tocnam4.jpg",
  "/images/tocnu1.jpg",
  "/images/tocnu2.jpg",
  "/images/tocnu3.jpg",
  "/images/tocnu4.jpg",
  "/images/tocnu5.jpg",
  "/images/tocnu6.jpg",
  "/images/tocnu7.jpg",
  "/images/tocnu8.jpg",
  "/images/tocnu9.png",
  "/images/tocnu10.png",
  "/images/anh1.png",
]

export function getImageByIndex(name: string, index: number) {
  void name
  return availableImages[index % availableImages.length]
}

export const services: ServiceCard[] = [
  { id: "cut-men", name: "Cắt, xả tóc Nam", category: "Dịch vụ lẻ", price: "40k", image: getImageByIndex("Cắt Nam", 0) },
  { id: "cut-women", name: "Cắt, xả tóc Nữ", category: "Dịch vụ lẻ", price: "100k", image: getImageByIndex("Cắt Nữ", 1) },
  { id: "shampoo", name: "Gội Nam/Nữ", category: "Dịch vụ lẻ", price: "40k", image: getImageByIndex("Gội", 2) },
  { id: "style-men", name: "Tạo kiểu Nam", category: "Dịch vụ lẻ", price: "20k", image: getImageByIndex("Tạo kiểu Nam", 3) },
  { id: "style-women", name: "Tạo kiểu Nữ", category: "Dịch vụ lẻ", price: "40k", image: getImageByIndex("Tạo kiểu Nữ", 4) },
  { id: "color-men", name: "Nhuộm Nam", category: "Dịch vụ lẻ", price: "150k", image: getImageByIndex("Nhuộm Nam", 5) },
  { id: "line", name: "Làm line (1 lần tẩy)", category: "Dịch vụ lẻ", price: "200k", image: getImageByIndex("Làm line", 6) },
  { id: "bleach-men", name: "Tẩy Nam (1 lần tẩy)", category: "Dịch vụ lẻ", price: "200k", image: getImageByIndex("Tẩy Nam", 7) },
  { id: "perm-men", name: "Uốn Nam", category: "Dịch vụ lẻ", price: "250k", image: getImageByIndex("Uốn Nam", 8) },
  { id: "straight-root", name: "Ép chân", category: "Dịch vụ lẻ", price: "250k", image: getImageByIndex("Ép chân", 9) },
  { id: "volume-root", name: "Uốn phồng chân", category: "Dịch vụ lẻ", price: "250k", image: getImageByIndex("Uốn phồng", 10) },
  {
    id: "chem-color",
    name: "Nhuộm",
    category: "Hóa chất",
    image: getImageByIndex("Nhuộm hóa chất", 11),
    options: [
      { label: "Sản phẩm thường", prices: { Ngắn: "400k", Lỡ: "500k", Dài: "600k" } },
      { label: "Sản phẩm cao cấp", prices: { Ngắn: "500k", Lỡ: "600k", Dài: "700k" } },
    ],
  },
  {
    id: "chem-straighten",
    name: "Duỗi / Ép",
    category: "Hóa chất",
    image: getImageByIndex("Duỗi ép", 12),
    options: [
      { label: "Sản phẩm thường", prices: { Ngắn: "500k", Lỡ: "600k", Dài: "700k" } },
      { label: "Sản phẩm cao cấp", prices: { Ngắn: "600k", Lỡ: "700k", Dài: "800k" } },
    ],
  },
  {
    id: "chem-curl",
    name: "Uốn",
    category: "Hóa chất",
    image: getImageByIndex("Uốn hóa chất", 13),
    options: [
      { label: "Sản phẩm thường", prices: { Ngắn: "600k", Lỡ: "700k", Dài: "800k" } },
      { label: "Sản phẩm cao cấp", prices: { Ngắn: "700k", Lỡ: "800k", Dài: "900k" } },
    ],
  },
  {
    id: "chem-bleach-women",
    name: "Tẩy nữ (1 lần)",
    category: "Hóa chất",
    image: getImageByIndex("Tẩy nữ", 14),
    options: [
      { label: "Tẩy (1 lần)", prices: { Ngắn: "300k", Lỡ: "400k", Dài: "500k" } },
    ],
  },
  {
    id: "chem-keratin",
    name: "Phục hồi Keratin",
    category: "Hóa chất",
    image: getImageByIndex("Keratin", 15),
    options: [
      { label: "Phục hồi Keratin", prices: { Ngắn: "600k", Lỡ: "700k", Dài: "800k" } },
    ],
  },
  { id: "collagen", name: "Hấp, phục hồi Collagen", category: "Phục hồi", price: "250k", image: getImageByIndex("Collagen", 16) },
]

export const serviceMetaById: Record<string, ServiceMeta> = {
  "cut-men": {
    overview: "Dịch vụ cắt, làm sạch và chỉnh form tóc nam theo gương mặt.",
    description:
      "Kỹ thuật viên tư vấn kiểu tóc, thực hiện cắt tạo phom, xả sạch tóc và chỉnh chi tiết để giữ nếp tự nhiên, dễ chăm sóc tại nhà.",
    pros: ["Nhanh gọn, chi phí thấp", "Gọn gàng và dễ tạo kiểu hằng ngày", "Phù hợp nhiều môi trường làm việc"],
    cons: ["Tóc mọc nhanh sẽ mất form", "Kiểu quá ngắn khó thay đổi ngay"],
    suitableFor: ["Nam muốn giữ kiểu tóc chỉnh chu", "Người cần cắt định kỳ"],
    recommendedInterval: "2-4 tuần/lần",
  },
  "cut-women": {
    overview: "Cắt và làm sạch tóc nữ, tối ưu form theo chất tóc và khuôn mặt.",
    description:
      "Dựa trên độ dày tóc, độ ôm mặt và phong cách cá nhân, kỹ thuật viên cắt layer hoặc form thẳng, giúp tóc vào nếp và cân đối tổng thể.",
    pros: ["Nâng độ bồng và độ mềm của form tóc", "Giúp tóc dễ chăm sóc hơn", "Tăng thẩm mỹ khuôn mặt"],
    cons: ["Cần thời gian tạo kiểu nếu chọn form phức tạp", "Tóc hư tổn nhiều có thể chưa đạt form tối đa"],
    suitableFor: ["Nữ muốn thay đổi hình ảnh", "Tóc dài cần tỉa form định kỳ"],
    recommendedInterval: "6-10 tuần/lần",
  },
  shampoo: {
    overview: "Làm sạch da đầu, thư giãn và hỗ trợ tóc mềm mượt hơn.",
    description:
      "Gội và massage da đầu theo quy trình nhẹ nhàng, loại bỏ dầu thừa, bụi bẩn và mùi khó chịu; thích hợp chăm sóc thường xuyên.",
    pros: ["Thư giãn nhanh", "Giảm cảm giác bết dầu", "Giá phù hợp sử dụng định kỳ"],
    cons: ["Hiệu quả mềm mượt ngắn hạn", "Không thay thế các liệu trình phục hồi sâu"],
    suitableFor: ["Người thường xuyên đội mũ/nắng nóng", "Da đầu dầu hoặc dễ bết"],
    recommendedInterval: "3-7 ngày/lần",
  },
  "style-men": {
    overview: "Tạo kiểu tóc nam nhanh theo phong cách mong muốn.",
    description:
      "Sử dụng sấy và sản phẩm định hình phù hợp để lên nếp tóc hiện đại hoặc lịch sự, giữ form tốt trong ngày.",
    pros: ["Thực hiện nhanh", "Thay đổi diện mạo rõ rệt", "Linh hoạt theo sự kiện"],
    cons: ["Cần sản phẩm giữ nếp", "Độ bền phụ thuộc chất tóc và thời tiết"],
    suitableFor: ["Nam đi tiệc/sự kiện", "Người muốn tóc vào nếp đẹp trong ngày"],
    recommendedInterval: "Khi cần, trung bình 1-3 lần/tuần",
  },
  "style-women": {
    overview: "Tạo kiểu tóc nữ theo layout nhẹ nhàng hoặc nổi bật.",
    description:
      "Kỹ thuật viên uốn lơi/sấy phồng hoặc tạo nếp theo yêu cầu để phù hợp trang phục, sự kiện và hình ảnh cá nhân.",
    pros: ["Tăng độ chỉn chu tức thì", "Đa dạng phong cách", "Có thể phối hợp makeup/chụp ảnh tốt"],
    cons: ["Nếp có thể giảm sau khi ra mồ hôi", "Cần bảo quản nếp sau khi làm"],
    suitableFor: ["Nữ đi tiệc, chụp ảnh, sự kiện", "Người cần tạo kiểu nhanh"],
    recommendedInterval: "Khi cần, trung bình 1-2 lần/tuần",
  },
  "color-men": {
    overview: "Nhuộm tóc nam tông cơ bản hoặc thời trang nhẹ.",
    description:
      "Tiến hành lên màu phù hợp nền tóc hiện tại, tập trung độ đều màu và độ bền, ưu tiên phong cách tự nhiên hoặc cá tính vừa phải.",
    pros: ["Thay đổi phong cách nhanh", "Màu sắc đa dạng", "Giữ được cá tính riêng"],
    cons: ["Có thể phai màu theo thời gian", "Cần chăm sóc tóc nhuộm để bền màu"],
    suitableFor: ["Nam muốn đổi hình ảnh", "Người đã có kinh nghiệm nhuộm tóc"],
    recommendedInterval: "6-10 tuần/lần dặm màu",
  },
  line: {
    overview: "Làm line nổi bật bằng quy trình tẩy 1 lần.",
    description:
      "Tạo các line tóc theo vị trí yêu cầu, sau đó xử lý nền và cân bằng màu để line sáng, nổi bật nhưng vẫn hài hòa với tổng thể tóc.",
    pros: ["Hiệu ứng cá tính cao", "Dễ kết hợp màu thời trang", "Không cần tẩy toàn đầu"],
    cons: ["Phần tóc line cần chăm kỹ", "Có thể khô hơn tóc nền tự nhiên"],
    suitableFor: ["Người thích điểm nhấn cá tính", "Khách muốn thử màu trước khi nhuộm toàn bộ"],
    recommendedInterval: "8-12 tuần/lần làm mới",
  },
  "bleach-men": {
    overview: "Tẩy tóc nam 1 lần để nâng nền sáng trước khi nhuộm.",
    description:
      "Tẩy theo mức sáng mục tiêu và kiểm soát thời gian để hạn chế khô xơ; phù hợp khi cần lên các tông màu sáng hoặc khói.",
    pros: ["Lên màu sáng rõ hơn", "Hỗ trợ nhiều tông màu thời trang", "Tạo hiệu ứng nổi bật"],
    cons: ["Dễ khô xơ nếu chăm sóc kém", "Cần dưỡng phục hồi thường xuyên"],
    suitableFor: ["Nam muốn nhuộm tông sáng/khói", "Khách chấp nhận routine chăm tóc kỹ"],
    recommendedInterval: "10-14 tuần/lần tùy mức mọc chân tóc",
  },
  "perm-men": {
    overview: "Uốn nam tạo độ phồng và sóng nhẹ, dễ vào nếp.",
    description:
      "Định hình sóng theo form mặt và chiều dài tóc, giúp tóc có texture tự nhiên, hỗ trợ tạo kiểu nhanh hơn mỗi ngày.",
    pros: ["Giữ form tốt", "Tóc trông dày và có độ chuyển động", "Tiết kiệm thời gian tạo kiểu"],
    cons: ["Cần sấy đúng cách để đẹp nhất", "Tóc yếu có thể cần phục hồi trước khi uốn"],
    suitableFor: ["Nam tóc mỏng hoặc tóc thẳng khó vào nếp", "Người muốn style Hàn/Nhật"],
    recommendedInterval: "10-14 tuần/lần",
  },
  "straight-root": {
    overview: "Ép phần chân tóc để kiểm soát phồng và xù.",
    description:
      "Tập trung xử lý phần chân mọc mới hoặc vùng tóc cứng, giúp tổng thể tóc mượt và gọn hơn mà không làm mất chuyển động phần ngọn.",
    pros: ["Gọn tóc nhanh", "Giảm xù đáng kể", "Phù hợp tóc dày khó kiểm soát"],
    cons: ["Lạm dụng có thể làm tóc thiếu độ bồng", "Cần tay nghề để tránh cứng form"],
    suitableFor: ["Người có tóc chân cứng, dễ phồng", "Khách muốn tóc gọn tự nhiên"],
    recommendedInterval: "8-12 tuần/lần",
  },
  "volume-root": {
    overview: "Uốn phồng chân giúp chân tóc đứng và tóc trông dày hơn.",
    description:
      "Định hình phần chân với mức phồng vừa phải theo cấu trúc mặt và mái, mang lại hiệu ứng tóc dày mà vẫn tự nhiên.",
    pros: ["Tăng độ phồng rõ rệt", "Tóc trông dày và trẻ trung hơn", "Dễ tạo kiểu hằng ngày"],
    cons: ["Nếu chăm sai có thể mất phồng sớm", "Không phù hợp tóc quá yếu ở chân"],
    suitableFor: ["Tóc mỏng, tóc xẹp", "Người muốn giữ mái và form đỉnh đầu"],
    recommendedInterval: "8-12 tuần/lần",
  },
  "chem-color": {
    overview: "Nhuộm hóa chất chuyên sâu theo độ dài và dòng sản phẩm.",
    description:
      "Áp dụng công thức màu theo nền tóc và độ dài, có lựa chọn sản phẩm thường hoặc cao cấp để tối ưu độ bóng, độ bền màu và cảm giác tóc.",
    pros: ["Màu lên chuẩn và đều", "Có tùy chọn sản phẩm cao cấp", "Phù hợp nhiều tông màu"],
    cons: ["Cần chăm tóc nhuộm tại nhà", "Tóc hư tổn nặng có thể cần phục hồi trước"],
    suitableFor: ["Khách muốn đổi màu toàn diện", "Người cần màu bền, lên chuẩn"],
    recommendedInterval: "6-10 tuần/lần dặm màu/chân tóc",
  },
  "chem-straighten": {
    overview: "Duỗi/ép giúp tóc thẳng, mượt và dễ kiểm soát.",
    description:
      "Sử dụng hoạt chất duỗi theo độ dài và chất tóc, cân bằng nhiệt và thời gian để giảm xù rối, tăng độ suôn mượt.",
    pros: ["Tóc thẳng mượt, dễ chải", "Giảm rối và xù hiệu quả", "Tiết kiệm thời gian sấy tạo kiểu"],
    cons: ["Cần tránh nhiệt cao liên tục sau khi làm", "Không phù hợp nếu muốn giữ độ xoăn tự nhiên"],
    suitableFor: ["Tóc xù, khó vào nếp", "Người thích form tóc thẳng gọn"],
    recommendedInterval: "12-16 tuần/lần",
  },
  "chem-curl": {
    overview: "Uốn hóa chất tạo sóng rõ, giữ nếp lâu theo độ dài tóc.",
    description:
      "Thiết kế kiểu sóng theo khuôn mặt và mong muốn, kết hợp sản phẩm phù hợp để tạo độ đàn hồi và giữ nếp ổn định.",
    pros: ["Hiệu ứng thay đổi phong cách mạnh", "Giữ nếp dài hơn tạo kiểu tạm thời", "Nhiều kiểu sóng lựa chọn"],
    cons: ["Cần dưỡng ẩm để giữ sóng đẹp", "Sai routine có thể làm tóc khô"],
    suitableFor: ["Khách muốn tạo hình tóc mới rõ rệt", "Người sẵn sàng chăm sóc tóc uốn"],
    recommendedInterval: "12-16 tuần/lần",
  },
  "chem-bleach-women": {
    overview: "Tẩy nữ 1 lần để nâng nền sáng trước nhuộm thời trang.",
    description:
      "Thực hiện tẩy nâng sáng nền tóc nữ với kiểm soát thời gian và mức độ theo chất tóc, giúp sẵn sàng cho các tone màu sáng, khói hoặc pastel.",
    pros: ["Lên nền sáng rõ", "Hỗ trợ nhiều tone nhuộm khó", "Tạo hiệu ứng màu nổi bật"],
    cons: ["Tóc có thể khô nếu chăm sóc không đúng", "Cần dưỡng phục hồi định kỳ sau tẩy"],
    suitableFor: ["Khách muốn nhuộm tone sáng", "Người chấp nhận routine chăm sóc tóc kỹ hơn"],
    recommendedInterval: "10-14 tuần/lần tùy chân tóc và nền hiện tại",
  },
  "chem-keratin": {
    overview: "Phục hồi Keratin chuyên sâu giúp tóc giảm xơ và tăng độ mượt.",
    description:
      "Bổ sung keratin vào sợi tóc để cải thiện bề mặt hư tổn, giảm xù rối, tăng độ bóng mượt và hỗ trợ tóc đàn hồi hơn sau hóa chất hoặc nhiệt.",
    pros: ["Cải thiện độ mượt nhanh", "Giảm rối và xù đáng kể", "Hỗ trợ phục hồi tóc sau nhuộm/uốn/tẩy"],
    cons: ["Hiệu quả giảm dần theo thời gian", "Cần duy trì theo lịch để ổn định chất tóc"],
    suitableFor: ["Tóc hư tổn nhẹ đến trung bình", "Khách vừa làm hóa chất cần phục hồi"],
    recommendedInterval: "4-8 tuần/lần",
  },
  collagen: {
    overview: "Phục hồi collagen giúp tóc mềm, mượt và đỡ xơ rối.",
    description:
      "Bổ sung dưỡng chất dạng hấp chuyên sâu để cải thiện bề mặt tóc, tăng độ mềm và giảm rối, phù hợp duy trì sức khỏe tóc định kỳ.",
    pros: ["Cải thiện độ mềm nhanh", "Giảm xơ rối và khô", "Phù hợp sau hóa chất"],
    cons: ["Cần duy trì định kỳ để giữ hiệu quả", "Không thay thế hoàn toàn cắt tỉa phần chẻ ngọn"],
    suitableFor: ["Tóc khô xơ, chẻ ngọn nhẹ", "Người thường xuyên dùng nhiệt/hóa chất"],
    recommendedInterval: "2-4 tuần/lần",
  },
}

export const popularMenHairStyles = [
  "Undercut",
  "Side Part",
  "Layer Hàn Quốc",
  "Two Block",
  "Textured Crop",
  "French Crop",
  "Crew Cut",
  "Buzz Cut",
  "Quiff",
  "Pompadour",
  "Mohican Fade",
  "Ivy League",
  "Slick Back",
  "Comma Hair",
]
