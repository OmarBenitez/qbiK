package models;

import com.google.code.morphia.annotations.Embedded;
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
public class Comentario extends Model {

    @Reference
    @Required
    public Usuario usuario;

    @Required
    public String contenido;
    
    public Date fechaPublicacion;
    
    public Categoria categoria;
    
    @Reference
    public List<Tag> tags;
    
    @Embedded
    public List<Comentario> comentarios;

    public Comentario(Usuario usuario) {
        this.usuario = usuario;
        this.comentarios = new ArrayList<Comentario>();
        this.fechaPublicacion = new Date();
    }

    public Comentario() {
        this.comentarios = new ArrayList<Comentario>();
        this.fechaPublicacion = new Date();
    }

}
