import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { useContainer } from 'class-validator'
import * as compression from 'compression'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: true })
  app.use(compression())
  app.enableCors()
  useContainer(app.select(AppModule), { fallbackOnErrors: true })
  await app.listen(3000)
}
bootstrap()
