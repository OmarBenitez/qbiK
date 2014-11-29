/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package models;

import com.google.code.morphia.annotations.Entity;
import com.google.code.morphia.annotations.Transient;
import java.util.List;
import play.data.validation.MinSize;
import play.data.validation.Required;
import play.modules.morphia.Model;

/**
 *
 * @author omar
 */
@Entity
public class Permiso extends Model {

    public String clave;

    public String descripcion;

    @Transient
    public Boolean activo;

    /**
     * Constructor para la clase Permiso.
     *
     * @param clave Clave de la Opción a generar.
     * @param descripcion Texto descriptivo de la opción.
     * @param modulo Agrupador del Permiso.
     */
    public Permiso(String clave, String descripcion) {
        this.clave = clave;
        this.descripcion = descripcion;
    }

    /**
     * Método para encontrar los Permisos ligados a un Perfil.
     *
     * @param uuid Llave del Perfil ligado.
     * @return Devuelve una lista con los permisos filtrados por Perfil.
     */
    public static List<Permiso> findPermisosByPerfil(String uuid) {
        Perfil perfil = Perfil.findById(uuid);
        List<Permiso> permisos = Permiso.find("perfil", perfil).asList();
        return permisos;
    }

    public static void fillPermisos() {
        if(Permiso.find().asList().isEmpty()){
            Permiso p = new Permiso("ADMIN", "Acceso a administracion general del sistema");
            p.save();
            p = new Permiso("GENERAL", "Acceso general al sistema");
            p.save();
        }
    }

    /**
     * Método que devuelve la representación de esta clase como cadena de texto.
     *
     * @return La descripción del permiso.
     */
    @Override
    public String toString() {
        return this.descripcion;
    }
}
