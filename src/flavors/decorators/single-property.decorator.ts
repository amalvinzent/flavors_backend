import {
  registerDecorator,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator'
import { Injectable } from '@nestjs/common'
import { log } from 'console'

@ValidatorConstraint({ name: 'SingleProperty', async: true })
@Injectable()
export class SinglePropertyConstraint implements ValidatorConstraintInterface {
  validate(value: any): boolean {
    if (typeof value !== 'object') return false
    const keys = Object.keys(value)
    if (keys?.length !== 1) return false
    return true
  }
  defaultMessage() {
    return 'Sorting can only be done by one property'
  }
}

export function SingleProperty() {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      validator: SinglePropertyConstraint
    })
  }
}
