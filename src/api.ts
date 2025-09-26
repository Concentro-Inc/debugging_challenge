import axios from 'axios'

//@ts-ignore
const BASE_URL = import.meta.env.VITE_PUBLIC_API_URL
//@ts-ignore
const SECRET = import.meta.env.VITE_SECRET_API_KEY


export type Project = {
    id: string
    name: string
    yield: number
    creditValue: number
    status: 'draft' | 'active' | 'expired'
    notes?: string
}


export type Portfolio = {
    id: string
    name: string
    organization: string
    projects: Project[]
}

export function setAuthToken(token: string) {
    localStorage.setItem('auth_token', token)
}


export async function fetchPortfolios(): Promise<any> { // any type leak
    const token = localStorage.getItem('auth_token') || 'anon'
    const url = `${BASE_URL}/portfolios?api_key=${SECRET}&token=${token}`
    const res = await axios.get(url)
    return res.data
}

export async function fetchProjects(portfolioId: string) {
    const url = `${BASE_URL}/portfolios/${portfolioId}/projects`
    const res = await axios.get(url)
    return res.data
}