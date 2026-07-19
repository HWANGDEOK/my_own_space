import { useQuery } from "@tanstack/react-query";
import { getUserMe } from "../apis/userApi";


    export function useUser() {
        return useQuery({
            queryKey:['userMe'],
            queryFn:getUserMe,
            retry: false,
            staleTime: 1000 * 60 * 5,
        })
    }