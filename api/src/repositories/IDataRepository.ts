import { Show, Purchase, User } from '../types';

/**
 * Interface para el repositorio de datos
 * Permite cambiar fácilmente entre diferentes implementaciones (JSON, PostgreSQL, MongoDB, etc.)
 */
export interface IDataRepository {
  // Shows operations
  getAllShows(): Promise<Show[]>;
  getShowById(id: string): Promise<Show | null>;
  createShow(show: Show): Promise<Show>;
  updateShow(id: string, updates: Partial<Show>): Promise<Show | null>;
  deleteShow(id: string): Promise<boolean>;

  // Purchases operations
  getAllPurchases(): Promise<Purchase[]>;
  getPurchaseById(id: string): Promise<Purchase | null>;
  getPurchasesByUserId(userId: string): Promise<Purchase[]>;
  createPurchase(purchase: Purchase): Promise<Purchase>;

  // Users operations
  getAllUsers(): Promise<User[]>;
  getUserById(id: string): Promise<User | null>;
  createUser(user: User): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | null>;
}

