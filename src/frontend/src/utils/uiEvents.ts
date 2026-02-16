// Simple event emitter for UI-only events (no backend dependency)
type UIEventType = 'open-cart' | 'open-profile' | 'open-auth';

type UIEventListener = () => void;

class UIEventBus {
  private listeners: Map<UIEventType, Set<UIEventListener>> = new Map();

  on(event: UIEventType, listener: UIEventListener) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(listener);
  }

  off(event: UIEventType, listener: UIEventListener) {
    this.listeners.get(event)?.delete(listener);
  }

  emit(event: UIEventType) {
    this.listeners.get(event)?.forEach((listener) => listener());
  }
}

export const uiEvents = new UIEventBus();
