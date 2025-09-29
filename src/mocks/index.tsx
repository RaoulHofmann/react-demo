import { worker } from './browers'

export async function enableMocking() {
  const basePath = import.meta.env.PROD ? '/react-demo' : ''
  return worker.start({
    serviceWorker: {
      url: `${basePath}/mockServiceWorker.js`
    },
    onUnhandledRequest: 'bypass'
  })
}
