package models;

import com.google.code.morphia.annotations.Entity;
import com.google.code.morphia.annotations.Reference;
import controllers.Security;
import java.util.List;
import play.data.validation.Required;
import play.modules.morphia.validation.Unique;

/**
 *
 * @author omar
 */
@Entity
public class Usuario extends BaseModel {

    @Unique
    @Required
    public String email;
    
    @Required
    public String nombre;
    
    @Required
    public String password;
    
    @Reference
    public Perfil perfil;
    
    @Reference
    public Municipio ciudad;

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
    
    @Override
    public String toString() {
        return String.format("%s - %s", this.nombre, this.email);
    }

}
