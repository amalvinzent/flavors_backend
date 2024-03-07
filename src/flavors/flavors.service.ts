import { Injectable } from '@nestjs/common'
import { QueryParamsDto, SortOrder, SuggestorDto } from './dto/flavor.dto'
import { flavors_data } from 'flavors'

export type Records = Array<{
  key: number
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
    const result: Records = flavors_data()
    const filtered_results = result?.filter((ob) => {
      if (Object.values(ob || {}).some((value) => Number(value) < 0)) {
        return false
      }
      if (Object.keys(query_params?.filter || {})?.length) {
        const filter_match = Object.keys(query_params?.filter || {})?.every(
          (key) =>
            ob?.hasOwnProperty(key) && ob[key] === query_params?.filter[key]
        )
        if (!filter_match) {
          return false
        }
      }
      if (query_params?.search) {
        const search_query = query_params?.search
          ?.toLowerCase()
          ?.replace(/\s+/g, '')
        return ['name', 'state', 'region'].some((key) => {
          const field_value = ob[key]?.toLowerCase()?.replace(/\s+/g, '')
          return field_value?.includes(search_query)
        })
      }
      return true
    })

    const sort_key = Object.keys(query_params?.sort || {})[0]
    const sort_order = Object.values(query_params?.sort || {})[0]
    const sorted_results = filtered_results?.sort((a, b) => {
      const asc_desc = sort_order === SortOrder.ASC ? 1 : -1
      if (typeof a[sort_key] === 'number' && typeof b[sort_key] === 'number') {
        return (a[sort_key] - b[sort_key]) * asc_desc
      } else {
        return (
          String(a[sort_key])?.localeCompare(String(b[sort_key])) * asc_desc
        )
      }
    })

    const total = sorted_results?.length
    const paginated_results = sorted_results?.slice(
      (Number(query_params?.page_number) - 1) * Number(query_params?.page_size),
      Number(query_params?.page_number) * Number(query_params?.page_size)
    )

    return {
      result: paginated_results || [],
      pagination: {
        total: total || 0,
        count: paginated_results?.length || 0,
        limit: Number(query_params?.page_size),
        offset: Number(query_params?.page_number)
      }
    }
  }

  async findById(id: string) {
    const result: Records = flavors_data()
    return result?.filter((v) => v?.key == Number(id))[0] || {}
  }

  async suggestor(data: SuggestorDto) {
    const result: Records = flavors_data()
    const flavors = result?.filter((flavor) => {
      const split = flavor?.ingredients
        ?.split(', ')
        ?.map((v) => v?.split(' ')?.join('')?.toLowerCase())
      return (
        data?.ingredients?.length == split?.length &&
        data?.ingredients?.every((ingredient) =>
          split?.includes(ingredient?.split(' ')?.join('')?.toLowerCase())
        )
      )
    })
    return flavors
  }
}
