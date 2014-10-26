package models;

import com.google.code.morphia.annotations.Entity;
import java.util.List;
import play.modules.morphia.Model;

/**
 *
 * @author omar
 */
@Entity
public class Usuario extends BaseModel {

    public String email;

    public String password;

    public Usuario(String email, String password) {
        this.email = email;
        this.password = password;
    }

    public List<Publicacion> getPublicaciones() {
        return Publicacion.getPublicacionesByUsuario(this.getIdAsStr());
    }

}
