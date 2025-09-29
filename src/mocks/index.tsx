import { worker } from './browers'

const isGitHubPages = process.env.GH_PAGES === 'true'

export async function enableMocking() {
  if (import.meta.env.DEV || isGitHubPages) {
    return worker.start({
      serviceWorker: {
        url: import.meta.env.DEV ? '/mockServiceWorker.js' : '/react-demo/mockServiceWorker.js'
      },
      onUnhandledRequest: 'bypass'
    })
  }
}