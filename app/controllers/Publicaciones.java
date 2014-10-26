package controllers;

import java.util.List;
import models.Municipio;
import models.Publicacion;
import play.mvc.With;

/**
 *
 * @author omar
 */
public class Publicaciones extends CRUD {

    public static void list(String id) {

        Municipio municipio = Municipio.find("clave", id).first();
        
        List<Publicacion> objects = Publicacion.find("municipio", municipio).asList();
        
        render(objects);

    }

}
