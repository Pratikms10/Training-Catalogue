import { useEffect, useState } from 'react';
import { setAnalyticsConsent } from '../data/installSeoTelemetry';
import './analytics-consent.css';

const consentKey = 'technoedge-analytics-consent';
type ConsentState = 'unknown' | 'granted' | 'denied' | null;

export function AnalyticsConsent() {
  const [consent, setConsent] = useState<ConsentState>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(consentKey);
      setConsent(stored === 'granted' || stored === 'denied' ? stored : 'unknown');
    } catch {
      setConsent('unknown');
    }
  }, []);

  const decide = (granted: boolean) => {
    setAnalyticsConsent(granted);
    setConsent(granted ? 'granted' : 'denied');
    setSettingsOpen(false);
  };

  if (consent === null) return null;
  const showPanel = consent === 'unknown' || settingsOpen;

  return (
    <aside className="analytics-consent" aria-label="Analytics privacy settings">
      {showPanel ? (
        <div className="analytics-consent__panel" role="dialog" aria-modal="false" aria-labelledby="analytics-consent-title">
          <div>
            <strong id="analytics-consent-title">Your privacy choices</strong>
            <p>We use optional analytics to understand site performance and improve enquiries. Analytics stays off unless you accept. See our <a href="/privacy">privacy policy</a>.</p>
          </div>
          <div className="analytics-consent__actions">
            <button type="button" className="analytics-consent__secondary" onClick={() => decide(false)}>Decline analytics</button>
            <button type="button" className="analytics-consent__primary" onClick={() => decide(true)}>Accept analytics</button>
          </div>
        </div>
      ) : (
        <button type="button" className="analytics-consent__manage" onClick={() => setSettingsOpen(true)}>Privacy settings</button>
      )}
    </aside>
  );
}
