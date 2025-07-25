import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, X, Wand2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface SmartRule {
  id: string;
  field: string;
  operator: string;
  value: string;
}

interface SmartCollectionModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const SmartCollectionModal = ({ open, onClose, onSuccess }: SmartCollectionModalProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });
  const [rules, setRules] = useState<SmartRule[]>([]);

  const ruleFields = [
    { value: 'rarity', label: 'Rarity' },
    { value: 'card_type', label: 'Card Type' },
    { value: 'power', label: 'Power Level' },
    { value: 'toughness', label: 'Toughness' },
    { value: 'tags', label: 'Tags' },
    { value: 'creator_id', label: 'Creator' },
    { value: 'created_at', label: 'Creation Date' },
    { value: 'favorite_count', label: 'Favorite Count' },
    { value: 'view_count', label: 'View Count' }
  ];

  const operators = {
    rarity: [
      { value: 'equals', label: 'equals' },
      { value: 'not_equals', label: 'not equals' }
    ],
    card_type: [
      { value: 'equals', label: 'equals' },
      { value: 'not_equals', label: 'not equals' }
    ],
    power: [
      { value: 'equals', label: 'equals' },
      { value: 'greater_than', label: 'greater than' },
      { value: 'less_than', label: 'less than' },
      { value: 'between', label: 'between' }
    ],
    toughness: [
      { value: 'equals', label: 'equals' },
      { value: 'greater_than', label: 'greater than' },
      { value: 'less_than', label: 'less than' },
      { value: 'between', label: 'between' }
    ],
    tags: [
      { value: 'contains', label: 'contains' },
      { value: 'not_contains', label: 'does not contain' }
    ],
    creator_id: [
      { value: 'equals', label: 'equals' }
    ],
    created_at: [
      { value: 'after', label: 'after' },
      { value: 'before', label: 'before' },
      { value: 'between', label: 'between' }
    ],
    favorite_count: [
      { value: 'greater_than', label: 'greater than' },
      { value: 'less_than', label: 'less than' }
    ],
    view_count: [
      { value: 'greater_than', label: 'greater than' },
      { value: 'less_than', label: 'less than' }
    ]
  };

  const addRule = () => {
    const newRule: SmartRule = {
      id: Date.now().toString(),
      field: 'rarity',
      operator: 'equals',
      value: ''
    };
    setRules([...rules, newRule]);
  };

  const updateRule = (id: string, field: keyof SmartRule, value: string) => {
    setRules(rules.map(rule => 
      rule.id === id ? { ...rule, [field]: value } : rule
    ));
  };

  const removeRule = (id: string) => {
    setRules(rules.filter(rule => rule.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || rules.length === 0) {
      toast.error('Please provide a title and at least one rule');
      return;
    }

    setLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please login to create a collection');
        return;
      }

      // Create the smart collection
      const { data: collection, error: collectionError } = await supabase
        .from('collections')
        .insert({
          title: formData.title,
          description: formData.description,
          user_id: user.id,
          visibility: 'private' as const,
          metadata: {
            type: 'smart',
            rules: rules,
            auto_update: true
          } as any
        })
        .select()
        .single();

      if (collectionError) {
        throw collectionError;
      }

      toast.success('Smart collection created successfully!');
      onSuccess();
      onClose();
      
      // Reset form
      setFormData({ title: '', description: '' });
      setRules([]);

    } catch (error) {
      console.error('Error creating smart collection:', error);
      toast.error('Failed to create smart collection');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wand2 className="w-5 h-5" />
            Create Smart Collection
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Collection Name *</Label>
              <Input
                placeholder="e.g., 'My Rare Cards' or 'High Power Cards'"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Describe what this collection will automatically include..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
          </div>

          {/* Rules Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Collection Rules</Label>
              <Button type="button" onClick={addRule} size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Rule
              </Button>
            </div>

            {rules.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <Wand2 className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">
                    Add rules to automatically populate this collection
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {rules.map((rule, index) => (
                  <Card key={rule.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        {index > 0 && (
                          <Badge variant="secondary" className="px-2 py-1">
                            AND
                          </Badge>
                        )}
                        
                        <Select
                          value={rule.field}
                          onValueChange={(value) => updateRule(rule.id, 'field', value)}
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {ruleFields.map(field => (
                              <SelectItem key={field.value} value={field.value}>
                                {field.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Select
                          value={rule.operator}
                          onValueChange={(value) => updateRule(rule.id, 'operator', value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {(operators[rule.field as keyof typeof operators] || []).map(op => (
                              <SelectItem key={op.value} value={op.value}>
                                {op.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Input
                          placeholder="Value"
                          value={rule.value}
                          onChange={(e) => updateRule(rule.id, 'value', e.target.value)}
                          className="flex-1"
                        />

                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeRule(rule.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Preview */}
          {rules.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <Label className="text-sm font-medium">Collection Preview</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  This collection will automatically include cards where:
                </p>
                <div className="mt-2 space-y-1">
                  {rules.map((rule, index) => (
                    <p key={rule.id} className="text-sm">
                      {index > 0 && <span className="text-muted-foreground">AND </span>}
                      <span className="font-medium">
                        {ruleFields.find(f => f.value === rule.field)?.label}
                      </span>
                      {' '}
                      <span className="text-muted-foreground">
                        {operators[rule.field as keyof typeof operators]?.find(o => o.value === rule.operator)?.label}
                      </span>
                      {' '}
                      <span className="font-medium">{rule.value || '[value]'}</span>
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading || !formData.title || rules.length === 0}
              className="flex-1"
            >
              {loading ? 'Creating...' : 'Create Smart Collection'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};