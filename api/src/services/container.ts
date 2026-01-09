import { IDataRepository } from '../repositories/IDataRepository';
import { FileDataRepository } from '../repositories/FileDataRepository';

/**
 * Dependency Injection Container
 * Centraliza la creación y gestión de dependencias
 * Para cambiar de JSON a PostgreSQL, solo necesitas cambiar aquí:
 * 
 * Ejemplo futuro con PostgreSQL:
 * import { PostgresDataRepository } from '../repositories/PostgresDataRepository';
 * const dataRepository: IDataRepository = new PostgresDataRepository();
 */
class Container {
  private _dataRepository: IDataRepository;

  constructor() {
    // Cambiar esta línea para usar otro repositorio (PostgreSQL, MongoDB, etc.)
    this._dataRepository = new FileDataRepository();
  }

  get dataRepository(): IDataRepository {
    return this._dataRepository;
  }
}

// Singleton instance
const container = new Container();

export default container;

