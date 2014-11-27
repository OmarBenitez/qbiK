package models;

import com.google.code.morphia.annotations.Embedded;
import com.google.code.morphia.annotations.Entity;
import com.google.code.morphia.annotations.Reference;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import play.data.validation.Required;
import play.modules.morphia.Blob;
import play.modules.morphia.Model;

/**
 *
 * @author Beny
 */
@Entity
public class Publicacion extends BaseModel {

    @Required
    public String titulo;

    @Required
    public String banner;

    @Required
    public String contenido;

    public Date fechaPublicacion;

    @Reference
    public Usuario usuario;

    @Embedded
    public List<Comentario> comentarios;

    @Reference
    public Municipio municipio;

    public Integer rating;

    public Integer totalRating;

    @Embedded
    public List<Usuario> rated;

    public Publicacion(String titulo, String contenido, Usuario usuario) {
        this.titulo = titulo;
        this.contenido = contenido;
        this.fechaPublicacion = new Date();
        this.usuario = usuario;
        this.comentarios = new ArrayList<Comentario>();
        //this.ranking = new Ranking();
        this.rating = 5;
        this.totalRating = 5;
        this.rated = new ArrayList<Usuario>();
    }

    public Publicacion() {
        this.fechaPublicacion = new Date();
        this.comentarios = new ArrayList<Comentario>();
        this.rating = 5;
        this.totalRating = 5;
        this.rated = new ArrayList<Usuario>();
    }

    public static List<Publicacion> getPublicacionesByUsuario(String id) {
        return Publicacion.find("usuario", Usuario.findById(id)).asList();
    }

    public static List<Publicacion> getBest() {
        return Publicacion.find().order("ranking").asList();
    }

    public void rate(Integer i, String uid) {
        this.totalRating += i;
        Usuario u = Usuario.findById(uid);
        if (!this.rated.contains(u)) {
            this.rated.add(u);
            this.rating = Math.round(this.totalRating / (this.rated.size() + 1));
            this.save();
        }
    }

}
