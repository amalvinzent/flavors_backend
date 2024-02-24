import { Injectable } from '@nestjs/common'
import { log } from 'console'
import { readFile } from 'src/utils/utils'
import { QueryParamsDto, SortOrder } from './dto/flavor.dto'

export type Records = Array<{
  key: string
  name: string
  ingredients: string
  diet: string
  prep_time: number
  cook_time: number
  flavor_profile: string
  course: string
  state: string
  region: string
}>

@Injectable()
export class FlavorsService {
  async findAll(query_params: QueryParamsDto) {
    let result: Records = await readFile('./src/flavors/data/flavors.json')

    result = result?.filter((ob) => {
      if (Object.values(ob).some((value) => Math.sign(Number(value)) === -1))
        return false
      return Object.keys(query_params?.filter || {}).every((key) => {
        return ob.hasOwnProperty(key) && ob[key] === query_params?.filter[key]
      })
    })

    result = result?.filter((item) => {
      return ['name', 'state', 'region'].some((key) => {
        return String(item[key])
          ?.toLowerCase()
          ?.includes(query_params?.search?.toLowerCase())
      })
    })

    const sort_key = Object.keys(query_params?.sort)[0]
    const sort_order = Object.values(query_params?.sort)[0]
    result = result?.sort((a, b) => {
      const asc_desc = sort_order === SortOrder.ASC ? 1 : -1
      if (typeof a[sort_key] === 'number' && typeof b[sort_key] === 'number') {
        return (a[sort_key] - b[sort_key]) * asc_desc
      } else {
        return String(a[sort_key]).localeCompare(String(b[sort_key])) * asc_desc
      }
    })

    const total = result?.length
    result = result?.slice(
      (Number(query_params?.page_number) - 1) * Number(query_params?.page_size),
      Number(query_params?.page_number) * Number(query_params?.page_size)
    )

    return {
      result: result || [],
      pagination: {
        total: total || 0,
        count: result?.length || 0,
        limit: Number(query_params?.page_size),
        offset: Number(query_params?.page_number)
      }
    }
  }

  async findById(id: string) {
    const result: Records = await readFile('./src/flavors/data/flavors.json')
    return result?.filter((v) => v?.key == id)[0] || {}
  }

  async suggestor(data) {
    if (!data?.ingredients?.length) return []
    const result: Records = await readFile('./src/flavors/data/flavors.json')
    const flavors = result?.filter((flavor) => {
      const split = flavor?.ingredients
        ?.split(', ')
        ?.map((item) => item?.trim())
      return (
        data?.ingredients?.length == split?.length &&
        data?.ingredients?.every((ingredient) => split?.includes(ingredient))
      )
    })
    return flavors
  }
}
