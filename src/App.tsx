import React, { useEffect } from 'react';
import { TaxProvider, useTax } from './context/TaxContext';
import { Layout } from './components/Layout';
import { LandingPage } from './components/LandingPage';
import { SignUp } from './components/SignUp';
import { UnlockPage } from './components/UnlockPage';

const AppContent: React.FC = () => {
  const { currentStep, setCurrentStep, user, isPaid } = useTax();

  // Wizard Lock Guard
  useEffect(() => {
    if (currentStep > 0 && (!user || !isPaid)) {
      setCurrentStep(0); // Force redirect to landing page
    }
  }, [currentStep, user, isPaid, setCurrentStep]);

  return (
    <Layout>
      {currentStep === -2 ? (
        <UnlockPage />
      ) : currentStep === -1 ? (
        <SignUp />
      ) : currentStep === 0 ? (
        <LandingPage />
      ) : (
        <div className="flex-grow flex items-center justify-center py-20 px-4">
          <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-8 shadow-premium text-center space-y-6">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto border border-blue-100">
              <span className="font-bold text-2xl font-outfit">?</span>
            </div>
            <h2 className="text-2xl font-outfit font-bold text-slate-800">
              Wizard Step {currentStep} Placeholder
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              You've started the tax check! In Phase 3, this area will display the interactive 8-step wizard questions.
            </p>
            <button
              onClick={() => setCurrentStep(0)}
              className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-all-custom font-outfit"
            >
              ← Back to Landing Page
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default function App() {
  return (
    <TaxProvider>
      <AppContent />
    </TaxProvider>
  );
}
