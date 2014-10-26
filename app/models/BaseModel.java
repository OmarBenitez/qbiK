package models;

import com.google.code.morphia.annotations.Entity;
import flexjson.JSONSerializer;
import play.modules.morphia.Model;

/**
 *
 * @author omar
 */
@Entity
public class BaseModel extends Model {

    public static JSONSerializer toJsonListSerializer() {
        JSONSerializer ser = new JSONSerializer();
        ser.exclude("*.class");
        ser.exclude("*.persistent");
        ser.exclude("*.entityId");
        ser.exclude("*.machine");
        ser.exclude("*.time");
        ser.exclude("*._created");
        ser.exclude("*._id");
        ser.exclude("*._modified");
        ser.exclude("*.manual");
        ser.exclude("*.blobChanged");
        ser.exclude("*.inc");
        ser.exclude("*.id_");
        ser.exclude("*.id");
        ser.exclude("*.embedded_");
        ser.exclude("*.new");
        ser.exclude("*.userDefinedId_");
        ser.exclude("*.claveCompleta");
        return ser;
    }

}
