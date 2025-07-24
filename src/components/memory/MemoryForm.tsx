
import React from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Loader } from 'lucide-react';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { CRDInput } from '@/components/ui/design-system/Input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Form } from '@/components/ui/form';
import type { Team } from '@/types/team';
import type { Visibility } from '@/types/common';

interface FormValues {
  title: string;
  description: string;
  teamId: string;
  visibility: Visibility;
}

interface MemoryFormProps {
  teams: Team[];
  teamsLoading: boolean;
  defaultTeamId?: string;
  defaultVisibility?: Visibility;
  onSubmit: (data: FormValues) => Promise<void>;
  isCreating: boolean;
}

export const MemoryForm = ({
  teams,
  teamsLoading,
  defaultTeamId,
  defaultVisibility = 'private',
  onSubmit,
  isCreating
}: MemoryFormProps) => {
  const form = useForm<FormValues>({
    defaultValues: {
      title: '',
      description: '',
      teamId: defaultTeamId || '',
      visibility: defaultVisibility,
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-crd-white font-medium">Title</FormLabel>
              <FormControl>
                <CRDInput 
                  variant="crd"
                  placeholder="Enter memory title" 
                  {...field} 
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-crd-white font-medium">Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe your memory..."
                  className="min-h-[100px] bg-crd-dark border-crd-mediumGray text-crd-white placeholder:text-crd-lightGray focus-visible:ring-crd-blue focus-visible:border-crd-blue"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="teamId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-crd-white font-medium">Team</FormLabel>
              <Select
                disabled={teamsLoading}
                onValueChange={field.onChange}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger className="bg-crd-dark border-crd-mediumGray text-crd-white">
                    <SelectValue placeholder="Select team" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-crd-dark border-crd-mediumGray">
                  {teams?.map(team => (
                    <SelectItem 
                      key={team.id} 
                      value={team.id}
                      className="text-crd-white hover:bg-crd-mediumGray"
                    >
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="visibility"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-crd-white font-medium">Visibility</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger className="bg-crd-dark border-crd-mediumGray text-crd-white">
                    <SelectValue placeholder="Select visibility" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-crd-dark border-crd-mediumGray">
                  <SelectItem value="private" className="text-crd-white hover:bg-crd-mediumGray">Private</SelectItem>
                  <SelectItem value="public" className="text-crd-white hover:bg-crd-mediumGray">Public</SelectItem>
                  <SelectItem value="shared" className="text-crd-white hover:bg-crd-mediumGray">Shared</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <CRDButton 
          type="submit"
          variant="primary"
          className="w-full"
          disabled={isCreating}
        >
          {isCreating ? (
            <Loader className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Plus className="mr-2 h-4 w-4" />
          )}
          Create Memory
        </CRDButton>
      </form>
    </Form>
  );
};
