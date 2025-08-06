'use client'

import { create } from 'zustand'

type NavigationState = {
  loading: boolean
  setLoading: (val: boolean) => void
}

export const useNavigationStore = create<NavigationState>((set) => ({
  loading: false,
  setLoading: (val) => set({ loading: val }),
}))