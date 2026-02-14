import type { HairStyleOption, HairGender } from "@/src/types/catalog"

// Add or edit hairstyles by gender here.
export const hairstylesByGender: Record<HairGender, HairStyleOption[]> = {
  male: [
    {
      id: "fade",
      name: "Cắt Fade",
      image: "/images/tocnam1.jpg",
      description: "Kiểu fade cổ điển với đường cắt gọn gàng, phù hợp phong cách lịch lãm.",
      faceShapes: ["Trái xoan", "Vuông", "Chữ nhật"],
      estimatedTime: 30,
    },
    {
      id: "undercut",
      name: "Undercut",
      image: "/images/tocnam2.jpg",
      description: "Tương phản rõ giữa hai bên cắt ngắn và phần tóc trên dài hơn, dễ tạo kiểu.",
      faceShapes: ["Tròn", "Trái xoan", "Vuông"],
      estimatedTime: 35,
    },
    {
      id: "pompadour",
      name: "Pompadour",
      image: "/images/tocnam3.jpg",
      description: "Phong cách cổ điển, tạo độ phồng nổi bật ở phần đỉnh tóc.",
      faceShapes: ["Trái xoan", "Chữ nhật", "Kim cương"],
      estimatedTime: 40,
    },
    {
      id: "crew",
      name: "Crew Cut",
      image: "/images/tocnam4.jpg",
      description: "Gọn gàng, ít cần chăm sóc, phù hợp hầu hết dáng khuôn mặt.",
      faceShapes: ["Mọi dáng mặt"],
      estimatedTime: 25,
    },
    {
      id: "textured",
      name: "Textured",
      image: "/images/tocnu1.jpg",
      description: "Kiểu tóc hiện đại có độ texture và chuyển động tự nhiên.",
      faceShapes: ["Trái xoan", "Vuông", "Tròn"],
      estimatedTime: 35,
    },
  ],
  female: [
    {
      id: "bob",
      name: "Tóc Bob",
      image: "/images/tocnu2.jpg",
      description: "Kiểu bob kinh điển, đường cắt rõ nét, tôn khuôn mặt và dễ tạo kiểu.",
      faceShapes: ["Trái xoan", "Vuông", "Trái tim"],
      estimatedTime: 45,
    },
    {
      id: "layers",
      name: "Tóc Layer",
      image: "/images/tocnu3.jpg",
      description: "Tạo tầng giúp tóc bồng bềnh và có độ chuyển động tự nhiên.",
      faceShapes: ["Tròn", "Trái xoan", "Chữ nhật"],
      estimatedTime: 50,
    },
    {
      id: "waves",
      name: "Uốn Sóng",
      image: "/images/tocnu4.jpg",
      description: "Lọn sóng mềm mại, nhẹ nhàng, mang lại vẻ nữ tính tự nhiên.",
      faceShapes: ["Mọi dáng mặt"],
      estimatedTime: 55,
    },
    {
      id: "pixie",
      name: "Pixie Cut",
      image: "/images/tocnu5.jpg",
      description: "Cá tính, gọn nhẹ, tạo điểm nhấn nổi bật cho khuôn mặt.",
      faceShapes: ["Trái xoan", "Trái tim", "Kim cương"],
      estimatedTime: 35,
    },
    {
      id: "long",
      name: "Tóc Dài",
      image: "/images/tocnu6.jpg",
      description: "Tóc dài mềm mại kết hợp layer nhẹ tạo chiều sâu và vẻ thanh lịch.",
      faceShapes: ["Mọi dáng mặt"],
      estimatedTime: 60,
    },
  ],
}
