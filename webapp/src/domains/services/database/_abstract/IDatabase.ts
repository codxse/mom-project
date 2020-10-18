

export interface IDatabase {

  queryDoc(docPath: string): any;
  setDoc(collPath: string, data: {[key: string]: any}): any;
  getCollection(collPath: string): any;
}
