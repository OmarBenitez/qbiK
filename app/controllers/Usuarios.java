
package controllers;

import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;
import models.Usuario;
import org.apache.commons.codec.digest.DigestUtils;
import org.codehaus.groovy.control.customizers.SecureASTCustomizer;
import org.json.JSONException;
import org.json.JSONObject;






/**
 *
 * @author omar
 */
public class Usuarios extends CRUD{

    public static void create() throws JSONException{
        
        Map<String, String[]> values = params.getRootParamNode().originalParams;
        
        String nombre = values.get("nombre")[0];
        String email = values.get("email")[0];
        String password = values.get("password")[0];
        
        Usuario u = Usuario.find("email", email).first();
        
        if(u != null){
            try {
                Secure.login();
            } catch (Throwable ex) {
                Logger.getLogger(Usuarios.class.getName()).log(Level.SEVERE, null, ex);
            }
        } else {
            Usuario usuario = new Usuario(nombre, email, DigestUtils.md5Hex(password));
            usuario.validateAndSave();
            try {
                Secure.authenticate(usuario.email, password, true);
                Aplicacion.index();
            } catch (Throwable ex) {
                Logger.getLogger(Usuarios.class.getName()).log(Level.SEVERE, null, ex);
            }
        }        
    }
    
    public static void blank(){
        
        Usuario object = new Usuario();
        
        render(object);
        
    }
        
}
