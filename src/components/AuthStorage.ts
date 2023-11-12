/**
 * Класс для управления данными в локальном хранилище.
 */
class LocalStorageService {
  /**
   * Сохраняет данные в локальное хранилище.
   *
   * @param key - Ключ, по которому данные будут сохранены.
   * @param data - Данные, которые необходимо сохранить.
   */
  static saveData(key: string, data: string): void {
    localStorage.setItem(key, data);
  }

  /**
   * Получает данные из локального хранилища по ключу.
   *
   * @param key - Ключ, по которому необходимо получить данные.
   * @returns Данные, сохраненные по указанному ключу, или null, если данные отсутствуют.
   */
  static getData(key: string): string | null {
    return localStorage.getItem(key);
  }

  /**
   * Удаляет данные из локального хранилища по ключу.
   *
   * @param key - Ключ, по которому следует удалить данные.
   */
  static clearData(key: string): void {
    localStorage.removeItem(key);
  }
}

export default LocalStorageService;
