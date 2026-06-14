import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import {
  type AgeCategory,
  type TaxResult,
  type TaxDeductionsInput,
  calculateNewRegimeTax,
  calculateOldRegimeTax
} from '../utils/taxEngine';

export interface User {
  name: string;
  email: string;
  isPaid?: boolean;
  paymentReference?: string;
}

export interface TaxState {
  ageCategory: AgeCategory;
  monthlyTakeHome: number;
  otherIncome: number;
  savingsInterest: number;
  fdInterest: number;
  basicSalary: number;
  hraReceived: number;
  pfDeduction: number;
  paysRent: boolean;
  monthlyRent: number;
  city: string;
  isMetro: boolean;
  has80C: boolean;
  total80C: number;
  hasHealthInsurance: boolean;
  healthSelf: number;
  healthParents: number;
  parentsSenior: boolean;
  hasHomeLoan: boolean;
  homeLoanInterest: number;
  hasNPS: boolean;
  npsAmount: number;
  hasEducationLoan: boolean;
  educationLoanInterest: number;
  hasProfessionalTax: boolean;
  professionalTaxAmount: number;
  charitableDonations: number;
}

export interface TaxContextType {
  state: TaxState;
  currentStep: number; // -2: UnlockPage, -1: SignUp, 0: Landing, 1-8: Wizard, 9: Result
  updateState: (updates: Partial<TaxState>) => void;
  setCurrentStep: (step: number) => void;
  resetState: () => void;
  // Derived state
  newRegimeTax: TaxResult;
  oldRegimeTax: TaxResult;
  savings: number;
  recommendedRegime: 'old' | 'new';
  // User Authentication & Payment
  user: User | null;
  isPaid: boolean;
  registerUser: (name: string, email: string, password: string) => { success: boolean; error?: string };
  loginUser: (email: string, password: string) => { success: boolean; error?: string };
  logoutUser: () => void;
  unlockUser: (reference: string) => { success: boolean; error?: string };
}

const initialTaxState: TaxState = {
  ageCategory: 'below60',
  monthlyTakeHome: 0,
  otherIncome: 0,
  savingsInterest: 0,
  fdInterest: 0,
  basicSalary: 0,
  hraReceived: 0,
  pfDeduction: 0,
  paysRent: false,
  monthlyRent: 0,
  city: '',
  isMetro: false,
  has80C: false,
  total80C: 0,
  hasHealthInsurance: false,
  healthSelf: 0,
  healthParents: 0,
  parentsSenior: false,
  hasHomeLoan: false,
  homeLoanInterest: 0,
  hasNPS: false,
  npsAmount: 0,
  hasEducationLoan: false,
  educationLoanInterest: 0,
  hasProfessionalTax: false,
  professionalTaxAmount: 0,
  charitableDonations: 0,
};

const TaxContext = createContext<TaxContextType | undefined>(undefined);

