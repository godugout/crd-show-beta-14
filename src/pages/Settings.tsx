
import React, { useState } from 'react';
import { useAuth } from '@/features/auth/providers/AuthProvider';
import { useProfile } from '@/hooks/useProfile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { LoadingState } from '@/components/common/LoadingState';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { User, Mail, Globe, MapPin, Save, Eye, EyeOff } from 'lucide-react';

interface UserPreferences {
  darkMode?: boolean;
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  profileVisibility?: boolean;
  showCardValue?: boolean;
  compactView?: boolean;
}

const Settings = () => {
  const { user, signOut } = useAuth();
  const { profile, updateProfile, isLoading, isUpdating } = useProfile(user?.id);
  
  const [formData, setFormData] = useState({
    username: profile?.username || '',
    full_name: profile?.full_name || '',
    bio: profile?.bio || '',
    website: profile?.website || '',
    location: profile?.location || '',
    avatar_url: profile?.avatar_url || ''
  });

  const getPreferencesAsObject = (preferences: any): UserPreferences => {
    if (!preferences) return {};
    if (typeof preferences === 'string') {
      try {
        return JSON.parse(preferences);
      } catch {
        return {};
      }
    }
    if (typeof preferences === 'object') {
      return preferences as UserPreferences;
    }
    return {};
  };

  const profilePreferences = getPreferencesAsObject(profile?.preferences);

  const [preferences, setPreferences] = useState<UserPreferences>({
    darkMode: profilePreferences.darkMode || false,
    emailNotifications: profilePreferences.emailNotifications || true,
    pushNotifications: profilePreferences.pushNotifications || true,
    profileVisibility: profilePreferences.profileVisibility || true,
    showCardValue: profilePreferences.showCardValue || true,
    compactView: profilePreferences.compactView || false
  });

  // Update form data when profile loads
  React.useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username || '',
        full_name: profile.full_name || '',
        bio: profile.bio || '',
        website: profile.website || '',
        location: profile.location || '',
        avatar_url: profile.avatar_url || ''
      });
      
      const updatedPreferences = getPreferencesAsObject(profile.preferences);
      setPreferences({
        darkMode: updatedPreferences.darkMode || false,
        emailNotifications: updatedPreferences.emailNotifications || true,
        pushNotifications: updatedPreferences.pushNotifications || true,
        profileVisibility: updatedPreferences.profileVisibility || true,
        showCardValue: updatedPreferences.showCardValue || true,
        compactView: updatedPreferences.compactView || false
      });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updateProfile({
        ...formData,
        preferences: preferences
      });
    } catch (error) {
      console.error('Settings update error:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Error signing out');
    }
  };

  if (isLoading) {
    return <LoadingState message="Loading settings..." fullPage size="lg" />;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-crd-darkest flex items-center justify-center">
        <Card className="bg-crd-dark border-crd-mediumGray p-6 max-w-md w-full mx-4">
          <CardContent className="text-center">
            <h2 className="text-2xl font-bold text-crd-white mb-4">Please sign in to access settings</h2>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-crd-darkest">
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-crd-white mb-2">Settings</h1>
          <p className="text-crd-lightGray">Manage your account and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Settings */}
          <div className="lg:col-span-2">
            <Card className="bg-crd-dark border-crd-mediumGray">
              <CardHeader>
                <CardTitle className="text-crd-white flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Avatar */}
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-20 h-20">
                      <AvatarImage src={formData.avatar_url} alt={formData.full_name} />
                      <AvatarFallback className="bg-crd-mediumGray text-crd-white text-xl">
                        {(formData.full_name || formData.username)?.[0]?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <Label htmlFor="avatar_url" className="text-crd-lightGray">Avatar URL</Label>
                      <Input
                        id="avatar_url"
                        value={formData.avatar_url}
                        onChange={(e) => setFormData(prev => ({ ...prev, avatar_url: e.target.value }))}
                        className="bg-crd-mediumGray border-crd-lightGray text-crd-white"
                        placeholder="https://example.com/avatar.jpg"
                      />
                    </div>
                  </div>

                  {/* Username */}
                  <div>
                    <Label htmlFor="username" className="text-crd-lightGray">Username</Label>
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                      className="bg-crd-mediumGray border-crd-lightGray text-crd-white"
                      required
                    />
                  </div>

                  {/* Full Name */}
                  <div>
                    <Label htmlFor="full_name" className="text-crd-lightGray">Full Name</Label>
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                      className="bg-crd-mediumGray border-crd-lightGray text-crd-white"
                    />
                  </div>

                  {/* Bio */}
                  <div>
                    <Label htmlFor="bio" className="text-crd-lightGray">Bio</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                      className="bg-crd-mediumGray border-crd-lightGray text-crd-white"
                      rows={3}
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  {/* Website */}
                  <div>
                    <Label htmlFor="website" className="text-crd-lightGray flex items-center">
                      <Globe className="w-4 h-4 mr-1" />
                      Website
                    </Label>
                    <Input
                      id="website"
                      value={formData.website}
                      onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                      className="bg-crd-mediumGray border-crd-lightGray text-crd-white"
                      placeholder="https://yourwebsite.com"
                    />
                  </div>

                  {/* Location */}
                  <div>
                    <Label htmlFor="location" className="text-crd-lightGray flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      Location
                    </Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      className="bg-crd-mediumGray border-crd-lightGray text-crd-white"
                      placeholder="City, Country"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-crd-green hover:bg-crd-green/90 text-white"
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                      <>Saving...</>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Preferences */}
          <div className="space-y-6">
            <Card className="bg-crd-dark border-crd-mediumGray">
              <CardHeader>
                <CardTitle className="text-crd-white">Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-crd-white">Email Notifications</Label>
                    <p className="text-sm text-crd-lightGray">Receive email updates</p>
                  </div>
                  <Switch
                    checked={preferences.emailNotifications}
                    onCheckedChange={(checked) => 
                      setPreferences(prev => ({ ...prev, emailNotifications: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-crd-white flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      Profile Visibility
                    </Label>
                    <p className="text-sm text-crd-lightGray">Make profile public</p>
                  </div>
                  <Switch
                    checked={preferences.profileVisibility}
                    onCheckedChange={(checked) => 
                      setPreferences(prev => ({ ...prev, profileVisibility: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-crd-white">Show Card Values</Label>
                    <p className="text-sm text-crd-lightGray">Display card prices</p>
                  </div>
                  <Switch
                    checked={preferences.showCardValue}
                    onCheckedChange={(checked) => 
                      setPreferences(prev => ({ ...prev, showCardValue: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-crd-white">Compact View</Label>
                    <p className="text-sm text-crd-lightGray">Condensed layout</p>
                  </div>
                  <Switch
                    checked={preferences.compactView}
                    onCheckedChange={(checked) => 
                      setPreferences(prev => ({ ...prev, compactView: checked }))
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Account Actions */}
            <Card className="bg-crd-dark border-crd-mediumGray">
              <CardHeader>
                <CardTitle className="text-crd-white">Account</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2 text-crd-lightGray">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{user.email}</span>
                </div>
                
                <Separator className="bg-crd-mediumGray" />
                
                <Button 
                  onClick={handleSignOut}
                  variant="destructive"
                  className="w-full"
                >
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
