"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { isApiRequestError } from "@/src/lib/api-errors"
import {
  createAppointment,
  createExternalRevenue,
  getAppointments,
  getCustomers,
  getDailyRevenue,
  getMonthlyRevenue,
  getServices,
  loginAdmin,
  type Appointment,
  type AdminLoginPayload,
  type CreateAppointmentPayload,
  type CreateExternalRevenuePayload,
  type CustomerSummary,
  type DailyRevenueItem,
  type MonthlyRevenueItem,
  type ServiceItem
} from "@/src/lib/booking-api"

const ADMIN_ACCESS_TOKEN_STORAGE_KEY = "cuthair.admin.accessToken"

function parseMinutes(time: string) {
  const [hour, minute] = time.split(":").map(Number)
  return hour * 60 + minute
}

export function useAdminDashboardController(initialApiUrl: string, initialDate: string, initialYear: string) {
  const [apiUrl, setApiUrl] = useState(initialApiUrl)
  const [adminApiKey, setAdminApiKey] = useState("")
  const [adminUsername, setAdminUsername] = useState("")
  const [adminPassword, setAdminPassword] = useState("")
  const [adminAccessToken, setAdminAccessToken] = useState("")
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [customers, setCustomers] = useState<CustomerSummary[]>([])
  const [services, setServices] = useState<ServiceItem[]>([])
  const [dailyRevenue, setDailyRevenue] = useState<DailyRevenueItem[]>([])
  const [monthlyRevenue, setMonthlyRevenue] = useState<MonthlyRevenueItem[]>([])

  const [revenueFromDate, setRevenueFromDate] = useState(initialDate)
  const [revenueToDate, setRevenueToDate] = useState(initialDate)
  const [revenueYear, setRevenueYear] = useState(initialYear)

  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const [searchText, setSearchText] = useState("")
  const [selectedServiceFilter, setSelectedServiceFilter] = useState("all")
  const [selectedDateFilter, setSelectedDateFilter] = useState(initialDate)

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }
    const savedToken = window.localStorage.getItem(ADMIN_ACCESS_TOKEN_STORAGE_KEY)?.trim() ?? ""
    if (savedToken) {
      setAdminAccessToken(savedToken)
    }
  }, [])

  const filteredAppointments = useMemo(() => {
    const search = searchText.trim().toLowerCase()
    return appointments
      .filter((appointment) => {
        const matchDate = selectedDateFilter ? appointment.date === selectedDateFilter : true
        const matchService = selectedServiceFilter === "all" ? true : appointment.serviceName === selectedServiceFilter
        const matchSearch =
          search.length === 0
            ? true
            : `${appointment.customerName} ${appointment.phoneNumber} ${appointment.serviceName}`.toLowerCase().includes(search)
        return matchDate && matchService && matchSearch
      })
      .sort((a, b) => parseMinutes(a.startTime) - parseMinutes(b.startTime))
  }, [appointments, searchText, selectedDateFilter, selectedServiceFilter])

  const loadDashboard = useCallback(
    async (showMessage = true) => {
      setError("")
      if (showMessage) setMessage("")
      setIsLoading(true)
      try {
        const [nextAppointments, nextCustomers, nextServices, nextDailyRevenue, nextMonthlyRevenue] = await Promise.all([
          getAppointments(apiUrl, { adminApiKey, adminAccessToken }),
          getCustomers(apiUrl, { adminApiKey, adminAccessToken }),
          getServices(apiUrl, { adminApiKey, adminAccessToken }),
          getDailyRevenue(apiUrl, revenueFromDate, revenueToDate, { adminApiKey, adminAccessToken }),
          getMonthlyRevenue(apiUrl, revenueYear, { adminApiKey, adminAccessToken })
        ])
        setAppointments(nextAppointments)
        setCustomers(nextCustomers)
        setServices(nextServices)
        setDailyRevenue(nextDailyRevenue)
        setMonthlyRevenue(nextMonthlyRevenue)
        if (showMessage) setMessage("Da dong bo du lieu moi nhat")
      } catch (loadError) {
        if (isApiRequestError(loadError) && loadError.code === "UNAUTHORIZED" && adminAccessToken) {
          setAdminAccessToken("")
          if (typeof window !== "undefined") {
            window.localStorage.removeItem(ADMIN_ACCESS_TOKEN_STORAGE_KEY)
          }
          setError("Phien dang nhap da het han. Vui long dang nhap lai.")
          return
        }
        const text = loadError instanceof Error ? loadError.message : "Khong the tai du lieu"
        setError(text)
      } finally {
        setIsLoading(false)
      }
    },
    [apiUrl, adminApiKey, adminAccessToken, revenueFromDate, revenueToDate, revenueYear]
  )

  const refreshRevenue = useCallback(async () => {
    setError("")
    setMessage("")
    setIsLoading(true)
    try {
      const [nextDaily, nextMonthly] = await Promise.all([
        getDailyRevenue(apiUrl, revenueFromDate, revenueToDate, { adminApiKey, adminAccessToken }),
        getMonthlyRevenue(apiUrl, revenueYear, { adminApiKey, adminAccessToken })
      ])
      setDailyRevenue(nextDaily)
      setMonthlyRevenue(nextMonthly)
      setMessage("Da cap nhat bang doanh thu")
    } catch (loadError) {
      const text = loadError instanceof Error ? loadError.message : "Khong the tai doanh thu"
      setError(text)
    } finally {
      setIsLoading(false)
    }
  }, [apiUrl, adminApiKey, adminAccessToken, revenueFromDate, revenueToDate, revenueYear])

  const submitAppointment = useCallback(
    async (payload: CreateAppointmentPayload) => {
      setError("")
      setMessage("")
      setIsLoading(true)
      try {
        await createAppointment(apiUrl, payload, { adminApiKey, adminAccessToken })
        setMessage("Tao lich hen thanh cong")
        await loadDashboard(false)
      } catch (submitError) {
        const text = submitError instanceof Error ? submitError.message : "Khong the tao lich hen"
        setError(text)
      } finally {
        setIsLoading(false)
      }
    },
    [apiUrl, adminApiKey, adminAccessToken, loadDashboard]
  )

  const submitExternalRevenue = useCallback(
    async (payload: CreateExternalRevenuePayload) => {
      setError("")
      setMessage("")
      setIsLoading(true)
      try {
        await createExternalRevenue(apiUrl, payload, { adminApiKey, adminAccessToken })
        setMessage("Da ghi nhan doanh thu don ngoai")
        await loadDashboard(false)
      } catch (submitError) {
        const text = submitError instanceof Error ? submitError.message : "Khong the ghi nhan don ngoai"
        setError(text)
      } finally {
        setIsLoading(false)
      }
    },
    [apiUrl, adminApiKey, adminAccessToken, loadDashboard]
  )

  const loginAsAdmin = useCallback(
    async (credentials: AdminLoginPayload) => {
      setError("")
      setMessage("")
      setIsLoading(true)
      try {
        const session = await loginAdmin(apiUrl, credentials)
        setAdminAccessToken(session.accessToken)
        if (typeof window !== "undefined") {
          window.localStorage.setItem(ADMIN_ACCESS_TOKEN_STORAGE_KEY, session.accessToken)
        }
        setAdminPassword("")
        setMessage("Dang nhap admin thanh cong")
      } catch (loginError) {
        const text = loginError instanceof Error ? loginError.message : "Dang nhap admin that bai"
        setError(text)
      } finally {
        setIsLoading(false)
      }
    },
    [apiUrl]
  )

  const logoutAdmin = useCallback(() => {
    setAdminAccessToken("")
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(ADMIN_ACCESS_TOKEN_STORAGE_KEY)
    }
    setMessage("Da dang xuat admin")
  }, [])

  return {
    apiUrl,
    setApiUrl,
    adminApiKey,
    setAdminApiKey,
    adminUsername,
    setAdminUsername,
    adminPassword,
    setAdminPassword,
    adminAccessToken,
    setAdminAccessToken,
    isLoading,
    message,
    error,
    appointments,
    customers,
    services,
    dailyRevenue,
    monthlyRevenue,
    revenueFromDate,
    setRevenueFromDate,
    revenueToDate,
    setRevenueToDate,
    revenueYear,
    setRevenueYear,
    searchText,
    setSearchText,
    selectedServiceFilter,
    setSelectedServiceFilter,
    selectedDateFilter,
    setSelectedDateFilter,
    filteredAppointments,
    loadDashboard,
    refreshRevenue,
    submitAppointment,
    submitExternalRevenue,
    loginAsAdmin,
    logoutAdmin,
    isAdminLoggedIn: adminAccessToken.length > 0
  }
}
