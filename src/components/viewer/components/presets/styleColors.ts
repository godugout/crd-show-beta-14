
export const STYLE_COLORS = {
  'custom-style': {
    primary: '#8B5CF6',
    border: '#A855F7',
    bg: 'rgba(139, 92, 246, 0.1)',
    gradient: 'linear-gradient(135deg, #8B5CF6, #A855F7)'
  },
  'holographic-burst': {
    primary: '#06B6D4',
    border: '#0891B2',
    bg: 'rgba(6, 182, 212, 0.1)',
    gradient: 'linear-gradient(135deg, #06B6D4, #8B5CF6, #EC4899)'
  },
  'crystal-interference': {
    primary: '#3B82F6',
    border: '#2563EB',
    bg: 'rgba(59, 130, 246, 0.1)',
    gradient: 'linear-gradient(135deg, #3B82F6, #06B6D4)'
  },
  'chrome-burst': {
    primary: '#6B7280',
    border: '#4B5563',
    bg: 'rgba(107, 114, 128, 0.1)',
    gradient: 'linear-gradient(135deg, #6B7280, #D1D5DB)'
  },
  'golden-fire': {
    primary: '#F59E0B',
    border: '#D97706',
    bg: 'rgba(245, 158, 11, 0.1)',
    gradient: 'linear-gradient(135deg, #F59E0B, #EAB308)'
  },
  'ocean-waves': {
    primary: '#0EA5E9',
    border: '#0284C7',
    bg: 'rgba(14, 165, 233, 0.1)',
    gradient: 'linear-gradient(135deg, #0EA5E9, #06B6D4)'
  },
  'aurora-flare': {
    primary: '#10B981',
    border: '#059669',
    bg: 'rgba(16, 185, 129, 0.1)',
    gradient: 'linear-gradient(135deg, #10B981, #06B6D4, #8B5CF6)'
  },
  'metallic-prizm': {
    primary: '#EC4899',
    border: '#DB2777',
    bg: 'rgba(236, 72, 153, 0.1)',
    gradient: 'linear-gradient(135deg, #EC4899, #8B5CF6)'
  },
  'vintage-foil': {
    primary: '#92400E',
    border: '#78350F',
    bg: 'rgba(146, 64, 14, 0.1)',
    gradient: 'linear-gradient(135deg, #92400E, #A16207)'
  },
  'ice-crystal': {
    primary: '#0369A1',
    border: '#075985',
    bg: 'rgba(3, 105, 161, 0.1)',
    gradient: 'linear-gradient(135deg, #0369A1, #0EA5E9)'
  },
  'starlight-spray': {
    primary: '#7C3AED',
    border: '#6D28D9',
    bg: 'rgba(124, 58, 237, 0.1)',
    gradient: 'linear-gradient(135deg, #7C3AED, #EC4899)'
  },
  'lunar-shimmer': {
    primary: '#64748B',
    border: '#475569',
    bg: 'rgba(100, 116, 139, 0.1)',
    gradient: 'linear-gradient(135deg, #64748B, #94A3B8)'
  }
} as const;

export const getStyleColor = (styleId: string) => {
  return STYLE_COLORS[styleId as keyof typeof STYLE_COLORS] || STYLE_COLORS['custom-style'];
};
