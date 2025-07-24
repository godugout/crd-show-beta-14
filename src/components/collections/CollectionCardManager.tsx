import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  DragDropContext, 
  Droppable, 
  Draggable, 
  DropResult 
} from '@hello-pangea/dnd';
import { 
  GripVertical, 
  Trash2, 
  Star, 
  Eye, 
  MoreHorizontal,
  CheckSquare,
  Square
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import type { CardData } from '@/types/card';

interface CollectionCardManagerProps {
  cards: CardData[];
  onReorder: (cards: CardData[]) => void;
  onRemoveCards: (cardIds: string[]) => void;
  onSetFeatured: (cardId: string) => void;
  featuredCardId?: string;
}

export const CollectionCardManager: React.FC<CollectionCardManagerProps> = ({
  cards,
  onReorder,
  onRemoveCards,
  onSetFeatured,
  featuredCardId
}) => {
  const [selectedCards, setSelectedCards] = useState<Set<string>>(new Set());
  const [bulkMode, setBulkMode] = useState(false);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(cards);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onReorder(items);
  };

  const toggleCardSelection = (cardId: string) => {
    const newSelected = new Set(selectedCards);
    if (newSelected.has(cardId)) {
      newSelected.delete(cardId);
    } else {
      newSelected.add(cardId);
    }
    setSelectedCards(newSelected);
  };

  const selectAllCards = () => {
    if (selectedCards.size === cards.length) {
      setSelectedCards(new Set());
    } else {
      setSelectedCards(new Set(cards.map(card => card.id)));
    }
  };

  const handleBulkRemove = () => {
    onRemoveCards(Array.from(selectedCards));
    setSelectedCards(new Set());
    setBulkMode(false);
  };

  return (
    <div className="space-y-4">
      {/* Bulk Actions Header */}
      <div className="flex items-center justify-between p-4 bg-crd-mediumGray rounded-lg">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setBulkMode(!bulkMode)}
            className="border-crd-lightGray text-crd-white hover:bg-crd-dark"
          >
            {bulkMode ? <CheckSquare className="h-4 w-4 mr-2" /> : <Square className="h-4 w-4 mr-2" />}
            Bulk Select
          </Button>
          
          {bulkMode && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={selectAllCards}
                className="text-crd-white hover:bg-crd-dark"
              >
                {selectedCards.size === cards.length ? 'Deselect All' : 'Select All'}
              </Button>
              
              {selectedCards.size > 0 && (
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-crd-green text-black">
                    {selectedCards.size} selected
                  </Badge>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={handleBulkRemove}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove Selected
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
        
        <div className="text-sm text-crd-lightGray">
          {cards.length} cards total
        </div>
      </div>

      {/* Drag and Drop Card List */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="collection-cards">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-2"
            >
              {cards.map((card, index) => (
                <Draggable key={card.id} draggableId={card.id} index={index}>
                  {(provided, snapshot) => (
                    <Card
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`
                        bg-crd-dark border-crd-mediumGray transition-all
                        ${snapshot.isDragging ? 'shadow-lg ring-2 ring-crd-green' : ''}
                        ${selectedCards.has(card.id) ? 'ring-1 ring-crd-green' : ''}
                      `}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          {/* Drag Handle */}
                          <div {...provided.dragHandleProps}>
                            <GripVertical className="h-5 w-5 text-crd-lightGray cursor-grab" />
                          </div>

                          {/* Bulk Select Checkbox */}
                          {bulkMode && (
                            <Checkbox
                              checked={selectedCards.has(card.id)}
                              onCheckedChange={() => toggleCardSelection(card.id)}
                            />
                          )}

                          {/* Card Preview */}
                          <img
                            src={card.image_url || '/placeholder.svg'}
                            alt={card.title}
                            className="w-16 h-20 object-cover rounded bg-crd-mediumGray"
                          />

                          {/* Card Info */}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-crd-white font-medium">{card.title}</h3>
                              {featuredCardId === card.id && (
                                <Badge className="bg-amber-500 text-black">
                                  <Star className="h-3 w-3 mr-1" />
                                  Featured
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-crd-lightGray capitalize">
                              {card.rarity} • {card.tags?.join(', ')}
                            </p>
                            {card.view_count && (
                              <div className="flex items-center gap-1 mt-1">
                                <Eye className="h-3 w-3 text-crd-lightGray" />
                                <span className="text-xs text-crd-lightGray">{card.view_count} views</span>
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-crd-lightGray hover:text-crd-white">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-crd-dark border-crd-mediumGray">
                              <DropdownMenuItem 
                                onClick={() => onSetFeatured(card.id)}
                                className="text-crd-white hover:bg-crd-mediumGray"
                              >
                                <Star className="mr-2 h-4 w-4" />
                                {featuredCardId === card.id ? 'Remove Featured' : 'Set as Featured'}
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => onRemoveCards([card.id])}
                                className="text-red-400 hover:bg-crd-mediumGray"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Remove from Collection
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {cards.length === 0 && (
        <div className="text-center py-12 text-crd-lightGray">
          <p>No cards in this collection yet.</p>
          <p className="text-sm mt-1">Add some cards to get started!</p>
        </div>
      )}
    </div>
  );
};