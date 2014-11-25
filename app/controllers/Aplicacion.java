package controllers;

import play.*;
import play.mvc.*;

import java.util.*;

import models.*;
import org.codehaus.groovy.control.customizers.SecureASTCustomizer;

/**
 *
 * @author Beny
 */
public class Aplicacion extends Controller {
    static String PERFIL_HASH = "asd98ad6r198asd098as09dv0u9";

    public static void index() {
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
