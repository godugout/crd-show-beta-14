
import React, { useState } from "react";
import { OptimizedImage } from "./OptimizedImage";
import { Badge } from "@/components/ui/badge";
import { CRDButton } from "@/components/ui/design-system/Button";
import { Eye, Edit, Share2 } from "lucide-react";
import { getRarityStyles, getRarityBadgeStyles, type CardRarity } from "@/utils/cardDisplayUtils";

const formatCredits = (amount: number | string) => {
  const n = typeof amount === "number" ? amount : parseInt(amount);
  return (
    <>
      <span className="align-middle">{n}</span>
      <span className="ml-1">C</span>
    </>
  );
};

interface CardItemProps {
  title: string;
  price: string;
  image: string;
  stock?: string;
  highestBid?: string;
  avatars?: string[];
  rarity?: CardRarity;
  onView?: () => void;
  onEdit?: () => void;
  onShare?: () => void;
}

export const CardItem: React.FC<CardItemProps> = ({
  title,
  price,
  image,
  stock = "3 in stock",
  highestBid = "10",
  avatars = [],
  rarity = 'common',
  onView,
  onEdit,
  onShare,
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const rarityStyles = getRarityStyles(rarity);
  const badgeStyles = getRarityBadgeStyles(rarity);

  // Provide a proper placeholder image
  const placeholderImage = "/placeholder.svg";
  
  // Use placeholder if no image provided or if image failed to load
  const displayImage = !image || imageError || image.startsWith('blob:') ? placeholderImage : image;

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  return (
    <div 
      className="
        self-stretch flex min-w-60 flex-col items-stretch justify-center grow shrink w-[205px] my-auto
        relative cursor-pointer transition-all duration-200 ease-out
        hover:scale-105 hover:-translate-y-1
      "
      style={{
        filter: rarityStyles.hasGlow ? `drop-shadow(0 0 12px ${rarityStyles.glowColor})` : 'none'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onView}
    >
      <div 
        className="justify-center items-stretch flex w-full flex-col overflow-hidden rounded-2xl relative"
        style={{
          border: `2px solid ${rarityStyles.borderColor}`,
          boxShadow: rarityStyles.hasGlow 
            ? `0 0 20px ${rarityStyles.glowColor}, 0 4px 12px rgba(0, 0, 0, 0.3)`
            : '0 4px 12px rgba(0, 0, 0, 0.2)'
        }}
      >
        {/* Rarity Badge */}
        <Badge 
          className="absolute top-2 right-2 z-10 px-2 py-1"
          style={badgeStyles}
        >
          {rarity}
        </Badge>

        <OptimizedImage
          src={image}
          alt={title}
          className="aspect-[0.84] object-cover w-full rounded-t-2xl"
          size="medium"
          fallbackSrc={placeholderImage}
          showSkeleton={true}
        />

        {/* Quick Actions Overlay */}
        <div className={`
          absolute inset-0 bg-black/60 flex items-center justify-center gap-2
          transition-all duration-200 ease-out rounded-2xl
          ${isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}>
          {onView && (
            <CRDButton
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onView();
              }}
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Eye className="w-4 h-4" />
            </CRDButton>
          )}
          {onEdit && (
            <CRDButton
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Edit className="w-4 h-4" />
            </CRDButton>
          )}
          {onShare && (
            <CRDButton
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onShare();
              }}
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Share2 className="w-4 h-4" />
            </CRDButton>
          )}
        </div>
      </div>
      <div className="flex w-full flex-col items-stretch justify-center py-5 rounded-[0px_0px_16px_16px]">
        <div className="flex w-full items-center gap-1.5 font-semibold justify-between">
          <div className="text-[#FCFCFD] text-base self-stretch w-[184px] my-auto">
            {title}
          </div>
          <div className="self-stretch rounded gap-2.5 text-xs text-[#45B26B] uppercase leading-none my-auto pt-2 pb-1.5 px-2 flex items-center">
            {formatCredits(price)}
          </div>
        </div>
        <div className="flex w-full items-center gap-3 mt-3">
          {avatars.length > 0 ? (
            <div className="self-stretch flex items-stretch flex-1 shrink basis-[0%] my-auto pr-11">
              {avatars.map((avatar, index) => (
                <img
                  key={index}
                  src={avatar}
                  className="aspect-[1] object-contain w-6 shrink-0 max-md:-mr-2"
                  alt={`Avatar ${index + 1}`}
                />
              ))}
            </div>
          ) : (
            <img
              src="https://cdn.builder.io/api/v1/image/assets/55d1eea1cc5a43f6bced987c3407a299/da33ffd96da5d705f430a0416c8e2f57c38ce296?placeholderIfAbsent=true"
              className="aspect-[7.35] object-contain w-[177px] self-stretch shrink flex-1 basis-[0%] my-auto"
              alt="Avatars"
            />
          )}
          <div className="text-[#E6E8EC] text-sm font-medium leading-6 self-stretch my-auto">
            {stock}
          </div>
        </div>
        <div className="bg-[#353945] flex min-h-px w-full mt-3 rounded-[1px]" />
        <div className="flex w-full items-center gap-10 text-xs leading-loose justify-between mt-3">
          <div className="self-stretch flex items-center gap-1 my-auto">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/55d1eea1cc5a43f6bced987c3407a299/9202e09deb31056539d3a9c1f50c119094e7e5d3?placeholderIfAbsent=true"
              className="aspect-[1] object-contain w-5 self-stretch shrink-0 my-auto"
              alt="Bid icon"
            />
            <div className="text-[#777E90] font-normal self-stretch my-auto">
              Highest bid
            </div>
            <div className="text-[#FCFCFD] font-semibold self-stretch my-auto flex items-center">
              {formatCredits(highestBid ?? 0)}
            </div>
          </div>
          <div className="self-stretch gap-1 text-[#777E90] font-normal my-auto">
            New bid 🔥
          </div>
        </div>
      </div>
    </div>
  );
};
