import { createApp } from './app'
import { config } from './config'
import { initDb } from './db'

const db = initDb(config.dbPath)
const app = createApp(db)

app.listen(config.port, () => {
  // eslint-disable-next-line no-console
  console.log(`[halt-catch] API escuchando en http://localhost:${config.port}`)
  // eslint-disable-next-line no-console
  console.log(`[halt-catch] DB: ${config.dbPath}`)
})
