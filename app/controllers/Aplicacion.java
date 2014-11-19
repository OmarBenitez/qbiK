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
@With(Secure.class)
public class Aplicacion extends Controller {

    public static void index() {
        render();
    }

    public static void login(){
        render();
    }

    public static void registro() {
        render();
    }
    
}
