import { databaseService } from "./databaseService.js";

export class BaseService {
  constructor() {
    this.db = databaseService.getPrisma();
  }
}
