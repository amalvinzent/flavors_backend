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

export async function readFile(file_path: string): Promise<Records> {
  return new Promise((resolve, reject) => {
    const stream = fs.createReadStream(file_path, {
      encoding: 'utf8'
    })
    let raw = ''
    stream.on('data', (chunk) => {
      raw += chunk
    })
    stream.on('end', () => {
      try {
        const json = JSON.parse(raw)
        resolve(json)
      } catch (error) {
        reject(
          new HttpException(
            `An error occurred while parsing the data: ${error?.message}`,
            HttpStatus.BAD_REQUEST
          )
        )
      }
    })
    stream.on('error', (error) => {
      reject(
        new HttpException(
          `An error occurred while reading the file: ${error?.message}`,
          HttpStatus.BAD_REQUEST
        )
      )
    })
  })
}
