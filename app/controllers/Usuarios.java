
package controllers;

import models.Usuario;
import org.apache.commons.codec.digest.DigestUtils;




/**
 *
 * @author omar
 */
public class Usuarios extends CRUD{

    public static void create(String email, String password){
        
        Usuario usuario = new Usuario(email, DigestUtils.md5Hex(password));
        usuario.validateAndSave();
        
        Security.authenticate(usuario.email, usuario.password);
        
    }
    
}
