import { Module } from '@nestjs/common'
import { FlavorsService } from './flavors.service'
import { FlavorsController } from './flavors.controller'

@Module({
  controllers: [FlavorsController],
  providers: [FlavorsService]
})
export class FlavorsModule {}
