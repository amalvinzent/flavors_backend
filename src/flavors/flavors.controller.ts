import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  ValidationPipe
} from '@nestjs/common'
import { FlavorsService } from './flavors.service'
import { SuccessResponse, ErrorResponse } from 'src/utils/utils'
import { QueryParamsDto } from './dto/flavor.dto'
import { log } from 'console'

@Controller('flavors')
export class FlavorsController {
  constructor(private readonly flavorsService: FlavorsService) {}

  @Get()
  async findAll(@Query(ValidationPipe) query_params: QueryParamsDto) {
    try {
      const data = await this.flavorsService.findAll(query_params)
      return new SuccessResponse(
        data?.result,
        'Success',
        HttpStatus.OK,
        data?.pagination
      )
    } catch (error) {
      throw new ErrorResponse(
        error?.message || 'Internal server error',
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    try {
      if (!id) throw new BadRequestException('id should not be empty')
      const data = await this.flavorsService.findById(id)
      return new SuccessResponse(data, 'Success', HttpStatus.OK)
    } catch (error) {
      throw new ErrorResponse(
        error?.message || 'Internal server error',
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Post('suggestor/new')
  async suggestor(@Body() payload) {
    try {
      const data = await this.flavorsService.suggestor(payload)
      return new SuccessResponse(data, 'Success', HttpStatus.OK)
    } catch (error) {
      throw new ErrorResponse(
        error?.message || 'Internal server error',
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }
}
