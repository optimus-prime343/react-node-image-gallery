export interface ApiResponseSuccess<TSuccessData = unknown> {
  status: 'success'
  message: string
  data: TSuccessData
}

export interface ApiResponseFailure<TFailureData = Record<string, unknown>> {
  status: 'failure'
  data: TFailureData
}
