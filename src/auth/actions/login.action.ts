import { tesloApi } from "@/api/tesloApi"
import type { AuthResponse } from "@/types/auth.response";


export const loginAction = async (email: string, password: string): Promise<AuthResponse> => {

    try {
        const { data } = await tesloApi.post<AuthResponse>('/auth/login', {
            email,
            password
        })

        console.log({ data })

        return data;

    } catch (error) {
        console.log({ error });
        throw error;
    }

}