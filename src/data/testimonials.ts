export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar?: string;
  featured?: boolean;
}

export const mockTestimonials: Testimonial[] = [
  {
    id: "1",
    name: "Sarah Chen",
    role: "Creative Director",
    company: "Pixel Studios",
    content: "CRD has revolutionized how we create and showcase our digital trading cards. The 3D effects and animations bring our artwork to life in ways we never imagined possible.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b332c1c9?w=150&h=150&fit=crop&crop=face",
    featured: true
  },
  {
    id: "2", 
    name: "Marcus Rodriguez",
    role: "Game Designer",
    company: "Epic Games",
    content: "The physics-based animations and realistic card interactions make every card feel tangible. Our players are amazed by the photorealistic quality.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: "3",
    name: "Emily Watson",
    role: "Art Director", 
    company: "Blizzard Entertainment",
    content: "CRD's material system captures every detail of our premium foil cards. The holographic effects are indistinguishable from physical cards.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: "4",
    name: "David Park",
    role: "Lead Developer",
    company: "Riot Games",
    content: "The performance optimization is incredible. 60fps on mobile with cinema-quality rendering. Our users can't believe these are digital cards.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: "5",
    name: "Lisa Thompson",
    role: "Product Manager",
    company: "Wizards of the Coast",
    content: "The pack opening experience creates genuine emotional moments. Players are sharing their legendary pulls across social media.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: "6",
    name: "James Wilson",
    role: "Creative Lead",
    company: "Topps Digital",
    content: "CRD has set a new standard for digital collectibles. The attention to detail in material properties and lighting is unmatched.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
  }
];