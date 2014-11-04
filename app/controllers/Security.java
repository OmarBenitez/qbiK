package controllers;

import static controllers.Secure.logout;
import static controllers.Secure.redirectToOriginalURL;
import java.util.Date;
import models.Usuario;
import org.apache.commons.codec.digest.DigestUtils;
import play.libs.Crypto;
import play.mvc.Http;

/**
 *
 * @author omar
 */
public class Security extends Secure.Security {

    static boolean authenticate(String email, String password) {
        Usuario user = Usuario.find("email", email).first();
        if(user == null){
            Usuarios.blank();
        } else {
            if(user.password.equalsIgnoreCase(DigestUtils.md5Hex(password))){
                return true;
            } else {
                flash.error("secure.error", user);
            }
        }
        return false;
    }

}
