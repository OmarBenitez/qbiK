package controllers;

import models.Perfil;
import models.Permiso;
import models.Usuario;
import org.apache.commons.codec.digest.DigestUtils;

/**
 *
 * @author omar
 */
public class Security extends Secure.Security {

    static boolean authenticate(String email, String password) {
        Usuario user = Usuario.find("email", email).first();
        if(user == null){
            redirect("/secure/login#/registro");
        } else {
            if(user.password.equalsIgnoreCase(DigestUtils.md5Hex(password))){
                return true;
            } else {
                flash.error("secure.error", user);
            }
        }
        return false;
    }
    
    public static Usuario getUser(){
        Usuario user = Usuario.find("email", 
                Secure.Security.session.get("username")).first();
        return user;
    }
    
    public static boolean check(String profile) {
        try{
            Usuario usuario = Usuario.findById(session.get(Aplicacion.PERFIL_HASH));
            Perfil perfil = usuario.perfil;
            Permiso permiso = Permiso.find("clave", profile).first();
            return perfil.tieneDerecho(permiso);
        }catch(Exception ex){
            return false;
        }
    }

}
