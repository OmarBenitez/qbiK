package controllers;

import com.google.gson.Gson;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import models.Comentario;
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

    public static void update() throws Exception {
        Gson g = new Gson();
        Publicacion object = g.fromJson(params.get("body"), Publicacion.class);
        JSONObject values = new JSONObject(params.get("body"));

        Publicacion p = Publicacion.findById(values.get("publicacionId"));
        if (null != p) {
            p.titulo = object.titulo;
            p.contenido = object.contenido;
            p.banner = object.banner;
            p.hashtags = Publicacion.getHashtagsFromContent(object);
            
            p.validateAndSave();

            renderJSON(Publicacion.toJsonListSerializer().serialize(p));

        }
    }

    public static void show(String id) {
        Publicacion p = Publicacion.findById(id);

        renderJSON(Publicacion.toJsonListSerializer().serialize(p));

    }

    public static void list() {

        List<Publicacion> pubs = Publicacion.find().order("-fechaPublicacion").asList();

        renderJSON(Publicacion.toJsonListSerializer().serialize(pubs));

    }

    public static void rate(String id, Integer rate, String userId) {

        Publicacion p = Publicacion.findById(id);
        p.rate(rate, userId);

        renderJSON(Publicacion.toJsonListSerializer().serialize(p));

    }

    public static void search(String query) {
        List<Publicacion> publicaciones
                = Publicacion.getPublicacionesByQuery(query);
        renderJSON(Publicacion.toJsonListSerializer().serialize(publicaciones));
    }

    public static void tags(String tag) {
        List<Publicacion> publicaciones
                = Publicacion.getPublicacionesByTag(tag);
        renderJSON(Publicacion.toJsonListSerializer().serialize(publicaciones));
    }

    public static void comment() throws Exception {
        Boolean success = Boolean.FALSE;

        Map<String, Object> map = new HashMap<>();

        JSONObject values = new JSONObject(params.get("body"));

        Publicacion publicacion = Publicacion.findById(values.get("publicacionId").toString());
        Usuario usuario = Usuario.findById(values.get("usuarioId").toString());

        if (publicacion != null && usuario != null) {
            Comentario comentario = new Comentario(usuario, values.get("comentario").toString());
            if (comentario.validateAndSave()) {
                publicacion.comentarios.add(comentario);
                success = publicacion.validateAndSave();
                map.put("success", success);
                map.put("publicacionId", publicacion.getIdAsStr());
                map.put("comentario", comentario);

            }
        }
        renderJSON(map);
    }

    public static void delcomment() throws Exception {
        Gson g = new Gson();
        Map<String, Object> map = new HashMap<>();
        Boolean success = Boolean.FALSE;

        JSONObject values = new JSONObject(params.get("body"));

        Publicacion publicacion = Publicacion.findById(values.get("publicacionId").toString());
        Comentario comentario = Comentario.findById(values.get("comentarioId").toString());

        if (publicacion != null && comentario != null) {
            publicacion.comentarios.remove(comentario);
            comentario.delete();

            map.put("success", publicacion.validateAndSave());
            
            map.put("publicacionId", publicacion.getIdAsStr());
            map.put("comentarioId", comentario.getIdAsStr());
        }
        renderJSON(map);
    }

    public static void delpost() throws Exception {
        Gson g = new Gson();
        Map<String, Object> map = new HashMap<>();
        Boolean success = Boolean.FALSE;

        JSONObject values = new JSONObject(params.get("body"));

        Publicacion publicacion = Publicacion.findById(values.get("publicacionId").toString());
        if (publicacion != null) {
            map.put("publicacionId", publicacion.getIdAsStr());
            publicacion.delete();
            map.put("success", true);
        }
        renderJSON(map);
    }

}
