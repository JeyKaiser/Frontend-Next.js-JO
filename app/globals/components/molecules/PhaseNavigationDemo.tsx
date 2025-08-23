// components/molecules/PhaseNavigationDemo.tsx
'use client';

import { useState } from 'react';
import { FaseDisponible } from '@/app/modules/types';
import TabList from './TabList';
import TabListImproved from './TabListImproved';
import PhaseProgress from './PhaseProgress';
import PhaseDropdown from './PhaseDropdown';
import PhaseSidebar from './PhaseSidebar';

interface PhaseNavigationDemoProps {
  referenciaId: string;
  fases: FaseDisponible[];
  currentCollectionId?: string;
  collectionName?: string;
}

type NavigationStyle = 'original' | 'improved' | 'progress' | 'dropdown' | 'sidebar';

const PhaseNavigationDemo: React.FC<PhaseNavigationDemoProps> = (props) => {
  const [currentStyle, setCurrentStyle] = useState<NavigationStyle>('improved');
  const [showSidebar, setShowSidebar] = useState(false);

  const navigationOptions = [
    { value: 'original', label: 'Original Horizontal', description: 'Current implementation' },
    { value: 'improved', label: 'Enhanced Horizontal', description: 'Improved with progress & controls' },
    { value: 'progress', label: 'Grouped Cards', description: 'Recommended approach' },
    { value: 'dropdown', label: 'Compact Dropdown', description: 'Space-efficient design' },
    { value: 'sidebar', label: 'Sidebar Navigation', description: 'Alternative layout' }
  ];

  const renderNavigation = () => {
    if (currentStyle === 'sidebar') {
      return (
        <div className="flex h-screen bg-secondary-50">
          <PhaseSidebar {...props} />
          <div className="flex-1 p-6">
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Sidebar Navigation Demo</h3>
              <p className="text-secondary-600">This layout provides persistent phase navigation in a collapsible sidebar.</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {currentStyle === 'original' && <TabList {...props} />}
        {currentStyle === 'improved' && <TabListImproved {...props} />}
        {currentStyle === 'progress' && <PhaseProgress {...props} />}
        {currentStyle === 'dropdown' && <PhaseDropdown {...props} />}
        
        {currentStyle !== 'sidebar' && (
          <div className="bg-white rounded-lg p-6 border border-secondary-200">
            <h3 className="text-xl font-semibold mb-4">Phase Content Area</h3>
            <p className="text-secondary-600 mb-4">
              This area would contain the actual phase content. The navigation above adapts to different screen sizes and usage patterns.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-secondary-50 rounded-lg">
                <h4 className="font-medium mb-2">Current Phase</h4>
                <p className="text-sm text-secondary-600">Content for the selected phase would be displayed here.</p>
              </div>
              <div className="p-4 bg-primary-50 rounded-lg">
                <h4 className="font-medium mb-2">Progress Information</h4>
                <p className="text-sm text-secondary-600">Phase-specific progress and status indicators.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (currentStyle === 'sidebar') {
    return renderNavigation();
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Navigation Style Selector */}
      <div className="bg-white rounded-lg p-6 border border-secondary-200 mb-6">
        <h2 className="text-2xl font-bold mb-4">Phase Navigation UX Demo</h2>
        <p className="text-secondary-600 mb-6">
          Compare different navigation approaches for the phases system. Each option addresses specific UX challenges.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {navigationOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setCurrentStyle(option.value as NavigationStyle)}
              className={`
                p-4 text-left rounded-lg border transition-all duration-200
                ${
                  currentStyle === option.value
                    ? 'bg-primary-50 border-primary-200 text-primary-900'
                    : 'bg-white border-secondary-200 hover:bg-secondary-50 text-secondary-700'
                }
              `}
            >
              <h3 className="font-medium mb-2">{option.label}</h3>
              <p className="text-sm opacity-75">{option.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Current Navigation Implementation */}
      <div className="bg-secondary-50 rounded-lg p-1">
        <div className="bg-white rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              Current Style: {navigationOptions.find(opt => opt.value === currentStyle)?.label}
            </h3>
            <div className="text-sm text-secondary-600">
              {navigationOptions.find(opt => opt.value === currentStyle)?.description}
            </div>
          </div>
          
          {renderNavigation()}
        </div>
      </div>

      {/* UX Analysis */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 border border-secondary-200">
          <h3 className="text-lg font-semibold mb-4">UX Benefits</h3>
          <ul className="space-y-2 text-sm">
            {currentStyle === 'original' && (
              <>
                <li className="text-amber-600">• Familiar horizontal tab pattern</li>
                <li className="text-red-600">• Hidden scrollbar reduces discoverability</li>
                <li className="text-red-600">• No progress indication</li>
                <li className="text-red-600">• Poor mobile experience</li>
              </>
            )}
            {currentStyle === 'improved' && (
              <>
                <li className="text-green-600">• Visible scroll controls improve accessibility</li>
                <li className="text-green-600">• Progress indicator shows completion status</li>
                <li className="text-green-600">• Better mobile touch targets</li>
                <li className="text-green-600">• Auto-scroll to active phase</li>
              </>
            )}
            {currentStyle === 'progress' && (
              <>
                <li className="text-green-600">• Reduces cognitive load through grouping</li>
                <li className="text-green-600">• Shows complete workflow context</li>
                <li className="text-green-600">• Excellent mobile responsiveness</li>
                <li className="text-green-600">• Scalable to more phases</li>
              </>
            )}
            {currentStyle === 'dropdown' && (
              <>
                <li className="text-green-600">• Minimal screen real estate usage</li>
                <li className="text-green-600">• Clear current phase display</li>
                <li className="text-green-600">• Complete overview when needed</li>
                <li className="text-green-600">• Keyboard accessible</li>
              </>
            )}
            {currentStyle === 'sidebar' && (
              <>
                <li className="text-green-600">• Persistent navigation context</li>
                <li className="text-green-600">• Collapsible to save space</li>
                <li className="text-green-600">• Clear workflow structure</li>
                <li className="text-green-600">• Quick previous/next actions</li>
              </>
            )}
          </ul>
        </div>
        
        <div className="bg-white rounded-lg p-6 border border-secondary-200">
          <h3 className="text-lg font-semibold mb-4">Implementation Notes</h3>
          <div className="space-y-3 text-sm">
            {currentStyle === 'improved' && (
              <div>
                <p className="font-medium text-primary-600">Drop-in Replacement:</p>
                <p>Replace TabList with TabListImproved in layout.tsx</p>
              </div>
            )}
            {currentStyle === 'progress' && (
              <div>
                <p className="font-medium text-primary-600">Recommended Approach:</p>
                <p>Best overall UX, groups phases logically, responsive design</p>
              </div>
            )}
            {currentStyle === 'dropdown' && (
              <div>
                <p className="font-medium text-primary-600">Space Efficient:</p>
                <p>Ideal for dense interfaces or mobile-first designs</p>
              </div>
            )}
            {currentStyle === 'sidebar' && (
              <div>
                <p className="font-medium text-primary-600">Layout Change:</p>
                <p>Requires layout modification for sidebar integration</p>
              </div>
            )}
            
            <div className="pt-3 border-t border-secondary-200">
              <p className="font-medium mb-2">Technical Requirements:</p>
              <ul className="text-xs space-y-1 text-secondary-600">
                <li>• @heroicons/react for icons</li>
                <li>• scrollbar-hide utility in globals.css</li>
                <li>• Existing FaseDisponible interface</li>
                <li>• Current URL structure compatibility</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhaseNavigationDemo;