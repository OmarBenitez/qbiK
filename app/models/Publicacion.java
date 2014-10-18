package models;

import com.google.code.morphia.annotations.Embedded;
import com.google.code.morphia.annotations.Entity;
import com.google.code.morphia.annotations.Reference;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import play.data.validation.Required;
import play.modules.morphia.Model;

/**
 *
 * @author Beny
 */
@Entity
public class Publicacion extends Model {

    @Required
    public String titulo;

    @Required
    public String contenido;

    public Date fechaPublicacion;

    @Reference
    public Usuario usuario;

    @Embedded
    public List<Comentario> comentarios;
    
    @Embedded 
    public Ranking ranking;

    public Publicacion(String titulo, String contenido, Usuario usuario) {
        this.titulo = titulo;
        this.contenido = contenido;
        this.fechaPublicacion = new Date();
        this.usuario = usuario;
        this.comentarios = new ArrayList<Comentario>();
        this.ranking = new Ranking();
    }

    public Publicacion() {
        this.fechaPublicacion = new Date();
        this.comentarios = new ArrayList<Comentario>();
        this.ranking = new Ranking();
    }

    public static List<Publicacion> getPublicacionesByUsuario(String id) {
        return Publicacion.find("usuario", Usuario.findById(id)).asList();
    }

}
