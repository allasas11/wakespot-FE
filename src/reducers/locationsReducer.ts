import type { Location } from '../types/types';

export interface LocationState {
  locations: Location[];
  loading: boolean;
  error: string | null;
}

export enum LocationActionTypes {
  SET_LOCATIONS = 'setLocations',
  ADD_NEW_LOCATION = 'addNewLocation',
  EDIT_LOCATION = 'editLocation',
  DELETE_LOCATION = 'deleteLocation',
}

type LocationAction =
  | { type: LocationActionTypes.SET_LOCATIONS; payload: Location[] }
  | { type: LocationActionTypes.ADD_NEW_LOCATION; payload: Location }
  | { type: LocationActionTypes.EDIT_LOCATION; payload: Location }
  | { type: LocationActionTypes.DELETE_LOCATION; payload: string };

export const locationInitialState: LocationState = {
  locations: [],
  loading: false,
  error: null,
};

export const locationsReducer = (state: LocationState, action: LocationAction): LocationState => {
  switch (action.type) {
    case LocationActionTypes.SET_LOCATIONS:
      return { 
        ...state, 
        locations: action.payload,
        loading: false,
        error: null 
      };

    case LocationActionTypes.ADD_NEW_LOCATION:
      return { 
        ...state, 
        locations: [...state.locations, action.payload],
        loading: false,
        error: null 
      };

    case LocationActionTypes.EDIT_LOCATION:
      return {
        ...state,
        locations: state.locations.map(location =>
          location._id === action.payload._id ? action.payload : location
        ),
        loading: false,
        error: null
      };

    case LocationActionTypes.DELETE_LOCATION:
      return {
        ...state,
        locations: state.locations.filter(location => location._id !== action.payload),
        loading: false,
        error: null
      };

    default:
      return state;
  }
};