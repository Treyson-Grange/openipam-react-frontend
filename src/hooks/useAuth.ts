
import { useApiData } from "./useApi";
import { getApiEndpointFunctions } from "../utilities/apiFunctions";

const useAuth = () => {
    const api = getApiEndpointFunctions();
    const { data: results } = useApiData(api.auth.me);
    return { results };
};

export default useAuth;
