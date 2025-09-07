import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';

const CharacterCreation = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    personality: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Character name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    setErrors({});
    
    try {
      // Simulate API call
      setTimeout(() => {
        // For demo purposes, we'll just navigate to dashboard
        // In a real app, you would call your API here
        navigate('/');
        setLoading(false);
      }, 1000);
    } catch (err) {
      console.error('Error creating character:', err);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Create Your Character
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            Design a unique companion for your conversations
          </p>
        </div>
        
        <Card className="mt-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6 p-6">
              <div className="sm:col-span-6">
                <Input
                  id="name"
                  label="Character Name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
                  placeholder="e.g. Sassy Sue"
                />
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <div className="mt-1">
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    placeholder="Describe your character's appearance, background, etc."
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <Input
                  id="personality"
                  label="Personality Traits"
                  name="personality"
                  type="text"
                  value={formData.personality}
                  onChange={handleChange}
                  placeholder="e.g. witty, sarcastic, knowledgeable"
                />
              </div>

              <div className="sm:col-span-6">
                <div className="flex flex-col items-center justify-center w-full">
                  <div className="border-2 border-dashed rounded-xl border-gray-300 p-8 text-center w-full">
                    <div className="space-y-4">
                      <div className="flex justify-center">
                        <div className="bg-gradient-to-br from-primary-400 to-secondary-500 rounded-full w-20 h-20 flex items-center justify-center text-white font-bold text-2xl">
                          {formData.name ? formData.name.charAt(0) : 'A'}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Character avatar</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Upload an image or it will be auto-generated
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Upload Image
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate('/')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Character'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default CharacterCreation;