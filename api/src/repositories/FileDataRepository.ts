import { promises as fs } from 'fs';
import path from 'path';
import { Show, Purchase, User } from '../types';
import { IDataRepository } from './IDataRepository';

// Determine data directory path
const DATA_DIR = path.join(process.cwd(), 'data');

/**
 * Implementación del repositorio usando archivos JSON
 * Esta es la implementación actual. Para cambiar a PostgreSQL, crear PostgresDataRepository
 * que implemente IDataRepository
 */
export class FileDataRepository implements IDataRepository {
  private async readFile<T>(filename: string): Promise<T[]> {
    try {
      const filePath = path.join(DATA_DIR, filename);
      const data = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(data) as T[];
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return [];
      }
      throw error;
    }
  }

  private async writeFile<T>(filename: string, data: T[]): Promise<void> {
    const filePath = path.join(DATA_DIR, filename);
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`💾 File written to: ${filePath}`);
  }

  // Shows operations
  async getAllShows(): Promise<Show[]> {
    return this.readFile<Show>('shows.json');
  }

  async getShowById(id: string): Promise<Show | null> {
    const shows = await this.getAllShows();
    return shows.find(show => show.id === id) || null;
  }

  async createShow(show: Show): Promise<Show> {
    const shows = await this.getAllShows();
    shows.push(show);
    await this.writeFile('shows.json', shows);
    return show;
  }

  async updateShow(id: string, updates: Partial<Show>): Promise<Show | null> {
    const shows = await this.getAllShows();
    const index = shows.findIndex(show => show.id === id);
    
    if (index === -1) {
      return null;
    }

    shows[index] = {
      ...shows[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };

    await this.writeFile('shows.json', shows);
    return shows[index];
  }

  async deleteShow(id: string): Promise<boolean> {
    const shows = await this.getAllShows();
    const filteredShows = shows.filter(show => show.id !== id);
    
    if (filteredShows.length === shows.length) {
      return false;
    }

    await this.writeFile('shows.json', filteredShows);
    return true;
  }

  // Purchases operations
  async getAllPurchases(): Promise<Purchase[]> {
    return this.readFile<Purchase>('purchases.json');
  }

  async getPurchaseById(id: string): Promise<Purchase | null> {
    const purchases = await this.getAllPurchases();
    return purchases.find(purchase => purchase.id === id) || null;
  }

  async getPurchasesByUserId(userId: string): Promise<Purchase[]> {
    const purchases = await this.getAllPurchases();
    return purchases.filter(purchase => purchase.user_id === userId);
  }

  async createPurchase(purchase: Purchase): Promise<Purchase> {
    const purchases = await this.getAllPurchases();
    purchases.push(purchase);
    await this.writeFile('purchases.json', purchases);
    console.log('✅ Purchase saved to purchases.json:', {
      id: purchase.id,
      user_id: purchase.user_id,
      show_id: purchase.show_id,
      cantidad: purchase.cantidad,
      ticket_type: purchase.ticket_type,
    });
    return purchase;
  }

  // Users operations
  async getAllUsers(): Promise<User[]> {
    return this.readFile<User>('users.json');
  }

  async getUserById(id: string): Promise<User | null> {
    const users = await this.getAllUsers();
    return users.find(user => user.id === id) || null;
  }

  async createUser(user: User): Promise<User> {
    const users = await this.getAllUsers();
    users.push(user);
    await this.writeFile('users.json', users);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const users = await this.getAllUsers();
    const index = users.findIndex(user => user.id === id);
    
    if (index === -1) {
      return null;
    }

    users[index] = {
      ...users[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };

    await this.writeFile('users.json', users);
    return users[index];
  }
}

