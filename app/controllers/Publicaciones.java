package controllers;

import com.google.gson.Gson;
import models.Publicacion;
import play.mvc.With;

/**
 *
 * @author omar
 */
@CRUD.For(Publicacion.class)
public class Publicaciones extends CRUD {

    public static void create() throws Exception {
        Gson g = new Gson();
        Publicacion object = g.fromJson(params.get("body"), Publicacion.class);
//        object.titulo = params.get("object.titulo");
//        object.contenido = params.get("object.contenido");
//        object.banner = params.get("object.banner");

        object.validateAndSave();

        renderJSON(Publicacion.toJsonListSerializer().serialize(object));
    }

    public static void show(String id) {

        System.out.println(id);
        Publicacion p = Publicacion.findById(id);

        renderJSON(Publicacion.toJsonListSerializer().serialize(p));

    }

}
