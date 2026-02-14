type QuickLookUiText = {
  mobileTitle: string
  durationLabel: string
  finishLabel: string
  selectedLabel: string
  highlightsLabel: string
  bookButton: string
  prevImageAria: string
  nextImageAria: string
  thumbnailAriaPrefix: string
}

// Global UI labels for Quick Look modal.
export const quickLookUiText: QuickLookUiText = {
  mobileTitle: "Xem nhanh",
  durationLabel: "Thời lượng",
  finishLabel: "Tùy chọn kiểu",
  selectedLabel: "Đã chọn",
  highlightsLabel: "Điểm nổi bật",
  bookButton: "Đặt dịch vụ này",
  prevImageAria: "Ảnh trước",
  nextImageAria: "Ảnh tiếp theo",
  thumbnailAriaPrefix: "Ảnh thu nhỏ",
}

// Per-service highlight bullets. Add new entries by service id when needed.
export const quickLookHighlightsByServiceId: Record<string, string[]> = {
  "1": [
    "Tư vấn kiểu tóc phù hợp khuôn mặt trước khi cắt.",
    "Kỹ thuật cắt chuẩn phom, dễ chăm sóc hằng ngày.",
    "Hoàn thiện và hướng dẫn tạo kiểu sau dịch vụ.",
  ],
  "2": [
    "Phân tích nền tóc và tông da trước khi lên màu.",
    "Sử dụng sản phẩm nhuộm và phục hồi chuyên dụng.",
    "Tư vấn chăm sóc giữ màu tại nhà sau dịch vụ.",
  ],
  "3": [
    "Tạo phom theo phong cách bạn mong muốn.",
    "Cân bằng nhiệt để hạn chế khô xơ và gãy rụng.",
    "Giữ độ bóng và nếp mềm tự nhiên sau tạo kiểu.",
  ],
}

export const defaultQuickLookHighlights: string[] = [
  "Tư vấn cá nhân hóa theo tình trạng tóc thực tế.",
  "Sản phẩm cao cấp phù hợp từng chất tóc.",
  "Hướng dẫn chăm sóc sau dịch vụ để giữ kết quả lâu hơn.",
]
