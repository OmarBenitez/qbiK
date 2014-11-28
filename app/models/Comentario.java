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
public class Comentario extends BaseModel {

    @Reference
    @Required
    public Usuario usuario;

    @Required
    public String contenido;
    
    public Date fechaPublicacion;
    
//    public Categoria categoria;
    
    @Embedded
    public List<Comentario> comentarios;

    public Comentario(Usuario usuario, String contenido) {
        this.usuario = usuario;
        this.contenido = contenido;
        this.fechaPublicacion = new Date();
        this.comentarios = new ArrayList<Comentario>();
    }

    public Comentario() {
        this.comentarios = new ArrayList<Comentario>();
        this.fechaPublicacion = new Date();
    }

}
