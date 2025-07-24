export type CardRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

// Rarity color mappings
export const getRarityStyles = (rarity: CardRarity = 'common') => {
  const styles = {
    common: {
      borderColor: 'hsl(var(--crd-mediumGray))',
      glowColor: 'transparent',
      badgeColor: 'hsl(var(--crd-mediumGray))',
      hasGlow: false
    },
    uncommon: {
      borderColor: 'hsl(142, 71%, 45%)', // Green
      glowColor: 'hsl(142, 71%, 45%, 0.2)',
      badgeColor: 'hsl(142, 71%, 45%)',
      hasGlow: false
    },
    rare: {
      borderColor: 'hsl(217, 91%, 60%)', // Blue
      glowColor: 'hsl(217, 91%, 60%, 0.3)',
      badgeColor: 'hsl(217, 91%, 60%)',
      hasGlow: true
    },
    epic: {
      borderColor: 'hsl(271, 91%, 65%)', // Purple
      glowColor: 'hsl(271, 91%, 65%, 0.4)',
      badgeColor: 'hsl(271, 91%, 65%)',
      hasGlow: true
    },
    legendary: {
      borderColor: 'hsl(45, 93%, 58%)', // Gold
      glowColor: 'hsl(45, 93%, 58%, 0.4)',
      badgeColor: 'hsl(45, 93%, 58%)',
      hasGlow: true
    }
  };

  return styles[rarity] || styles.common;
};

// Card hover animation styles
export const getCardHoverStyles = () => ({
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'scale(1.05) translateY(-4px)',
    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.4), 0 4px 8px rgba(0, 0, 0, 0.2)'
  }
});

// Quick action button styles
export const getQuickActionStyles = () => ({
  opacity: 0,
  transform: 'translateY(8px)',
  transition: 'all 0.2s ease',
  '&.show': {
    opacity: 1,
    transform: 'translateY(0)'
  }
});

// Rarity badge component styles
export const getRarityBadgeStyles = (rarity: CardRarity = 'common') => {
  const { badgeColor } = getRarityStyles(rarity);
  return {
    backgroundColor: `${badgeColor}20`,
    borderColor: badgeColor,
    color: badgeColor,
    border: `1px solid ${badgeColor}`,
    fontSize: '0.75rem',
    fontWeight: '600',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.025em'
  };
};