import React, { useState } from 'react';
import { useTax } from '../context/TaxContext';
import { Lock, HelpCircle, ArrowRight, ShieldAlert, CreditCard } from 'lucide-react';

export const UnlockPage: React.FC = () => {
  const { unlockUser, setCurrentStep } = useTax();
  const [reference, setReference] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Allow only numeric digits
    if (/^\d*$/.test(val)) {
      setReference(val);
      setError('');
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (reference.length !== 10) {
      setError('Transaction reference must be exactly 10 digits.');
      return;
    }

    const res = unlockUser(reference);
    if (!res.success) {
      setError(res.error || 'Verification failed.');
      return;
    }

    setSuccess('Payment verified! Redirecting to tax calculator...');
    setTimeout(() => {
      setCurrentStep(1); // Go to step 1 of the wizard
    }, 1200);
  };

  return (
    <div className="flex-grow flex items-center justify-center py-16 px-4 bg-gradient-to-b from-blue-50/20 via-transparent to-transparent">
      <div className="max-w-md w-full bg-white border border-slate-200/80 rounded-2xl p-8 shadow-premium space-y-6 relative overflow-hidden text-center">
        
        {/* top accent bar */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-blue-600 to-indigo-600"></div>

        {/* Lock Icon header */}
        <div className="w-14 h-14 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center mx-auto text-blue-600">
          <Lock className="w-6 h-6" />
        </div>

        <div>
          <h2 className="text-2xl font-outfit font-extrabold text-slate-800">Unlock Tax Calculator</h2>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            Access to the calculator is locked. If you've paid on Superprofile, enter your 10-digit transaction ID below.
          </p>
        </div>

        {/* Payment Link Card */}
        <div className="bg-slate-50/80 border border-slate-200/50 rounded-xl p-4 text-left flex items-start gap-3">
          <CreditCard className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-800">Haven't paid yet?</p>
            <p className="text-[11px] text-slate-500 leading-normal">
              You can purchase access on our payment portal for instant activation.
            </p>
            <a
              href="https://superprofile.bio/vp/tax-calculator-app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline pt-1"
            >
              <span>Get Access on Superprofile</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </a>
          </div>
        </div>

        {/* Feedback alerts */}
        {error && (
          <div className="p-3.5 bg-red-50 border border-red-200 text-xs font-semibold text-red-600 rounded-xl text-left">
            ⚠️ {error}
          </div>
        )}
        {success && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-600 rounded-xl text-left">
            ✓ {success}
          </div>
        )}

        {/* Verification Form */}
        <form onSubmit={handleVerify} className="space-y-4 text-left">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-slate-400" />
              <span>10-Digit Transaction ID</span>
            </label>
            <input
              type="text"
              maxLength={10}
              value={reference}
              onChange={handleInputChange}
              placeholder="e.g. 1234567890 (Numeric Only)"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-sm font-semibold tracking-wider text-center font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={reference.length !== 10}
            className={`w-full py-3.5 text-white font-semibold rounded-xl transition-all duration-200 text-center font-outfit flex items-center justify-center gap-2 mt-4 cursor-pointer shadow-md ${
              reference.length === 10
                ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/10'
                : 'bg-slate-300 shadow-none cursor-not-allowed'
            }`}
          >
            <span>Verify & Unlock</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="border-t border-slate-100 pt-4 flex flex-col space-y-3">
          <button
            onClick={() => setCurrentStep(0)}
            className="text-xs text-slate-500 hover:text-slate-800 font-semibold"
          >
            ← Cancel and Go Back
          </button>

          <div className="flex items-start justify-center gap-1.5 bg-slate-50/50 p-2.5 rounded-lg border border-slate-200/40">
            <ShieldAlert className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
            <span className="text-[9px] text-left text-slate-400 font-medium">
              Testing Mode: Any mock 10-digit number will bypass verification.
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
