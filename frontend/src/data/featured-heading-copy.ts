export type CardFocus = 1 | 2 | 3

export type HeadingSideCopy = {
  label: string
  descriptionLines: string[]
}

export type HeadingCopyByCard = Record<
  CardFocus,
  {
    left: HeadingSideCopy
    right: HeadingSideCopy
  }
>

// Customize featured heading copy here.
export const headingCopyByCard: HeadingCopyByCard = {
  1: {
    left: {
      label: "Tạo kiểu nền tảng",
      descriptionLines: [
        "Từng lớp tóc được xử lý chuẩn xác",
        "để giữ nếp tự nhiên, dễ chăm sóc",
        "và phù hợp nhịp sống hằng ngày.",
      ],
    },
    right: {
      label: "Classic Haircut",
      descriptionLines: [
        "Đường cắt gọn, sạch và cân đối khuôn mặt.",
        "Lựa chọn bền vững cho phong cách lịch lãm,",
        "dễ duy trì mỗi ngày.",
      ],
    },
  },
  2: {
    left: {
      label: "Hair Color Treatment",
      descriptionLines: [
        "Phân tích tông da, nền tóc",
        "và phong cách cá nhân để lên",
        "công thức nhuộm hài hoà, tinh tế.",
      ],
    },
    right: {
      label: "Bảo vệ sau nhuộm",
      descriptionLines: [
        "Quy trình phục hồi và khoá màu",
        "giúp tóc giữ độ bóng, hạn chế khô xơ,",
        "duy trì sắc độ đẹp lâu hơn.",
      ],
    },
  },
  3: {
    left: {
      label: "Styling & Blowout",
      descriptionLines: [
        "Phom tóc vào nếp bồng bềnh, mềm mại",
        "và giữ được độ chuyển động tự nhiên,",
        "phù hợp đi làm lẫn sự kiện.",
      ],
    },
    right: {
      label: "Kỹ thuật hoàn thiện",
      descriptionLines: [
        "Kiểm soát nhiệt và sản phẩm tạo kiểu",
        "đúng mức để tóc bóng, nhẹ",
        "và hạn chế hư tổn sau tạo kiểu.",
      ],
    },
  },
}
