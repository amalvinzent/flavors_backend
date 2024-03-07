import { HttpException, HttpStatus } from '@nestjs/common'
import { Records } from 'src/flavors/flavors.service'
import * as fs from 'fs'

export class SuccessResponse {
  constructor(
    public data: string | any[] | Record<string, any>,
    public message: string,
    public statusCode: number,
    public pagination?: Record<string, string | number>
  ) {}
}

export class ErrorResponse {
  constructor(
    public message: string,
    public statusCode: number
  ) {}
}
