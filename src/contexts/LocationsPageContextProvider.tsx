import { createContext, ReactNode, useContext, useEffect, useReducer } from "react"
import { LocationActionTypes, locationInitialState, locationsReducer } from "../reducers/locationsReducer"
import { Location } from "../types/types"
import { API_URL } from "../utils/config";
import axios from "axios";
import { fetchLocations } from "../api/locationApi";

type LocationsPageContextType = {
    locations: Location[];
    addNewLocation: (newLocation: Location) => void;
    editLocation: (updatedLocation: Location) => void;
    deleteLocation: (id: number) => void;
};

const LocationsPageContext = createContext<LocationsPageContextType | undefined>(undefined);

type LocationsPageContextProviderProps = {
    children: ReactNode;
};

export const LocationsPageContextProvider: React.FC<LocationsPageContextProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(locationsReducer, locationInitialState);
    const { locations } = state;

    const deleteLocation = async (id: number) => {
        try {
            await axios.delete(`${API_URL}/customers/${id}`)
            dispatch({ type: LocationActionTypes.DELETE_LOCATION, payload: id.toString() })
    
            const customersData = await fetchLocations();
            dispatch({ type: LocationActionTypes.SET_LOCATIONS, payload: customersData });
        } catch (error) {
            console.error(`Error deleting customer with ID ${id}:`, error);
        }
    };

    const addNewLocation = async (newLocation: Location) => {
        try {
            await axios.post(`${API_URL}/customers`, newLocation);
            dispatch({ type: LocationActionTypes.ADD_NEW_LOCATION, payload: newLocation });
            const customersData = await fetchLocations();
            dispatch({ type: LocationActionTypes.SET_LOCATIONS, payload: customersData });
        } catch (error) {
            console.error('Error adding new customer:', error);
        }
    };

    const editLocation = async (updatedLocation: Location) => {
        try {
            await axios.put(`${API_URL}/customers/${updatedLocation._id}`, updatedLocation);
            dispatch({ type: LocationActionTypes.EDIT_LOCATION, payload: updatedLocation });

            const locationsData = await fetchLocations();
            dispatch({ type: LocationActionTypes.SET_LOCATIONS, payload: locationsData });
        } catch (error) {
            console.error('Error editing customer:', error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const locationsData = await fetchLocations();
                dispatch({ type: LocationActionTypes.SET_LOCATIONS, payload: locationsData });
            } catch (error) {
                console.error('Error fetching locations:', error);
            }
        };

        fetchData();
    }, []);

    const ctxValue: LocationsPageContextType = {
        locations,
        deleteLocation,
        addNewLocation,
        editLocation,
    };

    return (
        <LocationsPageContext.Provider value={ctxValue}>
            {children}
        </LocationsPageContext.Provider>
    );
};


export const useLocations = () => {
    const ctx = useContext(LocationsPageContext);
    if (!ctx) {
        throw new Error('useLocations can only be used within CustomersPageContextProvider');
    }
    return ctx;
};