
import { useNavigate } from 'react-router-dom';

export const useGalleryActions = () => {
  const navigate = useNavigate();

  const handleCardClick = (card: any) => {
    // Navigate directly to studio for the clicked card
    if (card && card.id) {
      console.log(`🎯 Gallery: Navigating to Studio for card: ${card.id}`);
      navigate(`/studio/${card.id}`);
    }
  };

  const handleCreateCollection = () => {
    console.log('Create collection clicked');
    // TODO: Implement collection creation
  };

  return {
    handleCardClick,
    handleCreateCollection
  };
};
