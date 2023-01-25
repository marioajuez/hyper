
 /**
  * remove values duplicate for key specific of object
  * @return list 
  */
  
export const getUniqueListBy = (
   objectArray: any[], key = 'id_document' 
) => {
   objectArray = objectArray.map(item => [item[key], item]);
   return [...new Map(objectArray).values()];
}


/**
 * returns an array of values ​​that are equal 
 * to the values ​​of the entered array list
 * @param list:any[] 
 */

export const filterArrayEqual = (
   list:any[]
): any => {

   return list.reduce( 
       (current:any, next:any) => 
           current.filter( (element:any) => next.includes(element)
   ));
};