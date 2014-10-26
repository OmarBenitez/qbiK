package controllers;

import play.*;
import play.mvc.*;

import java.util.*;

import models.*;

/**
 * 
 * @author Beny
 */
public class Aplicacion extends Controller {

    public static void index() {
        Estado.fillEstados();
        Municipio.fillMunicipios();
        List<Publicacion> publicaciones = Publicacion.getBest();
        render(publicaciones);
    }

    public static void login(){
        render();
    }

    public static void registro() {
        render();
    }
    
}