export const TaxProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<TaxState>(initialTaxState);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [user, setUser] = useState<User | null>(null);

  // Initialize session on load
  useEffect(() => {
    const session = localStorage.getItem('taxcalc_user_session');
    if (session) {
      try {
        setUser(JSON.parse(session));
      } catch (e) {
        localStorage.removeItem('taxcalc_user_session');
      }
    }
  }, []);

  const updateState = (updates: Partial<TaxState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const resetState = () => {
    setState(initialTaxState);
    setCurrentStep(0);
  };

  // Auth Operations
  const registerUser = (name: string, email: string, password: string) => {
    const rawUsers = localStorage.getItem('taxcalc_users');
    let usersMap: Record<string, any> = {};
    if (rawUsers) {
      try {
        usersMap = JSON.parse(rawUsers);
      } catch (e) {
        usersMap = {};
      }
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (usersMap[normalizedEmail]) {
      return { success: false, error: 'Email already registered.' };
    }

    // Register user with isPaid: false by default
    usersMap[normalizedEmail] = { name: name.trim(), password, isPaid: false };
    localStorage.setItem('taxcalc_users', JSON.stringify(usersMap));

    // Log user in
    const sessionUser: User = { name: name.trim(), email: normalizedEmail, isPaid: false };
    localStorage.setItem('taxcalc_user_session', JSON.stringify(sessionUser));
    setUser(sessionUser);

    return { success: true };
  };

  const loginUser = (email: string, password: string) => {
    const rawUsers = localStorage.getItem('taxcalc_users');
    let usersMap: Record<string, any> = {};
    if (rawUsers) {
      try {
        usersMap = JSON.parse(rawUsers);
      } catch (e) {
        usersMap = {};
      }
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = usersMap[normalizedEmail];

    if (!existingUser || existingUser.password !== password) {
      return { success: false, error: 'Invalid email or password.' };
    }

    const sessionUser: User = {
      name: existingUser.name,
      email: normalizedEmail,
      isPaid: existingUser.isPaid || false,
      paymentReference: existingUser.paymentReference
    };
    localStorage.setItem('taxcalc_user_session', JSON.stringify(sessionUser));
    setUser(sessionUser);

    return { success: true };
  };

  const logoutUser = () => {
    localStorage.removeItem('taxcalc_user_session');
    setUser(null);
    setCurrentStep(0);
  };

  const unlockUser = (reference: string) => {
    if (!user) {
      return { success: false, error: 'User is not logged in.' };
    }

    const cleanedRef = reference.trim();
    if (!/^\d{10}$/.test(cleanedRef)) {
      return { success: false, error: 'Reference must be exactly 10 digits.' };
    }

    const rawUsers = localStorage.getItem('taxcalc_users');
    let usersMap: Record<string, any> = {};
    if (rawUsers) {
      try {
        usersMap = JSON.parse(rawUsers);
      } catch (e) {
        usersMap = {};
      }
    }

    const emailKey = user.email.toLowerCase();
    if (usersMap[emailKey]) {
      usersMap[emailKey].isPaid = true;
      usersMap[emailKey].paymentReference = cleanedRef;
      localStorage.setItem('taxcalc_users', JSON.stringify(usersMap));
    }

    const updatedUser: User = {
      ...user,
      isPaid: true,
      paymentReference: cleanedRef
    };
    localStorage.setItem('taxcalc_user_session', JSON.stringify(updatedUser));
    setUser(updatedUser);

    return { success: true };
  };

  // Derived state
  const isPaid = user?.isPaid || false;
  const annualGross = (state.monthlyTakeHome * 12) + state.otherIncome;
  
  const deductionsInput: TaxDeductionsInput = {
    basicSalary: state.basicSalary,
    hraReceived: state.hraReceived,
    pfDeduction: state.pfDeduction,
    paysRent: state.paysRent,
    monthlyRent: state.monthlyRent,
    city: state.city,
    isMetro: state.isMetro,
    total80C: state.total80C,
    healthSelf: state.healthSelf,
    healthParents: state.healthParents,
    parentsSenior: state.parentsSenior,
    homeLoanInterest: state.homeLoanInterest,
    npsAmount: state.npsAmount,
    educationLoanInterest: state.educationLoanInterest,
    professionalTaxAmount: state.professionalTaxAmount,
    savingsInterest: state.savingsInterest,
    fdInterest: state.fdInterest,
    charitableDonations: state.charitableDonations,
  };

  const newRegimeTax = calculateNewRegimeTax(annualGross, state.ageCategory);
  const oldRegimeTax = calculateOldRegimeTax(annualGross, deductionsInput, state.ageCategory);

  const savings = Math.abs(newRegimeTax.totalTax - oldRegimeTax.totalTax);
  const recommendedRegime = newRegimeTax.totalTax <= oldRegimeTax.totalTax ? 'new' : 'old';

  return (
    <TaxContext.Provider
      value={{
        state,
        currentStep,
        updateState,
        setCurrentStep,
        resetState,
        newRegimeTax,
        oldRegimeTax,
        savings,
        recommendedRegime,
        user,
        isPaid,
        registerUser,
        loginUser,
        logoutUser,
        unlockUser,
      }}
    >
      {children}
    </TaxContext.Provider>
  );
};

export const useTax = () => {
  const context = useContext(TaxContext);
  if (!context) {
    throw new Error('useTax must be used within a TaxProvider');
  }
  return context;
};
export type { AgeCategory, TaxResult };
export { initialTaxState };
