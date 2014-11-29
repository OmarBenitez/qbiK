package controllers;

import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;
import models.Municipio;
import models.Usuario;
import org.apache.commons.codec.digest.DigestUtils;
import org.codehaus.groovy.control.customizers.SecureASTCustomizer;
import org.json.JSONException;
import org.json.JSONObject;
import play.modules.morphia.Model;
import play.mvc.With;

/**
 *
 * @author omar
 */
public class Usuarios extends CRUD {

    public static void create() throws JSONException {

        Map<String, String[]> values = params.getRootParamNode().originalParams;

        String nombre = values.get("nombre")[0];
        String email = values.get("email")[0];
        String password = values.get("password")[0];
        String uuid = values.get("ciudad")[0];

        Municipio ciudad = Municipio.findById(uuid);

        Usuario u = Usuario.find("email", email).first();

        if (u != null) {
            try {
                Secure.login();
            } catch (Throwable ex) {
                Logger.getLogger(Usuarios.class.getName()).log(Level.SEVERE, null, ex);
            }
        } else {
            Usuario usuario = new Usuario(nombre, email, DigestUtils.md5Hex(password));
            usuario.ciudad = ciudad;
            usuario.validateAndSave();
            try {
                Secure.authenticate(usuario.email, password, true);
                Aplicacion.index();
            } catch (Throwable ex) {
                Logger.getLogger(Usuarios.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }

    public static void blank() {

        Usuario object = new Usuario();

        render(object);

    }

    public static void getUsuario(String id) {

        Usuario usuario = Usuario.findById(id);
        System.out.println("usuario: " + usuario);

        renderJSON(Usuario.toJsonListSerializer().include("*.permisos").serialize(usuario));

    }

    public static void actual() {
        Usuario u = Security.getUser();
        renderJSON(Usuario.toJsonListSerializer().include("*.permisos").serialize(u));
    }

}
