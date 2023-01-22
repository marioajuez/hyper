
 /**
  * remove values duplicate for key specific of object
  * @return list 
  */
  
export const getUniqueListBy = (objectArray: any[], key = 'id_document' ) => {

   objectArray = objectArray.map(item => [item[key], item]);
   return [...new Map(objectArray).values()];
}