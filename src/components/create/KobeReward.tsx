
import React from 'react';

interface KobeRewardProps {
  onAnimationComplete: () => void;
  animationFinished: boolean;
}

export const KobeReward: React.FC<KobeRewardProps> = ({ onAnimationComplete, animationFinished }) => {
  // Show reward immediately when animation finishes
  React.useEffect(() => {
    if (animationFinished) {
      console.log('🎯 Animation finished, showing Kobe reward');
      onAnimationComplete();
    }
  }, [animationFinished, onAnimationComplete]);

  if (!animationFinished) {
    console.log('🔄 Animation not finished yet, hiding reward');
    return null;
  }

  console.log('🏆 Showing Kobe reward with chalk text and arrow');

  return (
    <div className="fixed top-1/3 right-8 z-50 pointer-events-none">
      {/* Chalk-style text and arrow pointing to dropzone */}
      <div className="relative">
        {/* Curved arrow pointing down-left to dropzone */}
        <div className="absolute -left-24 top-12 flex items-center">
          <div className="font-caveat text-white/90 text-lg mr-3 transform -rotate-6 whitespace-nowrap">
            Drag to editor below!
          </div>
          <svg
            width="80"
            height="60"
            viewBox="0 0 80 60"
            className="text-crd-orange"
          >
            <defs>
              <marker
                id="chalk-arrowhead"
                markerWidth="12"
                markerHeight="9"
                refX="10"
                refY="4.5"
                orient="auto"
                markerUnits="strokeWidth"
              >
                <polygon
                  points="0 0, 12 4.5, 0 9"
                  fill="currentColor"
                />
              </marker>
            </defs>
            <path
              d="M 10 20 Q 40 5 70 45"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
              markerEnd="url(#chalk-arrowhead)"
              className="animate-pulse"
              strokeDasharray="2,2"
            />
          </svg>
        </div>

        {/* Draggable Kobe card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-crd-orange/50 shadow-lg pointer-events-auto">
          <p className="font-caveat text-white/90 text-sm mb-2 text-center transform -rotate-1">
            Practice Card Unlocked!
          </p>
          <div
            className="w-20 h-28 rounded border-2 border-dashed border-crd-orange/50 overflow-hidden cursor-grab hover:border-crd-orange transition-colors bg-cover bg-center relative group"
            style={{ backgroundImage: `url(/lovable-uploads/7a70c708-b669-4cb2-b5db-df422389b32b.png)` }}
            draggable
            onDragStart={(e) => {
              console.log('🏀 Starting Kobe card drag');
              e.dataTransfer.setData('application/json', JSON.stringify({
                type: 'example-card',
                imageUrl: '/lovable-uploads/7a70c708-b669-4cb2-b5db-df422389b32b.png',
                name: 'kobe-card-example.png'
              }));
            }}
            title="Drag this onto the CRD editor to use Kobe Bryant example"
          >
            <div className="w-full h-full bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center">
              <span className="text-white text-xs font-bold mb-1 group-hover:text-crd-orange transition-colors font-caveat">
                Kobe
              </span>
            </div>
            
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
