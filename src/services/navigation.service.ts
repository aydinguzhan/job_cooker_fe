import { userInfo } from "../lib/auth";
import apiClient from "../lib/axios";

export async function getNavigation(){
    const userId = userInfo().userId
    const navigations = await apiClient.get(`/navigation/${userId}`)
    return navigations.data
}