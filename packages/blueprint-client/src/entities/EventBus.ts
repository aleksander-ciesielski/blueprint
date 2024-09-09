export class EventBus<TPayload> {
  private readonly subscribers = new Set<(payload: TPayload) => void>();

  public emit(payload: TPayload): void {
    this.subscribers.forEach((subscriber) => subscriber(payload));
  }

  public subscribe(listener: (payload: TPayload) => void): void {
    this.subscribers.add(listener);
  }

  public unsubscribe(listener: (payload: TPayload) => void): void {
    this.subscribers.delete(listener);
  }
}
