import { Type } from 'class-transformer'
import {
  IsString,
  IsNotEmpty,
  ValidateNested,
  IsEnum,
  IsOptional,
  IsArray,
  ArrayNotEmpty,
  isString
} from 'class-validator'
import { SingleProperty } from '../decorators/single-property.decorator'

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc'
}

class SortDto {
  @IsString()
  @IsOptional()
  @IsEnum(['asc', 'desc'], {
    message: 'name must be either asc or desc'
  })
  readonly name: string

  @IsString()
  @IsOptional()
  @IsEnum(['asc', 'desc'], {
    message: 'prep_time must be either asc or desc'
  })
  readonly prep_time: string

  @IsString()
  @IsOptional()
  @IsEnum(['asc', 'desc'], {
    message: 'cooking_time must be either asc or desc'
  })
  readonly cooking_time: string
}

class FilterDto {
  @IsOptional()
  readonly diet: string

  @IsOptional()
  readonly flavor_profile: string

  @IsOptional()
  readonly state: string
}

export class QueryParamsDto {
  @IsString()
  @IsNotEmpty()
  readonly page_number: string

  @IsString()
  @IsNotEmpty()
  readonly page_size: string

  @SingleProperty()
  @ValidateNested()
  @Type(() => SortDto)
  readonly sort: SortDto

  @ValidateNested()
  @Type(() => FilterDto)
  readonly filter: FilterDto

  @IsOptional()
  readonly search: string
}

export class SuggestorDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @Type(() => String)
  readonly ingredients: string[]
}
