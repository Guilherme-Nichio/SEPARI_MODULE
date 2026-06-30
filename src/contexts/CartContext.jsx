import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart precisa estar dentro de CartProvider')
  return ctx
}

const STORAGE_KEY = 'separi_cart_v2'

const itemKey = (it) => it.kind === 'kit' ? `k:${it.kit.id}` : `p:${it.part.id}`

export function CartProvider({ children }) {
  const { user } = useAuth()
  const [items, setItems] = useState([])

  useEffect(() => {
    if (!user) { setItems([]); return }
    try {
      const raw = localStorage.getItem(`${STORAGE_KEY}_${user.id}`)
      if (raw) {
        const parsed = JSON.parse(raw)
        const migrated = parsed.map(it => it.kind
          ? it
          : { kind: 'part', part: it.part, quantity: it.quantity, user_machine_id: it.user_machine_id || null })
        setItems(migrated)
      }
    } catch (e) { /* noop */ }
  }, [user])

  useEffect(() => {
    if (!user) return
    try { localStorage.setItem(`${STORAGE_KEY}_${user.id}`, JSON.stringify(items)) } catch (e) { /* noop */ }
  }, [items, user])

  const addPart = (part, quantity = 1, user_machine_id = null) => {
    const key = `p:${part.id}`
    setItems(prev => {
      const existing = prev.find(i => itemKey(i) === key)
      if (existing) return prev.map(i => itemKey(i) === key ? { ...i, quantity: i.quantity + quantity } : i)
      return [...prev, { kind: 'part', part, quantity, user_machine_id }]
    })
  }

  const addKit = (kit, quantity = 1, user_machine_id = null) => {
    const key = `k:${kit.id}`
    setItems(prev => {
      const existing = prev.find(i => itemKey(i) === key)
      if (existing) return prev.map(i => itemKey(i) === key ? { ...i, quantity: i.quantity + quantity } : i)
      return [...prev, { kind: 'kit', kit, quantity, user_machine_id }]
    })
  }

  // alias legado: chamadas antigas addItem(part, qty) viram addPart
  const addItem = (part, quantity = 1, user_machine_id = null) => addPart(part, quantity, user_machine_id)

  const updateQuantity = (key, quantity) => {
    if (quantity <= 0) return removeItem(key)
    setItems(prev => prev.map(i => itemKey(i) === key ? { ...i, quantity } : i))
  }

  const removeItem = (key) => setItems(prev => prev.filter(i => itemKey(i) !== key))
  const clear = () => setItems([])

  const itemCount = items.reduce((s, i) => s + i.quantity, 0)

  return (
    <CartContext.Provider value={{
      items, itemKey, itemCount,
      count: itemCount,
      addPart, addKit, addItem,
      updateQuantity, removeItem, clear
    }}>
      {children}
    </CartContext.Provider>
  )
}
