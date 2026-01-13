import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { createGig } from '../store/slices/gigSlice';
import toast from 'react-hot-toast';

const CreateGig = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.gigs);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(createGig(formData));
      if (createGig.fulfilled.match(result)) {
        toast.success('Gig created successfully!');
        const gigId = result.payload?.data?._id || result.payload?.data?.id;
        if (gigId) {
          navigate(`/gigs/${gigId}`);
        } else {
          console.error('Gig ID not found in response:', result.payload);
          toast.error('Gig created but failed to navigate. Redirecting to gigs list...');
          navigate('/gigs');
        }
      } else {
        const error = result.payload;
        toast.error(error?.message || 'Failed to create gig');
        if (error?.errors) {
          error.errors.forEach(err => {
            toast.error(`${err.field}: ${err.message}`);
          });
        }
      }
    } catch (error) {
      console.error('Error creating gig:', error);
      toast.error('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-page relative overflow-hidden page-enter" style={{ color: 'var(--color-text-primary)' }}>
      {/* Subtle background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blob-orange rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blob-ivory rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-2000"></div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="glass rounded-3xl shadow-2xl p-8 border" style={{ borderColor: 'var(--color-border)' }}>
          <h1 className="text-5xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
            Post a New Job
          </h1>
          <p className="mb-8" style={{ color: 'var(--color-text-secondary)' }}>
            Post your project and receive applications from talented freelancers
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                Project Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="premium-input"
                placeholder="e.g., Need a modern website redesign"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                Project Description
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows="6"
                value={formData.description}
                onChange={handleChange}
                className="premium-input resize-none"
                placeholder="Describe your project in detail. Include requirements, timeline, and any specific skills needed..."
              />
            </div>

            <div>
              <label htmlFor="budget" className="block text-sm font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                Budget ($)
              </label>
              <input
                type="number"
                id="budget"
                name="budget"
                required
                min="1"
                value={formData.budget}
                onChange={handleChange}
                className="premium-input"
                placeholder="Enter your budget (e.g., 1000)"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="premium-button flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </span>
                ) : (
                  'Create Gig'
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate('/gigs')}
                className="premium-button-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateGig;
