
package controllers;

import java.util.List;
import models.Estado;




/**
 *
 * @author omar
 */
public class Estados extends CRUD{

    public static void json(){
        
        List<Estado> estados = Estado.findAll();
        renderJSON(Estado.toJsonListSerializer().serialize(estados));
        
    }
    
    
}
