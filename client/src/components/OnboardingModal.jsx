import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const OnboardingModal = ({ onClose }) => {
  const { mode: theme } = useSelector((state) => state.theme);
  const isDarkMode = theme === "dark";
  const navigate = useNavigate();

  const handleGetStarted = () => {
    onClose();
    navigate("/login");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
    >
      <div
        className="max-w-2xl w-full p-4 sm:p-6 md:p-8 relative max-h-[90vh] overflow-y-auto"
        style={{
          backgroundColor: "var(--color-surface)",
          border: isDarkMode ? "2px solid #CCFF00" : "2px solid #38BDF8",
          boxShadow: isDarkMode
            ? "0 0 20px rgba(204, 255, 0, 0.3), 0 10px 40px rgba(0, 0, 0, 0.5)"
            : "0 0 20px rgba(56, 189, 248, 0.3), 0 10px 40px rgba(0, 0, 0, 0.1)",
          borderRadius: "1.5rem",
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg"
          style={{
            color: isDarkMode ? "#CCFF00" : "#38BDF8",
            backgroundColor: "transparent",
            border: `1px solid ${isDarkMode ? "#CCFF00" : "#38BDF8"}`,
          }}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Header */}
        <div className="text-center mb-4 sm:mb-6">
          <h2
            className="text-2xl sm:text-3xl font-bold mb-2"
            style={{ color: "var(--color-text-primary)" }}
          >
            Welcome to GigFlow! 🚀
          </h2>
          <p
            className="text-base sm:text-lg"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Your premium freelance marketplace
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Two Modes Section */}
          <div
            className="p-6"
            style={{
              backgroundColor: isDarkMode
                ? "rgba(204, 255, 0, 0.08)"
                : "rgba(56, 189, 248, 0.08)",
              border: `1px solid ${
                isDarkMode
                  ? "rgba(204, 255, 0, 0.3)"
                  : "rgba(56, 189, 248, 0.3)"
              }`,
              borderRadius: "1rem",
            }}
          >
            <h3
              className="text-xl font-bold mb-4 flex items-center gap-2"
              style={{ color: isDarkMode ? "#CCFF00" : "#38BDF8" }}
            >
              <span>🔄</span> Two Modes, One Platform
            </h3>
            <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
              {/* Client Mode */}
              <div
                className="p-4 rounded-lg"
                style={{ backgroundColor: "var(--color-surface)" }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">👔</span>
                  <h4
                    className="font-bold"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    Client Mode
                  </h4>
                </div>
                <ul
                  className="text-sm space-y-1"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  <li>• Post gigs and projects</li>
                  <li>• Manage your gigs</li>
                  <li>• Review proposals</li>
                  <li>• Hire freelancers</li>
                </ul>
              </div>

              {/* Freelancer Mode */}
              <div
                className="p-4 rounded-lg"
                style={{ backgroundColor: "var(--color-surface)" }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">💼</span>
                  <h4
                    className="font-bold"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    Freelancer Mode
                  </h4>
                </div>
                <ul
                  className="text-sm space-y-1"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  <li>• Browse open gigs</li>
                  <li>• Submit proposals</li>
                  <li>• Track your bids</li>
                  <li>• Get hired!</li>
                </ul>
              </div>
            </div>
            <p
              className="mt-4 text-sm font-semibold"
              style={{ color: isDarkMode ? "#CCFF00" : "#38BDF8" }}
            >
              💡 Switch modes anytime using the toggle in the navbar!
            </p>
          </div>

          {/* Key Features */}
          <div>
            <h3
              className="text-xl font-bold mb-4"
              style={{ color: "var(--color-text-primary)" }}
            >
              ✨ Key Features
            </h3>
            <div className="grid sm:grid-cols-2 gap-2 sm:gap-3">
              <div
                className="flex items-start gap-3 p-3 rounded-lg"
                style={{
                  backgroundColor: isDarkMode
                    ? "rgba(204, 255, 0, 0.05)"
                    : "rgba(56, 189, 248, 0.05)",
                  border: `1px solid ${
                    isDarkMode
                      ? "rgba(204, 255, 0, 0.2)"
                      : "rgba(56, 189, 248, 0.2)"
                  }`,
                }}
              >
                <span className="text-xl">🔍</span>
                <div>
                  <p
                    className="font-semibold text-sm"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    Smart Filters
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    Search by budget, status, and more
                  </p>
                </div>
              </div>
              <div
                className="flex items-start gap-3 p-3 rounded-lg"
                style={{
                  backgroundColor: isDarkMode
                    ? "rgba(204, 255, 0, 0.05)"
                    : "rgba(56, 189, 248, 0.05)",
                  border: `1px solid ${
                    isDarkMode
                      ? "rgba(204, 255, 0, 0.2)"
                      : "rgba(56, 189, 248, 0.2)"
                  }`,
                }}
              >
                <span className="text-xl">🔔</span>
                <div>
                  <p
                    className="font-semibold text-sm"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    Real-time Notifications
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    Get instant updates on bids and hires
                  </p>
                </div>
              </div>
              <div
                className="flex items-start gap-3 p-3 rounded-lg"
                style={{
                  backgroundColor: isDarkMode
                    ? "rgba(204, 255, 0, 0.05)"
                    : "rgba(56, 189, 248, 0.05)",
                  border: `1px solid ${
                    isDarkMode
                      ? "rgba(204, 255, 0, 0.2)"
                      : "rgba(56, 189, 248, 0.2)"
                  }`,
                }}
              >
                <span className="text-xl">🌓</span>
                <div>
                  <p
                    className="font-semibold text-sm"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    Dark/Light Mode
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    Toggle theme for comfortable viewing
                  </p>
                </div>
              </div>
              <div
                className="flex items-start gap-3 p-3 rounded-lg"
                style={{
                  backgroundColor: isDarkMode
                    ? "rgba(204, 255, 0, 0.05)"
                    : "rgba(56, 189, 248, 0.05)",
                  border: `1px solid ${
                    isDarkMode
                      ? "rgba(204, 255, 0, 0.2)"
                      : "rgba(56, 189, 248, 0.2)"
                  }`,
                }}
              >
                <span className="text-xl">📊</span>
                <div>
                  <p
                    className="font-semibold text-sm"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    View & Proposal Stats
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    Track gig popularity and interest
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4">
            <button
              onClick={handleGetStarted}
              className="flex-1"
              style={{
                padding: "0.75rem 1.5rem",
                borderRadius: "1rem",
                fontWeight: 600,
                color: "white",
                background: "var(--gradient-button)",
                border: "none",
                boxShadow: "var(--shadow-button)",
                cursor: "pointer",
              }}
            >
              Get Started!
            </button>
            <button
              onClick={onClose}
              className="px-6"
              style={{
                padding: "0.75rem 1.5rem",
                borderRadius: "1rem",
                fontWeight: 600,
                color: "var(--color-text-primary)",
                background: "var(--color-surface)",
                border: "2px solid var(--color-border)",
                boxShadow: "var(--shadow-card)",
                cursor: "pointer",
              }}
            >
              Skip
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingModal;
