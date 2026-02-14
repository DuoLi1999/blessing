import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getAvailableModels } from '../lib/providers'

export default function handler(_req: VercelRequest, res: VercelResponse) {
  const models = getAvailableModels()
  res.json({ models })
}
