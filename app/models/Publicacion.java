package models;

import com.google.code.morphia.annotations.Embedded;
import com.google.code.morphia.annotations.Entity;
import com.google.code.morphia.annotations.Reference;
import java.util.ArrayList;
import java.util.Date;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
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

    public List<String> hashtags;

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

    public static List<String> getHashtagsFromContent(Publicacion pub) {
        List<String> hts = new ArrayList<>();
        System.out.println("Gotta find them all");
        if (pub != null && pub.contenido != null && pub.contenido.length() > 0) {
            Pattern p = Pattern.compile("\\#[a-z0-9]+");
            Matcher m = p.matcher(pub.contenido);
            while (m.find()) {
                System.out.println(m.group());
                if (m.group().length() >= 2) {
                    hts.add(m.group().substring(1));
                }
            }
        }
        return hts;
    }
    
    public static List<Publicacion> getPublicacionesByQuery(String query) {
        MorphiaQuery q = Publicacion.q();
        q.or(
                q.criteria("titulo").containsIgnoreCase(query),
                q.criteria("hashtags").containsIgnoreCase(query),
                q.criteria("contenido").containsIgnoreCase(query)
        );
        List<Publicacion> pubs = q.asList();
        Set<Publicacion> set = new LinkedHashSet<>(pubs);
        pubs.clear();
        pubs.addAll(set);
        return pubs;
    }
    
    public static List<Publicacion> getPublicacionesByTag(String tag) {
        List<Publicacion> pubs = Publicacion.find("hashtags", tag).asList();
        Set<Publicacion> set = new LinkedHashSet<>(pubs);
        pubs.clear();
        pubs.addAll(set);
        return pubs;
    }

}
