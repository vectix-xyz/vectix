import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'node:async_hooks';

interface StoreContext {
  correlationId: string;
}

@Injectable()
export class ContextService {
  private readonly als = new AsyncLocalStorage<StoreContext>();

  public run(context: StoreContext, callback: () => void): void {
    this.als.run(context, callback);
  }

  public getCorrelationId(): string | undefined {
    const store = this.als.getStore();
    return store?.correlationId;
  }
}
