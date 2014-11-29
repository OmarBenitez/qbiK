package controllers;

import com.google.gson.Gson;
import play.*;
import play.mvc.*;

import java.util.*;

import models.*;
import org.apache.commons.codec.digest.DigestUtils;
import org.codehaus.groovy.control.customizers.SecureASTCustomizer;
import org.json.JSONException;
import org.json.JSONObject;

/**
 *
 * @author Beny
 */
public class Aplicacion extends Controller {

    static String PERFIL_HASH = "asd98ad6r198asd098as09dv0u9";

    public static void getIo() {
        redirect("http://localhost:1337/socket.io/socket.io.js");
    }

    public static void index() {
        if (Estado.count() == 0) {
            Estado.fillEstados();
        }
        if (Municipio.count() == 0) {
            Municipio.fillMunicipios();
        }
        if (Permiso.count() == 0) {
            Permiso.fillPermisos();
        }
        if (Perfil.count() == 0) {
            Perfil.fillPerfiles();
        }
        if (Usuario.count() == 0) {
            Municipio ciudad = Municipio.find("byNombre", "Chihuahua").first();
            Perfil perfil = Perfil.find("byClave", "ADMIN").first();

            Usuario admin1 = new Usuario("omar", "omar@correo.com", DigestUtils.md5Hex("123"));
            admin1.ciudad = ciudad;
            admin1.perfil = perfil;
            admin1.validateAndSave();

            Usuario admin2 = new Usuario("taco", "taco@correo.com", DigestUtils.md5Hex("123"));
            admin2.ciudad = ciudad;
            admin2.perfil = perfil;
            admin2.validateAndSave();

            Usuario admin3 = new Usuario("ingrid", "ingrid@correo.com", DigestUtils.md5Hex("123"));
            admin3.ciudad = ciudad;
            admin3.perfil = perfil;
            admin3.validateAndSave();

            Usuario admin4 = new Usuario("oscar", "oscar@correo.com", DigestUtils.md5Hex("123"));
            admin4.ciudad = ciudad;
            admin4.perfil = perfil;
            admin4.validateAndSave();
        }
        render();
    }

    public static void login() {
        render();
    }

    public static void registro() {
        render();
    }

    public static void estadosJson() {
        List<Estado> estados = Estado.q().order("nombre").asList();
        renderJSON(Estado.toJsonListSerializer().serialize(estados));
    }

    public static void municipiosJson(String id) {
        List<Municipio> municipios = Municipio.find(
                "estado",
                Estado.findById(id))
                .order("nombre").asList();
        renderJSON(Municipio.toJsonListSerializer().serialize(municipios));
    }

    public static void authAndroid() {

        Usuario foo = new Usuario();

        foo.email = params.get("email");

        foo.password = params.get("password");

        foo = Usuario.find("email, password", foo.email, DigestUtils.md5Hex(foo.password)).first();

        renderJSON(Usuario.toJsonListSerializer().serialize(foo));

    }

    public static void registrarAndroid() {

        Usuario foo = new Usuario();

        foo.nombre = params.get("nombre");

        foo.email = params.get("email");

        foo.password = DigestUtils.md5Hex(params.get("password"));

        System.out.println("asDFSADFASDF");
        System.out.println(foo.nombre);
        System.out.println(foo.email);
        System.out.println(foo.password);

        foo.ciudad = Municipio.find("clave", "180").first();

        if (foo.validateAndSave()) {
            renderJSON(Usuario.toJsonListSerializer().serialize(foo));
        } else {
            renderJSON(Usuario.toJsonListSerializer().serialize(null));
        }

    }

    public static void createPublicacionAndroid() throws Exception {

        Publicacion object = new Publicacion();

        String titulo = params.get("titulo");
        String banner = params.get("banner");
        String contenido = params.get("contenido");

        Usuario u = Usuario.findById(params.get("usuario"));

        object.usuario = u;
        object.municipio = u.ciudad;
        object.contenido = contenido;
        object.hashtags = Publicacion.getHashtagsFromContent(object);
        object.titulo = titulo;
        object.banner = banner;

        System.out.println(object.hashtags);

        if (object.validateAndSave()) {
            renderJSON(Publicacion.toJsonListSerializer().serialize(object));
        }
    }

}
