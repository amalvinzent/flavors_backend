import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { FlavorsModule } from './flavors/flavors.module'
import { SinglePropertyConstraint } from './flavors/decorators/single-property.decorator'

@Module({
  imports: [FlavorsModule],
  controllers: [AppController],
  providers: [AppService, SinglePropertyConstraint]
})
export class AppModule {}
