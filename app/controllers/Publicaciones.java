package controllers;

import com.google.gson.Gson;
import java.util.List;
import models.Publicacion;
import models.Usuario;
import org.json.JSONObject;
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
        JSONObject values = new JSONObject(params.get("body"));

        Usuario u = Usuario.findById(values.getString("user"));

        object.usuario = u;
        object.municipio = u.ciudad;
        object.hashtags = Publicacion.getHashtagsFromContent(object);
        
        System.out.println(object.hashtags);

        object.validateAndSave();
        
        
        

        renderJSON(Publicacion.toJsonListSerializer().serialize(object));
    }

    public static void show(String id) {
        Publicacion p = Publicacion.findById(id);
        
        System.out.println("p.hashtags: " + p.hashtags);
        System.out.println("Publicacion.getHashtagsFromContent(p): " + Publicacion.getHashtagsFromContent(p));

        renderJSON(Publicacion.toJsonListSerializer().serialize(p));

    }

    public static void list() {

        List<Publicacion> pubs = Publicacion.find().asList();

        renderJSON(Publicacion.toJsonListSerializer().serialize(pubs));

    }

    public static void rate(String id, Integer rate, String userId) {

        Publicacion p = Publicacion.findById(id);
        p.rate(rate, userId);

        renderJSON(Publicacion.toJsonListSerializer().serialize(p));

    }
    
    public static void search(String query) {
//        List<Publicacion> publicaciones = Publicacion
    }

}
