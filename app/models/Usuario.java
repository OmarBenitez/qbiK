package models;

import com.google.code.morphia.annotations.Entity;
import controllers.Security;
import java.util.List;

/**
 *
 * @author omar
 */
@Entity
public class Usuario extends BaseModel {

    public String email;

    public String nombre;

    public String password;

    public Usuario(String nombre, String email, String password) {
        this.nombre = nombre;
        this.email = email;
        this.password = password;
    }

    public Usuario() {

    }

    public List<Publicacion> getPublicaciones() {
        return Publicacion.getPublicacionesByUsuario(this.getIdAsStr());
    }

    public static Usuario connected() {
        return Security.getUser();
    }

}
