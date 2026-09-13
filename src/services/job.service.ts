import apiClient from "../lib/axios";
import type { IJobPayload } from "./types";

export const getAllJobs = async (currentPage: string | number) => {
    const { data } = await apiClient.get(
        `/jobs/search?page=${currentPage}&size=10`,
    );
    return data.data
};

export const createJob = async (payload: IJobPayload) => {
    const formatedPayload = {
        ...payload,
        company_id: payload.company_id[0].id
    }
    const data = await apiClient.post("/jobs/create", formatedPayload);
    console.log(data)

}

export const searchJobAndCompany = async (searchKey: string, size: number) => {
    const searchKeyFormat = searchKey ? searchKey.toUpperCase() : "";
    const sizeFortmat = size ? size : 10
    const data = await apiClient.get(`/jobs/filter?search=${searchKeyFormat}&size=${sizeFortmat}`)
    return data.data
}