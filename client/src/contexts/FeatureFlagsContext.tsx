import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type FeatureFlagKey =
  | 'onboarding_v2'
  | 'contextual_tour_v1'
  | 'nav_action_model'
  | 'sidebar_context_v1'
  | 'help_tooltips_v1'
  | 'help_hub'
  | 'global_search_v1';

export type FeatureFlags = Record<FeatureFlagKey, boolean>;

const DEFAULT_FLAGS: FeatureFlags = {
  onboarding_v2: true,
  contextual_tour_v1: false,
  nav_action_model: true,
  sidebar_context_v1: false,
  help_tooltips_v1: true,
  help_hub: true,
  global_search_v1: true,
};

type FeatureFlagsContextValue = {
  flags: FeatureFlags;
  isEnabled: (key: FeatureFlagKey) => boolean;
  setFlag: (key: FeatureFlagKey, enabled: boolean) => void;
  setFlags: (next: Partial<FeatureFlags>) => void;
};

const FeatureFlagsContext = createContext<FeatureFlagsContextValue | null>(null);

function readBootstrapFlags(): Partial<FeatureFlags> {
  if (typeof window !== 'undefined' && (window as any).__FLAGS__) {
    return (window as any).__FLAGS__ as Partial<FeatureFlags>;
  }
  return {};
}

function readStoredFlags(): Partial<FeatureFlags> {
  try {
    const raw = localStorage.getItem('feature_flags');
    return raw ? (JSON.parse(raw) as Partial<FeatureFlags>) : {};
  } catch {
    return {};
  }
}

function persistFlags(flags: FeatureFlags) {
  try {
    localStorage.setItem('feature_flags', JSON.stringify(flags));
  } catch {
    // ignore
  }
}

export const FeatureFlagsProvider: React.FC<{ children: React.ReactNode; initialFlags?: Partial<FeatureFlags> }> = ({
  children,
  initialFlags,
}) => {
  const [flags, setFlagsState] = useState<FeatureFlags>(() => ({
    ...DEFAULT_FLAGS,
    ...readBootstrapFlags(),
    ...readStoredFlags(),
    ...initialFlags,
  }));

  useEffect(() => {
    persistFlags(flags);
  }, [flags]);

  const isEnabled = useCallback((key: FeatureFlagKey) => !!flags[key], [flags]);

  const setFlag = useCallback((key: FeatureFlagKey, enabled: boolean) => {
    setFlagsState(prev => ({ ...prev, [key]: enabled }));
  }, []);

  const setFlags = useCallback((next: Partial<FeatureFlags>) => {
    setFlagsState(prev => ({ ...prev, ...next }));
  }, []);

  const value = useMemo<FeatureFlagsContextValue>(
    () => ({ flags, isEnabled, setFlag, setFlags }),
    [flags, isEnabled, setFlag, setFlags]
  );

  return <FeatureFlagsContext.Provider value={value}>{children}</FeatureFlagsContext.Provider>;
};

export function useFeatureFlags(): FeatureFlagsContextValue {
  const ctx = useContext(FeatureFlagsContext);
  if (!ctx) {
    throw new Error('useFeatureFlags must be used within FeatureFlagsProvider');
  }
  return ctx;
}

export function useFeature(key: FeatureFlagKey): boolean {
  return useFeatureFlags().isEnabled(key);
}

export const FeatureGate: React.FC<{ flag: FeatureFlagKey; children: React.ReactNode; fallback?: React.ReactNode }> = ({
  flag,
  children,
  fallback = null,
}) => {
  const enabled = useFeature(flag);
  return <>{enabled ? children : fallback}</>;
};
