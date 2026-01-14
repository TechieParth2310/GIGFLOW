import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AnimatedTitle from '../components/AnimatedTitle';

const Home = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-gradient-page relative overflow-hidden page-enter" style={{ color: 'var(--color-text-primary)' }}>
      {/* 2D Graphics Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Geometric shapes for dark mode */}
        <div className="dark:block hidden absolute inset-0 bg-pattern-dark opacity-30"></div>
        {/* Geometric shapes for light mode */}
        <div className="dark:hidden block absolute inset-0 bg-pattern-light opacity-20"></div>
        
        {/* Animated blobs */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-blob-orange rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-blob-ivory rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-blob-orange rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="text-center">
          {/* Main Heading with Amazing Animations */}
          <div className="hero-entrance">
            <AnimatedTitle />
          </div>
          
          {/* Subtitle with Fade In */}
          <p className="mt-6 max-w-2xl mx-auto text-xl sm:text-2xl font-medium subtitle-entrance" style={{ color: 'var(--color-text-secondary)' }}>
            Connect with talented freelancers or find your next project.
          </p>
          <p className="mt-3 max-w-2xl mx-auto text-lg subtitle-entrance" style={{ color: 'var(--color-text-muted)', animationDelay: '0.8s' }}>
            The premium marketplace where opportunities meet talent.
          </p>

          {/* CTA Buttons - No Animations */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/gigs"
              className="premium-button px-8 py-4 text-lg button-hover-mad"
            >
              Browse Gigs
            </Link>
            {!isAuthenticated && (
              <Link
                to="/register"
                className="premium-button-secondary px-8 py-4 text-lg button-hover-mad"
              >
                Get Started Free
              </Link>
            )}
          </div>

          {/* Features Grid with Stagger Animation */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="premium-card p-8 card-hover group animate-fadeInUp scroll-animate" style={{ animationDelay: '1.6s', opacity: 0 }}>
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:shadow-md transition-shadow duration-500" style={{ backgroundColor: 'var(--color-brand-tint)' }}>
                <svg className="w-8 h-8" style={{ color: 'var(--color-brand)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>Post Projects</h3>
              <p className="leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>Post your projects and get bids from talented freelancers worldwide.</p>
            </div>

            <div className="premium-card p-8 card-hover group animate-fadeInUp scroll-animate" style={{ animationDelay: '1.8s', opacity: 0 }}>
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:shadow-md transition-shadow duration-500" style={{ backgroundColor: 'var(--color-brand-tint)' }}>
                <svg className="w-8 h-8" style={{ color: 'var(--color-brand)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>Find Talent</h3>
              <p className="leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>Browse through skilled freelancers and find the perfect match for your project.</p>
            </div>

            <div className="premium-card p-8 card-hover group animate-fadeInUp scroll-animate" style={{ animationDelay: '2s', opacity: 0 }}>
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:shadow-md transition-shadow duration-500" style={{ backgroundColor: 'var(--color-brand-tint)' }}>
                <svg className="w-8 h-8" style={{ color: 'var(--color-brand)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>Real-time Updates</h3>
              <p className="leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>Get instant notifications when you're hired or receive new bids.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
