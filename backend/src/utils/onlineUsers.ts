const online = new Map<string, number>()

export const addSocket = (userId: string) => {
  const count = (online.get(userId) || 0) + 1
  online.set(userId, count)
  return count
}

export const removeSocket = (userId: string) => {
  const count = (online.get(userId) || 1) - 1
  if (count > 0) online.set(userId, count)
  else online.delete(userId)
  return count
}

export const isOnline = (userId: unknown) => (online.get(String(userId)) || 0) > 0

export const getOnlineUserIds = () => [...online.keys()]
