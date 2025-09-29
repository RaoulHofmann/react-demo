import { worker } from './browers'

export async function enableMocking() {
  if (import.meta.env.DEV || import.meta.env.GH_PAGES === 'true') {
    return worker.start({
      serviceWorker: {
        url: import.meta.env.DEV ? '/mockServiceWorker.js' : '/react-demo/mockServiceWorker.js'
      },
      onUnhandledRequest: 'bypass'
    })
  }
}