package models;

import com.google.code.morphia.annotations.Entity;
import java.util.ArrayList;
import java.util.List;
import play.modules.morphia.Model;

/**
 *
 * @author omar
 */
@Entity
public class Perfil extends Model {

    public String clave;

    public String descripcion;

    public List<Permiso> permisos;

    public Perfil(String clave, String descripcion) {
        this.permisos = new ArrayList<>();
        this.clave = clave;
        this.descripcion = descripcion;
    }

    public Perfil() {
        this.permisos = new ArrayList<>();
    }

    public static void fillPerfiles() {
        Perfil p = new Perfil("ADMIN", "Administrador general del sistema");
        p.permisos.add((Permiso) Permiso.find("byClave", "ADMIN").first());
        p.validateAndSave();

        p = new Perfil("USER", "Usuario del sistema");
        p.permisos.add((Permiso) Permiso.find("byClave", "GENERAL").first());
        p.validateAndSave();
    }

    /**
     * Método que verifica si un permiso esta contenido en un perfil.
     *
     * @param permisoToVerify elemento a preguntar si es contenido por el perfil
     * @return TRUE si el permiso esta en la lista que contiene el perfil, FALSE
     * si no lo contiene.
     */
    public Boolean tieneDerecho(Permiso permisoToVerify) {
        Boolean loContiene = Boolean.FALSE;

        for (Permiso permiso : permisos) {
            if (permiso.clave.equals(permisoToVerify.clave)) {
                loContiene = Boolean.TRUE;
                break;
            }
        }
        return loContiene;
    }

    @Override
    public String toString() {
        return this.clave;
    }

}
