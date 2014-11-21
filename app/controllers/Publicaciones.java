package controllers;

import models.Publicacion;

/**
 *
 * @author omar
 */
@CRUD.For(Publicacion.class)
public class Publicaciones extends CRUD {

    public static void create() throws Exception {
        Publicacion object = new Publicacion();
        object.titulo = params.get("object.titulo");
        object.contenido = params.get("object.contenido");
        object.banner = params.get("object.banner");
        
        object.validateAndSave();
        
        renderJSON(object);
    }

}
