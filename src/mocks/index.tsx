import { worker } from './browers'

export async function enableMocking() {
  if (import.meta.env.DEV) {
    return worker.start({
      onUnhandledRequest: 'bypass',
    })
  }
}