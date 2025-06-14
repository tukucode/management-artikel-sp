import { create } from 'zustand'

type ProfileStateStore = {
  id: string
  username: string
  role: string
  setProfile: (profile: { id: string; username: string; role: string }) => void
  clearProfile: () => void
}

export const useProfileStore = create<ProfileStateStore>((set) => ({
  id: '',
  username: '',
  role: '',
  setProfile: (profile) => set(profile),
  clearProfile: () => set({ id: '', username: '', role: '' }),
}))