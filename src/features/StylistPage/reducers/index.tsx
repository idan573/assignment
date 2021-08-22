export interface RequestDataType {
  userName: string;
}

export interface ResponseDataType {
  stylistId: string;
  stylistTier: string;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture: string;
  city: string;
  updatedAt: string;
  score: number;
  stylistAttributes: object;
  stylistParams: object;
}

export interface GetStylistState {
  status: REQUEST_STATUSES;
  data: ResponseDataType;
  error: string;
}

export const getStylistReducerInitialState: GetStylistState = {
  status: REQUEST_STATUSES.NONE,
  data: {} as ResponseDataType,
  error: ''
};

export function getStylistReducer(
  state: GetStylistState,
  action: Partial<{
    status: REQUEST_STATUSES;
    data: ResponseDataType;
    error: string;
  }>
) {
  switch (action.status) {
    case REQUEST_STATUSES.REQUEST:
      return {
        ...state,
        status: REQUEST_STATUSES.REQUEST
      };
    case REQUEST_STATUSES.GOT: {
      return {
        ...state,
        status: REQUEST_STATUSES.GOT,
        data: action.data
      };
    }
    case REQUEST_STATUSES.ERROR:
      return {
        ...state,
        status: REQUEST_STATUSES.ERROR,
        error: action.error
      };
    case REQUEST_STATUSES.NONE:
      return getStylistReducerInitialState;
    default:
      return state;
  }
}
