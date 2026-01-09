import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Show, CartItem, TicketType } from '../../types';
import { TICKET_PRICES } from '../../types';

interface CartState {
  items: CartItem[];
  addToCart: (show: Show, ticketType: TicketType, quantity: number) => void;
  removeFromCart: (showId: string, ticketType: TicketType) => void;
  updateQuantity: (showId: string, ticketType: TicketType, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getItemByShowId: (showId: string) => CartItem | undefined;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (show: Show, ticketType: TicketType, quantity: number) => {
        set((state) => {
          const existingItem = state.items.find((item) => item.showId === show.id);

          if (existingItem) {
            // Si el show ya está en el carrito, actualizar o agregar el tipo de ticket
            const existingTicketIndex = existingItem.tickets.findIndex(
              (t) => t.type === ticketType
            );

            if (existingTicketIndex >= 0) {
              // Si el tipo de ticket ya existe, actualizar la cantidad
              const updatedTickets = [...existingItem.tickets];
              updatedTickets[existingTicketIndex].quantity += quantity;
              return {
                items: state.items.map((item) =>
                  item.showId === show.id
                    ? { ...item, tickets: updatedTickets }
                    : item
                ),
              };
            } else {
              // Si el tipo de ticket no existe, agregarlo
              return {
                items: state.items.map((item) =>
                  item.showId === show.id
                    ? {
                        ...item,
                        tickets: [...item.tickets, { type: ticketType, quantity }],
                      }
                    : item
                ),
              };
            }
          } else {
            // Si el show no está en el carrito, agregarlo
            return {
              items: [
                ...state.items,
                {
                  showId: show.id,
                  show,
                  tickets: [{ type: ticketType, quantity }],
                },
              ],
            };
          }
        });
      },

      removeFromCart: (showId: string, ticketType: TicketType) => {
        set((state) => {
          const item = state.items.find((item) => item.showId === showId);
          if (!item) return state;

          const updatedTickets = item.tickets.filter((t) => t.type !== ticketType);

          if (updatedTickets.length === 0) {
            // Si no quedan tickets, eliminar el item completo
            return {
              items: state.items.filter((item) => item.showId !== showId),
            };
          } else {
            // Si quedan tickets, actualizar el item
            return {
              items: state.items.map((item) =>
                item.showId === showId
                  ? { ...item, tickets: updatedTickets }
                  : item
              ),
            };
          }
        });
      },

      updateQuantity: (showId: string, ticketType: TicketType, quantity: number) => {
        if (quantity <= 0) {
          get().removeFromCart(showId, ticketType);
          return;
        }

        set((state) => ({
          items: state.items.map((item) => {
            if (item.showId === showId) {
              const updatedTickets = item.tickets.map((t) =>
                t.type === ticketType ? { ...t, quantity } : t
              );
              return { ...item, tickets: updatedTickets };
            }
            return item;
          }),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => {
          return total + item.tickets.reduce((sum, ticket) => sum + ticket.quantity, 0);
        }, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => {
          return (
            total +
            item.tickets.reduce((sum, ticket) => {
              return sum + TICKET_PRICES[ticket.type].price * ticket.quantity;
            }, 0)
          );
        }, 0);
      },

      getItemByShowId: (showId: string) => {
        return get().items.find((item) => item.showId === showId);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);

