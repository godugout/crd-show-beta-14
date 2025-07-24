
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, MessageCircle, Bug, Heart } from 'lucide-react';
import { toast } from 'sonner';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'general'
  });

  const contactTypes = [
    { id: 'general', label: 'General Question', icon: MessageCircle },
    { id: 'bug', label: 'Bug Report', icon: Bug },
    { id: 'feature', label: 'Feature Request', icon: Heart },
    { id: 'support', label: 'Technical Support', icon: Mail }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // For now, just show a success message
    toast.success('Message sent! We\'ll get back to you within 24 hours.');
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
      type: 'general'
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-crd-darkest">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Contact Us</h1>
          <p className="text-xl text-crd-lightGray">
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="bg-crd-dark border-crd-mediumGray p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Send us a message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-medium mb-2">Name</label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your name"
                      className="bg-crd-darkest border-crd-mediumGray text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">Email</label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your@email.com"
                      className="bg-crd-darkest border-crd-mediumGray text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">What can we help you with?</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {contactTypes.map((type) => {
                      const IconComponent = type.icon;
                      return (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, type: type.id }))}
                          className={`p-3 rounded-lg border transition-colors ${
                            formData.type === type.id
                              ? 'border-crd-green bg-crd-green/10 text-crd-green'
                              : 'border-crd-mediumGray text-crd-lightGray hover:border-crd-green/50'
                          }`}
                        >
                          <IconComponent className="h-5 w-5 mx-auto mb-1" />
                          <div className="text-xs font-medium">{type.label}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Subject</label>
                  <Input
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="Brief description of your inquiry"
                    className="bg-crd-darkest border-crd-mediumGray text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Message</label>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell us more about your question or issue..."
                    rows={6}
                    className="bg-crd-darkest border-crd-mediumGray text-white"
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-crd-green hover:bg-crd-green/90 text-black font-medium"
                >
                  Send Message
                </Button>
              </form>
            </Card>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <Card className="bg-crd-dark border-crd-mediumGray p-6">
              <h3 className="text-xl font-bold text-white mb-4">Other ways to reach us</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-white mb-1">Community</h4>
                  <p className="text-crd-lightGray text-sm">
                    Join our Discord community for quick help and to connect with other creators.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-1">Documentation</h4>
                  <p className="text-crd-lightGray text-sm">
                    Check our help center for detailed guides and tutorials.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-1">Response Time</h4>
                  <p className="text-crd-lightGray text-sm">
                    We typically respond within 24 hours during business days.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="bg-crd-dark border-crd-mediumGray p-6">
              <h3 className="text-xl font-bold text-white mb-4">Frequently Asked</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-white text-sm">How do I create my first card?</h4>
                  <p className="text-crd-lightGray text-xs">Check our getting started guide for a step-by-step walkthrough.</p>
                </div>
                <div>
                  <h4 className="font-medium text-white text-sm">Can I export my cards?</h4>
                  <p className="text-crd-lightGray text-xs">Yes! Export as PNG, JPG, or animated GIF in high resolution.</p>
                </div>
                <div>
                  <h4 className="font-medium text-white text-sm">Is there a mobile app?</h4>
                  <p className="text-crd-lightGray text-xs">Our web app works great on mobile devices with full functionality.</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
