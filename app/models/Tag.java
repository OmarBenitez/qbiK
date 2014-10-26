package models;

import com.google.code.morphia.annotations.Entity;
import play.data.validation.Required;
import play.modules.morphia.Model;

/**
 *
 * @author Beny
 */
@Entity
public class Tag extends BaseModel {

    @Required
    public String nombre;

    public Tag(String nombre) {
        this.nombre = nombre;
    }

}
