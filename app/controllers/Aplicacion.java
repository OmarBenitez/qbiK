package controllers;

import play.*;
import play.mvc.*;

import java.util.*;

import models.*;
import org.apache.commons.codec.digest.DigestUtils;
import org.codehaus.groovy.control.customizers.SecureASTCustomizer;

/**
 *
 * @author Beny
 */
public class Aplicacion extends Controller {

    static String PERFIL_HASH = "asd98ad6r198asd098as09dv0u9";

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

}
