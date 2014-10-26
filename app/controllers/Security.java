package controllers;

import models.Usuario;
import org.apache.commons.codec.digest.DigestUtils;
import play.mvc.Controller;
import play.mvc.Http.Cookie;

/**
 *
 * @author omar
 */
public class Security extends Controller {

    public static void authenticate(String email, String password) {

        Usuario u = Usuario.find("email", email).first();

        if (u == null) {
            Aplicacion.registro();
        } else if (u.password.equals(DigestUtils.md5Hex(password))) {
            Cookie cookieEmail = new Cookie();
            Cookie cookiePwd = new Cookie();
            cookieEmail.name = "email";
            cookiePwd.name = "Pwd";
            cookieEmail.value = u.email;
            cookiePwd.value = u.password;
            cookieEmail.maxAge = 30000;
            cookiePwd.maxAge = 30000;
            request.cookies.put(cookieEmail.name, cookieEmail);
            request.cookies.put(cookiePwd.name, cookiePwd);
        } else {
            
        }
    }

    public static void authenticate(Usuario u) {

        Cookie cookieEmail = new Cookie();
        Cookie cookiePwd = new Cookie();
        cookieEmail.name = "email";
        cookiePwd.name = "Pwd";
        cookieEmail.value = u.email;
        cookiePwd.value = u.password;
        cookieEmail.maxAge = 30000;
        cookiePwd.maxAge = 30000;
        request.cookies.put(cookieEmail.name, cookieEmail);
        request.cookies.put(cookiePwd.name, cookiePwd);

    }

}
