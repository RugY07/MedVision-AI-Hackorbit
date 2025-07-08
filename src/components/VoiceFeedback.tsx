import { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

interface VoiceFeedbackProps {
  enabled: boolean;
}

export const VoiceFeedback = ({ enabled }: VoiceFeedbackProps) => {
  const [isSupported, setIsSupported] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    if ('speechSynthesis' in window) {
      setIsSupported(true);
      
      const loadVoices = () => {
        const availableVoices = speechSynthesis.getVoices();
        setVoices(availableVoices);
      };

      loadVoices();
      speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const speak = (text: string, priority: 'normal' | 'urgent' = 'normal') => {
    if (!enabled || !isSupported) return;

    // Cancel any ongoing speech for urgent messages
    if (priority === 'urgent') {
      speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Find a suitable voice (prefer female, medical-sounding)
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Female') || 
      voice.name.includes('Samantha') ||
      voice.name.includes('Karen')
    ) || voices[0];

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.rate = priority === 'urgent' ? 1.1 : 0.9;
    utterance.pitch = priority === 'urgent' ? 1.2 : 1.0;
    utterance.volume = priority === 'urgent' ? 1.0 : 0.8;

    speechSynthesis.speak(utterance);
  };

  // Expose speak function globally for other components
  useEffect(() => {
    (window as any).medVisionSpeak = speak;
    
    return () => {
      delete (window as any).medVisionSpeak;
    };
  }, [enabled, isSupported, voices]);

  // Example usage for critical alerts
  useEffect(() => {
    const handleCriticalAlert = (event: CustomEvent) => {
      const { message, priority } = event.detail;
      speak(message, priority);
      
      // Trigger haptic feedback for critical cases
      if (priority === 'urgent' && navigator.vibrate) {
        navigator.vibrate([200, 100, 200, 100, 200]);
      }
    };

    window.addEventListener('medvision-alert', handleCriticalAlert as EventListener);
    
    return () => {
      window.removeEventListener('medvision-alert', handleCriticalAlert as EventListener);
    };
  }, []);

  if (!isSupported) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`p-2 rounded-full transition-all ${
        enabled 
          ? 'bg-cyan-400/20 text-cyan-400 border border-cyan-400/30' 
          : 'bg-gray-400/20 text-gray-400 border border-gray-400/30'
      }`}>
        {enabled ? (
          <Volume2 className="w-4 h-4" />
        ) : (
          <VolumeX className="w-4 h-4" />
        )}
      </div>
    </div>
  );
};

// Utility function to trigger voice feedback from anywhere in the app
export const triggerVoiceFeedback = (message: string, priority: 'normal' | 'urgent' = 'normal') => {
  const event = new CustomEvent('medvision-alert', {
    detail: { message, priority }
  });
  window.dispatchEvent(event);
};