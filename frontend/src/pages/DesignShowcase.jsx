import React, { useState } from 'react';
import { 
  FiUsers, FiActivity, FiTrendingUp, FiClock, FiCheckCircle, 
  FiAlertCircle, FiInfo, FiSettings, FiStar, FiHeart 
} from 'react-icons/fi';
import ThemeToggle from '../components/ThemeToggle';

const DesignShowcase = () => {
  const [progress, setProgress] = useState(70);

  return (
    <div className="bg-pattern" style={{ minHeight: '100vh', padding: '2rem 0' }}>
      <div className="container">
        
        {/* Header with Theme Toggle */}
        <div className="flex items-center justify-between mb-xl">
          <div>
            <h1 className="mb-sm">Apple-Inspired Design System</h1>
            <p className="text-secondary">Premium components with San Francisco font</p>
          </div>
          <ThemeToggle />
        </div>

        {/* Stats Cards with Glassmorphism */}
        <div className="mb-xl">
          <h3 className="mb-lg">Glassmorphism Stats Cards</h3>
          <div className="grid-4">
            <div className="card-glass fade-in">
              <div className="flex items-center justify-between mb-sm">
                <div className="text-tiny">TOTAL USERS</div>
                <FiUsers size={20} color="var(--accent-blue)" />
              </div>
              <h2 className="text-gradient-blue">1,234</h2>
              <div className="flex items-center gap-sm mt-sm">
                <span className="status-dot status-dot-green"></span>
                <span className="text-small">+12% this month</span>
              </div>
            </div>

            <div className="card-glass fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center justify-between mb-sm">
                <div className="text-tiny">ACTIVE TESTS</div>
                <FiActivity size={20} color="var(--accent-green)" />
              </div>
              <h2 className="text-gradient-green">56</h2>
              <div className="flex items-center gap-sm mt-sm">
                <span className="status-dot status-dot-blue"></span>
                <span className="text-small">8 created today</span>
              </div>
            </div>

            <div className="card-glass fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center justify-between mb-sm">
                <div className="text-tiny">COMPLETION RATE</div>
                <FiTrendingUp size={20} color="var(--accent-yellow)" />
              </div>
              <h2>87%</h2>
              <div className="progress-bar mt-sm">
                <div className="progress-fill progress-fill-success" style={{ width: '87%' }}></div>
              </div>
            </div>

            <div className="card-glass fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center justify-between mb-sm">
                <div className="text-tiny">AVG. TIME</div>
                <FiClock size={20} color="var(--accent-purple)" />
              </div>
              <h2>24m</h2>
              <div className="flex items-center gap-sm mt-sm">
                <span className="status-dot status-dot-yellow"></span>
                <span className="text-small">-5 min improved</span>
              </div>
            </div>
          </div>
        </div>

        {/* Member Cards (Like Image 1) */}
        <div className="mb-xl">
          <h3 className="mb-lg">Member Cards</h3>
          <div className="grid-2">
            <div className="card-member hover-lift">
              <div className="flex items-center gap-md">
                <div className="avatar avatar-lg avatar-status">
                  <div style={{ background: '#FFB4A8', color: 'white' }}>ET</div>
                </div>
                <div style={{ flex: 1 }}>
                  <h4>Emma Thompson</h4>
                  <p className="text-small">emmathompson@mail.com</p>
                  <p className="text-tiny mt-sm">Next: Jun 25, 2024</p>
                </div>
                <span className="badge-success badge-dot">Active</span>
              </div>
              <div className="card-divider"></div>
              <div className="flex gap-sm">
                <span className="badge-purple">Membership Program</span>
                <span className="badge-warning">Featured</span>
              </div>
              <div className="card-divider"></div>
              <div className="grid-2" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', fontSize: '0.875rem' }}>
                <div>
                  <div className="text-tiny mb-sm">AGE</div>
                  <div>46 y/o</div>
                </div>
                <div>
                  <div className="text-tiny mb-sm">SEX</div>
                  <div>Female</div>
                </div>
                <div>
                  <div className="text-tiny mb-sm">LOCATION</div>
                  <div>New York</div>
                </div>
                <div>
                  <div className="text-tiny mb-sm">STATUS</div>
                  <div>Confirmed</div>
                </div>
              </div>
            </div>

            <div className="card-member hover-lift">
              <div className="flex items-center gap-md">
                <div className="avatar avatar-lg avatar-status avatar-status-offline">
                  <div style={{ background: '#A8E6D7', color: 'white' }}>JD</div>
                </div>
                <div style={{ flex: 1 }}>
                  <h4>John Doe</h4>
                  <p className="text-small">johndoe@mail.com</p>
                  <p className="text-tiny mt-sm">Last seen: 2 hours ago</p>
                </div>
                <span className="badge-neutral">Offline</span>
              </div>
              <div className="card-divider"></div>
              <div className="flex gap-sm">
                <span className="badge-info">Standard</span>
                <span className="badge-pink">New User</span>
              </div>
              <div className="card-divider"></div>
              <div className="grid-2" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', fontSize: '0.875rem' }}>
                <div>
                  <div className="text-tiny mb-sm">AGE</div>
                  <div>32 y/o</div>
                </div>
                <div>
                  <div className="text-tiny mb-sm">SEX</div>
                  <div>Male</div>
                </div>
                <div>
                  <div className="text-tiny mb-sm">LOCATION</div>
                  <div>London</div>
                </div>
                <div>
                  <div className="text-tiny mb-sm">STATUS</div>
                  <div>Pending</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status Cards (Like Image 2) */}
        <div className="mb-xl">
          <h3 className="mb-lg">Status Cards</h3>
          <div className="grid-3">
            <div className="card-status hover-lift">
              <div className="flex items-center gap-sm">
                <div className="avatar avatar-sm avatar-status">
                  <div style={{ background: '#C7CEEA' }}>C</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div className="font-semibold">Cody</div>
                  <div className="text-small">Awake · 20m ago</div>
                </div>
                <span>😴</span>
              </div>
              <div className="card-divider"></div>
              <div className="flex items-center justify-between">
                <div className="text-small">8h 47m</div>
                <div className="text-tiny">TIME ASLEEP</div>
              </div>
              <div className="progress-bar mt-sm">
                <div className="progress-fill" style={{ width: '65%' }}></div>
              </div>
            </div>

            <div className="card-status hover-lift">
              <div className="flex items-center gap-sm">
                <div className="avatar avatar-sm avatar-status">
                  <div style={{ background: '#FFD6BA' }}>S</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div className="font-semibold">Shane</div>
                  <div className="text-small">At home</div>
                </div>
                <span className="badge-success badge-sm">Active</span>
              </div>
            </div>

            <div className="card-status hover-lift">
              <div className="flex items-center gap-sm">
                <div className="avatar avatar-sm avatar-status avatar-status-busy">
                  <div style={{ background: '#FFB4A8' }}>V</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div className="font-semibold">Victoria</div>
                  <div className="text-small">Flying to Osaka ✈️</div>
                </div>
              </div>
              <div className="card-divider"></div>
              <div className="flex items-center justify-between text-small">
                <div>
                  <div className="text-tiny mb-sm">LAX</div>
                  <div className="font-semibold">1:50 PM PST</div>
                </div>
                <div className="text-center" style={{ flex: 1 }}>
                  <div className="progress-bar" style={{ maxWidth: '100px', margin: '0 auto' }}>
                    <div className="progress-fill progress-fill-success" style={{ width: '45%' }}></div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-tiny mb-sm">ITM</div>
                  <div className="font-semibold">8:30 AM GMT+9</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Project Progress (Like Image 3) */}
        <div className="mb-xl">
          <h3 className="mb-lg">Project Dashboard</h3>
          <div className="card-elevated">
            <div className="flex items-center justify-between mb-lg">
              <div>
                <h2>PulseBoard</h2>
                <div className="flex items-center gap-sm mt-sm">
                  <div className="avatar avatar-sm" style={{ background: '#FFD93D' }}>A</div>
                  <div className="avatar avatar-sm" style={{ background: '#C7CEEA' }}>B</div>
                  <div className="avatar avatar-sm" style={{ background: '#A8E6D7' }}>C</div>
                  <span className="text-small">Started on 08-10-2024</span>
                </div>
              </div>
            </div>

            <div className="card-divider"></div>

            <div className="mb-lg" style={{ marginTop: '1.5rem' }}>
              <h3 className="mb-md">Project Progress</h3>
              <div className="progress-blocks">
                <div className="progress-block progress-block-green" style={{ width: '80px' }}></div>
                <div className="progress-block progress-block-yellow" style={{ width: '80px' }}></div>
                <div className="progress-block progress-block-orange" style={{ width: '80px' }}></div>
                <div className="progress-block progress-block-gray" style={{ width: '80px' }}></div>
                <div className="progress-block progress-block-gray" style={{ width: '80px' }}></div>
              </div>
              <p className="text-small mt-sm">
                You're currently in <span className="font-semibold">Phase 4</span>. 
                Complete the initial <span className="font-semibold">MVP</span> to gather feedback and move forward to Phase 5.
              </p>
            </div>

            <div className="card-divider"></div>

            <div style={{ marginTop: '1.5rem' }}>
              <h3 className="mb-md">To-Do's</h3>
              <div className="flex flex-col gap-sm">
                <div className="card-compact flex items-center gap-md hover-lift">
                  <div style={{ width: '4px', height: '40px', background: 'var(--accent-red)', borderRadius: '4px' }}></div>
                  <div style={{ flex: 1 }}>Finalize MVP for Initial Feedback</div>
                  <div className="flex items-center gap-sm">
                    <div className="avatar avatar-sm" style={{ background: '#FFD93D' }}>A</div>
                    <div className="avatar avatar-sm" style={{ background: '#FFB4A8' }}>B</div>
                  </div>
                </div>

                <div className="card-compact flex items-center gap-md hover-lift">
                  <div style={{ width: '4px', height: '40px', background: 'var(--accent-yellow)', borderRadius: '4px' }}></div>
                  <div style={{ flex: 1 }}>Conduct User Testing</div>
                  <div className="flex items-center gap-sm">
                    <div className="avatar avatar-sm" style={{ background: '#C7CEEA' }}>C</div>
                    <div className="avatar avatar-sm" style={{ background: '#A8E6D7' }}>D</div>
                  </div>
                </div>

                <div className="card-compact flex items-center gap-md hover-lift">
                  <div style={{ width: '4px', height: '40px', background: 'var(--accent-green)', borderRadius: '4px' }}></div>
                  <div style={{ flex: 1 }}>Implement Phase 5 Roadmap</div>
                  <div className="flex items-center gap-sm">
                    <div className="avatar avatar-sm" style={{ background: '#FFD93D' }}>A</div>
                    <div className="avatar avatar-sm" style={{ background: '#C7CEEA' }}>C</div>
                    <div className="avatar avatar-sm" style={{ background: '#FFB4A8' }}>B</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-divider"></div>

            <div style={{ marginTop: '1.5rem' }}>
              <h3 className="mb-md">Recent Activity</h3>
              <div className="flex flex-col gap-md">
                <div className="flex gap-md">
                  <div className="status-dot status-dot-green" style={{ marginTop: '6px' }}></div>
                  <div style={{ flex: 1 }}>
                    <div className="font-semibold">New commit: <span className="text-secondary">"Refactored authentication module"</span></div>
                    <div className="text-small">Friday 09:18 PM</div>
                  </div>
                </div>

                <div className="flex gap-md">
                  <div className="status-dot status-dot-green" style={{ marginTop: '6px' }}></div>
                  <div style={{ flex: 1 }}>
                    <div className="font-semibold">Completed the task: <span className="text-secondary">"Design wireframes for Analytics Dashboard"</span></div>
                    <div className="text-small">Wednesday 12:49 PM</div>
                  </div>
                </div>

                <div className="flex gap-md">
                  <div className="status-dot status-dot-yellow" style={{ marginTop: '6px' }}></div>
                  <div style={{ flex: 1 }}>
                    <div className="font-semibold">Marked milestone <span className="text-secondary">"Phase 4 MVP Completion"</span> as In Progress</div>
                    <div className="text-small">Tuesday 03:22 PM</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons Showcase */}
        <div className="mb-xl">
          <h3 className="mb-lg">Button Variants</h3>
          <div className="card">
            <div className="flex flex-col gap-md">
              <div className="flex gap-sm items-center" style={{ flexWrap: 'wrap' }}>
                <button className="btn btn-primary">Primary</button>
                <button className="btn btn-success">Success</button>
                <button className="btn btn-warning">Warning</button>
                <button className="btn btn-secondary">Secondary</button>
                <button className="btn btn-ghost">Ghost</button>
                <button className="btn btn-outline">Outline</button>
              </div>

              <div className="flex gap-sm items-center" style={{ flexWrap: 'wrap' }}>
                <button className="btn btn-primary btn-lg">Large Button</button>
                <button className="btn btn-primary">Normal Button</button>
                <button className="btn btn-primary btn-sm">Small Button</button>
              </div>

              <div className="flex gap-sm items-center">
                <button className="btn btn-icon btn-primary"><FiSettings /></button>
                <button className="btn btn-icon btn-success"><FiCheckCircle /></button>
                <button className="btn btn-icon btn-warning"><FiAlertCircle /></button>
                <button className="btn btn-icon btn-secondary"><FiInfo /></button>
              </div>
            </div>
          </div>
        </div>

        {/* Badges Showcase */}
        <div className="mb-xl">
          <h3 className="mb-lg">Badge Variants</h3>
          <div className="card">
            <div className="flex gap-sm" style={{ flexWrap: 'wrap' }}>
              <span className="badge-success">Success</span>
              <span className="badge-warning">Warning</span>
              <span className="badge-error">Error</span>
              <span className="badge-info">Info</span>
              <span className="badge-purple">Purple</span>
              <span className="badge-orange">Orange</span>
              <span className="badge-pink">Pink</span>
              <span className="badge-neutral">Neutral</span>
            </div>

            <div className="card-divider"></div>

            <div className="flex gap-sm" style={{ flexWrap: 'wrap' }}>
              <span className="badge-success badge-dot">Active</span>
              <span className="badge-warning badge-dot">Pending</span>
              <span className="badge-error badge-dot">Offline</span>
              <span className="badge-info badge-dot">In Progress</span>
            </div>

            <div className="card-divider"></div>

            <div className="flex gap-sm items-center" style={{ flexWrap: 'wrap' }}>
              <span className="badge-success badge-sm">Small</span>
              <span className="badge-success">Normal</span>
              <span className="badge-success badge-lg">Large</span>
            </div>
          </div>
        </div>

        {/* Interactive Components */}
        <div className="mb-xl">
          <h3 className="mb-lg">Interactive Components</h3>
          <div className="grid-2">
            <div className="card">
              <h4 className="mb-md">Loading States</h4>
              <div className="flex items-center gap-lg">
                <div className="spinner spinner-sm"></div>
                <div className="spinner"></div>
                <div className="spinner spinner-lg"></div>
              </div>
            </div>

            <div className="card">
              <h4 className="mb-md">Skeleton Loaders</h4>
              <div className="flex flex-col gap-sm">
                <div className="skeleton" style={{ width: '100%', height: '20px' }}></div>
                <div className="skeleton" style={{ width: '80%', height: '20px' }}></div>
                <div className="skeleton" style={{ width: '60%', height: '20px' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Forms Showcase */}
        <div className="mb-xl">
          <h3 className="mb-lg">Form Elements</h3>
          <div className="card">
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input 
                  type="email" 
                  className="input" 
                  placeholder="Enter your email"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input 
                  type="password" 
                  className="input" 
                  placeholder="Enter password"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Message</label>
              <textarea 
                className="textarea" 
                placeholder="Your message..."
              ></textarea>
            </div>

            <div className="form-group">
              <label className="form-label">Select Option</label>
              <select className="select">
                <option>Option 1</option>
                <option>Option 2</option>
                <option>Option 3</option>
              </select>
            </div>

            <button className="btn btn-primary">Submit Form</button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center p-xl">
          <p className="text-small">
            🍎 Apple-Inspired Design System with San Francisco Font
          </p>
          <p className="text-tiny mt-sm">
            Premium quality · Glassmorphism · Dark Mode · Responsive
          </p>
        </div>
      </div>
    </div>
  );
};

export default DesignShowcase;
