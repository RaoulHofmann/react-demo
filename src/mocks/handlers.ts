import {http, HttpResponse} from 'msw'
import type { FormData } from '../types/form'
export const handlers = [
    http.get('/api/location', () => {
        return HttpResponse.json({
            locations: [
                "Perth", "Sydney",
                "Melbourne", "Brisbane",
                "Adelaide", "Darwin",
                "Hobart", "Canberra"
            ]
        })
    }),

    http.post('/api/submit-consignment', async ({ request }) => {
      const id = "CNS-" + Date.now() + "-" + Math.floor(Math.random() * 9000 + 1000)
      const formData = await request.json() as FormData

      return HttpResponse.json({
        consignmentId: id,
        source: formData?.source,
        destination: formData?.destination,
        weight: formData?.weight,
        dimensions: {"width": formData?.width, "height": formData?.height, "depth": formData?.depth },
        units: formData?.unit
      })
    })
]