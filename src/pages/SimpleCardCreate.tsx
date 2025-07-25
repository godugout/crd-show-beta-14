import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CardCreationInterface } from '@/components/cards/CardCreationInterface';
import type { CardData } from '@/types/card';

const SimpleCardCreate = () => {
  const navigate = useNavigate();

  const handleComplete = (cardData: CardData) => {
    console.log('Card created successfully:', cardData);
    navigate('/user/gallery');
  };

  const handleCancel = () => {
    navigate('/user/gallery');
  };

  return (
    <div className="min-h-screen bg-crd-darkest pt-16">
      <CardCreationInterface 
        onComplete={handleComplete}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default SimpleCardCreate;